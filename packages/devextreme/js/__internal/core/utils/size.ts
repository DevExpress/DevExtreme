import type { dxElementWrapper } from '@js/core/renderer';
import {
  isNumeric, isRenderer, isString, isWindow,
} from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import domAdapter from '@ts/core/dom_adapter';

type Dimension = 'width' | 'height';
type SizeProperty = Dimension | 'outerWidth' | 'outerHeight' | 'innerWidth' | 'innerHeight';
type Side = 'Left' | 'Right' | 'Top' | 'Bottom';
type BoxStyle = `padding${Side}` | `margin${Side}` | `border${Side}Width`;
type SizedElement = Element & {
  offsetWidth?: number;
  offsetHeight?: number;
  style?: CSSStyleDeclaration;
};
type MeasuredElement = Element | Window | Document;
type SizeTarget = MeasuredElement | dxElementWrapper;
type SizeValue = number | string;

interface ElementBoxParams {
  padding: number;
  border: number;
  margin: number;
}

interface Offset {
  top: number;
  left: number;
}

const window = getWindow();

const isWindowTarget = (target: unknown): target is Window => isWindow(target);

const SPECIAL_HEIGHT_VALUES: readonly SizeValue[] = ['auto', 'none', 'inherit', 'initial'];

const getSizeByStyles = function getSizeByStyles(
  elementStyles: CSSStyleDeclaration,
  styles: BoxStyle[],
): number {
  let result = 0;

  styles.forEach((style) => {
    result += parseFloat(elementStyles[style]) || 0;
  });

  return result;
};

export const getElementBoxParams = function getElementBoxParams(
  name: string,
  elementStyles: CSSStyleDeclaration,
): ElementBoxParams {
  const beforeName = name === 'width' ? 'Left' : 'Top';
  const afterName = name === 'width' ? 'Right' : 'Bottom';

  return {
    padding: getSizeByStyles(elementStyles, [`padding${beforeName}`, `padding${afterName}`]),
    border: getSizeByStyles(elementStyles, [`border${beforeName}Width`, `border${afterName}Width`]),
    margin: getSizeByStyles(elementStyles, [`margin${beforeName}`, `margin${afterName}`]),
  };
};

const getElementComputedStyle = function getElementComputedStyle(
  element: Element,
): CSSStyleDeclaration | undefined {
  const view: Window = element?.ownerDocument?.defaultView ?? window;
  return view.getComputedStyle && view.getComputedStyle(element);
};
function getCSSProperty(
  element: SizedElement,
  styles: CSSStyleDeclaration | undefined,
  name: string,
): string | undefined;
function getCSSProperty(
  element: SizedElement,
  styles: CSSStyleDeclaration | undefined,
  name: string,
  defaultValue: string,
): string;
function getCSSProperty(
  element: SizedElement,
  styles: CSSStyleDeclaration | undefined,
  name: string,
  defaultValue?: string,
): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- a style is read by its CSS name
  return styles?.[name] || element.style?.[name] || defaultValue;
}

const boxIndices: Partial<Record<string, number>> = {
  content: 0,
  padding: 1,
  border: 2,
  margin: 3,
  'content-box': 0,
  'border-box': 2,
};
const dimensionComponents = {
  width: ['left', 'right'],
  height: ['top', 'bottom'],
};
function getComponentThickness(
  elem: SizedElement,
  dimension: Dimension,
  component: string,
  styles: CSSStyleDeclaration | undefined,
): number {
  const get = (
    element: SizedElement,
    elementStyles: CSSStyleDeclaration | undefined,
    field: string,
  ): number => parseFloat(getCSSProperty(element, elementStyles, field, '0')) || 0;
  const suffix = component === 'border' ? '-width' : '';
  return get(elem, styles, `${component}-${dimensionComponents[dimension][0]}${suffix}`)
        + get(elem, styles, `${component}-${dimensionComponents[dimension][1]}${suffix}`);
}

export const getSize = function getSize(
  element: SizedElement,
  dimension: Dimension,
  box?: string,
): number {
  const offsetFieldName = dimension === 'width' ? 'offsetWidth' : 'offsetHeight';

  const styles = getElementComputedStyle(element);
  const cssSize = getCSSProperty(element, styles, dimension);
  const rawSize = cssSize === '' || cssSize === 'auto' ? element[offsetFieldName] : cssSize;
  const result = parseFloat(String(rawSize)) || 0;

  const currentBox = getCSSProperty(element, styles, 'boxSizing', 'content-box');
  const targetBox = box || currentBox;

  let targetBoxIndex = boxIndices[targetBox];
  let currentBoxIndex = boxIndices[currentBox];

  if (targetBoxIndex === undefined || currentBoxIndex === undefined) {
    throw new Error();
  }

  if (currentBoxIndex === targetBoxIndex) {
    return result;
  }

  const coeff = Math.sign(targetBoxIndex - currentBoxIndex);
  /* eslint-disable @typescript-eslint/init-declarations */
  let padding: number | undefined;
  let border: number | undefined;
  /* eslint-enable @typescript-eslint/init-declarations */
  let margin = 0;
  let scrollThickness = 0;

  if (coeff === 1) {
    targetBoxIndex += 1;
    currentBoxIndex += 1;
  }

  for (let boxPart = currentBoxIndex; boxPart !== targetBoxIndex; boxPart += coeff) {
    // eslint-disable-next-line default-case
    switch (boxPart) {
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

  if (padding || border) {
    const paddingAndBorder = (padding ?? coeff * getComponentThickness(element, dimension, 'padding', styles))
      + (border ?? coeff * getComponentThickness(element, dimension, 'border', styles));

    scrollThickness = (coeff * Math.max(0, Math.floor(
      Number(element[offsetFieldName])
            - result
            - (coeff * paddingAndBorder),
    ))) || 0;
  }

  return result + margin + (padding ?? 0) + (border ?? 0) + scrollThickness;
};

const getContainerHeight = function getContainerHeight(container: SizedElement | Window): number {
  return isWindowTarget(container) ? container.innerHeight : Number(container.offsetHeight);
};

export const parseHeight = function parseHeight(
  value: string,
  container: SizedElement | Window,
  element?: Element,
): SizeValue {
  if (value.indexOf('px') > 0) {
    // eslint-disable-next-line radix -- a radix of 10 would read a 0x prefix differently
    return parseInt(value.replace('px', ''));
  }
  if (value.indexOf('%') > 0) {
    // eslint-disable-next-line radix -- a radix of 10 would read a 0x prefix differently
    return (parseInt(value.replace('%', '')) * getContainerHeight(container)) / 100;
  }
  // @ts-expect-error the check converts any value to a number
  if (!isNaN(value)) {
    // eslint-disable-next-line radix -- a radix of 10 would read a 0x prefix differently
    return parseInt(value);
  }
  if (value.indexOf('vh') > 0) {
    // eslint-disable-next-line radix -- a radix of 10 would read a 0x prefix differently
    return (window.innerHeight / 100) * parseInt(value.replace('vh', ''));
  }
  if (element && value.indexOf('em') > 0) {
    return parseFloat(value.replace('em', '')) * parseFloat(window.getComputedStyle(element).fontSize);
  }

  return value;
};

const getHeightWithOffset = function getHeightWithOffset(
  value: SizeValue | null | undefined,
  offset: number,
  container: SizedElement | Window,
): SizeValue | null {
  if (!value) {
    return null;
  }

  if (SPECIAL_HEIGHT_VALUES.includes(value)) {
    return offset ? null : value;
  }

  const height = isString(value) ? parseHeight(value, container) : value;

  if (isNumeric(height)) {
    return Math.max(0, height + offset);
  }

  const operationString = offset < 0 ? ' - ' : ' ';

  return `calc(${value}${operationString}${Math.abs(offset)}px)`;
};

export const addOffsetToMaxHeight = function addOffsetToMaxHeight(
  value: SizeValue | null | undefined,
  offset: number,
  container: SizedElement | Window,
): SizeValue {
  const maxHeight = getHeightWithOffset(value, offset, container);
  return maxHeight ?? 'none';
};

export const addOffsetToMinHeight = function addOffsetToMinHeight(
  value: SizeValue | null | undefined,
  offset: number,
  container: SizedElement | Window,
): SizeValue {
  const minHeight = getHeightWithOffset(value, offset, container);
  return minHeight ?? 0;
};

export const getVerticalOffsets = function getVerticalOffsets(
  element: Element | null | undefined,
  withMargins?: boolean,
): number {
  if (!element) {
    return 0;
  }

  const boxParams = getElementBoxParams('height', window.getComputedStyle(element));

  return boxParams.padding
        + boxParams.border
        + (withMargins ? boxParams.margin : 0);
};

export const getVisibleHeight = function getVisibleHeight(
  element: Element | null | undefined,
): number {
  if (element) {
    const boundingClientRect = element.getBoundingClientRect?.();

    if (boundingClientRect?.height) {
      return boundingClientRect.height;
    }
  }

  return 0;
};

const isWrapper = (
  target: SizeTarget | null | undefined,
): target is dxElementWrapper => isRenderer(target);

const isDocument = (target: MeasuredElement): target is Document => domAdapter.isDocument(target);

function elementSize(
  el: SizeTarget | null | undefined,
  sizeProperty: SizeProperty,
  value?: SizeValue | boolean | null,
): number | null | undefined {
  const partialName = sizeProperty.toLowerCase().includes('width') ? 'Width' : 'Height';
  const propName = partialName === 'Width' ? 'width' : 'height';
  const isOuter = sizeProperty.startsWith('outer');
  const isInner = sizeProperty.startsWith('inner');
  const isGetter = arguments.length === 2 || typeof value === 'boolean';
  let element: SizeTarget | null | undefined = el;

  if (isWrapper(element)) {
    if (element.length > 1 && !isGetter) {
      for (let i = 0; i < element.length; i += 1) {
        elementSize(element.get(i), sizeProperty, value);
      }
      return undefined;
    }
    element = element.get(0);
  }

  if (!element) {
    return undefined;
  }

  if (isWindowTarget(element)) {
    return isOuter ? element[`inner${partialName}`] : domAdapter.getDocumentElement()[`client${partialName}`];
  }

  if (isDocument(element)) {
    const documentElement = domAdapter.getDocumentElement();
    const body = domAdapter.getBody();

    return Math.max(
      body[`scroll${partialName}`],
      body[`offset${partialName}`],
      documentElement[`scroll${partialName}`],
      documentElement[`offset${partialName}`],
      documentElement[`client${partialName}`],
    );
  }

  const sizedElement: SizedElement = element;

  if (isGetter) {
    let box = 'content';
    if (isOuter) {
      box = value ? 'margin' : 'border';
    }
    if (isInner) {
      box = 'padding';
    }

    return getSize(sizedElement, propName, box);
  }

  let styleValue = value;

  if (isNumeric(styleValue)) {
    const elementStyles = getElementComputedStyle(sizedElement);
    // @ts-expect-error a size is set only where the DOM computes styles
    const sizeAdjustment = getElementBoxParams(propName, elementStyles);
    // @ts-expect-error a size is set only where the DOM computes styles
    const isBorderBox = elementStyles.boxSizing === 'border-box';
    styleValue = Number(styleValue);

    if (isOuter) {
      styleValue -= isBorderBox ? 0 : sizeAdjustment.border + sizeAdjustment.padding;
    } else if (isInner) {
      styleValue += isBorderBox ? sizeAdjustment.border : -sizeAdjustment.padding;
    } else if (isBorderBox) {
      styleValue += sizeAdjustment.border + sizeAdjustment.padding;
    }
  }
  styleValue += isNumeric(styleValue) ? 'px' : '';

  // @ts-expect-error setStyle sets the style of any element, the adapter types an HTMLElement
  domAdapter.setStyle(sizedElement, propName, styleValue);

  return null;
}

function elementSizeHelper(
  sizeProperty: SizeProperty,
  el: SizeTarget | null | undefined,
): number | undefined;
function elementSizeHelper(
  sizeProperty: SizeProperty,
  el: SizeTarget | null | undefined,
  // eslint-disable-next-line @typescript-eslint/unified-signatures -- a getter passes no value
  includeMargin: boolean,
): number | undefined;
function elementSizeHelper(
  sizeProperty: SizeProperty,
  el: SizeTarget | null | undefined,
  value: SizeValue | null | undefined,
): number | null | undefined;
function elementSizeHelper(
  sizeProperty: SizeProperty,
  el: SizeTarget | null | undefined,
  value?: SizeValue | boolean | null,
): number | null | undefined {
  return arguments.length === 2
    ? elementSize(el, sizeProperty)
    : elementSize(el, sizeProperty, value);
}

type SizeGetterArgs = [el: SizeTarget | null | undefined];
type OuterSizeGetterArgs = [el: SizeTarget | null | undefined, includeMargin: boolean];
type SizeSetterArgs = [el: SizeTarget | null | undefined, value: SizeValue | null | undefined];

// TODO: remove when we'll start mocking named exports
export const implementationsMap = {
  getWidth: (...args: SizeGetterArgs): number | undefined => elementSizeHelper(
    'width',
    ...args,
  ),
  setWidth: (...args: SizeSetterArgs): number | null | undefined => elementSizeHelper(
    'width',
    ...args,
  ),
  getHeight: (...args: SizeGetterArgs): number | undefined => elementSizeHelper(
    'height',
    ...args,
  ),
  setHeight: (...args: SizeSetterArgs): number | null | undefined => elementSizeHelper(
    'height',
    ...args,
  ),
  getOuterWidth: (...args: OuterSizeGetterArgs): number | undefined => elementSizeHelper(
    'outerWidth',
    ...args,
  ),
  setOuterWidth: (...args: SizeSetterArgs): number | null | undefined => elementSizeHelper(
    'outerWidth',
    ...args,
  ),
  getOuterHeight: (...args: OuterSizeGetterArgs): number | undefined => elementSizeHelper(
    'outerHeight',
    ...args,
  ),
  setOuterHeight: (...args: SizeSetterArgs): number | null | undefined => elementSizeHelper(
    'outerHeight',
    ...args,
  ),
  getInnerWidth: (...args: SizeGetterArgs): number | undefined => elementSizeHelper(
    'innerWidth',
    ...args,
  ),
  setInnerWidth: (...args: SizeSetterArgs): number | null | undefined => elementSizeHelper(
    'innerWidth',
    ...args,
  ),
  getInnerHeight: (...args: SizeGetterArgs): number | undefined => elementSizeHelper(
    'innerHeight',
    ...args,
  ),
  setInnerHeight: (...args: SizeSetterArgs): number | null | undefined => elementSizeHelper(
    'innerHeight',
    ...args,
  ),
};

export function getWidth(el: MeasuredElement): number;
export function getWidth(el: SizeTarget | null | undefined): number | undefined;
export function getWidth(el: SizeTarget | null | undefined): number | undefined {
  return implementationsMap.getWidth(el);
}
export function setWidth(
  el: SizeTarget | null | undefined,
  value: SizeValue | null | undefined,
): number | null | undefined {
  return implementationsMap.setWidth(el, value);
}
export function getHeight(el: MeasuredElement): number;
export function getHeight(el: SizeTarget | null | undefined): number | undefined;
export function getHeight(el: SizeTarget | null | undefined): number | undefined {
  return implementationsMap.getHeight(el);
}
export function setHeight(
  el: SizeTarget | null | undefined,
  value: SizeValue | null | undefined,
): number | null | undefined {
  return implementationsMap.setHeight(el, value);
}
export function getOuterWidth(el: MeasuredElement, includeMargin?: boolean): number;
export function getOuterWidth(
  el: SizeTarget | null | undefined,
  includeMargin?: boolean,
): number | undefined;
export function getOuterWidth(
  el: SizeTarget | null | undefined,
  includeMargin?: boolean,
): number | undefined {
  return implementationsMap.getOuterWidth(el, includeMargin || false);
}
export function setOuterWidth(
  el: SizeTarget | null | undefined,
  value: SizeValue | null | undefined,
): number | null | undefined {
  return implementationsMap.setOuterWidth(el, value);
}
export function getOuterHeight(el: MeasuredElement, includeMargin?: boolean): number;
export function getOuterHeight(
  el: SizeTarget | null | undefined,
  includeMargin?: boolean,
): number | undefined;
export function getOuterHeight(
  el: SizeTarget | null | undefined,
  includeMargin?: boolean,
): number | undefined {
  return implementationsMap.getOuterHeight(el, includeMargin || false);
}
export function setOuterHeight(
  el: SizeTarget | null | undefined,
  value: SizeValue | null | undefined,
): number | null | undefined {
  return implementationsMap.setOuterHeight(el, value);
}
export function getInnerWidth(el: MeasuredElement): number;
export function getInnerWidth(el: SizeTarget | null | undefined): number | undefined;
export function getInnerWidth(el: SizeTarget | null | undefined): number | undefined {
  return implementationsMap.getInnerWidth(el);
}
export function setInnerWidth(
  el: SizeTarget | null | undefined,
  value: SizeValue | null | undefined,
): number | null | undefined {
  return implementationsMap.setInnerWidth(el, value);
}
export function getInnerHeight(el: MeasuredElement): number;
export function getInnerHeight(el: SizeTarget | null | undefined): number | undefined;
export function getInnerHeight(el: SizeTarget | null | undefined): number | undefined {
  return implementationsMap.getInnerHeight(el);
}
export function setInnerHeight(
  el: SizeTarget | null | undefined,
  value: SizeValue | null | undefined,
): number | null | undefined {
  return implementationsMap.setInnerHeight(el, value);
}

export const getWindowByElement = (el: MeasuredElement): Window | null | undefined => {
  if (isWindowTarget(el)) {
    return el;
  }
  const target: { defaultView?: Window | null; nodeType?: number } = el;
  return target.defaultView;
};

export const getOffset = (el: Element): Offset => {
  if (!el.getClientRects().length) {
    return {
      top: 0,
      left: 0,
    };
  }

  const rect = el.getBoundingClientRect();
  const win = getWindowByElement(el.ownerDocument);
  const docElem = el.ownerDocument.documentElement;

  return {
    // @ts-expect-error an element with client rects is in a document with a window
    top: rect.top + win.pageYOffset - docElem.clientTop,
    // @ts-expect-error an element with client rects is in a document with a window
    left: rect.left + win.pageXOffset - docElem.clientLeft,
  };
};
