<?php
/**
 * Render the breadcrumb block.
 *
 * @package saai-blocks
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$trail = SAAI_Blocks::get_breadcrumb_trail( $attributes );

if ( empty( $trail ) ) {
	return '';
}

$separator  = isset( $attributes['separator'] ) ? $attributes['separator'] : '/';
$text_color = isset( $attributes['textColor'] ) ? $attributes['textColor'] : '#333333';
$link_color = isset( $attributes['linkColor'] ) ? $attributes['linkColor'] : '#0073aa';

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'aria-label' => esc_attr__( 'Breadcrumb', 'saai-blocks' ),
		'style'      => sprintf(
			'--breadcrumb-text-color: %s; --breadcrumb-link-color: %s;',
			esc_attr( $text_color ),
			esc_attr( $link_color )
		),
	)
);

$structured_data = SAAI_Blocks::get_breadcrumb_structured_data( $trail );
?>

<nav <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<ol class="saai-breadcrumb-list">
		<?php foreach ( $trail as $index => $item ) : ?>
			<li class="saai-breadcrumb-item">
				<?php if ( ! empty( $item['url'] ) ) : ?>
					<a href="<?php echo esc_url( $item['url'] ); ?>" class="saai-breadcrumb-link">
						<?php echo esc_html( $item['title'] ); ?>
					</a>
					<?php if ( $index < count( $trail ) - 1 ) : ?>
						<span class="saai-breadcrumb-separator" aria-hidden="true">
							<?php echo esc_html( $separator ); ?>
						</span>
					<?php endif; ?>
				<?php else : ?>
					<span class="saai-breadcrumb-current">
						<?php echo esc_html( $item['title'] ); ?>
					</span>
				<?php endif; ?>
			</li>
		<?php endforeach; ?>
	</ol>
	<script type="application/ld+json">
		<?php echo wp_kses_post( $structured_data ); ?>
	</script>
</nav>
