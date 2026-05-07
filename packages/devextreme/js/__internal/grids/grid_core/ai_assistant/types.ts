import type { InternalGrid } from '@ts/grids/grid_core/m_types';
import type { z, ZodObject, ZodRawShape } from 'zod';
import type { JsonSchema7Type } from 'zod-to-json-schema';

/** JSON Schema draft-07 object sent to the LLM. */
export type JsonSchema = JsonSchema7Type & {
  $schema?: string;
};

export type CommandStatus = 'success' | 'failure' | 'aborted';

export interface CommandResult {
  status: CommandStatus;
  message: string;
}

export type CommandResults = CommandResult[];

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

export type CustomizeResponseText = (
  commandName: string,
  commandArgs: Record<string, unknown>,
) => Partial<CommandMessages> | undefined;
