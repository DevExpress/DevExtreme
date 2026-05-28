/* eslint-disable
  @typescript-eslint/explicit-module-boundary-types,
  @typescript-eslint/no-explicit-any
*/

import { isFunction } from '@js/core/utils/type';
import type { EventInfo, NativeEventInfo } from '@js/events';
import messageLocalization from '@js/localization/message';
import type { TextBoxInstance } from '@js/ui/text_box';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import type { TextBoxProperties } from '@ts/ui/text_box/text_box';

import type { Column } from '../columns_controller/types';
import type { DefaultToolbarItem } from '../toolbar/types';
import { addWidgetPrefix, getName } from '../utils/common';
import { parseValue } from '../utils/parse_value/index';
import type { HighlightedTextItem, HighlightTextOptions, SearchFieldProps } from './types';

const HIGHLIGHT_SPLIT_SEPARATOR = '<--|-->';

const FILTERING_TIMEOUT = 700;

const CLASS = {
  searchPanel: 'search-panel',
};

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
  const allowSearchByVisibility = !searchVisibleColumnsOnly || column.visible;
  const allowSearchByConfig = column.allowSearch;
  return allowSearchByVisibility && allowSearchByConfig;
};

export const createFilterExpression = (
  column: Column,
  filterValue: any,
  selectedFilterOperation: string | undefined,
  target: string,
): unknown => {
  let result = column.calculateFilterExpression(filterValue, selectedFilterOperation, target);
  if (isFunction(result)) {
    result = [result, '=', true];
  }
  return result;
};

export const calculateSearchFilter = (
  text: string | undefined,
  columns: Column[],
  searchVisibleColumnsOnly: boolean,
): unknown => {
  const filters: any[] = [];

  if (!text) return null;

  for (const column of columns) {
    if (allowSearch(column, searchVisibleColumnsOnly)) {
      const filterValue = parseValue(column, text);

      if (filterValue !== undefined) {
        const expression = createFilterExpression(column, filterValue, undefined, 'search');
        filters.push(expression);
      }
    }
  }

  if (filters.length === 0) {
    return ['!'];
  }

  return gridCoreUtils.combineFilters(filters, 'or');
};

// eslint-disable-next-line @typescript-eslint/init-declarations
let timer;

export const addSearchTextBox = (
  props: SearchFieldProps,
  setTextBoxRef: (component: TextBoxInstance) => void,
): DefaultToolbarItem => ({
  name: 'searchPanel',
  showText: 'inMenu',
  location: 'after',
  locateInMenu: 'auto',

  widget: 'dxTextBox',
  options: {
    onContentReady: ({ component }: EventInfo<TextBoxInstance>) => {
      setTextBoxRef(component);
    },
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
    onDisposing: () => {
      clearTimeout(timer);
    },
  } as TextBoxProperties,
});
