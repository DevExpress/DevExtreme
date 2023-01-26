import * as sass from 'sass-embedded';

export const color = (value: sass.SassColor): string => {
  const getHex = (colorValue: number): string => colorValue.toString(16).padStart(2, '0');

  const alpha = Math.round(255 * value.alpha);
  if (alpha === 0) {
    return 'transparent';
  }

  const hexRed = getHex(value.red);
  const hexGreen = getHex(value.green);
  const hexBlue = getHex(value.blue);
  const hexAlpha = alpha === 255 ? '' : getHex(alpha);

  return `#${hexRed}${hexGreen}${hexBlue}${hexAlpha}`;
};

export const parse = (value: sass.Value): string => {
  let result = value.toString();

  if (value instanceof sass.SassColor) {
    result = color(value);
  }

  return result;
};
