/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dateLocalization from '@js/common/core/localization/date';
import {
  isDefined, isFunction, isNumeric, isString,
} from '@js/core/utils/type';
import type { NativeEventInfo } from '@js/events';
import messageLocalization from '@js/localization/message';
import type { TextBoxInstance } from '@js/ui/text_box';
import { strictParseNumber } from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import type { TextBoxProperties } from '@ts/ui/text_box/m_text_box';

import type { Column } from '../columns_controller/types';
import type { PredefinedToolbarItem } from '../toolbar/types';
import { addWidgetPrefix, getName } from '../utils';
import type { HighlightedTextItem, HighlightTextOptions, SearchFieldProps } from './types';

const HIGHLIGHT_SPLIT_SEPARATOR = '<--|-->';

export const compareTextPart = (
  textPart: string,
  searchStr: string,
  caseSensitive?: boolean,
): boolean => (
  caseSensitive
    ? textPart === searchStr
    : textPart.toLowerCase() === searchStr.toLowerCase()
);

export const splitHighlightedText = (
  text: string,
  {
    enabled,
    searchStr,
    caseSensitive,
  }: HighlightTextOptions,
): HighlightedTextItem[] | null => {
  if (!enabled || !searchStr) {
    return null;
  }

  // NOTE: backslash special characters for correct regexp matches
  const normalizedSearchStr = searchStr.replace(/\W|_/g, (match) => `\\${match}`);

  const regExp = new RegExp(normalizedSearchStr, `g${caseSensitive ? '' : 'i'}`);

  if (!text.match(regExp)?.length) {
    return null;
  }

  return text
    .replace(regExp, (match) => `${HIGHLIGHT_SPLIT_SEPARATOR}${match}${HIGHLIGHT_SPLIT_SEPARATOR}`)
    .split(HIGHLIGHT_SPLIT_SEPARATOR)
    .filter((textPart) => !!textPart)
    .map((textPart) => ({
      type: compareTextPart(textPart, searchStr, caseSensitive)
        ? 'highlighted'
        : 'usual',
      text: textPart,
    }));
};

export const allowSearch = (column: Column, searchVisibleColumnsOnly: boolean): boolean => {
  const allowSearchByDataField = !!column.dataField && isString(column.dataField);
  const allowSearchByVisibility = !searchVisibleColumnsOnly || column.visible;
  const allowSearchByConfig = column.allowSearch ?? column.allowFiltering;
  return allowSearchByDataField && allowSearchByVisibility && allowSearchByConfig;
};

export const parseValue = (column: Column, text: string): unknown => {
  let result = null as any;

  if (column.dataType === 'number') {
    if (isString(text) && column.format) {
      result = strictParseNumber(text.trim(), column.format);
    } else if (isDefined(text) && isNumeric(text)) {
      result = Number(text);
    }
  } else if (column.dataType === 'boolean') {
    if (text === column.trueText) {
      result = true;
    } else if (text === column.falseText) {
      result = false;
    }
  } else if (gridCoreUtils.isDateType(column.dataType)) {
    // @ts-expect-error
    const parsedValue = dateLocalization.parse(text, column.format);
    if (parsedValue) {
      result = parsedValue;
    }
  } else {
    result = text;
  }
  return result;
};

export const createFilterExpression = (
  column: Column,
  filterValue: any,
  selectedFilterOperation: string | undefined,
  target: string,
): unknown => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let result;
  if (column.calculateFilterExpression) {
    result = column.calculateFilterExpression(filterValue, selectedFilterOperation, target);
  }
  if (isFunction(result)) {
    result = [result, '=', true];
  }
  // if (result) {
  //   result.columnIndex = column.index;
  //   result.filterValue = filterValue;
  //   result.selectedFilterOperation = selectedFilterOperation;
  // }
  return result;
};

const FILTERING_TIMEOUT = 700;

const CLASS = {
  searchPanel: 'search-panel',
};

// eslint-disable-next-line @typescript-eslint/init-declarations
let timer;

export const addSearchTextBox = (props: SearchFieldProps): PredefinedToolbarItem => ({
  name: 'searchPanel',
  showText: 'inMenu',
  location: 'after',
  locateInMenu: 'auto',

  widget: 'dxTextBox',
  options: {
    onInput: (e: NativeEventInfo<TextBoxInstance, UIEvent>): void => {
      clearTimeout(timer);
      const component = e.component as any;
      const newValue = component._input().val();
      timer = setTimeout(() => {
        props.onValueChanged?.(newValue);
      }, FILTERING_TIMEOUT);
    },
    value: props.value,
    placeholder: props.placeholder,
    width: props.width,
    inputAttr: {
      'aria-label': messageLocalization.format(`${getName()}-ariaSearchInGrid`),
    },
    elementAttr: {
      class: addWidgetPrefix(CLASS.searchPanel),
    },
    mode: 'search',
  } as TextBoxProperties,
});
