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
  pageIndexCommand,
  pageSizeCommand,
  pagingCommand,
} from '../paging';

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
      { id: 4, name: 'Delta' },
      { id: 5, name: 'Epsilon' },
    ],
    columns: [
      { dataField: 'id', dataType: 'number' },
      { dataField: 'name', dataType: 'string' },
    ],
    ...options,
  } as unknown as Properties);
  return instance as unknown as InternalGrid;
};

describe('pagingCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it.each([
      [true],
      [false],
    ])('accepts valid args with enabled "%s"', (enabled) => {
      expect(pagingCommand.schema.safeParse({ enabled }).success).toBe(true);
    });

    it('rejects when enabled is missing', () => {
      expect(pagingCommand.schema.safeParse({}).success).toBe(false);
    });

    it('rejects when enabled is not a boolean', () => {
      expect(pagingCommand.schema.safeParse({ enabled: 'true' }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(pagingCommand.schema.safeParse({ enabled: true, extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it.each([
      [true],
      [false],
    ])('calls component.option("paging.enabled", %s) and returns success', async (enabled) => {
      const instance = await createGrid({ paging: { enabled: !enabled } });
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await pagingCommand.execute(instance, callbacks)({ enabled });

      expect(spy).toHaveBeenCalledWith('paging.enabled', enabled);
      expect(result.status).toBe('success');
    });

    it('returns failure when option throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'option').mockImplementationOnce(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await pagingCommand.execute(instance, callbacks)({ enabled: true });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses `Turn on pagination.` for enabled true', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await pagingCommand.execute(instance, callbacks)({ enabled: true });

      expect(callbacks.success).toHaveBeenCalledWith('Turn on pagination.');
    });

    it('uses `Turn off pagination.` for enabled false', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await pagingCommand.execute(instance, callbacks)({ enabled: false });

      expect(callbacks.success).toHaveBeenCalledWith('Turn off pagination.');
    });
  });
});

describe('pageSizeCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it.each([
      [0],
      [1],
      [50],
    ])('accepts valid args with pageSize "%s"', (pageSize) => {
      expect(pageSizeCommand.schema.safeParse({ pageSize }).success).toBe(true);
    });

    it('rejects when pageSize is missing', () => {
      expect(pageSizeCommand.schema.safeParse({}).success).toBe(false);
    });

    it('rejects when pageSize is negative', () => {
      expect(pageSizeCommand.schema.safeParse({ pageSize: -1 }).success).toBe(false);
    });

    it('rejects when pageSize is not an integer', () => {
      expect(pageSizeCommand.schema.safeParse({ pageSize: 1.5 }).success).toBe(false);
    });

    it('rejects when pageSize is not a number', () => {
      expect(pageSizeCommand.schema.safeParse({ pageSize: '5' }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(pageSizeCommand.schema.safeParse({ pageSize: 5, extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure and skips pageSize when paging.enabled is false', async () => {
      const instance = await createGrid({ paging: { enabled: false } });
      const spy = jest.spyOn(instance, 'pageSize');
      const callbacks = createCallbacks();

      const result = await pageSizeCommand.execute(instance, callbacks)({ pageSize: 5 });

      expect(result.status).toBe('failure');
      expect(callbacks.success).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('calls component.pageSize(value) exactly once', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'pageSize');
      const callbacks = createCallbacks();

      const result = await pageSizeCommand.execute(instance, callbacks)({ pageSize: 2 });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(2);
      expect(result.status).toBe('success');
    });

    it('returns failure when pageSize throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'pageSize').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await pageSizeCommand.execute(instance, callbacks)({ pageSize: 2 });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses `Display all rows.` for pageSize 0', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await pageSizeCommand.execute(instance, callbacks)({ pageSize: 0 });

      expect(callbacks.success).toHaveBeenCalledWith('Display all rows.');
    });

    it('uses `Change page size to [size].` for pageSize > 0', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await pageSizeCommand.execute(instance, callbacks)({ pageSize: 10 });

      expect(callbacks.success).toHaveBeenCalledWith('Change page size to 10.');
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid({ paging: { enabled: false } });
      const callbacks = createCallbacks();

      await pageSizeCommand.execute(instance, callbacks)({ pageSize: 10 });

      expect(callbacks.failure).toHaveBeenCalledWith('Change page size to 10.');
    });
  });
});

describe('pageIndexCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it.each([
      [0],
      [1],
      [42],
    ])('accepts valid args with pageIndex "%s"', (pageIndex) => {
      expect(pageIndexCommand.schema.safeParse({ pageIndex }).success).toBe(true);
    });

    it('rejects when pageIndex is missing', () => {
      expect(pageIndexCommand.schema.safeParse({}).success).toBe(false);
    });

    it('rejects when pageIndex is negative', () => {
      expect(pageIndexCommand.schema.safeParse({ pageIndex: -1 }).success).toBe(false);
    });

    it('rejects when pageIndex is not an integer', () => {
      expect(pageIndexCommand.schema.safeParse({ pageIndex: 1.5 }).success).toBe(false);
    });

    it('rejects when pageIndex is not a number', () => {
      expect(pageIndexCommand.schema.safeParse({ pageIndex: '0' }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(pageIndexCommand.schema.safeParse({ pageIndex: 0, extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure and skips pageIndex when paging.enabled is false', async () => {
      const instance = await createGrid({ paging: { enabled: false } });
      const spy = jest.spyOn(instance, 'pageIndex');
      const callbacks = createCallbacks();

      const result = await pageIndexCommand.execute(instance, callbacks)({ pageIndex: 0 });

      expect(result.status).toBe('failure');
      expect(callbacks.success).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('returns failure and skips pageIndex when pageIndex is out of bounds', async () => {
      const instance = await createGrid({ paging: { enabled: true, pageSize: 2 } });
      const spy = jest.spyOn(instance, 'pageIndex');
      const callbacks = createCallbacks();

      const result = await pageIndexCommand.execute(instance, callbacks)({ pageIndex: 99 });

      expect(result.status).toBe('failure');
      expect(callbacks.success).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('calls component.pageIndex(value) exactly once', async () => {
      const instance = await createGrid({ paging: { enabled: true, pageSize: 2 } });
      const spy = jest.spyOn(instance, 'pageIndex')
        .mockReturnValue(Promise.resolve());
      const callbacks = createCallbacks();

      const result = await pageIndexCommand.execute(instance, callbacks)({ pageIndex: 1 });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result.status).toBe('success');
    });

    it('returns failure when pageIndex throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'pageIndex').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await pageIndexCommand.execute(instance, callbacks)({ pageIndex: 0 });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses `Switch the view to page number [number].`', async () => {
      const instance = await createGrid({ paging: { enabled: true, pageSize: 2 } });
      jest.spyOn(instance, 'pageIndex').mockReturnValue(Promise.resolve());
      const callbacks = createCallbacks();

      await pageIndexCommand.execute(instance, callbacks)({ pageIndex: 1 });

      expect(callbacks.success).toHaveBeenCalledWith('Switch the view to page number 2.');
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid({ paging: { enabled: false } });
      const callbacks = createCallbacks();

      await pageIndexCommand.execute(instance, callbacks)({ pageIndex: 2 });

      expect(callbacks.failure).toHaveBeenCalledWith('Switch the view to page number 3.');
    });
  });
});
