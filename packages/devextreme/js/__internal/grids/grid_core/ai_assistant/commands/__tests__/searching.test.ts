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
import { searchingCommand } from '../searching';

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
      { id: 3, name: 'Gamma', age: 30 },
    ],
    columns: [
      { dataField: 'id', dataType: 'number' },
      { dataField: 'name', dataType: 'string' },
      { dataField: 'age', dataType: 'number' },
    ],
    ...options,
  } as unknown as Properties);
  return instance as unknown as InternalGrid;
};

describe('searchingCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts a non-empty string', () => {
      expect(searchingCommand.schema.safeParse({ text: 'Alpha' }).success).toBe(true);
    });

    it('accepts an empty string', () => {
      expect(searchingCommand.schema.safeParse({ text: '' }).success).toBe(true);
    });

    it('rejects when text is missing', () => {
      expect(searchingCommand.schema.safeParse({}).success).toBe(false);
    });

    it('rejects when text is not a string', () => {
      expect(searchingCommand.schema.safeParse({ text: 123 }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(searchingCommand.schema.safeParse({ text: 'Alpha', extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('calls component.searchByText(text) exactly once', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'searchByText');
      const callbacks = createCallbacks();

      const result = await searchingCommand.execute(instance, callbacks)({ text: 'Alpha' });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('Alpha');
      expect(result.status).toBe('success');
    });

    it('returns failure when searchByText throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'searchByText').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await searchingCommand.execute(instance, callbacks)({ text: 'Alpha' });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses `Search for "[text]".` for non-empty text', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await searchingCommand.execute(instance, callbacks)({ text: 'Alpha' });

      expect(callbacks.success).toHaveBeenCalledWith('Search for "Alpha".');
    });

    it('uses `Clear search.` for empty text', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await searchingCommand.execute(instance, callbacks)({ text: '' });

      expect(callbacks.success).toHaveBeenCalledWith('Clear search.');
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'searchByText').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      await searchingCommand.execute(instance, callbacks)({ text: 'Alpha' });

      expect(callbacks.failure).toHaveBeenCalledWith('Search for "Alpha".');
    });
  });
});
