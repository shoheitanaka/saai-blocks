<?php
/**
 * Plugin Name:       Telex Blocks
 * Description:       A collection of WordPress blocks by Telex — includes Breadcrumb Block Pro and Image Gallery Swiper Block.
 * Version:           0.1.0
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Author:            WordPress Telex
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       telex-blocks
 *
 * @package TelexBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'TELEX_BLOCKS_VERSION', '0.1.0' );
define( 'TELEX_BLOCKS_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Registers all blocks in the build directory.
 */
function telex_blocks_init() {
	$blocks = array(
		'breadcrumb-block',
		'hover-image-switcher',
	);

	foreach ( $blocks as $block ) {
		register_block_type( TELEX_BLOCKS_DIR . 'build/' . $block );
	}
}
add_action( 'init', 'telex_blocks_init' );

// =========================================================================
// Breadcrumb Block — Server-side helpers
// =========================================================================

/**
 * Generate breadcrumb trail for the current page.
 *
 * @param array $attributes Block attributes.
 * @return array Array of breadcrumb items.
 */
function telex_breadcrumb_get_trail( $attributes ) {
	$trail = array();

	// Add home link if enabled
	if ( $attributes['showHome'] ) {
		$trail[] = array(
			'title' => $attributes['homeText'],
			'url'   => home_url( '/' ),
		);
	}

	// Get current object
	$queried_object = get_queried_object();

	if ( is_singular() ) {
		$post = $queried_object;

		// Handle hierarchical post types (pages)
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
			// For posts, add category hierarchy
			$categories = get_the_category( $post->ID );
			if ( ! empty( $categories ) ) {
				$category = $categories[0];

				// Get category ancestors
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

			// Add custom taxonomy terms for custom post types
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

		// Add current page if enabled
		if ( $attributes['showCurrent'] ) {
			$trail[] = array(
				'title' => get_the_title( $post ),
				'url'   => '',
			);
		}
	} elseif ( is_category() || is_tag() || is_tax() ) {
		$term = $queried_object;

		// Add parent terms
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

		// Add current term if enabled
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
function telex_breadcrumb_get_structured_data( $trail ) {
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
