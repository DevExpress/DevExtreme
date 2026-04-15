import type { InternalGrid } from '../../m_types';
import type { ProcessedCommand } from '../types';

export interface GridCommand {
  readonly name: string;
  validateArgs: (args: Record<string, unknown>) => boolean;
  execute: (gridInstance: InternalGrid, args: Record<string, unknown>) => ProcessedCommand;
}
