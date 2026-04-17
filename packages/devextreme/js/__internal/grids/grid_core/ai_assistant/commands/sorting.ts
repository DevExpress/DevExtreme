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

  description: 'Sorts the grid by a specified column in ascending or descending order.',

  argsSchema: {
    type: 'object',
    properties: {
      columnName: {
        type: 'string',
        description: 'The name or dataField of the column to sort.',
      },
      sortOrder: {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'The sort direction.',
      },
    },
    required: ['columnName', 'sortOrder'],
  },

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

  buildContext(gridInstance: InternalGrid, context: Record<string, unknown>): void {
    const columnsController = gridInstance._controllers.columns;
    const visibleColumns = columnsController.getVisibleColumns();

    const columns = visibleColumns
      .filter((column) => !!column.dataField)
      .map((column) => {
        const info: Record<string, string> = {
          name: column.name ?? column.dataField,
          dataField: column.dataField,
        };

        if (column.dataType) {
          info.dataType = column.dataType;
        }

        if (column.caption) {
          info.caption = column.caption;
        }

        return info;
      });

    context.columns = columns;
  },
};
