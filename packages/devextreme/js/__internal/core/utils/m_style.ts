import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import { camelize } from '@js/core/utils/inflector';
import { isNumeric, isString } from '@js/core/utils/type';
import { callOnce } from '@ts/core/utils/call_once';

const jsPrefixes = ['', 'Webkit', 'Moz', 'O', 'Ms'];
const cssPrefixes: Record<string, string> = {
  '': '',
  Webkit: '-webkit-',
  Moz: '-moz-',
  O: '-o-',
  ms: '-ms-',
};
const getStyles = callOnce(() => domAdapter.createElement('dx').style);

const forEachPrefixes = function forEachPrefixes(
  prop: string,
  callBack: (prefixedProp: string, jsPrefix: string) => string | undefined,
): string {
  const normalizedProp = camelize(prop, true);

  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the loop
  let result: string | undefined;

  for (let i = 0, cssPrefixesCount = jsPrefixes.length; i < cssPrefixesCount; i += 1) {
    const jsPrefix = jsPrefixes[i];
    const prefixedProp = jsPrefix + normalizedProp;
    const lowerPrefixedProp = camelize(prefixedProp);

    result = callBack(lowerPrefixedProp, jsPrefix);
    result ??= callBack(prefixedProp, jsPrefix);

    if (result !== undefined) {
      break;
    }
  }

  return result ?? '';
};

const styleProp = function styleProp(name: string): string {
  if (name in getStyles()) {
    return name;
  }

  const capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);
  for (let i = 1; i < jsPrefixes.length; i += 1) {
    const prefixedProp = jsPrefixes[i].toLowerCase() + capitalizedName;
    if (prefixedProp in getStyles()) {
      return prefixedProp;
    }
  }

  return name;
};

const stylePropPrefix = function stylePropPrefix(prop: string): string {
  return forEachPrefixes(prop, (specific, jsPrefix): string | undefined => {
    if (specific in getStyles()) {
      return cssPrefixes[jsPrefix];
    }

    return undefined;
  });
};

const pxExceptions = [
  'fillOpacity',
  'columnCount',
  'flexGrow',
  'flexShrink',
  'fontWeight',
  'lineHeight',
  'opacity',
  'zIndex',
  'zoom',
];

const parsePixelValue = function parsePixelValue(value: unknown): number {
  if (isNumeric(value)) {
    return value;
  } if (isString(value)) {
    return Number(value.replace('px', ''));
  }
  return NaN;
};

const normalizeStyleProp = function normalizeStyleProp<T>(prop: string, value: T): T | string {
  if (isNumeric(value) && !pxExceptions.includes(prop)) {
    return `${value}px`;
  }

  return value;
};

type Elements = ArrayLike<HTMLElement> | dxElementWrapper | null | undefined;

const setDimensionProperty = function setDimensionProperty(
  elements: Elements,
  propertyName: string,
  value: unknown,
): void {
  if (elements) {
    const dimension = isNumeric(value) ? `${value}px` : value;
    for (let i = 0; i < elements.length; i += 1) {
      (elements as ArrayLike<HTMLElement>)[i].style[propertyName] = dimension;
    }
  }
};

const setWidth = function setWidth(elements: Elements, value: unknown): void {
  setDimensionProperty(elements, 'width', value);
};

const setHeight = function setHeight(elements: Elements, value: unknown): void {
  setDimensionProperty(elements, 'height', value);
};

const setStyle = function setStyle(element: Element, styleString: string, resetStyle = true): void {
  if (resetStyle) {
    const styleList = [].slice.call((element as HTMLElement).style);
    styleList.forEach((propertyName) => {
      (element as HTMLElement).style.removeProperty(propertyName);
    });
  }
  styleString.split(';').forEach((style) => {
    const parts = style.split(':').map((stylePart) => stylePart.trim());
    if (parts.length === 2) {
      const [property, value] = parts;
      (element as HTMLElement).style[property] = value;
    }
  });
};

export {
  normalizeStyleProp,
  parsePixelValue,
  setHeight,
  setStyle,
  setWidth,
  styleProp,
  stylePropPrefix,
};
