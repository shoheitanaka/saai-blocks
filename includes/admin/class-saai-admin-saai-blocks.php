<?php
/**
 * SAAI Admin Plugin Name class file.
 *
 * @package SAAI
 * @since 1.0.0
 */

namespace SAAI\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Admin Plugin Class
 */
class SAAI_Admin_SAAI_Blocks {

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		// Constructor code here.
	}

	/**
	 * Instance of this class.
	 *
	 * @var SAAI_Admin_SAAI_Blocks
	 */
	private static $instance;

	/**
	 * Get the instance of this class.
	 *
	 * @return SAAI_Admin_SAAI_Blocks
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
		// Initialization code here.
	}
}
