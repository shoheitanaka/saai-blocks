<?php
/**
 * Main class file for SAAI Blocks
 *
 * @package SAAI_Blocks
 * @since 1.0.0
 */

use SAAI\Admin\SAAI_Admin_Page;
use SAAI\Admin\SAAI_Admin_SAAI_Blocks;

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
		add_action( 'init', array( $this, 'register_settings' ) );
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ), 10, 2 );
		add_filter( 'upload_mimes', array( $this, 'allow_3d_model_mime_types' ) );
		add_filter( 'wp_check_filetype_and_ext', array( $this, 'check_3d_model_filetype' ), 10, 4 );
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		if ( is_admin() ) {
			$admin_menu = array(
				'page_title'  => __( 'SAAI overview', 'saai-blocks' ),
				'menu_title'  => __( 'SAAI', 'saai-blocks' ),
				'plugin_path' => SAAI_BLOCKS_PATH,
			);
			new SAAI_Admin_Page( $admin_menu );
			new SAAI_Admin_SAAI_Blocks();
		}
	}

	/**
	 * Block slugs managed by this plugin.
	 *
	 * @var string[]
	 */
	private static $block_slugs = array(
		'breadcrumb-block',
		'hover-image-switcher',
		'responsive-device-image',
		'image-text-hover',
		'model-3d-viewer',
	);

	/**
	 * Registers the plugin setting for enabled blocks and exposes it via REST API.
	 */
	public function register_settings() {
		register_setting(
			'saai-blocks',
			'saai_blocks_enabled',
			array(
				'type'              => 'object',
				'default'           => array_fill_keys( self::$block_slugs, true ),
				'show_in_rest'      => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'breadcrumb-block'        => array( 'type' => 'boolean' ),
							'hover-image-switcher'    => array( 'type' => 'boolean' ),
							'responsive-device-image' => array( 'type' => 'boolean' ),
							'image-text-hover'        => array( 'type' => 'boolean' ),
							'model-3d-viewer'         => array( 'type' => 'boolean' ),
						),
					),
				),
				'sanitize_callback' => array( $this, 'sanitize_blocks_enabled' ),
			)
		);
	}

	/**
	 * Sanitize the enabled blocks option.
	 *
	 * @param mixed $input Raw input value.
	 * @return array Sanitized array of block enabled states.
	 */
	public function sanitize_blocks_enabled( $input ) {
		$sanitized = array();
		foreach ( self::$block_slugs as $slug ) {
			$sanitized[ $slug ] = ! empty( $input[ $slug ] );
		}
		return $sanitized;
	}

	/**
	 * Returns the enabled state for each block, merging stored option with defaults.
	 *
	 * @return array
	 */
	private function get_enabled_blocks() {
		$defaults = array_fill_keys( self::$block_slugs, true );
		$stored   = get_option( 'saai_blocks_enabled', $defaults );
		return wp_parse_args( $stored, $defaults );
	}

	/**
	 * Registers the SAAI Blocks category (only when at least one block is enabled).
	 *
	 * @param array  $categories Existing block categories.
	 * @param object $_post      Current post object (unused).
	 * @return array Modified block categories.
	 */
	public function register_block_category( $categories, $_post ) {
		$enabled = $this->get_enabled_blocks();
		if ( ! in_array( true, $enabled, true ) ) {
			return $categories;
		}

		$saai_category = array(
			'slug'  => 'saai-blocks',
			'title' => __( 'SAAI Blocks', 'saai-blocks' ),
			'icon'  => null,
		);

		$theme_index = array_search( 'theme', array_column( $categories, 'slug' ), true );

		if ( false !== $theme_index ) {
			array_splice( $categories, $theme_index + 1, 0, array( $saai_category ) );
			return $categories;
		}

		return array_merge( $categories, array( $saai_category ) );
	}

	/**
	 * Registers only the enabled blocks from the build directory.
	 */
	public function register_blocks() {
		$enabled = $this->get_enabled_blocks();

		foreach ( self::$block_slugs as $slug ) {
			if ( ! empty( $enabled[ $slug ] ) ) {
				register_block_type( SAAI_BLOCKS_PATH . '/assets/build/' . $slug );
			}
		}
	}

	// =========================================================================
	// 3D Model Viewer Block — MIME type helpers
	// =========================================================================

	/**
	 * Allow GLB and USDZ file uploads via the media library.
	 *
	 * @param array $mimes Allowed MIME types.
	 * @return array Modified MIME types.
	 */
	public function allow_3d_model_mime_types( $mimes ) {
		$mimes['glb']  = 'model/gltf-binary';
		$mimes['usdz'] = 'model/vnd.usdz+zip';
		return $mimes;
	}

	/**
	 * Fix file type detection for GLB and USDZ files.
	 *
	 * @param array  $data      File data array with ext and type.
	 * @param string $_file     Full path to the file (unused).
	 * @param string $filename  File name.
	 * @param array  $_mimes    Allowed MIME types (unused).
	 * @return array Modified file data.
	 */
	public function check_3d_model_filetype( $data, $_file, $filename, $_mimes ) {
		$ext = strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) );

		if ( 'glb' === $ext ) {
			$data['ext']  = 'glb';
			$data['type'] = 'model/gltf-binary';
		} elseif ( 'usdz' === $ext ) {
			$data['ext']  = 'usdz';
			$data['type'] = 'model/vnd.usdz+zip';
		}

		return $data;
	}

	// =========================================================================
	// Breadcrumb Block — Server-side helpers
	// =========================================================================

	/**
	 * Generate breadcrumb trail for the current page.
	 *
	 * @param array $attributes Block attributes.
	 * @return array Array of breadcrumb items.
	 */
	public static function get_breadcrumb_trail( $attributes ) {
		$trail = array();

		// Add home link if enabled.
		if ( $attributes['showHome'] ) {
			$trail[] = array(
				'title' => $attributes['homeText'],
				'url'   => home_url( '/' ),
			);
		}

		// Get current object.
		$queried_object = get_queried_object();

		if ( is_singular() ) {
			$post = $queried_object;

			// Handle hierarchical post types (pages).
			if ( is_post_type_hierarchical( $post->post_type ) ) {
				$ancestors = array_reverse( get_post_ancestors( $post ) );
				foreach ( $ancestors as $ancestor_id ) {
					$ancestor = get_post( $ancestor_id );
					$trail[]  = array(
						'title' => get_the_title( $ancestor ),
						'url'   => get_permalink( $ancestor ),
					);
				}
			} else {
				// For posts, add category hierarchy.
				$categories = get_the_category( $post->ID );
				if ( ! empty( $categories ) ) {
					$category = $categories[0];

					// Get category ancestors.
					if ( $category->parent ) {
						$cat_ancestors = array_reverse( get_ancestors( $category->term_id, 'category' ) );
						foreach ( $cat_ancestors as $ancestor_id ) {
							$ancestor = get_term( $ancestor_id, 'category' );
							$trail[]  = array(
								'title' => $ancestor->name,
								'url'   => get_term_link( $ancestor ),
							);
						}
					}

					$trail[] = array(
						'title' => $category->name,
						'url'   => get_term_link( $category ),
					);
				}

				// Add custom taxonomy terms for custom post types.
				if ( 'post' !== $post->post_type ) {
					$taxonomies = get_object_taxonomies( $post->post_type, 'objects' );
					foreach ( $taxonomies as $taxonomy ) {
						if ( $taxonomy->hierarchical ) {
							$terms = get_the_terms( $post->ID, $taxonomy->name );
							if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
								$term = $terms[0];
								if ( $term->parent ) {
									$term_ancestors = array_reverse( get_ancestors( $term->term_id, $taxonomy->name ) );
									foreach ( $term_ancestors as $ancestor_id ) {
										$ancestor = get_term( $ancestor_id, $taxonomy->name );
										$trail[]  = array(
											'title' => $ancestor->name,
											'url'   => get_term_link( $ancestor ),
										);
									}
								}
								$trail[] = array(
									'title' => $term->name,
									'url'   => get_term_link( $term ),
								);
								break;
							}
						}
					}
				}
			}

			// Add current page if enabled.
			if ( $attributes['showCurrent'] ) {
				$trail[] = array(
					'title' => get_the_title( $post ),
					'url'   => '',
				);
			}
		} elseif ( is_category() || is_tag() || is_tax() ) {
			$term = $queried_object;

			// Add parent terms.
			if ( $term->parent ) {
				$ancestors = array_reverse( get_ancestors( $term->term_id, $term->taxonomy ) );
				foreach ( $ancestors as $ancestor_id ) {
					$ancestor = get_term( $ancestor_id, $term->taxonomy );
					$trail[]  = array(
						'title' => $ancestor->name,
						'url'   => get_term_link( $ancestor ),
					);
				}
			}

			// Add current term if enabled.
			if ( $attributes['showCurrent'] ) {
				$trail[] = array(
					'title' => $term->name,
					'url'   => '',
				);
			}
		} elseif ( is_post_type_archive() ) {
			$post_type = get_post_type_object( get_query_var( 'post_type' ) );
			if ( $attributes['showCurrent'] && $post_type ) {
				$trail[] = array(
					'title' => $post_type->labels->name,
					'url'   => '',
				);
			}
		} elseif ( is_search() ) {
			if ( $attributes['showCurrent'] ) {
				$trail[] = array(
					// translators: %s is the search query string.
					'title' => sprintf( __( 'Search Results for: %s', 'saai-blocks' ), get_search_query() ),
					'url'   => '',
				);
			}
		} elseif ( is_404() ) {
			if ( $attributes['showCurrent'] ) {
				$trail[] = array(
					'title' => __( '404 Not Found', 'saai-blocks' ),
					'url'   => '',
				);
			}
		}

		return $trail;
	}

	/**
	 * Generate structured data for breadcrumbs.
	 *
	 * @param array $trail Breadcrumb trail.
	 * @return string JSON-LD structured data.
	 */
	public static function get_breadcrumb_structured_data( $trail ) {
		$items    = array();
		$position = 1;

		foreach ( $trail as $item ) {
			$list_item = array(
				'@type'    => 'ListItem',
				'position' => $position++,
				'name'     => $item['title'],
			);

			if ( ! empty( $item['url'] ) ) {
				$list_item['item'] = $item['url'];
			}

			$items[] = $list_item;
		}

		$structured_data = array(
			'@context'        => 'https://schema.org',
			'@type'           => 'BreadcrumbList',
			'itemListElement' => $items,
		);

		return wp_json_encode( $structured_data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT );
	}
}
