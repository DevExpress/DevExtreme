import type {
  CustomSummaryInfo,
  SortByGroupSummaryInfoItem,
  SortOrder,
  Summary,
} from '@js/ui/data_grid';
import type dxDataGrid from '@js/ui/data_grid';
import { noop } from '@ts/core/utils/m_common';
import { compileGetter } from '@ts/core/utils/m_data';
import { isDefined } from '@ts/core/utils/m_type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { RawItemData, RemoteOperationsOptions } from '@ts/grids/grid_core/data_source_adapter/types';
import errors from '@ts/ui/errors';

import type {
  Aggregate, CustomAggregator, SortByGroups, SortInfo, SummaryItem, SummaryOptions,
} from '../types';
import { findSummaryItem } from './find_summary_item';
import { getGroupAggregates } from './get_group_aggregates';

export interface GetSummaryOptionsArgs {
  summary: Summary;
  sortByGroupSummaryInfo?: SortByGroupSummaryInfoItem[];
  remoteOperations: RemoteOperationsOptions;
  getUpdatedItemData: GetUpdatedItemData;
  columnOption: GetColumnOption;
  groupColumns: Column[];
  component: dxDataGrid;
}

type MutableCustomSummaryInfo = {
  -readonly [K in keyof CustomSummaryInfo]: CustomSummaryInfo[K];
};

type Selector = (data: RawItemData) => unknown;

type GetColumnOption = (id: string | number) => Column | undefined;

type GetUpdatedItemData = (data: RawItemData) => RawItemData;

const getSelector = (
  column: Column | undefined,
  summaryItem: SummaryItem,
  recalculateWhileEditing: boolean,
  getUpdatedItemData: GetUpdatedItemData,
): Selector => {
  const getCellValue: Selector = column?.calculateCellValue
    ? column.calculateCellValue.bind(column)
    : compileGetter(column ? column.dataField : summaryItem.column);

  const getCellValueWithEditing = recalculateWhileEditing
    ? (data: RawItemData): unknown => getCellValue(getUpdatedItemData(data))
    : getCellValue;

  const getCellValueWithConversion = summaryItem.summaryType === 'avg' || summaryItem.summaryType === 'sum'
    ? (data: RawItemData): unknown => {
      const value = getCellValueWithEditing(data);
      return isDefined(value) ? Number(value) : value;
    }
    : getCellValueWithEditing;

  return getCellValueWithConversion;
};

const createCustomAggregator = (
  calculateCustomSummary: NonNullable<Summary['calculateCustomSummary']>,
  component: dxDataGrid,
  name: string | undefined,
): CustomAggregator => {
  // NOTE: the first call is intentionally made before summaryProcess is set
  const options = {
    component,
    name,
  } as MutableCustomSummaryInfo;

  calculateCustomSummary(options);
  options.summaryProcess = 'calculate';

  return {
    seed: (groupIndex): unknown => {
      options.summaryProcess = 'start';
      options.totalValue = undefined;
      options.groupIndex = groupIndex;
      delete options.value;
      calculateCustomSummary(options);
      return options.totalValue;
    },
    step: (totalValue, value): unknown => {
      options.summaryProcess = 'calculate';
      options.totalValue = totalValue;
      options.value = value;
      calculateCustomSummary(options);
      return options.totalValue;
    },
    finalize: (totalValue): unknown => {
      options.summaryProcess = 'finalize';
      options.totalValue = totalValue;
      delete options.value;
      calculateCustomSummary(options);
      return options.totalValue;
    },
  };
};

const getAggregates = (
  summaryItems: SummaryItem[],
  remoteOperations: boolean,
  args: GetSummaryOptionsArgs,
): Aggregate[] => {
  const {
    recalculateWhileEditing,
    skipEmptyValues: commonSkipEmptyValues,
  } = args.summary;

  return summaryItems.map((summaryItem) => {
    const aggregator = summaryItem.summaryType ?? 'count';

    if (remoteOperations) {
      return {
        selector: summaryItem.column,
        summaryType: aggregator,
      };
    }

    const column = isDefined(summaryItem.column)
      ? args.columnOption(summaryItem.column)
      : undefined;

    const selector = getSelector(
      column,
      summaryItem,
      Boolean(recalculateWhileEditing),
      args.getUpdatedItemData,
    );

    const skipEmptyValues = summaryItem.skipEmptyValues ?? commonSkipEmptyValues;

    if (aggregator === 'custom') {
      let { calculateCustomSummary } = args.summary;

      if (!calculateCustomSummary) {
        errors.log('E1026');
        calculateCustomSummary = noop;
      }

      const customAggregator = createCustomAggregator(
        calculateCustomSummary,
        args.component,
        summaryItem.name,
      );

      return {
        selector,
        aggregator: customAggregator,
        skipEmptyValues,
      };
    }

    return {
      selector,
      aggregator,
      skipEmptyValues,
    };
  });
};

const addSortInfo = (
  sortByGroups: SortByGroups,
  groupColumn: Column | undefined,
  selector: Selector,
  sortOrder: SortOrder | undefined,
): void => {
  const groupIndex = groupColumn?.groupIndex;

  if (!isDefined(groupIndex)) {
    return;
  }

  const groupSortInfo = sortByGroups[groupIndex] ?? [];

  groupSortInfo.push({
    selector,
    desc: (sortOrder ?? groupColumn?.sortOrder) === 'desc',
  });

  sortByGroups[groupIndex] = groupSortInfo;
};

const getSummarySortByGroups = (args: GetSummaryOptionsArgs): SortByGroups | undefined => {
  const {
    summary,
    groupColumns,
    columnOption,
    sortByGroupSummaryInfo,
  } = args;

  if (!summary.groupItems?.length) return undefined;

  const sortByGroups: SortByGroups = [];

  (sortByGroupSummaryInfo ?? []).forEach(({ groupColumn, sortOrder, summaryItem }) => {
    const summaryItemIndex = findSummaryItem(summary.groupItems, summaryItem);

    if (summaryItemIndex < 0) return;

    const selector: SortInfo['selector'] = (data) => getGroupAggregates(data)[summaryItemIndex];

    if (isDefined(groupColumn)) {
      addSortInfo(
        sortByGroups,
        columnOption(groupColumn),
        selector,
        sortOrder,
      );
    } else {
      groupColumns.forEach(
        (column) => addSortInfo(
          sortByGroups,
          column,
          selector,
          sortOrder,
        ),
      );
    }
  });

  return sortByGroups;
};

export const getSummaryOptions = (args: GetSummaryOptionsArgs): SummaryOptions | undefined => {
  const { summary, remoteOperations } = args;

  const groupAggregates = getAggregates(
    summary.groupItems ?? [],
    Boolean(remoteOperations.grouping && remoteOperations.summary),
    args,
  );
  const totalAggregates = getAggregates(
    summary.totalItems ?? [],
    Boolean(remoteOperations.summary),
    args,
  );

  if (groupAggregates.length || totalAggregates.length) {
    return {
      groupAggregates,
      totalAggregates,
      sortByGroups: (): SortByGroups | undefined => getSummarySortByGroups(args),
    };
  }

  return undefined;
};
