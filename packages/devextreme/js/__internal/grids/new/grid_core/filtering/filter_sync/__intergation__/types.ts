/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DataType } from '@js/common';
import type { FilterType } from '@js/common/grids';

interface DataItem {
  id: number;
  value: any;
}

interface HeaderFilterDataItem {
  text: string;
  value: any[];
}

interface HeaderFilterState {
  headerFilterType: FilterType | undefined;
  headerFilter: any[] | undefined;
}

interface FilterPanelState {
  filterPanel: any[] | undefined;
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
