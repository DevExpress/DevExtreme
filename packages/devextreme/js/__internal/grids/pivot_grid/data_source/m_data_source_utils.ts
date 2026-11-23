import { isDefined } from '@js/core/utils/type';
import type { PivotGridSortBy } from '@js/ui/pivot_grid/data_source';
import type { PivotGridAxis, PivotGridField, PivotGridLoadOptions } from '@ts/grids/pivot_grid/types';

import {
  createPath,
  findField,
  foreachDataLevel,
  foreachTree,
  getCompareFunction,
} from '../widget_utils';
import type {
  DataSourceData,
  DataSourceFieldWithSortingMethod,
  DataSourceHeaderItem,
  DataSourceHeaderItemCompare,
  DataSourceSortMember,
} from './types';

function getMemberForSortBy(
  sortBy: PivotGridSortBy | undefined,
  getAscOrder: boolean | undefined,
): DataSourceSortMember {
  if (sortBy === 'none') {
    return 'index';
  }

  if (getAscOrder || sortBy !== 'displayText') {
    return 'value';
  }

  return 'text';
}

function getSliceIndex(
  items: DataSourceHeaderItem[],
  path: (number | string)[],
): number | null | undefined {
  let index: number | null | undefined = null;
  const pathValue = (path || []).join('.');

  if (pathValue.length) {
    foreachTree(items, (members: DataSourceHeaderItem[]) => {
      const item = members[0];
      const itemPath = createPath(members).join('.');
      const textPath = members.map((member) => member.text).reverse().join('.');

      if (pathValue === itemPath || (item.key && textPath === pathValue)) {
        index = members[0].index;
        return false;
      }

      return undefined;
    });
  }

  return index;
}

function getFieldSummaryValueSelector(
  field: PivotGridField,
  dataSource: DataSourceData,
  loadOptions: PivotGridLoadOptions,
  dimensionName: PivotGridAxis,
): ((headerItem: DataSourceHeaderItem) => unknown) | undefined {
  const { values } = dataSource;
  const sortBySummaryFieldIndex = findField(loadOptions.values, field.sortBySummaryField);
  const areRows = dimensionName === 'rows';
  const sortByDimension = areRows ? dataSource.columns : dataSource.rows;
  const grandTotalIndex = areRows
    ? dataSource.grandTotalRowIndex
    : dataSource.grandTotalColumnIndex;
  const sortBySummaryPath = field.sortBySummaryPath ?? [];
  const sliceIndex = sortBySummaryPath.length
    ? getSliceIndex(sortByDimension, sortBySummaryPath)
    : grandTotalIndex;

  if (values?.length && sortBySummaryFieldIndex >= 0 && isDefined(sliceIndex)) {
    return function getSummaryValue(headerItem: DataSourceHeaderItem): unknown {
      const rowIndex = areRows ? headerItem.index : sliceIndex;
      const columnIndex = areRows ? sliceIndex : headerItem.index;
      const rowValues = (isDefined(rowIndex) && values[rowIndex]) || [[]];
      const cellValues = (isDefined(columnIndex) && rowValues[columnIndex]) || [];
      const value = cellValues[sortBySummaryFieldIndex];

      return isDefined(value) ? value : null;
    };
  }

  return undefined;
}

function hasSortingMethod(field: PivotGridField): field is DataSourceFieldWithSortingMethod {
  return !!field.sortingMethod;
}

function getSortingMethod(
  field: PivotGridField,
  dataSource: DataSourceData,
  loadOptions: PivotGridLoadOptions,
  dimensionName: PivotGridAxis,
  getAscOrder: boolean | undefined,
): DataSourceHeaderItemCompare {
  const sortOrder = getAscOrder ? 'asc' : field.sortOrder;
  const sortBy = getMemberForSortBy(field.sortBy, getAscOrder);
  const defaultCompare: DataSourceHeaderItemCompare = hasSortingMethod(field)
    ? function customCompare(a, b): number {
      // @ts-expect-error sortingMethod is typed for string and number values
      return field.sortingMethod(a, b);
    }
    : getCompareFunction((item) => item[sortBy]);
  const summaryValueSelector = !getAscOrder
    && getFieldSummaryValueSelector(field, dataSource, loadOptions, dimensionName);
  const summaryCompare = summaryValueSelector && getCompareFunction(summaryValueSelector);
  const sortingMethod: DataSourceHeaderItemCompare = function sortingMethod(a, b) {
    const summaryResult = summaryCompare ? summaryCompare(a, b) : 0;
    const result = summaryResult || defaultCompare(a, b);
    return sortOrder === 'desc' ? -result : result;
  };

  return sortingMethod;
}

function sortDimension(
  dataSource: DataSourceData,
  loadOptions: PivotGridLoadOptions,
  dimensionName: PivotGridAxis,
  getAscOrder: boolean | undefined,
): void {
  const fields = loadOptions[dimensionName] || [];
  const baseIndex = loadOptions.headerName === dimensionName ? loadOptions.path?.length ?? 0 : 0;
  const sortingMethodByLevel: (DataSourceHeaderItemCompare | undefined)[] = [];

  foreachDataLevel(dataSource[dimensionName], (item, index) => {
    const field = fields[index] || {};
    sortingMethodByLevel[index] ??= getSortingMethod(
      field,
      dataSource,
      loadOptions,
      dimensionName,
      getAscOrder,
    );
    const sortingMethod = sortingMethodByLevel[index];

    item.sort(sortingMethod);
  }, baseIndex);
}

function sort(
  loadOptions: PivotGridLoadOptions | undefined,
  dataSource: DataSourceData,
  getAscOrder?: boolean,
): void {
  if (!loadOptions) {
    return;
  }

  sortDimension(dataSource, loadOptions, 'rows', getAscOrder);
  sortDimension(dataSource, loadOptions, 'columns', getAscOrder);
}

export default { sort };
export { sort };
