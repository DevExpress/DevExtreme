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
  selectByKeysCommand,
  selectionByIndexesCommand,
} from '../selection';

const createCallbacks = (): {
  success: jest.Mock<(message?: string) => CommandResult>;
  failure: jest.Mock<(message?: string) => CommandResult>;
} => ({
  success: jest.fn((message?: string) => ({ status: 'success' as const, message: message ?? '' })),
  failure: jest.fn((message?: string) => ({ status: 'failure' as const, message: message ?? '' })),
});

// The local "allPages" path calls loadAll(), which defers behind the grid's
// loading timer. Under fake timers that timer must be advanced while the
// command is in flight, otherwise the awaited result never settles.
const executeWithTimers = async (
  run: () => Promise<CommandResult>,
): Promise<CommandResult> => {
  const promise = run();
  await jest.runAllTimersAsync();
  return promise;
};

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

const createRemoteGrid = (
  options: Record<string, unknown> = {},
): Promise<InternalGrid> => createGrid({
  remoteOperations: { paging: true, filtering: true, sorting: true },
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

describe('selectionByIndexesCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts an array of positive integers with mode deselect', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [1, 2, 3], mode: 'deselect', scope: 'allPages',
      }).success).toBe(true);
    });

    it('accepts mode select', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [1], mode: 'select', scope: 'allPages',
      }).success).toBe(true);
    });

    it('rejects when indexes is missing', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        mode: 'select', scope: 'allPages',
      }).success).toBe(false);
    });

    it('rejects when mode is missing', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [1], scope: 'allPages',
      }).success).toBe(false);
    });

    it('rejects an invalid mode value', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [1], mode: 'toggle', scope: 'allPages',
      }).success).toBe(false);
    });

    it('rejects when indexes is an empty array', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [], mode: 'select', scope: 'allPages',
      }).success).toBe(false);
    });

    it('rejects zero (indexes are 1-based)', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [0], mode: 'select', scope: 'allPages',
      }).success).toBe(false);
    });

    it('rejects negative indexes', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [-1], mode: 'select', scope: 'allPages',
      }).success).toBe(false);
    });

    it('rejects non-integer indexes', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [1.5], mode: 'select', scope: 'allPages',
      }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [1],
        mode: 'select',
        scope: 'allPages',
        extra: 1,
      }).success).toBe(false);
    });

    it('rejects when scope is missing', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [1], mode: 'select',
      }).success).toBe(false);
    });

    it('accepts scope "allPages"', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [1], mode: 'select', scope: 'allPages',
      }).success).toBe(true);
    });

    it('accepts scope "page"', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [1], mode: 'select', scope: 'page',
      }).success).toBe(true);
    });

    it('rejects an invalid scope value', () => {
      expect(selectionByIndexesCommand.schema.safeParse({
        indexes: [1], mode: 'select', scope: 'global',
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure when selection.mode is none', async () => {
      const instance = await createGrid({ selection: { mode: 'none' } });
      const selectSpy = jest.spyOn(instance, 'selectRows');
      const callbacks = createCallbacks();

      const result = await selectionByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'select', scope: 'allPages',
      });

      expect(result.status).toBe('failure');
      expect(selectSpy).not.toHaveBeenCalled();
    });

    describe('scope "allPages" — remote paging', () => {
      it('returns failure when dataSource/store is missing', async () => {
        const instance = await createRemoteGrid();
        jest.spyOn(instance, 'getDataSource').mockReturnValue(undefined as never);
        const selectSpy = jest.spyOn(instance, 'selectRows');
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1], mode: 'select', scope: 'allPages',
        });

        expect(result.status).toBe('failure');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('returns failure (without loading) when no key is configured', async () => {
        const instance = await createRemoteGrid();
        const realOption = instance.option.bind(instance);
        jest.spyOn(instance, 'option').mockImplementation(((...callArgs: unknown[]): unknown => {
          if (callArgs.length === 1 && callArgs[0] === 'keyExpr') {
            return undefined;
          }
          return (realOption as (...a: unknown[]) => unknown)(...callArgs);
        }) as never);
        const store = instance.getDataSource().store();
        jest.spyOn(store, 'key').mockReturnValue(undefined as never);
        const loadSpy = jest.spyOn(store, 'load');
        const selectSpy = jest.spyOn(instance, 'selectRows');
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1, 2], mode: 'select', scope: 'allPages',
        });

        expect(result.status).toBe('failure');
        expect(loadSpy).not.toHaveBeenCalled();
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('loads a contiguous range via store.load with skip/take and selects resolved keys with preserve=true', async () => {
        const instance = await createRemoteGrid();
        const store = instance.getDataSource().store();
        const loadSpy = jest.spyOn(store, 'load').mockReturnValue(
          Promise.resolve([{ id: 2, name: 'Beta' }, { id: 3, name: 'Gamma' }]) as never,
        );
        const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [2, 3], mode: 'select', scope: 'allPages',
        });

        expect(loadSpy).toHaveBeenCalledTimes(1);
        const loadArg = loadSpy.mock.calls[0][0] as { skip: number; take: number };
        expect(loadArg.skip).toBe(1);
        expect(loadArg.take).toBe(2);
        expect(selectSpy).toHaveBeenCalledWith([2, 3], true);
        expect(result.status).toBe('success');
      });

      it('applies the combined filter (not just the base dataSource filter) to store.load', async () => {
        const instance = await createRemoteGrid({
          columns: [
            { dataField: 'id', dataType: 'number' },
            {
              dataField: 'name', dataType: 'string', filterValue: 'Beta', selectedFilterOperation: '=',
            },
          ],
          filterRow: { visible: true },
        });
        const store = instance.getDataSource().store();
        const loadSpy = jest.spyOn(store, 'load').mockReturnValue(
          Promise.resolve([{ id: 2, name: 'Beta' }]) as never,
        );
        jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1], mode: 'select', scope: 'allPages',
        });

        const loadArg = loadSpy.mock.calls[0][0] as { filter: unknown };
        expect(JSON.stringify(loadArg.filter)).toContain('Beta');
      });

      it('coalesces nearby indexes into a single store.load and picks the requested offsets', async () => {
        const instance = await createRemoteGrid();
        const store = instance.getDataSource().store();
        const loadSpy = jest.spyOn(store, 'load').mockReturnValue(
          Promise.resolve([
            { id: 1, name: 'Alpha' },
            { id: 2, name: 'Beta' },
            { id: 3, name: 'Gamma' },
            { id: 4, name: 'Delta' },
            { id: 5, name: 'Epsilon' },
          ]) as never,
        );
        const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1, 2, 5], mode: 'select', scope: 'allPages',
        });

        expect(loadSpy).toHaveBeenCalledTimes(1);
        const loadArg = loadSpy.mock.calls[0][0] as { skip: number; take: number };
        expect(loadArg.skip).toBe(0);
        expect(loadArg.take).toBe(5);
        // Only the requested offsets (0, 1, 4) are selected; gap rows are dropped.
        expect(selectSpy).toHaveBeenCalledWith([1, 2, 5], true);
        expect(result.status).toBe('success');
      });

      it('splits indexes wider than the load window into separate store.load calls', async () => {
        const instance = await createRemoteGrid();
        const store = instance.getDataSource().store();
        const loadSpy = jest.spyOn(store, 'load').mockImplementation((options: unknown) => {
          const { skip } = options as { skip: number; take: number };
          return skip === 0
            ? Promise.resolve([{ id: 1, name: 'Alpha' }]) as never
            : Promise.resolve([{ id: 99, name: 'Far' }]) as never;
        });
        const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1, 5000], mode: 'select', scope: 'allPages',
        });

        expect(loadSpy).toHaveBeenCalledTimes(2);
        expect(selectSpy).toHaveBeenCalledWith([1, 99], true);
        expect(result.status).toBe('success');
      });

      it('returns failure (without loading) when grouping is active', async () => {
        const instance = await createRemoteGrid({
          columns: [
            { dataField: 'id', dataType: 'number' },
            { dataField: 'name', dataType: 'string', groupIndex: 0 },
          ],
        });
        const loadSpy = jest.spyOn(instance.getDataSource().store(), 'load');
        const selectSpy = jest.spyOn(instance, 'selectRows');
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1], mode: 'select', scope: 'allPages',
        });

        expect(result.status).toBe('failure');
        expect(loadSpy).not.toHaveBeenCalled();
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('returns failure when store.load returns fewer rows than requested (range exceeds dataset)', async () => {
        const instance = await createRemoteGrid();
        const store = instance.getDataSource().store();
        jest.spyOn(store, 'load').mockReturnValue(
          Promise.resolve([{ id: 1, name: 'Alpha' }]) as never,
        );
        const selectSpy = jest.spyOn(instance, 'selectRows');
        const callbacks = createCallbacks();

        // Three rows in createGrid; range 1..10 cannot be fully resolved.
        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mode: 'select', scope: 'allPages',
        });

        expect(result.status).toBe('failure');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('resolves keys via store.load and calls deselectRows when deselecting', async () => {
        const instance = await createRemoteGrid();
        const store = instance.getDataSource().store();
        jest.spyOn(store, 'load').mockReturnValue(
          Promise.resolve([{ id: 1, name: 'Alpha' }]) as never,
        );
        const deselectSpy = jest.spyOn(instance, 'deselectRows').mockReturnValue(Promise.resolve([]) as never);
        const selectSpy = jest.spyOn(instance, 'selectRows');
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1], mode: 'deselect', scope: 'allPages',
        });

        expect(deselectSpy).toHaveBeenCalledWith([1]);
        expect(selectSpy).not.toHaveBeenCalled();
        expect(result.status).toBe('success');
      });

      it('returns failure when store.load rejects', async () => {
        const instance = await createRemoteGrid();
        jest.spyOn(instance.getDataSource().store(), 'load')
          .mockReturnValue(Promise.reject(new Error('Error')) as never);
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1], mode: 'select', scope: 'allPages',
        });

        expect(result.status).toBe('failure');
      });

      it('returns failure when selectRows rejects', async () => {
        const instance = await createRemoteGrid();
        jest.spyOn(instance.getDataSource().store(), 'load').mockReturnValue(
          Promise.resolve([{ id: 1, name: 'Alpha' }]) as never,
        );
        jest.spyOn(instance, 'selectRows')
          .mockReturnValue(Promise.reject(new Error('Error')) as never);
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1], mode: 'select', scope: 'allPages',
        });

        expect(result.status).toBe('failure');
      });

      it('returns failure when deselectRows rejects', async () => {
        const instance = await createRemoteGrid();
        jest.spyOn(instance.getDataSource().store(), 'load').mockReturnValue(
          Promise.resolve([{ id: 1, name: 'Alpha' }]) as never,
        );
        jest.spyOn(instance, 'deselectRows')
          .mockReturnValue(Promise.reject(new Error('Error')) as never);
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1], mode: 'deselect', scope: 'allPages',
        });

        expect(result.status).toBe('failure');
      });
    });

    describe('scope "allPages" — local paging', () => {
      it('resolves keys via loadAll (no store.load) and selects with preserve=true', async () => {
        const instance = await createGrid();
        const loadAllSpy = jest.spyOn(instance.getController('data'), 'loadAll');
        const loadSpy = jest.spyOn(instance.getDataSource().store(), 'load');
        const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        const result = await executeWithTimers(
          () => selectionByIndexesCommand.execute(instance, callbacks)({
            indexes: [1, 3], mode: 'select', scope: 'allPages',
          }),
        );

        expect(loadAllSpy).toHaveBeenCalled();
        expect(loadSpy).not.toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalledWith([1, 3], true);
        expect(result.status).toBe('success');
      });

      it('resolves keys via loadAll and calls deselectRows when deselecting', async () => {
        const instance = await createGrid();
        const deselectSpy = jest.spyOn(instance, 'deselectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        const result = await executeWithTimers(
          () => selectionByIndexesCommand.execute(instance, callbacks)({
            indexes: [2], mode: 'deselect', scope: 'allPages',
          }),
        );

        expect(deselectSpy).toHaveBeenCalledWith([2]);
        expect(result.status).toBe('success');
      });

      it('returns failure when an index exceeds the dataset', async () => {
        const instance = await createGrid();
        const selectSpy = jest.spyOn(instance, 'selectRows');
        const callbacks = createCallbacks();

        const result = await executeWithTimers(
          () => selectionByIndexesCommand.execute(instance, callbacks)({
            indexes: [1, 100], mode: 'select', scope: 'allPages',
          }),
        );

        expect(result.status).toBe('failure');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('skips group rows so indexes address data rows only', async () => {
        const instance = await createGrid({
          columns: [
            { dataField: 'id', dataType: 'number' },
            { dataField: 'name', dataType: 'string', groupIndex: 0 },
          ],
        });
        const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        const result = await executeWithTimers(
          () => selectionByIndexesCommand.execute(instance, callbacks)({
            indexes: [1], mode: 'select', scope: 'allPages',
          }),
        );

        expect(selectSpy).toHaveBeenCalledWith([1], true);
        expect(result.status).toBe('success');
      });

      it('indexes within the filtered dataset (combined filter applied via loadAll)', async () => {
        const instance = await createGrid({
          columns: [
            { dataField: 'id', dataType: 'number' },
            {
              dataField: 'name', dataType: 'string', filterValue: 'Beta', selectedFilterOperation: '=',
            },
          ],
          filterRow: { visible: true },
        });
        const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        const result = await executeWithTimers(
          () => selectionByIndexesCommand.execute(instance, callbacks)({
            indexes: [1], mode: 'select', scope: 'allPages',
          }),
        );

        expect(selectSpy).toHaveBeenCalledWith([2], true);
        expect(result.status).toBe('success');
      });

      it('returns failure when selectRows rejects', async () => {
        const instance = await createGrid();
        jest.spyOn(instance, 'selectRows')
          .mockReturnValue(Promise.reject(new Error('Error')) as never);
        const callbacks = createCallbacks();

        const result = await executeWithTimers(
          () => selectionByIndexesCommand.execute(instance, callbacks)({
            indexes: [1], mode: 'select', scope: 'allPages',
          }),
        );

        expect(result.status).toBe('failure');
      });
    });

    describe('scope "page"', () => {
      it('resolves keys from the current page items (no store.load) and selects with preserve=true', async () => {
        const instance = await createGrid();
        const loadSpy = jest.spyOn(instance.getDataSource().store(), 'load');
        const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1, 3], mode: 'select', scope: 'page',
        });

        expect(loadSpy).not.toHaveBeenCalled();
        expect(selectSpy).toHaveBeenCalledWith([1, 3], true);
        expect(result.status).toBe('success');
      });

      it('resolves keys from the current page items and calls deselectRows when deselecting', async () => {
        const instance = await createGrid();
        const deselectSpy = jest.spyOn(instance, 'deselectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1], mode: 'deselect', scope: 'page',
        });

        expect(deselectSpy).toHaveBeenCalledWith([1]);
        expect(result.status).toBe('success');
      });

      it('returns failure when any index has no row on the current page', async () => {
        const instance = await createGrid();
        const selectSpy = jest.spyOn(instance, 'selectRows');
        const callbacks = createCallbacks();

        // Three rows in createGrid; 1-based index 100 has no row on the current page.
        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1, 100], mode: 'select', scope: 'page',
        });

        expect(result.status).toBe('failure');
        expect(selectSpy).not.toHaveBeenCalled();
      });

      it('counts data rows only, skipping interleaved group rows', async () => {
        const instance = await createGrid({
          columns: [
            { dataField: 'id', dataType: 'number' },
            { dataField: 'name', dataType: 'string', groupIndex: 0 },
          ],
        });
        const selectSpy = jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
        const callbacks = createCallbacks();

        const result = await selectionByIndexesCommand.execute(instance, callbacks)({
          indexes: [1], mode: 'select', scope: 'page',
        });

        expect(selectSpy).toHaveBeenCalledWith([1], true);
        expect(result.status).toBe('success');
      });
    });
  });

  describe('default message', () => {
    it('reports the 1-based row numbers on select', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      await executeWithTimers(() => selectionByIndexesCommand.execute(instance, callbacks)({
        indexes: [1, 3], mode: 'select', scope: 'allPages',
      }));

      expect(callbacks.success).toHaveBeenCalledWith('Select row(s) number 1, 3.');
    });

    it('reports the 1-based row numbers on deselect', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'deselectRows').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      await executeWithTimers(() => selectionByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'deselect', scope: 'allPages',
      }));

      expect(callbacks.success).toHaveBeenCalledWith('Deselect row(s) number 1.');
    });

    it('passes the same default message to failure', async () => {
      const instance = await createGrid({ selection: { mode: 'none' } });
      const callbacks = createCallbacks();

      await selectionByIndexesCommand.execute(instance, callbacks)({
        indexes: [1], mode: 'select', scope: 'allPages',
      });

      expect(callbacks.failure).toHaveBeenCalledWith('Select row(s) number 1.');
    });

    it('appends "on the current page" when scope is "page"', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'selectRows').mockReturnValue(Promise.resolve([]) as never);
      const callbacks = createCallbacks();

      await selectionByIndexesCommand.execute(instance, callbacks)({
        indexes: [1, 2], mode: 'select', scope: 'page',
      });

      expect(callbacks.success).toHaveBeenCalledWith('Select row(s) number 1, 2 on the current page.');
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
