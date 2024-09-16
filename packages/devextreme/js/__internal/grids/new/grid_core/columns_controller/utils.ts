/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DataType } from '@js/common';

import type { Column, ColumnProperties } from './types';

const defaultColumnProperties: Column = {
  dataType: 'string',
  calculateCellValue(data) {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data[this.dataField!];
  },
  alignment: 'left',
  visible: true,
};

const defaultColumnPropertiesByDataType: Record<DataType, Exclude<ColumnProperties, string>> = {
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

export function normalizeColumn(column: ColumnProperties): Column {
  let col = column;

  if (typeof col === 'string') {
    col = { dataField: col };
  }

  const dataTypeDefault = defaultColumnPropertiesByDataType[
    col.dataType ?? defaultColumnProperties.dataType
  ];

  const name = col.dataField;

  return {
    name,
    ...defaultColumnProperties,
    ...dataTypeDefault,
    ...col,
  };
}
