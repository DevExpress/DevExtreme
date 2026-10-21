import '@ts/core/localization/globalize/core';
import '@ts/core/localization/globalize/number';
import '@ts/core/localization/currency';
import 'globalize/currency';

import config from '@js/core/config';
import { getEffectiveFormatLocale, getFormatterOptions } from '@ts/core/global_format_config';
import type { FormatConfig, LocalizationFormat, NormalizedConfig } from '@ts/core/localization/number';
import numberLocalization from '@ts/core/localization/number';
import openXmlCurrencyFormat from '@ts/core/localization/open_xml_currency_format';
// eslint-disable-next-line import/no-extraneous-dependencies
import Globalize from 'globalize';

const CURRENCY_STYLES = ['symbol', 'accounting'];
const NUMBER_DATA_TYPE = 'number';

type Formatter = (value: number) => string;

if (Globalize?.formatCurrency) {
  if (Globalize.locale().locale === 'en') {
    Globalize.locale('en');
  }

  const formattersCache: Record<string, Formatter> = {};

  const getFormatter = (
    formatLocale: string,
    currency: string | undefined,
    format: string | FormatConfig | undefined,
  ): Formatter => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let formatter: Formatter;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let formatCacheKey: string;

    if (typeof format === 'object') {
      formatCacheKey = `${formatLocale}:${currency}:${JSON.stringify(format)}`;
    } else {
      formatCacheKey = `${formatLocale}:${currency}:${format}`;
    }
    formatter = formattersCache[formatCacheKey];
    if (!formatter) {
      formatter = Globalize(formatLocale).currencyFormatter(currency, format);
      formattersCache[formatCacheKey] = formatter;
    }

    return formatter;
  };

  const globalizeCurrencyLocalization = {
    _formatNumberCore(value: number, format: string, formatConfig: FormatConfig): string {
      if (format === 'currency') {
        const currency = formatConfig?.currency ?? config().defaultCurrency;

        return getFormatter(
          getEffectiveFormatLocale(formatConfig, NUMBER_DATA_TYPE),
          currency,
          this._normalizeFormatConfig(format, formatConfig, value),
        )(value);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase.apply(this, [value, format, formatConfig]);
    },
    _normalizeFormatConfig(
      format: string,
      formatConfig: FormatConfig,
      value: number,
    ): NormalizedConfig {
      const normalizedConfig: NormalizedConfig = this.callBase.apply(
        this,
        [format, formatConfig, value],
      );

      if (format === 'currency') {
        const useAccountingStyle = formatConfig.useCurrencyAccountingStyle
          ?? config().defaultUseCurrencyAccountingStyle;
        // @ts-expect-error
        normalizedConfig.style = CURRENCY_STYLES[+useAccountingStyle];
      }

      return normalizedConfig;
    },
    format(
      value: string | number,
      format?: LocalizationFormat,
    ): string | number {
      if (typeof value !== 'number') {
        return value;
      }

      const normalizedFormat = this._normalizeFormat(format) as FormatConfig;

      if (normalizedFormat) {
        if (normalizedFormat.currency === 'default') {
          normalizedFormat.currency = config().defaultCurrency;
        }

        if (normalizedFormat.type === 'currency') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return this._formatNumber(value, this._parseNumberFormatString('currency'), normalizedFormat);
        } if (!normalizedFormat.type && normalizedFormat.currency) {
          return getFormatter(
            getEffectiveFormatLocale(normalizedFormat, NUMBER_DATA_TYPE),
            normalizedFormat.currency,
            getFormatterOptions(normalizedFormat) as FormatConfig,
          )(value);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase.apply(this, [value, normalizedFormat]);
    },
    getCurrencySymbol(currency?: string): { symbol: string } {
      if (!currency) {
        // eslint-disable-next-line no-param-reassign
        currency = config().defaultCurrency;
      }

      const formatLocale = getEffectiveFormatLocale(undefined, NUMBER_DATA_TYPE);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Globalize(formatLocale).cldr.main(`numbers/currencies/${currency}`);
    },
    getOpenXmlCurrencyFormat(currency?: string): string | undefined {
      const currencySymbol = this.getCurrencySymbol(currency).symbol;
      const formatLocale = getEffectiveFormatLocale(undefined, NUMBER_DATA_TYPE);
      const accountingFormat = Globalize(formatLocale).cldr.main('numbers/currencyFormats-numberSystem-latn').accounting;

      return openXmlCurrencyFormat(currencySymbol, accountingFormat);
    },
  };

  numberLocalization.inject(globalizeCurrencyLocalization);
}
