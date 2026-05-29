import type { CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { z } from 'zod';

import { defineGridCommand } from './defineGridCommand';

const searchingCommandSchema = z.object({
  text: z.string(),
}).strict();

export const searchingCommand = defineGridCommand({
  name: 'searching',
  description: 'Set the global search text that filters rows across all searchable columns. Pass empty string to clear search.',
  schema: searchingCommandSchema,
  execute: (component, { success, failure }) => (args): Promise<CommandResult> => {
    const defaultMessage = args.text === ''
      ? 'Clear search.'
      : `Search for "${args.text}".`;

    try {
      component.searchByText(args.text);

      return Promise.resolve(success(defaultMessage));
    } catch {
      return Promise.resolve(failure(defaultMessage));
    }
  },
});
