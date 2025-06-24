// eslint-disable-next-line max-classes-per-file
import type {
  ILogger,
  IMaybeObservableStateContainer,
  IObservableStateContainer,
  IStateChange,
  IStateChangeCallback,
  IStateChangePayload,
  IStateContainerManager,
} from './interfaces';
import { areEqual, deepCopy } from './utils';

// TODO: remove me
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Observable {

}

export class ObservableStateContainerManager implements IStateContainerManager {
  private readonly logger: ILogger;

  private readonly controllerSign: string;

  constructor(logger: ILogger, controllerSign: string) {
    this.logger = logger;
    this.controllerSign = controllerSign;
  }

  canHandle(
    stateContainer: IMaybeObservableStateContainer,
  ): stateContainer is IObservableStateContainer {
    return stateContainer instanceof Observable;
  }

  trackChanges(
    stateContainer: IMaybeObservableStateContainer,
    stateName: string,
    onChange: IStateChangeCallback,
  ): void {
    if (!this.canHandle(stateContainer)) {
      this.logger.error('State container is not an Observable');
      return;
    }

    if (!stateName) {
      this.logger.error('State name is required');
      return;
    }

    if (!onChange || typeof onChange !== 'function') {
      this.logger.error('onChange callback is required');
      return;
    }

    // eslint-disable-next-line spellcheck/spell-checker
    let previousValue = stateContainer.unreactive_get();

    const originalUpdate = stateContainer.update;
    stateContainer.update = (newValue): void => {
      try {
        // eslint-disable-next-line spellcheck/spell-checker
        const currentValue = stateContainer.unreactive_get();

        if (areEqual(currentValue, newValue)) {
          originalUpdate.call(stateContainer, newValue);

          return;
        }

        const payload: IStateChangePayload = {
          path: stateName,
          previousValue: typeof currentValue === 'object' && currentValue !== null ? deepCopy(currentValue) : currentValue,
          newValue: typeof newValue === 'object' && newValue !== null ? deepCopy(newValue) : newValue,
          timestamp: Date.now(),
          source: this.captureSource(stateContainer),
        };

        const change: IStateChange = {
          actionType: 'UPDATE',
          payload,
        };

        previousValue = typeof newValue === 'object' && newValue !== null ? deepCopy(newValue) : newValue;

        originalUpdate.call(stateContainer, newValue);

        onChange(change);
      } catch (error) {
        this.logger.error('Error processing Observable change', error);

        originalUpdate.call(stateContainer, newValue);
      }
    };

    if (stateContainer.subscribe) {
      stateContainer.subscribe((newValue) => {
        try {
          if (areEqual(previousValue, newValue)) {
            return;
          }

          const payload: IStateChangePayload = {
            path: stateName,
            previousValue: typeof previousValue === 'object' && previousValue !== null ? deepCopy(previousValue) : previousValue,
            newValue: typeof newValue === 'object' && newValue !== null ? deepCopy(newValue) : newValue,
            timestamp: Date.now(),
            source: this.captureSource(stateContainer),
          };

          const change: IStateChange = {
            actionType: 'UPDATE',
            payload,
          };

          previousValue = typeof newValue === 'object' && newValue !== null ? deepCopy(newValue) : newValue;

          onChange(change);
        } catch (error) {
          this.logger.error('Error in Observable subscription', error);
        }
      });
    }

    try {
      const payload: IStateChangePayload = {
        path: stateName,
        previousValue: undefined,
        newValue: typeof previousValue === 'object' && previousValue !== null ? deepCopy(previousValue) : previousValue,
        timestamp: Date.now(),
        source: this.captureSource(stateContainer),
      };

      const initialChange: IStateChange = {
        actionType: 'INITIALIZE',
        payload,
      };

      onChange(initialChange);
    } catch (error) {
      this.logger.error('Error sending initial state', error);
    }

    this.logger.debug(`Tracking changes for Observable: ${stateName}`);
  }

  applyState(
    stateContainer: IMaybeObservableStateContainer,
    stateName: string,
    newState: unknown,
  ): void {
    if (!this.canHandle(stateContainer)) {
      this.logger.error('State container is not an Observable');
      return;
    }

    try {
      stateContainer.update(newState);
      this.logger.debug(`Applied state to Observable: ${stateName}`);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);

      this.logger.error(`Failed to apply state to Observable: ${stateName}`, errorMessage);
    }
  }

  getState(stateContainer: IMaybeObservableStateContainer): ReturnType<IObservableStateContainer['unreactive_get']> {
    if (!this.canHandle(stateContainer)) {
      this.logger.error('State container is not an Observable');
      return null;
    }

    // eslint-disable-next-line spellcheck/spell-checker
    return stateContainer.unreactive_get();
  }

  private captureSource(stateContainer?: IObservableStateContainer): string {
    if (stateContainer?.stack) {
      const { stack } = stateContainer;

      return this.findControllerLine(stack);
    }

    return 'The source is not tracked';
  }

  private findControllerLine(stack: string): string {
    const lines = stack.split('\n');

    const controllerLine = lines.find((line) => line.includes(this.controllerSign));

    return controllerLine ?? (lines.length > 1 ? lines[1] : '');
  }
}
