import type { JSXTemplate } from '@devextreme-generator/declarations';
import type {
  ColumnInternal, Key, Row, RowData, SelectAllMode, SelectionMode,
} from '../types';
import { createSelector, createValue } from '../../../../utils/plugin/context';
import {
  LocalData, KeyExprPlugin, VisibleColumns, LocalVisibleItems,
} from '../data_grid_next';
import { createGetKey } from '../utils';
import {
  RowClassesGetter, RowClassesGetterType, RowPropertiesGetter, RowPropertiesGetterType,
} from '../widgets/row_base';
import CLASSES from '../classes';
import { combineClasses } from '../../../../utils/combine_classes';

const getKey = createGetKey('Selection');

export const SelectionModeValue = createValue<SelectionMode>();
export const AllowSelectAllValue = createValue<boolean>();

export const SelectAllModeValue = createValue<SelectAllMode>();
export const SelectedRowKeys = createValue<unknown[]>();
export const SetSelectedRowKeys = createValue<(keys: unknown[]) => void>();

export const SelectableItems = createSelector<RowData[]>(
  [SelectAllModeValue, LocalData, LocalVisibleItems],
  (
    selectAllModeValue: SelectAllMode, allItems: RowData[], visibleItems: RowData[],
  ) => (
    selectAllModeValue === 'allPages' ? allItems : visibleItems
  ),
);

export const SelectableCount = createSelector<number>(
  [SelectableItems],
  (selectableItems: RowData[]) => selectableItems.length,
);

export const SelectedCount = createSelector<number>(
  [SelectedRowKeys],
  (selectedRowKeys: Key[]) => selectedRowKeys.length,
);

export const SetSelected = createSelector<(data: RowData, value: boolean) => void>(
  [
    SetSelectedRowKeys, SelectedRowKeys, SelectionModeValue, KeyExprPlugin,
  ],
(
  setSelectedRowKeys, selectedRowKeys: Key[], selectionMode, keyExpr,
) => (data: RowData, value: boolean): void => {
  const key = getKey(data, keyExpr);

  if (value) {
    if (selectionMode === 'multiple') {
      setSelectedRowKeys([
        ...selectedRowKeys,
        key,
      ]);
    } else {
      setSelectedRowKeys([key]);
    }
  } else {
    setSelectedRowKeys(
      selectedRowKeys.filter((i) => i !== key),
    );
  }
});

export const IsSelected = createSelector<(data: RowData) => boolean>(
  [SelectedRowKeys, KeyExprPlugin],
(
  selectedRowKeys: Key[], keyExpr,
) => (data: RowData): boolean => selectedRowKeys.includes(getKey(data, keyExpr)));

export const ToggleSelected = createSelector<(data: RowData) => void>(
  [SetSelected, IsSelected, SelectionModeValue],
(setSelected, isSelected, selectionMode) => (data: RowData): void => {
  if (selectionMode !== 'none') {
    const selected = isSelected(data);
    setSelected(data, !selected);
  }
});

export const SelectAll = createSelector<() => void>(
  [SetSelectedRowKeys, SelectableItems, KeyExprPlugin],
(setSelectedRowKeys, selectableItems: RowData[], keyExpr) => (): void => {
  setSelectedRowKeys(selectableItems.map((item) => getKey(item, keyExpr)));
});

export const ClearSelection = createSelector<() => void>(
  [SetSelectedRowKeys],
(setSelectedRowKeys: (keys: Key[]) => void) => (): void => setSelectedRowKeys([]));

export const SelectionCheckboxTemplate = createValue<JSXTemplate>();
export const SelectAllCheckboxTemplate = createValue<JSXTemplate>();

export const AddSelectionColumnToVisibleColumns = createSelector(
  [
    VisibleColumns,
    SelectionModeValue,
    AllowSelectAllValue,
    SelectionCheckboxTemplate,
    SelectAllCheckboxTemplate,
  ],
  (
    visibleColumns: ColumnInternal[],
    selectionMode,
    allowSelectAll,
    selectionCheckboxTemplate,
    selectAllCheckboxTemplate,
  ): ColumnInternal[] => {
    if (selectionMode === 'none') {
      return visibleColumns;
    }
    const selectColumn: ColumnInternal = {
      alignment: 'center',
      cellTemplate: selectionCheckboxTemplate,
      cssClass: combineClasses({
        [CLASSES.editorCell]: true,
        [CLASSES.editorInlineBlock]: true,
      }),
      width: 30,
    };

    if (selectionMode === 'multiple' && allowSelectAll) {
      selectColumn.headerCellTemplate = selectAllCheckboxTemplate;
    }

    return [
      selectColumn,
      ...visibleColumns,
    ];
  },
);

export const AddSelectionToRowProperties = createSelector(
  [RowPropertiesGetter, IsSelected],
  (base: RowPropertiesGetterType, isSelected) => (row: Row): Record<string, unknown> => {
    if (row.rowType === 'data' && isSelected(row.data)) {
      return {
        ...base(row),
        'aria-selected': true,
      };
    }
    return base(row);
  },
);

export const AddSelectionToRowClasses = createSelector(
  [RowClassesGetter, IsSelected],
  (base: RowClassesGetterType, isSelected) => (row: Row): Record<string, unknown> => {
    if (row.rowType === 'data' && isSelected(row.data)) {
      return {
        ...base(row),
        [CLASSES.selectedRow]: true,
      };
    }
    return base(row);
  },
);
