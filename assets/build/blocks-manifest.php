<?php
// This file is generated. Do not modify it manually.
return array(
	'breadcrumb-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'saai-blocks/breadcrumb-block',
		'version' => '0.1.0',
		'title' => 'Breadcrumb Block Pro',
		'category' => 'widgets',
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
		'version' => '0.1.0',
		'title' => 'Image Gallery Swiper',
		'category' => 'media',
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
	)
);
