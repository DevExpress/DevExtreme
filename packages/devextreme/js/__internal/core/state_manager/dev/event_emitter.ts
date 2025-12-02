import type * as StateManagementTypes from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventEmitter<T extends (...args: any[]) => void> {
  private readonly listeners: T[] = [];

  constructor(
    private readonly eventName: string,
    private readonly logger: StateManagementTypes.Logger,
  ) {

  }

  addListener(callback: T): void {
    if (!callback || typeof callback !== 'function') {
      this.logger.error(`Callback for ${this.eventName} must be a function`);
      return;
    }

    this.listeners.push(callback);
  }

  emit(...args: Parameters<T>): void {
    this.listeners.forEach((listener) => {
      try {
        listener(...args);
      } catch (error) {
        this.logger.error(`Error in ${this.eventName} listener`, error);
      }
    });
  }
}
