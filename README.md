# SAAI Blocks

A WordPress block editor extension plugin. It provides highly customizable, unique custom blocks.
`wp-env` is used as the local development environment, and development in VS Code is highly recommended.

## Features

Currently, the plugin includes the following custom blocks:

### 1. Breadcrumb Block Pro

A breadcrumb navigation block that includes SEO-friendly structured data.

- Feature to toggle the visibility of the home link and current page
- Customizable separator characters
- Text and link color settings

### 2. Image Gallery Swiper (`hover-image-switcher`)

A gallery block that allows users to view multiple images by swiping.

- Adjustable vertical and horizontal positioning of navigation arrows
- Supports arrows placed outside the image area and hover-triggered image switching

---

## Development Guide (Contributing)

### Prerequisites

- [Node.js / npm](https://nodejs.org/)
- [Composer](https://getcomposer.org/download/)
- [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/) (Requires a Docker environment)

### 1. Installation

After cloning the repository, install the necessary packages.
(Per the `package.json` configuration, `composer install` will run automatically after `npm install`).

```bash
npm install
```

### 2. Start Development Environment

Spin up a local WordPress container environment using `wp-env`.

```bash
wp-env start
```

Once started, you can access the output local host URL (e.g., `http://localhost:8888`).  
(Default Username: `admin` / Password: `password`)

### 3. Build & Watch

During development, use the `start` script to automatically detect file changes and rebuild the blocks.

```bash
npm start
```

To output the optimized production build files (under the `build` directory), run `build`.

```bash
npm run build
```

### 4. Lint & Format

To maintain code quality, please run the following commands before committing.

```bash
# Format JS, CSS, and other files
npm run format

# CSS and SCSS linting
npm run lint:css

# Syntax checking (JS/TS)
npm run lint:js
```

### 5. i18n (Translations)

Use these commands when updating translation files (`.pot` and `.json`) for newly added texts.  
*Note: Since the commands run via `wp-env`, ensure the container is running with `wp-env start` beforehand.*

```bash
# Generate .pot file
npm run make-pot

# Generate .json from translated data
npm run make-json
```
