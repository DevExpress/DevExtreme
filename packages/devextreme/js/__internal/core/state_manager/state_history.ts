import type * as StateManagementTypes from './types';
import { deepCopy, splitStatePath } from './utils';

export class StateHistory implements StateManagementTypes.StateHistory {
  private history: StateManagementTypes.StateChange[] = [];

  private readonly maxHistorySize: number;

  private readonly logger: StateManagementTypes.Logger;

  constructor(logger: StateManagementTypes.Logger, maxHistorySize = 1000) {
    this.logger = logger;
    this.maxHistorySize = maxHistorySize;

    if (maxHistorySize <= 0) {
      logger.error('Max history size must be greater than 0');
    }
  }

  recordChange(change: StateManagementTypes.StateChange): void {
    if (!change) {
      this.logger.error('Change object is required');
      return;
    }

    this.history.push(change);

    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    this.logger.debug(`Recorded state change: ${change.payload.path}`);
  }

  getHistory(): StateManagementTypes.StateChange[] {
    return deepCopy(this.history);
  }

  getStateAt(index: number): StateManagementTypes.State {
    if (index < 0 || index >= this.history.length) {
      this.logger.error(`Invalid history index: ${index}. Valid range: 0-${this.history.length - 1}`);

      return {};
    }

    const result = this.history
      .slice(0, index + 1)
      .reduce<StateManagementTypes.State>((state, change) => {
        const pathParts = splitStatePath(change.payload.path);

        return this.setNestedProperty(
          state,
          pathParts,
          change.payload.newValue,
        );
      }, {});

    return result;
  }

  private setNestedProperty<T>(
    obj: T,
    pathParts: string[],
    value: unknown,
  ): T {
    if (pathParts.length === 0) {
      return obj;
    }

    const [currentPart, ...remainingPath] = pathParts;

    if (remainingPath.length === 0) {
      return {
        ...obj,
        [currentPart]: value,
      };
    }

    return {
      ...obj,
      [currentPart]: this.setNestedProperty(
        (obj[currentPart] as Record<string, unknown>) ?? {} as Record<string, unknown>,
        remainingPath,
        value,
      ),
    };
  }

  clear(): void {
    this.history = [];
    this.logger.debug('Cleared state history');
  }
}
