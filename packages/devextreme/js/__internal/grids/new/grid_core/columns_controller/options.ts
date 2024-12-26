/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DataType } from '@js/common';
import messageLocalization from '@js/localization/message';

import type { WithRequired } from '../types';
import type { Column } from './types';

export type ColumnSettings = Partial<Omit<Column, 'calculateDisplayValue'> & {
  calculateDisplayValue: string | ((this: Column, data: unknown) => unknown);
}>;

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
  alignment: 'left',
  visible: true,
  allowReordering: true,
  trueText: messageLocalization.format('dxDataGrid-trueText'),
  falseText: messageLocalization.format('dxDataGrid-falseText'),
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
}

export const defaultOptions = {
  allowColumnReordering: false,
} satisfies Options;
