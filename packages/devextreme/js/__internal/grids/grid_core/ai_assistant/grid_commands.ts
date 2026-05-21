import type { ExecuteGridAssistantAction } from '@js/common/ai-integration';
import messageLocalization from '@js/common/core/localization/message';
import type { CommandInfo } from '@js/common/grids';
import { isDefined, isObject } from '@js/core/utils/type';
import { logger } from '@ts/core/utils/m_console';
import {
  DEFAULT_FAILURE_MESSAGE,
  DEFAULT_SUCCESS_MESSAGE,
  EXECUTION_ABORT_MESSAGE,
} from '@ts/grids/grid_core/ai_assistant/const';
import { zodToJsonSchema } from 'zod-to-json-schema';

import type { InternalGrid } from '../m_types';
import type {
  CommandCallbacks,
  CommandResult,
  CustomizeResponseText,
  GridCommand,
  JsonSchema,
  ResponseSchemaBranch,
} from './types';
import { expandTypeArraysToAnyOf, hoistSchemaRefs } from './utils';

export class GridCommands {
  private readonly component: InternalGrid;

  private readonly commands: Map<string, GridCommand>;

  private executing = false;

  private aborted = false;

  constructor(component: InternalGrid, commands: GridCommand[]) {
    this.component = component;
    this.commands = new Map();

    for (const command of commands) {
      if (this.commands.has(command.name)) {
        logger.error(`Duplicate command name: "${command.name}"`);
      }
      this.commands.set(command.name, command);
    }
  }

  private static success(message?: string): CommandResult {
    return {
      status: 'success',
      message: message ?? messageLocalization.format(DEFAULT_SUCCESS_MESSAGE),
    };
  }

  private static failure(message?: string): CommandResult {
    return {
      status: 'failure',
      message: message ?? messageLocalization.format(DEFAULT_FAILURE_MESSAGE),
    };
  }

  private static applyCustomizedResponseText(
    result: CommandResult,
    command: CommandInfo,
    customizeResponseText?: CustomizeResponseText,
  ): void {
    const customMessages = customizeResponseText?.(command);
    const customMessage = customMessages?.[result.status];

    if (isDefined(customMessage)) {
      result.message = customMessage;
    }
  }

  public abort(): void {
    this.aborted = true;
  }

  public isAborted(): boolean {
    return this.aborted;
  }

  public isExecuting(): boolean {
    return this.executing;
  }

  private buildResponseSchemaBranches(): ResponseSchemaBranch[] {
    const commands = [...this.commands.values()];

    return commands.map((command) => {
      const argsSchema = zodToJsonSchema(command.schema, { target: 'openAi' }) as JsonSchema;

      // Remove $schema from nested schemas since it's only necessary at root
      delete argsSchema.$schema;

      const expandedArgsSchema = expandTypeArraysToAnyOf(argsSchema);

      return {
        commandName: command.name,
        branch: {
          type: 'object',
          description: command.description,
          required: ['name', 'args'],
          additionalProperties: false,
          properties: {
            name: {
              type: 'string',
              enum: [command.name],
            },
            args: expandedArgsSchema,
          },
        },
      };
    });
  }

  private enrichSchemaWithDefs(
    schema: JsonSchema,
    branches: ResponseSchemaBranch[],
  ): void {
    // Hoist $ref targets to root-level $defs (required by OpenAI)
    const defsInputs = branches.map(({ commandName, branch }) => ({
      prefix: commandName,
      schema: branch.properties.args as JsonSchema,
    }));
    const mergedDefs = hoistSchemaRefs(defsInputs);

    if (Object.keys(mergedDefs).length > 0) {
      schema.$defs = mergedDefs;
    }
  }

  public buildResponseSchema(): JsonSchema {
    const branches = this.buildResponseSchemaBranches();
    const itemsAnyOfSchema = branches.map(({ branch }) => branch);

    const schema: JsonSchema = {
      type: 'object',
      required: ['actions'],
      additionalProperties: false,
      properties: {
        actions: {
          type: 'array',
          description: 'The list of grid commands and corresponding arguments to execute',
          items: {
            anyOf: itemsAnyOfSchema,
          },
        },
      },
    };

    this.enrichSchemaWithDefs(schema, branches);

    return schema;
  }

  public validate(actions: ExecuteGridAssistantAction[]): boolean {
    for (const action of actions as Record<string, unknown>[]) {
      if (!action || typeof action.name !== 'string' || action.name === '') {
        return false;
      }

      const command = this.commands.get(action.name);

      if (!command || !isDefined(action.args) || !isObject(action.args)) {
        return false;
      }

      const parseResult = command.schema.strict().safeParse(action.args);

      if (!parseResult.success) {
        return false;
      }
    }

    return true;
  }

  private async executeCommand(
    command: GridCommand,
    args: Record<string, unknown>,
    callbacks: CommandCallbacks,
  ): Promise<CommandResult> {
    try {
      const executor = command.execute(this.component, callbacks);
      return await executor(args);
    } catch (e: unknown) {
      logger.error(`Error executing command "${command.name}":`, e);
      return GridCommands.failure();
    }
  }

  public async executeCommands(
    commands: ExecuteGridAssistantAction[],
    customizeResponseText?: CustomizeResponseText,
  ): Promise<CommandResult[]> {
    if (this.executing) {
      throw new Error('executeCommands is already in progress');
    }

    this.executing = true;
    this.aborted = false;

    const results: CommandResult[] = [];
    const callbacks: CommandCallbacks = {
      success: GridCommands.success,
      failure: GridCommands.failure,
    };

    try {
      for (const { name, args } of commands) {
        if (this.aborted) {
          results.push({
            status: 'aborted',
            message: messageLocalization.format(EXECUTION_ABORT_MESSAGE),
          });
          break;
        }

        const command = this.commands.get(name);

        // Ideally, this case should never happen since the validation is
        // performed beforehand, but it's better to handle it for future-proofing.
        if (!command) {
          throw new Error(`Unknown command: ${name}`);
        }
        // eslint-disable-next-line no-await-in-loop
        const result = await this.executeCommand(command, args, callbacks);

        GridCommands.applyCustomizedResponseText(
          result,
          { name, args } as CommandInfo,
          customizeResponseText,
        );
        results.push(result);
      }
    } finally {
      this.executing = false;
    }

    return results;
  }
}
