import { isDefined } from '@ts/core/utils/m_type';

import type { Column } from '../columns_controller/m_columns_controller';
import type { Item, UserData } from '../data_controller/m_data_controller';
import { AI_COLUMN_NAME, CLASSES } from './const';

export const getAICommandColumnDefaultOptions = (): unknown => ({
  type: AI_COLUMN_NAME,
  command: AI_COLUMN_NAME,
  cssClass: CLASSES.aiColumn,
  fixed: false,
});

export const getDataFromRowItems = (items: Item[]): UserData[] => items
  .filter((row) => row.rowType === 'data')
  .map((row) => row.data);

export const reduceDataCachedKeys = (
  data: UserData[],
  cachedData: Record<PropertyKey, string>,
  keyField: string,
): Record<PropertyKey, unknown> => {
  const newData: Record<PropertyKey, unknown> = { };
  for (const item of data) {
    const key = item[keyField] as PropertyKey;
    if (!(key in cachedData)) {
      newData[key] = item;
    }
  }

  return newData;
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
