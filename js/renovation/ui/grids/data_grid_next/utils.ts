import {
  RowData, Key, KeyExprInternal, Row,
} from './types';
import errors from '../../../../ui/widget/ui.errors';
import { isString, isNumeric } from '../../../../core/utils/type';
import { getElementStyle } from '../../pager/utils/get_element_width';

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

export const getElementHeight = (element: Element | null | undefined): number => getElementStyle('height', element);
