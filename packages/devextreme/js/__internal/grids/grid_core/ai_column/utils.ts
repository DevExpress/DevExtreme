import { isDefined } from '@ts/core/utils/m_type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import type { Item, UserData } from '../data_controller/data_controller';
import { AI_COLUMN_NAME, CLASSES } from './const';

export const getAICommandColumnDefaultOptions = (): object => ({
  type: AI_COLUMN_NAME,
  command: AI_COLUMN_NAME,
  cssClass: CLASSES.aiColumn,
  fixed: false,
  encodeHtml: true,
  minWidth: 120,
});

export const getDataFromRowItems = (items: Item[]): UserData[] => items
  .filter((row) => row.rowType === 'data')
  .map((row) => row.data);

export const reduceDataCachedKeys = (
  data: UserData[],
  cachedData: Record<PropertyKey, string>,
  getKey: (item: UserData) => PropertyKey,
): Record<PropertyKey, unknown> => {
  const newData: Record<PropertyKey, unknown> = { };
  for (const item of data) {
    const key = getKey(item);
    if (!(key in cachedData)) {
      newData[key] = item;
    }
  }

  return newData;
};

export const isKeyMissingInData = (
  data: UserData[],
  keyField: string | string[] | ((data: UserData) => unknown),
): boolean => {
  if (typeof keyField === 'function') {
    return data.some((item) => !isDefined(keyField(item)));
  }

  const keyFields = Array.isArray(keyField) ? keyField : [keyField];

  return data.some(
    (item) => keyFields.some((field) => !(field in item)),
  );
};

export const isAIColumnAutoMode = (column: Column): boolean => column.type === 'ai' && (!column.ai?.mode || column.ai.mode === 'auto');

export const isPopupOptions = (optionName: string, value: unknown): boolean => optionName.startsWith('ai.popup')
  || (optionName === 'ai' && isDefined((value as Record<string, unknown>)?.popup));

export const isEditorOptions = (optionName: string, value: unknown): boolean => optionName.startsWith('ai.editorOptions')
  || (optionName === 'ai' && isDefined((value as Record<string, unknown>)?.editorOptions));

export const isPromptOption = (optionName: string, value: unknown): boolean => optionName === 'ai.prompt'
  || (optionName === 'ai' && isDefined((value as Record<string, unknown>)?.prompt));

export const isRefreshOption = (optionName: string, value: unknown): boolean => {
  const refreshOptionNames = [
    'showHeaderMenu',
    'noDataText',
    'emptyText',
  ];
  const matchesName = refreshOptionNames.map((n) => `ai.${n}`).includes(optionName);
  if (matchesName) {
    return true;
  }
  if (optionName !== 'ai') {
    return false;
  }

  const valueKeys = Object.keys(value as Record<string, unknown>);
  return valueKeys.some((key) => refreshOptionNames.includes(key));
};

export const isAIColumnHeader = (
  column: Column,
  rowType = 'header',
): boolean => rowType === 'header' && column.type === AI_COLUMN_NAME;

export const isHeaderDropDownButtonVisible = (
  column: Column,
): boolean => column?.ai?.showHeaderMenu !== false;
