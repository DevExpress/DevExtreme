import type { DataType } from '@js/common';
import type { DxElement } from '@js/core/element';
import type { DeferredObj } from '@js/core/utils/deferred';
import type {
  FieldValue, FilterBuilderField, ValueEditorOptions, ValueOperand,
} from '@ts/filter_builder/types';
import type { Column, FilterField } from '@ts/grids/grid_core/columns_controller/types';

/**
 * Column-like shape used by filter sync. Compatible with
 * `Column`, `FilterField`, and persisted `ColumnUserState`.
 */
export type FilterSyncColumn = Partial<FilterField>;

/** The column options a header filter is expressed through. */
export type HeaderFilterState = Pick<Column, 'filterType' | 'filterValues'>;

/** The column options a filter row is expressed through. */
export type FilterRowState = Pick<Column,
  'filterValue' | 'selectedFilterOperation' | 'bufferedFilterValue' | 'bufferedSelectedFilterOperation'
>;

/** A header filter item, as the header filter data source loads it. */
export interface HeaderFilterTextItem {
  text: string;
  selected?: boolean;
  items?: HeaderFilterTextItem[];
}

/** A grid column as the filter builder passes it to a custom operation. */
export type HeaderFilterField = FilterSyncColumn & Pick<FilterBuilderField, 'dataField'>;

export interface HeaderFilterFieldInfo {
  value?: FieldValue;
  field: HeaderFilterField;
}

export interface HeaderFilterCustomizeTextOptions {
  values?: FieldValue[];
  items?: DeferredObj<HeaderFilterTextItem[]>;
}

export interface HeaderFilterOperation {
  dataTypes: DataType[];
  calculateFilterExpression: (
    filterValue: ValueOperand[],
    field: FilterBuilderField,
    fields?: FilterBuilderField[],
  ) => string | string[];
  editorTemplate: (
    conditionInfo: ValueEditorOptions & { field: FilterBuilderField },
    container: DxElement,
  ) => DxElement;
  customizeText: (
    fieldInfo: HeaderFilterFieldInfo,
    options?: HeaderFilterCustomizeTextOptions,
  ) => DeferredObj<string> | string;
}
