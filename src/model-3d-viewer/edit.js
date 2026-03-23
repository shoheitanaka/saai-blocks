import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl, TextControl, ColorPicker, Placeholder } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		glbUrl,
		glbId,
		glbFilename,
		usdzUrl,
		usdzId,
		usdzFilename,
		viewerHeight,
		backgroundColor,
		autoRotate,
	} = attributes;

	const blockProps = useBlockProps( {
		style: {
			backgroundColor: backgroundColor,
		},
	} );

	const onSelectGlb = ( media ) => {
		setAttributes( {
			glbUrl: media.url,
			glbId: media.id,
			glbFilename: media.filename || media.title || media.url.split( '/' ).pop(),
		} );
	};

	const onRemoveGlb = () => {
		setAttributes( {
			glbUrl: '',
			glbId: 0,
			glbFilename: '',
		} );
	};

	const onSelectUsdz = ( media ) => {
		setAttributes( {
			usdzUrl: media.url,
			usdzId: media.id,
			usdzFilename: media.filename || media.title || media.url.split( '/' ).pop(),
		} );
	};

	const onRemoveUsdz = () => {
		setAttributes( {
			usdzUrl: '',
			usdzId: 0,
			usdzFilename: '',
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Model Settings', 'saai-blocks' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Viewer Height', 'saai-blocks' ) }
						help={ __( 'e.g. 400px, 50vh, 300px', 'saai-blocks' ) }
						value={ viewerHeight }
						onChange={ ( value ) => setAttributes( { viewerHeight: value } ) }
					/>
					<ToggleControl
						label={ __( 'Auto-Rotate', 'saai-blocks' ) }
						checked={ autoRotate }
						onChange={ ( value ) => setAttributes( { autoRotate: value } ) }
					/>
					<div style={ { marginTop: '16px' } }>
						<p style={ { marginBottom: '8px', fontWeight: 500 } }>
							{ __( 'Background Color', 'saai-blocks' ) }
						</p>
						<ColorPicker
							color={ backgroundColor }
							onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
							enableAlpha
						/>
					</div>
				</PanelBody>
				<PanelBody title={ __( 'GLB File', 'saai-blocks' ) } initialOpen={ false }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectGlb }
							value={ glbId }
							render={ ( { open } ) => (
								<div>
									{ glbUrl ? (
										<div className="saai-3d-model-viewer-file-info">
											<p className="saai-3d-model-viewer-file-name">
												{ glbFilename || glbUrl.split( '/' ).pop() }
											</p>
											<Button variant="secondary" onClick={ open } style={ { marginRight: '8px' } }>
												{ __( 'Replace GLB', 'saai-blocks' ) }
											</Button>
											<Button isDestructive onClick={ onRemoveGlb }>
												{ __( 'Remove', 'saai-blocks' ) }
											</Button>
										</div>
									) : (
										<Button variant="secondary" onClick={ open }>
											{ __( 'Upload GLB File', 'saai-blocks' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
				<PanelBody title={ __( 'USDZ File (iOS AR)', 'saai-blocks' ) } initialOpen={ false }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectUsdz }
							value={ usdzId }
							render={ ( { open } ) => (
								<div>
									{ usdzUrl ? (
										<div className="saai-3d-model-viewer-file-info">
											<p className="saai-3d-model-viewer-file-name">
												{ usdzFilename || usdzUrl.split( '/' ).pop() }
											</p>
											<Button variant="secondary" onClick={ open } style={ { marginRight: '8px' } }>
												{ __( 'Replace USDZ', 'saai-blocks' ) }
											</Button>
											<Button isDestructive onClick={ onRemoveUsdz }>
												{ __( 'Remove', 'saai-blocks' ) }
											</Button>
										</div>
									) : (
										<Button variant="secondary" onClick={ open }>
											{ __( 'Upload USDZ File', 'saai-blocks' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ ! glbUrl ? (
					<Placeholder
						icon="format-image"
						label={ __( '3D Model Viewer', 'saai-blocks' ) }
						instructions={ __( 'Upload a GLB file to display a 3D model. Optionally add a USDZ file for iOS AR support.', 'saai-blocks' ) }
					>
						<div className="saai-3d-model-viewer__upload-buttons">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ onSelectGlb }
									value={ glbId }
									render={ ( { open } ) => (
										<Button variant="primary" onClick={ open }>
											{ __( 'Upload GLB File', 'saai-blocks' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ onSelectUsdz }
									value={ usdzId }
									render={ ( { open } ) => (
										<Button variant="secondary" onClick={ open }>
											{ __( 'Upload USDZ File (optional)', 'saai-blocks' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
						</div>
					</Placeholder>
				) : (
					<div
						className="saai-3d-model-viewer__preview"
						style={ { height: viewerHeight } }
					>
						<model-viewer
							src={ glbUrl }
							{ ...( usdzUrl ? { 'ios-src': usdzUrl } : {} ) }
							camera-controls=""
							{ ...( autoRotate ? { 'auto-rotate': '' } : {} ) }
							ar=""
							ar-modes="webxr scene-viewer quick-look"
							style={ {
								width: '100%',
								height: '100%',
								backgroundColor: backgroundColor,
							} }
						></model-viewer>
					</div>
				) }
			</div>
		</>
	);
}
