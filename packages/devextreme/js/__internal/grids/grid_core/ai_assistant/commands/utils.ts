import { isString } from '@js/core/utils/type';

type RowKey = string | number | Record<string, string | number>;

// Validates the user-supplied key against the grid's keyExpr shape.
// Caller is responsible for resolving keyExpr first — passing `undefined`
// would mean "no row key configured", which is a different failure case.
export const isKeyShapeValid = (
  keyExpr: string | string[],
  key: RowKey,
): boolean => {
  if (isString(keyExpr)) {
    return typeof key === 'string' || typeof key === 'number';
  }

  if (typeof key !== 'object' || key === null) {
    return false;
  }

  return keyExpr.every((field) => field in key);
};
