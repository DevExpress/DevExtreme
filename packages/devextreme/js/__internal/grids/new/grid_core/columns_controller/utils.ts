/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DataType } from '@js/common';
import { captionize } from '@js/core/utils/inflector';

import type { Column, ColumnProperties } from './types';

const defaultColumnProperties = {
  dataType: 'string',
  calculateCellValue(data): unknown {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data[this.dataField!];
  },
  alignment: 'left',
  visible: true,
} satisfies Partial<Column>;

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

export function normalizeColumn(column: ColumnProperties, index: number): Column {
  let col = column;

  if (typeof col === 'string') {
    col = { dataField: col };
  }

  const dataTypeDefault = defaultColumnPropertiesByDataType[
    col.dataType ?? defaultColumnProperties.dataType
  ];

  const name = col.name ?? col.dataField ?? `column${index}`;
  const caption = captionize(name);

  return {
    ...defaultColumnProperties,
    ...dataTypeDefault,
    name,
    caption,
    visibleIndex: index,
    ...col,
  };
}
