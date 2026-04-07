#!/bin/bash

# WordPress.org Plugin Directory Compliance Scanner
#
# Usage: bash check_wporg_compliance.sh /path/to/plugin
#
# Scans a WordPress plugin directory for common violations of
# WordPress.org Plugin Directory Guidelines.
# Does NOT replace reading the actual guidelines — use this as
# a quick automated pre-check.

set -euo pipefail

PLUGIN_DIR="${1:-.}"

if [ ! -d "$PLUGIN_DIR" ]; then
  echo "ERROR: Directory not found: $PLUGIN_DIR"
  exit 1
fi

cd "$PLUGIN_DIR"

PASS=0
WARN=0
FAIL=0
RESULTS_PASS=""
RESULTS_WARN=""
RESULTS_FAIL=""

pass() { PASS=$((PASS+1)); RESULTS_PASS="${RESULTS_PASS}\n  ✅ $1"; }
warn() { WARN=$((WARN+1)); RESULTS_WARN="${RESULTS_WARN}\n  ⚠️  $1"; }
fail() { FAIL=$((FAIL+1)); RESULTS_FAIL="${RESULTS_FAIL}\n  ❌ $1"; }

echo "============================================"
echo "WordPress.org Plugin Compliance Scanner"
echo "Directory: $(pwd)"
echo "Date: $(date +%Y-%m-%d)"
echo "============================================"
echo ""

# --- 1. Find main plugin file ---
MAIN_FILE=""
for f in *.php; do
  if [ -f "$f" ] && head -30 "$f" | grep -q "Plugin Name:"; then
    MAIN_FILE="$f"
    break
  fi
done

if [ -z "$MAIN_FILE" ]; then
  fail "No main plugin file with 'Plugin Name:' header found"
  echo -e "\n$RESULTS_FAIL"
  exit 1
fi

PLUGIN_NAME=$(grep "Plugin Name:" "$MAIN_FILE" | head -1 | sed 's/.*Plugin Name:\s*//' | sed 's/\s*\*\///')
echo "Plugin: $PLUGIN_NAME"
echo "Main file: $MAIN_FILE"
echo ""

# --- 2. License (Guideline 1) ---
if grep -qi "License:.*GPL" "$MAIN_FILE"; then
  pass "GPL-compatible license declared in plugin header"
else
  fail "No GPL license found in plugin header (Guideline 1)"
fi

if [ -f "LICENSE" ] || [ -f "LICENSE.txt" ] || [ -f "license.txt" ]; then
  pass "LICENSE file exists"
else
  warn "No LICENSE file found in root directory"
fi

# --- 3. readme.txt (Guidelines 3, 12, 15) ---
README_FILE=""
[ -f "readme.txt" ] && README_FILE="readme.txt"
[ -f "README.txt" ] && README_FILE="README.txt"
[ -f "README.md" ] && README_FILE="README.md"

if [ -n "$README_FILE" ]; then
  pass "readme file found: $README_FILE"

  if [ "$README_FILE" != "README.md" ]; then
    # Check required fields
    for field in "Stable tag" "Requires at least" "Tested up to" "License"; do
      if grep -qi "$field:" "$README_FILE"; then
        pass "readme: '$field' field present"
      else
        fail "readme: '$field' field missing"
      fi
    done

    # Tag count (max 5)
    if grep -qi "^Tags:" "$README_FILE"; then
      TAG_COUNT=$(grep -i "^Tags:" "$README_FILE" | sed 's/Tags://i;s/,/\n/g' | sed '/^\s*$/d' | wc -l)
      if [ "$TAG_COUNT" -le 5 ]; then
        pass "readme: $TAG_COUNT tags (max 5)"
      else
        fail "readme: $TAG_COUNT tags found, maximum is 5 (Guideline 12)"
      fi
    fi

    # Required sections
    for section in "Description" "Installation" "Changelog"; do
      if grep -qi "== $section ==" "$README_FILE"; then
        pass "readme: == $section == section present"
      else
        fail "readme: == $section == section missing"
      fi
    done
  fi
else
  fail "No readme.txt found (required for WordPress.org)"
fi

# --- 4. Code readability (Guideline 4) ---
OBFUSCATED=$(grep -rlc "eval(\s*base64_decode\|eval(\s*gzinflate\|eval(\s*str_rot13" \
  --include="*.php" . 2>/dev/null | grep -v vendor/ | grep -v node_modules/ || true)

if [ -z "$OBFUSCATED" ]; then
  pass "No obfuscated PHP code detected"
else
  fail "Obfuscated code detected in: $OBFUSCATED (Guideline 4)"
fi

# Check for minified JS without source
MISSING_SRC=0
while IFS= read -r minfile; do
  srcfile="${minfile%.min.js}.js"
  mapfile="${minfile}.map"
  if [ ! -f "$srcfile" ] && [ ! -f "$mapfile" ]; then
    MISSING_SRC=$((MISSING_SRC+1))
  fi
done < <(find . -name "*.min.js" -not -path "*/node_modules/*" -not -path "*/vendor/*" 2>/dev/null)

if [ "$MISSING_SRC" -eq 0 ]; then
  pass "All minified JS has source or source maps"
else
  warn "$MISSING_SRC minified JS file(s) without source/map (Guideline 4)"
fi

# --- 5. Trialware check (Guideline 5) ---
TRIAL_PATTERNS=$(grep -rlc "license_key\|is_premium\|is_pro\|feature_locked\|trial_expired\|upgrade_required" \
  --include="*.php" . 2>/dev/null | grep -v vendor/ | grep -v node_modules/ || true)

if [ -z "$TRIAL_PATTERNS" ]; then
  pass "No trialware patterns detected"
else
  warn "Potential trialware patterns found — verify compliance (Guideline 5): $TRIAL_PATTERNS"
fi

# --- 6. Tracking without consent (Guideline 7) ---
TRACKING=$(grep -rn "analytics\|telemetry\|usage_data\|tracking_data\|send_usage" \
  --include="*.php" . 2>/dev/null | grep -v vendor/ | grep -v node_modules/ || true)

if [ -z "$TRACKING" ]; then
  pass "No tracking/telemetry patterns detected"
else
  warn "Potential tracking code found — ensure opt-in consent (Guideline 7)"
fi

# --- 7. External code execution (Guideline 8) ---
EXTERNAL_CDN=$(grep -rn "cdn\.\|jsdelivr\.net\|cdnjs\.com\|unpkg\.com" \
  --include="*.php" . 2>/dev/null | grep -v vendor/ | grep -v "fonts\.\|font" || true)

if [ -z "$EXTERNAL_CDN" ]; then
  pass "No non-font CDN usage detected"
else
  warn "External CDN usage found — only fonts are allowed (Guideline 8)"
fi

# --- 8. Bundled WP libraries (Guideline 13) ---
BUNDLED_JQUERY=$(find . -name "jquery.js" -o -name "jquery.min.js" 2>/dev/null | \
  grep -v node_modules | grep -v vendor || true)

if [ -z "$BUNDLED_JQUERY" ]; then
  pass "jQuery not bundled (using WP default)"
else
  fail "jQuery bundled in plugin — must use WP default (Guideline 13): $BUNDLED_JQUERY"
fi

# --- 9. Trademark check (Guideline 17) ---
SLUG=$(basename "$(pwd)")
if echo "$SLUG" | grep -qiE "^(wordpress|woocommerce|gutenberg)-"; then
  fail "Plugin slug starts with a trademarked term: $SLUG (Guideline 17)"
else
  pass "Plugin slug doesn't start with common trademarks"
fi

# --- 10. Security basics ---
UNSANITIZED_POST=$(grep -rn '$_POST\[' --include="*.php" . 2>/dev/null | \
  grep -v "sanitize\|wp_unslash\|nonce\|vendor/\|node_modules/" || true)

if [ -z "$UNSANITIZED_POST" ]; then
  pass "No unsanitized \$_POST access detected"
else
  warn "Potentially unsanitized \$_POST usage found — review carefully"
fi

UNSANITIZED_GET=$(grep -rn '$_GET\[' --include="*.php" . 2>/dev/null | \
  grep -v "sanitize\|wp_unslash\|nonce\|vendor/\|node_modules/" || true)

if [ -z "$UNSANITIZED_GET" ]; then
  pass "No unsanitized \$_GET access detected"
else
  warn "Potentially unsanitized \$_GET usage found — review carefully"
fi

NONCE_CHECK=$(grep -rl "wp_verify_nonce\|check_ajax_referer\|wp_nonce_field" \
  --include="*.php" . 2>/dev/null | grep -v vendor/ || true)

if [ -n "$NONCE_CHECK" ]; then
  pass "Nonce verification found"
else
  warn "No nonce verification detected — ensure forms are protected"
fi

# --- 11. Direct access prevention ---
DIRECT_ACCESS_MISSING=0
while IFS= read -r phpfile; do
  if ! head -10 "$phpfile" | grep -q "defined.*ABSPATH\|defined.*WPINC\|defined.*ABSPATH"; then
    DIRECT_ACCESS_MISSING=$((DIRECT_ACCESS_MISSING+1))
  fi
done < <(find . -name "*.php" -not -path "*/vendor/*" -not -path "*/node_modules/*" \
  -not -name "uninstall.php" 2>/dev/null)

if [ "$DIRECT_ACCESS_MISSING" -eq 0 ]; then
  pass "All PHP files have direct access prevention"
else
  warn "$DIRECT_ACCESS_MISSING PHP file(s) missing direct access prevention (ABSPATH check)"
fi

# --- 12. Text domain check ---
TEXT_DOMAIN=$(grep "Text Domain:" "$MAIN_FILE" | sed 's/.*Text Domain:\s*//' | sed 's/\s*\*\///' | tr -d ' ')
if [ -n "$TEXT_DOMAIN" ]; then
  if [ "$TEXT_DOMAIN" = "$SLUG" ]; then
    pass "Text domain '$TEXT_DOMAIN' matches plugin slug"
  else
    warn "Text domain '$TEXT_DOMAIN' does not match plugin slug '$SLUG'"
  fi
else
  fail "No Text Domain declared in plugin header"
fi

# --- 13. Admin dashboard hijack check (Guideline 11) ---
ADMIN_NOTICES=$(grep -rn "admin_notices\|wp_admin_notice" --include="*.php" . 2>/dev/null | \
  grep -v vendor/ | grep -v node_modules/ || true)

if [ -n "$ADMIN_NOTICES" ]; then
  DISMISSIBLE=$(echo "$ADMIN_NOTICES" | grep -c "dismissible\|dismiss\|is-dismissible" || true)
  TOTAL=$(echo "$ADMIN_NOTICES" | wc -l)
  if [ "$DISMISSIBLE" -lt "$TOTAL" ]; then
    warn "Admin notices found ($TOTAL) — ensure all are dismissible (Guideline 11)"
  else
    pass "Admin notices appear dismissible"
  fi
else
  pass "No site-wide admin notices detected"
fi

# --- Results ---
echo ""
echo "============================================"
echo "Results"
echo "============================================"

if [ -n "$RESULTS_PASS" ]; then
  echo ""
  echo "PASS ($PASS items):"
  echo -e "$RESULTS_PASS"
fi

if [ -n "$RESULTS_WARN" ]; then
  echo ""
  echo "WARNING ($WARN items):"
  echo -e "$RESULTS_WARN"
fi

if [ -n "$RESULTS_FAIL" ]; then
  echo ""
  echo "FAIL ($FAIL items):"
  echo -e "$RESULTS_FAIL"
fi

echo ""
echo "============================================"
echo "Total: $((PASS+WARN+FAIL)) checks"
echo "Pass: $PASS | Warning: $WARN | Fail: $FAIL"
echo "============================================"

if [ "$FAIL" -eq 0 ]; then
  echo ""
  echo "→ No blocking issues found. Review warnings before submitting."
else
  echo ""
  echo "→ Fix the $FAIL FAIL item(s) before submitting to WordPress.org."
fi
