import type { dxElementWrapper } from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import { getComponentInstance } from '@ts/core/utils/public_component';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import { isColumnExcluded } from '@ts/grids/grid_core/filter/utils';
import type { ModuleItem } from '@ts/grids/grid_core/modules/modules';
import Editor from '@ts/ui/editor/editor';

import { BETWEEN_OPERATION_DATA_TYPES, CLASSES, MULTISELECT_EDITOR_NAMES } from './const';
import type { FilterRowValue } from './types';

const allowFilterRowFiltering = (column: Column): boolean => !!(
  column.allowFiltering
  && column.calculateFilterExpression
  && column.createFilterExpression
);

export const createFilterRowExpression = (column: Column): DataFilter => {
  const selectedFilterOperation = column.selectedFilterOperation
    || column.defaultFilterOperation;

  return column.createFilterExpression?.(column.filterValue, selectedFilterOperation, 'filterRow');
};

export const createFilterRowExpressions = (
  columns: Column[],
  excludedColumn: Column | null,
): DataFilter[] => columns
  .filter((column) => allowFilterRowFiltering(column)
    && isDefined(column.filterValue)
    && !isColumnExcluded(column, excludedColumn))
  .map(createFilterRowExpression);

export const isOnClickApplyFilterMode = (
  component: ModuleItem,
): boolean => component.option('filterRow.applyFilter') === 'onClick';

export const getEditorInstance = (
  $editorContainer: dxElementWrapper | undefined,
): Editor | null => {
  const editor = $editorContainer && getComponentInstance($editorContainer.children());

  return editor instanceof Editor ? editor : null;
};

export const hasMultiselectEditor = ($editorContainer: dxElementWrapper): boolean => {
  const editor = getEditorInstance($editorContainer);

  if (editor) {
    return MULTISELECT_EDITOR_NAMES.includes(editor.NAME ?? '');
  }

  return !$editorContainer.find(`.${CLASSES.filterRangeContent}`).length;
};

export const isValidFilterValue = (
  filterValue: FilterRowValue,
  column: Column | undefined,
  $editorContainer: dxElementWrapper,
): boolean => {
  const isFilterValueDefined = filterValue !== undefined;

  if (!Array.isArray(filterValue)) {
    return isFilterValueDefined;
  }

  if (hasMultiselectEditor($editorContainer)) {
    return true;
  }

  if (BETWEEN_OPERATION_DATA_TYPES.includes(column?.dataType ?? '')) {
    return false;
  }

  return isFilterValueDefined;
};
