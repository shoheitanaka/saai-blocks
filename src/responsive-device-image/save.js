
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props Block props
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const {
		pcImageUrl,
		pcImageAlt,
		tabletImageUrl,
		tabletImageAlt,
		smartphoneImageUrl,
		smartphoneImageAlt,
	} = attributes;

	if ( ! pcImageUrl ) {
		return null;
	}

	const smartphoneUrl = smartphoneImageUrl || pcImageUrl;
	const smartphoneAlt = smartphoneImageUrl ? smartphoneImageAlt : pcImageAlt;

	const tabletUrl = tabletImageUrl || pcImageUrl;
	const tabletAlt = tabletImageUrl ? tabletImageAlt : pcImageAlt;

	return (
		<div { ...useBlockProps.save() }>
			<div className="responsive-device-image">
				<img
					className="responsive-device-image__smartphone"
					src={ smartphoneUrl }
					alt={ smartphoneAlt }
				/>
				<img
					className="responsive-device-image__tablet"
					src={ tabletUrl }
					alt={ tabletAlt }
				/>
				<img
					className="responsive-device-image__pc"
					src={ pcImageUrl }
					alt={ pcImageAlt }
				/>
			</div>
		</div>
	);
}
