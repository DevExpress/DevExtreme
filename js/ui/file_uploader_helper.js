import domAdapter from '../core/dom_adapter';
// import browser from '../core/utils/browser';
import { getWindow } from '../core/utils/window';
// import $ from '../core/renderer';
// import { isTouchEvent } from '../events/utils';
import { getOffset } from '../core/utils/size';

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
const isActiveZoneLeft = function(e, zone) {
    return !isMouseOverElement(e, zone);
};
const dragCanceledByEscKey = function(lastEventName) {
    // When the 'esc' key was hit, the "dragenter" event would not be fired right before the "dragleave"
    return lastEventName !== 'dragenter';
};
export const isMouseOverElement = function(mouseEvent, element, correctPseudoElements) {
    if(!element) return false;

    const beforeHeight = correctPseudoElements ? parseFloat(window.getComputedStyle(element, ':before').height) : 0;
    const afterHeight = correctPseudoElements ? parseFloat(window.getComputedStyle(element, ':after').height) : 0;
    const x = getOffset(element).left; // getAbsoluteX(element);
    const y = getOffset(element).top + beforeHeight; // getAbsoluteY(element) + beforeHeight;
    const w = element.offsetWidth;
    const h = element.offsetHeight - beforeHeight - afterHeight;
    const eventX = getEventX(mouseEvent);
    const eventY = getEventY(mouseEvent);

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
    // if(isTouchEvent(e)) {
    //     return ASPx.TouchUIHelper.getEventX(e);
    // }
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
    return isX ? getOffset(element).left : getOffset(element).top;

};

