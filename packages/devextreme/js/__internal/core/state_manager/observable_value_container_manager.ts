/* eslint-disable max-classes-per-file */
import type * as StateManagementTypes from './types';
import { deepCopy } from './utils';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Observable {

}

export class ObservableValueContainerManager implements StateManagementTypes.ValueContainerManager {
  private readonly logger: StateManagementTypes.Logger;

  private readonly stateSourceSign: string;

  private readonly valueContainer: StateManagementTypes.ObservableValueContainer;

  constructor(
    logger: StateManagementTypes.Logger,
    stateSourceSign: string,
    valueContainer: StateManagementTypes.ObservableValueContainer,
  ) {
    this.logger = logger;

    this.stateSourceSign = stateSourceSign;
    this.valueContainer = valueContainer;
  }

  trackChanges(
    onChange: StateManagementTypes.ValueContainerChangeCallback,
  ): void {
    if (!onChange || typeof onChange !== 'function') {
      this.logger.error('onChange callback is required');
      return;
    }

    let previousValue = this.getValue();

    if (this.valueContainer.subscribe) {
      this.valueContainer.subscribe((newValue) => {
        try {
          const payload: StateManagementTypes.ValueContainerChange['payload'] = {
            previousValue: typeof previousValue === 'object' && previousValue !== null ? deepCopy(previousValue) : previousValue,
            newValue: typeof newValue === 'object' && newValue !== null ? deepCopy(newValue) : newValue,
            timestamp: Date.now(),
            source: this.captureSource(this.valueContainer),
          };

          const change: StateManagementTypes.ValueContainerChange = {
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
      const payload: StateManagementTypes.ValueContainerChange['payload'] = {
        previousValue: undefined,
        newValue: typeof previousValue === 'object' && previousValue !== null ? deepCopy(previousValue) : previousValue,
        timestamp: Date.now(),
        source: this.captureSource(this.valueContainer),
      };

      const initialChange: StateManagementTypes.ValueContainerChange = {
        actionType: 'INITIALIZE',
        payload,
      };

      onChange(initialChange);
    } catch (error) {
      this.logger.error('Error in processing Observable initialization', error);
    }
  }

  getValue(): ReturnType<StateManagementTypes.ObservableValueContainer['unreactive_get']> {
    // eslint-disable-next-line spellcheck/spell-checker
    return this.valueContainer.unreactive_get();
  }

  private captureSource(valueContainer?: StateManagementTypes.ObservableValueContainer): string {
    if (valueContainer?.stack) {
      const { stack } = valueContainer;

      return this.findStateSourceLine(stack);
    }

    return 'The source is not tracked';
  }

  private findStateSourceLine(stack: string): string {
    const lines = stack.split('\n');

    const controllerLine = lines.find((line) => line.includes(this.stateSourceSign));

    return controllerLine ?? (lines.length > 1 ? lines[1] : '');
  }
}

function isObservableValueContainer(
  valueContainer: StateManagementTypes.MaybeValueContainer,
): valueContainer is StateManagementTypes.ObservableValueContainer {
  return isSignal(valueContainer);
}

export const ReactiveValueContainerManagerFactory:
StateManagementTypes.ValueContainerManagerConstructor = {
  canHandle(
    valueContainer: StateManagementTypes.MaybeValueContainer,
  ): valueContainer is StateManagementTypes.ObservableValueContainer {
    return isObservableValueContainer(valueContainer);
  },

  create(
    logger: StateManagementTypes.Logger,
    stateSourceSign: string,
    valueContainer: StateManagementTypes.MaybeValueContainer,
  ): StateManagementTypes.ValueContainerManager {
    if (!isObservableValueContainer(valueContainer)) {
      throw new Error('Invalid value container for ReactiveValueContainerManager');
    }

    return new ReactiveValueContainerManager(logger, stateSourceSign, valueContainer);
  },
};
