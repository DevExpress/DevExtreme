import type { SearchOperation } from '@js/common/data.types';
import type { ScalarFilterValue } from '@js/common/grids';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

export type FilterCombiner = 'and' | 'or';

/**
 * The operator may be omitted — `=` is implied. Only data layer operations
 * are allowed here: column operations such as `between` or `anyof` belong to
 * `filterValue` and are expanded into these before they reach the store.
 */
export type BinaryDataFilterExpression = [string, ScalarFilterValue]
  | [string, SearchOperation, ScalarFilterValue];

/**
 * A binary expression, a negation, or a group of expressions.
 * The combiner between neighbors may be omitted — `and` is implied.
 */
export type DataFilterExpression = BinaryDataFilterExpression
  | ['!', DataFilterExpression]
  | [DataFilterExpression, ...(FilterCombiner | DataFilterExpression)[]];

export type DataFilterPredicate = (data: RawItemData) => boolean;

/**
 * The grid-internal "match nothing" filter. Not a data layer filter expression:
 * the data controller intercepts it and resolves the load with an empty result.
 */
export type MatchNothingFilter = ['!'];

export type DataFilter = DataFilterExpression
  | DataFilterPredicate
  | MatchNothingFilter
  | null
  | undefined;

/** Arrays for `anyof`/`noneof` and `between`; nested when a header filter groups by interval. */
export type FilterValueOperand = ScalarFilterValue | FilterValueOperand[];

/** Operation is a plain `string`: `filterBuilder.customOperations` is user-extensible. */
export type FilterValueCondition = [string, FilterValueOperand]
  | [string, string, FilterValueOperand];

/** Mirrors `DataFilterExpression`, but over column identifiers (`dataField ?? name`). */
export type FilterValueExpression = FilterValueCondition
  | ['!', FilterValueExpression]
  | [FilterValueExpression, ...(FilterCombiner | FilterValueExpression)[]];

export type FilterValue = FilterValueExpression | null | undefined;
