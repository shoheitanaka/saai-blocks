
/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 */

document.addEventListener( 'DOMContentLoaded', function () {
	const galleries = document.querySelectorAll(
		'.wp-block-saai-blocks .image-gallery-swiper__container'
	);

	galleries.forEach( function ( gallery ) {
		const images = gallery.querySelectorAll( '.image-gallery-swiper__image' );
		const prevButton = gallery.querySelector( '.image-gallery-swiper__nav--prev' );
		const nextButton = gallery.querySelector( '.image-gallery-swiper__nav--next' );
		const dots = gallery.querySelectorAll( '.image-gallery-swiper__dot' );
		let currentIndex = 0;
		let startX = 0;
		let isDragging = false;

		function showImage( index ) {
			if ( index < 0 ) {
				index = images.length - 1;
			} else if ( index >= images.length ) {
				index = 0;
			}

			images.forEach( function ( img, i ) {
				img.classList.toggle( 'is-active', i === index );
			} );

			dots.forEach( function ( dot, i ) {
				dot.classList.toggle( 'is-active', i === index );
			} );

			currentIndex = index;
			gallery.setAttribute( 'data-current-index', index );
		}

		if ( prevButton ) {
			prevButton.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				showImage( currentIndex - 1 );
			} );
		}

		if ( nextButton ) {
			nextButton.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				showImage( currentIndex + 1 );
			} );
		}

		dots.forEach( function ( dot ) {
			dot.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				const index = parseInt( this.getAttribute( 'data-index' ), 10 );
				showImage( index );
			} );
		} );

		// Touch and mouse drag support
		const imagesContainer = gallery.querySelector( '.image-gallery-swiper__images' );

		function handleStart( e ) {
			isDragging = true;
			startX = e.type.includes( 'mouse' ) ? e.pageX : e.touches[ 0 ].pageX;
		}

		function handleMove( e ) {
			if ( ! isDragging ) {
				return;
			}
			e.preventDefault();
		}

		function handleEnd( e ) {
			if ( ! isDragging ) {
				return;
			}
			isDragging = false;

			const endX = e.type.includes( 'mouse' ) ? e.pageX : e.changedTouches[ 0 ].pageX;
			const diff = startX - endX;
			const threshold = 50;

			if ( Math.abs( diff ) > threshold ) {
				if ( diff > 0 ) {
					showImage( currentIndex + 1 );
				} else {
					showImage( currentIndex - 1 );
				}
			}
		}

		imagesContainer.addEventListener( 'mousedown', handleStart );
		imagesContainer.addEventListener( 'mousemove', handleMove );
		imagesContainer.addEventListener( 'mouseup', handleEnd );
		imagesContainer.addEventListener( 'mouseleave', function () {
			isDragging = false;
		} );

		imagesContainer.addEventListener( 'touchstart', handleStart );
		imagesContainer.addEventListener( 'touchmove', handleMove );
		imagesContainer.addEventListener( 'touchend', handleEnd );

		// Keyboard navigation
		gallery.setAttribute( 'tabindex', '0' );
		gallery.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'ArrowLeft' ) {
				e.preventDefault();
				showImage( currentIndex - 1 );
			} else if ( e.key === 'ArrowRight' ) {
				e.preventDefault();
				showImage( currentIndex + 1 );
			}
		} );

		// Hover to show second image
		let originalIndex = 0;
		let isHovering = false;

		gallery.addEventListener( 'mouseenter', function () {
			if ( images.length >= 2 && ! isDragging ) {
				isHovering = true;
				originalIndex = currentIndex;
				showImage( 1 );
			}
		} );

		gallery.addEventListener( 'mouseleave', function () {
			if ( isHovering ) {
				isHovering = false;
				showImage( originalIndex );
			}
		} );
	} );
} );
