import devices from "core/devices";
import browser from "core/utils/browser";

function testInChromeOnDesktop(name, testCallback) {
    if(devices.real().deviceType !== "desktop" || !browser.webkit) {
        QUnit.skip.call(null, name, testCallback);
    } else {
        QUnit.testInActiveWindow.call(null, name, testCallback);
    }

    return true;
}

function checkTextOverflow(assert, element, expectedValue) {
    let style = window.getComputedStyle(element.parentNode);
    assert.equal(style.textOverflow, expectedValue, "textOverflow");
}

function checkWhiteSpace(assert, element, expectedValue) {
    let style = window.getComputedStyle(element);
    assert.equal(style.whiteSpace, expectedValue, "whiteSpace");
}

function checkOverflowX(assert, element, expectedValue) {
    let style = window.getComputedStyle(element.parentNode);
    assert.equal(style.overflowX, expectedValue, "overflowX");
}

function checkBackgroundColor(assert, element, expectedValue) {
    let elementBackgroundColor = window.getComputedStyle(element).backgroundColor;
    let currentElement = element.parentNode;
    for(let i = 0; i < 5; i++) {
        let currentStyle = window.getComputedStyle(currentElement);
        if(elementBackgroundColor !== currentStyle.backgroundColor) {
            elementBackgroundColor = currentStyle.backgroundColor;
            break;
        }
        currentElement = currentElement.parentNode;
    }
    assert.equal(elementBackgroundColor, expectedValue, "backgroundColor");
}

function checkColor(assert, element, expectedValue) {
    let style = window.getComputedStyle(element);
    assert.equal(style.color, expectedValue, "color");
}

export default {
    testInChromeOnDesktop: testInChromeOnDesktop,
    checkTextOverflow: checkTextOverflow,
    checkWhiteSpace: checkWhiteSpace,
    checkOverflowX: checkOverflowX,
    checkBackgroundColor: checkBackgroundColor,
    checkColor: checkColor
};
