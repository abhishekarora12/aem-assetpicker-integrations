/**
 * Internal dependencies
 */
import { asset_rendition_path } from './CONSTANTS';

/**
 * Generates full asset url with rendition
 * @param {*} url 
 * @param {*} renditionType 
 * @param {*} rendition 
 * @returns 
 */
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
export default function RenderElement(instancePath, assetType, assetPath, assetWidth,  assetTitle, assetDescription, renditionType, selectedRendition) {
    if (assetType !== "image" && assetType !== "video")
        return <p>Please select a supported asset</p>

    // Generate URL
    let url = generateAssetRenditionURL((instancePath + assetPath), renditionType, selectedRendition)

    // Render
    if (url) {
        if (assetType === "video")
            return (
                <video controls="" style={{ width: assetWidth + 'px'}} >
                    <source src={url} />
                </video>
            )
        else
            return <img src={url} alt={ (assetDescription) ? assetDescription : assetTitle} style={{ width: assetWidth + 'px'}} />
    }
}