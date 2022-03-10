import {
  RowData, Key, KeyExprInternal, Row, ColumnDataType, ColumnAlignment,
} from './types';
import errors from '../../../../ui/widget/ui.errors';
import { isString, isNumeric } from '../../../../core/utils/type';
import type { Format } from '../../../../localization';
import dateSerialization from '../../../../core/utils/date_serialization';
import { compileGetter } from '../../../../core/utils/data';

export const createGetKey = (featureName: string) => (
  rowData: RowData,
  keyExpr: KeyExprInternal | undefined,
): Key => {
  if (keyExpr === undefined) {
    // keyExpr wasn't updated on effect
    return undefined;
  }

  if (keyExpr === null) {
    // keyExpr was not specified in config
    throw errors.Error('E1042', featureName);
  }

  if (!(keyExpr in rowData)) {
    // no keyExpr field in data object
    throw errors.Error('E1046', keyExpr);
  }

  return rowData[keyExpr];
};

export const getReactRowKey = (row: Row, index: number): string => {
  if (!row.key || !(isNumeric(row.key) || isString(row.key))) {
    return `${index}`;
  }

  return `${row.rowType}_${row.key}`;
};

export const getFormatByDataType = (dataType?: ColumnDataType): Format | undefined => {
  switch (dataType) {
    case 'date':
      return 'shortDate';
    case 'datetime':
      return 'shortDateShortTime';
    default:
      return undefined;
  }
};

export const getAlignmentByDataType = (dataType?: ColumnDataType): ColumnAlignment | undefined => {
  if (dataType === 'number') {
    return 'right';
  }
  return undefined;
};

export const getDeserializeValueByDataType = (
  dataType?: ColumnDataType,
): ((value: unknown) => unknown
  ) | undefined => {
  if (dataType === 'date' || dataType === 'datetime') {
    return dateSerialization.deserializeDate;
  }
  return undefined;
};

export const getDefaultCalculateCellValue = (
  dataField?: string, dataType?: ColumnDataType,
): ((data: RowData) => unknown
  ) => {
  if (dataField) {
    const getter = compileGetter(dataField);
    const deserializeValue = getDeserializeValueByDataType(dataType);
    if (deserializeValue !== undefined) {
      return (data: RowData): unknown => {
        const value = getter(data);
        return deserializeValue(value);
      };
    }

    return getter;
  }

  return (): null => null;
};
