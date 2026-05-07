import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';
import { isKeyShapeValid } from './utils';

const focusRowByKeyCommandSchema = z.object({
  key: z.union([
    z.string(),
    z.number(),
    z.record(z.union([z.string(), z.number()])),
  ]),
}).strict();

export const focusRowByKeyCommand = defineGridCommand({
  name: 'focusRowByKey',
  description: 'Focus a specific row by its key value. The key matches the grid\'s keyExpr or the underlying store\'s key — pass a string or number for a single-field key, or an object whose property names match each keyExpr field for a composite key. Requires focusedRowEnabled to be true on the grid.',
  schema: focusRowByKeyCommandSchema,
  execute: (component, { success, failure }) => async (args): Promise<CommandResult> => {
    const defaultMessage = 'Focus row.';

    if (!component.option('focusedRowEnabled')) {
      return failure(defaultMessage);
    }

    const keyExpr = component.option('keyExpr')
      ?? component.getDataSource()?.store()?.key();

    if (!keyExpr || !isKeyShapeValid(keyExpr, args.key)) {
      return failure(defaultMessage);
    }

    try {
      await component.getController('focus').handleFocusedRowKeyChange(args.key);

      return success(defaultMessage);
    } catch {
      return failure(defaultMessage);
    }
  },
});

const focusRowByIndexCommandSchema = z.object({
  // eslint-disable-next-line spellcheck/spell-checker
  index: z.number().int().nonnegative(),
}).strict();

export const focusRowByIndexCommand = defineGridCommand({
  name: 'focusRowByIndex',
  description: 'Focus a specific row by its 0-based index within the current page. Index 0 is the first row on the visible page. To focus a row that is not on the current page, use focusRowByKey or call pageIndex first. Requires focusedRowEnabled to be true on the grid.',
  schema: focusRowByIndexCommandSchema,
  execute: (component, { success, failure }) => async (args): Promise<CommandResult> => {
    const defaultMessage = 'Focus row.';
    const dataController = component.getController('data');
    const key = dataController.getKeyByRowIndex(args.index);

    if (!component.option('focusedRowEnabled') || key === undefined) {
      return failure(defaultMessage);
    }

    try {
      await component.getController('focus').handleFocusedRowKeyChange(key);

      return success(defaultMessage);
    } catch {
      return failure(defaultMessage);
    }
  },
});
