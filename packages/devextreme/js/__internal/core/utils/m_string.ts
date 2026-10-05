import { isFunction, isString } from '@js/core/utils/type';

interface Quad {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const encodeHtml = (function createEncodeHtml() {
  const encodeRegExp = [new RegExp('&', 'g'), new RegExp('"', 'g'), new RegExp('\'', 'g'), new RegExp('<', 'g'), new RegExp('>', 'g')];

  return function encode(str: unknown): string {
    return String(str)
      .replace(encodeRegExp[0], '&amp;')
      .replace(encodeRegExp[1], '&quot;')
      .replace(encodeRegExp[2], '&#39;')
      .replace(encodeRegExp[3], '&lt;')
      .replace(encodeRegExp[4], '&gt;');
  };
}());

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the parts, or the raw value itself
const splitQuad = function splitQuad(raw): any {
  switch (typeof raw) {
    case 'string':
      return raw.split(/\s+/, 4);
    case 'object':
      return [
        raw.x || raw.h || raw.left,
        raw.y || raw.v || raw.top,
        raw.x || raw.h || raw.right,
        raw.y || raw.v || raw.bottom];
    case 'number':
      return [raw];
    default:
      return raw;
  }
};

export const quadToObject = function quadToObject(raw: unknown): Quad {
  const quad = splitQuad(raw);
  let left = parseInt(quad && quad[0], 10);
  let top = parseInt(quad && quad[1], 10);
  let right = parseInt(quad && quad[2], 10);
  let bottom = parseInt(quad && quad[3], 10);

  if (!isFinite(left)) {
    left = 0;
  }
  if (!isFinite(top)) {
    top = left;
  }
  if (!isFinite(right)) {
    right = left;
  }
  if (!isFinite(bottom)) {
    bottom = top;
  }

  return {
    top, right, bottom, left,
  };
};

export function format(template: unknown, ...values: unknown[]): string {
  if (isFunction(template)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- the function is untyped
    return template(...values);
  }

  let result = template as string;

  values.forEach((value, index) => {
    const replacement = isString(value) ? value.replace(/\$/g, '$$$$') : value;

    const placeholderReg = new RegExp(`\\{${index}\\}`, 'gm');
    // replace() coerces a value that is not a string itself
    result = result.replace(placeholderReg, replacement as string);
  });

  return result;
}

export const isEmpty = (function createIsEmpty() {
  const SPACE_REGEXP = /\s/g;

  return function isEmptyText(text: string | null | undefined): boolean {
    return !text || !text.replace(SPACE_REGEXP, '');
  };
}());
