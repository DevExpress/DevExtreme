import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';

const pagingCommandSchema = z.object({
  enabled: z.boolean(),
}).strict();

export const pagingCommand = defineGridCommand({
  name: 'paging',
  description: 'Enable or disable pagination',
  schema: pagingCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const defaultMessage = `Turn ${args.enabled ? 'on' : 'off'} pagination.`;

    try {
      component.option('paging.enabled', args.enabled);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});

const pageSizeCommandSchema = z.object({
  // eslint-disable-next-line spellcheck/spell-checker
  pageSize: z.number().int().nonnegative(),
}).strict();

export const pageSizeCommand = defineGridCommand({
  name: 'pageSize',
  description: 'Change the number of rows per page. Pass 0 to show all rows on a single page.',
  schema: pageSizeCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const paging = component.option('paging');
    const defaultMessage = args.pageSize === 0
      ? 'Display all rows.'
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
});

const pageIndexCommandSchema = z.object({
  // eslint-disable-next-line spellcheck/spell-checker
  pageIndex: z.number().int().nonnegative(),
}).strict();

export const pageIndexCommand = defineGridCommand({
  name: 'pageIndex',
  description: 'Navigate to a specific page. If the user asks to set pageIndex, it is 0-based: page 0 is the first; pageIndex must be less than the total page count. But if the user asks to change the page number, it is 1-based. So the first page has pageIndex=0, the fifth page has pageIndex=4.',
  schema: pageIndexCommandSchema,
  execute: (component, { success, failure }) => async (args): Promise<CommandResult> => {
    const paging = component.option('paging');
    const dataController = component.getController('data');
    const defaultMessage = `Switch the view to page number ${args.pageIndex + 1}.`;

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
});
