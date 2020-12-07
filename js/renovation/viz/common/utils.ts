import { Format, FormatObject } from './types.d';
import formatHelper from '../../../format_helper';

export function getFormatValue(value: number|Date, specialFormat: string,
  { argumentFormat, format }: { argumentFormat?: Format; format?: Format }): string {
  let option = format;
  if (specialFormat) {
    option = specialFormat === 'argument' ? argumentFormat
      : { type: 'percent', precision: (format as FormatObject)?.percentPrecision };
  }

  return formatHelper.format(value, option);
}
