/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
 import RenderElement from './renderassets';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({ attributes, setAttributes }) {
	return (
		<div {...useBlockProps.save()}>
			<div className="aemassetpicker-block">
				<div className="assetpicker_container fullWidth boxMargin" style={{ width: attributes.assetWidth + 'px', height: 'auto' }}>
					{RenderElement(
						attributes.authorInstanceUrl,
						attributes.assetType,
						attributes.assetPath,
						attributes.assetWidth,
						attributes.assetTitle,
						attributes.assetDescription,
						attributes.renditionType,
						attributes.selectedRendition
					)}
					{(attributes.assetTitle) && <div class="asset_caption">{attributes.assetTitle}</div>}
				</div>
			</div>
		</div>
	);
}
