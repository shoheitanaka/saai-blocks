// Extend @wordpress/scripts default flat config with project-specific overrides.
const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	...defaultConfig,

	// Project-wide rule overrides.
	{
		rules: {
			// @wordpress/* packages are provided by WordPress at runtime and
			// externalized by webpack — they intentionally are not listed in
			// package.json dependencies.
			'import/no-extraneous-dependencies': 'off',

			// Block edit/save components use positional destructuring; full
			// JSDoc for every internal prop is too noisy.
			'jsdoc/require-param': 'off',
			'jsdoc/check-param-names': 'off',
		},
	},

	// Allow console output in Node.js build scripts.
	{
		files: [ 'scripts/**/*.js' ],
		rules: {
			'no-console': 'off',
		},
	},
];
