import commands, { commandsCore } from '@ts/grids/grid_core/ai_assistant/commands';
import type { GridCommand } from '@ts/grids/grid_core/ai_assistant/types';

import { clearGroupingCommand, groupingCommand } from './grouping';
import { clearSummaryCommand, summaryCommand } from './summary';

export const dataGridCommands = [
  ...commandsCore,
  groupingCommand,
  clearGroupingCommand,
  summaryCommand,
  clearSummaryCommand,
] as GridCommand[];

export default {
  ...commands,
  groupingCommand,
  clearGroupingCommand,
  summaryCommand,
  clearSummaryCommand,
};
