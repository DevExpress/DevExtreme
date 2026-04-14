import type { InternalGrid } from '@ts/grids/grid_core/m_types';
import type { ZodObject, ZodRawShape } from 'zod';

type CommandStatus = 'success' | 'failure' | 'aborted';

export interface CommandResult {
  status: CommandStatus;
  message: string;
}

export interface CommandCallbacks {
  success: (message?: string) => CommandResult;
  failure: (message?: string) => CommandResult;
}

// When TArgs default to `undefined`, the corresponding parameter is
// elided from the inner method signatures via these conditional tuples.
type ArgsTuple<T> = T extends undefined ? [] : [args: T];

export type CommandExecutor<TArgs = undefined> = (
  ...args: ArgsTuple<TArgs>
) => Promise<CommandResult>;

export interface GridCommand<TArgs = undefined> {
  name: string;
  description: string;
  schema: ZodObject<ZodRawShape>;
  execute: (component: InternalGrid, callbacks: CommandCallbacks) => CommandExecutor<TArgs>;
}

export interface CommandResponse {
  commands: Command[];
  explanation: string;
}

export interface Command {
  command: string;
  args: Record<string, unknown>;
}

export interface InternalRequestCallbacks {
  onComplete?: (finalResponse: CommandResponse) => void;
  onError?: (error: Error) => void;
}

export interface ProcessedCommand {
  status: 'success' | 'error';
  message: string;
}

export type ProcessedCommands = ProcessedCommand[];
