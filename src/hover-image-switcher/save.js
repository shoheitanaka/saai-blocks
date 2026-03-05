
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
 * @param {Object} props - Block properties.
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
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

	if ( images.length === 0 ) {
		return null;
	}

	const blockProps = useBlockProps.save( {
		className: `image-gallery-swiper ${arrowsOutside ? 'arrows-outside' : ''} ${dotsOutside ? 'dots-outside' : ''} ${indicatorStyle === 'bars' ? 'indicator-bars' : 'indicator-dots'}`,
		style: {
			'--gallery-width': `${width}px`,
			'--gallery-height': `${height}px`,
			'--arrow-vertical-position': `${arrowVerticalPosition}%`,
			'--arrow-horizontal-position': `${arrowHorizontalPosition}px`,
		},
	} );

	return (
		<div { ...blockProps }>
			<div className="image-gallery-swiper__container" data-current-index="0">
				<div className="image-gallery-swiper__images">
					{ images.map( ( image, index ) => (
						<img
							key={ image.id }
							src={ image.url }
							alt={ image.alt }
							className={ `image-gallery-swiper__image ${ index === 0 ? 'is-active' : '' }` }
							data-index={ index }
						/>
					) ) }
				</div>

				{ images.length > 1 && (
					<>
						<button
							type="button"
							className="image-gallery-swiper__nav image-gallery-swiper__nav--prev"
							aria-label="Previous image"
						>
							‹
						</button>
						<button
							type="button"
							className="image-gallery-swiper__nav image-gallery-swiper__nav--next"
							aria-label="Next image"
						>
							›
						</button>

						<div className="image-gallery-swiper__dots">
							{ images.map( ( image, index ) => (
								<button
									key={ image.id }
									type="button"
									className={ `image-gallery-swiper__dot ${ index === 0 ? 'is-active' : '' }` }
									data-index={ index }
									aria-label={ `Go to image ${ index + 1 }` }
								/>
							) ) }
						</div>
					</>
				) }
			</div>
		</div>
	);
}
