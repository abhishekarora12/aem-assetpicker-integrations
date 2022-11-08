!function(){var e,t={719:function(){},923:function(e,t,n){"use strict";var s=window.wp.blocks,i=window.wp.element,a=window.wp.i18n,o=window.wp.blockEditor,r=window.wp.components;const l={image:["jpg","jpeg","png","tiff","svg"],video:["mp4","mkv"]},c="menu";function u(e,t,n,s,a,o,r,l){if("image"!==t&&"video"!==t)return(0,i.createElement)("p",null,"Please select a supported asset");let c=function(e,t,n){return"dynamic"===t?n:n?e+"/_jcr_content/renditions/"+n:e}(e+n,r,l);return c?"video"===t?(0,i.createElement)("video",{controls:"",style:{width:s+"px"}},(0,i.createElement)("source",{src:c})):(0,i.createElement)("img",{src:c,alt:o||a,style:{width:s+"px"}}):void 0}var d=n(719),h=JSON.parse('{"u2":"create-block/aemassetpicker"}');(0,s.registerBlockType)(h.u2,{edit:function(e){let{attributes:t,setAttributes:n}=e;const s=t.authorInstanceUrl+"/aem/assetpicker.html";let h;function p(e,t){t=function(e){return"/"==(e=e.trim()).charAt(e.length-1)?e.slice(0,-1):e}(t),"author"===e?n({authorInstanceUrl:t}):"publish"===e?n({publishInstanceUrl:t}):console.log("Error - instance type not supported")}function m(){var e;window.addEventListener("message",f,{once:!0}),e=s,h=window.open(e,"dam","left=25%,top=25%,height=800,width=1600,status=yes,toolbar=no,menubar=no,location=yes")}function f(e){if(0!=s.indexOf(e.origin))return;let t=JSON.parse(e.data);if(console.log("assetpicker_event_data",t),t.config){let e=t.config;"close"!==e.action&&"done"!==e.action||h&&h.close()}if(t.data){let e=t.data;for(let t in e){let s={};s.img=e[t].img,s.path=e[t].path,s.title=e[t].title,s.url=e[t].url,s.type=e[t].type,s.size=e[t].size;let i=E(s.path);if("image"===i||"video"===i){let e=s.path,t=s.title;n({assetType:i,assetPath:e,assetTitle:t})}else console.log("Error: unknown asset extension!")}}}function E(e){let t=function(e){return e.split(".").pop()}(e);for(let e in l)if(l.hasOwnProperty(e)&&-1!=l[e].indexOf(t))return e;return"image"}return GLOBAL_ASSETPICKER_OPTIONS&&t.setGlobalSettingsOnce&&(GLOBAL_ASSETPICKER_OPTIONS.aem_author_url_0&&p("author",GLOBAL_ASSETPICKER_OPTIONS.aem_author_url_0),GLOBAL_ASSETPICKER_OPTIONS.aem_publish_url_1&&p("publish",GLOBAL_ASSETPICKER_OPTIONS.aem_publish_url_1),GLOBAL_ASSETPICKER_OPTIONS.use_aem_assets_api_2&&n({useAEMAssetAPIForRenditions:!0}),n({setGlobalSettingsOnce:!1})),(0,i.useEffect)((()=>{if(t.assetPath&&t.authorInstanceUrl){const e=t.publishInstanceUrl+t.assetPath;n({isAssetPublished:!0,errorMsg:"",renditionsList:[]}),function(e,s){let i;i=t.useAEMAssetAPIForRenditions?(e+s).replace("/content/dam","/api/assets")+"/renditions.json":e+"/bin/AssetRendition?assetPath="+s;let a=new Headers;fetch(i,{method:"GET",headers:a,redirect:"follow",credentials:"include"}).then(d.handleFetchErrors).then((e=>e.json())).then((function(e){let s;s=t.useAEMAssetAPIForRenditions?function(e){let t=[];return e.entities.forEach((function(e){let s={title:"",icon:c};"assets/asset/renditions/rendition"===e.class[0]&&(s.title=e.properties.name,s.onClick=function(){n({selectedRendition:e.properties.name})}),function(e){return 0===Object.keys(e).length}(s)||t.push(s)})),t}(e):function(e){let t=[],s=e.static;s&&Object.keys(s).forEach((function(e){let s={title:e,icon:c,onClick:function(){n({selectedRendition:e,renditionType:"static"})}};t.push(s)}));let i=e.dynamic;return i&&Object.keys(i).forEach((function(e){let s={title:e,icon:"image-filter",onClick:function(){n({selectedRendition:i[e],renditionType:"dynamic"})}};t.push(s)})),t}(e),n({renditionsList:s})})).catch((e=>{console.log("error:",e),n({errorMsg:"Failed to fetch renditions"})}))}(t.authorInstanceUrl,t.assetPath),function(e){fetch(e,{method:"GET"}).then((function(e){if(!e.ok)throw Error(e.statusText);return e})).catch((e=>{console.log(e),n({isAssetPublished:!1})}))}(e),function(e,t,n){const s=e+t+".infinity.json";let i=new Headers;fetch(s,{method:"GET",headers:i,redirect:"follow",credentials:"include"}).then(d.handleFetchErrors).then((e=>e.json())).then((function(e){const t=e["jcr:content"];if(t){const e=t.metadata;if(e){const t=e["dc:title"],s=e["dc:description"];n({assetTitle:t,assetDescription:s})}}})).catch((e=>{console.log("error:",e)}))}(t.authorInstanceUrl,t.assetPath,n)}}),[t.assetPath,t.authorInstanceUrl,t.useAEMAssetAPIForRenditions]),(0,i.createElement)("div",(0,o.useBlockProps)(),(0,i.createElement)("div",{className:"aemassetpicker-block"},(0,i.createElement)(o.InspectorControls,{key:"setting"},(0,i.createElement)(r.PanelBody,{title:"Asset Properties",initialOpen:!0},(0,i.createElement)(r.RangeControl,{label:"Size",value:t.assetWidth,onChange:e=>n({assetWidth:e}),min:10,max:1450}),(0,i.createElement)(r.TextControl,{label:"Title",value:t.assetTitle,help:"asset title (fallback alt text)",onChange:e=>n({assetTitle:e})}),(0,i.createElement)(r.TextControl,{label:"Description",value:t.assetDescription,help:"image alt text",onChange:e=>n({assetDescription:e})})),(0,i.createElement)(r.PanelBody,{title:"AEM Properties",initialOpen:!0},(0,i.createElement)(r.TextControl,{label:"AEM Author URL",value:t.authorInstanceUrl,help:"your aem author instance url",onChange:e=>p("author",e)}),(0,i.createElement)(r.TextControl,{label:"AEM Publish URL",value:t.publishInstanceUrl,help:"your aem publish instance url",onChange:e=>p("publish",e)})),(0,i.createElement)(r.PanelBody,{title:"General Settings",initialOpen:!0},(0,i.createElement)(r.ToggleControl,{label:"Use AEM Assets API",help:"use aem assets api for fetching renditions",checked:t.useAEMAssetAPIForRenditions,onChange:()=>{n({useAEMAssetAPIForRenditions:!t.useAEMAssetAPIForRenditions})}}),(0,i.createElement)(r.TextControl,{label:"Asset Type",value:t.assetType,help:"aem asset type",onChange:e=>n({assetType:e})}),(0,i.createElement)(r.TextControl,{label:"Asset Path",value:t.assetPath,help:"aem dam asset path",onChange:e=>n({assetPath:e})}),(0,i.createElement)(r.TextControl,{label:"Rendition Type",value:t.renditionType,help:"asset rendition type",onChange:e=>n({renditionType:e})}),(0,i.createElement)(r.TextControl,{label:"Rendition Selected",value:t.selectedRendition,help:"selected asset rendition",onChange:e=>n({selectedRendition:e})}))),(0,i.createElement)(o.BlockControls,null,(0,i.createElement)(r.ToolbarGroup,null,(0,i.createElement)(r.ToolbarButton,{label:"Replace",icon:"controls-repeat",className:"aemassetpicker-replace-button",onClick:m})),(0,i.createElement)(r.ToolbarGroup,null,(0,i.createElement)(r.ToolbarDropdownMenu,{icon:"images-alt2",label:"Renditions",controls:t.renditionsList}))),t.assetPath?(0,i.createElement)("div",null,(0,i.createElement)("div",{className:"fullWidth boxMargin",style:{width:t.assetWidth+"px",height:"auto"}},u(t.authorInstanceUrl,t.assetType,t.assetPath,t.assetWidth,t.assetTitle,t.assetDescription,t.renditionType,t.selectedRendition)),(0,i.createElement)("p",{class:"error_message"},t.errorMsg),(0,i.createElement)("p",{class:"error_message published_error_message"},t.isAssetPublished?"":"Asset is not available on publish instance")):(0,i.createElement)(r.Placeholder,{icon:"format-image",label:(0,a.__)("AEM Assetpicker","aemassetpicker"),instructions:(0,a.__)("Pick an image/video file from your aem assets library")},(0,i.createElement)("div",{className:"fullWidth boxMargin"},(0,i.createElement)("button",{type:"button",onClick:m,className:"components-button block-editor-media-placeholder__button block-editor-media-placeholder__aemassetpicker-button is-primary"},"AEM Catalog")))))},save:function(e){let{attributes:t,setAttributes:n}=e;return(0,i.createElement)("div",o.useBlockProps.save(),(0,i.createElement)("div",{className:"aemassetpicker-block"},(0,i.createElement)("div",{className:"fullWidth boxMargin",style:{width:t.assetWidth+"px",height:"auto"}},u(t.authorInstanceUrl,t.assetType,t.assetPath,t.assetWidth,t.assetTitle,t.assetDescription,t.renditionType,t.selectedRendition))))}})}},n={};function s(e){var i=n[e];if(void 0!==i)return i.exports;var a=n[e]={exports:{}};return t[e](a,a.exports,s),a.exports}s.m=t,e=[],s.O=function(t,n,i,a){if(!n){var o=1/0;for(u=0;u<e.length;u++){n=e[u][0],i=e[u][1],a=e[u][2];for(var r=!0,l=0;l<n.length;l++)(!1&a||o>=a)&&Object.keys(s.O).every((function(e){return s.O[e](n[l])}))?n.splice(l--,1):(r=!1,a<o&&(o=a));if(r){e.splice(u--,1);var c=i();void 0!==c&&(t=c)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[n,i,a]},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={826:0,431:0};s.O.j=function(t){return 0===e[t]};var t=function(t,n){var i,a,o=n[0],r=n[1],l=n[2],c=0;if(o.some((function(t){return 0!==e[t]}))){for(i in r)s.o(r,i)&&(s.m[i]=r[i]);if(l)var u=l(s)}for(t&&t(n);c<o.length;c++)a=o[c],s.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return s.O(u)},n=self.webpackChunkaemassetpicker=self.webpackChunkaemassetpicker||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var i=s.O(void 0,[431],(function(){return s(923)}));i=s.O(i)}();