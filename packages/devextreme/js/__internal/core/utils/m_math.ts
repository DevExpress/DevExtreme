import { isExponential } from '@js/core/utils/type';

const sign = function (value) {
  if (value === 0) {
    return 0;
  }

  return value / Math.abs(value);
};

const fitIntoRange = function (value, minValue, maxValue) {
  const isMinValueUndefined = !minValue && minValue !== 0;
  const isMaxValueUndefined = !maxValue && maxValue !== 0;

  isMinValueUndefined && (minValue = !isMaxValueUndefined ? Math.min(value, maxValue) : value);
  isMaxValueUndefined && (maxValue = !isMinValueUndefined ? Math.max(value, minValue) : value);

  return Math.min(Math.max(value, minValue), maxValue);
};

const inRange = function (value, minValue, maxValue) {
  return value >= minValue && value <= maxValue;
};

function getExponent(value: number) {
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
  const [_, exponentString] = value.toExponential().split('e');
  return Math.abs(parseInt(exponentString, 10));
}

function getExponentialNotation(value) {
  const parts = value.toExponential().split('e');

  const mantissa = parseFloat(parts[0]);
  const exponent = parseInt(parts[1], 10);

  return {
    exponent,
    mantissa,
  };
}

function multiplyInExponentialForm(value, exponentShift) {
  const exponentialNotation = getExponentialNotation(value);

  return parseFloat(`${exponentialNotation.mantissa}e${exponentialNotation.exponent + exponentShift}`);
}

const EXP_TO_CHANGE_NOTATION = 7;
const MAX_PRECISION = 15;
const MIN_PRECISION = 7;

function adjust(value: number, interval?: number): number {
  const absValue = Math.abs(value);
  const integerPart = absValue > 1 ? 10 : 0;

  const precision = getPrecision(interval ?? 0) + 2;

  const finalPrecision = precision > EXP_TO_CHANGE_NOTATION ? MAX_PRECISION : MIN_PRECISION;

  const [integerValuePart, fractionalValuePart] = value.toString().split('.');
  const sourceValue = value;

  const isExponentValue = isExponential(value);

  if (isExponentValue) {
    return adjustExponential(value, finalPrecision);
  }

  if (!fractionalValuePart) {
    return value;
  }

  if (isExponential(interval)) {
    const expPrecision = integerValuePart.length + getExponent(interval);
    return parseFloat(sourceValue.toPrecision(expPrecision));
  }

  const fractionalPart = absValue - Math.floor(absValue);
  const adjustedValue = integerPart + fractionalPart;

  const separatedAdjustedValue = parseFloat(adjustedValue.toPrecision(finalPrecision)).toString().split('.');

  const isIntPartNotChanged = separatedAdjustedValue[0] === integerPart.toString();
  if (isIntPartNotChanged) {
    return parseFloat(`${integerValuePart}.${separatedAdjustedValue[1]}`);
  }

  return parseFloat(sourceValue.toPrecision(finalPrecision));
}

function adjustExponential(value: number, precision: number) {
  const expValue = value.toExponential();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
  const [mantissa, _exponent] = expValue.split('e');

  if (!mantissa.includes('.')) {
    return parseFloat(expValue);
  }

  return parseFloat(value.toPrecision(precision));
}

function getPrecision(value: number) {
  const str = value.toString();

  if (!str.includes('.')) {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
  const [_, fractionalPart] = str.split('.');
  const positionOfDelimiter = fractionalPart.indexOf('e');

  return positionOfDelimiter >= 0 ? positionOfDelimiter : fractionalPart.length;
}

function getRoot(x, n) {
  if (x < 0 && n % 2 !== 1) {
    return NaN;
  }

  const y = Math.abs(x) ** (1 / n);
  return n % 2 === 1 && x < 0 ? -y : y;
}

function solveCubicEquation(a, b, c, d) {
  const min = 1e-8;
  if (Math.abs(a) < min) {
    a = b; b = c; c = d;
    if (Math.abs(a) < min) {
      a = b; b = c;
      if (Math.abs(a) < min) {
        return [];
      }
      return [-b / a];
    }

    const D2 = b * b - 4 * a * c;
    if (Math.abs(D2) < min) {
      return [-b / (2 * a)];
    } if (D2 > 0) {
      return [(-b + Math.sqrt(D2)) / (2 * a), (-b - Math.sqrt(D2)) / (2 * a)];
    }
    return [];
  }

  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  let roots;
  let u;

  if (Math.abs(p) < min) {
    roots = [getRoot(-q, 3)];
  } else if (Math.abs(q) < min) {
    roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
  } else {
    const D3 = q * q / 4 + p * p * p / 27;
    if (Math.abs(D3) < min) {
      roots = [-1.5 * q / p, 3 * q / p];
    } else if (D3 > 0) {
      u = getRoot(-q / 2 - Math.sqrt(D3), 3);
      roots = [u - p / (3 * u)];
    } else {
      u = 2 * Math.sqrt(-p / 3);
      const t = Math.acos(3 * q / p / u) / 3;
      const k = 2 * Math.PI / 3;
      roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
    }
  }

  for (let i = 0; i < roots.length; i++) {
    roots[i] -= b / (3 * a);
  }

  return roots;
}

function trunc(value) {
  return Math.trunc ? Math.trunc(value) : value > 0 ? Math.floor(value) : Math.ceil(value);
}

function getRemainderByDivision(dividend, divider, digitsCount) {
  if (divider === parseInt(divider, 10)) {
    return dividend % divider;
  }

  const quotient = roundFloatPart(dividend / divider, digitsCount);
  // @ts-expect-error probably remove parseInt here
  return (quotient - parseInt(quotient, 10)) * divider;
}

function getExponentLength(value) {
  const valueString = value.toString();

  return valueString.split('.')[1]?.length
        || parseInt(valueString.split('e-')[1], 10)
        || 0;
}

function roundFloatPart(value: number, digitsCount = 0): number {
  return parseFloat(value.toFixed(digitsCount));
}

export {
  adjust,
  fitIntoRange,
  getExponent,
  getExponentLength,
  getPrecision,
  getRemainderByDivision,
  getRoot,
  inRange,
  multiplyInExponentialForm,
  roundFloatPart,
  sign,
  solveCubicEquation,
  trunc,
};
