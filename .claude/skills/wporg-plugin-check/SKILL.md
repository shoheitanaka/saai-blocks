---
name: wporg-plugin-check
description: >
  WordPress.orgプラグインディレクトリへの登録前チェックを行うスキル。公式ガイドライン全18条
  （GPL互換、トラッキング禁止、トライアルウェア禁止、管理画面の乗っ取り禁止、
  商標/著作権遵守、readme.txtスパム禁止、デフォルトライブラリ使用、コード可読性等）への
  準拠を検証する。ガイドラインは実行時に常に公式URLから最新版を取得するため、
  ルール変更にも自動追従する。「WordPress.org登録」「プラグインディレクトリ」
  「wporg提出」「プラグイン申請」「プラグインレビュー」「readme.txt」「GPL」
  「プラグインガイドライン」「WordPress.orgチェック」といったキーワードで使用する。
  WordPress.orgへのプラグイン提出・審査対策・readme.txt作成について相談された場合にも
  積極的に参照すること。
---

# WordPress.org Plugin Directory Check

WordPress.orgプラグインディレクトリへの登録審査に通過するために、
プラグインが公式ガイドライン全18条に準拠しているかを検証するスキル。

**重要**: ガイドラインは変更される可能性があるため、チェック実行前に必ず
公式ページから最新版を取得する。

## 手順

### 0) 最新ガイドラインの取得（必須・毎回実行）

**チェックを開始する前に、必ず以下のURLから最新のガイドラインを取得すること:**

```
https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
```

Web検索またはURL取得ツールで上記ページの内容を読み込み、
ガイドラインの条文に変更がないかを確認してからチェックを実施する。
これにより、ガイドラインの更新（条文の追加・変更・削除）に常に追従できる。

併せて、よくある問題の一覧も取得する:
```
https://developer.wordpress.org/plugins/wordpress-org/common-issues/
```

ブロックプラグインの場合は追加で:
```
https://developer.wordpress.org/plugins/wordpress-org/block-specific-plugin-guidelines/
```

### 1) プロジェクト検出

対象プラグインのディレクトリを走査し、基本情報を収集する:

```bash
# メインプラグインファイルの特定
grep -rl "Plugin Name:" *.php

# readme.txt の存在確認
ls readme.txt 2>/dev/null || ls README.txt 2>/dev/null

# ライセンス確認
grep -i "License:" *.php | head -5
grep -ri "GPL" LICENSE* license* 2>/dev/null
```

### 2) 全18条チェックの実行

取得した最新ガイドラインに基づいてチェックする。
以下は現時点（2024年3月15日版）のガイドラインに基づくチェック項目だが、
ステップ0で取得した最新版に差分がある場合はそちらを優先すること。

---

## チェック項目

### 条文1: GPLライセンス互換

プラグイン本体、含まれる全てのライブラリ・画像・データが
GPLまたはGPL互換ライセンスであること。

```bash
# ライセンスヘッダー確認
grep -n "License:" plugin-name.php

# サードパーティライブラリのライセンス確認
find . -name "LICENSE*" -o -name "license*" -o -name "COPYING*" | head -20
find vendor/ -name "LICENSE*" 2>/dev/null
find node_modules/ -name "LICENSE*" 2>/dev/null | head -10
```

チェックポイント:
- [ ] メインファイルのヘッダーに `License: GPL-2.0-or-later`（推奨）
- [ ] メインファイルに `License URI: https://www.gnu.org/licenses/gpl-2.0.html`
- [ ] 全てのサードパーティコードがGPL互換ライセンス
- [ ] 画像・フォント等のアセットもGPL互換
- [ ] LICENSE ファイルがルートに存在

### 条文2: 開発者の責任

プラグイン内の全ファイルがガイドラインに準拠していること。
ガイドラインを迂回するコードの意図的な記述は禁止。

- [ ] 全ファイルのライセンスを確認済み
- [ ] 利用する全サードパーティAPIの利用規約を遵守

### 条文3: 安定版の提供

WordPress.orgから配布されるバージョンが常に最新の安定版であること。

- [ ] readme.txt の `Stable tag` が最新リリースと一致
- [ ] trunk のコードが最新安定版

### 条文4: コードの可読性

難読化されたコードは禁止。ソースコードが人間に読める状態であること。

```bash
# 難読化パターンの検出
grep -rn "eval(" --include="*.php" . | grep -v vendor/
grep -rn "base64_decode" --include="*.php" . | grep -v vendor/
grep -rn "gzinflate" --include="*.php" . | grep -v vendor/
grep -rn "str_rot13" --include="*.php" . | grep -v vendor/

# ミニファイされたJSのソースマップまたはソースコード確認
find . -name "*.min.js" | while read f; do
  src="${f%.min.js}.js"
  map="${f}.map"
  if [ ! -f "$src" ] && [ ! -f "$map" ]; then
    echo "WARNING: No source for $f"
  fi
done
```

チェックポイント:
- [ ] PHP に `eval()` + `base64_decode` 等の難読化パターンなし
- [ ] ミニファイされたJS/CSSにはソースまたはソースマップがある
- [ ] 変数名が意味のある名前（`$z12sdf813d` のような命名は不可）
- [ ] ソースコードへのアクセス手段が提供されている（同梱 or readme にリンク）

### 条文5: トライアルウェア禁止

支払いやアップグレードでのみ解除される機能制限は禁止。
試用期間後の機能無効化も禁止。サンドボックスのみのAPI接続も不可。

```bash
# トライアルウェアパターンの検出
grep -rn "trial" --include="*.php" . | grep -iv "translat"
grep -rn "license_key\|license_check\|is_premium\|is_pro" --include="*.php" .
grep -rn "feature_locked\|upgrade_required" --include="*.php" .
```

チェックポイント:
- [ ] 期間制限で無効化される機能なし
- [ ] 支払い必須でロックされる機能なし（コード自体は全てプラグインに含まれている）
- [ ] 有料機能は別プラグイン（add-on）として分離するのが推奨

### 条文6: SaaS（Software as a Service）

外部サービスへのインターフェースは許可。ただし:

- [ ] サービスが実質的な機能を提供している
- [ ] readme.txt にサービスの説明とリンクがある
- [ ] ライセンスキー検証のためだけのサービスは不可
- [ ] 機能を外部に移してサービスに見せかけることは不可

### 条文7: ユーザートラッキング禁止（同意なし）

```bash
# 外部通信パターンの検出
grep -rn "wp_remote_get\|wp_remote_post\|wp_remote_request\|file_get_contents\|curl_" \
  --include="*.php" . | grep -v vendor/

# トラッキング/分析パターン
grep -rn "analytics\|tracking\|telemetry\|usage_data\|send_data" --include="*.php" .
```

チェックポイント:
- [ ] ユーザーの明示的な同意なしに外部サーバーへ通信しない
- [ ] トラッキングはオプトイン方式（チェックボックス等で同意を得る）
- [ ] データ収集の内容と用途が readme に明記されている
- [ ] サービス連携以外の理由での外部通信なし
- [ ] 第三者の広告トラッキングメカニズムなし

### 条文8: 第三者からの実行コード禁止

```bash
# 外部コード実行パターン
grep -rn "wp_remote_get.*\.php\|wp_remote_get.*\.js" --include="*.php" .
grep -rn "file_get_contents.*http" --include="*.php" . | grep -v vendor/

# 外部CDN使用の検出（フォント以外は非推奨）
grep -rn "cdn\.\|jsdelivr\|cdnjs\|unpkg" --include="*.php" .
```

チェックポイント:
- [ ] WordPress.org以外からのプラグイン/テーマのインストール・更新なし
- [ ] プレミアム版の自動インストールなし
- [ ] フォント以外の目的で第三者CDNを使用していない
- [ ] 全てのJS/CSSがローカルに含まれている（サービス関連を除く）
- [ ] iframeで管理ページを接続していない

### 条文9: 違法・不正・不道徳な行為の禁止

- [ ] キーワードスタッフィングなし
- [ ] 他の開発者のプラグインを自分のものとして提示していない
- [ ] 法的コンプライアンスの保証を暗示していない
- [ ] ユーザーのサーバーリソースを無断使用していない（マイニング等）

### 条文10: 外部リンク・クレジットの制限

```bash
# フロントエンドへのリンク/クレジット挿入の検出
grep -rn "Powered by\|powered-by\|credit" --include="*.php" .
grep -rn "wp_footer\|wp_head" --include="*.php" . | grep -v vendor/
```

チェックポイント:
- [ ] フロントエンドの「Powered by」リンクはデフォルトで非表示
- [ ] クレジット表示はユーザーが明示的にオプトインする方式
- [ ] クレジット/リンク表示がプラグインの動作条件になっていない

### 条文11: 管理画面の乗っ取り禁止

```bash
# 全画面通知パターン
grep -rn "admin_notices\|wp_admin_notice" --include="*.php" .
grep -rn "dashboard_widget\|wp_dashboard_setup" --include="*.php" .
grep -rn "is_dismissible\|dismiss" --include="*.php" .
```

チェックポイント:
- [ ] アップグレード催促・通知はプラグイン設定ページ内に限定
- [ ] サイト全体の通知は閉じられる（dismissible）こと
- [ ] エラーメッセージに解決方法が含まれている
- [ ] ダッシュボードウィジェットは閉じられること
- [ ] 管理画面内の広告は最小限

### 条文12: readme.txt のスパム禁止

```bash
# readme.txt の検証
if [ -f readme.txt ]; then
  # タグ数チェック（5個以下）
  tags=$(grep "^Tags:" readme.txt | sed 's/Tags://;s/,/\n/g' | wc -l)
  echo "Tag count: $tags (max 5)"

  # アフィリエイトリンク
  grep -n "affiliate\|ref=\|aff=" readme.txt
fi
```

チェックポイント:
- [ ] タグは5個以下
- [ ] 競合製品のタグを使っていない
- [ ] キーワードスタッフィングなし
- [ ] アフィリエイトリンクがある場合は開示されている
- [ ] アフィリエイトリンクは直接リンク（リダイレクト/クローキングURL不可）
- [ ] readme は人間向けに書かれている（ボット向けでなく）

### 条文13: WordPress デフォルトライブラリの使用

```bash
# バンドルされたjQueryの検出
find . -name "jquery.js" -o -name "jquery.min.js" | grep -v node_modules | grep -v vendor
find . -name "jquery-ui*.js" | grep -v node_modules | grep -v vendor

# その他のWP同梱ライブラリの重複
for lib in backbone underscore lodash moment react react-dom; do
  find . -name "${lib}*.js" -not -path "*/node_modules/*" -not -path "*/vendor/*" \
    -not -path "*/build/*" 2>/dev/null
done
```

チェックポイント:
- [ ] jQuery をバンドルしていない（WP同梱版を使用）
- [ ] jQuery UI をバンドルしていない
- [ ] React/ReactDOM をバンドルしていない（WP同梱版を使用）
- [ ] その他 WP 同梱ライブラリを重複して含めていない
- [ ] `wp_enqueue_script()` で WP 同梱ライブラリを依存として指定

### 条文14: 頻繁なコミットの回避

SVNリポジトリはリリースリポジトリ。開発用ではない。
- [ ] コミットメッセージが説明的
- [ ] デプロイ準備ができたコードのみコミット

### 条文15: バージョン番号のインクリメント

- [ ] リリースごとにバージョン番号が増加
- [ ] trunk の readme.txt の `Stable tag` が現在のバージョンを反映
- [ ] タグとヘッダーのバージョンが一致

### 条文16: 提出時に完全なプラグイン

- [ ] 提出時にZIPファイルで完全に動作するプラグインが含まれている
- [ ] 名前の「予約」目的での提出ではない

### 条文17: 商標・著作権・プロジェクト名の尊重

```bash
# プラグインスラッグの確認
slug=$(basename $(pwd))
echo "Plugin slug: $slug"

# 商標が先頭に来ていないか
echo "$slug" | grep -iE "^(wordpress|woocommerce|gutenberg|automattic|google|facebook|amazon|twitter|instagram|youtube|tiktok|shopify|stripe|paypal)-"
```

チェックポイント:
- [ ] プラグインスラッグが他社商標で始まっていない
- [ ] 「wordpress」がスラッグの先頭にない
- [ ] 商標所有者の正式な代理でない限り、商標を先頭に使用しない
- [ ] オリジナルのブランディングを推奨

### 条文18: ディレクトリ管理の権限

WordPressチームがガイドラインの更新やプラグインの削除等の権限を持つことの確認。

---

## readme.txt チェック

```bash
# readme.txt の存在と基本構造
if [ -f readme.txt ]; then
  echo "=== readme.txt found ==="

  # 必須フィールド
  grep "^=== " readme.txt | head -1
  grep "Contributors:" readme.txt
  grep "Tags:" readme.txt
  grep "Requires at least:" readme.txt
  grep "Tested up to:" readme.txt
  grep "Stable tag:" readme.txt
  grep "License:" readme.txt
  grep "License URI:" readme.txt

  # セクション確認
  grep "^== " readme.txt
else
  echo "ERROR: readme.txt not found"
fi
```

readme.txt の必須要素:
- [ ] プラグイン名（ヘッダー）
- [ ] Contributors（WordPress.orgユーザー名）
- [ ] Tags（5個以下）
- [ ] Requires at least（WPバージョン）
- [ ] Tested up to（WPバージョン）
- [ ] Stable tag（現在のバージョン）
- [ ] License（GPL-2.0-or-later 推奨）
- [ ] License URI
- [ ] == Description == セクション
- [ ] == Installation == セクション
- [ ] == Changelog == セクション

参考: https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/

---

## セキュリティチェック

```bash
# サニタイズ漏れの検出
grep -rn "\$_POST\[" --include="*.php" . | grep -v "sanitize\|wp_unslash\|nonce" | grep -v vendor/
grep -rn "\$_GET\[" --include="*.php" . | grep -v "sanitize\|wp_unslash\|nonce" | grep -v vendor/
grep -rn "\$_REQUEST\[" --include="*.php" . | grep -v "sanitize\|wp_unslash" | grep -v vendor/

# エスケープ漏れの検出
grep -rn "echo \$" --include="*.php" . | grep -v "esc_\|wp_kses" | grep -v vendor/

# Nonce検証の存在確認
grep -rn "wp_verify_nonce\|check_ajax_referer\|wp_nonce_field" --include="*.php" .

# ケイパビリティチェック
grep -rn "current_user_can" --include="*.php" .

# 直接アクセス防止
for f in $(find . -name "*.php" -not -path "*/vendor/*"); do
  if ! head -5 "$f" | grep -q "defined.*ABSPATH\|defined.*WPINC"; then
    echo "WARNING: No direct access check in $f"
  fi
done
```

- [ ] 全ユーザー入力がサニタイズされている
- [ ] 全出力がエスケープされている
- [ ] フォーム送信にNonce検証がある
- [ ] 管理操作にケイパビリティチェックがある
- [ ] PHPファイルに直接アクセス防止がある
- [ ] SQLクエリにプリペアドステートメント使用

参考: https://developer.wordpress.org/plugins/security/

---

## プラグインヘッダーチェック

```bash
# メインプラグインファイルのヘッダー
grep -A 20 "Plugin Name:" plugin-name.php | head -20
```

必須ヘッダー:
- [ ] Plugin Name
- [ ] Description
- [ ] Version
- [ ] Author
- [ ] License（GPL-2.0-or-later 推奨）
- [ ] Text Domain（ディレクトリ名と一致）

推奨ヘッダー:
- [ ] Plugin URI
- [ ] Author URI
- [ ] Requires at least
- [ ] Tested up to
- [ ] Requires PHP

---

## 出力フォーマット

チェック結果を以下の形式で出力:

```
=== WordPress.org Plugin Directory Check ===
Plugin: [プラグイン名]
Date: [日付]
Guidelines version: [取得したガイドラインの Last Updated 日付]

── Results ──

✅ PASS (XX items)
[通過した項目のリスト]

⚠️ WARNING (XX items)
[注意が必要な項目と対応方法]

❌ FAIL (XX items)
[不合格の項目と具体的な修正方法]

── Summary ──
Total: XX checks
Pass: XX | Warning: XX | Fail: XX

[FAILが0の場合]
→ 提出可能です。
[FAILがある場合]
→ 上記の ❌ 項目を修正してから提出してください。
```

## 関連リソース

チェック実行時に最新版を取得するURL一覧:

- ガイドライン本体: https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
- よくある問題: https://developer.wordpress.org/plugins/wordpress-org/common-issues/
- readme.txt の書き方: https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/
- ブロック専用ガイドライン: https://developer.wordpress.org/plugins/wordpress-org/block-specific-plugin-guidelines/
- プラグインアセット: https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/
- セキュリティ: https://developer.wordpress.org/plugins/security/
- ヘッダー要件: https://developer.wordpress.org/plugins/plugin-basics/header-requirements/
- 提出と管理: https://developer.wordpress.org/plugins/wordpress-org/planning-submitting-and-maintaining-plugins/
- プラグイン開発者FAQ: https://developer.wordpress.org/plugins/wordpress-org/plugin-developer-faq/
