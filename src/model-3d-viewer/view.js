import '@google/model-viewer/dist/model-viewer.min.js';

( function () {
	'use strict';

	/**
	 * Initialize all 3D model viewer blocks on the page.
	 * The model-viewer web component handles its own initialization,
	 * so we just need to add lifecycle event listeners.
	 */
	function initModelViewers() {
		var viewers = document.querySelectorAll(
			'.wp-block-saai-blocks-model-3d-viewer model-viewer'
		);

		viewers.forEach( function ( viewer ) {
			viewer.addEventListener( 'load', function () {
				viewer.classList.add( 'saai-3d-model-viewer--loaded' );
			} );

			viewer.addEventListener( 'error', function () {
				viewer.classList.add( 'saai-3d-model-viewer--error' );
			} );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initModelViewers );
	} else {
		initModelViewers();
	}
} )();
