import { Format as LocalizationFormat } from '../localization';

type Format = 'abbreviated' | 'short' | 'narrow';

interface DateLocalization {
  firstDayOfWeekIndex(): number;
  format(date?: Date, format?: LocalizationFormat): string | Date | undefined;
  getDayNames(format?: Format): string[];
  getMonthNames(format?: Format): string[];
}
declare const dateLocalization: DateLocalization;
export default dateLocalization;
