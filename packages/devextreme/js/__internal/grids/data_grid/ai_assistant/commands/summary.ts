import type { SummaryType } from '@js/common/grids';
import { defineGridCommand } from '@ts/grids/grid_core/ai_assistant/commands/defineGridCommand';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import type { Column } from './types';

const SUMMARY_TYPES = ['sum', 'min', 'max', 'avg', 'count'] as const satisfies readonly SummaryType[];

const summaryItemSchema = z.object({
  column: z.string(),
  summaryType: z.enum(SUMMARY_TYPES),
}).strict();

const summaryCommandSchema = z.object({
  totalItems: z.array(summaryItemSchema).optional(),
  groupItems: z.array(summaryItemSchema).optional(),
}).strict();

type SummaryItem = z.infer<typeof summaryItemSchema>;

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
  description: 'Configure column summaries. totalItems aggregate the entire data set; groupItems aggregate within each group. Provide at least one item across the two arrays — use clearSummary to remove all summaries. Replaces existing summaries entirely; pre-merge with the grid\'s current summary items if you intend to add rather than replace.',
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

    const allColumnsResolve = allItems.every(
      (item) => columnsController.columnOption(item.column) !== undefined,
    );

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
      component.option('summary', undefined);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});
