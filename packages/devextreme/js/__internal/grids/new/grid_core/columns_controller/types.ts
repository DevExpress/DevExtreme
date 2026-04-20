import type { DataType, Format, SortOrder } from '@js/common';
import type { ColumnBase, FilterType } from '@js/common/grids';
import type { DeepPartial } from '@js/core/index';
import type * as dxForm from '@js/ui/form';
import type { HeaderFilterColumnOptions } from '@ts/grids/new/grid_core/filtering/header_filter/index';
import type { ComponentType } from 'inferno';

import type { DataObject, Key } from '../data_controller/types';
import type { HighlightedTextItem } from '../search/types';

type InheritedColumnProps = | 'alignment'
  | 'dataType'
  | 'visible'
  | 'visibleIndex'
  | 'allowReordering'
  | 'allowHiding'
  | 'allowFiltering'
  | 'allowHeaderFiltering'
  | 'allowSearch'
  | 'trueText'
  | 'falseText'
  | 'showInColumnChooser'
  | 'validationRules'
  | 'allowEditing'
  | 'filterValues'
  | 'editorOptions'
  | 'caption';

export type Column = Pick<Required<ColumnBase>, InheritedColumnProps> & {
  dataField?: string;

  sortOrder?: SortOrder; // todo: move to sorting module
  sortIndex?: number; // todo: move to sorting module
  allowSorting?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortingMethod?: ((this: Column, value1: any, value2: any) => number) | undefined;
  calculateSortValue?: string | ((this: Column, rowData: DataObject) => unknown);

  name: string;

  calculateFieldValue: (this: Column, data: unknown) => unknown;

  calculateDisplayValue: (this: Column, data: unknown) => unknown;

  calculateFilterExpression: (
    this: Column,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterValue: any,
    selectedFilterOperation: string | undefined,
    target: string,
  ) => unknown;
  defaultCalculateFilterExpression: Column['calculateFilterExpression'];

  selector: (this: Column, data: unknown) => unknown;

  format?: Format;

  customizeText?: (this: Column, info: {
    value: unknown;
    valueText: string;
  }) => string;

  editorTemplate?: unknown;

  fieldTemplate?: ComponentType<{ field: FieldInfo }>;
  fieldCaptionTemplate?: ComponentType<{ field: FieldInfo }>;
  fieldValueTemplate?: ComponentType<{ field: FieldInfo }>;

  headerItemTemplate?: ComponentType<{ column: Column }>;

  headerItemCssClass?: string;

  formItem: dxForm.SimpleItem;

  // header filter options for specific column.
  headerFilter?: HeaderFilterColumnOptions;

  setFieldValue: (
    this: Column, newData: DeepPartial<DataObject>, value: unknown, currentRowData: DataObject,
  ) => (void | Promise<void>);
  defaultSetFieldValue: Column['setFieldValue'];

  filterType?: FilterType;
};

export type VisibleColumn = Column & { headerPanelIndex: number };

export interface FieldInfo {
  value: unknown;

  displayValue: unknown;

  text: string;

  column: Column;

  highlightedText: HighlightedTextItem[] | null;

  index: number;

  card: CardInfo;
}

export interface CardInfo {
  visible: boolean;

  columns: Column[];

  fields: FieldInfo[];

  key: Key;

  data: DataObject;

  isSelected?: boolean;

  index: number;

  values: unknown[];
}

export interface ColumnsConfigurationFromData {
  dataFields: string[];
  columns: Record<string, ColumnFromDataOptions>;
}

export interface ColumnFromDataOptions {
  dataType?: DataType;
  format?: Format;
}
