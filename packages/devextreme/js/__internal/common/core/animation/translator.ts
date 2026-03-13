/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { data as elementData, removeData } from '@js/core/element_data';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { type } from '@js/core/utils/type';

const TRANSLATOR_DATA_KEY = 'dxTranslator';
const TRANSFORM_MATRIX_REGEX = /matrix(3d)?\((.+?)\)/;
const TRANSLATE_REGEX = /translate(?:3d)?\((.+?)\)/;

export interface TranslateVector {
  x: number;
  y: number;
  z?: number;
}

export const locate = function (
  $element: dxElementWrapper | Element | undefined,
): Coordinates {
  // eslint-disable-next-line no-param-reassign
  $element = $($element);

  const translate = getTranslate($element);

  return {
    left: translate.x,
    top: translate.y,
  };
};

function isPercentValue(value): boolean {
  return type(value) === 'string' && value[value.length - 1] === '%';
}

function cacheTranslate($element: dxElementWrapper, translate: TranslateVector): void {
  if ($element.length) {
    elementData($element.get(0), TRANSLATOR_DATA_KEY, translate);
  }
}

export const clearCache = function ($element: dxElementWrapper): void {
  if ($element.length) {
    removeData($element.get(0), TRANSLATOR_DATA_KEY);
  }
};

export const getTranslateCss = function (translate: TranslateVector): string {
  translate.x = translate.x || 0;
  translate.y = translate.y || 0;

  const xValueString = isPercentValue(translate.x) ? translate.x : `${translate.x}px`;
  const yValueString = isPercentValue(translate.y) ? translate.y : `${translate.y}px`;

  return `translate(${xValueString}, ${yValueString})`;
};

export const getTranslate = function ($element: dxElementWrapper): TranslateVector {
  let result: TranslateVector | null = $element.length
    ? elementData($element.get(0), TRANSLATOR_DATA_KEY)
    : null;

  if (!result) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const transformValue = $element.css('transform') || getTranslateCss({ x: 0, y: 0 });
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    let matrix: RegExpExecArray | string[] | null = transformValue.match(TRANSFORM_MATRIX_REGEX);
    const is3D = matrix && matrix[1];

    if (matrix) {
      matrix = matrix[2].split(',');
      if (is3D === '3d') {
        matrix = matrix.slice(12, 15);
      } else {
        matrix.push('0');
        matrix = matrix.slice(4, 7);
      }
    } else {
      matrix = ['0', '0', '0'];
    }

    result = {
      x: parseFloat(matrix[0]),
      y: parseFloat(matrix[1]),
      z: parseFloat(matrix[2]),
    };

    cacheTranslate($element, result);
  }

  return result;
};

export const move = function (
  $element: dxElementWrapper | Element | undefined,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  position,
): void {
  // eslint-disable-next-line no-param-reassign
  $element = $($element);

  const { left, top } = position;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let translate;

  if (left === undefined) {
    translate = getTranslate($element);
    translate.y = top || 0;
  } else if (top === undefined) {
    translate = getTranslate($element);
    translate.x = left || 0;
  } else {
    translate = { x: left || 0, y: top || 0, z: 0 };
    cacheTranslate($element, translate);
  }

  $element.css({
    transform: getTranslateCss(translate),
  });

  if (isPercentValue(left) || isPercentValue(top)) {
    clearCache($element);
  }
};

export const resetPosition = function (
  $element: dxElementWrapper | Element | undefined,
  finishTransition?: boolean,
): void {
  // eslint-disable-next-line no-param-reassign
  $element = $($element);

  // eslint-disable-next-line @typescript-eslint/init-declarations
  let originalTransition;
  const stylesConfig = {
    left: 0,
    top: 0,
    transform: 'none',
  };

  if (finishTransition) {
    originalTransition = $element.css('transition');
    // @ts-expect-error
    stylesConfig.transition = 'none';
  }

  $element.css(stylesConfig);

  clearCache($element);

  if (finishTransition) {
    $element.css('transition', originalTransition);
  }
};

export const parseTranslate = function (translateString: string): TranslateVector | undefined {
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  let result: RegExpExecArray | string[] | null = translateString.match(TRANSLATE_REGEX);

  if (!result || !result[1]) {
    return undefined;
  }

  result = result[1].split(',');

  return {
    x: parseFloat(result[0]),
    y: parseFloat(result[1]),
    z: parseFloat(result[2]),
  };
};
