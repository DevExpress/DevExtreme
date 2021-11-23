import domAdapter from '../core/dom_adapter';
import browser from '../core/utils/browser';
import { getWindow } from '../core/utils/window';
import $ from '../core/renderer';

const window = getWindow();

export const setFileInputPosition = function($fileInput, e, rtlEnabled) {
    const space = 10;
    let xPos = getEventX(e);
    let yPos = getEventY(e);
    const fileSelector = $fileInput.get(0);
    const width = fileSelector.offsetWidth;
    const height = fileSelector.offsetHeight;

    xPos -= rtlEnabled ? space : (width - space);
    yPos -= height / 2;

    setAbsoluteY(fileSelector, yPos);
    setAbsoluteX(fileSelector, xPos);
};
export const shouldRaiseDragLeave = function(e, zone, activeZone, lastEventName) {
    return activeZone === zone && (isActiveZoneLeft(e, zone) || dragCanceledByEscKey(lastEventName));
};
// export const shouldRaiseDragLeave = function(e, zoneId, zone) {
//     return this.activeZoneId === zoneId && (isActiveZoneLeft(e, zone) || dragCanceledByEscKey());
// };
const isActiveZoneLeft = function(e, zone) {
    return !isMouseOverElement(e, zone);
};
const dragCanceledByEscKey = function(lastEventName) {
    // When the 'esc' key was hit, the "dragenter" event would not be fired right before the "dragleave"
    return lastEventName !== 'dragenter';
};
export const isMouseOverElement = function(mouseEvent, element, correctPseudoElements) {
    // console.time('isMouseOverElement');
    if(!element) return false;

    const beforeHeight = correctPseudoElements ? parseFloat(window.getComputedStyle(element, ':before').height) : 0;
    const afterHeight = correctPseudoElements ? parseFloat(window.getComputedStyle(element, ':after').height) : 0;
    const x = getAbsoluteX(element);
    const y = getAbsoluteY(element) + beforeHeight;
    const w = element.offsetWidth;
    const h = element.offsetHeight - beforeHeight - afterHeight;
    const eventX = getEventX(mouseEvent);
    const eventY = getEventY(mouseEvent);
    // console.timeEnd('isMouseOverElement');
    return eventX >= x && eventX < (x + w) && eventY >= y && eventY < (y + h);
};
export const reRaiseEvent = function(e, eventType, newTarget) {
    const document = domAdapter.getDocument();
    let newEvent;
    if(window.MouseEvent) {
        newEvent = new window.MouseEvent(eventType, {
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            window: e.window,
            detail: e.detail,
            screenX: e.screenX,
            screenY: e.screenY,
            clientX: e.clientX,
            clientY: e.clientY,
            ctrlKey: e.ctrlKey,
            altKey: e.altKey,
            shiftKey: e.shiftKey,
            metaKey: e.metaKey,
            button: e.button,
            relatedTarget: e.relatedTarget
        });
        // newEvent.target = newTarget;

        newTarget.dispatchEvent(newEvent);
    } else if(document.createEventObject) {
        newEvent = document.createEventObject(window.event);
        newEvent.type = eventType;
        newEvent.bubbles = e.bubbles;
        newEvent.cancelable = e.cancelable;
        newEvent.view = window;
        newEvent.detail = e.detail;
        newEvent.screenX = e.screenX;
        newEvent.screenY = e.screenY;
        newEvent.clientX = e.clientX;
        newEvent.clientY = e.clientY;
        newEvent.ctrlKey = e.ctrlKey;
        newEvent.altKey = e.altKey;
        newEvent.shiftKey = e.shiftKey;
        newEvent.metaKey = e.metaKey;
        newEvent.button = e.button;
        newEvent.relatedTarget = e.relatedTarget;

        newTarget.fireEvent(eventType, newEvent);
    }
};
const getEventX = function(e) {
    // if(ASPx.TouchUIHelper.isTouchEvent(e)) { return ASPx.TouchUIHelper.getEventX(e); }
    return e.clientX;// + (clientEventRequiresDocScrollCorrection() ? ASPx.GetDocumentScrollLeft() : 0);
};
const getEventY = function(e) {
    // if(ASPx.TouchUIHelper.isTouchEvent(e)) { return ASPx.TouchUIHelper.getEventY(e); }
    return e.clientY;// + (clientEventRequiresDocScrollCorrection() ? ASPx.GetDocumentScrollTop() : 0);
};
const setAbsoluteX = function(element, x) {
    element.style.left = prepareClientPosForElement(x, element, true) + 'px';
};
const setAbsoluteY = function(element, y) {
    element.style.top = prepareClientPosForElement(y, element, false) + 'px';
};
const prepareClientPosForElement = function(pos, element, isX) {
    pos -= getPositionElementOffset(element, isX);
    return pos;
};
const getPositionElementOffset = function(element, isX) {
    const div = createElementMock(element);
    if(div.style.position === 'static') {
        div.style.position = 'absolute';
    }
    element.parentNode.appendChild(div);
    const realPos = isX ? getAbsoluteX(div) : getAbsoluteY(div);
    element.parentNode.removeChild(div);
    return realPos;
};
const createElementMock = function(element) {
    const div = $('<div>').get(0);
    div.style.top = '0px';
    div.style.left = '0px';
    div.visibility = 'hidden';
    div.style.position = getCurrentStyle(element).position;
    return div;
};
const getCurrentStyle = function(element) {
    const document = domAdapter.getDocument();
    if(document.defaultView && document.defaultView.getComputedStyle) {
        let result = document.defaultView.getComputedStyle(element, null);
        if(!result && browser.mozilla && window.frameElement) {
            const changes = [];
            let curElement = window.frameElement;
            while(!(result = document.defaultView.getComputedStyle(element, null))) {
                changes.push([curElement, curElement.style.display]);
                setStylesCore(curElement, 'display', 'block', true);
                curElement = curElement.tagName === 'BODY' ? curElement.ownerDocument.defaultView.frameElement : curElement.parentNode;
            }
            result = cloneObject(result);
            changes.forEach(ch => {
                setStylesCore(ch[0], 'display', ch[1]);
            });
        }
        if(browser.mozilla && browser.version >= 62 && window.frameElement && result.length === 0) { // T689462
            result = cloneObject(result);
            result.display = element.style.display;
        }
        return result;
    }
    return window.getComputedStyle(element, null);
};
const setStylesCore = function(element, property, value, makeImportant) {
    if(makeImportant) {
        const index = property.search('[A-Z]');
        if(index !== -1) {
            property = property.replace(property.charAt(index), '-' + property.charAt(index).toLowerCase());
        }
        if(element.style.setProperty) {
            element.style.setProperty(property, value, 'important');
        } else {
            element.style.cssText += ';' + property + ':' + value + '!important';
        }
    } else {
        element.style[property] = value;
    }
};
const cloneObject = function(srcObject) {
    if(typeof (srcObject) !== 'object' || srcObject === null) { return srcObject; }
    const newObject = {};
    for(const i in srcObject) {
        newObject[i] = srcObject[i];
    }
    return newObject;
};
const getAbsoluteX = function(element) {
    // if(browser.msie) {
    //     return getAbsolutePositionX_IE(element);
    // } else
    if(browser.webkit && browser.version >= 3/* || browser.msie*/) {
        return getAbsolutePositionX_FF3(element);
    // } else if(Browser.Opera) {
    //     return getAbsolutePositionX_Opera(element);
    } else {
        return getAbsolutePositionX_Other(element);
    }
};
// const getAbsolutePositionX_Opera = function(curEl) {
//     const document = domAdapter.getDocument();
//     let isFirstCycle = true;
//     let pos = getAbsoluteScrollOffset_OperaFF(curEl, true);
//     while(curEl != null) {
//         pos += curEl.offsetLeft;
//         if(!isFirstCycle) { pos -= curEl.scrollLeft; }
//         curEl = curEl.offsetParent;
//         isFirstCycle = false;
//     }
//     pos += document.body.scrollLeft;
//     return pos;
// }
// const getAbsolutePositionX_IE = function(element) {
//     if(element === null || browser.msie && element.parentNode === null) return 0; // B96664
//     return element.getBoundingClientRect().left + getDocumentScrollLeft();
// }
const getAbsolutePositionX_FF3 = function(element) {
    if(element === null) return 0;
    const x = element.getBoundingClientRect().left + getDocumentScrollLeft();
    return x;
};
const getAbsolutePositionX_Other = function(curEl) {
    let pos = 0;
    let isFirstCycle = true;
    while(curEl != null) {
        pos += curEl.offsetLeft;
        if(!isFirstCycle && curEl.offsetParent != null) { pos -= curEl.scrollLeft; }
        isFirstCycle = false;
        curEl = curEl.offsetParent;
    }
    return pos;
};
const getAbsoluteY = function(element) {
    // if(browser.msie) {
    //     return getAbsolutePositionY_IE(element);
    // } else
    if(browser.webkit && browser.version >= 3/* || browser.msie*/) {
        return getAbsolutePositionY_FF3(element);
    // } else if(Browser.Opera) {
    //     return getAbsolutePositionY_Opera(element);
    } else {
        return getAbsolutePositionY_Other(element);
    }
};
// const getAbsolutePositionY_Opera = function(curEl) {
//     const document = domAdapter.getDocument();
//     let isFirstCycle = true;
//     if(curEl && curEl.tagName === 'TR' && curEl.cells.length > 0) { curEl = curEl.cells[0]; }
//     let pos = getAbsoluteScrollOffset_OperaFF(curEl, false);
//     while(curEl != null) {
//         pos += curEl.offsetTop;
//         if(!isFirstCycle) { pos -= curEl.scrollTop; }
//         curEl = curEl.offsetParent;
//         isFirstCycle = false;
//     }
//     pos += document.body.scrollTop;
//     return pos;
// }
// const getAbsolutePositionY_IE = function(element) {
//     if(element === null || browser.msie && element.parentNode === null) return 0; // B96664
//     return element.getBoundingClientRect().top + getDocumentScrollTop();
// }
const getAbsolutePositionY_FF3 = function(element) {
    if(element === null) return 0;
    const y = element.getBoundingClientRect().top + getDocumentScrollTop();
    return y;
};
// const getAbsoluteScrollOffset_OperaFF = function(curEl, isX) {
//     let pos = 0;
//     let isFirstCycle = true;
//     while(curEl != null) {
//         if(curEl.tagName === 'BODY') { break; }
//         const style = getCurrentStyle(curEl);
//         if(style.position === 'absolute') { break; }
//         if(!isFirstCycle && curEl.tagName === 'DIV' && (style.position === '' || style.position === 'static')) { pos -= isX ? curEl.scrollLeft : curEl.scrollTop; }
//         curEl = curEl.parentNode;
//         isFirstCycle = false;
//     }
//     return pos;
// }
const getAbsolutePositionY_Other = function(curEl) {
    let pos = 0;
    let isFirstCycle = true;
    while(curEl != null) {
        pos += curEl.offsetTop;
        if(!isFirstCycle && curEl.offsetParent != null) { pos -= curEl.scrollTop; }
        isFirstCycle = false;
        curEl = curEl.offsetParent;
    }
    return pos;
};
const getDocumentScrollTop = function() {
    const document = domAdapter.getDocument();
    // const isScrollBodyIE = browser.msie && getCurrentStyle(document.body).overflow === 'hidden' && document.body.scrollTop > 0;
    if(browser.webkit/* || browser.msie || isScrollBodyIE*/) {
        // if(Browser.MacOSMobilePlatform) { // B157267
        //     return window.pageYOffset;
        // }
        if(browser.webkit) {
            return document.documentElement.scrollTop || document.body.scrollTop;
        }
        return document.body.scrollTop;
    } else {
        return document.documentElement.scrollTop;
    }
};
const getDocumentScrollLeft = function() {
    const document = domAdapter.getDocument();
    // const isScrollBodyIE = browser.msie && getCurrentStyle(document.body).overflow === 'hidden' && document.body.scrollLeft > 0;
    // if(browser.msie || isScrollBodyIE) {
    //     return document.body ? document.body.scrollLeft : document.documentElement.scrollLeft;
    // }
    if(browser.webkit) {
        return document.documentElement.scrollLeft || document.body.scrollLeft;
    }
    return document.documentElement.scrollLeft;
};
