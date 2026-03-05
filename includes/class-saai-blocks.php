<?php
/**
 * Main class file for SAAI Blocks
 *
 * @package SAAI_Blocks
 * @since 1.0.0
 */

use SAAI\Admin\SAAI_Admin_Page;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Main Plugin Class
 */
class SAAI_Blocks {

	/**
	 * Instance of this class.
	 *
	 * @var SAAI_Blocks
	 */
	private static $instance;

	/**
	 * Get the instance of this class.
	 *
	 * @return SAAI_Blocks
	 */
	public static function instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}
		return self::$instance;
	}

	/**
	 * Initialize the plugin.
	 */
	private function init() {
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		if ( is_admin() ) {
			$admin_menu = array(
				'page_title'  => __( 'SAAI overview', 'plugin-name' ),
				'menu_title'  => __( 'SAAI', 'plugin-name' ),
				'plugin_path' => PLUGIN_NAME_PATH,
			);
			new SAAI_Admin_Page( $admin_menu );
		}
	}
}
