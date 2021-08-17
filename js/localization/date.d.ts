type FormatFunction = (date: Date) => string;
type Formatter = string | FormatFunction | {
  formatter: FormatFunction;
} | {
  type: string;
};
type Format = 'abbreviated' | 'short' | 'narrow';

interface DateLocalization {
  firstDayOfWeekIndex(): number;
  format(date: Date | undefined, format: Formatter): string | Date | undefined;
  getDayNames(format: Format): string[];
  getMonthNames(format: Format): string[];
}
declare const dateLocalization: DateLocalization;
export default dateLocalization;
