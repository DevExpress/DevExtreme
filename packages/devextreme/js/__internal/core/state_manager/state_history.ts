import type {
  ILogger,
  IState,
  IStateChange,
  IStateHistory,
} from './interfaces';
import { deepCopy, splitStatePath } from './utils';

export class StateHistory implements IStateHistory {
  private history: IStateChange[] = [];

  private readonly maxHistorySize: number;

  private readonly logger: ILogger;

  constructor(logger: ILogger, maxHistorySize = 1000) {
    this.logger = logger;
    this.maxHistorySize = maxHistorySize;

    if (maxHistorySize <= 0) {
      logger.error('Max history size must be greater than 0');
    }
  }

  recordChange(change: IStateChange): void {
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

  getHistory(): IStateChange[] {
    return deepCopy(this.history);
  }

  getStateAt(index: number): IState {
    if (index < 0 || index >= this.history.length) {
      this.logger.error(`Invalid history index: ${index}. Valid range: 0-${this.history.length - 1}`);

      return {};
    }

    const result = this.history
      .slice(0, index + 1)
      .reduce<IState>((state, change) => {
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
