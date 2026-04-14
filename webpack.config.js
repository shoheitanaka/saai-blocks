const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const WooCommerceDependencyExtractionWebpackPlugin = require( '@woocommerce/dependency-extraction-webpack-plugin' );
const path = require( 'path' );

const wcDepMap = {
	'@woocommerce/blocks-registry': [ 'wc', 'wcBlocksRegistry' ],
	'@woocommerce/settings': [ 'wc', 'wcSettings' ],
};

const wcHandleMap = {
	'@woocommerce/blocks-registry': 'wc-blocks-registry',
	'@woocommerce/settings': 'wc-settings',
};

const requestToExternal = ( request ) => {
	if ( wcDepMap[ request ] ) {
		return wcDepMap[ request ];
	}
};

const requestToHandle = ( request ) => {
	if ( wcHandleMap[ request ] ) {
		return wcHandleMap[ request ];
	}
};

// Export configuration.
module.exports = {
	...defaultConfig,
	entry: {
		...( typeof defaultConfig.entry === 'function'
			? defaultConfig.entry()
			: defaultConfig.entry ),
		'saai/admin/overview': './src/saai/admin/overview/index.js',
		'saai/admin/blocks-settings':
			'./src/saai/admin/blocks-settings/index.js',
		'breadcrumb-block': './src/breadcrumb-block/index.js',
		'hover-image-switcher': './src/hover-image-switcher/index.js',
		'responsive-device-image': './src/responsive-device-image/index.js',
		'image-text-hover': './src/image-text-hover/index.js',
		'model-3d-viewer': './src/model-3d-viewer/index.js',
	},
	output: {
		path: path.resolve( __dirname, 'assets/build' ),
		filename: '[name].js',
	},
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new WooCommerceDependencyExtractionWebpackPlugin( {
			requestToExternal,
			requestToHandle,
		} ),
	],
};
