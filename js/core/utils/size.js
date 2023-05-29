import { getWindow } from '../../core/utils/window';
import domAdapter from '../../core/dom_adapter';
import { isWindow, isString, isNumeric, isRenderer } from '../utils/type';
import { hasVisualViewport, getVisualViewportSizes } from './visual_viewport';

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

const getElementComputedStyle = function(element) {
    const view = element?.ownerDocument?.defaultView || window;
    return view.getComputedStyle && view.getComputedStyle(element);
};
const getCSSProperty = function(element, styles, name, defaultValue) {
    return styles?.[name] || element.style?.[name] || defaultValue;
};


const boxIndices = {
    content: 0,
    padding: 1,
    border: 2,
    margin: 3,
    'content-box': 0,
    'border-box': 2,
};
const dimensionComponents = {
    width: ['left', 'right'],
    height: ['top', 'bottom']
};
function getComponentThickness(elem, dimension, component, styles) {
    const get = (elem, styles, field) => parseFloat(getCSSProperty(elem, styles, field, '0')) || 0;
    const suffix = component === 'border' ? '-width' : '';
    return get(elem, styles, `${component}-${dimensionComponents[dimension][0]}${suffix}`)
        + get(elem, styles, `${component}-${dimensionComponents[dimension][1]}${suffix}`);
}

export const getSize = function(element, dimension, box) {
    const offsetFieldName = dimension === 'width' ? 'offsetWidth' : 'offsetHeight';

    const styles = getElementComputedStyle(element);
    let result = getCSSProperty(element, styles, dimension);
    if(result === '' || result === 'auto') {
        result = element[offsetFieldName];
    }
    result = parseFloat(result) || 0;

    const currentBox = getCSSProperty(element, styles, 'boxSizing', 'content-box');
    const targetBox = box || currentBox;

    let targetBoxIndex = boxIndices[targetBox];
    let currentBoxIndex = boxIndices[currentBox];

    if(targetBoxIndex === undefined || currentBoxIndex === undefined) {
        throw new Error();
    }

    if(currentBoxIndex === targetBoxIndex) {
        return result;
    }

    const coeff = Math.sign(targetBoxIndex - currentBoxIndex);
    let padding = false;
    let border = false;
    let margin = false;
    let scrollThickness = false;

    if(coeff === 1) {
        targetBoxIndex += 1;
        currentBoxIndex += 1;
    }

    for(let boxPart = currentBoxIndex; boxPart !== targetBoxIndex; boxPart += coeff) {

        switch(boxPart) {
            case boxIndices.content:
                break;
            case boxIndices.padding:
                padding = coeff * getComponentThickness(element, dimension, 'padding', styles);
                break;
            case boxIndices.border:
                border = coeff * getComponentThickness(element, dimension, 'border', styles);
                break;
            case boxIndices.margin:
                margin = coeff * getComponentThickness(element, dimension, 'margin', styles);
                break;
        }
    }

    if(padding || border) {
        const paddingAndBorder =
            (padding === false ? coeff * getComponentThickness(element, dimension, 'padding', styles) : padding)
            + (border === false ? coeff * getComponentThickness(element, dimension, 'border', styles) : border);

        scrollThickness = coeff * Math.max(0, Math.floor(
            element[offsetFieldName] -
            result -
            (coeff * paddingAndBorder)
        )) || 0;
    }

    return result + margin + padding + border + scrollThickness;
};

const getContainerHeight = function(container) {
    return isWindow(container) ? container.innerHeight : container.offsetHeight;
};

export const parseHeight = function(value, container, element) {
    if(value.indexOf('px') > 0) {
        value = parseInt(value.replace('px', ''));
    } else if(value.indexOf('%') > 0) {
        value = parseInt(value.replace('%', '')) * getContainerHeight(container) / 100;
    } else if(!isNaN(value)) {
        value = parseInt(value);
    } else if(value.indexOf('vh') > 0) {
        value = window.innerHeight / 100 * parseInt(value.replace('vh', ''));
    } else if(element && value.indexOf('em') > 0) {
        value = parseFloat(value.replace('em', '')) * parseFloat(window.getComputedStyle(element).fontSize);
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

const elementSize = function(el, sizeProperty, value) {
    const partialName = sizeProperty.toLowerCase().indexOf('width') >= 0 ? 'Width' : 'Height';
    const propName = partialName.toLowerCase();
    const isOuter = sizeProperty.indexOf('outer') === 0;
    const isInner = sizeProperty.indexOf('inner') === 0;
    const isGetter = arguments.length === 2 || typeof value === 'boolean';
    const shouldUseVisualViewport = hasVisualViewport() && (sizeProperty === 'width' || sizeProperty === 'height');

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
        if(shouldUseVisualViewport) {
            const size = getVisualViewportSizes()[sizeProperty];

            return size;
        }

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
        let box = 'content';
        if(isOuter) {
            box = value ? 'margin' : 'border';
        }
        if(isInner) {
            box = 'padding';
        }

        return getSize(el, propName, box);
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
