<?php
/**
 * Plugin Name: SAAI Blocks
 * Plugin URI: https://wordpress.org/plugins/saai-blocks/
 * Description: Shinobiashi AI Blocks for WordPress.
 * Version: 1.0.0
 * Author: Shohei Tanaka
 * Author URI: https://shinobiashi.ai/
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: saai-blocks
 * Domain Path: /i18n
 * Requires at least: 6.8
 * Tested up to: 6.9
 * Requires PHP: 8.2
 *
 * @package SAAI_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


if ( ! defined( 'SAAI_BLOCKS_VERSION' ) ) {
	define( 'SAAI_BLOCKS_VERSION', '1.0.0' );
}

if ( ! defined( 'SAAI_BLOCKS_PATH' ) ) {
	define( 'SAAI_BLOCKS_PATH', __DIR__ );
	define( 'SAAI_BLOCKS_URL', plugins_url( '/', __FILE__ ) );
}

require_once __DIR__ . '/includes/class-saai-blocks.php';
require_once __DIR__ . '/includes/admin/class-saai-admin-saai-blocks.php';
require_once __DIR__ . '/includes/saai_framework/class-saai-admin-page.php';

add_action( 'plugins_loaded', 'saai_blocks_init', 10 );

/**
 * Initialize the plugin.
 */
function saai_blocks_init() {
	SAAI_Blocks::instance();
}
