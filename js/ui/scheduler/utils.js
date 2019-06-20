import devices from "../../core/devices";
import browser from "../../core/utils/browser";
import { getWindow } from "../../core/utils/window";

const utils = {
    isWebKitBrowserInZoom: () => devices.current().deviceType === "desktop" && browser.webkit && getWindow().devicePixelRatio > 1
};

module.exports = utils;
