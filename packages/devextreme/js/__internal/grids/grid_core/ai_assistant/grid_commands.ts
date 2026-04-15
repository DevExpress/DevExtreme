import type { InternalGrid } from '../m_types';
import type { GridCommand } from './commands/base';
import { defaultCommands } from './commands/index';
import type { Command, ProcessedCommand, ProcessedCommands } from './types';

export class GridCommands {
  private readonly commandsMap: Map<string, GridCommand>;

  constructor(private readonly gridInstance: InternalGrid) {
    this.commandsMap = new Map(
      defaultCommands.map((command) => [command.name, command]),
    );
  }

  public validate(commands: Command[]): boolean {
    for (const item of commands) {
      const gridCommand = this.commandsMap.get(item.name);

      if (!gridCommand) {
        return false;
      }

      if (!gridCommand.validateArgs(item.args)) {
        return false;
      }
    }

    return true;
  }

  public executeCommands(commands: Command[]): ProcessedCommands {
    const results: ProcessedCommands = [];

    for (const item of commands) {
      const result = this.executeCommand(item.name, item.args);
      results.push(result);
    }

    return results;
  }

  private executeCommand(commandName: string, args: Record<string, unknown>): ProcessedCommand {
    const gridCommand = this.commandsMap.get(commandName);

    if (!gridCommand) {
      return { status: 'error', message: `Unknown command: ${commandName}` };
    }

    return gridCommand.execute(this.gridInstance, args);
  }
}
