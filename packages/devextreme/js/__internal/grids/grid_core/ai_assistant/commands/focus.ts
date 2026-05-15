import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';
import { compositeKeyPairSchema, isKeyShapeValid, normalizeKey } from './utils';

const setFocusedRowKeyAndSettle = async (
  component: InternalGrid,
  key: unknown,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let off: (() => void) | undefined;
  const eventDone = new Promise<void>((resolve) => {
    const handler = (): void => resolve();

    component.on('focusedRowChanged', handler);

    off = (): void => {
      component.off('focusedRowChanged', handler);
    };
  });

  try {
    component.option('focusedRowKey', key);

    // The chain may resolve via either path:
    //   - `focusedRowChanged` event — when the row is focused successfully.
    //   - `dataController.waitReady()` — resolves once any pending page change /
    //     reload settles. Covers the cases where the event never fires (key not
    //     resolved, `_navigateToRow` rejects with `-1`).
    await Promise.race([
      eventDone,
      component.getController('data').waitReady(),
    ]);
  } finally {
    off?.();
  }
};

const focusRowByKeyCommandSchema = z.object({
  key: z.union([
    z.string(),
    z.number(),
    z.array(compositeKeyPairSchema),
  ]),
}).strict();

export const focusRowByKeyCommand = defineGridCommand({
  name: 'focusRowByKey',
  description: 'Focus a specific row by its key value. The key matches the grid\'s keyExpr or the underlying store\'s key — pass a string or number for a single-field key, or an array of {field, value} pairs for a composite key. Requires focusedRowEnabled to be true on the grid.',
  schema: focusRowByKeyCommandSchema,
  execute: (component, { success, failure }) => async (args): Promise<CommandResult> => {
    const defaultMessage = 'Focus row.';

    if (!component.option('focusedRowEnabled')) {
      return failure(defaultMessage);
    }

    const keyExpr = component.option('keyExpr')
      ?? component.getDataSource()?.store()?.key();

    const key = normalizeKey(args.key);

    if (!keyExpr || !isKeyShapeValid(keyExpr, key)) {
      return failure(defaultMessage);
    }

    try {
      await setFocusedRowKeyAndSettle(component, key);

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
    const defaultMessage = `Focus row number ${args.index + 1} on the current page.`;
    const dataController = component.getController('data');
    const key = dataController.getKeyByRowIndex(args.index);

    if (!component.option('focusedRowEnabled') || key === undefined) {
      return failure(defaultMessage);
    }

    try {
      await setFocusedRowKeyAndSettle(component, key);

      return success(defaultMessage);
    } catch {
      return failure(defaultMessage);
    }
  },
});
