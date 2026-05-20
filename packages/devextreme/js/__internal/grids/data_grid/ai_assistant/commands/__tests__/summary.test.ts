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

import { clearSummaryCommand, summaryCommand } from '../summary';

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
      { id: 1, name: 'Alpha', amount: 10 },
      { id: 2, name: 'Beta', amount: 20 },
    ],
    columns: [
      { dataField: 'id', dataType: 'number' },
      { dataField: 'name', dataType: 'string' },
      { dataField: 'amount', caption: 'Amount', dataType: 'number' },
    ],
    ...options,
  } as unknown as Properties);
  return instance as unknown as InternalGrid;
};

describe('summaryCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it.each([
      ['sum'],
      ['min'],
      ['max'],
      ['avg'],
      ['count'],
    ])('accepts summaryType "%s"', (summaryType) => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ column: 'amount', summaryType }],
        groupItems: [],
      }).success).toBe(true);
    });

    it('accepts both totalItems and groupItems', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ column: 'amount', summaryType: 'sum' }],
        groupItems: [{ column: 'amount', summaryType: 'avg' }],
      }).success).toBe(true);
    });

    it('rejects empty object (totalItems and groupItems are required)', () => {
      expect(summaryCommand.schema.safeParse({}).success).toBe(false);
    });

    it('rejects when totalItems is omitted', () => {
      expect(summaryCommand.schema.safeParse({
        groupItems: [{ column: 'amount', summaryType: 'avg' }],
      }).success).toBe(false);
    });

    it('rejects when groupItems is omitted', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ column: 'amount', summaryType: 'sum' }],
      }).success).toBe(false);
    });

    it('rejects an unknown summaryType (including "custom")', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ column: 'amount', summaryType: 'custom' }],
        groupItems: [],
      }).success).toBe(false);
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ column: 'amount', summaryType: 'median' }],
        groupItems: [],
      }).success).toBe(false);
    });

    it('rejects when an item is missing column', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ summaryType: 'sum' }],
        groupItems: [],
      }).success).toBe(false);
    });

    it('rejects when an item is missing summaryType', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ column: 'amount' }],
        groupItems: [],
      }).success).toBe(false);
    });

    it('rejects unknown properties on the root', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ column: 'amount', summaryType: 'sum' }],
        groupItems: [],
        extra: 1,
      }).success).toBe(false);
    });

    it('rejects unknown properties on the item', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ column: 'amount', summaryType: 'sum', extra: 1 }],
        groupItems: [],
      }).success).toBe(false);
    });

    it('accepts showInColumn and displayFormat on totalItems', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{
          column: 'amount',
          summaryType: 'sum',
          showInColumn: 'name',
          displayFormat: 'Sum: {0}',
        }],
        groupItems: [],
      }).success).toBe(true);
    });

    it('accepts showInColumn, displayFormat, showInGroupFooter, alignByColumn on groupItems', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [],
        groupItems: [{
          column: 'amount',
          summaryType: 'avg',
          showInColumn: 'name',
          displayFormat: '{1}: {0}',
          showInGroupFooter: true,
          alignByColumn: true,
        }],
      }).success).toBe(true);
    });

    it('rejects showInGroupFooter on totalItems (group-only field)', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{
          column: 'amount',
          summaryType: 'sum',
          showInGroupFooter: true,
        }],
        groupItems: [],
      }).success).toBe(false);
    });

    it('rejects alignByColumn on totalItems (group-only field)', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{
          column: 'amount',
          summaryType: 'sum',
          alignByColumn: true,
        }],
        groupItems: [],
      }).success).toBe(false);
    });

    it('rejects when showInColumn is not a string', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ column: 'amount', summaryType: 'sum', showInColumn: 1 }],
        groupItems: [],
      }).success).toBe(false);
    });

    it('rejects when displayFormat is not a string', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [{ column: 'amount', summaryType: 'sum', displayFormat: 5 }],
        groupItems: [],
      }).success).toBe(false);
    });

    it('rejects when showInGroupFooter is not a boolean', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [],
        groupItems: [{ column: 'amount', summaryType: 'sum', showInGroupFooter: 'yes' }],
      }).success).toBe(false);
    });

    it('rejects when alignByColumn is not a boolean', () => {
      expect(summaryCommand.schema.safeParse({
        totalItems: [],
        groupItems: [{ column: 'amount', summaryType: 'sum', alignByColumn: 1 }],
      }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('returns failure when both arrays are empty', async () => {
      const instance = await createGrid();
      const optionSpy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await summaryCommand.execute(instance, callbacks)({
        totalItems: [],
        groupItems: [],
      });

      expect(result.status).toBe('failure');
      expect(optionSpy).not.toHaveBeenCalledWith('summary', expect.anything());
    });

    it('returns failure when any totalItems column does not resolve', async () => {
      const instance = await createGrid();
      const optionSpy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await summaryCommand.execute(instance, callbacks)({
        totalItems: [
          { column: 'amount', summaryType: 'sum' },
          { column: 'unknown', summaryType: 'avg' },
        ],
        groupItems: [],
      });

      expect(result.status).toBe('failure');
      expect(optionSpy).not.toHaveBeenCalledWith('summary', expect.anything());
    });

    it('returns failure when any groupItems column does not resolve', async () => {
      const instance = await createGrid();
      const optionSpy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await summaryCommand.execute(instance, callbacks)({
        totalItems: [],
        groupItems: [{ column: 'unknown', summaryType: 'sum' }],
      });

      expect(result.status).toBe('failure');
      expect(optionSpy).not.toHaveBeenCalledWith('summary', expect.anything());
    });

    it('returns failure when showInColumn does not resolve to an existing column', async () => {
      const instance = await createGrid();
      const optionSpy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await summaryCommand.execute(instance, callbacks)({
        totalItems: [{
          column: 'amount',
          summaryType: 'sum',
          showInColumn: 'unknown',
        }],
        groupItems: [],
      });

      expect(result.status).toBe('failure');
      expect(optionSpy).not.toHaveBeenCalledWith('summary', expect.anything());
    });

    it('calls component.option("summary", { totalItems, groupItems }) on success', async () => {
      const instance = await createGrid();
      const optionSpy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await summaryCommand.execute(instance, callbacks)({
        totalItems: [{ column: 'amount', summaryType: 'sum' }],
        groupItems: [{ column: 'amount', summaryType: 'avg' }],
      });

      expect(optionSpy).toHaveBeenCalledWith('summary', {
        totalItems: [{ column: 'amount', summaryType: 'sum' }],
        groupItems: [{ column: 'amount', summaryType: 'avg' }],
      });
      expect(result.status).toBe('success');
    });

    it('returns failure when option throws', async () => {
      const instance = await createGrid();
      const realOption = instance.option.bind(instance);
      jest.spyOn(instance, 'option').mockImplementation(((...callArgs: unknown[]): unknown => {
        if (callArgs[0] === 'summary' && callArgs.length === 2) {
          throw new Error('Error');
        }
        return (realOption as (...a: unknown[]) => unknown)(...callArgs);
      }) as never);
      const callbacks = createCallbacks();

      const result = await summaryCommand.execute(instance, callbacks)({
        totalItems: [{ column: 'amount', summaryType: 'sum' }],
        groupItems: [],
      });

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('renders one-item totalItems with caption and (total) location', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await summaryCommand.execute(instance, callbacks)({
        totalItems: [{ column: 'amount', summaryType: 'sum' }],
        groupItems: [],
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Display data summaries: "Amount" sum (total).',
      );
    });

    it('renders one-item groupItems with (group) location and human-readable type label', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await summaryCommand.execute(instance, callbacks)({
        totalItems: [],
        groupItems: [{ column: 'amount', summaryType: 'avg' }],
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Display data summaries: "Amount" average (group).',
      );
    });

    it.each([
      ['min', 'minimum'],
      ['max', 'maximum'],
      ['avg', 'average'],
      ['sum', 'sum'],
      ['count', 'count'],
    ])('expands summaryType "%s" to "%s" in the message', async (summaryType, label) => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await summaryCommand.execute(instance, callbacks)({
        totalItems: [{ column: 'amount', summaryType: summaryType as 'sum' | 'min' | 'max' | 'avg' | 'count' }],
        groupItems: [],
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        `Display data summaries: "Amount" ${label} (total).`,
      );
    });

    it('falls back to the auto-derived caption when no explicit caption is set', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await summaryCommand.execute(instance, callbacks)({
        totalItems: [{ column: 'name', summaryType: 'count' }],
        groupItems: [],
      });

      // 'name' has no explicit caption — DevExtreme auto-derives "Name"
      expect(callbacks.success).toHaveBeenCalledWith(
        'Display data summaries: "Name" count (total).',
      );
    });

    it('renders multiple items in totalItems comma-separated', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await summaryCommand.execute(instance, callbacks)({
        totalItems: [
          { column: 'amount', summaryType: 'sum' },
          { column: 'amount', summaryType: 'avg' },
        ],
        groupItems: [],
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Display data summaries: "Amount" sum (total), "Amount" average (total).',
      );
    });

    it('renders items spanning both arrays with their respective locations', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await summaryCommand.execute(instance, callbacks)({
        totalItems: [{ column: 'amount', summaryType: 'min' }],
        groupItems: [{ column: 'amount', summaryType: 'avg' }],
      });

      expect(callbacks.success).toHaveBeenCalledWith(
        'Display data summaries: "Amount" minimum (total), "Amount" average (group).',
      );
    });

    it('degrades to "Display data summaries." when both arrays are empty', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await summaryCommand.execute(instance, callbacks)({
        totalItems: [],
        groupItems: [],
      });

      expect(callbacks.failure).toHaveBeenCalledWith('Display data summaries.');
    });

    it('passes the same default message to failure when executability fails', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      // Single item with unresolved column → failure path, item-list message
      await summaryCommand.execute(instance, callbacks)({
        totalItems: [{ column: 'unknown', summaryType: 'sum' }],
        groupItems: [],
      });

      expect(callbacks.failure).toHaveBeenCalledWith(
        'Display data summaries: "unknown" sum (total).',
      );
    });
  });
});

describe('clearSummaryCommand', () => {
  beforeEach(() => beforeTest());
  afterEach(() => afterTest());

  describe('schema', () => {
    it('accepts an empty object', () => {
      expect(clearSummaryCommand.schema.safeParse({}).success).toBe(true);
    });

    it('rejects unknown properties', () => {
      expect(clearSummaryCommand.schema.safeParse({ extra: 1 }).success).toBe(false);
    });
  });

  describe('execute', () => {
    it('calls component.option("summary", { groupItems: [], totalItems: [] }) on success', async () => {
      const instance = await createGrid();
      const optionSpy = jest.spyOn(instance, 'option');
      const callbacks = createCallbacks();

      const result = await clearSummaryCommand.execute(instance, callbacks)();

      expect(optionSpy).toHaveBeenCalledWith('summary', {
        groupItems: [],
        totalItems: [],
      });
      expect(result.status).toBe('success');
    });

    it('returns failure when option throws', async () => {
      const instance = await createGrid();
      const realOption = instance.option.bind(instance);
      jest.spyOn(instance, 'option').mockImplementation(((...callArgs: unknown[]): unknown => {
        if (callArgs[0] === 'summary' && callArgs.length === 2) {
          throw new Error('Error');
        }
        return (realOption as (...a: unknown[]) => unknown)(...callArgs);
      }) as never);
      const callbacks = createCallbacks();

      const result = await clearSummaryCommand.execute(instance, callbacks)();

      expect(result.status).toBe('failure');
    });
  });

  describe('default message', () => {
    it('uses literal `Clear column summaries.` on success', async () => {
      const instance = await createGrid();
      const callbacks = createCallbacks();

      await clearSummaryCommand.execute(instance, callbacks)();

      expect(callbacks.success).toHaveBeenCalledWith('Clear column summaries.');
    });

    it('passes the same default message to failure', async () => {
      const instance = await createGrid();
      const realOption = instance.option.bind(instance);
      jest.spyOn(instance, 'option').mockImplementation(((...callArgs: unknown[]): unknown => {
        if (callArgs[0] === 'summary' && callArgs.length === 2) {
          throw new Error('Error');
        }
        return (realOption as (...a: unknown[]) => unknown)(...callArgs);
      }) as never);
      const callbacks = createCallbacks();

      await clearSummaryCommand.execute(instance, callbacks)();

      expect(callbacks.failure).toHaveBeenCalledWith('Clear column summaries.');
    });
  });
});
