/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
import * as sass from 'sass';

export const number = (value: sass.types.Number): string => `${value.getValue()}${value.getUnit()}`;

export const color = (value: sass.types.Color): string => {
  const getHex = (colorValue: number): string => colorValue.toString(16).padStart(2, '0');

  const alpha = Math.round(255 * value.getA());
  if (alpha === 0) {
    return 'transparent';
  }

  const hexRed = getHex(value.getR());
  const hexGreen = getHex(value.getG());
  const hexBlue = getHex(value.getB());
  const hexAlpha = alpha === 255 ? '' : getHex(alpha);

  return `#${hexRed}${hexGreen}${hexBlue}${hexAlpha}`;
};

export const string = (value: sass.types.String): string => {
  const result = value.getValue();
  const hasQuotes = result.includes(' ');

  return hasQuotes ? `"${result}"` : result;
};

export const list = (value: sass.types.List): string => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const list = [];
  for (let index = 0; index < value.getLength(); index += 1) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    list.push(parse(value.getValue(index)));
  }

  const separator = value.getSeparator() ? ', ' : ' ';
  return list.join(separator);
};

export const parse = (value: sass.types.Value): string => {
  let result = '';

  if (value instanceof sass.types.Number) {
    result = number(value);
  } else if (value instanceof sass.types.Color) {
    result = color(value);
  } else if (value instanceof sass.types.String) {
    result = string(value);
  } else if (value instanceof sass.types.List) {
    result = list(value);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    throw new Error(`Unknown type: ${value}`);
  }

  return result;
};
