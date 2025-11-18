import { multiplyInExponentialForm, sign } from '@ts/core/utils/m_math';

const DECIMAL_BASE = 10;

function roundByAbs(value: number): number {
  const valueSign = sign(value);

  return valueSign * Math.round(Math.abs(value));
}

function adjustValue(value: number, precision: number): number {
  const precisionMultiplier = DECIMAL_BASE ** precision;
  const intermediateValue = multiplyInExponentialForm(value, precision);

  return roundByAbs(intermediateValue) / precisionMultiplier;
}

export function toFixed(value: number, precision?: number): string {
  const valuePrecision = precision ?? 0;
  const adjustedValue = valuePrecision > 0 ? adjustValue(value, valuePrecision) : value;

  return adjustedValue.toFixed(valuePrecision);
}
