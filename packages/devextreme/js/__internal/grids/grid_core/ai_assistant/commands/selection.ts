import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';
import {
  compositeKeyPairSchema,
  isKeyShapeValid,
  normalizeKey,
  splitIntoContiguousRanges,
} from './utils';

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

const selectByIndexesCommandSchema = z.object({
  indexes: z.array(z.number().int().min(1)).min(1),
  mode: z.enum(['select', 'deselect']),
}).strict();

export const selectByIndexesCommand = defineGridCommand({
  name: 'selectByIndexes',
  description: 'Select or deselect rows by their 1-based indexes within the currently filtered and sorted dataset. '
    + 'Index 1 is the first row of the dataset (NOT the first row on the visible page); indexes are NOT limited to the current page — any index up to the total row count is addressable, regardless of pageIndex/pageSize. '
    + 'Use this command for a SINGLE contiguous range per call. When the user asks for several non-contiguous ranges (e.g. "select rows 1 to 50 and 70 to 100"), invoke this command separately for EACH range — once with indexes [1, 2, ..., 50] and once with indexes [70, 71, ..., 100]. '
    + 'Set mode to "select" to add the listed rows to the current selection (multiple calls accumulate, so previously selected ranges are kept); set mode to "deselect" to remove the listed rows from the current selection (e.g. "unselect row 1"). '
    + 'To clear selection only within the current selectAll scope, use deselectAll; to clear selection across all pages regardless of selectAllMode, use clearSelection. '
    + 'To target rows by key value rather than by index, use selectByKeys.',
  schema: selectByIndexesCommandSchema,
  execute: (component, { success, failure }) => async (args): Promise<CommandResult> => {
    const rowIndexes = args.indexes.join(', ');
    const action = args.mode === 'deselect' ? 'Deselect' : 'Select';
    const defaultMessage = `${action} row(s) number ${rowIndexes}.`;

    if (component.option('selection.mode') === 'none') {
      return failure(defaultMessage);
    }

    const dataSource = component.getDataSource();
    const store = dataSource?.store();

    if (!dataSource || !store) {
      return failure(defaultMessage);
    }

    const ranges = splitIntoContiguousRanges(args.indexes);

    try {
      const baseLoadOptions = { ...dataSource.loadOptions() };

      const loadedRanges = await Promise.all(ranges.map((range) => {
        const skip = range[0] - 1;
        const take = range.length;
        return store.load({ ...baseLoadOptions, skip, take })
          .then((result) => {
            const rows = Array.isArray(result) ? result : (result as { data: unknown[] }).data;
            return { rows, take };
          });
      }));

      const allRowsResolved = loadedRanges.every(
        ({ rows, take }) => Array.isArray(rows) && rows.length >= take,
      );

      if (!allRowsResolved) {
        return failure(defaultMessage);
      }

      const keys = loadedRanges.flatMap(({ rows }) => rows.map((row) => store.keyOf(row)));

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
