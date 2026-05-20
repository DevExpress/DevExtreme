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
  totalItems: z.array(totalItemSchema),
  groupItems: z.array(groupItemSchema),
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
  description: 'Configure column summaries. totalItems aggregate the entire data set; groupItems aggregate within each group. Replaces the configuration entirely — both kinds are written every call. ALWAYS provide BOTH totalItems and groupItems; pass an explicit empty array [] for a kind to clear it. To keep one kind unchanged, copy its current items from the grid context into your args. To ADD items, pre-merge with the kind\'s current items. To REMOVE a specific item, pass the kind\'s remaining items (and copy the other kind unchanged). At least one kind must be non-empty. Use clearSummary only when EVERY summary should be removed.\n'
    + 'Each item supports:\n'
    + '- column (required): dataField of the column whose VALUES are aggregated. Phrases like "sum of X", "average X", "total X", "summary for X" → column="X" (X is what gets aggregated).\n'
    + '- summaryType (required): one of "sum", "min", "max", "avg", "count".\n'
    + '- showInColumn (optional): dataField of the column where the value is DISPLAYED (not aggregated). OMIT unless the user explicitly names a second column with a phrase like "show in Y", "display under Y", "in the Y column" → showInColumn="Y". Example: "sum of Amount in the SaleDate column" → column="Amount", showInColumn="SaleDate". One column mentioned → OMIT. For totalItems, controls which footer cell shows the value. For groupItems, showInColumn has effect ONLY when paired with showInGroupFooter=true OR alignByColumn=true — so whenever you set showInColumn on a group item, you MUST also set alignByColumn=true (the default pairing), unless the user explicitly asked for footer placement (then set showInGroupFooter=true instead).\n'
    + '- displayFormat (optional): format template for the rendered value. Placeholders: "{0}" — the formatted summary value; "{1}" — the parent column\'s caption (for group items only resolvable when showInColumn is specified). Example: "Sum: {0}" or "{1}: {0}".\n'
    + 'Group items additionally support:\n'
    + '- showInGroupFooter (optional): OMIT this field unless the user explicitly requests the group footer area. Default behavior renders the summary in the group row (the header that displays the group value). Set to true ONLY when the user explicitly says "group footer", "below the group", or "in the footer". Requests like "in the header", "in the group row", "next to the group name", or no placement mention at all → OMIT (do not set to false either; just omit the field).\n'
    + '- alignByColumn (optional): OMIT this field unless the user explicitly requests column-aligned layout. Default behavior lists items in parentheses after the group row caption (e.g. "Category: Bikes (Sum: 100, Count: 5)"). Set to true ONLY when the user explicitly asks to "align by column", "show under each column", or "align with the column". Otherwise OMIT.',
  schema: summaryCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const columnsController = component.getController('columns');
    const { totalItems, groupItems } = args;
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
      component.option('summary', { totalItems, groupItems });

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});

export const clearSummaryCommand = defineGridCommand({
  name: 'clearSummary',
  description: 'Remove ALL summary items. Do NOT call this for partial removals. Use only when every summary should be cleared (both totalItems and groupItems). To remove a subset — e.g., clear only totalItems while keeping groupItems (or vice versa), or drop a specific item — call the summary command with the items that should remain, since summary replaces existing summaries entirely.',
  schema: z.object({}).strict(),
  execute: (component, { success, failure }) => (): Promise<CommandResult> => {
    const defaultMessage = 'Clear column summaries.';

    try {
      component.option('summary', {
        groupItems: [],
        totalItems: [],
      });

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});
