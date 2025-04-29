/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DataType } from '@js/common';
import messageLocalization from '@js/localization/message';
import filterUtils from '@js/ui/shared/filtering';

import { defaultSetCellValue } from '../editing/utils';
import type { Template, WithRequired } from '../types';
import type { Cell, Column } from './types';

interface NonNormalizedColumnOptions {
  calculateDisplayValue: string | ((this: Column, data: unknown) => unknown);
  headerItemTemplate?: Template<{ column: Column }>;
  fieldTemplate?: Template<{ cell: Cell }>;
  captionTemplate?: Template<{ cell: Cell }>;
  valueTemplate?: Template<{ cell: Cell }>;
}

export type ColumnSettings = Partial<
Omit<Column, keyof NonNormalizedColumnOptions>
& NonNormalizedColumnOptions
>;

export type PreNormalizedColumn = WithRequired<ColumnSettings, 'name' | 'visibleIndex'>;

export type ColumnProperties = ColumnSettings | string;

export const defaultColumnProperties = {
  dataType: 'string',
  calculateCellValue(data): unknown {
    // @ts-expect-error
    return data[this.dataField!];
  },
  calculateDisplayValue(data): unknown {
    return this.calculateCellValue(data);
  },
  calculateFilterExpression: filterUtils.defaultCalculateFilterExpression,
  alignment: 'left',
  visible: true,
  allowReordering: true,
  allowSorting: true,
  allowHiding: true,
  allowFiltering: true,
  allowHeaderFiltering: true,
  allowSearch: true,
  trueText: messageLocalization.format('dxDataGrid-trueText'),
  falseText: messageLocalization.format('dxDataGrid-falseText'),
  showInColumnChooser: true,
  validationRules: [],
  allowEditing: true,
  editorOptions: {},
  formItem: {},
  setCellValue: defaultSetCellValue,
  defaultSetCellValue,
} satisfies Partial<Column>;

export const defaultColumnPropertiesByDataType: Record<
DataType,
Exclude<ColumnProperties, string>
> = {
  boolean: {
    alignment: 'center',
    customizeText({ value }): string {
      return value
        ? this.trueText
        : this.falseText;
    },
  },
  string: {

  },
  date: {

  },
  datetime: {

  },
  number: {

  },
  object: {

  },
};

export interface Options {
  columns?: ColumnProperties[];

  allowColumnReordering?: boolean;
}

export const defaultOptions = {
  allowColumnReordering: false,
} satisfies Options;
