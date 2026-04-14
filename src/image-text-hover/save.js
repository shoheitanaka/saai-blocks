/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const { imageUrl, imageAlt, hoverText, overlayColor, overlayOpacity } =
		attributes;

	if ( ! imageUrl ) {
		return null;
	}

	const blockProps = useBlockProps.save( {
		className: 'saai-image-text-hover-block',
	} );

	const overlayStyle = {
		backgroundColor: `${ overlayColor }${ Math.round( overlayOpacity * 255 )
			.toString( 16 )
			.padStart( 2, '0' ) }`,
	};

	return (
		<div { ...blockProps }>
			<div className="saai-image-text-hover-container">
				<div className="saai-image-wrapper">
					<img
						src={ imageUrl }
						alt={ imageAlt }
						className="saai-hover-image"
					/>
					<div className="saai-hover-overlay" style={ overlayStyle }>
						<RichText.Content
							tagName="div"
							className="saai-hover-text"
							value={ hoverText }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
