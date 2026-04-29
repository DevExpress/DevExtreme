import type { ExecuteGridAssistantAction } from '@js/common/ai-integration';

import type { InternalGrid } from '../m_types';
import type { CommandResults } from './types';

export class GridCommands {
  constructor(private readonly gridInstance: InternalGrid) {
  }

  // TODO: need to implement real validation logic
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public validate(actions: ExecuteGridAssistantAction[]): boolean {
    return true;
  }

  // TODO: need to implement real command execution logic
  public executeCommands(actions: ExecuteGridAssistantAction[]): Promise<CommandResults> {
    return Promise.resolve(actions.map((action) => ({
      status: action.name.includes('Error') ? 'failure' : 'success',
      message: action.name,
    })));
  }
}
