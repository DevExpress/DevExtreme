/* eslint-disable no-param-reassign */
import type { Format, FormatObject as PublicFormatConfig } from '@js/common/core/localization';
import config from '@js/core/config';
import errors from '@js/core/errors';
import currencyLocalization from '@ts/core/localization/currency';
import intlNumberLocalization from '@ts/core/localization/intl/number';
import { getFormatter } from '@ts/core/localization/ldml/number';
import { toFixed } from '@ts/core/localization/utils';
import { escapeRegExp } from '@ts/core/utils/m_common';
import { injector as dependencyInjector } from '@ts/core/utils/m_dependency_injector';
import { each } from '@ts/core/utils/m_iterator';
import { isPlainObject } from '@ts/core/utils/m_type';

const hasIntl = typeof Intl !== 'undefined';
const MAX_LARGE_NUMBER_POWER = 4;
const DECIMAL_BASE = 10;

const NUMERIC_FORMATS = ['currency', 'fixedpoint', 'exponential', 'percent', 'decimal'];

const LargeNumberFormatPostfixes = {
  1: 'K', // kilo
  2: 'M', // mega
  3: 'B', // billions
  4: 'T', // tera
};

const LargeNumberFormatPowers = {
  // eslint-disable-next-line spellcheck/spell-checker
  largenumber: 'auto',
  thousands: 1,
  millions: 2,
  billions: 3,
  trillions: 4,
};

export interface FormatObject {
  formatType: string;
  power?: 'auto' | number;
}

export type NumberFormatter = (value: number) => string;

export type FormatConfig = PublicFormatConfig & {
  unlimitedIntegerDigits?: boolean;
};

export type LocalizationFormat = Format | FormatConfig;

export interface NormalizedConfig {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumIntegerDigits?: number;
  useGrouping?: boolean;
  round?: string;
  style?: string;
}

export interface FormatterConfig {
  decimalSeparator: string;
  thousandsSeparator: string;
  unlimitedIntegerDigits?: boolean;
}

const numberLocalization = dependencyInjector({
  engine() {
    return 'base';
  },
  numericFormats: NUMERIC_FORMATS,

  defaultLargeNumberFormatPostfixes: LargeNumberFormatPostfixes,

  _parseNumberFormatString(formatType: string | unknown): FormatObject | undefined {
    const formatObject: Partial<FormatObject> = {};

    if (!formatType || typeof formatType !== 'string') {
      return undefined;
    }

    const formatList = formatType.toLowerCase().split(' ');
    each(formatList, (_, value: string) => {
      if (NUMERIC_FORMATS.includes(value)) {
        formatObject.formatType = value;
      } else if (value in LargeNumberFormatPowers) {
        formatObject.power = LargeNumberFormatPowers[value];
      }
    });

    if (formatObject.power && !formatObject.formatType) {
      formatObject.formatType = 'fixedpoint';
    }

    const hasFormatType = (rule: Partial<FormatObject>): rule is FormatObject => 'formatType' in rule;

    if (hasFormatType(formatObject) && formatObject.formatType) {
      return formatObject;
    }

    return undefined;
  },

  _calculateNumberPower(value: number, base: number, minPower?: number, maxPower?: number): number {
    let number = Math.abs(value);
    let power = 0;

    if (number > 1) {
      while (number && number >= base && (maxPower === undefined || power < maxPower)) {
        power += 1;
        number /= base;
      }
    } else if (number > 0 && number < 1) {
      while (number < 1 && (minPower === undefined || power > minPower)) {
        power -= 1;
        number *= base;
      }
    }

    return power;
  },
  _getNumberByPower(number: number, power: number, base: number): number {
    let result = number;

    while (power > 0) {
      result /= base;
      power -= 1;
    }

    while (power < 0) {
      result *= base;
      power += 1;
    }

    return result;
  },
  _formatNumber(value: number, formatObject: FormatObject, formatConfig: FormatConfig): string {
    if (formatObject.power === 'auto') {
      formatObject.power = this._calculateNumberPower(value, 1000, 0, MAX_LARGE_NUMBER_POWER);
    }

    if (formatObject.power) {
      value = this._getNumberByPower(value, formatObject.power, 1000);
    }

    const powerPostfix = formatObject.power ? this.defaultLargeNumberFormatPostfixes[formatObject.power] || '' : '';

    let result: string = this._formatNumberCore(value, formatObject.formatType, formatConfig);

    result = result.replace(/(\d|.$)(\D*)$/, `$1${powerPostfix}$2`);

    return result;
  },

  _formatNumberExponential(value: number, formatConfig: FormatConfig): string {
    let power: number = this._calculateNumberPower(value, DECIMAL_BASE);
    let number: number = this._getNumberByPower(value, power, DECIMAL_BASE);

    if (formatConfig.precision === undefined) {
      formatConfig.precision = 1;
    }

    // @ts-expect-error

    if (number.toFixed(formatConfig.precision || 0) >= DECIMAL_BASE) {
      power += 1;
      number /= DECIMAL_BASE;
    }

    const powString = (power >= 0 ? '+' : '') + power.toString();

    return `${this._formatNumberCore(number, 'fixedpoint', formatConfig)}E${powString}`;
  },

  _addZeroes(value: number, precision: number): string {
    const multiplier = 10 ** precision;
    const sign = value < 0 ? '-' : '';

    // eslint-disable-next-line no-bitwise
    value = ((Math.abs(value) * multiplier) >>> 0) / multiplier;

    let result = value.toString();
    while (result.length < precision) {
      result = `0${result}`;
    }

    return sign + result;
  },

  _addGroupSeparators(value: string): string {
    const parts = value.toString().split('.');

    // @ts-expect-error
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config().thousandsSeparator) + (parts[1] ? config().decimalSeparator + parts[1] : '');
  },

  _formatNumberCore(value: number, format: string, formatConfig: FormatConfig): string {
    if (format === 'exponential') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._formatNumberExponential(value, formatConfig);
    }

    if (format !== 'decimal' && formatConfig.precision !== null) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      formatConfig.precision = formatConfig.precision || 0;
    }

    if (format === 'percent') {
      value *= 100;
    }

    let result = `${value}`;
    if (formatConfig.precision !== undefined) {
      if (format === 'decimal') {
        result = this._addZeroes(value, formatConfig.precision);
      } else {
        result = formatConfig.precision === null
          ? value.toPrecision()
          : toFixed(value, formatConfig.precision);
      }
    }

    if (format !== 'decimal') {
      result = this._addGroupSeparators(result);
    } else {
      // @ts-expect-error
      result = result.toString().replace('.', config().decimalSeparator);
    }

    if (format === 'percent') {
      result += '%';
    }

    return result;
  },

  _normalizeFormat(format: FormatConfig | Function | string): FormatConfig | Function {
    if (!format) {
      return {};
    }

    if (typeof format === 'function') {
      return format;
    }

    if (!isPlainObject(format)) {
      format = {
        // @ts-expect-error
        type: format,
      };
    }

    // @ts-expect-error
    return format;
  },

  _getSeparators(): FormatterConfig {
    return {
      decimalSeparator: this.getDecimalSeparator(),
      thousandsSeparator: this.getThousandsSeparator(),
    };
  },

  getThousandsSeparator(): string {
    return this.format(10000, 'fixedPoint')[2] as string;
  },

  getDecimalSeparator(): string {
    return this.format(1.2, { type: 'fixedPoint', precision: 1 })[1] as string;
  },

  convertDigits(value: string | number, toStandard?: boolean): string | number {
    const digits: string = this.format(90, 'decimal');

    if (typeof value !== 'string' || digits[1] === '0') {
      return value;
    }

    const fromFirstDigit = toStandard ? digits[1] : '0';
    const toFirstDigit = toStandard ? '0' : digits[1];
    const fromLastDigit = toStandard ? digits[0] : '9';
    const regExp = new RegExp(`[${fromFirstDigit}-${fromLastDigit}]`, 'g');

    // eslint-disable-next-line @stylistic/max-len
    return value.replace(regExp, (char) => String.fromCharCode(char.charCodeAt(0) + (toFirstDigit.charCodeAt(0) - fromFirstDigit.charCodeAt(0))));
  },

  getNegativeEtalonRegExp(format: FormatConfig | string): RegExp {
    const separators: FormatterConfig = this._getSeparators();
    const digitalRegExp = new RegExp(`[0-9${escapeRegExp(separators.decimalSeparator + separators.thousandsSeparator)}]+`, 'g');
    const specialCharacters = ['\\', '(', ')', '[', ']', '*', '+', '$', '^', '?', '|', '{', '}'];

    let negativeEtalon = this.format(-1, format).replace(digitalRegExp, '1');
    specialCharacters.forEach((char) => {
      negativeEtalon = negativeEtalon.replace(new RegExp(`\\${char}`, 'g'), `\\${char}`);
    });

    negativeEtalon = negativeEtalon.replace(/ /g, '\\s');
    negativeEtalon = negativeEtalon.replace(/1/g, '.*');
    return new RegExp(negativeEtalon, 'g');
  },

  getSign(text: string, format: FormatConfig | string): 1 | -1 {
    if (!format) {
      if (text.replace(/[^0-9-]/g, '').startsWith('-')) {
        return -1;
      }
      return 1;
    }

    const negativeEtalon = this.getNegativeEtalonRegExp(format);
    return text.match(negativeEtalon) ? -1 : 1;
  },

  format(
    value: string | number,
    format: LocalizationFormat,
  ): string | number {
    if (typeof value !== 'number') {
      return value;
    }

    if (typeof format === 'number') {
      return value;
    }

    // @ts-expect-error
    format = format?.formatter || format;

    if (typeof format === 'function') {
      return (format as NumberFormatter)(value);
    }

    format = this._normalizeFormat(format) as FormatConfig;

    if (!(format as FormatConfig).type) {
      (format as FormatConfig).type = 'decimal';
    }

    // eslint-disable-next-line @stylistic/max-len
    const numberConfig: FormatObject | undefined = this._parseNumberFormatString((format as FormatConfig).type);

    if (!numberConfig) {
      const formatterConfig: FormatterConfig = this._getSeparators();
      formatterConfig.unlimitedIntegerDigits = (format as FormatConfig).unlimitedIntegerDigits;

      // @ts-expect-error
      const formattedValue = getFormatter((format as FormatConfig).type, formatterConfig)(value);

      return this.convertDigits(formattedValue) as string | number;
    }

    return this._formatNumber(value, numberConfig, format) as string;
  },

  parse(text: string, format: FormatConfig | string): number | null | undefined {
    if (!text) {
      return undefined;
    }

    if (typeof format !== 'string' && format?.parser) {
      return format.parser(text) as number;
    }

    text = this.convertDigits(text, true);

    if (format && typeof format !== 'string') {
      // Current parser functionality provided as-is and
      // is independent of the most of capabilities of formatter.
      errors.log('W0011');
    }

    const decimalSeparator: string = this.getDecimalSeparator();
    const regExp = new RegExp(`[^0-9${escapeRegExp(decimalSeparator)}]`, 'g');
    const cleanedText = text
      .replace(regExp, '')
      .replace(decimalSeparator, '.')
      .replace(/\.$/g, '');

    if (cleanedText === '.' || cleanedText === '') {
      return null;
    }

    if (this._calcSignificantDigits(cleanedText) > 15) {
      return NaN;
    }

    let parsed = +cleanedText * this.getSign(text, format);

    format = this._normalizeFormat(format) as FormatConfig;
    const formatConfig: FormatObject = this._parseNumberFormatString(format.type);

    let power = formatConfig?.power;

    if (power) {
      if (power === 'auto') {
        const match = /\d(K|M|B|T)/.exec(text);
        if (match) {
          power = Object.keys(LargeNumberFormatPostfixes).map(Number).find(
            (p) => LargeNumberFormatPostfixes[p] === match[1],
          );
        }
      }
      // @ts-expect-error
      parsed *= 10 ** (3 * power);
    }

    if (formatConfig?.formatType === 'percent') {
      parsed /= 100;
    }

    return parsed;
  },

  _calcSignificantDigits(text: string): number {
    const [integer, fractional] = text.split('.');
    const calcDigitsAfterLeadingZeros = (digits: string[]): number => {
      let index = -1;
      for (let i = 0; i < digits.length; i += 1) {
        if (digits[i] !== '0') {
          index = i;
          break;
        }
      }
      return index > -1 ? digits.length - index : 0;
    };
    let result = 0;
    if (integer) {
      result += calcDigitsAfterLeadingZeros(integer.split(''));
    }
    if (fractional) {
      result += calcDigitsAfterLeadingZeros(fractional.split('').reverse());
    }
    return result;
  },
});

numberLocalization.inject(currencyLocalization);

if (hasIntl) {
  numberLocalization.inject(intlNumberLocalization);
}

export default numberLocalization;
