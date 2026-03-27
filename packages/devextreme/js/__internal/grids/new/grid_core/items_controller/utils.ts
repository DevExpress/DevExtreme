import type { VisibleColumn } from '../columns_controller/types';

// NOTE: Column properties that are excluded from the layout key because they
// don't directly affect card rendering. Data changes caused by sort/filter
// arrive separately via dataController.items, so tracking these properties
// in visibleColumnsLayout would cause redundant re-renders (T1306983, T1309423).
const NON_LAYOUT_COLUMN_KEYS: ReadonlySet<string> = new Set([
  'sortOrder',
  'sortIndex',
  'filterValues',
  'filterType',
]);

export const getColumnLayoutKey = (column: VisibleColumn): string => {
  const entries = Object.entries(column)
    .filter(([key]) => !NON_LAYOUT_COLUMN_KEYS.has(key));

  return JSON.stringify(entries);
};
