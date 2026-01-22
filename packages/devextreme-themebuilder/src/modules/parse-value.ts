import * as sass from 'sass-embedded';

export const color = (value: sass.SassColor): string => {
  const getHex = (colorValue: number): string => {
    const n = Math.max(0, Math.min(255, Math.round(colorValue)));

    return n.toString(16).padStart(2, '0');
  };

  const alpha = Math.round(255 * value.alpha);
  if (alpha === 0) {
    return 'transparent';
  }

  const hexRed = getHex(value.channel('red'));
  const hexGreen = getHex(value.channel('green'));
  const hexBlue = getHex(value.channel('blue'));
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
    sass.compileString(`$_: ___([${str}]);`, {
      functions: {
        '___($value)': ([listValue]) => {
          if (listValue.asList.size > 1) {
            result = new sass.SassList(
              listValue.asList,
              {
                brackets: false,
                separator: listValue.separator,
              },
            );
          } else {
            result = listValue.get(0);
          }

          return result;
        },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return new sass.SassString(str);
  }

  return result;
};
