import { Format as LocalizationFormat } from '../localization';

type Format = 'abbreviated' | 'short' | 'narrow';

interface DateLocalization {
  firstDayOfWeekIndex(): number;
  format(date?: Date, format?: LocalizationFormat): string | Date | undefined;
  getDayNames(format?: Format): string[];
  getMonthNames(format?: Format): string[];
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
declare const dateLocalization: DateLocalization;
export default dateLocalization;
