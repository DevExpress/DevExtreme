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

// The id lives on the wrapper; expr is the discriminated variant.
const basicNode = (
  id: string,
  field: string,
  operator: string,
  value: unknown,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => ({
  id,
  expr: {
    type: 'basic', field, operator, value,
  },
});

const combinedNode = (
  id: string,
  combiner: string,
  leftId: string,
  rightId: string,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => ({
  id,
  expr: {
    type: 'combined', combiner, leftId, rightId,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const negatedNode = (id: string, expressionId: string): any => ({
  id,
  expr: { type: 'negated', expressionId },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tree = (rootId: string, nodes: unknown[]): any => ({ rootId, nodes });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const singleBasic = (field: string, operator: string, value: unknown): any => tree('n1', [
  basicNode('n1', field, operator, value),
]);

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
    it('accepts a basic expression', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: singleBasic('name', '=', 'Alpha'),
      }).success).toBe(true);
    });

    it.each([
      ['='], ['<>'], ['<'], ['<='], ['>'], ['>='],
      ['contains'], ['notcontains'], ['startswith'], ['endswith'],
    ])('accepts op "%s"', (op) => {
      expect(filterValueCommand.schema.safeParse({
        expression: singleBasic('name', op, 'Alpha'),
      }).success).toBe(true);
    });

    it.each([
      [singleBasic('name', '=', 'Alpha')],
      [singleBasic('name', '=', 1)],
      [singleBasic('name', '=', true)],
      [singleBasic('name', '=', null)],
    ])('accepts scalar value %p', (expression) => {
      expect(filterValueCommand.schema.safeParse({ expression }).success).toBe(true);
    });

    it('accepts a combined expression with "and"', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: tree('n3', [
          basicNode('n1', 'name', '=', 'Alpha'),
          basicNode('n2', 'age', '>', 10),
          combinedNode('n3', 'and', 'n1', 'n2'),
        ]),
      }).success).toBe(true);
    });

    it('accepts a combined expression with "or"', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: tree('n3', [
          basicNode('n1', 'name', '=', 'Alpha'),
          basicNode('n2', 'name', '=', 'Beta'),
          combinedNode('n3', 'or', 'n1', 'n2'),
        ]),
      }).success).toBe(true);
    });

    it('accepts a negated expression', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: tree('n2', [
          basicNode('n1', 'name', '=', 'Alpha'),
          negatedNode('n2', 'n1'),
        ]),
      }).success).toBe(true);
    });

    it('accepts deeply nested expressions', () => {
      // !(name = "Alpha") AND (age > 10 OR age < 30)
      expect(filterValueCommand.schema.safeParse({
        expression: tree('n7', [
          basicNode('n1', 'name', '=', 'Alpha'),
          negatedNode('n2', 'n1'),
          basicNode('n3', 'age', '>', 10),
          basicNode('n4', 'age', '<', 30),
          combinedNode('n5', 'or', 'n3', 'n4'),
          combinedNode('n7', 'and', 'n2', 'n5'),
        ]),
      }).success).toBe(true);
    });

    it('accepts null expression', () => {
      expect(filterValueCommand.schema.safeParse({ expression: null }).success).toBe(true);
    });

    it('rejects when expression is missing', () => {
      expect(filterValueCommand.schema.safeParse({}).success).toBe(false);
    });

    it('rejects an empty nodes array', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: tree('n1', []),
      }).success).toBe(false);
    });

    it('rejects an unknown op', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: singleBasic('name', 'like', 'Alpha'),
      }).success).toBe(false);
    });

    it('rejects an unknown combiner', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: tree('n3', [
          basicNode('n1', 'name', '=', 'Alpha'),
          basicNode('n2', 'age', '>', 10),
          combinedNode('n3', 'xor', 'n1', 'n2'),
        ]),
      }).success).toBe(false);
    });

    it('rejects unknown properties inside expr', () => {
      const n = basicNode('n1', 'name', '=', 'Alpha');
      n.expr.extra = 1;
      expect(filterValueCommand.schema.safeParse({
        expression: tree('n1', [n]),
      }).success).toBe(false);
    });

    it('rejects an object value (non-scalar)', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: singleBasic('name', '=', { foo: 1 }),
      }).success).toBe(false);
    });

    it('rejects unknown properties on the tree', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: { ...singleBasic('name', '=', 'Alpha'), extra: 1 },
      }).success).toBe(false);
    });

    it('rejects unknown properties on a node', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: tree('n1', [
          { ...basicNode('n1', 'name', '=', 'Alpha'), extra: 1 },
        ]),
      }).success).toBe(false);
    });

    it('rejects unknown properties on the args object', () => {
      expect(filterValueCommand.schema.safeParse({
        expression: singleBasic('name', '=', 'Alpha'),
        extra: 1,
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('calls component.option("filterValue", expression) with array format', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: singleBasic('name', '=', 'Alpha'),
      });

      expect(spy).toHaveBeenCalledWith('filterValue', ['name', '=', 'Alpha']);
      expect(result.status).toBe('success');
    });

    it('converts a combined node into the legacy array form', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: tree('n3', [
          basicNode('n1', 'name', '=', 'Alpha'),
          basicNode('n2', 'age', '>', 10),
          combinedNode('n3', 'and', 'n1', 'n2'),
        ]),
      });

      expect(spy).toHaveBeenCalledWith('filterValue', [
        ['name', '=', 'Alpha'],
        'and',
        ['age', '>', 10],
      ]);
      expect(result.status).toBe('success');
    });

    it('converts a negated node into the legacy array form', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: tree('n2', [
          basicNode('n1', 'name', '=', 'Alpha'),
          negatedNode('n2', 'n1'),
        ]),
      });

      expect(spy).toHaveBeenCalledWith('filterValue', ['!', ['name', '=', 'Alpha']]);
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
        expression: singleBasic('name', '=', 'Alpha'),
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('converter', () => {
    it('returns failure on duplicate node id', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: tree('n1', [
          basicNode('n1', 'name', '=', 'Alpha'),
          basicNode('n1', 'age', '>', 10),
        ]),
      });

      expect(spy).not.toHaveBeenCalled();
      expect(result.status).toBe('failure');
    });

    it('returns failure when rootId is not in nodes', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: tree('nMissing', [
          basicNode('n1', 'name', '=', 'Alpha'),
        ]),
      });

      expect(spy).not.toHaveBeenCalled();
      expect(result.status).toBe('failure');
    });

    it('returns failure when combined references a missing id', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: tree('n2', [
          basicNode('n1', 'name', '=', 'Alpha'),
          combinedNode('n2', 'and', 'n1', 'nGhost'),
        ]),
      });

      expect(spy).not.toHaveBeenCalled();
      expect(result.status).toBe('failure');
    });

    it('returns failure when negated references a missing id', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: tree('n1', [
          negatedNode('n1', 'nGhost'),
        ]),
      });

      expect(spy).not.toHaveBeenCalled();
      expect(result.status).toBe('failure');
    });

    it('returns failure on a cycle', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: tree('n1', [
          negatedNode('n1', 'n2'),
          negatedNode('n2', 'n1'),
        ]),
      });

      expect(spy).not.toHaveBeenCalled();
      expect(result.status).toBe('failure');
    });

    it('tolerates unreachable extra nodes', async () => {
      const instance = await createGrid();
      const spy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await filterValueCommand.execute(instance, callbacks)({
        expression: tree('n1', [
          basicNode('n1', 'name', '=', 'Alpha'),
          basicNode('nOrphan', 'age', '>', 10),
        ]),
      });

      expect(spy).toHaveBeenCalledWith('filterValue', ['name', '=', 'Alpha']);
      expect(result.status).toBe('success');
    });
  });

  describe('default message', () => {
    it('uses `Apply a filter.` when expression is set', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await filterValueCommand.execute(instance, callbacks)({
        expression: singleBasic('name', '=', 'Alpha'),
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
        expression: singleBasic('name', '=', 'Alpha'),
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
