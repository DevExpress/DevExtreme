import domAdapter from '../core/dom_adapter';
import { getWindow } from '../core/utils/window';
import { isTouchEvent } from '../events/utils';
import { getOffset } from '../core/utils/size';

const window = getWindow();

export const isMouseOverElement = function(mouseEvent, element, correctPseudoElements) {
    if(!element) return false;

    const beforeHeight = correctPseudoElements ? parseFloat(window.getComputedStyle(element, ':before').height) : 0;
    const afterHeight = correctPseudoElements ? parseFloat(window.getComputedStyle(element, ':after').height) : 0;
    const x = getOffset(element).left;
    const y = getOffset(element).top + beforeHeight;
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
    return isTouchEvent(e) ? getTouchEventX(e) : e.clientX + getDocumentScrollLeft();
};
const getEventY = function(e) {
    return isTouchEvent(e) ? getTouchEventY(e) : e.clientY + getDocumentScrollTop();
};
const getTouchEventX = function(e) {
    let touchPoint = null;
    if(e.changedTouches.length > 0) {
        touchPoint = e.changedTouches;
    } else if(e.targetTouches.length > 0) {
        touchPoint = e.targetTouches;
    }
    return touchPoint ? touchPoint[0].pageX : 0;
};
const getTouchEventY = function(e) {
    let touchPoint = null;
    if(e.changedTouches.length > 0) {
        touchPoint = e.changedTouches;
    } else if(e.targetTouches.length > 0) {
        touchPoint = e.targetTouches;
    }
    return touchPoint ? touchPoint[0].pageY : 0;
};
const getDocumentScrollTop = function() {
    const document = domAdapter.getDocument();
    return document.documentElement.scrollTop || document.body.scrollTop;
};
const getDocumentScrollLeft = function() {
    const document = domAdapter.getDocument();
    return document.documentElement.scrollLeft || document.body.scrollLeft;
};
