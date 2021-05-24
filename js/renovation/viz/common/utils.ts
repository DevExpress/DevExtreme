import { Format, FormatObject } from './types.d';
import formatHelper from '../../../format_helper';
import { isDefined } from '../../../core/utils/type';
import getElementComputedStyle from '../../utils/get_computed_style';
import { toNumber } from '../../utils/type_conversion';

export function getElementWidth(element: Element | undefined | null): number {
  const style = getElementComputedStyle(element);
  return toNumber(style?.width) - toNumber(style?.paddingLeft) - toNumber(style?.paddingRight);
}
export function getElementHeight(element: Element | undefined | null): number {
  const style = getElementComputedStyle(element);
  return toNumber(style?.height) - toNumber(style?.paddingTop) - toNumber(style?.paddingBottom);
}

export const sizeIsValid = (value: number | undefined): boolean => !!(value && (value > 0));

export const pickPositiveValue = (
  values: (number | undefined)[],
// eslint-disable-next-line max-len
): number => values.reduce((result: number, value) => (value && value > 0 && !result ? value : result), 0);

export const pointInCanvas = (canvas: ClientRect, x: number, y: number):
boolean => x >= canvas.left && x <= canvas.right && y >= canvas.top && y <= canvas.bottom;

export function getFormatValue(value: number|Date|string, specialFormat: string|undefined,
  { argumentFormat, format }: { argumentFormat?: Format; format?: Format }): string {
  let option = format;
  if (specialFormat) {
    option = specialFormat === 'argument' ? argumentFormat
      : { type: 'percent', precision: (format as FormatObject)?.percentPrecision };
  }

  return formatHelper.format(value, option);
}

export function isUpdatedFlatObject<T>(newState: T, oldState: T): boolean {
  return (isDefined(newState) || isDefined(oldState))
    && (!isDefined(newState) || !isDefined(oldState)
    || Object.keys(newState).some((key) => newState[key] !== oldState[key]));
}
