import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { Properties } from '@js/ui/data_grid';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';

import { clearGroupingCommand, groupingCommand } from '../grouping';

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
      { id: 1, name: 'Alpha', age: 10 },
      { id: 2, name: 'Beta', age: 20 },
    ],
    columns: [
      { dataField: 'id', dataType: 'number' },
      { dataField: 'name', caption: 'Full Name', dataType: 'string' },
      { dataField: 'age', dataType: 'number' },
    ],
    ...options,
  } as unknown as Properties);
  return instance as unknown as InternalGrid;
};

describe('groupingCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts valid args with non-negative integer groupIndex', () => {
      expect(groupingCommand.schema.safeParse({
        dataField: 'name',
        groupIndex: 0,
      }).success).toBe(true);
    });

    it('accepts null groupIndex (ungroup)', () => {
      expect(groupingCommand.schema.safeParse({
        dataField: 'name',
        groupIndex: null,
      }).success).toBe(true);
    });

    it('rejects when dataField is missing', () => {
      expect(groupingCommand.schema.safeParse({
        groupIndex: 0,
      }).success).toBe(false);
    });

    it('rejects when groupIndex is missing', () => {
      expect(groupingCommand.schema.safeParse({
        dataField: 'name',
      }).success).toBe(false);
    });

    it('rejects when dataField is not a string', () => {
      expect(groupingCommand.schema.safeParse({
        dataField: 123,
        groupIndex: 0,
      }).success).toBe(false);
    });

    it('rejects when groupIndex is negative', () => {
      expect(groupingCommand.schema.safeParse({
        dataField: 'name',
        groupIndex: -1,
      }).success).toBe(false);
    });

    it('rejects when groupIndex is not an integer', () => {
      expect(groupingCommand.schema.safeParse({
        dataField: 'name',
        groupIndex: 1.5,
      }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(groupingCommand.schema.safeParse({
        dataField: 'name',
        groupIndex: 0,
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure and skips columnOption write when column.allowGrouping is false', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'id', dataType: 'number' },
          {
            dataField: 'name', caption: 'Full Name', dataType: 'string', allowGrouping: false,
          },
        ],
      });
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await groupingCommand.execute(instance, callbacks)({
        dataField: 'name',
        groupIndex: 0,
      });

      expect(result.status).toBe('failure');
      expect(callbacks.success).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalledWith(
        expect.anything(),
        'groupIndex',
        expect.anything(),
      );
    });

    it('returns failure and skips columnOption write when dataField does not match any column', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await groupingCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        groupIndex: 0,
      });

      expect(result.status).toBe('failure');
      expect(callbacks.success).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalledWith(
        expect.anything(),
        'groupIndex',
        expect.anything(),
      );
    });

    it('calls columnsController.columnOption(column.index, "groupIndex", groupIndex) for non-null groupIndex', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await groupingCommand.execute(instance, callbacks)({
        dataField: 'name',
        groupIndex: 0,
      });

      const nameColumn = columnsController.columnOption('name') as { index: number };
      expect(spy).toHaveBeenCalledWith(nameColumn.index, 'groupIndex', 0);
      expect(result.status).toBe('success');
    });

    it('passes undefined when groupIndex is null (ungroups the column)', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'columnOption');
      const callbacks = createCallbacks();

      const result = await groupingCommand.execute(instance, callbacks)({
        dataField: 'name',
        groupIndex: null,
      });

      const nameColumn = columnsController.columnOption('name') as { index: number };
      expect(spy).toHaveBeenCalledWith(nameColumn.index, 'groupIndex', undefined);
      expect(result.status).toBe('success');
    });

    it('returns failure when columnOption throws', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const originalColumnOption = columnsController.columnOption.bind(columnsController);
      jest.spyOn(columnsController, 'columnOption').mockImplementation((...args: unknown[]) => {
        if (args.length >= 3) {
          throw new Error('Error setting groupIndex');
        }
        return (originalColumnOption as (...a: unknown[]) => unknown)(...args);
      });
      const callbacks = createCallbacks();

      const result = await groupingCommand.execute(instance, callbacks)({
        dataField: 'name',
        groupIndex: 0,
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses `Group data against "[caption]".` for non-null groupIndex', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await groupingCommand.execute(instance, callbacks)({
        dataField: 'name',
        groupIndex: 0,
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Group data against "Full Name".',
      );
    });

    it('uses `Ungroup data against "[caption]".` for null groupIndex', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await groupingCommand.execute(instance, callbacks)({
        dataField: 'name',
        groupIndex: null,
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Ungroup data against "Full Name".',
      );
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'id', dataType: 'number' },
          {
            dataField: 'name', caption: 'Full Name', dataType: 'string', allowGrouping: false,
          },
        ],
      });
      const callbacks = createCallbacks();

      await groupingCommand.execute(instance, callbacks)({
        dataField: 'name',
        groupIndex: 0,
      });

      expect(callbacks.failure).toHaveBeenCalledWith(
        'Group data against "Full Name".',
      );
    });

    it('falls back to the raw dataField when no column matches', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await groupingCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        groupIndex: 0,
      });

      expect(callbacks.failure).toHaveBeenCalledWith(
        'Group data against "unknown".',
      );
    });
  });
});

describe('clearGroupingCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts an empty object', () => {
      expect(clearGroupingCommand.schema.safeParse({}).success).toBe(true);
    });

    it('rejects unknown properties', () => {
      expect(clearGroupingCommand.schema.safeParse({
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('calls columnsController.clearGrouping() exactly once', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'clearGrouping');
      const callbacks = createCallbacks();

      const result = await clearGroupingCommand.execute(instance, callbacks)();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('success');
    });

    it('returns failure when clearGrouping throws', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      jest.spyOn(columnsController, 'clearGrouping').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await clearGroupingCommand.execute(instance, callbacks)();

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses the literal `Clear grouping.`', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await clearGroupingCommand.execute(instance, callbacks)();

      expect(callbacks.success).toHaveBeenCalledWith('Clear grouping.');
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      jest.spyOn(columnsController, 'clearGrouping').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      await clearGroupingCommand.execute(instance, callbacks)();

      expect(callbacks.failure).toHaveBeenCalledWith('Clear grouping.');
    });
  });
});
