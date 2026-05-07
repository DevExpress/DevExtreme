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
import { focusRowByIndexCommand, focusRowByKeyCommand } from '../focus';

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
    focusedRowEnabled: true,
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

describe('focusRowByKeyCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it.each([
      [0],
      [42],
      ['some-id'],
      [''],
    ])('accepts a primitive key %p', (key) => {
      expect(focusRowByKeyCommand.schema.safeParse({ key }).success).toBe(true);
    });

    it('accepts an object key with string/number values', () => {
      expect(focusRowByKeyCommand.schema.safeParse({ key: { a: 1, b: 'two' } }).success).toBe(true);
    });

    it('rejects when key is missing', () => {
      expect(focusRowByKeyCommand.schema.safeParse({}).success).toBe(false);
    });

    it.each([
      [true],
      [null],
      [{ a: true }],
      [{ a: null }],
    ])('rejects unsupported key value %p', (key) => {
      expect(focusRowByKeyCommand.schema.safeParse({ key }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(focusRowByKeyCommand.schema.safeParse({ key: 1, extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure and skips action when focusedRowEnabled is false', async () => {
      const instance = await createGrid({ focusedRowEnabled: false });
      const focusController = instance.getController('focus');
      const focusSpy = jest.spyOn(focusController, 'handleFocusedRowKeyChange');
      const callbacks = createCallbacks();

      const result = await focusRowByKeyCommand.execute(instance, callbacks)({ key: 2 });

      expect(result.status).toBe('failure');
      expect(callbacks.success).not.toHaveBeenCalled();
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('returns failure when an object key is passed for a single-field keyExpr', async () => {
      const instance = await createGrid();
      const focusController = instance.getController('focus');
      const focusSpy = jest.spyOn(focusController, 'handleFocusedRowKeyChange');
      const callbacks = createCallbacks();

      const result = await focusRowByKeyCommand.execute(instance, callbacks)({ key: { id: 2 } });

      expect(result.status).toBe('failure');
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('returns failure when a primitive key is passed for a composite keyExpr', async () => {
      const instance = await createCompositeGrid();
      const focusController = instance.getController('focus');
      const focusSpy = jest.spyOn(focusController, 'handleFocusedRowKeyChange');
      const callbacks = createCallbacks();

      const result = await focusRowByKeyCommand.execute(instance, callbacks)({ key: 1 });

      expect(result.status).toBe('failure');
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('returns failure when a composite key is missing one of the keyExpr fields', async () => {
      const instance = await createCompositeGrid();
      const focusController = instance.getController('focus');
      const focusSpy = jest.spyOn(focusController, 'handleFocusedRowKeyChange');
      const callbacks = createCallbacks();

      const result = await focusRowByKeyCommand.execute(instance, callbacks)({ key: { a: 1 } });

      expect(result.status).toBe('failure');
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('returns failure when the grid has no resolvable row key (keyExpr and store key both unset)', async () => {
      const instance = await createGrid();
      // Simulate a grid that exposes neither a keyExpr option nor a store key.
      const realOption = instance.option.bind(instance);
      jest.spyOn(instance, 'option').mockImplementation(((...callArgs: unknown[]): unknown => {
        if (callArgs.length === 1 && callArgs[0] === 'keyExpr') {
          return undefined;
        }
        return (realOption as (...a: unknown[]) => unknown)(...callArgs);
      }) as never);
      const dataSource = instance.getDataSource();
      jest.spyOn(dataSource.store(), 'key').mockReturnValue(undefined as never);
      const focusController = instance.getController('focus');
      const focusSpy = jest.spyOn(focusController, 'handleFocusedRowKeyChange');
      const callbacks = createCallbacks();

      const result = await focusRowByKeyCommand.execute(instance, callbacks)({ key: 1 });

      expect(result.status).toBe('failure');
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('delegates to focusController.handleFocusedRowKeyChange with a primitive key', async () => {
      const instance = await createGrid();
      const focusController = instance.getController('focus');
      const focusSpy = jest.spyOn(focusController, 'handleFocusedRowKeyChange')
        .mockReturnValue(Promise.resolve(0) as never);
      const callbacks = createCallbacks();

      const result = await focusRowByKeyCommand.execute(instance, callbacks)({ key: 2 });

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(focusSpy).toHaveBeenCalledWith(2);
      expect(result.status).toBe('success');
    });

    it('delegates to focusController.handleFocusedRowKeyChange with a composite key', async () => {
      const instance = await createCompositeGrid();
      const focusController = instance.getController('focus');
      const focusSpy = jest.spyOn(focusController, 'handleFocusedRowKeyChange')
        .mockReturnValue(Promise.resolve(0) as never);
      const callbacks = createCallbacks();

      const result = await focusRowByKeyCommand.execute(instance, callbacks)({
        key: { a: 1, b: 10 },
      });

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(focusSpy).toHaveBeenCalledWith({ a: 1, b: 10 });
      expect(result.status).toBe('success');
    });

    it('returns failure when handleFocusedRowKeyChange throws', async () => {
      const instance = await createGrid();
      const focusController = instance.getController('focus');
      jest.spyOn(focusController, 'handleFocusedRowKeyChange').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await focusRowByKeyCommand.execute(instance, callbacks)({ key: 2 });

      expect(result.status).toBe('failure');
    });

    it('returns failure when handleFocusedRowKeyChange rejects', async () => {
      const instance = await createGrid();
      const focusController = instance.getController('focus');
      jest.spyOn(focusController, 'handleFocusedRowKeyChange')
        .mockReturnValue(Promise.reject(new Error('Error')) as never);
      const callbacks = createCallbacks();

      const result = await focusRowByKeyCommand.execute(instance, callbacks)({ key: 2 });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses the literal `Focus row.` on success', async () => {
      const instance = await createGrid();
      const focusController = instance.getController('focus');
      jest.spyOn(focusController, 'handleFocusedRowKeyChange')
        .mockReturnValue(Promise.resolve(0) as never);
      const callbacks = createCallbacks();

      await focusRowByKeyCommand.execute(instance, callbacks)({ key: 2 });

      expect(callbacks.success).toHaveBeenCalledWith('Focus row.');
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid({ focusedRowEnabled: false });
      const callbacks = createCallbacks();

      await focusRowByKeyCommand.execute(instance, callbacks)({ key: 7 });

      expect(callbacks.failure).toHaveBeenCalledWith('Focus row.');
    });
  });
});

describe('focusRowByIndexCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it.each([
      [0],
      [1],
      [42],
    ])('accepts a non-negative integer index "%s"', (index) => {
      expect(focusRowByIndexCommand.schema.safeParse({ index }).success).toBe(true);
    });

    it('rejects when index is missing', () => {
      expect(focusRowByIndexCommand.schema.safeParse({}).success).toBe(false);
    });

    it('rejects when index is negative', () => {
      expect(focusRowByIndexCommand.schema.safeParse({ index: -1 }).success).toBe(false);
    });

    it('rejects when index is not an integer', () => {
      expect(focusRowByIndexCommand.schema.safeParse({ index: 1.5 }).success).toBe(false);
    });

    it('rejects when index is not a number', () => {
      expect(focusRowByIndexCommand.schema.safeParse({ index: '0' }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(focusRowByIndexCommand.schema.safeParse({ index: 0, extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure and skips action when focusedRowEnabled is false', async () => {
      const instance = await createGrid({ focusedRowEnabled: false });
      const focusController = instance.getController('focus');
      const focusSpy = jest.spyOn(focusController, 'handleFocusedRowKeyChange');
      const callbacks = createCallbacks();

      const result = await focusRowByIndexCommand.execute(instance, callbacks)({ index: 1 });

      expect(result.status).toBe('failure');
      expect(callbacks.success).not.toHaveBeenCalled();
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('returns failure when the index has no row on the current page', async () => {
      const instance = await createGrid();
      const focusController = instance.getController('focus');
      const focusSpy = jest.spyOn(focusController, 'handleFocusedRowKeyChange');
      const callbacks = createCallbacks();

      // Three rows in createGrid; index 99 is past the page's last row.
      const result = await focusRowByIndexCommand.execute(instance, callbacks)({ index: 99 });

      expect(result.status).toBe('failure');
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('delegates to handleFocusedRowKeyChange with the key resolved from the index', async () => {
      const instance = await createGrid();
      const focusController = instance.getController('focus');
      const focusSpy = jest.spyOn(focusController, 'handleFocusedRowKeyChange')
        .mockReturnValue(Promise.resolve(0) as never);
      const callbacks = createCallbacks();

      // createGrid rows: id=1, id=2, id=3 with keyExpr='id' → index 1 → key 2.
      const result = await focusRowByIndexCommand.execute(instance, callbacks)({ index: 1 });

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(focusSpy).toHaveBeenCalledWith(2);
      expect(result.status).toBe('success');
    });

    it('returns failure when handleFocusedRowKeyChange throws', async () => {
      const instance = await createGrid();
      const focusController = instance.getController('focus');
      jest.spyOn(focusController, 'handleFocusedRowKeyChange').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await focusRowByIndexCommand.execute(instance, callbacks)({ index: 1 });

      expect(result.status).toBe('failure');
    });

    it('returns failure when handleFocusedRowKeyChange rejects', async () => {
      const instance = await createGrid();
      const focusController = instance.getController('focus');
      jest.spyOn(focusController, 'handleFocusedRowKeyChange')
        .mockReturnValue(Promise.reject(new Error('Error')) as never);
      const callbacks = createCallbacks();

      const result = await focusRowByIndexCommand.execute(instance, callbacks)({ index: 1 });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses the literal `Focus row.` on success', async () => {
      const instance = await createGrid();
      const focusController = instance.getController('focus');
      jest.spyOn(focusController, 'handleFocusedRowKeyChange')
        .mockReturnValue(Promise.resolve(0) as never);
      const callbacks = createCallbacks();

      await focusRowByIndexCommand.execute(instance, callbacks)({ index: 1 });

      expect(callbacks.success).toHaveBeenCalledWith('Focus row.');
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid({ focusedRowEnabled: false });
      const callbacks = createCallbacks();

      await focusRowByIndexCommand.execute(instance, callbacks)({ index: 1 });

      expect(callbacks.failure).toHaveBeenCalledWith('Focus row.');
    });
  });
});
