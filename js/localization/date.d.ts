import { Format } from '../localization';

type AbbreviationFormat = 'abbreviated' | 'short' | 'narrow';

interface DateLocalization {
  firstDayOfWeekIndex(): number;
  format(date: Date | undefined, format: Format): string | Date | undefined;
  getDayNames(format: AbbreviationFormat): string[];
  getMonthNames(format: AbbreviationFormat): string[];
}
declare const dateLocalization: DateLocalization;
export default dateLocalization;
