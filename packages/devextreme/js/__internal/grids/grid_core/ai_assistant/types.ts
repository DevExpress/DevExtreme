import type { RequestCallbacks } from '@js/common/ai-integration';
import type { Message } from '@js/ui/chat';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';
import type { z, ZodObject, ZodRawShape } from 'zod';

import type { MessageStatus } from './const';

/** JSON Schema object sent to the LLM. */
export type JsonSchema = Record<string, unknown>;

export interface ResponseSchemaBranch {
  commandName: string;
  branch: {
    type: string;
    description: string;
    required: string[];
    additionalProperties: boolean;
    properties: {
      name: { type: string; enum: string[] };
      args: JsonSchema | undefined;
    };
  };
}

export type CommandStatus = 'success' | 'failure' | 'aborted';

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

// Empty schemas (no keys) collapse args to `undefined` so the executor
// signature becomes `() => Promise<CommandResult>` for no-arg commands.
type CommandArgs<TSchema extends ZodObject<ZodRawShape>> = keyof z.infer<TSchema> extends never
  ? undefined
  : z.infer<TSchema>;

export interface GridCommand<
  TSchema extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
> {
  name: string;
  description: string;
  schema: TSchema;
  execute: (
    component: InternalGrid,
    callbacks: CommandCallbacks,
  ) => CommandExecutor<CommandArgs<TSchema>>;
}

export interface CommandMessages {
  success: string;
  failure: string;
}

// TODO: move to d.ts
export type CustomizeResponseText = (
  commandName: string,
  commandArgs: Record<string, unknown>,
) => Partial<CommandMessages> | undefined;

// TODO: move to d.ts
export type CustomizeResponseTitle = (
  status: MessageStatus,
  commandNames: string[],
) => string;

export type AIAssistantRequestCallbacks<T> = RequestCallbacks<T> & {
  onAbort?: () => void;
};

export type GridContext = Record<string, unknown>;

export type AIMessage = Message & {
  id: string;
  status: MessageStatus;
  headerText: string;
  prompt: string;
  errorText?: string;
  commands?: CommandResult[];
};
