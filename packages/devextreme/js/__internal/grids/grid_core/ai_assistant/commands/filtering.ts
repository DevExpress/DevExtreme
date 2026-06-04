import type { SearchOperation } from '@js/common/data.types';
import type { BasicFilterExpr, FilterExprNode, FilterExprTree } from '@js/common/grids';
import { when } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';
import { resolveFilterValue } from './utils';

const FILTER_OPS = [
  '=', '<>', '<', '<=', '>', '>=',
  'contains', 'notcontains', 'startswith', 'endswith',
] as const satisfies readonly SearchOperation[];

type FilterExprArray = | [string, SearchOperation, BasicFilterExpr['value']]
  | [FilterExprArray, 'and' | 'or', FilterExprArray]
  | ['!', FilterExprArray];

const filterOpSchema = z.enum(FILTER_OPS);

const filterValueScalarSchema = z.union([
  z.string().describe(
    'A plain string value. Date values should be in "YYYY-MM-DDTHH:mm:ss" format (e.g. "2024-05-10T00:00:00", "2024-05-10T14:30:00"). The time part is always required. The "Z" suffix or timezone offset should not be appended unless the user explicitly requests it.',
  ),
  z.number().describe('A numeric filter value.'),
  z.boolean().describe('A boolean filter value.'),
  z.null().describe('A null filter value.'),
]);

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

function convertFilterExprToArray(
  component: InternalGrid,
  tree: FilterExprTree,
): FilterExprArray {
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
        case 'basic': {
          const column = component.columnOption(expr.field);

          if (!isDefined(column)) {
            // Filter sync requires an existing column for every field in a basic expression
            throw new Error(`Unknown column: ${expr.field}`);
          }

          const resolved = resolveFilterValue(column.dataType, expr.value);

          return [expr.field, expr.operator, resolved];
        }
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

const getFilterSuccessMessage = async (
  component: InternalGrid,
  filterValue: FilterExprArray,
): Promise<string> => {
  try {
    const filterText: string = await when(
      // Custom filter operations are omitted as not supported in command
      component.getView('filterPanelView').getFilterText(filterValue, []),
    );

    return `Apply a filter: ${filterText}.`;
  } catch {
    return 'Apply a filter.';
  }
};

export const filterValueCommand = defineGridCommand({
  name: 'filterValue',
  description: 'Apply a filter expression to the grid. Replaces any existing filter; pass null for expression to clear. The expression is a flat node list: {"rootId":id,"nodes":[...]}. Each node is {"id":<unique string like "n1">,"expr":<expression>}, where "expr" is one of: basic {"type":"basic","field":dataField,"operator":op,"value":val}, combined {"type":"combined","combiner":"and"|"or","leftId":nodeId,"rightId":nodeId}, negated {"type":"negated","expressionId":nodeId}. "rootId" MUST be the "id" of the outermost node (the top of the expression tree) and must match one of the node ids exactly — never invent a value like "root". Every "leftId"/"rightId"/"expressionId" must also match a node "id". Ids must be unique and must not form cycles. The "field" of every basic expression MUST be the dataField of a column that exists in the grid (not the caption); the column may be hidden, but it must exist. Never filter on a field that has no corresponding column. Supported operators: "=", "<>", "<", "<=", ">", ">=", "contains", "notcontains", "startswith", "endswith". DATE VALUES: When a value is a date or datetime, always use "YYYY-MM-DDTHH:mm:ss" format without timezone suffix, e.g. "2024-05-10T00:00:00" for midnight or "2024-05-10T14:30:00" for a specific time. Always include the "T" and time part. Do NOT use date-only format like "2024-05-10" without time. Do NOT append "Z" or any timezone offset unless the user explicitly requests it. Do NOT use natural language for dates. To express "not and" / "not or", add a negated node whose expressionId points at a combined node. Example for name = "Alpha" AND age > 10 (rootId is "n3", the combined node): {"rootId":"n3","nodes":[{"id":"n1","expr":{"type":"basic","field":"name","operator":"=","value":"Alpha"}},{"id":"n2","expr":{"type":"basic","field":"age","operator":">","value":10}},{"id":"n3","expr":{"type":"combined","combiner":"and","leftId":"n1","rightId":"n2"}}]}.',
  schema: filterValueCommandSchema,
  execute: (component, { success, failure }) => async (args): Promise<CommandResult> => {
    let defaultMessage = args.expression === null
      ? 'Clear filter.'
      : 'Apply a filter.';

    try {
      const filterValue = args.expression === null
        ? undefined
        : convertFilterExprToArray(component, args.expression);

      if (isDefined(filterValue)) {
        defaultMessage = await getFilterSuccessMessage(component, filterValue);
      }

      // Handles remote operations via data controller listening for the `filtering` change
      component.option('filterValue', filterValue);

      return success(defaultMessage);
    } catch {
      return failure(defaultMessage);
    }
  },
});

export const clearFilterCommand = defineGridCommand({
  name: 'clearFilter',
  description: 'Clear all filters. There is no way to clear a filter for an individual column. If the user wants to clear a filter for a specific column, all filters must be cleared.',
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
