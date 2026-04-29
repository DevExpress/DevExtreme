import type {
  ExecuteGridAssistantAction,
} from '@js/common/ai-integration';
import messageLocalization from '@js/common/core/localization/message';
import { isDefined, isObject } from '@js/core/utils/type';
import { zodToJsonSchema } from 'zod-to-json-schema';

import type { InternalGrid } from '../m_types';
import type {
  CommandCallbacks,
  CommandResult,
  CustomizeResponseText,
  GridCommand,
  JsonSchema,
} from './types';

const DEFAULT_SUCCESS_MESSAGE = 'dxDataGrid-aiAssistantSuccessMessage';
const DEFAULT_FAILURE_MESSAGE = 'dxDataGrid-aiAssistantErrorMessage';
const EXECUTION_ABORT_MESSAGE = 'dxDataGrid-aiAssistantExecutionAbortMessage';

export class GridCommands {
  private readonly component: InternalGrid;

  private readonly commands: Map<string, GridCommand<Record<string, unknown>>>;

  private _executing = false;

  private _aborted = false;

  constructor(component: InternalGrid, commands: GridCommand[]) {
    this.component = component;
    this.commands = new Map();

    for (const command of commands) {
      if (this.commands.has(command.name)) {
        throw new Error(`Duplicate command name: "${command.name}"`);
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
    name: string,
    args: Record<string, unknown>,
    customizeResponseText?: CustomizeResponseText,
  ): void {
    const customMessages = customizeResponseText?.(name, args);
    const customMessage = customMessages?.[result.status];

    if (isDefined(customMessage)) {
      result.message = customMessage;
    }
  }

  public abort(): void {
    this._aborted = true;
  }

  public isAborted(): boolean {
    return this._aborted;
  }

  public isExecuting(): boolean {
    return this._executing;
  }

  public buildResponseSchema(): JsonSchema {
    const branches = [...this.commands.values()].map((command) => {
      const argsSchema = zodToJsonSchema(command.schema, { target: 'jsonSchema7' });

      // Remove $schema from nested schemas since it's only necessary at root
      delete argsSchema.$schema;

      return {
        type: 'object',
        description: command.description,
        required: ['name', 'args'],
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
            enum: [command.name],
          },
          args: argsSchema,
        },
      };
    });

    return {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      required: ['actions'],
      additionalProperties: false,
      properties: {
        actions: {
          type: 'array',
          description: 'The list of grid commands and corresponding arguments to execute',
          items: {
            anyOf: branches,
          },
        },
      },
    };
  }

  public validateResponse(response: unknown): boolean {
    const res = response as Record<string, unknown>;

    if (!res || !Array.isArray(res.actions)) {
      return false;
    }

    for (const action of res.actions as Record<string, unknown>[]) {
      if (!action || typeof action.name !== 'string' || action.name === '') {
        return false;
      }

      const command = this.commands.get(action.name);

      if (!command) {
        return false;
      }

      if (!isDefined(action.args) || !isObject(action.args)) {
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
    command: GridCommand<Record<string, unknown>>,
    args: Record<string, unknown>,
    callbacks: CommandCallbacks,
  ): Promise<CommandResult> {
    try {
      const executor = command.execute(this.component, callbacks);
      return await executor(args);
    } catch (e: unknown) {
      console.error(`Error executing command "${command.name}":`, e);
      return GridCommands.failure();
    }
  }

  public async executeCommands(
    commands: ExecuteGridAssistantAction[],
    customizeResponseText?: CustomizeResponseText,
  ): Promise<CommandResult[]> {
    if (this._executing) {
      throw new Error('executeCommands is already in progress');
    }

    this._executing = true;
    this._aborted = false;

    const results: CommandResult[] = [];
    const callbacks: CommandCallbacks = {
      success: GridCommands.success,
      failure: GridCommands.failure,
    };

    for (const { name, args } of commands) {
      if (this._aborted) {
        results.push({
          status: 'aborted',
          message: messageLocalization.format(EXECUTION_ABORT_MESSAGE),
        });
        break;
      }

      const command = this.commands.get(name);

      if (!command) {
        this._executing = false;
        throw new Error(`Unknown command: ${name}`);
      }
      // eslint-disable-next-line no-await-in-loop
      const result = await this.executeCommand(command, args, callbacks);

      GridCommands.applyCustomizedResponseText(result, name, args, customizeResponseText);
      results.push(result);
    }

    this._executing = false;

    return results;
  }
}
