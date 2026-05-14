import type { GridCommand } from '@ts/grids/grid_core/ai_assistant/types';

import { clearGroupingCommand, groupingCommand } from './grouping';
import { clearSummaryCommand, summaryCommand } from './summary';

export const dataGridCommands = [
  groupingCommand,
  clearGroupingCommand,
  summaryCommand,
  clearSummaryCommand,
  // TODO: try to remove "as GridCommand[]"
] as GridCommand[];
