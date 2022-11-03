/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/edit.js":
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/editor.scss");


/**
 * React hook that runs everytime a specified state changes
 */

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */


/**
 * Wordpress components used in the block
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */

function Edit(_ref) {
  let {
    attributes,
    setAttributes
  } = _ref;

  /* Constants */
  const GLOBAL_ASSETPICKER_OPTIONS = global_assetpicker_options;
  const assetpicker_path = "/aem/assetpicker.html";
  const asset_rendition_path = "/_jcr_content/renditions/";
  const assetpicker_url = attributes.authorInstanceUrl + assetpicker_path;
  const allowed_extensions = {
    image: ["jpg", "jpeg", "png", "tiff", "svg"],
    video: ["mp4", "mkv"]
  };
  const renditionsListIcon = "images-alt2";
  const renditionIcon = "menu";
  const replaceIcon = "controls-repeat"; // "image-rotate"

  let popup;
  /**
   * Set attributes to global settings
   */

  if (GLOBAL_ASSETPICKER_OPTIONS) {
    if (GLOBAL_ASSETPICKER_OPTIONS.aem_author_url_0) {
      setAttributes({
        authorInstanceUrl: GLOBAL_ASSETPICKER_OPTIONS.aem_author_url_0
      });
    }

    if (GLOBAL_ASSETPICKER_OPTIONS.aem_publish_url_1) {
      setAttributes({
        publishInstanceUrl: GLOBAL_ASSETPICKER_OPTIONS.aem_publish_url_1
      });
    }
  }
  /**
   * This function is called on pick assets button click
   * @param {*} event 
   * @returns 
   */


  function insertAEMAssets() {
    /* Create an event listener - destroyed after one time */
    window.addEventListener("message", receiveMessageHandler, {
      once: true
    });
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
        asset.size = assetpicker_data[i].size; //console.log("asset", asset); // uncomment for debugging

        let ext_type = getExtensionType(asset.path); //console.log("extension type", ext_type); // uncomment for debugging

        if (ext_type === "image" || ext_type === "video") {
          let asset_path = asset.path;
          let asset_title = asset.title;
          setAttributes({
            assetType: ext_type,
            assetPath: asset_path,
            assetTitle: asset_title
          });
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
    let ext = getExtension(filename); // find extension in allowed extensions

    for (let key in allowed_extensions) {
      // skip loop if the property is from prototype
      if (!allowed_extensions.hasOwnProperty(key)) continue;
      let arr = allowed_extensions[key];
      if (arr.indexOf(ext) != -1) return key;
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
    fetch(assetAPIUrl, requestOptions).then(response => response.json()).then(function (result) {
      //console.log(result); // uncomment for debugging
      let renditionsList = fillAssetRenditions(result);
      setAttributes({
        renditionsList: renditionsList
      });
    }).catch(error => console.log('renditions fetch error', error));
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
          setAttributes({
            selectedRendition: elem.properties.name
          }); //console.log("selecting rendition", elem.properties.name); // uncomment for debugging
        };
      }

      if (!isEmpty(obj)) renditionsArr.push(obj);
    }); //console.log("renditionsArr: ", renditionsArr); // uncomment for debugging

    return renditionsArr;
  }

  function getImageRenditionURL(url, rendition) {
    //console.log("url", url); // uncomment for debugging
    //console.log("rendition", rendition); // uncomment for debugging
    if (!rendition) return url;
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
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
        src: getImageRenditionURL(url, selectedRendition),
        alt: assetTitle
      });
    } else if (assetType == "video") {
      let url = instancePath + assetPath;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("video", {
        controls: "",
        height: "240",
        width: "320"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("source", {
        src: url
      }));
    } else {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Please select a supported asset");
    }
  }
  /**
   * Called everytime assetPath attribute changes to fetch all the renditions
   */


  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (attributes.assetPath && attributes.authorInstanceUrl) {
      let assetUrl = attributes.authorInstanceUrl + attributes.assetPath; //console.log('assetUrl attribute has changed - ', assetUrl); // uncomment for debugging

      fetchRenditionsList(assetUrl);
    }
  }, [attributes.assetPath, attributes.authorInstanceUrl]); // <-- here put the parameter to listen

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "aemassetpicker-block"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "setting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "Settings",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: "AEM Author URL",
    value: attributes.authorInstanceUrl,
    help: "your aem author instance url",
    onChange: url => setAttributes({
      authorInstanceUrl: url
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: "AEM Publish URL",
    value: attributes.publishInstanceUrl,
    help: "your aem publish instance url",
    onChange: url => setAttributes({
      publishInstanceUrl: url
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: "Asset Path",
    value: attributes.assetPath,
    help: "aem dam asset path",
    onChange: path => setAttributes({
      assetPath: path
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: "Rendition Selected",
    value: attributes.selectedRendition,
    help: "selected asset rendition",
    onChange: rendition => setAttributes({
      selectedRendition: rendition
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarGroup, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarButton, {
    label: "Replace",
    icon: replaceIcon,
    className: "aemassetpicker-replace-button",
    onClick: insertAEMAssets
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarGroup, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarDropdownMenu, {
    icon: renditionsListIcon,
    label: "Renditions",
    controls: attributes.renditionsList
  }))), !attributes.assetPath ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Placeholder, {
    icon: "format-image",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('AEM Assetpicker', 'aemassetpicker'),
    instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pick an image/video file from your aem assets library')
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "fullWidth boxMargin"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: insertAEMAssets,
    className: "components-button block-editor-media-placeholder__button block-editor-media-placeholder__aemassetpicker-button is-primary"
  }, "AEM Catalog"))) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "fullWidth boxMargin"
  }, renderElement(attributes.authorInstanceUrl, attributes.assetType, attributes.assetPath, attributes.assetTitle, attributes.selectedRendition))));
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */




/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],

  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./src/save.js":
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ save; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */

function save(_ref) {
  let {
    attributes,
    setAttributes
  } = _ref;

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
    if (!rendition) return url;
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
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
        src: getImageRenditionURL(url, selectedRendition),
        alt: assetTitle
      });
    } else if (assetType == "video") {
      let url = instancePath + assetPath;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("video", {
        controls: "",
        height: "240",
        width: "320"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("source", {
        src: url
      }));
    } else {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Please select a supported asset");
    }
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "aemassetpicker-block"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "fullWidth boxMargin"
  }, renderElement(attributes.authorInstanceUrl, attributes.assetType, attributes.assetPath, attributes.assetTitle, attributes.selectedRendition))));
}

/***/ }),

/***/ "./src/editor.scss":
/*!*************************!*\
  !*** ./src/editor.scss ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/block.json":
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
/***/ (function(module) {

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"create-block/aemassetpicker","version":"1.0","title":"AEM Assetpicker","category":"media","icon":"format-image","description":"Embed an image or video asset from AEM Digital Assets Manager","attributes":{"authorInstanceUrl":{"type":"string","default":"http://localhost:4502"},"publishInstanceUrl":{"type":"string","default":"http://localhost:4502"},"assetType":{"type":"string"},"assetPath":{"type":"string"},"assetTitle":{"type":"string"},"renditionsList":{"type":"array"},"selectedRendition":{"type":"string"}},"example":{"attributes":{"assetType":"image","assetPath":"/content/dam/we-retail/en/activities/hiking/hiking_4.jpg","assetTitle":"Preview Image","selectedRendition":"cq5dam.thumbnail.319.319.png"}},"textdomain":"aemassetpicker","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkaemassetpicker"] = self["webpackChunkaemassetpicker"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], function() { return __webpack_require__("./src/index.js"); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map