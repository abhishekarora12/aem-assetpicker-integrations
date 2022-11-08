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
import { Placeholder, TextControl, ToolbarGroup, ToolbarButton, ToolbarDropdownMenu, PanelBody, PanelRow, RangeControl, ToggleControl } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Internal dependencies
 */
import {
	assetpicker_path,
	aemContentDAMPath,
	aemAssetsAPIPath,
	aemAssetsAPIRenditionsPath,
	dynamicRenditionsAPIPath,
	dynamicRenditionsAPIQueryParam,
	allowed_extensions,
	renditionsListIcon,
	renditionIcon,
	dynamicRenditionIcon,
	replaceIcon,
	maxAssetWidth,
	minAssetWidth,
	errorMsgs
} from './CONSTANTS';
import RenderElement from './renderassets';
import fetchAssetMetadata from './accessibility';
import { handleFetchErrors } from './helper'

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const assetpicker_url = attributes.authorInstanceUrl + assetpicker_path;
	let popup;

	/**
	 * Validate before set aem instance attributes
	 */
	function sanitizeAEMInstanceUrl(url) {
		url = url.trim();
		if (url.charAt(url.length - 1) == '/')
			return url.slice(0, -1);
		return url;
	}

	function setAEMInstanceAttributes(type, url) {
		url = sanitizeAEMInstanceUrl(url);
		if (type === 'author') {
			setAttributes({ authorInstanceUrl: url })
		}
		else if (type === 'publish') {
			setAttributes({ publishInstanceUrl: url })
		}
		else {
			console.log("Error - instance type not supported");
		}
	}

	/**
	 * Set global settings options
	 */
	if (GLOBAL_ASSETPICKER_OPTIONS && attributes.setGlobalSettingsOnce) {
		// console.log("GLOBAL_ASSETPICKER_OPTIONS:", GLOBAL_ASSETPICKER_OPTIONS); // uncomment for debugging
		if (GLOBAL_ASSETPICKER_OPTIONS.aem_author_url_0)
			setAEMInstanceAttributes('author', GLOBAL_ASSETPICKER_OPTIONS.aem_author_url_0)

		if (GLOBAL_ASSETPICKER_OPTIONS.aem_publish_url_1)
			setAEMInstanceAttributes('publish', GLOBAL_ASSETPICKER_OPTIONS.aem_publish_url_1)

		if (GLOBAL_ASSETPICKER_OPTIONS.use_aem_assets_api_2)
			setAttributes({ useAEMAssetAPIForRenditions: true });

		// set settings only once
		setAttributes({ setGlobalSettingsOnce: false });
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
	 * Send error if selected asset doesn't exist on publish
	 */
	function checkAssetNotExistOnPublish(assetPublishUrl) {
		let url = assetPublishUrl;
		let requestOptions = {
			method: 'GET'
		}

		fetch(url, requestOptions)
			.then(function (response) {
				if (!response.ok) throw Error(response.statusText);
				return response;
			})
			.catch(error => {
				console.log(error);
				setAttributes({ isAssetPublished: false });
			});
	}

	/**
	 * Fetches all the static renditions for the AEM Asset
	 */
	function fetchRenditionsList(authorInstanceUrl, assetPath) {
		let assetAPIUrl;
		if (attributes.useAEMAssetAPIForRenditions) {
			// AEM Assets API for renditions - only static renditions
			const assetUrl = authorInstanceUrl + assetPath;
			assetAPIUrl = getAEMAssetAPIRenditionsPath(assetUrl);
		}
		else {
			// Custom API for renditions
			assetAPIUrl = authorInstanceUrl + dynamicRenditionsAPIPath + "?" + dynamicRenditionsAPIQueryParam + "=" + assetPath;
		}

		let reqHeaders = new Headers();
		let requestOptions = {
			method: 'GET',
			headers: reqHeaders,
			redirect: 'follow',
			credentials: "include"
		};

		fetch(assetAPIUrl, requestOptions)
			.then(handleFetchErrors)
			.then(response => response.json())
			.then(function (result) {
				//console.log("result:", result); // uncomment for debugging
				let renditionsList;
				if (attributes.useAEMAssetAPIForRenditions) {
					renditionsList = fillStaticAssetRenditions(result);
				}
				else {
					renditionsList = fillDynamicAssetRenditions(result);
				}

				setAttributes({ renditionsList: renditionsList });
			})
			.catch(error => {
				console.log("error:", error);
				setAttributes({ errorMsg: errorMsgs["FetchRendition"] });
			});
	}

	function getAEMAssetAPIRenditionsPath(assetUrl) {
		let assetAPIUrl = assetUrl.replace(aemContentDAMPath, aemAssetsAPIPath);
		let renditionsAPIPath = assetAPIUrl + aemAssetsAPIRenditionsPath;
		return renditionsAPIPath;
	}

	// works for custom API serving both static and dynamic renditions
	function fillDynamicAssetRenditions(json) {
		let renditionsArr = [];

		/* Static Renditions */
		let staticRenditionsJson = json['static'];
		if (staticRenditionsJson) {
			Object.keys(staticRenditionsJson).forEach(function (key) {
				let obj = {
					title: key,
					icon: renditionIcon,
					onClick: function () {
						setAttributes({ selectedRendition: key, renditionType: 'static' });
						//console.log("selecting rendition - static: ", key); // uncomment for debugging
					}
				};

				renditionsArr.push(obj);
			});
		}

		/* Dynamic Renditions */
		let dynamicRenditionsJson = json['dynamic'];
		if (dynamicRenditionsJson) {
			Object.keys(dynamicRenditionsJson).forEach(function (key) {
				let obj = {
					title: key,
					icon: dynamicRenditionIcon,
					onClick: function () {
						setAttributes({ selectedRendition: dynamicRenditionsJson[key], renditionType: 'dynamic' });
						//console.log("selecting rendition - dynamic", dynamicRenditionsJson[key]); // uncomment for debugging
					}
				};

				renditionsArr.push(obj);
			});
		}

		//console.log("renditionsArr: ", renditionsArr); // uncomment for debugging
		return renditionsArr;
	}

	// Only for static renditions API
	function fillStaticAssetRenditions(json) {
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

	/**
	 * Called everytime assetPath attribute changes to fetch all the renditions
	 */
	useEffect(() => {
		if (attributes.assetPath && attributes.authorInstanceUrl) {
			const assetPublishUrl = attributes.publishInstanceUrl + attributes.assetPath;

			// Clear attributes
			setAttributes({ isAssetPublished: true, errorMsg: "", renditionsList: [] });

			/* Fetch Renditions */
			fetchRenditionsList(attributes.authorInstanceUrl, attributes.assetPath);

			/* Check if asset is published */
			checkAssetNotExistOnPublish(assetPublishUrl);

			/* Fetch Asset Metadata */
			fetchAssetMetadata(attributes.authorInstanceUrl, attributes.assetPath, setAttributes);
		}
	}, [attributes.assetPath, attributes.authorInstanceUrl, attributes.useAEMAssetAPIForRenditions]) // <-- here put the parameter to listen

	return (
		<div {...useBlockProps()}>
			<div className="aemassetpicker-block">
				{/*console.log("rendering block")*/}
				<InspectorControls key="setting">
					<PanelBody title="Asset Properties" initialOpen={true}>
						<RangeControl
							label="Size"
							value={attributes.assetWidth}
							onChange={(value) => setAttributes({ assetWidth: value })}
							min={minAssetWidth}
							max={maxAssetWidth}
						/>
						<TextControl
							label="Title"
							value={attributes.assetTitle}
							help='asset title (fallback alt text)'
							onChange={(value) => setAttributes({ assetTitle: value })}
						/>
						<TextControl
							label="Description"
							value={attributes.assetDescription}
							help='image alt text'
							onChange={(value) => setAttributes({ assetDescription: value })}
						/>
					</PanelBody>
					<PanelBody title="AEM Properties" initialOpen={true}>
						<TextControl
							label="AEM Author URL"
							value={attributes.authorInstanceUrl}
							help='your aem author instance url'
							onChange={(url) => setAEMInstanceAttributes('author', url)}
						/>
						<TextControl
							label="AEM Publish URL"
							value={attributes.publishInstanceUrl}
							help='your aem publish instance url'
							onChange={(url) => setAEMInstanceAttributes('publish', url)}
						/>
					</PanelBody>
					<PanelBody title="General Settings" initialOpen={true}>
						<ToggleControl
							label='Use AEM Assets API'
							help='use aem assets api for fetching renditions'
							checked={attributes.useAEMAssetAPIForRenditions}
							onChange={() => { setAttributes({ useAEMAssetAPIForRenditions: !attributes.useAEMAssetAPIForRenditions }) }}
						/>
						<TextControl
							label="Asset Type"
							value={attributes.assetType}
							help='aem asset type'
							onChange={(type) => setAttributes({ assetType: type })}
						/>
						<TextControl
							label="Asset Path"
							value={attributes.assetPath}
							help='aem dam asset path'
							onChange={(path) => setAttributes({ assetPath: path })}
						/>
						<TextControl
							label="Rendition Type"
							value={attributes.renditionType}
							help='asset rendition type'
							onChange={(type) => setAttributes({ renditionType: type })}
						/>
						<TextControl
							label="Rendition Selected"
							value={attributes.selectedRendition}
							help='selected asset rendition'
							onChange={(rendition) => setAttributes({ selectedRendition: rendition })}
						/>
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
					(
						<div>
							<div className="fullWidth boxMargin" style={{ width: attributes.assetWidth + 'px', height: 'auto' }}>
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
							</div>
							<p class="error_message">{attributes.errorMsg}</p>
							<p class="error_message published_error_message">{!attributes.isAssetPublished ? errorMsgs["AssetNotPublished"] : ""}</p>
						</div>
					)
				}
			</div>
		</div>
	);
}
