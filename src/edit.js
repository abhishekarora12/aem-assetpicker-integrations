/**
 * React hook that runs everytime a specified state changes
 */
import { useEffect } from "@wordpress/element";

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
import { useBlockProps, BlockControls, InspectorControls } from '@wordpress/block-editor';

/**
 * Wordpress components used in the block
 */
import { Placeholder, TextControl, Toolbar, ToolbarGroup, ToolbarButton, ToolbarDropdownMenu, PanelBody } from '@wordpress/components';

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
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	/* Constants */
	const GLOBAL_ASSETPICKER_OPTIONS = global_assetpicker_options;
	const assetpicker_path = "/aem/assetpicker.html";
	const asset_rendition_path = "/_jcr_content/renditions/";
	const assetpicker_url = attributes.authorInstanceUrl + assetpicker_path;
	const allowed_extensions = {
		image: ["jpg", "jpeg", "png", "tiff", "svg"],
		video: ["mp4", "mkv"],
	};
	const renditionsListIcon = "images-alt2"
	const renditionIcon = "menu";
	const replaceIcon = "controls-repeat"; // "image-rotate"
	let popup;

	/**
	 * Set attributes to global settings
	 */
	if (GLOBAL_ASSETPICKER_OPTIONS) {
		if (GLOBAL_ASSETPICKER_OPTIONS.aem_author_url_0) {
			setAttributes({ authorInstanceUrl: GLOBAL_ASSETPICKER_OPTIONS.aem_author_url_0 })
		}
		if (GLOBAL_ASSETPICKER_OPTIONS.aem_publish_url_1) {
			setAttributes({ publishInstanceUrl: GLOBAL_ASSETPICKER_OPTIONS.aem_publish_url_1 })
		}
	}

	/**
	 * This function is called on pick assets button click
	 * @param {*} event 
	 * @returns 
	 */
	function insertAEMAssets() {
		/* Create an event listener - destroyed after one time */
		window.addEventListener("message", receiveMessageHandler, { once: true });

		/* Open a popup window */
		_popup(assetpicker_url);
	}

	/**
	 * Event Handler for HTML5 postmessage used by AEM Assetpicker
	 * @param {*} event 
	 * @returns 
	 */
	function receiveMessageHandler(event) {
		// Don’t accept messages from other sources!
		if (assetpicker_url.indexOf(event.origin) != 0) {
			return;
		}

		/* Parse JSON data */
		let assetpicker_event_data = JSON.parse(event.data);
		console.log("assetpicker_event_data", assetpicker_event_data); // uncomment for debugging

		if (assetpicker_event_data.config) {
			let assetpicker_config = assetpicker_event_data.config;

			if (assetpicker_config.action === 'close' || assetpicker_config.action === 'done') {
				if (popup) {
					popup.close();
				}
			}
		}

		/* Extract asset data from JSON and setAttributes */
		if (assetpicker_event_data.data) {
			let assetpicker_data = assetpicker_event_data.data;

			for (let i in assetpicker_data) {
				let asset = {};
				asset.img = assetpicker_data[i].img;
				asset.path = assetpicker_data[i].path;
				asset.title = assetpicker_data[i].title;
				asset.url = assetpicker_data[i].url;
				asset.type = assetpicker_data[i].type;
				asset.size = assetpicker_data[i].size;
				//console.log("asset", asset); // uncomment for debugging

				let ext_type = getExtensionType(asset.path);
				//console.log("extension type", ext_type); // uncomment for debugging
				if (ext_type === "image" || ext_type === "video") {
					let asset_path = asset.path;
					let asset_title = asset.title;
					setAttributes({ assetType: ext_type, assetPath: asset_path, assetTitle: asset_title });
				} else {
					console.log("Error: unknown asset extension!");
				}
			}
		}
	}

	/**
	 * Helper Functions 
	 */
	function _popup(url) {
		let title = "dam";
		let panel = "left=25%,top=25%,height=800,width=1600,status=yes,toolbar=no,menubar=no,location=yes";
		popup = window.open(url, title, panel);
	}

	/* Asset Extensions */
	function getExtension(filename) {
		return filename.split('.').pop();
	}

	function getExtensionType(filename) {
		let ext = getExtension(filename);
		// find extension in allowed extensions
		for (let key in allowed_extensions) {
			// skip loop if the property is from prototype
			if (!allowed_extensions.hasOwnProperty(key)) continue;

			let arr = allowed_extensions[key];
			if (arr.indexOf(ext) != -1)
				return key;
		}
		return "image";
	}

	/* Check if object is empty */
	function isEmpty(obj) {
		return Object.keys(obj).length === 0;
	}

	/**
	 * Fetches all the static renditions for the AEM Asset
	 */
	function fetchRenditionsList(assetUrl) {
		let assetAPIUrl = getAEMAssetAPIPath(assetUrl);
		let reqHeaders = new Headers();
		let requestOptions = {
			method: 'GET',
			headers: reqHeaders,
			redirect: 'follow',
			credentials: "include"
		};

		fetch(assetAPIUrl, requestOptions)
			.then(response => response.json())
			.then(function (result) {
				//console.log(result); // uncomment for debugging
				let renditionsList = fillAssetRenditions(result);
				setAttributes({ renditionsList: renditionsList })
			})
			.catch(error => console.log('renditions fetch error', error));
	}

	function getAEMAssetAPIPath(assetUrl) {
		let assetAPIUrl = assetUrl.replace("/content/dam", "/api/assets");
		let renditionsAPIPath = assetAPIUrl + "/renditions.json";
		return renditionsAPIPath;
	}

	function fillAssetRenditions(json) {
		let renditionsArr = [];
		json['entities'].forEach(function (elem) {
			let obj = {
				title: '',
				icon: renditionIcon
			};

			if (elem.class[0] === "assets/asset/renditions/rendition") {
				obj.title = elem.properties.name;
				obj.onClick = function () {
					setAttributes({ selectedRendition: elem.properties.name });
					//console.log("selecting rendition", elem.properties.name); // uncomment for debugging
				}
			}

			if (!isEmpty(obj))
				renditionsArr.push(obj);
		});

		//console.log("renditionsArr: ", renditionsArr); // uncomment for debugging
		return renditionsArr;
	}

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
	function renderElement(fullAssetUrl, instancePath, assetType, assetPath, assetTitle, renditionType, selectedRendition) {
		if (assetType !== "image" && assetType !== "video")
			return <p>Please select a supported asset</p>

		// Generate URL
		let url;
		if (fullAssetUrl)
			url = fullAssetUrl;
		else
			url = generateAssetRenditionURL((instancePath + assetPath), renditionType, selectedRendition)

		// Render
		if (assetType === "video") {
			if (url)
				return (
					<video controls="" height="240" width="320">
						<source src={url} />
					</video>
				)
		}
		else {
			if (url)
				return <img src={url} alt={assetTitle} />
		}
	}

	/**
	 * Called everytime assetPath attribute changes to fetch all the renditions
	 */
	useEffect(() => {
		if (attributes.assetPath && attributes.authorInstanceUrl) {
			let assetUrl = attributes.authorInstanceUrl + attributes.assetPath;
			//console.log('assetUrl attribute has changed - ', assetUrl); // uncomment for debugging
			fetchRenditionsList(assetUrl);
		}
	}, [attributes.assetPath, attributes.authorInstanceUrl]) // <-- here put the parameter to listen

	return (
		<div {...useBlockProps()}>
			<div className="aemassetpicker-block">
				{/*console.log("rendering block")*/}
				<InspectorControls key="setting">
					<PanelBody title="Settings" initialOpen={true}>
						<TextControl
							label="AEM Author URL"
							value={attributes.authorInstanceUrl}
							help='your aem author instance url'
							onChange={(url) => setAttributes({ authorInstanceUrl: url })} />
						<TextControl
							label="AEM Publish URL"
							value={attributes.publishInstanceUrl}
							help='your aem publish instance url'
							onChange={(url) => setAttributes({ publishInstanceUrl: url })} />
						<TextControl
							label="Asset Type"
							value={attributes.assetType}
							help='aem asset type'
							onChange={(type) => setAttributes({ assetType: type })} />
						<TextControl
							label="Asset Path"
							value={attributes.assetPath}
							help='aem dam asset path'
							onChange={(path) => setAttributes({ assetPath: path })} />
						<TextControl
							label="Full Asset URL"
							value={attributes.fullAssetUrl}
							help='full asset url (ignores all other fields if filled)'
							onChange={(url) => setAttributes({ fullAssetUrl: url })} />
						<TextControl
							label="Rendition Type"
							value={attributes.renditionType}
							help='asset rendition type'
							onChange={(type) => setAttributes({ renditionType: type })} />
						<TextControl
							label="Rendition Selected"
							value={attributes.selectedRendition}
							help='selected asset rendition'
							onChange={(rendition) => setAttributes({ selectedRendition: rendition })} />
					</PanelBody>
				</InspectorControls>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label="Replace"
							icon={replaceIcon}
							className="aemassetpicker-replace-button"
							onClick={insertAEMAssets}
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						<ToolbarDropdownMenu
							icon={renditionsListIcon}
							label="Renditions"
							controls={attributes.renditionsList}
						/>
					</ToolbarGroup>
				</BlockControls>
				{(!attributes.assetPath) ?
					(<Placeholder
						icon="format-image"
						label={__('AEM Assetpicker', 'aemassetpicker')}
						instructions={__('Pick an image/video file from your aem assets library')}>
						<div className="fullWidth boxMargin">
							<button type="button" onClick={insertAEMAssets} className="components-button block-editor-media-placeholder__button block-editor-media-placeholder__aemassetpicker-button is-primary">
								AEM Catalog
							</button>
						</div>
					</Placeholder>)
					:
					(<div className="fullWidth boxMargin">
						{renderElement(
							attributes.fullAssetUrl,
							attributes.authorInstanceUrl,
							attributes.assetType,
							attributes.assetPath,
							attributes.assetTitle,
							attributes.renditionType,
							attributes.selectedRendition
						)}
					</div>)
				}
			</div>
		</div>
	);
}
