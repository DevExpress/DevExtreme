/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DataType } from '@js/common';
import messageLocalization from '@js/localization/message';

import type { DataObject } from '../data_controller/types';
import type { Template, WithRequired } from '../types';
import type { Column } from './types';

interface NonNormalizedColumnOptions {
  calculateDisplayValue: string | ((this: Column, data: DataObject) => unknown);
  headerItemTemplate?: Template<{ column: Column }>;
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
    return data[this.dataField];
  },
  calculateDisplayValue(data): unknown {
    return this.calculateCellValue(data);
  },
  alignment: 'left',
  visible: true,
  allowReordering: true,
  allowSorting: true,
  allowHiding: true,
  allowFiltering: true,
  allowHeaderFiltering: true,
  trueText: messageLocalization.format('dxDataGrid-trueText'),
  falseText: messageLocalization.format('dxDataGrid-falseText'),
  showInColumnChooser: true,
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
    alignment: 'right',
  },
  object: {

  },
};

export interface Options {
  columns?: ColumnProperties[];

  allowColumnReordering?: boolean;

  dateSerializationFormat?: string;
}

export const defaultOptions = {
  allowColumnReordering: false,
} satisfies Options;
