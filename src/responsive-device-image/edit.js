
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
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, TextControl, Placeholder } from '@wordpress/components';
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

	const ImageUploadArea = ( { label, imageUrl, imageId, onSelect, onRemove, altText, onAltChange, isRequired, fallbackUrl } ) => {
		const displayUrl = imageUrl || fallbackUrl;
		const isFallback = !imageUrl && fallbackUrl;

		return (
			<div className="responsive-device-image-upload-area">
				<div className="upload-label">
					{ label }
					{ isRequired && <span className="required-badge">{ __( '必須', 'saai-blocks' ) }</span> }
					{ ! isRequired && <span className="optional-badge">{ __( '任意', 'saai-blocks' ) }</span> }
				</div>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelect }
						allowedTypes={ [ 'image' ] }
						value={ imageId }
						render={ ( { open } ) => (
							<div className="image-container">
								{ displayUrl ? (
									<div className={ `image-preview ${ isFallback ? 'fallback' : '' }` }>
										<img src={ displayUrl } alt={ altText } />
										{ isFallback && (
											<div className="fallback-overlay">
												<span>{ __( 'PC用画像を使用', 'saai-blocks' ) }</span>
											</div>
										) }
										<div className="image-actions">
											<Button onClick={ open } variant="secondary">
												{ imageUrl ? __( '画像を変更', 'saai-blocks' ) : __( '画像を選択', 'saai-blocks' ) }
											</Button>
											{ imageUrl && (
												<Button onClick={ onRemove } variant="secondary" isDestructive>
													{ __( '画像を削除', 'saai-blocks' ) }
												</Button>
											) }
										</div>
									</div>
								) : (
									<Placeholder
										icon="format-image"
										label={ __( '画像を選択してください', 'saai-blocks' ) }
										instructions={ isRequired ? __( 'この画像は必須です', 'saai-blocks' ) : __( '未選択の場合はPC用画像を使用します', 'saai-blocks' ) }
									>
										<Button onClick={ open } variant="primary">
											{ __( '画像を選択', 'saai-blocks' ) }
										</Button>
									</Placeholder>
								) }
							</div>
						) }
					/>
				</MediaUploadCheck>
				{ imageUrl && (
					<TextControl
						label={ __( 'Alt属性', 'saai-blocks' ) }
						value={ altText }
						onChange={ onAltChange }
						placeholder={ __( '画像の説明を入力', 'saai-blocks' ) }
					/>
				) }
			</div>
		);
	};

	return (
		<div { ...useBlockProps() }>
			<div className="responsive-device-image-editor">
				<ImageUploadArea
					label={ __( 'PC用画像', 'saai-blocks' ) }
					imageUrl={ pcImageUrl }
					imageId={ pcImageId }
					onSelect={ onSelectPcImage }
					onRemove={ removePcImage }
					altText={ pcImageAlt }
					onAltChange={ ( value ) => setAttributes( { pcImageAlt: value } ) }
					isRequired={ true }
				/>

				<ImageUploadArea
					label={ __( 'タブレット用画像', 'saai-blocks' ) }
					imageUrl={ tabletImageUrl }
					imageId={ tabletImageId }
					onSelect={ onSelectTabletImage }
					onRemove={ removeTabletImage }
					altText={ tabletImageAlt }
					onAltChange={ ( value ) => setAttributes( { tabletImageAlt: value } ) }
					isRequired={ false }
					fallbackUrl={ pcImageUrl }
				/>

				<ImageUploadArea
					label={ __( 'スマートフォン用画像', 'saai-blocks' ) }
					imageUrl={ smartphoneImageUrl }
					imageId={ smartphoneImageId }
					onSelect={ onSelectSmartphoneImage }
					onRemove={ removeSmartphoneImage }
					altText={ smartphoneImageAlt }
					onAltChange={ ( value ) => setAttributes( { smartphoneImageAlt: value } ) }
					isRequired={ false }
					fallbackUrl={ pcImageUrl }
				/>
			</div>
		</div>
	);
}
