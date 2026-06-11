import type { BasicFilterExpr, CompositeKeyPair } from '@js/common/grids';
import { compileGetter } from '@js/core/utils/data';
import { isString } from '@js/core/utils/type';
import { dateUtilsTs } from '@ts/core/utils/date';
import { isDateType } from '@ts/grids/grid_core/m_utils';
import { z } from 'zod';

import type { LoadedWindow } from './types';

type RowKey = string | number | Record<string, string | number>;

export const compositeKeyPairSchema = z.object({
  field: z.string(),
  value: z.union([z.string(), z.number()]),
}).strict();

const compositeKeyToObject = (
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

/* eslint-disable spellcheck/spell-checker */
type OptionalNullishSchema<T extends z.ZodTypeAny> = z.ZodEffects<
  z.ZodOptional<z.ZodNullable<T>>,
  z.output<T> | undefined,
  z.input<T> | null | undefined
>;

// Treats `null` as "absent" for optional schema fields
export function optionalNullish<T extends z.ZodTypeAny>(
  schema: T,
): OptionalNullishSchema<T> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.nullish().transform((value) => value ?? undefined);
}
/* eslint-enable spellcheck/spell-checker */

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

// Extracts a row's key via keyExpr (single-field or composite).
// Preferred over store.keyOf: custom stores may lack the grid's keyExpr (W1011),
// so store.keyOf would return the whole row instead.
export const createKeyGetter = (
  keyExpr: string | string[],
): ((row: unknown) => RowKey) => compileGetter(keyExpr as string) as (row: unknown) => RowKey;

export const splitIntoLoadWindows = (
  indexes: number[],
  maxWindowSize: number,
): number[][] => {
  const sorted = [...new Set(indexes)].sort((a, b) => a - b);
  const windows: number[][] = [];

  sorted.forEach((index) => {
    const current = windows.at(-1);

    // Sorted indexes are merged into the same window within maxWindowSize
    if (current && index - current[0] + 1 <= maxWindowSize) {
      current.push(index);
    } else {
      windows.push([index]);
    }
  });

  return windows;
};

// Maps 1-based indexes to the keys at those positions;
export const pickKeysByIndex = <T>(
  keys: T[],
  indexes: number[],
): T[] | null => {
  const normalizedRowIndexes = indexes.map((index) => index - 1);
  const allIndexesValid = normalizedRowIndexes.every(
    (index) => index < keys.length,
  );

  if (!allIndexesValid) {
    return null;
  }

  return normalizedRowIndexes.map((index) => keys[index]);
};

// Maps each requested index to the key of the row loaded at its offset.
export const extractKeysFromWindows = <T>(
  loadedWindows: LoadedWindow[],
  keyGetter: (row: unknown) => T,
): T[] | null => {
  const keys: T[] = [];

  for (const { window, rows } of loadedWindows) {
    if (!Array.isArray(rows)) {
      return null;
    }

    for (const index of window) {
      // The requested index maps to `window[0]` offset within the loaded rows
      const row = rows[index - window[0]];

      if (row === undefined) {
        return null;
      }

      keys.push(keyGetter(row));
    }
  }

  return keys;
};

type FilterExprValue = BasicFilterExpr['value'];

export function resolveFilterValue(
  dataType: string | undefined,
  value: FilterExprValue,
): FilterExprValue {
  if (typeof value === 'string' && isDateType(dataType)) {
    if (!dateUtilsTs.isValidDate(value)) {
      return value;
    }
    return new Date(value);
  }
  return value;
}
