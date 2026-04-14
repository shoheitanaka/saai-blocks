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
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button, TextControl, Placeholder } from '@wordpress/components';

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
 * @param {Object} props Block props
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		pcImageId,
		pcImageUrl,
		pcImageAlt,
		tabletImageId,
		tabletImageUrl,
		tabletImageAlt,
		smartphoneImageId,
		smartphoneImageUrl,
		smartphoneImageAlt,
	} = attributes;

	const onSelectPcImage = ( media ) => {
		setAttributes( {
			pcImageId: media.id,
			pcImageUrl: media.url,
			pcImageAlt: media.alt || '',
		} );
	};

	const onSelectTabletImage = ( media ) => {
		setAttributes( {
			tabletImageId: media.id,
			tabletImageUrl: media.url,
			tabletImageAlt: media.alt || '',
		} );
	};

	const onSelectSmartphoneImage = ( media ) => {
		setAttributes( {
			smartphoneImageId: media.id,
			smartphoneImageUrl: media.url,
			smartphoneImageAlt: media.alt || '',
		} );
	};

	const removePcImage = () => {
		setAttributes( {
			pcImageId: undefined,
			pcImageUrl: undefined,
			pcImageAlt: '',
		} );
	};

	const removeTabletImage = () => {
		setAttributes( {
			tabletImageId: undefined,
			tabletImageUrl: undefined,
			tabletImageAlt: '',
		} );
	};

	const removeSmartphoneImage = () => {
		setAttributes( {
			smartphoneImageId: undefined,
			smartphoneImageUrl: undefined,
			smartphoneImageAlt: '',
		} );
	};

	const ImageUploadArea = ( {
		label,
		imageUrl,
		imageId,
		onSelect,
		onRemove,
		altText,
		onAltChange,
		isRequired,
		fallbackUrl,
	} ) => {
		const displayUrl = imageUrl || fallbackUrl;
		const isFallback = ! imageUrl && fallbackUrl;

		return (
			<div className="responsive-device-image-upload-area">
				<div className="upload-label">
					{ label }
					{ isRequired && (
						<span className="required-badge">
							{ __( 'Required', 'saai-blocks' ) }
						</span>
					) }
					{ ! isRequired && (
						<span className="optional-badge">
							{ __( 'Optional', 'saai-blocks' ) }
						</span>
					) }
				</div>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelect }
						allowedTypes={ [ 'image' ] }
						value={ imageId }
						render={ ( { open } ) => (
							<div className="image-container">
								{ displayUrl ? (
									<div
										className={ `image-preview ${
											isFallback ? 'fallback' : ''
										}` }
									>
										<img
											src={ displayUrl }
											alt={ altText }
										/>
										{ isFallback && (
											<div className="fallback-overlay">
												<span>
													{ __(
														'Using PC image',
														'saai-blocks'
													) }
												</span>
											</div>
										) }
										<div className="image-actions">
											<Button
												onClick={ open }
												variant="secondary"
											>
												{ imageUrl
													? __(
															'Change Image',
															'saai-blocks'
													  )
													: __(
															'Select Image',
															'saai-blocks'
													  ) }
											</Button>
											{ imageUrl && (
												<Button
													onClick={ onRemove }
													variant="secondary"
													isDestructive
												>
													{ __(
														'Remove Image',
														'saai-blocks'
													) }
												</Button>
											) }
										</div>
									</div>
								) : (
									<Placeholder
										icon="format-image"
										label={ __(
											'Select an image',
											'saai-blocks'
										) }
										instructions={
											isRequired
												? __(
														'This image is required',
														'saai-blocks'
												  )
												: __(
														'If not selected, the PC image will be used',
														'saai-blocks'
												  )
										}
									>
										<Button
											onClick={ open }
											variant="primary"
										>
											{ __(
												'Select Image',
												'saai-blocks'
											) }
										</Button>
									</Placeholder>
								) }
							</div>
						) }
					/>
				</MediaUploadCheck>
				{ imageUrl && (
					<TextControl
						label={ __( 'Alt Text', 'saai-blocks' ) }
						value={ altText }
						onChange={ onAltChange }
						placeholder={ __(
							'Enter a description for the image',
							'saai-blocks'
						) }
					/>
				) }
			</div>
		);
	};

	return (
		<div { ...useBlockProps() }>
			<div className="responsive-device-image-editor">
				<ImageUploadArea
					label={ __( 'PC Image', 'saai-blocks' ) }
					imageUrl={ pcImageUrl }
					imageId={ pcImageId }
					onSelect={ onSelectPcImage }
					onRemove={ removePcImage }
					altText={ pcImageAlt }
					onAltChange={ ( value ) =>
						setAttributes( { pcImageAlt: value } )
					}
					isRequired={ true }
				/>

				<ImageUploadArea
					label={ __( 'Tablet Image', 'saai-blocks' ) }
					imageUrl={ tabletImageUrl }
					imageId={ tabletImageId }
					onSelect={ onSelectTabletImage }
					onRemove={ removeTabletImage }
					altText={ tabletImageAlt }
					onAltChange={ ( value ) =>
						setAttributes( { tabletImageAlt: value } )
					}
					isRequired={ false }
					fallbackUrl={ pcImageUrl }
				/>

				<ImageUploadArea
					label={ __( 'Smartphone Image', 'saai-blocks' ) }
					imageUrl={ smartphoneImageUrl }
					imageId={ smartphoneImageId }
					onSelect={ onSelectSmartphoneImage }
					onRemove={ removeSmartphoneImage }
					altText={ smartphoneImageAlt }
					onAltChange={ ( value ) =>
						setAttributes( { smartphoneImageAlt: value } )
					}
					isRequired={ false }
					fallbackUrl={ pcImageUrl }
				/>
			</div>
		</div>
	);
}
