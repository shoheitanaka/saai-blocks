/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	PanelBody,
	RangeControl,
	Button,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props - Block properties.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		images,
		width,
		height,
		arrowVerticalPosition,
		arrowHorizontalPosition,
		arrowsOutside,
		dotsOutside,
		indicatorStyle,
	} = attributes;

	const [ currentIndex, setCurrentIndex ] = useState( 0 );

	const onSelectImages = ( media ) => {
		const newImages = media.map( ( img ) => ( {
			id: img.id,
			url: img.url,
			alt: img.alt || '',
		} ) );
		setAttributes( { images: newImages } );
		setCurrentIndex( 0 );
	};

	const removeImage = ( indexToRemove ) => {
		const newImages = images.filter(
			( img, index ) => index !== indexToRemove
		);
		setAttributes( { images: newImages } );
		if ( currentIndex >= newImages.length && newImages.length > 0 ) {
			setCurrentIndex( newImages.length - 1 );
		}
	};

	const moveImage = ( fromIndex, toIndex ) => {
		const newImages = [ ...images ];
		const [ movedImage ] = newImages.splice( fromIndex, 1 );
		newImages.splice( toIndex, 0, movedImage );
		setAttributes( { images: newImages } );
	};

	const nextImage = () => {
		if ( images.length > 0 ) {
			setCurrentIndex( ( currentIndex + 1 ) % images.length );
		}
	};

	const prevImage = () => {
		if ( images.length > 0 ) {
			setCurrentIndex(
				( currentIndex - 1 + images.length ) % images.length
			);
		}
	};

	const blockProps = useBlockProps( {
		className: `image-gallery-swiper ${
			arrowsOutside ? 'arrows-outside' : ''
		} ${ dotsOutside ? 'dots-outside' : '' } ${
			indicatorStyle === 'bars' ? 'indicator-bars' : 'indicator-dots'
		}`,
		style: {
			'--gallery-width': `${ width }px`,
			'--gallery-height': `${ height }px`,
			'--arrow-vertical-position': `${ arrowVerticalPosition }%`,
			'--arrow-horizontal-position': `${ arrowHorizontalPosition }px`,
		},
	} );

	if ( images.length === 0 ) {
		return (
			<div { ...blockProps }>
				<MediaPlaceholder
					icon="format-gallery"
					labels={ {
						title: __( 'Image Gallery Swiper', 'saai-blocks' ),
						instructions: __(
							'Upload or select images from your media library.',
							'saai-blocks'
						),
					} }
					onSelect={ onSelectImages }
					accept="image/*"
					allowedTypes={ [ 'image' ] }
					multiple
				/>
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Gallery Size', 'saai-blocks' ) }>
					<RangeControl
						label={ __( 'Width', 'saai-blocks' ) }
						value={ width }
						onChange={ ( value ) =>
							setAttributes( { width: value } )
						}
						min={ 100 }
						max={ 1000 }
						step={ 10 }
					/>
					<RangeControl
						label={ __( 'Height', 'saai-blocks' ) }
						value={ height }
						onChange={ ( value ) =>
							setAttributes( { height: value } )
						}
						min={ 100 }
						max={ 1000 }
						step={ 10 }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Navigation Layout', 'saai-blocks' ) }>
					<ToggleControl
						label={ __( 'Place Arrows Outside', 'saai-blocks' ) }
						checked={ arrowsOutside }
						onChange={ ( value ) =>
							setAttributes( { arrowsOutside: value } )
						}
						help={ __(
							'Position navigation arrows above the gallery',
							'saai-blocks'
						) }
					/>
					<ToggleControl
						label={ __( 'Place Dots Outside', 'saai-blocks' ) }
						checked={ dotsOutside }
						onChange={ ( value ) =>
							setAttributes( { dotsOutside: value } )
						}
						help={ __(
							'Position dot indicators below the gallery',
							'saai-blocks'
						) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Indicator Style', 'saai-blocks' ) }>
					<ToggleControl
						label={ __( 'Use Bar Style', 'saai-blocks' ) }
						checked={ indicatorStyle === 'bars' }
						onChange={ ( value ) =>
							setAttributes( {
								indicatorStyle: value ? 'bars' : 'dots',
							} )
						}
						help={ __(
							'Switch between dot and bar indicators',
							'saai-blocks'
						) }
					/>
					{ ! arrowsOutside && (
						<>
							<RangeControl
								label={ __(
									'Arrow Vertical Position (%)',
									'saai-blocks'
								) }
								value={ arrowVerticalPosition }
								onChange={ ( value ) =>
									setAttributes( {
										arrowVerticalPosition: value,
									} )
								}
								min={ 0 }
								max={ 100 }
								step={ 1 }
								help={ __(
									'Adjust the vertical position of the navigation arrows (0% = top, 50% = center, 100% = bottom)',
									'saai-blocks'
								) }
							/>
							<RangeControl
								label={ __(
									'Arrow Horizontal Distance (px)',
									'saai-blocks'
								) }
								value={ arrowHorizontalPosition }
								onChange={ ( value ) =>
									setAttributes( {
										arrowHorizontalPosition: value,
									} )
								}
								min={ 0 }
								max={ 100 }
								step={ 1 }
								help={ __(
									'Distance from the left/right edge of the gallery',
									'saai-blocks'
								) }
							/>
						</>
					) }
				</PanelBody>
				<PanelBody title={ __( 'Images', 'saai-blocks' ) }>
					{ images.map( ( image, index ) => (
						<div
							key={ image.id }
							style={ {
								marginBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								gap: '10px',
							} }
						>
							<img
								src={ image.url }
								alt={ image.alt }
								style={ {
									width: '50px',
									height: '50px',
									objectFit: 'cover',
								} }
							/>
							<span>
								{ __( 'Image', 'saai-blocks' ) } { index + 1 }
							</span>
							<Button
								isSmall
								onClick={ () => removeImage( index ) }
								variant="secondary"
							>
								{ __( 'Remove', 'saai-blocks' ) }
							</Button>
							{ index > 0 && (
								<Button
									isSmall
									onClick={ () =>
										moveImage( index, index - 1 )
									}
									variant="secondary"
								>
									↑
								</Button>
							) }
							{ index < images.length - 1 && (
								<Button
									isSmall
									onClick={ () =>
										moveImage( index, index + 1 )
									}
									variant="secondary"
								>
									↓
								</Button>
							) }
						</div>
					) ) }
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<ToolbarGroup>
					<MediaReplaceFlow
						allowedTypes={ [ 'image' ] }
						accept="image/*"
						onSelect={ onSelectImages }
						name={ __( 'Replace Images', 'saai-blocks' ) }
						multiple
					/>
				</ToolbarGroup>
			</BlockControls>

			<div { ...blockProps }>
				<div className="image-gallery-swiper__container">
					<div className="image-gallery-swiper__images">
						{ images.map( ( image, index ) => (
							<img
								key={ image.id }
								src={ image.url }
								alt={ image.alt }
								className={ `image-gallery-swiper__image ${
									index === currentIndex ? 'is-active' : ''
								}` }
								style={ {
									transform: `translateX(${
										( index - currentIndex ) * 100
									}%)`,
								} }
							/>
						) ) }
					</div>

					{ images.length > 1 && (
						<>
							<button
								type="button"
								className="image-gallery-swiper__nav image-gallery-swiper__nav--prev"
								onClick={ prevImage }
								aria-label={ __(
									'Previous image',
									'saai-blocks'
								) }
							>
								‹
							</button>
							<button
								type="button"
								className="image-gallery-swiper__nav image-gallery-swiper__nav--next"
								onClick={ nextImage }
								aria-label={ __( 'Next image', 'saai-blocks' ) }
							>
								›
							</button>

							<div className="image-gallery-swiper__dots">
								{ images.map( ( image, index ) => (
									<button
										key={ image.id }
										type="button"
										className={ `image-gallery-swiper__dot ${
											index === currentIndex
												? 'is-active'
												: ''
										}` }
										onClick={ () =>
											setCurrentIndex( index )
										}
										aria-label={
											__( 'Go to image', 'saai-blocks' ) +
											' ' +
											( index + 1 )
										}
									/>
								) ) }
							</div>
						</>
					) }
				</div>
			</div>
		</>
	);
}
