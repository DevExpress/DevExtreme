import type { SearchOperation } from '@js/common/data.types';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';

const FILTER_OPS = [
  '=', '<>', '<', '<=', '>', '>=',
  'contains', 'notcontains', 'startswith', 'endswith',
] as const satisfies readonly SearchOperation[];

interface BasicFilterExpr {
  type: 'basic';
  field: string;
  operator: typeof FILTER_OPS[number];
  value: string | number | boolean | null;
}

interface CombinedFilterExpr {
  type: 'combined';
  left: FilterExprObj;
  combiner: 'and' | 'or';
  right: FilterExprObj;
}

interface NegatedFilterExpr {
  type: 'negated';
  expression: FilterExprObj;
}

type FilterExprObj = BasicFilterExpr | CombinedFilterExpr | NegatedFilterExpr;

type FilterExprArray = | [string, SearchOperation, string | number | boolean | null]
  | [FilterExprArray, 'and' | 'or', FilterExprArray]
  | ['!', FilterExprArray];

const filterOpSchema = z.enum(FILTER_OPS);

const filterValueScalarSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const basicFilterExprSchema = z.object({
  type: z.literal('basic'),
  field: z.string(),
  operator: filterOpSchema,
  value: filterValueScalarSchema,
}).strict();

const filterExprSchema: z.ZodType<FilterExprObj> = z.lazy(() => z.union([
  basicFilterExprSchema,
  z.object({
    type: z.literal('combined'),
    left: filterExprSchema,
    combiner: z.enum(['and', 'or']),
    right: filterExprSchema,
  }).strict(),
  z.object({
    type: z.literal('negated'),
    expression: filterExprSchema,
  }).strict(),
]));

const filterValueCommandSchema = z.object({
  expression: filterExprSchema.nullable(),
}).strict();

function convertFilterExprToArray(expr: FilterExprObj): FilterExprArray {
  switch (expr.type) {
    case 'basic':
      return [expr.field, expr.operator, expr.value];
    case 'combined':
      return [
        convertFilterExprToArray(expr.left),
        expr.combiner,
        convertFilterExprToArray(expr.right),
      ];
    case 'negated':
      return ['!', convertFilterExprToArray(expr.expression)];
    default:
      throw new Error('Unknown filter expression type');
  }
}

export const filterValueCommand = defineGridCommand({
  name: 'filterValue',
  description: 'Apply a filter expression to the grid. Replaces any existing filter; pass null for expression to clear. Expression forms: basic {"type":"basic","field":dataField,"operator":op,"value":val}, combined {"type":"combined","left":expr,"combiner":"and"|"or","right":expr}, negated {"type":"negated","expression":expr}. The "field" is the column dataField (not the caption). Supported operators: "=", "<>", "<", "<=", ">", ">=", "contains", "notcontains", "startswith", "endswith". To express "not and" / "not or", wrap the group in negation: {"type":"negated","expression":{"type":"combined",...}}.',
  schema: filterValueCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const defaultMessage = args.expression === null
      ? 'Clear filter.'
      : 'Apply a filter.';

    try {
      const filterValue = args.expression === null
        ? undefined
        : convertFilterExprToArray(args.expression);

      // Handles remote operations via data controller listening for the `filtering` change
      component.option('filterValue', filterValue);

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
