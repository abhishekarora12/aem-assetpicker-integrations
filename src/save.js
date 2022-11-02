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

	/**
	 * This function generates the full url with image rendition
	 * @param {*} url 
	 * @param {*} rendition 
	 * @returns 
	 */
	function getImageRenditionURL(url, rendition) {
		//console.log("url", url); // uncomment for debugging
		//console.log("rendition", rendition); // uncomment for debugging
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
	function renderElement(instancePath, assetType, assetPath, assetTitle, selectedRendition) {
		if (assetType == "image") {
			let url = instancePath + assetPath;
			return <img src={getImageRenditionURL(url, selectedRendition)} alt={assetTitle} />
		}
		else if (assetType == "video") {
			let url = instancePath + assetPath;
			return (
				<video controls="" height="240" width="320">
					<source src={url} />
				</video>
			)
		}
		else {
			return <p>Please select a supported asset</p>
		}
	}

	return (
		<div {...useBlockProps.save()}>
			<div className="aemassetpicker-block">
				<div className="fullWidth boxMargin">
					{renderElement(attributes.authorInstanceUrl, attributes.assetType, attributes.assetPath, attributes.assetTitle, attributes.selectedRendition)}
				</div>
			</div>
		</div>
	);
}
