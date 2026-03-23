import './index.scss';
import { __ } from '@wordpress/i18n';
import { render, useState, useEffect } from '@wordpress/element';
import {
	ToggleControl,
	Button,
	Notice,
	Spinner,
	Card,
	CardBody,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const BLOCKS_CONFIG = [
	{
		name: 'breadcrumb-block',
		title: __( 'Breadcrumb Block', 'saai-blocks' ),
		description: __( 'Display breadcrumb navigation with customizable separators, colors, and SEO-friendly structured data.', 'saai-blocks' ),
	},
	{
		name: 'hover-image-switcher',
		title: __( 'Image Gallery Swiper', 'saai-blocks' ),
		description: __( 'Display multiple images in a swipeable gallery.', 'saai-blocks' ),
	},
	{
		name: 'responsive-device-image',
		title: __( 'Responsive Device Image Block', 'saai-blocks' ),
		description: __( 'Display different images for PC, tablet, and smartphone.', 'saai-blocks' ),
	},
	{
		name: 'image-text-hover',
		title: __( 'Image Text Hover Block', 'saai-blocks' ),
		description: __( 'Interactive image block with text overlay on hover.', 'saai-blocks' ),
	},
	{
		name: 'model-3d-viewer',
		title: __( '3D Model Viewer Block', 'saai-blocks' ),
		description: __( 'Display interactive 3D models using Google\'s model-viewer. Supports GLB and USDZ files with camera controls, auto-rotate, and AR.', 'saai-blocks' ),
	},
];

const DEFAULT_ENABLED = Object.fromEntries(
	BLOCKS_CONFIG.map( ( b ) => [ b.name, true ] )
);

const BlocksSettingsPage = () => {
	const [ enabled, setEnabled ] = useState( null );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ notice, setNotice ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/wp/v2/settings' } )
			.then( ( data ) => {
				const stored = data.saai_blocks_enabled || {};
				setEnabled( { ...DEFAULT_ENABLED, ...stored } );
			} )
			.catch( () => {
				setEnabled( { ...DEFAULT_ENABLED } );
			} );
	}, [] );

	const handleSave = () => {
		setIsSaving( true );
		setNotice( null );
		apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { saai_blocks_enabled: enabled },
		} )
			.then( () => {
				setNotice( {
					status: 'success',
					message: __( 'Settings saved. Please reload the page to apply changes.', 'saai-blocks' ),
				} );
			} )
			.catch( () => {
				setNotice( {
					status: 'error',
					message: __( 'Failed to save settings.', 'saai-blocks' ),
				} );
			} )
			.finally( () => {
				setIsSaving( false );
			} );
	};

	if ( enabled === null ) {
		return (
			<div className="saai-admin-layout">
				<div className="saai-admin__header">
					<div className="saai-admin__header-wrapper">
						<h1>{ __( 'Block Settings', 'saai-blocks' ) }</h1>
					</div>
				</div>
				<div className="saai-admin__content saai-blocks-settings__loading">
					<Spinner />
				</div>
			</div>
		);
	}

	return (
		<div className="saai-admin-layout">
			<div className="saai-admin__header">
				<div className="saai-admin__header-wrapper">
					<h1>{ __( 'Block Settings', 'saai-blocks' ) }</h1>
				</div>
			</div>
			<div className="saai-admin__content">
				{ notice && (
					<Notice
						status={ notice.status }
						isDismissible
						onRemove={ () => setNotice( null ) }
					>
						{ notice.message }
					</Notice>
				) }
				<p className="saai-blocks-settings__description">
					{ __( 'Select the blocks to use on this site. Disabled blocks will not appear in the editor. If all blocks are disabled, the "SAAI Blocks" category will also be hidden.', 'saai-blocks' ) }
				</p>
				<div className="saai-blocks-settings__list">
					{ BLOCKS_CONFIG.map( ( block ) => (
						<Card key={ block.name } className="saai-blocks-settings__card">
							<CardBody>
								<div className="saai-blocks-settings__block-row">
									<div className="saai-blocks-settings__block-info">
										<strong>{ block.title }</strong>
										<p>{ block.description }</p>
									</div>
									<ToggleControl
										label={
											enabled[ block.name ]
												? __( 'Enabled', 'saai-blocks' )
												: __( 'Disabled', 'saai-blocks' )
										}
										checked={ !! enabled[ block.name ] }
										onChange={ () =>
											setEnabled( ( prev ) => ( {
												...prev,
												[ block.name ]: ! prev[ block.name ],
											} ) )
										}
									/>
								</div>
							</CardBody>
						</Card>
					) ) }
				</div>
				<div className="saai-blocks-settings__actions">
					<Button
						variant="primary"
						onClick={ handleSave }
						isBusy={ isSaving }
						disabled={ isSaving }
					>
						{ __( 'Save Settings', 'saai-blocks' ) }
					</Button>
				</div>
			</div>
		</div>
	);
};

document.addEventListener( 'DOMContentLoaded', () => {
	const root = document.querySelector( '#root-blocks-settings' );
	if ( root ) {
		render( <BlocksSettingsPage />, root );
	}
} );
