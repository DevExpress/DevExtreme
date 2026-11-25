import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { PivotGridArea } from '@js/ui/pivot_grid/data_source';
import { updateHeaderFilterItemSelectionState } from '@ts/grids/grid_core/header_filter/header_filter_core';

import type { PivotGridDataSource } from '../data_source/data_source';
import type { DataSourceState } from '../data_source/types';
import type { PivotGridField, PivotGridFilterValue } from '../types';
import { createPath, foreachTree } from '../widget_utils';
import type { FieldChooserField, SortOrderType } from './const';
import { FIELD_NAVIGATION_DELTAS, SORT_ORDER } from './const';
import type { FieldChooserBaseProperties, FieldChooserHeaderFilterItem } from './types';

export const reverseSortOrder = (
  sortOrder: SortOrderType | undefined,
): SortOrderType => (sortOrder === SORT_ORDER.descending
  ? SORT_ORDER.ascending
  : SORT_ORDER.descending);

export const getFieldSortOrder = (
  field: Pick<FieldChooserField, 'sortOrder'>,
): SortOrderType => (field.sortOrder === SORT_ORDER.descending
  ? SORT_ORDER.descending
  : SORT_ORDER.ascending);

export const shouldCancelDragging = (
  field: { isMeasure?: boolean } | undefined,
  targetGroup: string | undefined,
): boolean => {
  if (!field) {
    return false;
  }

  if (field.isMeasure === true) {
    return targetGroup === 'column' || targetGroup === 'row' || targetGroup === 'filter';
  }

  if (field.isMeasure === false && targetGroup === 'data') {
    return true;
  }

  return false;
};

export const isPivotGridArea = (
  group: string | undefined,
): group is PivotGridArea => group === 'filter' || group === 'row' || group === 'column' || group === 'data';

export const isPivotGridDataSource = (
  dataSource: FieldChooserBaseProperties['dataSource'],
): dataSource is PivotGridDataSource => !!dataSource?.fields && !!dataSource.load;

export const isFieldNavigationEvent = (
  e: DxEvent<KeyboardEvent>,
): boolean => e.type === 'keydown'
  && FIELD_NAVIGATION_DELTAS[e.key] !== undefined
  && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

export const isContextMenuKeyEvent = (
  e: DxEvent<KeyboardEvent>,
): boolean => e.type === 'keydown'
  && !e.repeat
  && (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10'));

export const processItems = (
  groupItems: FieldChooserHeaderFilterItem[],
  field: PivotGridField,
): void => {
  const filterValues: unknown[] = field.filterValues?.map(
    (filterValue: PivotGridFilterValue) => (
      Array.isArray(filterValue) ? filterValue.join('/') : filterValue?.valueOf()
    ),
  ) ?? [];
  const isTree = !!field.groupName;
  const isExcludeFilterType = field.filterType === 'exclude';

  foreachTree(groupItems, (items: FieldChooserHeaderFilterItem[]) => {
    const item = items[0];
    const path = createPath(items);
    const preparedFilterValueByText = isTree ? items.map((member) => member.text).reverse().join('/') : item.text;

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- '' falls back
    item.value = isTree ? path.slice(0) : item.key || item.value;
    const preparedFilterValue = isTree ? path.join('/') : item.value?.valueOf();

    if (item.children) {
      item.items = item.children;
      item.children = null;
    }

    updateHeaderFilterItemSelectionState(
      item,
      (!!item.key && filterValues.includes(preparedFilterValueByText))
      || filterValues.includes(preparedFilterValue),
      isExcludeFilterType,
    );
  });
};

export const getMainGroupField = (
  dataSource: PivotGridDataSource,
  sourceField: FieldChooserField,
): FieldChooserField => {
  let field = sourceField;
  if (isDefined(sourceField.groupIndex)) {
    // @ts-expect-error a field's index is set by the data source
    field = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex ?? -1];
  }

  return field;
};

export const fieldHasHeaderFilter = (
  dataSource: PivotGridDataSource,
  field: FieldChooserField,
): boolean => {
  const mainGroupField = getMainGroupField(dataSource, field);
  const isFirstInGroup = field.groupIndex === 0 || !isDefined(field.groupIndex);

  return !!mainGroupField.allowFiltering && isFirstInGroup && field.area !== 'data';
};

export const getStringState = (
  state: Partial<DataSourceState> | null | undefined,
): string => JSON.stringify([state?.fields, state?.columnExpandedPaths, state?.rowExpandedPaths]);
