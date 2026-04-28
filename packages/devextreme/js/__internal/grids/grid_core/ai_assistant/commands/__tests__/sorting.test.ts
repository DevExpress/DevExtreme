import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { Properties } from '@js/ui/data_grid';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../../__tests__/__mock__/helpers/utils';
import { clearSortingCommand, sortingCommand } from '../sorting';

interface CommandResult { status: 'success' | 'failure' | 'aborted'; message: string }

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
    ],
    columns: [
      { dataField: 'id', dataType: 'number' },
      { dataField: 'name', caption: 'Full Name', dataType: 'string' },
    ],
    ...options,
  } as unknown as Properties);
  return instance as unknown as InternalGrid;
};

describe('sortingCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it.each([
      ['asc'],
      ['desc'],
      ['none'],
    ])('accepts valid args with sortOrder "%s"', (sortOrder) => {
      expect(sortingCommand.schema.safeParse({
        dataField: 'name',
        sortOrder,
      }).success).toBe(true);
    });

    it('rejects when dataField is missing', () => {
      expect(sortingCommand.schema.safeParse({
        sortOrder: 'asc',
      }).success).toBe(false);
    });

    it('rejects when sortOrder is missing', () => {
      expect(sortingCommand.schema.safeParse({
        dataField: 'name',
      }).success).toBe(false);
    });

    it('rejects when dataField is not a string', () => {
      expect(sortingCommand.schema.safeParse({
        dataField: 123,
        sortOrder: 'asc',
      }).success).toBe(false);
    });

    it('rejects when sortOrder is not in the enum', () => {
      expect(sortingCommand.schema.safeParse({
        dataField: 'name',
        sortOrder: 'ascending',
      }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(sortingCommand.schema.safeParse({
        dataField: 'name',
        sortOrder: 'asc',
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure and skips changeSortOrder when sorting.mode is "none"', async () => {
      const instance = await createGrid({ sorting: { mode: 'none' } });
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'changeSortOrder');
      const callbacks = createCallbacks();

      const result = await sortingCommand.execute(instance, callbacks)({
        dataField: 'name',
        sortOrder: 'asc',
      });

      expect(result.status).toBe('failure');
      expect(callbacks.success).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('returns failure and skips changeSortOrder when column.allowSorting is false', async () => {
      const instance = await createGrid({
        columns: [
          { dataField: 'id', dataType: 'number' },
          {
            dataField: 'name', caption: 'Full Name', dataType: 'string', allowSorting: false,
          },
        ],
      });
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'changeSortOrder');
      const callbacks = createCallbacks();

      const result = await sortingCommand.execute(instance, callbacks)({
        dataField: 'name',
        sortOrder: 'asc',
      });

      expect(result.status).toBe('failure');
      expect(callbacks.success).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('returns failure and skips changeSortOrder when dataField does not match any column', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'changeSortOrder');
      const callbacks = createCallbacks();

      const result = await sortingCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        sortOrder: 'asc',
      });

      expect(result.status).toBe('failure');
      expect(callbacks.success).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('calls columnsController.changeSortOrder(column.index, sortOrder) exactly once', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'changeSortOrder');
      const callbacks = createCallbacks();

      const result = await sortingCommand.execute(instance, callbacks)({
        dataField: 'name',
        sortOrder: 'asc',
      });

      const nameColumn = columnsController.columnOption('name') as { index: number };
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(nameColumn.index, 'asc');
      expect(result.status).toBe('success');
    });

    it('returns failure when changeSortOrder throws', async () => {
      const instance = await createGrid();
      const columnsController = instance.getController('columns');
      jest.spyOn(columnsController, 'changeSortOrder').mockImplementation(() => {
        throw new Error('Error changing sort order');
      });
      const callbacks = createCallbacks();

      const result = await sortingCommand.execute(instance, callbacks)({
        dataField: 'name',
        sortOrder: 'asc',
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses `Sort data against "[caption]" in ascending order.` for sortOrder "asc"', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await sortingCommand.execute(instance, callbacks)({
        dataField: 'name',
        sortOrder: 'asc',
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Sort data against "Full Name" in ascending order.',
      );
    });

    it('uses `Sort data against "[caption]" in descending order.` for sortOrder "desc"', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await sortingCommand.execute(instance, callbacks)({
        dataField: 'name',
        sortOrder: 'desc',
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Sort data against "Full Name" in descending order.',
      );
    });

    it('uses `Clear sorting against "[caption]".` for sortOrder "none"', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await sortingCommand.execute(instance, callbacks)({
        dataField: 'name',
        sortOrder: 'none',
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Clear sorting against "Full Name".',
      );
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid({ sorting: { mode: 'none' } });
      const callbacks = createCallbacks();

      await sortingCommand.execute(instance, callbacks)({
        dataField: 'name',
        sortOrder: 'asc',
      });

      expect(callbacks.failure).toHaveBeenCalledWith(
        'Sort data against "Full Name" in ascending order.',
      );
    });

    it('falls back to the raw dataField when no column matches', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await sortingCommand.execute(instance, callbacks)({
        dataField: 'unknown',
        sortOrder: 'asc',
      });

      expect(callbacks.failure).toHaveBeenCalledWith(
        'Sort data against "unknown" in ascending order.',
      );
    });
  });
});

describe('clearSortingCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts an empty object', () => {
      expect(clearSortingCommand.schema.safeParse({}).success).toBe(true);
    });

    it('rejects unknown properties', () => {
      expect(clearSortingCommand.schema.safeParse({
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('calls grid instance clearSorting() exactly once', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'clearSorting');
      const callbacks = createCallbacks();

      const result = await clearSortingCommand.execute(instance, callbacks)();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('success');
    });

    it('returns failure when clearSorting throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'clearSorting').mockImplementation(() => {
        throw new Error('boom');
      });
      const callbacks = createCallbacks();

      const result = await clearSortingCommand.execute(instance, callbacks)();

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses the literal `Clear sorting.`', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await clearSortingCommand.execute(instance, callbacks)();

      expect(callbacks.success).toHaveBeenCalledWith('Clear sorting.');
    });
  });
});
