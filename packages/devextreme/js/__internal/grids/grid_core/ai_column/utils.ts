import type { Item } from '../data_controller/m_data_controller';
import { AI_COLUMN_NAME, CLASSES } from './const';

export const getAiCommandColumnOptions = (): unknown => ({
  type: AI_COLUMN_NAME,
  command: AI_COLUMN_NAME,
  cssClass: CLASSES.aiColumn,
  fixed: false,
});

export const getData = (items: Item[]): Record<string, unknown> => items
  .filter((row) => row.rowType === 'data')
  .reduce<Record<string, unknown>>((acc, row) => {
    const keyField = row.key as string;
    if (Array.isArray(row.data)) {
      row.data.forEach((item: Record<string, unknown>) => {
        const key = JSON.stringify(item[keyField]);
        acc[key] = item;
      });
    }
    return acc;
  }, {});

export const reduceDataCachedKeys = (
  data: Record<PropertyKey, unknown>,
  cachedData: Record<PropertyKey, string>,
): Record<PropertyKey, unknown> => {
  const newData: Record<PropertyKey, unknown> = { };
  for (const key of Object.keys(data)) {
    if (!(key in cachedData)) {
      newData[key] = data[key];
    }
  }
  return newData;
};
