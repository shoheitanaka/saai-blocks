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
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Button,
	Placeholder,
	PanelBody,
	RangeControl,
	ColorPicker,
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
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		imageUrl,
		imageId,
		imageAlt,
		hoverText,
		overlayColor,
		overlayOpacity,
	} = attributes;
	const [ isHovering, setIsHovering ] = useState( false );

	const onSelectImage = ( media ) => {
		setAttributes( {
			imageUrl: media.url,
			imageId: media.id,
			imageAlt: media.alt || '',
		} );
	};

	const onRemoveImage = () => {
		setAttributes( {
			imageUrl: '',
			imageId: 0,
			imageAlt: '',
		} );
	};

	const onChangeHoverText = ( newText ) => {
		setAttributes( { hoverText: newText } );
	};

	const onChangeOverlayColor = ( color ) => {
		setAttributes( { overlayColor: color.hex } );
	};

	const onChangeOverlayOpacity = ( opacity ) => {
		setAttributes( { overlayOpacity: opacity } );
	};

	const blockProps = useBlockProps( {
		className: 'saai-image-text-hover-block',
	} );

	const overlayStyle = {
		backgroundColor: `${ overlayColor }${ Math.round( overlayOpacity * 255 )
			.toString( 16 )
			.padStart( 2, '0' ) }`,
	};

	// If no image is selected, show the upload placeholder
	if ( ! imageUrl ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon="format-image"
					label={ __( 'Image Text Hover Block', 'saai-blocks' ) }
					instructions={ __(
						'Upload an image to get started',
						'saai-blocks'
					) }
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImage }
							allowedTypes={ [ 'image' ] }
							value={ imageId }
							render={ ( { open } ) => (
								<Button variant="primary" onClick={ open }>
									{ __( 'Upload Image', 'saai-blocks' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
				</Placeholder>
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Overlay Settings', 'saai-blocks' ) }
					initialOpen={ true }
				>
					<p style={ { marginBottom: '8px', fontWeight: 500 } }>
						{ __( 'Overlay Color', 'saai-blocks' ) }
					</p>
					<ColorPicker
						color={ overlayColor }
						onChangeComplete={ onChangeOverlayColor }
						enableAlpha={ false }
					/>
					<RangeControl
						label={ __( 'Overlay Opacity', 'saai-blocks' ) }
						value={ overlayOpacity }
						onChange={ onChangeOverlayOpacity }
						min={ 0 }
						max={ 1 }
						step={ 0.05 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div
					className="saai-image-text-hover-container"
					onMouseEnter={ () => setIsHovering( true ) }
					onMouseLeave={ () => setIsHovering( false ) }
				>
					<div className="saai-image-wrapper">
						<img
							src={ imageUrl }
							alt={ imageAlt }
							className="saai-hover-image"
						/>
						<div
							className={ `saai-hover-overlay ${
								isHovering ? 'is-hovering' : ''
							}` }
							style={ overlayStyle }
						>
							<RichText
								tagName="div"
								className="saai-hover-text"
								value={ hoverText }
								onChange={ onChangeHoverText }
								placeholder={ __(
									'Add hover text…',
									'saai-blocks'
								) }
							/>
						</div>
					</div>
					<div className="saai-block-controls">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectImage }
								allowedTypes={ [ 'image' ] }
								value={ imageId }
								render={ ( { open } ) => (
									<Button
										variant="secondary"
										onClick={ open }
									>
										{ __( 'Change Image', 'saai-blocks' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
						<Button
							variant="tertiary"
							isDestructive
							onClick={ onRemoveImage }
						>
							{ __( 'Remove Image', 'saai-blocks' ) }
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
