/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

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
	/* Constants */
	const asset_rendition_path = "/_jcr_content/renditions/";

	function generateAssetRenditionURL(url, renditionType, rendition) {
		//console.log("url", url); // uncomment for debugging
		//console.log("rendition", rendition); // uncomment for debugging

		// Dynamic Renditions
		if (renditionType === "dynamic")
			return rendition;

		// Static Renditions
		if (!rendition)
			return url;
		return url + asset_rendition_path + rendition;
	}

	/**
	 * This function is used to render the image or video tags on the screen depending upon the asset type
	 * @param {*} type 
	 * @param {*} url 
	 * @param {*} title 
	 * @returns 
	 */
	 function renderElement(instancePath, assetType, assetPath, assetTitle, renditionType, selectedRendition) {
		if (assetType !== "image" && assetType !== "video")
			return <p>Please select a supported asset</p>

		// Generate URL
		let url = generateAssetRenditionURL((instancePath + assetPath), renditionType, selectedRendition)

		// Render
		if (url) {
			if (assetType === "video")
				return (
					<video controls="">
						<source src={url} />
					</video>
				)
			else
				return <img src={url} alt={assetTitle} />
		}
	}

	return (
		<div {...useBlockProps.save()}>
			<div className="aemassetpicker-block">
				<div className="fullWidth boxMargin" style={{ width: attributes.assetWidth + 'px', height: 'auto' }}>
					{renderElement(
						attributes.authorInstanceUrl,
						attributes.assetType,
						attributes.assetPath,
						attributes.assetTitle,
						attributes.renditionType,
						attributes.selectedRendition
					)}
				</div>
			</div>
		</div>
	);
}
