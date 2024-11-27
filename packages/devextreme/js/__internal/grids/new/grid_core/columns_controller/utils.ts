import { captionize } from '@js/core/utils/inflector';

import { type ColumnProperties, defaultColumnProperties, defaultColumnPropertiesByDataType } from './options';
import type { Column } from './types';

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
