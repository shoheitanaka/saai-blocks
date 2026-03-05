<?php
/**
 * Render the breadcrumb block.
 *
 * @package saai-blocks
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$saai_trail = SAAI_Blocks::get_breadcrumb_trail( $attributes );

if ( empty( $saai_trail ) ) {
	return '';
}

$saai_separator  = isset( $attributes['separator'] ) ? $attributes['separator'] : '/';
$saai_text_color = isset( $attributes['textColor'] ) ? $attributes['textColor'] : '#333333';
$saai_link_color = isset( $attributes['linkColor'] ) ? $attributes['linkColor'] : '#0073aa';

$saai_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'aria-label' => esc_attr__( 'Breadcrumb', 'saai-blocks' ),
		'style'      => sprintf(
			'--breadcrumb-text-color: %s; --breadcrumb-link-color: %s;',
			esc_attr( $saai_text_color ),
			esc_attr( $saai_link_color )
		),
	)
);

$saai_structured_data = SAAI_Blocks::get_breadcrumb_structured_data( $saai_trail );
?>

<nav <?php echo wp_kses_post( $saai_wrapper_attributes ); ?>>
	<ol class="saai-breadcrumb-list">
		<?php foreach ( $saai_trail as $saai_index => $saai_item ) : ?>
			<li class="saai-breadcrumb-item">
				<?php if ( ! empty( $saai_item['url'] ) ) : ?>
					<a href="<?php echo esc_url( $saai_item['url'] ); ?>" class="saai-breadcrumb-link">
						<?php echo esc_html( $saai_item['title'] ); ?>
					</a>
					<?php if ( $saai_index < count( $saai_trail ) - 1 ) : ?>
						<span class="saai-breadcrumb-separator" aria-hidden="true">
							<?php echo esc_html( $saai_separator ); ?>
						</span>
					<?php endif; ?>
				<?php else : ?>
					<span class="saai-breadcrumb-current">
						<?php echo esc_html( $saai_item['title'] ); ?>
					</span>
				<?php endif; ?>
			</li>
		<?php endforeach; ?>
	</ol>
	<script type="application/ld+json">
		<?php echo wp_kses_post( $saai_structured_data ); ?>
	</script>
</nav>
