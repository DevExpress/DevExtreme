import type { InternalGrid } from '../m_types';
import type { GridCommand } from './commands/base';
import { defaultCommands } from './commands/index';
import type { Command, ProcessedCommand, ProcessedCommands } from './types';

const commandsMap: Map<string, GridCommand> = new Map(
  defaultCommands.map((command) => [command.name, command]),
);

export function buildResponseSchema(): Record<string, unknown> {
  return {
    type: 'object',
    properties: {
      actions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              enum: defaultCommands.map((command) => command.name),
              description: 'The name of the command to execute.',
            },
            args: {
              type: 'object',
              description: 'The arguments for the command. Schema depends on the command name.',
              oneOf: defaultCommands.map((command) => ({
                title: command.name,
                description: command.description,
                ...command.argsSchema,
              })),
            },
          },
          required: ['name', 'args'],
        },
      },
    },
    required: ['actions'],
  };
}

export function buildContext(
  gridInstance: InternalGrid,
): Record<string, unknown> {
  const context: Record<string, unknown> = {};

  for (const command of commandsMap.values()) {
    command.buildContext(gridInstance, context);
  }

  return context;
}

export function validate(commands: Command[]): boolean {
  for (const item of commands) {
    const gridCommand = commandsMap.get(item.name);

    if (!gridCommand) {
      return false;
    }

    if (!gridCommand.validateArgs(item.args)) {
      return false;
    }
  }

  return true;
}

function executeCommand(
  gridInstance: InternalGrid,
  commandName: string,
  args: Record<string, unknown>,
): ProcessedCommand {
  const gridCommand = commandsMap.get(commandName);

  if (!gridCommand) {
    return { status: 'error', message: `Unknown command: ${commandName}` };
  }

  return gridCommand.execute(gridInstance, args);
}

export function executeCommands(
  gridInstance: InternalGrid,
  commands: Command[],
): ProcessedCommands {
  const results: ProcessedCommands = [];

  for (const item of commands) {
    const result = executeCommand(gridInstance, item.name, item.args);
    results.push(result);
  }

  return results;
}
