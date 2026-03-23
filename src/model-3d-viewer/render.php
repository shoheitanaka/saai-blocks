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

$glb_url          = isset( $attributes['glbUrl'] ) ? esc_url( $attributes['glbUrl'] ) : '';
$usdz_url         = isset( $attributes['usdzUrl'] ) ? esc_url( $attributes['usdzUrl'] ) : '';
$viewer_height    = isset( $attributes['viewerHeight'] ) ? esc_attr( $attributes['viewerHeight'] ) : '400px';
$background_color = isset( $attributes['backgroundColor'] ) ? esc_attr( $attributes['backgroundColor'] ) : '#ffffff';
$auto_rotate      = isset( $attributes['autoRotate'] ) ? (bool) $attributes['autoRotate'] : true;

if ( empty( $glb_url ) ) {
	return '';
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'style' => 'background-color:' . $background_color . ';',
	)
);

$model_attrs  = ' src="' . $glb_url . '"';
$model_attrs .= ' camera-controls';

if ( ! empty( $usdz_url ) ) {
	$model_attrs .= ' ios-src="' . $usdz_url . '"';
}

if ( $auto_rotate ) {
	$model_attrs .= ' auto-rotate';
}

$model_attrs .= ' ar';
$model_attrs .= ' ar-modes="webxr scene-viewer quick-look"';
$model_attrs .= ' style="width:100%;height:100%;background-color:' . $background_color . ';"';
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is safe. ?>>
	<div class="saai-3d-model-viewer__container" style="height:<?php echo esc_attr( $viewer_height ); ?>;">
		<model-viewer<?php echo $model_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- all values are escaped above. ?>></model-viewer>
	</div>
</div>
