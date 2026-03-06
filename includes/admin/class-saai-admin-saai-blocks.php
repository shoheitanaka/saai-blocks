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
	 * Page hook for the blocks settings subpage.
	 *
	 * @var string|false
	 */
	private $blocks_settings_page_hook;

	/**
	 * Admin menu slug.
	 *
	 * @var string
	 */
	private $menu_slug;

	/**
	 * Admin submenu slug.
	 *
	 * @var string
	 */
	private $sub_menu_slug;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->menu_slug     = 'saai-overview';
		$this->sub_menu_slug = 'saai-blocks-settings';
		add_action( 'admin_enqueue_scripts', array( $this, 'saai_admin_blocks_register_scripts' ) );
		add_filter( 'admin_body_class', array( $this, 'add_saai_admin_blocks_body_class' ) );
		add_action( 'admin_menu', array( $this, 'register_saai_admin_blocks_page' ) );
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

	/**
	 * Register scripts for the admin blocks page.
	 *
	 * @param string $hook_suffix The current admin page hook suffix.
	 * @since 1.0.0
	 */
	public function saai_admin_blocks_register_scripts( $hook_suffix ) {
		if ( ! $this->blocks_settings_page_hook || $hook_suffix !== $this->blocks_settings_page_hook ) {
			return;
		}

		$bs_script_path       = SAAI_BLOCKS_PATH . '/assets/build/saai/admin/blocks-settings.js';
		$bs_script_asset_path = SAAI_BLOCKS_PATH . '/assets/build/saai/admin/blocks-settings.asset.php';

		if ( ! file_exists( $bs_script_path ) ) {
			return;
		}

		$bs_script_asset = file_exists( $bs_script_asset_path )
			? require $bs_script_asset_path
			: array(
				'dependencies' => array(),
				'version'      => filemtime( $bs_script_path ),
			);

		// Enqueue overview CSS for shared admin layout styles.
		wp_enqueue_script(
			$this->sub_menu_slug,
			SAAI_BLOCKS_URL . 'assets/build/saai/admin/blocks-settings.js',
			$bs_script_asset['dependencies'],
			$bs_script_asset['version'],
			true
		);

		wp_set_script_translations(
			$this->sub_menu_slug,
			'saai-blocks',
			SAAI_BLOCKS_PATH . '/i18n'
		);

		wp_enqueue_style(
			$this->sub_menu_slug,
			SAAI_BLOCKS_URL . 'assets/build/saai/admin/blocks-settings.css',
			array( 'wp-components' ),
			file_exists( SAAI_BLOCKS_PATH . '/assets/build/saai/admin/blocks-settings.css' )
				? filemtime( SAAI_BLOCKS_PATH . '/assets/build/saai/admin/blocks-settings.css' )
				: '1.0.0'
		);
	}

	/**
	 * Register the admin blocks settings subpage.
	 *
	 * @since 1.0.0
	 */
	public function register_saai_admin_blocks_page() {
		$this->blocks_settings_page_hook = add_submenu_page(
			$this->menu_slug,
			__( 'Block Settings', 'saai-blocks' ),
			__( 'Block Settings', 'saai-blocks' ),
			'manage_options',
			$this->sub_menu_slug,
			array( $this, 'saai_blocks_settings_page_callback' )
		);
	}

	/**
	 * Callback function for the blocks settings subpage.
	 *
	 * @since 1.0.0
	 */
	public function saai_blocks_settings_page_callback() {
		echo '<div class="wrap"><div id="root-blocks-settings"></div></div>';
	}

	/**
	 * Add custom body class for the blocks settings admin page.
	 *
	 * @param string $body_class Existing body classes.
	 * @return string Modified body classes.
	 * @since 1.0.0
	 */
	public function add_saai_admin_blocks_body_class( $body_class ) {
		$screen = get_current_screen();
		if ( isset( $screen->id ) && $this->blocks_settings_page_hook && $this->blocks_settings_page_hook === $screen->id ) {
			$body_class .= ' saai-admin-page';
		}
		return $body_class;
	}
}
