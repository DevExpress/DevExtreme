import type { SortOrder } from '@js/common';

import type { InternalGrid } from '../../m_types';
import type { ProcessedCommand } from '../types';
import type { GridCommand } from './base';

interface SortArgs {
  columnName: string;
  sortOrder: SortOrder;
}

export const SORT_COMMAND_NAME = 'sort';

export const sortCommand: GridCommand = {
  name: SORT_COMMAND_NAME,

  validateArgs(args: Record<string, unknown>): boolean {
    const { columnName, sortOrder } = args;

    if (typeof columnName !== 'string' || columnName.length === 0) {
      return false;
    }

    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      return false;
    }

    return true;
  },

  execute(gridInstance: InternalGrid, args: Record<string, unknown>): ProcessedCommand {
    try {
      const { columnName, sortOrder } = args as unknown as SortArgs;
      const columnsController = gridInstance._controllers.columns;

      columnsController.columnOption(columnName, 'sortOrder', sortOrder);

      return {
        status: 'success',
        message: `Column '${columnName}' sorted by '${sortOrder}'.`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { status: 'error', message };
    }
  },
};
