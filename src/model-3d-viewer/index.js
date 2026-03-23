import { registerBlockType } from '@wordpress/blocks';
import '@google/model-viewer/dist/model-viewer.min.js';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
} );
