import { getWindow } from '../../core/utils/window';
import domAdapter from '../../core/dom_adapter';
import { isWindow, isString, isNumeric, isRenderer } from '../utils/type';

const window = getWindow();

const SPECIAL_HEIGHT_VALUES = ['auto', 'none', 'inherit', 'initial'];

const getSizeByStyles = function(elementStyles, styles) {
    let result = 0;

    styles.forEach(function(style) {
        result += (parseFloat(elementStyles[style]) || 0);
    });

    return result;
};

export const getElementBoxParams = function(name, elementStyles) {
    const beforeName = name === 'width' ? 'Left' : 'Top';
    const afterName = name === 'width' ? 'Right' : 'Bottom';

    return {
        padding: getSizeByStyles(elementStyles, ['padding' + beforeName, 'padding' + afterName]),
        border: getSizeByStyles(elementStyles, ['border' + beforeName + 'Width', 'border' + afterName + 'Width']),
        margin: getSizeByStyles(elementStyles, ['margin' + beforeName, 'margin' + afterName]),
    };
};

const getBoxSizingOffset = function(name, elementStyles, boxParams) {
    const size = elementStyles[name];

    if(elementStyles.boxSizing === 'border-box' && size.length && size[size.length - 1] !== '%') {
        return boxParams.border + boxParams.padding;
    }

    return 0;
};
const getElementComputedStyle = function(element) {
    const view = element?.ownerDocument?.defaultView || window;
    return view.getComputedStyle && view.getComputedStyle(element);
};

export const getSize = function(element, name, include) {
    const elementStyles = getElementComputedStyle(element);

    const boxParams = getElementBoxParams(name, elementStyles);

    const clientRect = element.getClientRects && element.getClientRects().length;
    const boundingClientRect = element.getBoundingClientRect && element.getBoundingClientRect()[name];

    let result = clientRect ? boundingClientRect : 0;

    if(result <= 0) {
        result = parseFloat(elementStyles[name] || element.style[name]) || 0;

        result -= getBoxSizingOffset(name, elementStyles, boxParams);
    } else {
        result -= boxParams.padding + boxParams.border;
    }

    if(include.paddings) {
        result += boxParams.padding;
    }
    if(include.borders) {
        result += boxParams.border;
    }
    if(include.margins) {
        result += boxParams.margin;
    }

    return result;
};

const getContainerHeight = function(container) {
    return isWindow(container) ? container.innerHeight : container.offsetHeight;
};

export const parseHeight = function(value, container) {
    if(value.indexOf('px') > 0) {
        value = parseInt(value.replace('px', ''));
    } else if(value.indexOf('%') > 0) {
        value = parseInt(value.replace('%', '')) * getContainerHeight(container) / 100;
    } else if(!isNaN(value)) {
        value = parseInt(value);
    }

    return value;
};

const getHeightWithOffset = function(value, offset, container) {
    if(!value) {
        return null;
    }

    if(SPECIAL_HEIGHT_VALUES.indexOf(value) > -1) {
        return offset ? null : value;
    }

    if(isString(value)) {
        value = parseHeight(value, container);
    }

    if(isNumeric(value)) {
        return Math.max(0, value + offset);
    }

    const operationString = offset < 0 ? ' - ' : ' ';

    return 'calc(' + value + operationString + Math.abs(offset) + 'px)';
};

export const addOffsetToMaxHeight = function(value, offset, container) {
    const maxHeight = getHeightWithOffset(value, offset, container);
    return maxHeight !== null ? maxHeight : 'none';
};

export const addOffsetToMinHeight = function(value, offset, container) {
    const minHeight = getHeightWithOffset(value, offset, container);
    return minHeight !== null ? minHeight : 0;
};

export const getVerticalOffsets = function(element, withMargins) {
    if(!element) {
        return 0;
    }

    const boxParams = getElementBoxParams('height', window.getComputedStyle(element));

    return boxParams.padding
        + boxParams.border
        + (withMargins ? boxParams.margin : 0);
};

export const getVisibleHeight = function(element) {
    if(element) {
        const boundingClientRect = element.getBoundingClientRect();

        if(boundingClientRect.height) {
            return boundingClientRect.height;
        }
    }

    return 0;
};

// TODO: remove when we'll start mocking named exports
export const implementationsMap = {
    getWidth: (...args) => elementSizeHelper('width', ...args),
    setWidth: (...args) => elementSizeHelper('width', ...args),
    getHeight: (...args) => elementSizeHelper('height', ...args),
    setHeight: (...args) => elementSizeHelper('height', ...args),
    getOuterWidth: (...args) => elementSizeHelper('outerWidth', ...args),
    setOuterWidth: (...args) => elementSizeHelper('outerWidth', ...args),
    getOuterHeight: (...args) => elementSizeHelper('outerHeight', ...args),
    setOuterHeight: (...args) => elementSizeHelper('outerHeight', ...args),
    getInnerWidth: (...args) => elementSizeHelper('innerWidth', ...args),
    setInnerWidth: (...args) => elementSizeHelper('innerWidth', ...args),
    getInnerHeight: (...args) => elementSizeHelper('innerHeight', ...args),
    setInnerHeight: (...args) => elementSizeHelper('innerHeight', ...args),
};
function elementSizeHelper(sizeProperty, el, value) {
    return arguments.length === 2 ? elementSize(el, sizeProperty) : elementSize(el, sizeProperty, value);
}

export const getWidth = (el) => implementationsMap.getWidth(el);
export const setWidth = (el, value) => implementationsMap.setWidth(el, value);
export const getHeight = (el) => implementationsMap.getHeight(el);
export const setHeight = (el, value) => implementationsMap.setHeight(el, value);
export const getOuterWidth = (el, includeMargin) => implementationsMap.getOuterWidth(el, includeMargin || false);
export const setOuterWidth = (el, value) => implementationsMap.setOuterWidth(el, value);
export const getOuterHeight = (el, includeMargin) => implementationsMap.getOuterHeight(el, includeMargin || false);
export const setOuterHeight = (el, value) => implementationsMap.setOuterHeight(el, value);
export const getInnerWidth = (el) => implementationsMap.getInnerWidth(el);
export const setInnerWidth = (el, value) => implementationsMap.setInnerWidth(el, value);
export const getInnerHeight = (el) => implementationsMap.getInnerHeight(el);
export const setInnerHeight = (el, value) => implementationsMap.setInnerHeight(el, value);

export const elementSize = function(el, sizeProperty, value) {
    const partialName = sizeProperty.toLowerCase().indexOf('width') >= 0 ? 'Width' : 'Height';
    const propName = partialName.toLowerCase();
    const isOuter = sizeProperty.indexOf('outer') === 0;
    const isInner = sizeProperty.indexOf('inner') === 0;
    const isGetter = arguments.length === 2 || typeof value === 'boolean';

    if(isRenderer(el)) {
        if(el.length > 1 && !isGetter) {
            for(let i = 0; i < el.length; i++) {
                elementSize(el[i], sizeProperty, value);
            }
            return;
        }
        el = el[0];
    }

    if(!el) return;

    if(isWindow(el)) {
        return isOuter ? el['inner' + partialName] : domAdapter.getDocumentElement()['client' + partialName];
    }

    if(domAdapter.isDocument(el)) {
        const documentElement = domAdapter.getDocumentElement();
        const body = domAdapter.getBody();

        return Math.max(
            body['scroll' + partialName],
            body['offset' + partialName],
            documentElement['scroll' + partialName],
            documentElement['offset' + partialName],
            documentElement['client' + partialName]
        );
    }

    if(isGetter) {
        const include = {
            paddings: isInner || isOuter,
            borders: isOuter,
            margins: value
        };

        return getSize(el, propName, include);
    }

    if(isNumeric(value)) {
        const elementStyles = getElementComputedStyle(el);
        const sizeAdjustment = getElementBoxParams(propName, elementStyles);
        const isBorderBox = elementStyles.boxSizing === 'border-box';
        value = Number(value);

        if(isOuter) {
            value -= isBorderBox ? 0 : (sizeAdjustment.border + sizeAdjustment.padding);
        } else if(isInner) {
            value += isBorderBox ? sizeAdjustment.border : -sizeAdjustment.padding;
        } else if(isBorderBox) {
            value += sizeAdjustment.border + sizeAdjustment.padding;
        }
    }
    value += isNumeric(value) ? 'px' : '';

    domAdapter.setStyle(el, propName, value);

    return null;
};

export const getWindowByElement = (el) => {
    return isWindow(el) ? el : el.defaultView;
};

export const getOffset = (el) => {
    if(!el.getClientRects().length) {
        return {
            top: 0,
            left: 0
        };
    }

    const rect = el.getBoundingClientRect();
    const win = getWindowByElement(el.ownerDocument);
    const docElem = el.ownerDocument.documentElement;

    return {
        top: rect.top + win.pageYOffset - docElem.clientTop,
        left: rect.left + win.pageXOffset - docElem.clientLeft
    };
};
