=== SAAI Blocks ===
Contributors: shohei.tanaka, shinobiashi
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=info@artws.info&item_name=Donation+for+Artisan&currency_code=JPY
Tags: blocks, gutenberg, breadcrumb, gallery, swiper
Requires at least: 6.8
Tested up to: 6.9
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A WordPress block editor extension plugin providing highly customizable, unique custom blocks.

== Description ==

**SAAI Blocks** is a WordPress block editor extension plugin. It provides highly customizable, unique custom blocks to enhance your website building experience.

= Source Code =

The full source code, including all uncompiled JavaScript, SCSS, and build configuration, is publicly available on GitHub:
https://github.com/shinobiashi/saai-blocks

To rebuild the plugin assets from source:

1. Clone the repository
2. Run `npm install` (this also runs `composer install` automatically)
3. Run `npm run build` to produce the compiled assets in `assets/build/`

Build tools required: Node.js 18+, npm, webpack (via @wordpress/scripts)

= External Services =

The **3D Model Viewer** block uses Google's open-source `model-viewer` web component (https://modelviewer.dev/).

When a visitor views a page containing a 3D model that uses Draco or KTX2 compression, the model-viewer component may load WebAssembly decoder files from Google's static content CDN (gstatic.com). These decoders are only fetched on demand and are not loaded on every page view. No personal data is transmitted.

* Draco geometry decoder: `https://www.gstatic.com/draco/versioned/decoders/`
* KTX2 texture transcoder: `https://www.gstatic.com/basis-universal/versioned/`
* Lottie animation loader (if Lottie textures are used): `https://cdn.jsdelivr.net/npm/three/`
* Google's privacy policy: https://policies.google.com/privacy
* jsDelivr's privacy policy: https://www.jsdelivr.com/privacy-policy-jsdelivr-net

If your 3D models do not use Draco compression, KTX2 textures, or Lottie animations (plain GLB files), no external requests are made.

= Key Features =

Currently, the plugin includes the following custom blocks:

**1. Breadcrumb Block Pro**
A breadcrumb navigation block that includes SEO-friendly structured data.
* Feature to toggle the visibility of the home link and current page
* Customizable separator characters
* Text and link color settings

**2. Image Gallery Swiper (hover-image-switcher)**
A gallery block that allows users to view multiple images by swiping.
* Adjustable vertical and horizontal positioning of navigation arrows
* Supports arrows placed outside the image area and hover-triggered image switching

== Installation ==

= Minimum Requirements =

* WordPress 6.7 or greater
* PHP version 8.1 or greater
* MySQL version 5.6 or greater

= Automatic installation =

Automatic installation is the easiest option as WordPress handles the file transfers itself and you don’t need to leave your web browser. To do an automatic install of SAAI Blocks, log in to your WordPress dashboard, navigate to the Plugins menu and click Add New.

In the search field type “SAAI Blocks” and click Search Plugins. Once you’ve found our plugin you can view details about it such as the the point release, rating and description. Most importantly of course, you can install it by simply clicking “Install Now”.

= Manual installation =

The manual installation method involves downloading and uploading our plugin to your webserver via your favorite FTP application.

== Screenshots ==

== Changelog ==

= 1.0.0 =
* Initial release.

== Upgrade Notice ==