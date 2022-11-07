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
import { Placeholder, TextControl, ToolbarGroup, ToolbarButton, ToolbarDropdownMenu, PanelBody, PanelRow, RangeControl } from '@wordpress/components';

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
import RenderElement from './renderassets';
import {
	assetpicker_path,
	allowed_extensions,
	renditionsListIcon,
	renditionIcon,
	dynamicRenditionIcon,
	replaceIcon,
	maxAssetWidth,
	minAssetWidth,
	errorMsgs
} from './CONSTANTS';

/**
 * Get global settings options
 */
let GLOBAL_ASSETPICKER_OPTIONS = global_assetpicker_options;

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
	 * Set attributes to global settings
	 */
	if (GLOBAL_ASSETPICKER_OPTIONS) {
		if (GLOBAL_ASSETPICKER_OPTIONS.aem_author_url_0) {
			setAttributes({ authorInstanceUrl: GLOBAL_ASSETPICKER_OPTIONS.aem_author_url_0 })
		}
		if (GLOBAL_ASSETPICKER_OPTIONS.aem_publish_url_1) {
			setAttributes({ publishInstanceUrl: GLOBAL_ASSETPICKER_OPTIONS.aem_publish_url_1 })
		}

		// set settings only once
		GLOBAL_ASSETPICKER_OPTIONS = undefined;
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

	/* Handle Fetch Errors */
	function handleFetchErrors(response) {
		console.log(response);
		if (!response.ok) throw Error(response.statusText);
		return response;
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
		// AEM Assets API for renditions - only static renditions
		//const assetAPIUrl = getAEMAssetAPIRenditionsPath(assetUrl);
		
		// Custom API for renditions
		const assetRenditionsAPIPath = "/bin/AssetRendition";
		const queryParam = "?assetPath="
		let assetAPIUrl = authorInstanceUrl + assetRenditionsAPIPath + queryParam + assetPath;
		let reqHeaders = new Headers();
		let requestOptions = {
			method: 'GET',
			headers: reqHeaders,
			redirect: 'follow',
			credentials: "include"
		};

		fetch(assetAPIUrl, requestOptions)
			.then(handleFetchErrors)
			//.then(response => response.json()) // uncomment for debugging
			.then(function (result) {
				//console.log(result); // uncomment for debugging
				let renditionsList = fillAllAssetRenditions(result);
				setAttributes({ renditionsList: renditionsList });
			})
			.catch(error => {
				console.log(error);
				setAttributes({ errorMsg: errorMsgs["FetchRendition"] });
			});
	}

	function getAEMAssetAPIRenditionsPath(assetUrl) {
		let assetAPIUrl = assetUrl.replace("/content/dam", "/api/assets");
		let renditionsAPIPath = assetAPIUrl + "/renditions.json";
		return renditionsAPIPath;
	}

	// works for custom API serving both static and dynamic renditions
	function fillAllAssetRenditions(json) {
		let renditionsArr = [];

		let staticRenditionsJson = json['static'];
		if (staticRenditionsJson) {
			Object.keys(staticRenditionsJson).forEach(function (key) {
				let obj = {
					title: key,
					icon: renditionIcon,
					onClick: function () {
						setAttributes({ selectedRendition: key,  renditionType: 'static'});
					}
				};

				renditionsArr.push(obj);
			});
		}

		let dynamicRenditionsJson = json['dynamic'];
		if (dynamicRenditionsJson) {
			Object.keys(dynamicRenditionsJson).forEach(function (key) {
				let obj = {
					title: key,
					icon: dynamicRenditionIcon,
					onClick: function () {
						setAttributes({ selectedRendition: dynamicRenditionsJson[key],  renditionType: 'dynamic'});
					}
				};

				renditionsArr.push(obj);
			});
		}

		//console.log("renditionsArr: ", renditionsArr); // uncomment for debugging
		return renditionsArr;
	}

	// Only for static renditions API
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

	/**
	 * Called everytime assetPath attribute changes to fetch all the renditions
	 */
	useEffect(() => {
		if (attributes.assetPath && attributes.authorInstanceUrl) {
			setAttributes({ isAssetPublished: true });

			/* Fetch Renditions */
			fetchRenditionsList(attributes.authorInstanceUrl, attributes.assetPath);

			/* Check if asset is published */
			let assetPublishUrl = attributes.publishInstanceUrl + attributes.assetPath;
			checkAssetNotExistOnPublish(assetPublishUrl);
		}
	}, [attributes.assetPath, attributes.authorInstanceUrl]) // <-- here put the parameter to listen

	return (
		<div {...useBlockProps()}>
			<div className="aemassetpicker-block">
				{/*console.log("rendering block")*/}
				<InspectorControls key="setting">
					<PanelBody title="Settings" initialOpen={true}>
						<RangeControl
							label="Size"
							value={attributes.assetWidth}
							onChange={(value) => setAttributes({ assetWidth: value })}
							min={minAssetWidth}
							max={maxAssetWidth}
						/>
						<TextControl
							label="AEM Author URL"
							value={attributes.authorInstanceUrl}
							help='your aem author instance url'
							onChange={(url) => setAttributes({ authorInstanceUrl: url })}
						/>
						<TextControl
							label="AEM Publish URL"
							value={attributes.publishInstanceUrl}
							help='your aem publish instance url'
							onChange={(url) => setAttributes({ publishInstanceUrl: url })}
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
									attributes.assetTitle,
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
