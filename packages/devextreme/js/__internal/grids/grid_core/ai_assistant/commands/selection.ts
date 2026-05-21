import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';
import { compositeKeyPairSchema, isKeyShapeValid, normalizeKey } from './utils';

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
}).strict();

export const selectByIndexesCommand = defineGridCommand({
  name: 'selectByIndexes',
  description: 'Select rows by their 1-based indexes within the current page. Index 1 is the first row on the visible page; group/header rows are not selectable. To select rows that are not on the current page, use selectByKeys, or call pageIndex first to switch the page.',
  schema: selectByIndexesCommandSchema,
  execute: (component, { success, failure }) => async (args): Promise<CommandResult> => {
    const rowIndexes = args.indexes.join(', ');
    const defaultMessage = `Select row(s) number ${rowIndexes} on the current page.`;

    if (component.option('selection.mode') === 'none') {
      return failure(defaultMessage);
    }

    const items = component.getController('data').items();
    const normalizedRowIndexes = args.indexes.map((index) => index - 1);
    const allIndexesValid = normalizedRowIndexes.every(
      (index) => items[index]?.rowType === 'data',
    );

    if (!allIndexesValid) {
      return failure(defaultMessage);
    }

    try {
      await component.selectRowsByIndexes(normalizedRowIndexes);

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
