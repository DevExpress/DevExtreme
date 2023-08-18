import * as sass from 'sass-embedded';

export const hexToColor = (hex: string): sass.SassColor => {
  let red = 255; let green = 255; let blue = 255; let alpha = 255;
  const hexMin = hex.replace(/^#/, '');

  if (hexMin.length === 3 || hexMin.length === 4) {
    red = parseInt(hexMin.charAt(0) + hexMin.charAt(0), 16);
    green = parseInt(hexMin.charAt(1) + hexMin.charAt(1), 16);
    blue = parseInt(hexMin.charAt(2) + hexMin.charAt(2), 16);
    if (hexMin.length === 4) {
      alpha = parseInt(hexMin.charAt(3) + hexMin.charAt(3), 16);
    }
  } else if (hexMin.length === 6 || hexMin.length === 8) {
    red = parseInt(hexMin.slice(0, 2), 16);
    green = parseInt(hexMin.slice(2, 4), 16);
    blue = parseInt(hexMin.slice(4, 6), 16);
    if (hexMin.length === 8) {
      alpha = parseInt(hexMin.slice(6, 8), 16);
    }
  }

  return new sass.SassColor({
    red,
    green,
    blue,
    alpha: alpha / 255,
  });
};

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

/**
 * Parse a string as a Sass object
 * cribbed from davidkpiano/sassport
 *
 * @param {string} str
 * @return {Value}
 */
export const parseString = (str: string): sass.Value => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let result: sass.Value;

  try {
    sass.compileString(`$_: ___(${str});`, {
      functions: {
        '___($value)': (args) => {
          // eslint-disable-next-line prefer-destructuring
          result = args[0];
          return result;
        },
      },
    });
  } catch (e) {
    // debugger;
    return new sass.SassString(str);
  }

  return result;
};
