import '@ts/core/localization/globalize/core';
import '@ts/core/localization/globalize/number';
import '@ts/core/localization/currency';
import 'globalize/currency';

import config from '@js/core/config';
import type { FormatConfig, NormalizedConfig } from '@ts/core/localization/number';
import numberLocalization from '@ts/core/localization/number';
import openXmlCurrencyFormat from '@ts/core/localization/open_xml_currency_format';
// eslint-disable-next-line import/no-extraneous-dependencies
import Globalize from 'globalize';

const CURRENCY_STYLES = ['symbol', 'accounting'];

type Formatter = (value: number) => string;

if (Globalize?.formatCurrency) {
  if (Globalize.locale().locale === 'en') {
    Globalize.locale('en');
  }

  const formattersCache: Record<string, Formatter> = {};

  const getFormatter = (
    currency: string | undefined,
    format: string | FormatConfig | undefined,
  ): Formatter => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let formatter: Formatter;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let formatCacheKey: string;

    if (typeof format === 'object') {
      formatCacheKey = `${Globalize.locale().locale}:${currency}:${JSON.stringify(format)}`;
    } else {
      formatCacheKey = `${Globalize.locale().locale}:${currency}:${format}`;
    }
    formatter = formattersCache[formatCacheKey];
    if (!formatter) {
      formatter = Globalize.currencyFormatter(currency, format);
      formattersCache[formatCacheKey] = formatter;
    }

    return formatter;
  };

  const globalizeCurrencyLocalization = {
    _formatNumberCore(value: number, format: string, formatConfig: FormatConfig): string {
      if (format === 'currency') {
        const currency = formatConfig?.currency ?? config().defaultCurrency;

        return getFormatter(
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
      format: number | string | FormatConfig | Function | undefined,
    ): string | number {
      if (typeof value !== 'number') {
        return value;
      }

      // eslint-disable-next-line no-param-reassign
      format = this._normalizeFormat(format) as FormatConfig;

      if (format) {
        if (format.currency === 'default') {
          format.currency = config().defaultCurrency;
        }

        if (format.type === 'currency') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return this._formatNumber(value, this._parseNumberFormatString('currency'), format);
        } if (!format.type && format.currency) {
          return getFormatter(format.currency, format)(value);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase.apply(this, [value, format]);
    },
    getCurrencySymbol(currency?: string): { symbol: string } {
      if (!currency) {
        // eslint-disable-next-line no-param-reassign
        currency = config().defaultCurrency;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Globalize.cldr.main(`numbers/currencies/${currency}`);
    },
    getOpenXmlCurrencyFormat(currency: string): string | undefined {
      const currencySymbol = this.getCurrencySymbol(currency).symbol;
      const accountingFormat = Globalize.cldr.main('numbers/currencyFormats-numberSystem-latn').accounting;

      return openXmlCurrencyFormat(currencySymbol, accountingFormat);
    },
  };

  numberLocalization.inject(globalizeCurrencyLocalization);
}
