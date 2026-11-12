import type { DataType } from '@js/common';
import type { FilterType } from '@js/common/grids';
import type { ValueCondition, ValueOperand } from '@ts/filter_builder/types';

interface DataItem {
  id: number;
  value: unknown;
}

interface HeaderFilterDataItem {
  text: string;
  value: unknown[];
}

interface HeaderFilterState {
  headerFilterType: FilterType | undefined;
  headerFilter: ValueOperand[] | undefined;
}

interface FilterPanelState {
  filterPanel: ValueCondition | undefined;
}

interface FilterFullState extends HeaderFilterState, FilterPanelState {}

interface BaseTestCase {
  caseName: string;
  filteredIds: number[];
  expected: FilterFullState;
}

export interface TestCaseHeaderFilter extends BaseTestCase {
  changes: HeaderFilterState;
}

export interface TestCaseFilterPanel extends BaseTestCase {
  changes: FilterPanelState;
}

export interface TestCasesGroup {
  groupName: string;
  dataSource: DataItem[];
  dataType: DataType;
  headerFilterDataSource?: HeaderFilterDataItem[];
  cases: {
    headerFilter: TestCaseHeaderFilter[];
    filterPanel: TestCaseFilterPanel[];
  };
}
