import devices from "core/devices";
import browser from "core/utils/browser";
import typeUtils from "core/utils/type";

function testInChromeOnDesktop(name, testCallback) {
    if(devices.real().deviceType === "desktop" && browser.webkit) {
        QUnit.testInActiveWindow.call(null, name, testCallback);
    } else {
        QUnit.skip.call(null, name, testCallback);
    }
}

function getTextOverflow(element) {
    return window.getComputedStyle(element).textOverflow;
}

function getWhiteSpace(element) {
    return window.getComputedStyle(element).whiteSpace;
}

function getOverflowX(element) {
    return window.getComputedStyle(element).overflowX;
}

function getBackgroundColor(element) {
    let elementBackgroundColor = window.getComputedStyle(element).backgroundColor;
    let currentElement = element.parentNode;
    while(currentElement.parentNode !== document && typeUtils.isDefined(currentElement.parentNode)) {
        let currentStyle = window.getComputedStyle(currentElement);
        if(elementBackgroundColor !== currentStyle.backgroundColor) {
            elementBackgroundColor = currentStyle.backgroundColor;
            break;
        }
        currentElement = currentElement.parentNode;
    }
    return elementBackgroundColor;
}

function getColor(element) {
    return window.getComputedStyle(element).color;
}

export default {
    testInChromeOnDesktop: testInChromeOnDesktop,
    getTextOverflow: getTextOverflow,
    getWhiteSpace: getWhiteSpace,
    getOverflowX: getOverflowX,
    getBackgroundColor: getBackgroundColor,
    getColor: getColor,
};
