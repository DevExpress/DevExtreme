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
  clearFilterCommand,
  filterValueCommand,
} from '../filtering';

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

describe('filterValueCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts a basic [field, op, value] expression', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: ['name', '=', 'Alpha'],
      }).success).toBe(true);
    });

    it.each([
      ['='], ['<>'], ['<'], ['<='], ['>'], ['>='],
      ['contains'], ['notcontains'], ['startswith'], ['endswith'],
    ])('accepts op "%s"', (op) => {
      expect(filterValueCommand.schema.safeParse({
        expression: ['name', op, 'Alpha'],
      }).success).toBe(true);
    });

    it.each([
      [['name', '=', 'Alpha']],
      [['name', '=', 1]],
      [['name', '=', true]],
      [['name', '=', null]],
    ])('accepts scalar value %p', (expression) => {
      expect(filterValueCommand.schema.safeParse({ expression }).success).toBe(true);
    });

    it('accepts a combined [expr, "and", expr] expression', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: [['name', '=', 'Alpha'], 'and', ['age', '>', 10]],
      }).success).toBe(true);
    });

    it('accepts a combined [expr, "or", expr] expression', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: [['name', '=', 'Alpha'], 'or', ['name', '=', 'Beta']],
      }).success).toBe(true);
    });

    it('accepts a negated ["!", expr] expression', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: ['!', ['name', '=', 'Alpha']],
      }).success).toBe(true);
    });

    it('accepts deeply nested expressions', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: [
          ['!', ['name', '=', 'Alpha']],
          'and',
          [['age', '>', 10], 'or', ['age', '<', 30]],
        ],
      }).success).toBe(true);
    });

    it('accepts null expression', () => {
      expect(filterValueCommand.schema.safeParse({ expression: null }).success).toBe(true);
    });

    it('rejects when expression is missing', () => {
      expect(filterValueCommand.schema.safeParse({}).success).toBe(false);
    });

    it('rejects an unknown op', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: ['name', 'like', 'Alpha'],
      }).success).toBe(false);
    });

    it('rejects an unknown combiner', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: [['name', '=', 'Alpha'], 'xor', ['age', '>', 10]],
      }).success).toBe(false);
    });

    it('rejects an object value (non-scalar)', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: ['name', '=', { foo: 1 }],
      }).success).toBe(false);
    });

    it('rejects unknown properties', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: ['name', '=', 'Alpha'],
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('calls component.option("filterValue", expression) exactly once', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: ['name', '=', 'Alpha'],
      });

      expect(spy).toHaveBeenCalledWith('filterValue', ['name', '=', 'Alpha']);
      expect(result.status).toBe('success');
    });

    it('passes undefined when expression is null (clears the filter)', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: null,
      });

      expect(spy).toHaveBeenCalledWith('filterValue', undefined);
      expect(result.status).toBe('success');
    });

    it('returns failure when option throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'option').mockImplementationOnce(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: ['name', '=', 'Alpha'],
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses `Apply a filter.` when expression is set', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await filterValueCommand.execute(instance, callbacks)({
        expression: ['name', '=', 'Alpha'],
      });

      expect(callbacks.success).toHaveBeenCalledWith('Apply a filter.');
    });

    it('uses `Clear filter.` when expression is null', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await filterValueCommand.execute(instance, callbacks)({
        expression: null,
      });

      expect(callbacks.success).toHaveBeenCalledWith('Clear filter.');
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'option').mockImplementationOnce(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      await filterValueCommand.execute(instance, callbacks)({
        expression: ['name', '=', 'Alpha'],
      });

      expect(callbacks.failure).toHaveBeenCalledWith('Apply a filter.');
    });
  });
});

describe('clearFilterCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts an empty object', () => {
      expect(clearFilterCommand.schema.safeParse({}).success).toBe(true);
    });

    it('rejects unknown properties', () => {
      expect(clearFilterCommand.schema.safeParse({ extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('calls component.clearFilter() exactly once', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'clearFilter');
      const callbacks = createCallbacks();

      const result = await clearFilterCommand.execute(instance, callbacks)();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('success');
    });

    it('returns failure when clearFilter throws', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'clearFilter').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      const result = await clearFilterCommand.execute(instance, callbacks)();

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses the literal `Clear filter.`', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await clearFilterCommand.execute(instance, callbacks)();

      expect(callbacks.success).toHaveBeenCalledWith('Clear filter.');
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid();
      jest.spyOn(instance, 'clearFilter').mockImplementation(() => {
        throw new Error('Error');
      });
      const callbacks = createCallbacks();

      await clearFilterCommand.execute(instance, callbacks)();

      expect(callbacks.failure).toHaveBeenCalledWith('Clear filter.');
    });
  });
});
