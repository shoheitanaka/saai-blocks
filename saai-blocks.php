<?php
/**
 * Plugin Name: SAAI Blocks
 * Plugin URI: https://shinobiashi.ai/
 * Description: Shinobiashi AI Blocks for WordPress.
 * Version: 1.0.0
 * Author: Shohei Tanaka
 * Author URI: https://shinobiashi.ai/
 * License: GPL3
 * Text Domain: saai-blocks
 * Domain Path: /i18n
 * Requires at least: 6.8
 * Tested up to: 6.9.1
 * Requires PHP: 8.2
 *
 * @package SAAI_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
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
 *
 * Loads the text domain and initializes the main plugin class.
 */
function saai_blocks_init() {
	load_plugin_textdomain( 'saai-blocks', false, plugin_basename( __DIR__ ) . '/i18n' );
	SAAI_Blocks::instance();
}
