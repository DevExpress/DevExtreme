import type { Format } from '@js/common';
import dateLocalization from '@js/common/core/localization/date';
import {
  isDefined, isNumeric, isString,
} from '@js/core/utils/type';
import { strictParseNumber } from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import type { Column } from './columns_controller/types';

export const parseNumberValue = (
  text: string,
  format?: Format,
): unknown => {
  switch (true) {
    case isString(text) && !!format:
      return strictParseNumber(text.trim(), format);
    case isDefined(text) && isNumeric(text):
      return Number(text);
    default:
      return undefined;
  }
};

export const parseBooleanValue = (
  text: string,
  trueText?: string,
  falseText?: string,
): unknown => {
  switch (true) {
    case text === trueText:
      return true;
    case text === falseText:
      return false;
    default:
      return undefined;
  }
};

export const parseDateValue = (
  text: string,
  format?: Format,
): unknown => {
  if (!format) {
    const parsedValue = new Date(text);
    return isNaN(parsedValue.getTime()) ? null : parsedValue;
  }
  // @ts-expect-error
  return dateLocalization.parse(text, format) ?? new Date(text);
};

export const parseValue = (column: Column, text: string): unknown => {
  switch (true) {
    case column.dataType === 'number':
      return parseNumberValue(text, column.format);
    case column.dataType === 'boolean':
      return parseBooleanValue(text, column.trueText, column.falseText);
    case gridCoreUtils.isDateType(column.dataType):
      return parseDateValue(text, column.format);
    default:
      return text;
  }
};
