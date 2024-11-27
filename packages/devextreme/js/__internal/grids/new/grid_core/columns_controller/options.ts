/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DataType } from '@js/common';

import type { Column } from './types';

export type ColumnProperties = Partial<Column> | string;

export const defaultColumnProperties = {
  dataType: 'string',
  calculateCellValue(data): unknown {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data[this.dataField!];
  },
  alignment: 'left',
  visible: true,
} satisfies Partial<Column>;

export const defaultColumnPropertiesByDataType: Record<
DataType,
Exclude<ColumnProperties, string>
> = {
  boolean: {
    alignment: 'center',
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
}

export const defaultOptions = {

} satisfies Options;
