import type { FormatConfig } from '@ts/core/localization/number';

export default {
  _formatNumberCore(value: number, format: string, formatConfig: FormatConfig): string {
    if (format === 'currency') {
      formatConfig.precision = formatConfig.precision ?? 0;

      let result: string = this.format(value, { ...formatConfig, type: 'fixedpoint' });
      const currencyPart = this.getCurrencySymbol().symbol.replace(/\$/g, '$$$$');

      result = result.replace(/^(\D*)(\d.*)/, `$1${currencyPart}$2`);

      return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callBase.apply(this, [value, format, formatConfig]);
  },
  getCurrencySymbol(): { symbol: string } {
    return { symbol: '$' };
  },
  getOpenXmlCurrencyFormat(): string {
    return '$#,##0{0}_);\\($#,##0{0}\\)';
  },
};
