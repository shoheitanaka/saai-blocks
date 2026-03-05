
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
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';

import { 
	PanelBody, 
	SelectControl, 
	ToggleControl,
	TextControl
} from '@wordpress/components';

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
 * @param {Object} props Block properties.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		separator,
		showHome,
		showCurrent,
		homeText,
		textColor,
		linkColor,
	} = attributes;

	const blockProps = useBlockProps( {
		style: {
			'--breadcrumb-text-color': textColor,
			'--breadcrumb-link-color': linkColor,
		},
	} );

	// Sample breadcrumb trail for preview
	const sampleTrail = [];
	
	if ( showHome ) {
		sampleTrail.push( {
			title: homeText,
			url: '#',
			isHome: true,
		} );
	}

	sampleTrail.push(
		{ title: 'Category', url: '#' },
		{ title: 'Subcategory', url: '#' }
	);

	if ( showCurrent ) {
		sampleTrail.push( { title: 'Current Page', url: '' } );
	}

	const separatorMap = {
		'/': '/',
		'>': '>',
		'•': '•',
		'→': '→',
		'»': '»',
		'|': '|',
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Breadcrumb Settings', 'saai-blocks' ) }>
					<SelectControl
						label={ __( 'Separator', 'saai-blocks' ) }
						value={ separator }
						options={ [
							{ label: __( 'Slash (/)', 'saai-blocks' ), value: '/' },
							{ label: __( 'Angle Bracket (>)', 'saai-blocks' ), value: '>' },
							{ label: __( 'Dot (•)', 'saai-blocks' ), value: '•' },
							{ label: __( 'Arrow (→)', 'saai-blocks' ), value: '→' },
							{ label: __( 'Double Angle (»)', 'saai-blocks' ), value: '»' },
							{ label: __( 'Pipe (|)', 'saai-blocks' ), value: '|' },
						] }
						onChange={ ( value ) => setAttributes( { separator: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Home Link', 'saai-blocks' ) }
						checked={ showHome }
						onChange={ ( value ) => setAttributes( { showHome: value } ) }
					/>
					{ showHome && (
						<TextControl
							label={ __( 'Home Text', 'saai-blocks' ) }
							value={ homeText }
							onChange={ ( value ) => setAttributes( { homeText: value } ) }
						/>
					) }
					<ToggleControl
						label={ __( 'Show Current Page', 'saai-blocks' ) }
						checked={ showCurrent }
						onChange={ ( value ) => setAttributes( { showCurrent: value } ) }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color Settings', 'saai-blocks' ) }
					colorSettings={ [
						{
							value: textColor,
							onChange: ( value ) => setAttributes( { textColor: value } ),
							label: __( 'Text Color', 'saai-blocks' ),
						},
						{
							value: linkColor,
							onChange: ( value ) => setAttributes( { linkColor: value } ),
							label: __( 'Link Color', 'saai-blocks' ),
						},
					] }
				/>
			</InspectorControls>
			<nav { ...blockProps } aria-label={ __( 'Breadcrumb', 'saai-blocks' ) }>
				<ol className="telex-breadcrumb-list">
					{ sampleTrail.map( ( item, index ) => (
						<li key={ index } className="telex-breadcrumb-item">
							{ item.url ? (
								<>
									<a href={ item.url } className="telex-breadcrumb-link">
										{ item.title }
									</a>
									{ index < sampleTrail.length - 1 && (
										<span className="telex-breadcrumb-separator" aria-hidden="true">
											{ separatorMap[ separator ] }
										</span>
									) }
								</>
							) : (
								<span className="telex-breadcrumb-current">{ item.title }</span>
							) }
						</li>
					) ) }
				</ol>
			</nav>
		</>
	);
}
