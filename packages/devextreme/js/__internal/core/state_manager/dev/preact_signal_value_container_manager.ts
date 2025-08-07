import type * as StateManagementTypes from './types';

function isSignal(value: { brand?: symbol } | unknown):
  value is StateManagementTypes.ObservableValueContainer {
  if (value && typeof value === 'object' && 'brand' in value) {
    return value.brand === Symbol.for('preact-signals');
  }

  return false;
}

export class PreactSignalValueContainerManager
implements StateManagementTypes.ValueContainerManager {
  constructor(
    private readonly logger: StateManagementTypes.Logger,
    private readonly stateSourceSign: string,
    private readonly valueContainer: StateManagementTypes.ObservableValueContainer,
  ) {

  }

  trackChanges(
    onChange: StateManagementTypes.ValueContainerChangeCallback,
  ): void {
    if (!onChange || typeof onChange !== 'function') {
      this.logger.error('onChange callback is required');
      return;
    }

    const previousValue = this.getValue();

    this.valueContainer.subscribe((newValue) => {
      try {
        const payload: StateManagementTypes.ValueContainerChange['payload'] = {
          previousValue,
          newValue,
          timestamp: Date.now(),
          source: this.captureSource(this.valueContainer),
        };

        const change: StateManagementTypes.ValueContainerChange = {
          payload,
        };

        onChange(change);
      } catch (error) {
        this.logger.error('Error in Preact Signal subscription', error);
      }
    });
  }

  getValue(): StateManagementTypes.ObservableValueContainer['value'] {
    return this.valueContainer.peek();
  }

  private captureSource(valueContainer: StateManagementTypes.ObservableValueContainer): string {
    if (valueContainer.stack) {
      const { stack } = valueContainer;

      return this.findStateSourceLine(stack).trim();
    }

    return 'The source is not tracked';
  }

  private findStateSourceLine(stack: string): string {
    const lines = stack.split('\n');

    const stateSourceLine = lines
      .find((line) => line.includes(this.stateSourceSign));

    return stateSourceLine ?? (lines.length > 1 ? lines[1] : '');
  }
}

export const PreactSignalValueContainerManagerFactory:
StateManagementTypes.ValueContainerManagerConstructor = {
  canHandle(
    valueContainer: StateManagementTypes.MaybeValueContainer,
  ): valueContainer is StateManagementTypes.ObservableValueContainer {
    return isSignal(valueContainer);
  },

  create(
    logger: StateManagementTypes.Logger,
    stateSourceSign: string,
    valueContainer: StateManagementTypes.MaybeValueContainer,
  ): StateManagementTypes.ValueContainerManager {
    if (!isSignal(valueContainer)) {
      throw new Error('Invalid value container for PreactSignalValueContainerManager');
    }

    return new PreactSignalValueContainerManager(logger, stateSourceSign, valueContainer);
  },
};
