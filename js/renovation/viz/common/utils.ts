import { Format, FormatObject } from './types.d';
import formatHelper from '../../../format_helper';
import { isDefined } from '../../../core/utils/type';

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
