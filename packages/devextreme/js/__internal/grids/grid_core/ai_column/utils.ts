import type { Column } from '@js/ui/data_grid';

import type { Item, UserData } from '../data_controller/m_data_controller';
import { AI_COLUMN_NAME, CLASSES } from './const';

export const getAICommandColumnOptions = (): unknown => ({
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
