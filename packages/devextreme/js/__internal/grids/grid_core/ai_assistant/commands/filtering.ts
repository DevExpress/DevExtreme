import type { SearchOperation } from '@js/common/data.types';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';

// Runtime source of truth for the filter operators; `satisfies` ensures every
// entry is a valid `SearchOperation` (compile error if a typo or stale value).
const FILTER_OPS = [
  '=', '<>', '<', '<=', '>', '>=',
  'contains', 'notcontains', 'startswith', 'endswith',
] as const satisfies readonly SearchOperation[];

// Recursive filter expression shape mirroring the public `filterValue` API:
// basic: [field, op, value]; combine: [expr, 'and'|'or', expr]; negate: ['!', expr].
type FilterExpr = | [string, SearchOperation, string | number | boolean | null]
  | [FilterExpr, 'and' | 'or', FilterExpr]
  | ['!', FilterExpr];

const filterOpSchema = z.enum(FILTER_OPS);

const filterValueScalarSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const filterExprSchema: z.ZodType<FilterExpr> = z.lazy(() => z.union([
  z.tuple([z.string(), filterOpSchema, filterValueScalarSchema]),
  z.tuple([filterExprSchema, z.enum(['and', 'or']), filterExprSchema]),
  z.tuple([z.literal('!'), filterExprSchema]),
]));

const filterValueCommandSchema = z.object({
  expression: filterExprSchema.nullable(),
}).strict();

export const filterValueCommand = defineGridCommand({
  name: 'filterValue',
  description: 'Apply a filter expression to the grid. Replaces any existing filter; pass null to clear. To express "not and" / "not or", wrap the group in negation: ["!", [a, "and", b]].',
  schema: filterValueCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const defaultMessage = args.expression === null
      ? 'Clear filter.'
      : 'Apply a filter.';

    try {
      // Handles remote operations via data controller listening for the `filtering` change
      component.option('filterValue', args.expression ?? undefined);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});

export const clearFilterCommand = defineGridCommand({
  name: 'clearFilter',
  description: 'Clear all filters',
  schema: z.object({}).strict(),
  execute: (component, { success, failure }) => (): Promise<CommandResult> => {
    const defaultMessage = 'Clear filter.';

    try {
      // Handles remote operations via data controller listening for the `filtering` change
      component.clearFilter();

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});

const searchingCommandSchema = z.object({
  text: z.string(),
}).strict();

export const searchingCommand = defineGridCommand({
  name: 'searching',
  description: 'Set search panel text. Pass empty string to clear search.',
  schema: searchingCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const defaultMessage = args.text === ''
      ? 'Clear search.'
      : `Search for "${args.text}".`;

    try {
      component.searchByText(args.text);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});
