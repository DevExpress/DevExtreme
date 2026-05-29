import type { SearchOperation } from '@js/common/data.types';
import type { FilterExprNode, FilterExprTree } from '@js/common/grids';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';

const FILTER_OPS = [
  '=', '<>', '<', '<=', '>', '>=',
  'contains', 'notcontains', 'startswith', 'endswith',
] as const satisfies readonly SearchOperation[];

type FilterExprArray = | [string, SearchOperation, string | number | boolean | null]
  | [FilterExprArray, 'and' | 'or', FilterExprArray]
  | ['!', FilterExprArray];

const filterOpSchema = z.enum(FILTER_OPS);

const filterValueScalarSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const basicFilterExprSchema = z.object({
  type: z.enum(['basic']),
  field: z.string(),
  operator: filterOpSchema,
  value: filterValueScalarSchema,
}).strict();

const combinedFilterExprSchema = z.object({
  type: z.enum(['combined']),
  combiner: z.enum(['and', 'or']),
  leftId: z.string(),
  rightId: z.string(),
}).strict();

const negatedFilterExprSchema = z.object({
  type: z.enum(['negated']),
  expressionId: z.string(),
}).strict();

const filterExprSchema = z.union([
  basicFilterExprSchema,
  combinedFilterExprSchema,
  negatedFilterExprSchema,
]);

const filterExprNodeSchema = z.object({
  id: z.string(),
  expr: filterExprSchema,
}).strict();

const filterExprTreeSchema = z.object({
  rootId: z.string(),
  nodes: z.array(filterExprNodeSchema).min(1),
}).strict();

const filterValueCommandSchema = z.object({
  expression: filterExprTreeSchema.nullable(),
}).strict();

function convertFilterExprToArray(tree: FilterExprTree): FilterExprArray {
  const byId = new Map<string, FilterExprNode>();
  for (const node of tree.nodes) {
    if (byId.has(node.id)) {
      throw new Error(`Duplicate node id: ${node.id}`);
    }
    byId.set(node.id, node);
  }

  const visiting = new Set<string>();
  const walk = (id: string): FilterExprArray => {
    if (visiting.has(id)) {
      throw new Error(`Cycle detected at node: ${id}`);
    }
    const node = byId.get(id);
    if (!node) {
      throw new Error(`Unknown node id: ${id}`);
    }
    visiting.add(id);
    try {
      const { expr } = node;
      switch (expr.type) {
        case 'basic':
          return [expr.field, expr.operator, expr.value];
        case 'combined':
          return [walk(expr.leftId), expr.combiner, walk(expr.rightId)];
        case 'negated':
          return ['!', walk(expr.expressionId)];
        default:
          throw new Error('Unknown filter expression type');
      }
    } finally {
      visiting.delete(id);
    }
  };

  return walk(tree.rootId);
}

export const filterValueCommand = defineGridCommand({
  name: 'filterValue',
  description: 'Apply a filter expression to the grid. Replaces any existing filter; pass null for expression to clear. The expression is a flat node list: {"rootId":id,"nodes":[...]}. Each node is {"id":<unique string like "n1">,"expr":<expression>}, where "expr" is one of: basic {"type":"basic","field":dataField,"operator":op,"value":val}, combined {"type":"combined","combiner":"and"|"or","leftId":nodeId,"rightId":nodeId}, negated {"type":"negated","expressionId":nodeId}. "rootId" MUST be the "id" of the outermost node (the top of the expression tree) and must match one of the node ids exactly — never invent a value like "root". Every "leftId"/"rightId"/"expressionId" must also match a node "id". Ids must be unique and must not form cycles. The "field" is the column dataField (not the caption). Supported operators: "=", "<>", "<", "<=", ">", ">=", "contains", "notcontains", "startswith", "endswith". To express "not and" / "not or", add a negated node whose expressionId points at a combined node. Example for name = "Alpha" AND age > 10 (rootId is "n3", the combined node): {"rootId":"n3","nodes":[{"id":"n1","expr":{"type":"basic","field":"name","operator":"=","value":"Alpha"}},{"id":"n2","expr":{"type":"basic","field":"age","operator":">","value":10}},{"id":"n3","expr":{"type":"combined","combiner":"and","leftId":"n1","rightId":"n2"}}]}.',
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
