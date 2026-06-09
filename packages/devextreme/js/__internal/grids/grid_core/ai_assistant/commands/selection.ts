import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import type { InternalGrid, RowKey } from '@ts/grids/grid_core/m_types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';
import {
  compositeKeyPairSchema,
  isKeyShapeValid,
  normalizeKey,
  splitIntoLoadWindows,
} from './utils';

const MAX_LOAD_WINDOW_PAGES = 5;

const selectByKeysCommandSchema = z.object({
  keys: z.array(z.union([
    z.string(),
    z.number(),
    z.array(compositeKeyPairSchema),
  ])),
  preserve: z.boolean(),
}).strict();

export const selectByKeysCommand = defineGridCommand({
  name: 'selectByKeys',
  description: 'Select rows by their key values. Each key matches the grid\'s keyExpr or the underlying store\'s key — pass a string or number for a single-field key, or an array of {field, value} pairs for a composite key. Set preserve to true to keep existing selection, or false to replace it.',
  schema: selectByKeysCommandSchema,
  execute: (component, { success, failure }) => async (args): Promise<CommandResult> => {
    const defaultMessage = 'Select row(s).';

    if (component.option('selection.mode') === 'none') {
      return failure(defaultMessage);
    }

    const keyExpr = component.option('keyExpr')
      ?? component.getDataSource()?.store()?.key();

    const keys = args.keys.map(normalizeKey);

    if (!keyExpr || keys.some((key) => !isKeyShapeValid(keyExpr, key))) {
      return failure(defaultMessage);
    }

    try {
      await component.selectRows(keys, args.preserve);

      return success(defaultMessage);
    } catch {
      return failure(defaultMessage);
    }
  },
});

const selectionByIndexesCommandSchema = z.object({
  indexes: z.array(z.number().int().min(1)).min(1),
  mode: z.enum(['select', 'deselect']),
  scope: z.enum(['allPages', 'page']),
}).strict();

// Maps 1-based indexes to the keys at those positions;
// an index past the last entry rejects the whole set.
const pickKeysByIndex = (
  keys: RowKey[],
  indexes: number[],
): RowKey[] | null => {
  const normalizedRowIndexes = indexes.map((index) => index - 1);
  const allIndexesValid = normalizedRowIndexes.every(
    (index) => index < keys.length,
  );

  if (!allIndexesValid) {
    return null;
  }

  return normalizedRowIndexes.map((index) => keys[index]);
};

const resolveKeysFromCurrentPage = (
  component: InternalGrid,
  indexes: number[],
): RowKey[] | null => {
  // Group/footer rows are not counted, so indexes address the Nth data row.
  const items = component.getController('data').items();
  const dataItems = items.filter((item) => item.rowType === 'data');
  const dataKeys = dataItems.map((item) => item.key);

  return pickKeysByIndex(dataKeys, indexes);
};

const resolveKeysFromAllPagesRemote = async (
  component: InternalGrid,
  indexes: number[],
): Promise<RowKey[] | null> => {
  const dataSource = component.getDataSource();
  const store = dataSource?.store();

  if (!dataSource || !store) {
    return null;
  }

  const keyExpr = component.option('keyExpr') ?? store.key();

  if (!keyExpr) {
    return null;
  }

  // Under grouping store.load returns group structures rather than flat rows,
  // so an index no longer maps to a single data row. Fail instead of resolving meaningless keys
  const grouping = dataSource.group();
  const isGrouped = Array.isArray(grouping) ? grouping.length > 0 : !!grouping;

  if (isGrouped) {
    return null;
  }

  const dataController = component.getController('data');
  const filter = dataController.getCombinedFilter(true);
  const baseLoadOptions = {
    ...dataSource.loadOptions(),
    filter,
  };

  const windows = splitIntoLoadWindows(indexes, dataSource.pageSize() * MAX_LOAD_WINDOW_PAGES);

  const loadedWindows = await Promise.all(windows.map((window) => {
    const skip = window[0] - 1;
    const take = window[window.length - 1] - window[0] + 1;
    return store.load({ ...baseLoadOptions, skip, take })
      .then((result) => {
        const rows = Array.isArray(result) ? result : (result as { data: unknown[] }).data;
        return { window, rows };
      });
  }));

  const keys: RowKey[] = [];

  for (const { window, rows } of loadedWindows) {
    if (!Array.isArray(rows)) {
      return null;
    }

    for (const index of window) {
      // The requested index maps to `window[0]` offset within the loaded rows
      const row = rows[index - window[0]];

      if (row === undefined) {
        return null;
      }

      keys.push(store.keyOf(row));
    }
  }

  return keys;
};

const resolveKeysFromAllPagesLocal = async (
  component: InternalGrid,
  indexes: number[],
): Promise<RowKey[] | null> => {
  const keys = await component.getController('data').getAllDataRowKeys();

  return pickKeysByIndex(keys, indexes);
};

// Picks the "allPages" strategy by paging mode:
// with local paging the full dataset is already on the client, so read the cache;
// with remote paging rows are fetched by position.
const resolveKeysFromAllPages = (
  component: InternalGrid,
  indexes: number[],
): Promise<RowKey[] | null> => {
  const dataController = component.getController('data');
  const isRemotePaging = !!dataController.dataSource()?.remoteOperations()?.paging;

  return isRemotePaging
    ? resolveKeysFromAllPagesRemote(component, indexes)
    : resolveKeysFromAllPagesLocal(component, indexes);
};

export const selectionByIndexesCommand = defineGridCommand({
  name: 'selectionByIndexes',
  description: 'Select or deselect rows by their 1-based indexes. '
    + 'Indexes start at 1: "the first row" is index 1 and "the 5th row" is index 5. Do NOT use 0-based counting here, this command is 1-based. '
    + 'Always set scope to choose how indexes are interpreted: '
    + '"allPages" — indexes are positions within the currently filtered and sorted dataset, NOT limited to the current page; index 1 is the first row of the dataset, regardless of pageIndex/pageSize. Use this when the user does NOT explicitly refer to the visible page (e.g. "select rows 1 to 100"). '
    + '"page" — indexes are positions within the currently rendered page; index 1 is the first data row on the visible page and group/header rows are not counted. Use this ONLY when the user explicitly mentions the current/visible page (e.g. "select the first 3 rows on the current page", "deselect row 2 on this page"). '
    + 'Set mode to "select" to add the listed rows to the current selection (multiple calls accumulate, so previously selected ranges are kept); set mode to "deselect" to remove the listed rows from the current selection (e.g. "unselect row 1"). '
    + 'To clear selection only within the current selectAll scope, use deselectAll; to clear selection across all pages regardless of selectAllMode, use clearSelection. '
    + 'To target rows by key value rather than by index, use selectByKeys.',
  schema: selectionByIndexesCommandSchema,
  execute: (component, { success, failure }) => async (args): Promise<CommandResult> => {
    const rowIndexes = args.indexes.join(', ');
    const action = args.mode === 'deselect' ? 'Deselect' : 'Select';
    const scopeSuffix = args.scope === 'page' ? ' on the current page' : '';
    const defaultMessage = `${action} row(s) number ${rowIndexes}${scopeSuffix}.`;

    if (component.option('selection.mode') === 'none') {
      return failure(defaultMessage);
    }

    try {
      const keys = args.scope === 'page'
        ? resolveKeysFromCurrentPage(component, args.indexes)
        : await resolveKeysFromAllPages(component, args.indexes);

      if (keys === null) {
        return failure(defaultMessage);
      }

      if (args.mode === 'deselect') {
        await component.deselectRows(keys);
      } else {
        await component.selectRows(keys, true);
      }

      return success(defaultMessage);
    } catch {
      return failure(defaultMessage);
    }
  },
});

export const selectAllCommand = defineGridCommand({
  name: 'selectAll',
  description: 'Select rows. Scope depends on selection.selectAllMode: "allPages" (default) selects across every page; "page" selects only the currently rendered page. If a filter is applied, only rows matching the filter are selected.',
  schema: z.object({}).strict(),
  execute: (component, { success, failure }) => async (): Promise<CommandResult> => {
    const defaultMessage = 'Select all rows.';

    if (component.option('selection.mode') === 'none') {
      return failure(defaultMessage);
    }

    try {
      await component.selectAll();

      return success(defaultMessage);
    } catch {
      return failure(defaultMessage);
    }
  },
});

export const deselectAllCommand = defineGridCommand({
  name: 'deselectAll',
  description: 'Deselect rows. Scope depends on selection.selectAllMode: "allPages" (default) deselects across every page; "page" deselects only the currently rendered page. If a filter is applied, only rows matching the filter are deselected.',
  schema: z.object({}).strict(),
  execute: (component, { success, failure }) => async (): Promise<CommandResult> => {
    const defaultMessage = 'Deselect all rows.';

    if (component.option('selection.mode') === 'none') {
      return failure(defaultMessage);
    }

    try {
      await component.deselectAll();

      return success(defaultMessage);
    } catch {
      return failure(defaultMessage);
    }
  },
});

export const clearSelectionCommand = defineGridCommand({
  name: 'clearSelection',
  description: 'Clear selection of all rows across all pages, regardless of selection.selectAllMode. To clear selection only on the current page, use deselectAll instead (it respects selection.selectAllMode = "page").',
  schema: z.object({}).strict(),
  execute: (component, { success, failure }) => async (): Promise<CommandResult> => {
    const defaultMessage = 'Clear selection.';

    try {
      await component.clearSelection();

      return success(defaultMessage);
    } catch {
      return failure(defaultMessage);
    }
  },
});
