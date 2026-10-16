import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import type { CustomSummaryInfo } from '@js/ui/data_grid';
import type dxDataGrid from '@js/ui/data_grid';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import errors from '@ts/ui/errors';

import type {
  Aggregate, CustomAggregator, SummaryOptions,
} from '../../types';
import type { GetSummaryOptionsArgs } from '../get_summary_options';
import { getSummaryOptions as getSummaryOptionsUtil } from '../get_summary_options';

const component = {} as dxDataGrid;

const makeColumn = (overrides: Partial<Column> = {}): Column => ({ ...overrides });

const createArgs = (overrides: Partial<GetSummaryOptionsArgs> = {}): GetSummaryOptionsArgs => ({
  summary: {},
  sortByGroupSummaryInfo: [],
  remoteOperations: {},
  getUpdatedItemData: (data) => data,
  columnOption: () => undefined,
  groupColumns: [],
  component,
  ...overrides,
});

const getSummaryOptions = (overrides: Partial<GetSummaryOptionsArgs> = {}): SummaryOptions => {
  const result = getSummaryOptionsUtil(createArgs(overrides));

  if (!result) {
    throw new Error('summary options are expected to be defined');
  }

  return result;
};

const callSelector = (aggregate: Aggregate, data: RawItemData): unknown => {
  const { selector } = aggregate;

  if (typeof selector !== 'function') {
    throw new Error('selector is expected to be a function');
  }

  return selector(data);
};

const getCustomAggregator = (aggregate: Aggregate): CustomAggregator => {
  const { aggregator } = aggregate;

  if (!aggregator || typeof aggregator === 'string') {
    throw new Error('aggregator is expected to be a custom aggregator');
  }

  return aggregator;
};

interface CustomSummaryCall {
  component: unknown;
  name?: string;
  summaryProcess?: string;
  groupIndex?: number;
  totalValue?: unknown;
  value?: unknown;
  hasValue: boolean;
}

interface CustomSummaryRecorder {
  calculateCustomSummary: (options: CustomSummaryInfo) => void;
  calls: CustomSummaryCall[];
}

const createCustomSummaryRecorder = (
  handler?: (options: CustomSummaryInfo) => void,
): CustomSummaryRecorder => {
  const calls: CustomSummaryCall[] = [];

  const calculateCustomSummary = (options: CustomSummaryInfo): void => {
    calls.push({
      component: options.component,
      name: options.name,
      summaryProcess: options.summaryProcess,
      groupIndex: options.groupIndex,
      totalValue: options.totalValue,
      value: options.value,
      hasValue: 'value' in options,
    });

    handler?.(options);
  };

  return { calculateCustomSummary, calls };
};

describe('getSummaryOptions', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('result', () => {
    it('should return undefined when there are no summary items', () => {
      expect(getSummaryOptionsUtil(createArgs())).toBeUndefined();
    });

    it('should return undefined when both item arrays are empty', () => {
      const args = createArgs({ summary: { groupItems: [], totalItems: [] } });

      expect(getSummaryOptionsUtil(args)).toBeUndefined();
    });

    it('should return options when there are only group items', () => {
      const options = getSummaryOptions({ summary: { groupItems: [{ summaryType: 'count' }] } });

      expect(options.groupAggregates).toHaveLength(1);
      expect(options.totalAggregates).toHaveLength(0);
      expect(typeof options.sortByGroups).toBe('function');
    });

    it('should return options when there are only total items', () => {
      const options = getSummaryOptions({ summary: { totalItems: [{ summaryType: 'count' }] } });

      expect(options.groupAggregates).toHaveLength(0);
      expect(options.totalAggregates).toHaveLength(1);
    });

    it('should keep the group and total item order', () => {
      const options = getSummaryOptions({
        summary: {
          groupItems: [
            { summaryType: 'min', column: 'a' },
            { summaryType: 'max', column: 'b' },
          ],
          totalItems: [
            { summaryType: 'sum', column: 'c' },
            { summaryType: 'count' },
          ],
        },
      });

      expect(options.groupAggregates.map((item) => item.aggregator)).toEqual(['min', 'max']);
      expect(options.totalAggregates.map((item) => item.aggregator)).toEqual(['sum', 'count']);
    });
  });

  describe('remote aggregates', () => {
    it('should use remote group aggregates when both grouping and summary are remote', () => {
      const options = getSummaryOptions({
        summary: { groupItems: [{ summaryType: 'sum', column: 'field' }] },
        remoteOperations: { grouping: true, summary: true },
      });

      expect(options.groupAggregates).toStrictEqual([{
        selector: 'field',
        summaryType: 'sum',
      }]);
    });

    it('should use local group aggregates when only summary is remote', () => {
      const options = getSummaryOptions({
        summary: { groupItems: [{ summaryType: 'sum', column: 'field' }] },
        remoteOperations: { summary: true },
      });

      expect(options.groupAggregates[0].aggregator).toBe('sum');
      expect(typeof options.groupAggregates[0].selector).toBe('function');
    });

    it('should use local group aggregates when only grouping is remote', () => {
      const options = getSummaryOptions({
        summary: { groupItems: [{ summaryType: 'sum', column: 'field' }] },
        remoteOperations: { grouping: true },
      });

      expect(options.groupAggregates[0].aggregator).toBe('sum');
      expect(typeof options.groupAggregates[0].selector).toBe('function');
    });

    it('should use remote total aggregates when summary is remote', () => {
      const options = getSummaryOptions({
        summary: { totalItems: [{ summaryType: 'avg', column: 'field' }] },
        remoteOperations: { summary: true },
      });

      expect(options.totalAggregates).toStrictEqual([{
        selector: 'field',
        summaryType: 'avg',
      }]);
    });

    it('should not use remote total aggregates when only grouping is remote', () => {
      const options = getSummaryOptions({
        summary: { totalItems: [{ summaryType: 'avg', column: 'field' }] },
        remoteOperations: { grouping: true },
      });

      expect(options.totalAggregates[0].aggregator).toBe('avg');
      expect(typeof options.totalAggregates[0].selector).toBe('function');
    });

    it('should use the count summary type by default', () => {
      const options = getSummaryOptions({
        summary: { totalItems: [{}] },
        remoteOperations: { summary: true },
      });

      expect(options.totalAggregates).toStrictEqual([{
        selector: undefined,
        summaryType: 'count',
      }]);
    });
  });

  describe('aggregator', () => {
    it('should use the count aggregator by default', () => {
      const options = getSummaryOptions({ summary: { totalItems: [{}] } });

      expect(options.totalAggregates[0].aggregator).toBe('count');
    });

    it('should use the specified summary type as an aggregator', () => {
      const options = getSummaryOptions({ summary: { totalItems: [{ summaryType: 'min' }] } });

      expect(options.totalAggregates[0].aggregator).toBe('min');
    });
  });

  describe('selector', () => {
    it('should use calculateCellValue of the column bound to the column', () => {
      const column = makeColumn({
        dataField: 'field',
        calculateCellValue(this: Column, data: RawItemData): unknown {
          return [this.dataField, data.field];
        },
      });

      const options = getSummaryOptions({
        summary: { totalItems: [{ summaryType: 'min', column: 'field' }] },
        columnOption: () => column,
      });

      expect(callSelector(options.totalAggregates[0], { field: 1 })).toEqual(['field', 1]);
    });

    it('should use the column dataField when the column has no calculateCellValue', () => {
      const options = getSummaryOptions({
        summary: { totalItems: [{ summaryType: 'min', column: 'alias' }] },
        columnOption: () => makeColumn({ dataField: 'nested.value' }),
      });

      expect(callSelector(options.totalAggregates[0], { nested: { value: 5 } })).toBe(5);
    });

    it('should use the summary item column when the column is not found', () => {
      const options = getSummaryOptions({
        summary: { totalItems: [{ summaryType: 'min', column: 'nested.value' }] },
        columnOption: () => undefined,
      });

      expect(callSelector(options.totalAggregates[0], { nested: { value: 7 } })).toBe(7);
    });

    it('should return the row itself when there is neither a column nor a dataField', () => {
      const options = getSummaryOptions({ summary: { totalItems: [{ summaryType: 'count' }] } });
      const data = { field: 1 };

      expect(callSelector(options.totalAggregates[0], data)).toBe(data);
    });

    describe('recalculateWhileEditing', () => {
      const createGetUpdatedItemData = (): jest.Mock<GetSummaryOptionsArgs['getUpdatedItemData']> => jest.fn(
        (data: RawItemData) => ({ ...data, field: 100 }),
      );

      it('should use updated data when recalculateWhileEditing is enabled', () => {
        const getUpdatedItemData = createGetUpdatedItemData();

        const options = getSummaryOptions({
          summary: {
            recalculateWhileEditing: true,
            totalItems: [{ summaryType: 'min', column: 'field' }],
          },
          getUpdatedItemData,
        });

        expect(callSelector(options.totalAggregates[0], { field: 1 })).toBe(100);
        expect(getUpdatedItemData).toHaveBeenCalledWith({ field: 1 });
      });

      it('should not use updated data when recalculateWhileEditing is disabled', () => {
        const getUpdatedItemData = createGetUpdatedItemData();

        const options = getSummaryOptions({
          summary: { totalItems: [{ summaryType: 'min', column: 'field' }] },
          getUpdatedItemData,
        });

        expect(callSelector(options.totalAggregates[0], { field: 1 })).toBe(1);
        expect(getUpdatedItemData).not.toHaveBeenCalled();
      });
    });

    describe('numeric conversion', () => {
      const getConvertingSelectorValue = (
        summaryType: 'sum' | 'avg' | 'min',
        value: unknown,
      ): unknown => {
        const options = getSummaryOptions({
          summary: { totalItems: [{ summaryType, column: 'field' }] },
        });

        return callSelector(options.totalAggregates[0], { field: value });
      };

      it('should convert values to numbers for the sum summary type', () => {
        expect(getConvertingSelectorValue('sum', '10')).toBe(10);
      });

      it('should convert values to numbers for the avg summary type', () => {
        expect(getConvertingSelectorValue('avg', '10')).toBe(10);
      });

      it('should not convert values for other summary types', () => {
        expect(getConvertingSelectorValue('min', '10')).toBe('10');
      });

      it('should keep undefined and null values as is', () => {
        expect(getConvertingSelectorValue('sum', undefined)).toBeUndefined();
        expect(getConvertingSelectorValue('sum', null)).toBeNull();
      });

      it('should convert not numeric values to NaN', () => {
        expect(getConvertingSelectorValue('sum', 'text')).toBeNaN();
      });

      it('should convert updated data values when recalculateWhileEditing is enabled', () => {
        const options = getSummaryOptions({
          summary: {
            recalculateWhileEditing: true,
            totalItems: [{ summaryType: 'sum', column: 'field' }],
          },
          getUpdatedItemData: () => ({ field: '20' }),
        });

        expect(callSelector(options.totalAggregates[0], { field: '1' })).toBe(20);
      });
    });
  });

  describe('skipEmptyValues', () => {
    it('should use the summary item value', () => {
      const options = getSummaryOptions({
        summary: {
          skipEmptyValues: true,
          totalItems: [{ summaryType: 'min', skipEmptyValues: false }],
        },
      });

      expect(options.totalAggregates[0].skipEmptyValues).toBe(false);
    });

    it('should fall back to the common value', () => {
      const options = getSummaryOptions({
        summary: {
          skipEmptyValues: true,
          totalItems: [{ summaryType: 'min' }],
        },
      });

      expect(options.totalAggregates[0].skipEmptyValues).toBe(true);
    });

    it('should be undefined when neither value is specified', () => {
      const options = getSummaryOptions({ summary: { totalItems: [{ summaryType: 'min' }] } });

      expect(options.totalAggregates[0].skipEmptyValues).toBeUndefined();
    });
  });

  describe('custom aggregator', () => {
    it('should log E1026 and use a noop aggregator when calculateCustomSummary is not defined', () => {
      const logSpy = jest.spyOn(errors, 'log').mockImplementation(() => undefined);

      const options = getSummaryOptions({
        summary: { totalItems: [{ summaryType: 'custom', name: 'test' }] },
      });

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('E1026');

      const aggregator = getCustomAggregator(options.totalAggregates[0]);

      // NOTE: a noop calculation leaves the total value as it is
      expect(aggregator.seed(0)).toBeUndefined();
      expect(aggregator.step(1, 2)).toBe(1);
      expect(aggregator.finalize(3)).toBe(3);
    });

    it('should not log E1026 when calculateCustomSummary is defined', () => {
      const logSpy = jest.spyOn(errors, 'log').mockImplementation(() => undefined);
      const { calculateCustomSummary } = createCustomSummaryRecorder();

      getSummaryOptions({
        summary: {
          calculateCustomSummary,
          totalItems: [{ summaryType: 'custom' }],
        },
      });

      expect(logSpy).not.toHaveBeenCalled();
    });

    it('should call calculateCustomSummary once on creation without a summary process', () => {
      const { calculateCustomSummary, calls } = createCustomSummaryRecorder();

      getSummaryOptions({
        summary: {
          calculateCustomSummary,
          totalItems: [{ summaryType: 'custom', name: 'test' }],
        },
      });

      expect(calls).toHaveLength(1);
      expect(calls[0]).toMatchObject({
        component,
        name: 'test',
        summaryProcess: undefined,
        hasValue: false,
      });
    });

    it('should pass the summary item name to calculateCustomSummary', () => {
      const { calculateCustomSummary, calls } = createCustomSummaryRecorder();

      const options = getSummaryOptions({
        summary: {
          calculateCustomSummary,
          totalItems: [
            { summaryType: 'custom', name: 'first' },
            { summaryType: 'custom', name: 'second' },
          ],
        },
      });

      getCustomAggregator(options.totalAggregates[0]).seed(0);
      getCustomAggregator(options.totalAggregates[1]).seed(0);

      expect(calls.map((call) => call.name)).toEqual(['first', 'second', 'first', 'second']);
    });

    it('should start the summary process on seed', () => {
      const { calculateCustomSummary, calls } = createCustomSummaryRecorder((options) => {
        options.totalValue = 'seeded';
      });

      const options = getSummaryOptions({
        summary: {
          calculateCustomSummary,
          groupItems: [{ summaryType: 'custom' }],
        },
      });

      const result = getCustomAggregator(options.groupAggregates[0]).seed(2);

      expect(result).toBe('seeded');
      expect(calls[1]).toMatchObject({
        summaryProcess: 'start',
        groupIndex: 2,
        totalValue: undefined,
        hasValue: false,
      });
    });

    it('should calculate the summary process on step', () => {
      const { calculateCustomSummary, calls } = createCustomSummaryRecorder((options) => {
        options.totalValue = Number(options.totalValue) + Number(options.value);
      });

      const options = getSummaryOptions({
        summary: {
          calculateCustomSummary,
          totalItems: [{ summaryType: 'custom' }],
        },
      });

      const result = getCustomAggregator(options.totalAggregates[0]).step(1, 2);

      expect(result).toBe(3);
      expect(calls[1]).toMatchObject({
        summaryProcess: 'calculate',
        totalValue: 1,
        value: 2,
        hasValue: true,
      });
    });

    it('should finalize the summary process on finalize', () => {
      const { calculateCustomSummary, calls } = createCustomSummaryRecorder((options) => {
        options.totalValue = `${String(options.totalValue)} finalized`;
      });

      const options = getSummaryOptions({
        summary: {
          calculateCustomSummary,
          totalItems: [{ summaryType: 'custom' }],
        },
      });

      const result = getCustomAggregator(options.totalAggregates[0]).finalize('total');

      expect(result).toBe('total finalized');
      expect(calls[1]).toMatchObject({
        summaryProcess: 'finalize',
        totalValue: 'total',
        hasValue: false,
      });
    });

    it('should remove the value passed to step from the next seed and finalize calls', () => {
      const { calculateCustomSummary, calls } = createCustomSummaryRecorder();

      const options = getSummaryOptions({
        summary: {
          calculateCustomSummary,
          totalItems: [{ summaryType: 'custom' }],
        },
      });

      const aggregator = getCustomAggregator(options.totalAggregates[0]);

      aggregator.step(1, 2);
      aggregator.finalize(1);
      aggregator.step(1, 2);
      aggregator.seed(0);

      expect(calls.map((call) => call.hasValue)).toEqual([false, true, false, true, false]);
    });

    it('should keep the group index from seed during the calculation', () => {
      const { calculateCustomSummary, calls } = createCustomSummaryRecorder();

      const options = getSummaryOptions({
        summary: {
          calculateCustomSummary,
          groupItems: [{ summaryType: 'custom' }],
        },
      });

      const aggregator = getCustomAggregator(options.groupAggregates[0]);

      aggregator.seed(1);
      aggregator.step(undefined, 1);
      aggregator.finalize(1);

      expect(calls.map((call) => call.groupIndex)).toEqual([undefined, 1, 1, 1]);
    });

    it('should calculate a custom summary through the whole aggregation cycle', () => {
      const calculateCustomSummary = (options: CustomSummaryInfo): void => {
        switch (options.summaryProcess) {
          case 'start':
            options.totalValue = 0;
            break;
          case 'calculate':
            options.totalValue = Number(options.totalValue) + Number(options.value);
            break;
          case 'finalize':
            options.totalValue = `total: ${String(options.totalValue)}`;
            break;
          default:
            break;
        }
      };

      const options = getSummaryOptions({
        summary: {
          calculateCustomSummary,
          groupItems: [{ summaryType: 'custom' }],
        },
      });

      const aggregator = getCustomAggregator(options.groupAggregates[0]);

      let totalValue = aggregator.seed(0);

      expect(totalValue).toBe(0);

      totalValue = aggregator.step(totalValue, 1);
      totalValue = aggregator.step(totalValue, 2);

      expect(totalValue).toBe(3);
      expect(aggregator.finalize(totalValue)).toBe('total: 3');
    });

    it('should use independent options for group and total items', () => {
      const { calculateCustomSummary, calls } = createCustomSummaryRecorder((options) => {
        options.totalValue = options.name;
      });

      const options = getSummaryOptions({
        summary: {
          calculateCustomSummary,
          groupItems: [{ summaryType: 'custom', name: 'group' }],
          totalItems: [{ summaryType: 'custom', name: 'total' }],
        },
      });

      const groupResult = getCustomAggregator(options.groupAggregates[0]).seed(0);
      const totalResult = getCustomAggregator(options.totalAggregates[0]).seed(0);

      expect(groupResult).toBe('group');
      expect(totalResult).toBe('total');
      expect(calls.map((call) => call.name)).toEqual(['group', 'total', 'group', 'total']);
    });

    it('should use a selector and skipEmptyValues for a custom aggregate', () => {
      const { calculateCustomSummary } = createCustomSummaryRecorder();

      const options = getSummaryOptions({
        summary: {
          calculateCustomSummary,
          skipEmptyValues: true,
          totalItems: [{ summaryType: 'custom', column: 'field' }],
        },
      });

      expect(options.totalAggregates[0].skipEmptyValues).toBe(true);
      expect(callSelector(options.totalAggregates[0], { field: 1 })).toBe(1);
    });

    it('should not create a custom aggregator for remote aggregates', () => {
      const { calculateCustomSummary, calls } = createCustomSummaryRecorder();

      const options = getSummaryOptions({
        summary: {
          calculateCustomSummary,
          totalItems: [{ summaryType: 'custom', column: 'field' }],
        },
        remoteOperations: { summary: true },
      });

      expect(calls).toHaveLength(0);
      expect(options.totalAggregates).toStrictEqual([{
        selector: 'field',
        summaryType: 'custom',
      }]);
    });
  });

  describe('sortByGroups', () => {
    const groupItems = [
      { summaryType: 'count' as const },
      { summaryType: 'sum' as const, column: 'value' },
    ];

    it('should return undefined when there are no group items', () => {
      const options = getSummaryOptions({
        summary: { totalItems: [{ summaryType: 'count' }] },
        sortByGroupSummaryInfo: [{ summaryItem: 'count' }],
        groupColumns: [makeColumn({ dataField: 'group', groupIndex: 0 })],
      });

      expect(options.sortByGroups()).toBeUndefined();
    });

    it('should return an empty array when sortByGroupSummaryInfo is empty', () => {
      const options = getSummaryOptions({
        summary: { groupItems },
        groupColumns: [makeColumn({ dataField: 'group', groupIndex: 0 })],
      });

      expect(options.sortByGroups()).toEqual([]);
    });

    it('should return an empty array when sortByGroupSummaryInfo is not defined', () => {
      const options = getSummaryOptions({
        summary: { groupItems },
        sortByGroupSummaryInfo: undefined as unknown as GetSummaryOptionsArgs['sortByGroupSummaryInfo'],
        groupColumns: [makeColumn({ dataField: 'group', groupIndex: 0 })],
      });

      expect(options.sortByGroups()).toEqual([]);
    });

    it('should skip info items with an unknown summary item', () => {
      const options = getSummaryOptions({
        summary: { groupItems },
        sortByGroupSummaryInfo: [{ summaryItem: 'unknown' }, { summaryItem: undefined }],
        groupColumns: [makeColumn({ dataField: 'group', groupIndex: 0 })],
      });

      expect(options.sortByGroups()).toEqual([]);
    });

    it('should use the group column specified in the info item', () => {
      const columnOption = jest.fn<GetSummaryOptionsArgs['columnOption']>(
        () => makeColumn({ dataField: 'group', groupIndex: 1 }),
      );

      const options = getSummaryOptions({
        summary: { groupItems },
        sortByGroupSummaryInfo: [{ summaryItem: 'count', groupColumn: 'group' }],
        groupColumns: [makeColumn({ dataField: 'other', groupIndex: 0 })],
        columnOption,
      });

      const sortByGroups = options.sortByGroups();

      expect(columnOption).toHaveBeenCalledWith('group');
      expect(sortByGroups).toHaveLength(2);
      expect(sortByGroups?.[0]).toBeUndefined();
      expect(sortByGroups?.[1]).toHaveLength(1);
    });

    it('should use all group columns when the info item has no group column', () => {
      const options = getSummaryOptions({
        summary: { groupItems },
        sortByGroupSummaryInfo: [{ summaryItem: 'count' }],
        groupColumns: [
          makeColumn({ dataField: 'group1', groupIndex: 0 }),
          makeColumn({ dataField: 'group2', groupIndex: 1 }),
        ],
      });

      const sortByGroups = options.sortByGroups();

      expect(sortByGroups).toHaveLength(2);
      expect(sortByGroups?.[0]).toHaveLength(1);
      expect(sortByGroups?.[1]).toHaveLength(1);
    });

    it('should skip columns without a group index', () => {
      const options = getSummaryOptions({
        summary: { groupItems },
        sortByGroupSummaryInfo: [{ summaryItem: 'count' }],
        groupColumns: [
          makeColumn({ dataField: 'notGrouped' }),
          makeColumn({ dataField: 'group', groupIndex: 0 }),
        ],
      });

      expect(options.sortByGroups()).toHaveLength(1);
    });

    it('should skip an info item whose group column is not found', () => {
      const options = getSummaryOptions({
        summary: { groupItems },
        sortByGroupSummaryInfo: [{ summaryItem: 'count', groupColumn: 'unknown' }],
        groupColumns: [makeColumn({ dataField: 'group', groupIndex: 0 })],
        columnOption: () => undefined,
      });

      expect(options.sortByGroups()).toEqual([]);
    });

    it('should collect several info items for the same group index', () => {
      const options = getSummaryOptions({
        summary: { groupItems },
        sortByGroupSummaryInfo: [
          { summaryItem: 'count', sortOrder: 'desc' },
          { summaryItem: 'sum_value' },
        ],
        groupColumns: [makeColumn({ dataField: 'group', groupIndex: 0 })],
      });

      const sortByGroups = options.sortByGroups();

      expect(sortByGroups).toHaveLength(1);
      expect(sortByGroups?.[0]?.map((info) => info.desc)).toEqual([true, false]);
    });

    describe('desc', () => {
      const getSortInfoDesc = (
        sortOrder: 'asc' | 'desc' | undefined,
        columnSortOrder: 'asc' | 'desc' | undefined,
      ): boolean | undefined => {
        const options = getSummaryOptions({
          summary: { groupItems },
          sortByGroupSummaryInfo: [{ summaryItem: 'count', sortOrder }],
          groupColumns: [makeColumn({
            dataField: 'group',
            groupIndex: 0,
            sortOrder: columnSortOrder,
          })],
        });

        return options.sortByGroups()?.[0]?.[0].desc;
      };

      it('should be true for the desc sort order', () => {
        expect(getSortInfoDesc('desc', 'asc')).toBe(true);
      });

      it('should be false for the asc sort order', () => {
        expect(getSortInfoDesc('asc', 'desc')).toBe(false);
      });

      it('should use the column sort order when the info item has none', () => {
        expect(getSortInfoDesc(undefined, 'desc')).toBe(true);
        expect(getSortInfoDesc(undefined, 'asc')).toBe(false);
      });

      it('should be false when neither sort order is defined', () => {
        expect(getSortInfoDesc(undefined, undefined)).toBe(false);
      });
    });

    describe('selector', () => {
      const getSortInfoSelector = (
        summaryItem: string | number,
      ): ((data: RawItemData) => unknown) => {
        const options = getSummaryOptions({
          summary: { groupItems },
          sortByGroupSummaryInfo: [{ summaryItem }],
          groupColumns: [makeColumn({ dataField: 'group', groupIndex: 0 })],
        });

        const selector = options.sortByGroups()?.[0]?.[0].selector;

        if (!selector) {
          throw new Error('sort info selector is expected to be defined');
        }

        return selector;
      };

      it('should return the group aggregate found by the summary item name', () => {
        expect(getSortInfoSelector('sum_value')({ summary: [1, 2] })).toBe(2);
        expect(getSortInfoSelector('count')({ summary: [1, 2] })).toBe(1);
      });

      it('should return the group aggregate found by the summary item index', () => {
        expect(getSortInfoSelector(1)({ summary: [1, 2] })).toBe(2);
      });

      it('should fall back to the aggregates field', () => {
        expect(getSortInfoSelector('sum_value')({ aggregates: [1, 2] })).toBe(2);
      });

      it('should return undefined when there are no aggregates', () => {
        expect(getSortInfoSelector('sum_value')({})).toBeUndefined();
      });
    });
  });
});
