import type { InternalGrid } from '../../m_types';
import type { ProcessedCommand } from '../types';

export interface GridCommand {
  readonly name: string;
  readonly description: string;
  readonly argsSchema: Record<string, unknown>;
  validateArgs: (args: Record<string, unknown>) => boolean;
  execute: (gridInstance: InternalGrid, args: Record<string, unknown>) => ProcessedCommand;
  buildContext: (gridInstance: InternalGrid, context: Record<string, unknown>) => void;
}
