<?php
// This file is generated. Do not modify it manually.
return array(
	'3d-model-viewer' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'saai-blocks/3d-model-viewer',
		'version' => '1.0.0',
		'title' => '3D Model Viewer Block',
		'category' => 'saai-blocks',
		'icon' => 'format-image',
		'description' => 'Display interactive 3D models using Google\'s model-viewer. Upload GLB and USDZ files with camera controls, auto-rotate, and AR support.',
		'example' => array(
			'attributes' => array(
				'glbUrl' => '',
				'usdzUrl' => '',
				'viewerHeight' => '400px',
				'backgroundColor' => '#ffffff',
				'autoRotate' => true
			)
		),
		'attributes' => array(
			'glbUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'glbId' => array(
				'type' => 'number',
				'default' => 0
			),
			'glbFilename' => array(
				'type' => 'string',
				'default' => ''
			),
			'usdzUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'usdzId' => array(
				'type' => 'number',
				'default' => 0
			),
			'usdzFilename' => array(
				'type' => 'string',
				'default' => ''
			),
			'viewerHeight' => array(
				'type' => 'string',
				'default' => '400px'
			),
			'backgroundColor' => array(
				'type' => 'string',
				'default' => '#ffffff'
			),
			'autoRotate' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			)
		),
		'textdomain' => 'saai-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'breadcrumb-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'saai-blocks/breadcrumb-block',
		'version' => '1.0.0',
		'title' => 'Breadcrumb Block',
		'category' => 'saai-blocks',
		'icon' => 'admin-site',
		'description' => 'Display breadcrumb navigation with customizable separators, colors, and SEO-friendly structured data.',
		'example' => array(
			'attributes' => array(
				'separator' => '/',
				'showHome' => true,
				'showCurrent' => true,
				'textColor' => '#333333',
				'linkColor' => '#0073aa'
			)
		),
		'attributes' => array(
			'separator' => array(
				'type' => 'string',
				'default' => '/'
			),
			'showHome' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showCurrent' => array(
				'type' => 'boolean',
				'default' => true
			),
			'homeText' => array(
				'type' => 'string',
				'default' => 'Home'
			),
			'textColor' => array(
				'type' => 'string',
				'default' => '#333333'
			),
			'linkColor' => array(
				'type' => 'string',
				'default' => '#0073aa'
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'textdomain' => 'saai-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'hover-image-switcher' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'saai-blocks/hover-image-switcher',
		'version' => '1.0.0',
		'title' => 'Image Gallery Swiper',
		'category' => 'saai-blocks',
		'icon' => 'format-gallery',
		'description' => 'Display a swipeable image gallery with multiple images.',
		'example' => array(
			'attributes' => array(
				'images' => array(
					array(
						'id' => 1,
						'url' => 'https://via.placeholder.com/600x800',
						'alt' => 'Image 1'
					),
					array(
						'id' => 2,
						'url' => 'https://via.placeholder.com/600x800/0000FF',
						'alt' => 'Image 2'
					)
				)
			)
		),
		'attributes' => array(
			'images' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object'
				)
			),
			'width' => array(
				'type' => 'number',
				'default' => 300
			),
			'height' => array(
				'type' => 'number',
				'default' => 400
			),
			'arrowVerticalPosition' => array(
				'type' => 'number',
				'default' => 50
			),
			'arrowHorizontalPosition' => array(
				'type' => 'number',
				'default' => 10
			),
			'arrowsOutside' => array(
				'type' => 'boolean',
				'default' => false
			),
			'dotsOutside' => array(
				'type' => 'boolean',
				'default' => false
			),
			'indicatorStyle' => array(
				'type' => 'string',
				'default' => 'dots'
			)
		),
		'supports' => array(
			'html' => false,
			'align' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'textdomain' => 'saai-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'image-text-hover' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'saai-blocks/image-text-hover',
		'version' => '0.1.0',
		'title' => 'Image Text Hover Block',
		'category' => 'saai-blocks',
		'icon' => 'format-image',
		'description' => 'An interactive image block that displays overlay text on hover with smooth transitions.',
		'example' => array(
			'attributes' => array(
				'imageUrl' => 'https://placehold.co/600x400/3498db/ffffff?text=Hover+Me',
				'imageAlt' => 'Example image',
				'hoverText' => '<p>This text appears on hover with a smooth fade effect</p>'
			)
		),
		'attributes' => array(
			'imageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'hoverText' => array(
				'type' => 'string',
				'default' => ''
			),
			'overlayColor' => array(
				'type' => 'string',
				'default' => '#000000'
			),
			'overlayOpacity' => array(
				'type' => 'number',
				'default' => 0.85
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'textdomain' => 'saai-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'model-3d-viewer' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'saai-blocks/model-3d-viewer',
		'version' => '1.0.0',
		'title' => '3D Model Viewer Block',
		'category' => 'saai-blocks',
		'icon' => 'format-image',
		'description' => 'Display interactive 3D models using Google\'s model-viewer. Upload GLB and USDZ files with camera controls, auto-rotate, and AR support.',
		'example' => array(
			'attributes' => array(
				'glbUrl' => '',
				'usdzUrl' => '',
				'viewerHeight' => '400px',
				'backgroundColor' => '#ffffff',
				'autoRotate' => true
			)
		),
		'attributes' => array(
			'glbUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'glbId' => array(
				'type' => 'number',
				'default' => 0
			),
			'glbFilename' => array(
				'type' => 'string',
				'default' => ''
			),
			'usdzUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'usdzId' => array(
				'type' => 'number',
				'default' => 0
			),
			'usdzFilename' => array(
				'type' => 'string',
				'default' => ''
			),
			'viewerHeight' => array(
				'type' => 'string',
				'default' => '400px'
			),
			'backgroundColor' => array(
				'type' => 'string',
				'default' => '#ffffff'
			),
			'autoRotate' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			)
		),
		'textdomain' => 'saai-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'responsive-device-image' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'saai-blocks/responsive-device-image',
		'version' => '1.0.0',
		'title' => 'Responsive Device Image Block',
		'category' => 'saai-blocks',
		'icon' => 'format-image',
		'description' => 'Display different images for PC, tablet, and smartphone devices',
		'example' => array(
			
		),
		'attributes' => array(
			'pcImageId' => array(
				'type' => 'number'
			),
			'pcImageUrl' => array(
				'type' => 'string'
			),
			'pcImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'tabletImageId' => array(
				'type' => 'number'
			),
			'tabletImageUrl' => array(
				'type' => 'string'
			),
			'tabletImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'smartphoneImageId' => array(
				'type' => 'number'
			),
			'smartphoneImageUrl' => array(
				'type' => 'string'
			),
			'smartphoneImageAlt' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			)
		),
		'textdomain' => 'saai-blocks',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	)
);
