import { DateLike } from '../../../common';
import { Format as LocalizationFormat } from '../localization';

type Format = 'abbreviated' | 'short' | 'narrow';

interface DateLocalization {
  firstDayOfWeekIndex(): number;
  format(date?: DateLike, format?: LocalizationFormat): string | Date | undefined;
  formatUsesDayName(format: string): boolean;
  formatUsesMonthName(format: string): boolean;
  getDayNames(format?: Format): string[];
  getMonthNames(format?: Format): string[];
  parse(text: string, format?: Format | string): Date | null | undefined;
}
declare const dateLocalization: DateLocalization;
export default dateLocalization;
