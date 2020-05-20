import domAdapter from '../../core/dom_adapter';
import $ from '../../core/renderer';
import windowUtils from './window';

const window = windowUtils.getWindow();

const resetActiveElement = function() {
    const activeElement = domAdapter.getActiveElement();
    const body = domAdapter.getBody();

    // TODO: remove this hack after msie 11 support stopped
    if(activeElement && activeElement !== body && activeElement.blur) {
        try {
            activeElement.blur();
        } catch(e) {
            body.blur();
        }
    }
};

const clearSelection = function() {
    const selection = window.getSelection();
    if(!selection) return;
    if(selection.type === 'Caret') return;

    if(selection.empty) {
        selection.empty();
    } else if(selection.removeAllRanges) {
        // T522811
        try {
            selection.removeAllRanges();
        } catch(e) {}
    }
};

const closestCommonParent = function(startTarget, endTarget) {
    const $startTarget = $(startTarget);
    const $endTarget = $(endTarget);

    if($startTarget[0] === $endTarget[0]) {
        return $startTarget[0];
    }

    const $startParents = $startTarget.parents();
    const $endParents = $endTarget.parents();
    const startingParent = Math.min($startParents.length, $endParents.length);

    for(let i = -startingParent; i < 0; i++) {
        if($startParents.get(i) === $endParents.get(i)) {
            return $startParents.get(i);
        }
    }
};

const clipboardText = function(event, text) {
    const clipboard = (event.originalEvent && event.originalEvent.clipboardData) || window.clipboardData;

    if(arguments.length === 1) {
        return clipboard && clipboard.getData('Text');
    }

    clipboard && clipboard.setData('Text', text);
};

const contains = function(container, element) {
    if(!element) {
        return false;
    }
    element = domAdapter.isTextNode(element) ? element.parentNode : element;

    return domAdapter.isDocument(container) ? container.documentElement.contains(element) : container.contains(element);
};

const createTextElementHiddenCopy = function(element, text, options) {
    const elementStyles = window.getComputedStyle($(element).get(0));
    const includePaddings = options && options.includePaddings;

    return $('<div>').text(text).css({
        'fontStyle': elementStyles.fontStyle,
        'fontVariant': elementStyles.fontVariant,
        'fontWeight': elementStyles.fontWeight,
        'fontSize': elementStyles.fontSize,
        'fontFamily': elementStyles.fontFamily,
        'letterSpacing': elementStyles.letterSpacing,
        'border': elementStyles.border,
        'paddingTop': includePaddings ? elementStyles.paddingTop : '',
        'paddingRight': includePaddings ? elementStyles.paddingRight : '',
        'paddingBottom': includePaddings ? elementStyles.paddingBottom : '',
        'paddingLeft': includePaddings ? elementStyles.paddingLeft : '',
        'visibility': 'hidden',
        'whiteSpace': 'nowrap',
        'position': 'absolute',
        'float': 'left'
    });
};

exports.resetActiveElement = resetActiveElement;
exports.clearSelection = clearSelection;
exports.closestCommonParent = closestCommonParent;
exports.clipboardText = clipboardText;
exports.contains = contains;
exports.createTextElementHiddenCopy = createTextElementHiddenCopy;
