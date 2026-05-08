import { defineGridCommand } from '@ts/grids/grid_core/ai_assistant/commands/defineGridCommand';
import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import type { Column } from './types';

const groupingCommandSchema = z.object({
  dataField: z.string(),
  // eslint-disable-next-line spellcheck/spell-checker
  groupIndex: z.number().int().nonnegative().nullable(),
}).strict();

const getGroupingDefaultMessage = (
  args: z.infer<typeof groupingCommandSchema>,
  column: Column | undefined,
): string => {
  const columnName = column?.caption ?? args.dataField;

  if (args.groupIndex === null) {
    return `Ungroup data against "${columnName}".`;
  }

  return `Group data against "${columnName}".`;
};

export const groupingCommand = defineGridCommand({
  name: 'grouping',
  description: 'Group rows by a column at the given level (0 = outermost). Setting groupIndex to an in-use value shifts the existing column down; gaps auto-collapse. Pass null to ungroup. To replace existing grouping, ungroup each currently grouped column, then group new ones at consecutive indices 0, 1, 2, ...',
  schema: groupingCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const columnsController = component.getController('columns');
    const column: Column | undefined = columnsController.columnOption(args.dataField);
    const defaultMessage = getGroupingDefaultMessage(args, column);

    if (!column || column.allowGrouping === false) {
      return Promise.resolve(failure(defaultMessage));
    }

    try {
      // Handles remote operations via data controller listening for the `grouping` change
      columnsController.columnOption(column.index, 'groupIndex', args.groupIndex ?? undefined);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});

export const clearGroupingCommand = defineGridCommand({
  name: 'clearGrouping',
  description: 'Remove grouping from all columns',
  schema: z.object({}).strict(),
  execute: (component, { success, failure }) => (): Promise<CommandResult> => {
    const defaultMessage = 'Clear grouping.';

    try {
      // Handles remote operations via data controller listening for the `grouping` change
      component.getController('columns').clearGrouping();

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});
