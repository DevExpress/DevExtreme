import type { SummaryType } from '@js/common/grids';
import { defineGridCommand } from '@ts/grids/grid_core/ai_assistant/commands/defineGridCommand';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import type { Column } from './types';

const SUMMARY_TYPES = ['sum', 'min', 'max', 'avg', 'count'] as const satisfies readonly SummaryType[];

const summaryItemBaseShape = {
  column: z.string(),
  summaryType: z.enum(SUMMARY_TYPES),
  showInColumn: z.string().optional(),
  displayFormat: z.string().optional(),
};

const totalItemSchema = z.object(summaryItemBaseShape).strict();

const groupItemSchema = z.object({
  ...summaryItemBaseShape,
  showInGroupFooter: z.boolean().optional(),
  alignByColumn: z.boolean().optional(),
}).strict();

const summaryCommandSchema = z.object({
  totalItems: z.array(totalItemSchema).optional(),
  groupItems: z.array(groupItemSchema).optional(),
}).strict();

type TotalItem = z.infer<typeof totalItemSchema>;
type GroupItem = z.infer<typeof groupItemSchema>;
type SummaryItem = TotalItem | GroupItem;

const SUMMARY_TYPE_LABELS: Record<SummaryItem['summaryType'], string> = {
  sum: 'sum',
  min: 'minimum',
  max: 'maximum',
  avg: 'average',
  count: 'count',
};

const buildItemLabel = (
  item: SummaryItem,
  location: 'total' | 'group',
  columnsController: { columnOption: (id: string) => Column | undefined },
): string => {
  const column = columnsController.columnOption(item.column);
  const caption = column?.caption ?? item.column;

  return `"${caption}" ${SUMMARY_TYPE_LABELS[item.summaryType]} (${location})`;
};

const buildDefaultMessage = (
  totalItems: SummaryItem[],
  groupItems: SummaryItem[],
  columnsController: { columnOption: (id: string) => Column | undefined },
): string => {
  if (totalItems.length === 0 && groupItems.length === 0) {
    return 'Display data summaries.';
  }

  const labels = [
    ...totalItems.map((it) => buildItemLabel(it, 'total', columnsController)),
    ...groupItems.map((it) => buildItemLabel(it, 'group', columnsController)),
  ];

  return `Display data summaries: ${labels.join(', ')}.`;
};

export const summaryCommand = defineGridCommand({
  name: 'summary',
  description: 'Configure column summaries. totalItems aggregate the entire data set; groupItems aggregate within each group. Provide at least one item across the two arrays — use clearSummary to remove all summaries. Replaces existing summaries entirely; pre-merge with the grid\'s current summary items if you intend to add rather than replace.\n'
    + 'Each item supports:\n'
    + '- column (required): dataField of the column to aggregate.\n'
    + '- summaryType (required): one of "sum", "min", "max", "avg", "count".\n'
    + '- showInColumn (optional): dataField of the column under which the summary value is rendered. For totalItems, controls which column\'s footer cell shows the value. For groupItems, used when showInGroupFooter=true or alignByColumn=true to pick the column the value is shown under. Must match an existing column.\n'
    + '- displayFormat (optional): format template for the rendered value. Placeholders: "{0}" — the formatted summary value; "{1}" — the parent column\'s caption (for group items only resolvable when showInColumn is specified). Example: "Sum: {0}" or "{1}: {0}".\n'
    + 'Group items additionally support:\n'
    + '- showInGroupFooter (optional, default false): render in the group footer instead of the group row.\n'
    + '- alignByColumn (optional, default false): when false, group summary items are listed in parentheses after the group row header. When true, items are aligned by their columns within the group row.',
  schema: summaryCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const columnsController = component.getController('columns');
    const totalItems = args.totalItems ?? [];
    const groupItems = args.groupItems ?? [];
    const allItems: SummaryItem[] = [...totalItems, ...groupItems];

    const defaultMessage = buildDefaultMessage(totalItems, groupItems, columnsController);

    if (allItems.length === 0) {
      return Promise.resolve(failure(defaultMessage));
    }

    const allColumnsResolve = allItems.every((item) => {
      if (columnsController.columnOption(item.column) === undefined) {
        return false;
      }

      if (item.showInColumn !== undefined) {
        return columnsController.columnOption(item.showInColumn) !== undefined;
      }

      return true;
    });

    if (!allColumnsResolve) {
      return Promise.resolve(failure(defaultMessage));
    }

    try {
      component.option('summary', {
        totalItems: args.totalItems ?? [],
        groupItems: args.groupItems ?? [],
      });

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});

export const clearSummaryCommand = defineGridCommand({
  name: 'clearSummary',
  description: 'Remove all summary items.',
  schema: z.object({}).strict(),
  execute: (component, { success, failure }) => (): Promise<CommandResult> => {
    const defaultMessage = 'Clear column summaries.';

    try {
      component.option('summary', {
        groupItems: undefined,
        totalItems: undefined,
      });

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});
