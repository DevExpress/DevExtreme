import type { CompositeKeyPair } from '@js/common/grids';
import { isString } from '@js/core/utils/type';
import { z } from 'zod';

type RowKey = string | number | Record<string, string | number>;

export const compositeKeyPairSchema = z.object({
  field: z.string(),
  value: z.union([z.string(), z.number()]),
}).strict();

export const compositeKeyToObject = (
  pairs: CompositeKeyPair[],
): Record<string, string | number> => {
  const result: Record<string, string | number> = {};

  for (const { field, value } of pairs) {
    result[field] = value;
  }

  return result;
};

export const normalizeKey = (
  key: string | number | CompositeKeyPair[],
): RowKey => {
  if (Array.isArray(key)) {
    return compositeKeyToObject(key);
  }

  return key;
};

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
