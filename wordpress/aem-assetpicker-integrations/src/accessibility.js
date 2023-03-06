/**
 * 
 * Fetches metadata for the AEM Asset
 * 
 */

/**
 * Internal dependencies
 */
import { aemContentDAMPath, aemAssetsAPIPath } from './CONSTANTS';
import { handleFetchErrors } from './helper'

function getAEMAssetAPIUrl(assetUrl) {
    return assetUrl + '.infinity.json';
}

export default function fetchAssetMetadata(baseUrl, assetPath, setAttributes) {
    // AEM Assets API for renditions - only static renditions
    const assetUrl = baseUrl + assetPath;
    const assetAPIUrl = getAEMAssetAPIUrl(assetUrl);

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
            //console.log("fetchAssetMetadata result:", result); // uncomment for debugging
            const content = result['jcr:content'];
            if (content) {
                const metadata = content['metadata'];
                if (metadata) {
                    const title = metadata['dc:title'];
                    const description = metadata['dc:description'];

                    // set wp attributes
                    setAttributes({ assetTitle:title, assetDescription: description });
                }
            }
        })
        .catch(error => {
            console.log("error:", error);
        });
}