import type { GridCommand } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

const pagingCommandSchema = z.object({
  enabled: z.boolean(),
}).strict();

type PagingCommandArgs = z.infer<typeof pagingCommandSchema>;

export const pagingCommand: GridCommand<PagingCommandArgs> = {
  name: 'paging',
  description: 'Enable or disable pagination',
  schema: pagingCommandSchema,
  execute: (component, { success, failure }) => (args) => {
    const defaultMessage = `Turn ${args.enabled ? 'on' : 'off'} pagination.`;

    try {
      component.option('paging.enabled', args.enabled);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
};

const pageSizeCommandSchema = z.object({
  // eslint-disable-next-line spellcheck/spell-checker
  pageSize: z.number().int().nonnegative(),
}).strict();

type PageSizeCommandArgs = z.infer<typeof pageSizeCommandSchema>;

export const pageSizeCommand: GridCommand<PageSizeCommandArgs> = {
  name: 'pageSize',
  description: 'Change the number of rows per page',
  schema: pageSizeCommandSchema,
  execute: (component, { success, failure }) => (args) => {
    const paging = component.option('paging');
    const defaultMessage = args.pageSize === 0
      ? 'Show all rows.'
      : `Change page size to ${args.pageSize}.`;

    if (paging?.enabled === false) {
      return Promise.resolve(failure(defaultMessage));
    }

    try {
      component.pageSize(args.pageSize);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
};

const pageIndexCommandSchema = z.object({
  // eslint-disable-next-line spellcheck/spell-checker
  pageIndex: z.number().int().nonnegative(),
}).strict();

type PageIndexCommandArgs = z.infer<typeof pageIndexCommandSchema>;

export const pageIndexCommand: GridCommand<PageIndexCommandArgs> = {
  name: 'pageIndex',
  description: 'Navigate to a specific page (0-based: page 0 is first)',
  schema: pageIndexCommandSchema,
  execute: (component, { success, failure }) => async (args) => {
    const paging = component.option('paging');
    const dataController = component.getController('data');
    const defaultMessage = `Switch the view to page number ${args.pageIndex}.`;

    const isIndexValid = args.pageIndex < dataController.pageCount();

    if (paging?.enabled === false || !isIndexValid) {
      return failure(defaultMessage);
    }

    try {
      await component.pageIndex(args.pageIndex);

      return success(defaultMessage);
    } catch {
      return failure(defaultMessage);
    }
  },
};
