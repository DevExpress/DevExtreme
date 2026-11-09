/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
import '@js/common/core/localization/currency';

import type { DataType } from '@js/common';
import type { Format, FormatObject } from '@js/common/core/localization';
import dateLocalization from '@js/common/core/localization/date';
import { getLanguageId } from '@js/common/core/localization/language_codes';
import { getFormat } from '@js/common/core/localization/ldml/date.format';
import numberFormatter from '@js/common/core/localization/number';
import { extend } from '@js/core/utils/extend';
import { format as stringFormat } from '@js/core/utils/string';
import {
  isDefined, isNumeric, isObject, isString,
} from '@js/core/utils/type';
import { withFormatLocale } from '@ts/core/global_format_config';

const ARABIC_ZERO_CODE = 1632;
const DEFINED_NUMBER_FORMTATS = {
  thousands: '#,##0{0},&quot;K&quot;',
  millions: '#,##0{0},,&quot;M&quot;',
  billions: '#,##0{0},,,&quot;B&quot;',
  trillions: '#,##0{0},,,,&quot;T&quot;',
  percent: '0{0}%',
  decimal: '#{0}',
  fixedpoint: '#,##0{0}',
  exponential: '0{0}E+00',
  currency: ' ',
};
const PERIOD_REGEXP = /a+/g;
const DAY_REGEXP = /E/g;
const DO_REGEXP = /dE+/g;
const STANDALONE_MONTH_REGEXP = /L/g;
const HOUR_REGEXP = /h/g;
const ANY_REGEXP = /./g;

function _applyPrecision(format, precision) {
  let result;
  let i;

  if (precision > 0) {
    result = format !== 'decimal' ? '.' : '';
    for (i = 0; i < precision; i += 1) {
      result += '0';
    }

    return result;
  }
  return '';
}

function _hasArabicDigits(text) {
  let code;

  for (let i = 0; i < text.length; i += 1) {
    code = text.charCodeAt(i);
    if (code >= ARABIC_ZERO_CODE && code < ARABIC_ZERO_CODE + 10) {
      return true;
    }
  }
  return false;
}

function _convertDateFormat(format, locale?: string) {
  const localizedFormat = isString(format) ? withFormatLocale(format, locale) : format;
  const formattedValue = (dateLocalization.format(new Date(2009, 8, 8, 6, 5, 4), localizedFormat) || '').toString();
  let result = getFormat((value) => {
    const text = dateLocalization.format(value, localizedFormat) as string;

    return numberFormatter.convertDigits(numberFormatter.convertDigits(text, true, locale), false);
  });

  if (result) {
    result = _convertDateFormatToOpenXml(result);
    result = _getLanguageInfo(formattedValue, locale) + result;
  }

  return result;
}

function _getLanguageInfo(defaultPattern, locale?: string) {
  const languageID = getLanguageId(locale);
  let languageIDStr = languageID ? languageID.toString(16) : '';
  let languageInfo = '';

  if (_hasArabicDigits(defaultPattern)) {
    while (languageIDStr.length < 3) {
      languageIDStr = `0${languageIDStr}`;
    }
    languageInfo = `[$-2010${languageIDStr}]`;
  } else if (languageIDStr) {
    languageInfo = `[$-${languageIDStr}]`;
  }

  return languageInfo;
}

function _convertDateFormatToOpenXml(format) {
  return format.split('/').join('\\/').split('\'').map((datePart, index) => {
    if (index % 2 === 0) {
      return datePart
        .replace(PERIOD_REGEXP, 'AM/PM')
        .replace(DO_REGEXP, 'd')
        .replace(DAY_REGEXP, 'd')
        .replace(STANDALONE_MONTH_REGEXP, 'M')
        .replace(HOUR_REGEXP, 'H')
        .split('[')
        .join('\\[')
        .split(']')
        .join('\\]');
    } if (datePart) {
      return datePart.replace(ANY_REGEXP, '\\$&');
    }
    return '\'';
  })
    .join('');
}

function _convertNumberFormat(format, precision, currency, locale?: string) {
  let result;
  let excelFormat;

  if (format === 'currency') {
    excelFormat = numberFormatter.getOpenXmlCurrencyFormat(currency, locale);
  } else {
    excelFormat = DEFINED_NUMBER_FORMTATS[format.toLowerCase()];
  }

  if (excelFormat) {
    result = stringFormat(excelFormat, _applyPrecision(format, precision));
  }

  return result;
}

function _hasCSVInjection(value) {
  if (!value || value.length < 2) { return false; }

  return _includesCSVExpression(value);
}

function _hasCSVQuotedInjection(value, textQualifier) {
  if (!value || value.length < 4 || value[0] !== textQualifier) {
    return false;
  }

  return _includesCSVExpression(value.substring(1, value.length - 1));
}

function _includesCSVExpression(value) {
  const injectionPrefix = /^[@=\t\r]/;
  const possibleInjectionPrefix = /^[+-]/;

  if (!value) {
    return false;
  }

  if (injectionPrefix.test(value)) {
    return true;
  }

  if (!possibleInjectionPrefix.test(value)) {
    return false;
  }

  return !isNumeric(value);
}

interface ConvertedFormat {
  format: Format;
  precision: FormatObject['precision'];
  dataType: DataType | undefined;
  currency?: FormatObject['currency'];
}

export const ExportFormat = {
  formatObjectConverter(format: Format, dataType: DataType | undefined): ConvertedFormat {
    const result = {
      format,
      // @ts-expect-error a string or a function format has no precision, it reads as undefined
      precision: format?.precision,
      dataType,
    };

    if (isObject(format)) {
      return extend(result, format, {
        // @ts-expect-error
        format: format.formatter || format.type,
        // @ts-expect-error
        currency: format.currency,
      });
    }

    return result;
  },

  convertFormat(format, precision, type, currency, locale?: string) {
    if (isDefined(format)) {
      if (type === 'date') {
        return _convertDateFormat(format, locale);
      }
      if (isString(format) && DEFINED_NUMBER_FORMTATS[format.toLowerCase()]) {
        return _convertNumberFormat(format, precision, currency, locale);
      }
    }
  },

  encode(value) {
    const textQualifier = '"';

    let escaped = false;

    if (_hasCSVInjection(value)) {
      escaped = true;
    } else if (_hasCSVQuotedInjection(value, textQualifier)) {
      value = value.substring(1, value.length - 1);
      escaped = true;
    }

    if (escaped) {
      const singleTextQualifier = textQualifier;
      const escapedTextQualifier = `${textQualifier}${textQualifier}`;
      return `${textQualifier}'${value.replaceAll(singleTextQualifier, escapedTextQualifier)}${textQualifier}`;
    }

    return value;
  },
};
