import type { BasicFilterExpr, CompositeKeyPair } from '@js/common/grids';
import { isString } from '@js/core/utils/type';
import { dateUtilsTs } from '@ts/core/utils/date';
import { isDateType } from '@ts/grids/grid_core/m_utils';
import { z } from 'zod';

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
