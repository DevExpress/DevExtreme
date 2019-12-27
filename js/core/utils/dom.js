const $ = require('../../core/renderer');
const config = require('../../core/config');
const domAdapter = require('../../core/dom_adapter');
const windowUtils = require('./window');
const window = windowUtils.getWindow();
const eventsEngine = require('../../events/core/events_engine');
const inArray = require('./array').inArray;
const typeUtils = require('./type');
const isDefined = typeUtils.isDefined;
const isRenderer = typeUtils.isRenderer;
const htmlParser = require('../../core/utils/html_parser');
let elementStrategy;

const resetActiveElement = function() {
    const activeElement = domAdapter.getActiveElement();
    const body = domAdapter.getBody();

    // todo: remove this hack after msie 11 support stopped
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


const triggerVisibilityChangeEvent = function(eventName) {
    const VISIBILITY_CHANGE_SELECTOR = '.dx-visibility-change-handler';

    return function(element) {
        const $element = $(element || 'body');

        const changeHandlers = $element.filter(VISIBILITY_CHANGE_SELECTOR).
            add($element.find(VISIBILITY_CHANGE_SELECTOR));

        for(let i = 0; i < changeHandlers.length; i++) {
            eventsEngine.triggerHandler(changeHandlers[i], eventName);
        }
    };
};

const uniqueId = (function() {
    let counter = 0;

    return function(prefix) {
        return (prefix || '') + counter++;
    };
})();


const dataOptionsAttributeName = 'data-options';

const getElementOptions = function(element) {
    const optionsString = $(element).attr(dataOptionsAttributeName) || '';

    return config().optionsParser(optionsString);
};

const createComponents = function(elements, componentTypes) {
    const result = [];
    const selector = '[' + dataOptionsAttributeName + ']';

    const $items = elements.find(selector).add(elements.filter(selector));
    $items.each(function(index, element) {
        const $element = $(element);
        const options = getElementOptions(element);

        for(const componentName in options) {
            if(!componentTypes || inArray(componentName, componentTypes) > -1) {
                if($element[componentName]) {
                    $element[componentName](options[componentName]);
                    result.push($element[componentName]('instance'));
                }
            }
        }
    });

    return result;
};

const createMarkupFromString = function(str) {
    if(!window.WinJS) {
        return $(htmlParser.parseHTML(str));
    }

    const tempElement = $('<div>');

    // otherwise WinJS browser strips HTML comments required for KO
    window.WinJS.Utilities.setInnerHTMLUnsafe(tempElement.get(0), str);

    return tempElement.contents();
};

const extractTemplateMarkup = function(element) {
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

var normalizeTemplateElement = function(element) {
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

const getPublicElement = function($element) {
    return elementStrategy($element);
};

const setPublicElementWrapper = function(value) {
    elementStrategy = value;
};

setPublicElementWrapper(function(element) {
    return element && element.get(0);
});

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

exports.setPublicElementWrapper = setPublicElementWrapper;
exports.resetActiveElement = resetActiveElement;
exports.createMarkupFromString = createMarkupFromString;
exports.triggerShownEvent = triggerVisibilityChangeEvent('dxshown');
exports.triggerHidingEvent = triggerVisibilityChangeEvent('dxhiding');
exports.triggerResizeEvent = triggerVisibilityChangeEvent('dxresize');
exports.getElementOptions = getElementOptions;
exports.createComponents = createComponents;
exports.extractTemplateMarkup = extractTemplateMarkup;
exports.normalizeTemplateElement = normalizeTemplateElement;
exports.clearSelection = clearSelection;
exports.uniqueId = uniqueId;
exports.closestCommonParent = closestCommonParent;
exports.clipboardText = clipboardText;
exports.contains = contains;
exports.getPublicElement = getPublicElement;
exports.createTextElementHiddenCopy = createTextElementHiddenCopy;
