import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import { updateHeaderFilterItemSelectionState } from '@ts/grids/grid_core/header_filter/header_filter_core';

import type { PivotGridDataSource } from '../data_source/data_source';
import type { DataSourceState } from '../data_source/types';
import type { PivotGridField } from '../types';
import { createPath, foreachTree } from '../widget_utils';
import type { SortOrderType } from './const';
import { FIELD_NAVIGATION_DELTAS, SORT_ORDER } from './const';
import type { FieldChooserBaseProperties, FieldChooserHeaderFilterItem } from './types';

export const reverseSortOrder = (
  sortOrder: SortOrderType,
): SortOrderType => (sortOrder === SORT_ORDER.descending
  ? SORT_ORDER.ascending
  : SORT_ORDER.descending);

export const shouldCancelDragging = (
  field: { isMeasure?: boolean } | undefined,
  targetGroup: string,
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
  const filterValues: unknown[] = [];
  const isTree = !!field.groupName;
  const isExcludeFilterType = field.filterType === 'exclude';

  field.filterValues?.forEach((filterValue) => {
    filterValues.push(Array.isArray(filterValue) ? filterValue.join('/') : filterValue?.valueOf());
  });

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
  sourceField: PivotGridField,
): PivotGridField => {
  let field = sourceField;
  if (isDefined(sourceField.groupIndex)) {
    field = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex ?? -1];
  }

  return field;
};

export const fieldHasHeaderFilter = (
  dataSource: PivotGridDataSource,
  field: PivotGridField,
): boolean => {
  const mainGroupField = getMainGroupField(dataSource, field);
  const isFirstInGroup = field.groupIndex === 0 || !isDefined(field.groupIndex);

  return !!mainGroupField.allowFiltering && isFirstInGroup && field.area !== 'data';
};

export const getStringState = (
  state: Partial<DataSourceState> | null | undefined,
): string => JSON.stringify([state?.fields, state?.columnExpandedPaths, state?.rowExpandedPaths]);
