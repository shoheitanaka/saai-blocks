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

	// Load all php files in the includes directory.
	$includes_dir = __DIR__ . '/includes';

try {
	$directory_iterator = new RecursiveDirectoryIterator(
		$includes_dir,
		FilesystemIterator::SKIP_DOTS
	);

	$iterator = new RecursiveIteratorIterator( $directory_iterator );

	foreach ( $iterator as $file_info ) {
		if ( $file_info->getExtension() === 'php' ) {
			require_once $file_info->getRealPath();
		}
	}
} catch ( Exception $e ) {
	// Handle error silently in production or use WordPress admin notice.
	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		wp_die( 'File load error in plugin: ' . esc_html( $e->getMessage() ) );
	}
}

	add_action( 'plugins_loaded', 'plugin_name_init', 10 );

	/**
	 * Initialize the plugin.
	 *
	 * Loads the text domain and initializes the main plugin class.
	 */
function plugin_name_init() {
	load_plugin_textdomain( 'plugin-name', false, plugin_basename( __DIR__ ) . '/i18n' );
	Plugin_Name::instance();
}
