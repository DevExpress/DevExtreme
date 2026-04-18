import type { InternalGrid } from '../m_types';
import type { Command, CommandResults } from './types';

export class GridCommands {
  constructor(private readonly gridInstance: InternalGrid) {
  }

  // TODO: need to implement real validation logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public validate(commands: Command[]): boolean {
    return true;
  }

  // TODO: need to implement real command execution logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public executeCommands(commands: Command[]): Promise<CommandResults> {
    return Promise.resolve([{ status: 'success', message: 'Command executed successfully' }, { status: 'success', message: 'Error' }]);
  }
}
