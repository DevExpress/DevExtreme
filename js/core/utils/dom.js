import domAdapter from '../../core/dom_adapter';
import $ from '../../core/renderer';
import { each } from './iterator';
import { isDefined, isRenderer, isWindow } from './type';
import { getWindow } from './window';

const window = getWindow();

export const resetActiveElement = function() {
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

export const clearSelection = function() {
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

export const closestCommonParent = function(startTarget, endTarget) {
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

export const extractTemplateMarkup = function(element) {
    element = $(element);

    const templateTag = element.length && element.filter(function isNotExecutableScript() {
        const $node = $(this);
        return $node.is('script[type]') && ($node.attr('type').indexOf('script') < 0);
    });

    if(templateTag.length) {
        return templateTag.eq(0).html();
    } else {
        element = $('<div>').append(element);
        return element.html();
    }
};

export const normalizeTemplateElement = function(element) {
    let $element = isDefined(element) && (element.nodeType || isRenderer(element))
        ? $(element)
        : $('<div>').html(element).contents();

    if($element.length === 1) {
        if($element.is('script')) {
            $element = normalizeTemplateElement($element.html().trim());
        } else if($element.is('table')) {
            $element = $element.children('tbody').contents();
        }
    }

    return $element;
};

export const clipboardText = function(event, text) {
    const clipboard = (event.originalEvent && event.originalEvent.clipboardData) || window.clipboardData;

    if(arguments.length === 1) {
        return clipboard && clipboard.getData('Text');
    }

    clipboard && clipboard.setData('Text', text);
};

export const contains = function(container, element) {
    if(!element) {
        return false;
    }

    if(domAdapter.isTextNode(element)) {
        element = element.parentNode;
    }

    if(domAdapter.isDocument(container)) {
        return container.documentElement.contains(element);
    }

    if(isWindow(container)) {
        return contains(container.document, element);
    }

    return container.contains
        ? container.contains(element)
        : !!(element.compareDocumentPosition(container) & element.DOCUMENT_POSITION_CONTAINS);
};

export const createTextElementHiddenCopy = function(element, text, options) {
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
        'whiteSpace': 'pre',
        'position': 'absolute',
        'float': 'left'
    });
};

export const insertBefore = (element, newElement) => {
    if(newElement) {
        domAdapter.insertElement(element.parentNode, newElement, element);
    }
    return element;
};

export const replaceWith = (element, newElement) => {
    if(!(newElement && newElement[0])) return;
    if(newElement.is(element)) return element;

    each(newElement, (_, currentElement) => {
        insertBefore(element[0], currentElement);
    });
    element.remove();

    return newElement;
};
