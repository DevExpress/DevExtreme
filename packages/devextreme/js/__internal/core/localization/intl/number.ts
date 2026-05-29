import dxConfig from '@js/core/config';
import accountingFormats from '@ts/core/localization/cldr-data/accounting_formats';
import localizationCoreUtils from '@ts/core/localization/core';
import type { FormatConfig as BaseFormatConfig, LocalizationFormat } from '@ts/core/localization/number';
import openXmlCurrencyFormat from '@ts/core/localization/open_xml_currency_format';
import { getGlobalFormatByDataType } from '@ts/core/m_global_format_config';

interface CurrencySymbolInfo {
  position: 'before' | 'after';
  symbol: string;
  delimiter: string;
}

type FormatConfig = BaseFormatConfig & Intl.NumberFormatOptions;
type NormalizedConfig = Intl.NumberFormatOptions & {
  round?: string;
};
type IntlFormatter = Intl.NumberFormat['format'];

const CURRENCY_STYLES = ['standard', 'accounting'];
const MAX_FRACTION_DIGITS = 20;

const detectCurrencySymbolRegex = /([^\s0]+)?(\s*)0*[.,]*0*(\s*)([^\s0]+)?/;
const formattersCache: Record<string, IntlFormatter> = {};

const getFormatter = (format: NormalizedConfig): IntlFormatter => {
  const key = `${localizationCoreUtils.locale()}/${JSON.stringify(format)}`;
  if (!formattersCache[key]) {
    formattersCache[key] = new Intl.NumberFormat(localizationCoreUtils.locale(), format).format;
  }

  return formattersCache[key];
};

const getCurrencyFormatter = (currency: string): Intl.NumberFormat => new Intl.NumberFormat(localizationCoreUtils.locale(), { style: 'currency', currency });

export default {
  engine(): string {
    return 'intl';
  },
  _formatNumberCore(value: number, format: string, formatConfig: FormatConfig): string {
    if (format === 'exponential') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase.apply(this, [value, format, formatConfig]);
    }

    return getFormatter(this._normalizeFormatConfig(format, formatConfig, value))(value);
  },
  _normalizeFormatConfig(
    format: string,
    formatConfig: FormatConfig,
    value: number,
  ): NormalizedConfig {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let config: NormalizedConfig;

    if (format === 'decimal') {
      const fractionDigits = String(value).split('.')[1];
      config = {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        minimumIntegerDigits: formatConfig.precision || undefined,
        useGrouping: false,
        maximumFractionDigits: fractionDigits?.length,
        round: value < 0 ? 'ceil' : 'floor',
      };
    } else {
      config = this._getPrecisionConfig(formatConfig.precision);
    }

    if (format === 'percent') {
      config.style = 'percent';
    } else if (format === 'currency') {
      // @ts-expect-error
      const useAccountingStyle: boolean = formatConfig.useCurrencyAccountingStyle
        ?? dxConfig().defaultUseCurrencyAccountingStyle;
      config.style = 'currency';
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      config.currency = formatConfig.currency || dxConfig().defaultCurrency;
      config.currencySign = CURRENCY_STYLES[+useAccountingStyle];
    }

    return config;
  },
  _getPrecisionConfig(precision: number | null): Intl.NumberFormatOptions {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let config: Intl.NumberFormatOptions;

    if (precision === null) {
      config = {
        minimumFractionDigits: 0,
        maximumFractionDigits: MAX_FRACTION_DIGITS,
      };
    } else {
      config = {
        minimumFractionDigits: precision || 0,
        maximumFractionDigits: precision || 0,
      };
    }

    return config;
  },
  format(
    value: string | number,
    format: LocalizationFormat,
  ): string {
    if (typeof value !== 'number') {
      return value;
    }

    const globalNumberFormat = getGlobalFormatByDataType('number');

    if (!format && globalNumberFormat) {
      // eslint-disable-next-line no-param-reassign
      format = globalNumberFormat as LocalizationFormat;
    }

    // eslint-disable-next-line no-param-reassign
    format = this._normalizeFormat(format) as FormatConfig;

    if (format.currency === 'default') {
      format.currency = dxConfig().defaultCurrency;
    }

    // eslint-disable-next-line @stylistic/no-mixed-operators
    if (!format || typeof format !== 'function' && !(format as FormatConfig).type && !(format as FormatConfig).formatter) {
      return getFormatter(format)(value);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callBase.apply(this, [value, format]);
  },
  _getCurrencySymbolInfo(currency: string): CurrencySymbolInfo {
    const formatter = getCurrencyFormatter(currency);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._extractCurrencySymbolInfo(formatter.format(0));
  },
  _extractCurrencySymbolInfo(currencyValueString: string): CurrencySymbolInfo {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const match = detectCurrencySymbolRegex.exec(currencyValueString) || [];
    const position = match[1] ? 'before' : 'after';
    const symbol = match[1] || match[4] || '';
    const delimiter = match[2] || match[3] || '';

    return {
      position,
      symbol,
      delimiter,
    };
  },

  getCurrencySymbol(currency: string): { symbol: string } {
    if (!currency) {
      // @ts-expect-error
      // eslint-disable-next-line
      currency = dxConfig().defaultCurrency;
    }

    const symbolInfo = this._getCurrencySymbolInfo(currency);
    return {
      symbol: symbolInfo.symbol,
    };
  },
  getOpenXmlCurrencyFormat(currency: string): string | undefined {
    const targetCurrency = currency || dxConfig().defaultCurrency;
    const currencySymbol: string = this._getCurrencySymbolInfo(targetCurrency).symbol;
    const closestAccountingFormat: string | undefined = localizationCoreUtils
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .getValueByClosestLocale((locale: string): string => accountingFormats[locale]);

    return openXmlCurrencyFormat(currencySymbol, closestAccountingFormat);
  },
};
