import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { Properties } from '@js/ui/data_grid';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../../__tests__/__mock__/helpers/utils';
import {
  clearSelectionCommand,
  deselectAllCommand,
  selectAllCommand,
  selectByIndexesCommand,
  selectByKeysCommand,
} from '../selection';

const createCallbacks = (): {
  success: jest.Mock<(message?: string) => CommandResult>;
  failure: jest.Mock<(message?: string) => CommandResult>;
} => ({
  success: jest.fn((message?: string) => ({ status: 'success' as const, message: message ?? '' })),
  failure: jest.fn((message?: string) => ({ status: 'failure' as const, message: message ?? '' })),
});

const createGrid = async (
  options: Record<string, unknown> = {},
): Promise<InternalGrid> => {
  const { instance } = await createDataGrid({
    dataSource: [
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Beta' },
      { id: 3, name: 'Gamma' },
    ],
    keyExpr: 'id',
    columns: [
      { dataField: 'id', dataType: 'number' },
      { dataField: 'name', dataType: 'string' },
    ],
    selection: { mode: 'multiple' },
    ...options,
  } as unknown as Properties);
  return instance as unknown as InternalGrid;
};

const createCompositeGrid = (
  options: Record<string, unknown> = {},
): Promise<InternalGrid> => createGrid({
  dataSource: [
    { a: 1, b: 10, name: 'Alpha' },
    { a: 2, b: 20, name: 'Beta' },
  ],
  keyExpr: ['a', 'b'],
  columns: [
    { dataField: 'a', dataType: 'number' },
    { dataField: 'b', dataType: 'number' },
    { dataField: 'name', dataType: 'string' },
  ],
  ...options,
});

describe('selectByKeysCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it.each([
      [[1, 2]],
      [['a', 'b']],
    ])('accepts an array of primitive keys %p', (keys) => {
      expect(selectByKeysCommand.schema.safeParse({ keys, preserve: true }).success).toBe(true);
      expect(selectByKeysCommand.schema.safeParse({ keys, preserve: false }).success).toBe(true);
    });

    it('accepts array-of-pairs keys for composite keyExpr', () => {
      const keys = [[{ field: 'a', value: 1 }, { field: 'b', value: 10 }]];

      expect(selectByKeysCommand.schema.safeParse({ keys, preserve: true }).success).toBe(true);
    });

    it('rejects when keys is missing', () => {
      expect(selectByKeysCommand.schema.safeParse({ preserve: true }).success).toBe(false);
    });

    it('rejects when preserve is missing', () => {
      expect(selectByKeysCommand.schema.safeParse({ keys: [1] }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(selectByKeysCommand.schema.safeParse({
        keys: [1],
        preserve: true,
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure when selection.mode is none', async () => {
      const instance = await createGrid({ selection: { mode: 'none' } });
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      const result = await selectByKeysCommand.execute(instance, callbacks)({
        keys: [1],
        preserve: false,
      });

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('returns failure when keyExpr is not resolvable', async () => {
      const instance = await createGrid();
      const realOption = instance.option.bind(instance);
      jest.spyOn(instance, 'option').mockImplementation(((...callArgs: unknown[]): unknown => {
        if (callArgs.length === 1 && callArgs[0] === 'keyExpr') {
          return undefined;
        }
        return (realOption as (...a: unknown[]) => unknown)(...callArgs);
      }) as never);
      const dataSource = instance.getDataSource();
      jest.spyOn(dataSource.store(), 'key').mockReturnValue(undefined as never);
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      const result = await selectByKeysCommand.execute(instance, callbacks)({
        keys: [1],
        preserve: false,
      });

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('returns failure when a composite key is passed for a single-field keyExpr', async () => {
      const instance = await createGrid();
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      const result = await selectByKeysCommand.execute(instance, callbacks)({
        keys: [[{ field: 'id', value: 1 }]],
        preserve: false,
      });

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('returns failure when a primitive key is passed for a composite keyExpr', async () => {
      const instance = await createCompositeGrid();
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      const result = await selectByKeysCommand.execute(instance, callbacks)({
        keys: [1],
        preserve: false,
      });

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('returns failure when a composite key is missing a keyExpr field', async () => {
      const instance = await createCompositeGrid();
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      const result = await selectByKeysCommand.execute(instance, callbacks)({
        keys: [[{ field: 'a', value: 1 }]],
        preserve: false,
      });

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('returns failure when any key in the array has invalid shape', async () => {
      const instance = await createCompositeGrid();
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      // First key is valid, second is missing field 'b'
      const result = await selectByKeysCommand.execute(instance, callbacks)({
        keys: [
          [{ field: 'a', value: 1 }, { field: 'b', value: 10 }],
          [{ field: 'a', value: 2 }],
        ],
        preserve: false,
      });

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('calls selectRows with keys and preserve on success', async () => {
      const instance = await createGrid();
      const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      const result = await selectByKeysCommand.execute(instance, callbacks)({
        keys: [1, 2],
        preserve: true,
      });

      expect(selectSpy).toHaveBeenCalledWith([1, 2], true);
      expect(result.status).toBe('success');
    });

    it('returns failure when selectRows throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'selectRows').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await selectByKeysCommand.execute(instance, callbacks)({
        keys: [1],
        preserve: false,
      });

      expect(result.status).toBe('failure');
    });

    it('returns failure when selectRows rejects', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.reject(new Error('Error')) as never);
      const callbacks = createCallbacks();

      const result = await selectByKeysCommand.execute(instance, callbacks)({
        keys: [1],
        preserve: false,
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses `Select row(s).` on success', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      await selectByKeysCommand.execute(instance, callbacks)({ keys: [1], preserve: false });

      expect(callbacks.success).toHaveBeenCalledWith('Select row(s).');
    });

    it('passes the same default message to failure', async () => {
      const instance = await createGrid({ selection: { mode: 'none' } });
      const callbacks = createCallbacks();

      await selectByKeysCommand.execute(instance, callbacks)({ keys: [1], preserve: false });

      expect(callbacks.failure).toHaveBeenCalledWith('Select row(s).');
    });
  });
});

describe('selectByIndexesCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts an array of positive integers with mode deselect', () => {
      expect(selectByIndexesCommand.schema.safeParse({
        indexes: [1, 2, 3], mode: 'deselect',
      }).success).toBe(true);
    });

    it('accepts mode select', () => {
      expect(selectByIndexesCommand.schema.safeParse({
        indexes: [1], mode: 'select',
      }).success).toBe(true);
    });

    it('rejects when indexes is missing', () => {
      expect(selectByIndexesCommand.schema.safeParse({ mode: 'select' }).success).toBe(false);
    });

    it('rejects when mode is missing', () => {
      expect(selectByIndexesCommand.schema.safeParse({
        indexes: [1],
      }).success).toBe(false);
    });

    it('rejects an invalid mode value', () => {
      expect(selectByIndexesCommand.schema.safeParse({
        indexes: [1], mode: 'toggle',
      }).success).toBe(false);
    });

    it('rejects when indexes is an empty array', () => {
      expect(selectByIndexesCommand.schema.safeParse({
        indexes: [], mode: 'select',
      }).success).toBe(false);
    });

    it('rejects zero (indexes are 1-based)', () => {
      expect(selectByIndexesCommand.schema.safeParse({
        indexes: [0], mode: 'select',
      }).success).toBe(false);
    });

    it('rejects negative indexes', () => {
      expect(selectByIndexesCommand.schema.safeParse({
        indexes: [-1], mode: 'select',
      }).success).toBe(false);
    });

    it('rejects non-integer indexes', () => {
      expect(selectByIndexesCommand.schema.safeParse({
        indexes: [1.5], mode: 'select',
      }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(selectByIndexesCommand.schema.safeParse({
        indexes: [1],
        mode: 'select',
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure when selection.mode is none', async () => {
      const instance = await createGrid({ selection: { mode: 'none' } });
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      const result = await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'select',
      });

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('returns failure when dataSource/store is missing', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'getDataSource').mockReturnValue(undefined as never);
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      const result = await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'select',
      });

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('loads a contiguous range via store.load with skip/take and selects resolved keys with preserve=true', async () => {
      const instance = await createGrid();
      const store = instance.getDataSource().store();
      const loadSpy = jest.spyOn(store, 'load').mockReturnValue(
        Promise.resolve([{ id: 2, name: 'Beta' }, { id: 3, name: 'Gamma' }]) as never,
      );
      const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      const result = await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [2, 3], mode: 'select',
      });

      expect(loadSpy).toHaveBeenCalledTimes(1);
      const loadArg = loadSpy.mock.calls[0][0] as { skip: number; take: number };
      expect(loadArg.skip).toBe(1);
      expect(loadArg.take).toBe(2);
      expect(selectSpy).toHaveBeenCalledWith([2, 3], true);
      expect(result.status).toBe('success');
    });

    it('splits non-contiguous indexes into multiple store.load calls and aggregates keys', async () => {
      const instance = await createGrid();
      const store = instance.getDataSource().store();
      const loadSpy = jest.spyOn(store, 'load').mockImplementation((options: unknown) => {
        const { skip, take } = options as { skip: number; take: number };
        if (skip === 0 && take === 2) {
          return Promise.resolve([{ id: 1, name: 'Alpha' }, { id: 2, name: 'Beta' }]) as never;
        }
        if (skip === 4 && take === 1) {
          return Promise.resolve([{ id: 5, name: 'Epsilon' }]) as never;
        }
        return Promise.resolve([]) as never;
      });
      const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      const result = await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1, 2, 5], mode: 'select',
      });

      expect(loadSpy).toHaveBeenCalledTimes(2);
      expect(selectSpy).toHaveBeenCalledWith([1, 2, 5], true);
      expect(result.status).toBe('success');
    });

    it('returns failure when store.load returns fewer rows than requested (range exceeds dataset)', async () => {
      const instance = await createGrid();
      const store = instance.getDataSource().store();
      jest.spyOn(store, 'load').mockReturnValue(
        Promise.resolve([{ id: 1, name: 'Alpha' }]) as never,
      );
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      // Three rows in createGrid; range 1..10 cannot be fully resolved.
      const result = await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mode: 'select',
      });

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('resolves keys via store.load and calls deselectRows when deselecting', async () => {
      const instance = await createGrid();
      const store = instance.getDataSource().store();
      jest.spyOn(store, 'load').mockReturnValue(
        Promise.resolve([{ id: 1, name: 'Alpha' }]) as never,
      );
      const deselectSpy = jest.spyOn(instance, 'deselectRows').mockReturnValue(Promise.resolve([]) as never);
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      const result = await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'deselect',
      });

      expect(deselectSpy).toHaveBeenCalledWith([1]);
      expect(selectSpy).not.toHaveBeenCalled();
      expect(result.status).toBe('success');
    });

    it('returns failure when store.load rejects', async () => {
      const instance = await createGrid();
      jest.spyOn(instance.getDataSource().store(), 'load')
        .mockReturnValue(Promise.reject(new Error('Error')) as never);
      const callbacks = createCallbacks();

      const result = await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'select',
      });

      expect(result.status).toBe('failure');
    });

    it('returns failure when selectRows rejects', async () => {
      const instance = await createGrid();
      jest.spyOn(instance.getDataSource().store(), 'load').mockReturnValue(
        Promise.resolve([{ id: 1, name: 'Alpha' }]) as never,
      );
      jest.spyOn(instance, 'selectRows')
        .mockReturnValue(Promise.reject(new Error('Error')) as never);
      const callbacks = createCallbacks();

      const result = await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'select',
      });

      expect(result.status).toBe('failure');
    });

    it('returns failure when deselectRows rejects', async () => {
      const instance = await createGrid();
      jest.spyOn(instance.getDataSource().store(), 'load').mockReturnValue(
        Promise.resolve([{ id: 1, name: 'Alpha' }]) as never,
      );
      jest.spyOn(instance, 'deselectRows')
        .mockReturnValue(Promise.reject(new Error('Error')) as never);
      const callbacks = createCallbacks();

      const result = await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'deselect',
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('reports the 1-based row numbers on select', async () => {
      const instance = await createGrid();
      jest.spyOn(instance.getDataSource().store(), 'load').mockReturnValue(
        Promise.resolve([{ id: 1, name: 'Alpha' }, { id: 3, name: 'Gamma' }]) as never,
      );
      jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1, 3], mode: 'select',
      });

      expect(callbacks.success).toHaveBeenCalledWith('Select row(s) number 1, 3.');
    });

    it('reports the 1-based row numbers on deselect', async () => {
      const instance = await createGrid();
      jest.spyOn(instance.getDataSource().store(), 'load').mockReturnValue(
        Promise.resolve([{ id: 1, name: 'Alpha' }]) as never,
      );
      jest.spyOn(instance, 'deselectRows').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'deselect',
      });

      expect(callbacks.success).toHaveBeenCalledWith('Deselect row(s) number 1.');
    });

    it('passes the same default message to failure', async () => {
      const instance = await createGrid({ selection: { mode: 'none' } });
      const callbacks = createCallbacks();

      await selectByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'select',
      });

      expect(callbacks.failure).toHaveBeenCalledWith('Select row(s) number 1.');
    });
  });
});

describe('selectAllCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts empty object', () => {
      expect(selectAllCommand.schema.safeParse({}).success).toBe(true);
    });

    it('rejects unknown properties', () => {
      expect(selectAllCommand.schema.safeParse({ extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure when selection.mode is none', async () => {
      const instance = await createGrid({ selection: { mode: 'none' } });
      const selectSpy = jest.spyOn(instance, 'selectAll');
      const callbacks = createCallbacks();

      const result = await selectAllCommand.execute(instance, callbacks)();

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('calls selectAll on success', async () => {
      const instance = await createGrid();
      const selectSpy = jest.spyOn(instance, 'selectAll').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      const result = await selectAllCommand.execute(instance, callbacks)();

      expect(selectSpy).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('success');
    });

    it('returns failure when selectAll throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'selectAll').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await selectAllCommand.execute(instance, callbacks)();

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses literal `Select all rows.`', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'selectAll').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      await selectAllCommand.execute(instance, callbacks)();

      expect(callbacks.success).toHaveBeenCalledWith('Select all rows.');
    });

    it('passes the same default message to failure', async () => {
      const instance = await createGrid({ selection: { mode: 'none' } });
      const callbacks = createCallbacks();

      await selectAllCommand.execute(instance, callbacks)();

      expect(callbacks.failure).toHaveBeenCalledWith('Select all rows.');
    });
  });
});

describe('deselectAllCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts empty object', () => {
      expect(deselectAllCommand.schema.safeParse({}).success).toBe(true);
    });

    it('rejects unknown properties', () => {
      expect(deselectAllCommand.schema.safeParse({ extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure when selection.mode is none', async () => {
      const instance = await createGrid({ selection: { mode: 'none' } });
      const deselectSpy = jest.spyOn(instance, 'deselectAll');
      const callbacks = createCallbacks();

      const result = await deselectAllCommand.execute(instance, callbacks)();

      expect(result.status).toBe('failure');
      expect(deselectSpy).not.toHaveBeenCalled();
    });

    it('calls deselectAll on success', async () => {
      const instance = await createGrid();
      const deselectSpy = jest.spyOn(instance, 'deselectAll').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      const result = await deselectAllCommand.execute(instance, callbacks)();

      expect(deselectSpy).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('success');
    });

    it('returns failure when deselectAll throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'deselectAll').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await deselectAllCommand.execute(instance, callbacks)();

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses literal `Deselect all rows.`', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'deselectAll').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      await deselectAllCommand.execute(instance, callbacks)();

      expect(callbacks.success).toHaveBeenCalledWith('Deselect all rows.');
    });

    it('passes the same default message to failure', async () => {
      const instance = await createGrid({ selection: { mode: 'none' } });
      const callbacks = createCallbacks();

      await deselectAllCommand.execute(instance, callbacks)();

      expect(callbacks.failure).toHaveBeenCalledWith('Deselect all rows.');
    });
  });
});

describe('clearSelectionCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts empty object', () => {
      expect(clearSelectionCommand.schema.safeParse({}).success).toBe(true);
    });

    it('rejects unknown properties', () => {
      expect(clearSelectionCommand.schema.safeParse({ extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('calls clearSelection on success', async () => {
      const instance = await createGrid();
      const clearSpy = jest.spyOn(instance, 'clearSelection').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      const result = await clearSelectionCommand.execute(instance, callbacks)();

      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('success');
    });

    it('returns failure when clearSelection throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'clearSelection').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await clearSelectionCommand.execute(instance, callbacks)();

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses literal `Clear selection.`', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'clearSelection').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      await clearSelectionCommand.execute(instance, callbacks)();

      expect(callbacks.success).toHaveBeenCalledWith('Clear selection.');
    });

    it('passes the same default message to failure', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'clearSelection').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      await clearSelectionCommand.execute(instance, callbacks)();

      expect(callbacks.failure).toHaveBeenCalledWith('Clear selection.');
    });
  });
});
