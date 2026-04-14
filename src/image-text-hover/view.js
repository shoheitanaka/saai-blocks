/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

document.addEventListener( 'DOMContentLoaded', function () {
	const blocks = document.querySelectorAll(
		'.wp-block-saai-block-saai-image-text-hover'
	);

	blocks.forEach( function ( block ) {
		const container = block.querySelector( '.saai-image-wrapper' );
		const overlay = block.querySelector( '.saai-hover-overlay' );

		if ( ! container || ! overlay ) {
			return;
		}

		// Check if device supports hover
		const supportsHover = window.matchMedia(
			'(hover: hover) and (pointer: fine)'
		).matches;

		if ( ! supportsHover ) {
			// Touch device: toggle overlay on tap
			let isActive = false;

			container.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				isActive = ! isActive;

				if ( isActive ) {
					overlay.classList.add( 'is-active' );
				} else {
					overlay.classList.remove( 'is-active' );
				}
			} );

			// Close overlay when clicking outside
			document.addEventListener( 'click', function ( e ) {
				if ( ! block.contains( e.target ) && isActive ) {
					isActive = false;
					overlay.classList.remove( 'is-active' );
				}
			} );
		} else {
			// Desktop: use hover
			container.addEventListener( 'mouseenter', function () {
				overlay.classList.add( 'is-hovering' );
			} );

			container.addEventListener( 'mouseleave', function () {
				overlay.classList.remove( 'is-hovering' );
			} );
		}

		// Keyboard accessibility
		container.setAttribute( 'tabindex', '0' );
		container.setAttribute( 'role', 'button' );
		container.setAttribute( 'aria-label', 'Show hover text' );

		container.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Enter' || e.key === ' ' ) {
				e.preventDefault();
				const isCurrentlyActive =
					overlay.classList.contains( 'is-active' );

				if ( isCurrentlyActive ) {
					overlay.classList.remove( 'is-active' );
				} else {
					overlay.classList.add( 'is-active' );
				}
			}
		} );

		container.addEventListener( 'blur', function () {
			overlay.classList.remove( 'is-active' );
		} );
	} );
} );
