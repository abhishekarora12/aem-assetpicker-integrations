/* Constants */
export const GLOBAL_ASSETPICKER_OPTIONS = global_assetpicker_options;
export const assetpicker_path = "/aem/assetpicker.html";
export const asset_rendition_path = "/_jcr_content/renditions/";
export const allowed_extensions = {
    image: ["jpg", "jpeg", "png", "tiff", "svg"],
    video: ["mp4", "mkv"],
};
export const renditionsListIcon = "images-alt2"
export const renditionIcon = "menu";
export const replaceIcon = "controls-repeat"; // "image-rotate"
export const maxAssetWidth = 1450;
export const minAssetWidth = 10;
export const errorMsgs = {
    FetchRendition: "Failed to fetch renditions",
    AssetNotPublished: "Asset is not available on publish instance"
};