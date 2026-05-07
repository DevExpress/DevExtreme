import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';

const sortingCommandSchema = z.object({
  dataField: z.string(),
  sortOrder: z.enum(['asc', 'desc', 'none']),
}).strict();

const getSortingDefaultMessage = (
  args: z.infer<typeof sortingCommandSchema>,
  column: Column | undefined,
): string => {
  const columnName = column?.caption ?? args.dataField;

  if (args.sortOrder === 'none') {
    return `Clear sorting against "${columnName}".`;
  }

  const sortOrder = args.sortOrder === 'asc' ? 'ascending' : 'descending';

  return `Sort data against "${columnName}" in ${sortOrder} order.`;
};

export const sortingCommand = defineGridCommand({
  name: 'sorting',
  description: 'Sort a column ascending or descending. Pass sortOrder "none" to remove sorting from this column only (use clearSorting to remove sorting from all columns).',
  schema: sortingCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const columnsController = component.getController('columns');
    const column: Column | undefined = columnsController.columnOption(args.dataField);
    const defaultMessage = getSortingDefaultMessage(args, column);

    if (!column || !columnsController.allowColumnSorting(column)) {
      return Promise.resolve(failure(defaultMessage));
    }

    try {
      // Handles remote operations via data controller listening for the `sorting` change
      columnsController.changeSortOrder(column.index, args.sortOrder);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});

export const clearSortingCommand = defineGridCommand({
  name: 'clearSorting',
  description: 'Remove sorting from all columns',
  schema: z.object({}).strict(),
  execute: (component, { success, failure }) => (): Promise<CommandResult> => {
    const defaultMessage = 'Clear sorting.';

    try {
      // Handles remote operations via data controller listening for the `sorting` change
      component.clearSorting();

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});
