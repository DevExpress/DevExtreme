import { RowData, Key, KeyExpr } from './types';
import errors from '../../../../ui/widget/ui.errors';

export const createGetKey = (featureName: string) => (
  rowData: RowData,
  keyExpr: KeyExpr | undefined,
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
