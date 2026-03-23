<?php
/**
 * Render callback for the 3D Model Viewer block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#render
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content.
 * @var WP_Block $block      Block instance.
 *
 * @package SAAI_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$saai_glb_url          = isset( $attributes['glbUrl'] ) ? esc_url( $attributes['glbUrl'] ) : '';
$saai_usdz_url         = isset( $attributes['usdzUrl'] ) ? esc_url( $attributes['usdzUrl'] ) : '';
$saai_viewer_height    = isset( $attributes['viewerHeight'] ) ? esc_attr( $attributes['viewerHeight'] ) : '400px';
$saai_background_color = isset( $attributes['backgroundColor'] ) ? esc_attr( $attributes['backgroundColor'] ) : '#ffffff';
$saai_auto_rotate      = isset( $attributes['autoRotate'] ) ? (bool) $attributes['autoRotate'] : true;

if ( empty( $saai_glb_url ) ) {
	return '';
}

$saai_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'style' => 'background-color:' . $saai_background_color . ';',
	)
);

?>
<div <?php echo $saai_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is safe. ?>>
	<div class="saai-3d-model-viewer__container" style="height:<?php echo esc_attr( $saai_viewer_height ); ?>;">
		<model-viewer
			src="<?php echo esc_url( $saai_glb_url ); ?>"
			<?php if ( ! empty( $saai_usdz_url ) ) : ?>
			ios-src="<?php echo esc_url( $saai_usdz_url ); ?>"
			<?php endif; ?>
			style="width:100%;height:100%;background-color:<?php echo esc_attr( $saai_background_color ); ?>;"
			camera-controls
			<?php if ( $saai_auto_rotate ) : ?>
			auto-rotate
			<?php endif; ?>
			ar
			ar-modes="webxr scene-viewer quick-look"
		></model-viewer>
	</div>
</div>
