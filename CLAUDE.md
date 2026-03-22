# SAAI Blocks - Claude Code Instructions

## Project Overview

A Gutenberg custom block plugin for WordPress 6.8+ / PHP 8.2+.
Includes an admin UI built with WooCommerce Admin components.

**Text Domain:** `saai-blocks`
**Block Category:** `saai-blocks`

## Architecture

### Directory Structure

```
saai-blocks/
├── saai-blocks.php                          # Main plugin entry point
├── includes/
│   ├── class-saai-blocks.php               # Core plugin class (singleton)
│   ├── admin/
│   │   └── class-saai-admin-saai-blocks.php # Block settings admin page
│   └── saai_framework/
│       └── class-saai-admin-page.php        # SAAI admin page framework
├── src/                                     # Block source files (edit here)
│   ├── {block-name}/
│   │   ├── block.json
│   │   ├── index.js                         # Block registration
│   │   ├── edit.js                          # Editor React component
│   │   ├── save.js                          # Save function (omit for server-render)
│   │   ├── render.php                       # Server-side render (if needed)
│   │   ├── style.scss                       # Shared frontend + editor styles
│   │   ├── editor.scss                      # Editor-only styles
│   │   └── view.js                          # Frontend interactions (if needed)
│   └── saai/admin/
│       ├── overview/index.js               # Admin overview page
│       └── blocks-settings/index.js        # Block settings page
├── assets/build/                           # Build output (do not edit)
├── i18n/                                   # Translation files
├── webpack.config.js
├── package.json
└── composer.json
```

### Registered Blocks

| Block Name | Slug | Rendering |
| --------- | ---- | --------- |
| Breadcrumb | `saai-blocks/breadcrumb-block` | Server-side (render.php) |
| Image Gallery Swiper | `saai-blocks/hover-image-switcher` | Client-side + view.js |
| Responsive Device Image | `saai-blocks/responsive-device-image` | Client-side |
| Image Text Hover | `saai-blocks/image-text-hover` | Client-side + view.js |

## Development Workflow

### Start Environment

```bash
npm install          # also runs composer install automatically
wp-env start         # start Docker environment (http://localhost:8888 admin/password)
npm start            # watch mode — rebuilds on file changes
```

### Build

```bash
npm run build        # production build (with --blocks-manifest)
npm run format       # format code
npm run lint:js      # JavaScript lint
npm run lint:css     # CSS lint
```

### Translations

```bash
npm run make-pot     # generate .pot template file
npm run make-json    # generate JSON translation files for JavaScript
```

## Adding a New Block

### 1. Create source files in `src/{block-name}/`

**Required block.json settings:**
```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "saai-blocks/{block-name}",
  "title": "Block Title",
  "category": "saai-blocks",
  "textdomain": "saai-blocks",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

### 2. Add an entry point in `webpack.config.js`

```js
const customEntries = {
  // existing entries...
  '{block-name}': './src/{block-name}/index.js',
};
```

### 3. Add the slug to `$block_slugs` in `class-saai-blocks.php`

```php
private static $block_slugs = [
  // existing slugs...
  'saai-blocks/{block-name}',
];
```

### 4. Build and verify

```bash
npm run build
```

## Coding Conventions

### PHP

- Follow **WordPress Coding Standards** (PHPCS configured)
- Every PHP file must include an `ABSPATH` guard
- Always escape on output: `esc_html()`, `esc_url()`, `esc_attr()`, `wp_kses_post()`
- Always sanitize on input: `sanitize_text_field()`, `absint()`, etc.
- Admin classes use the `SAAI\Admin` namespace
- Core plugin class uses the singleton pattern

### JavaScript / React

- ESM modules (`import`/`export`)
- All block edit components are functional components with Hooks
- Always use the `useBlockProps()` hook
- Wrap all translatable strings with `__()` (text domain: `saai-blocks`)
- Frontend scripts (`view.js`) are vanilla JavaScript — no React

### CSS / SCSS

- Class name prefix: `.saai-{block-name}__*` (BEM-like)
- Use CSS custom properties for theme colors
- Block-specific styles belong in each block's own SCSS file
- Do not modify global styles

## Block Implementation Patterns

### Server-side rendering (with render.php)

- Return `null` from the `save` function (or omit `save.js`)
- Add `"render": "file:./render.php"` to `block.json`
- Inside `render.php`, the variables `$attributes`, `$content`, and `$block` are available

### Client-side interactivity (with view.js)

- Add `"viewScript": "file:./view.js"` to `block.json`
- Implement `view.js` in vanilla JavaScript
- Target block elements via `document.querySelectorAll('.wp-block-saai-blocks-{name}')`

### Block enable/disable

Block enabled state is managed via the REST API.
Option name: `saai_blocks_enabled` (associative array keyed by block slug)

## Important Notes

- `assets/build/` is auto-generated — never edit files there directly
- When adding a new block, always update `$block_slugs` in `class-saai-blocks.php`
- WooCommerce Admin components (`@woocommerce/components`) are used only in the admin UI
- `webpack.config.js` uses `@woocommerce/dependency-extraction-webpack-plugin` to externalize WooCommerce dependencies
- Frontend `view.js` scripts must be vanilla JavaScript only — no React

## Development Environment

- **Docker:** managed via `.wp-env.json` (WooCommerce included)
- **WordPress:** `http://localhost:8888` (admin/password)
- **phpMyAdmin:** `http://localhost:9001`
- **Debug:** `WP_DEBUG=true` and `SCRIPT_DEBUG=true` are enabled

## CI/CD

GitHub Actions (`.github/workflows/webpack.yml`) validates builds on every push to `main` and on pull requests. Runs a matrix build across Node.js 18.x, 20.x, and 22.x.
