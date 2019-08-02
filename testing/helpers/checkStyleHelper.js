import devices from "core/devices";
import browser from "core/utils/browser";
import typeUtils from "core/utils/type";

export function testInChromeOnDesktopActiveWindow(name, testCallback) {
    if(devices.real().deviceType === "desktop" && browser.webkit) {
        QUnit.testInActiveWindow.call(null, name, testCallback);
    } else {
        QUnit.skip.call(null, name + " [testInChromeOnDesktopActiveWindow]", testCallback);
    }
}

export function getTextOverflow(element) {
    return window.getComputedStyle(element).textOverflow;
}

export function getWhiteSpace(element) {
    return window.getComputedStyle(element).whiteSpace;
}

export function getOverflowX(element) {
    return window.getComputedStyle(element).overflowX;
}

export function getBackgroundColor(element) {
    let elementBackgroundColor = window.getComputedStyle(element).backgroundColor;
    let currentElement = element.parentNode;
    while(currentElement.parentNode !== document.documentElement && typeUtils.isDefined(currentElement.parentNode)) {
        let currentStyle = window.getComputedStyle(currentElement);
        if(elementBackgroundColor !== currentStyle.backgroundColor) {
            elementBackgroundColor = currentStyle.backgroundColor;
            break;
        }
        currentElement = currentElement.parentNode;
    }
    return elementBackgroundColor;
}

export function getColor(element) {
    return window.getComputedStyle(element).color;
}
