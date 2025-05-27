import { EventEmitter } from './event_emitter';
import type * as StateManagementTypes from './types';

type ControllerEventEmitter = (controller: StateManagementTypes.Controller, id: string) => void;

export class ControllerRegistry implements StateManagementTypes.ControllerRegistry {
  private controllers: Record<string, StateManagementTypes.Controller> = {};

  private readonly logger: StateManagementTypes.Logger;

  private readonly controllerRegisteredEmitter: EventEmitter<
    (controller: StateManagementTypes.Controller, id: string) => void>;

  constructor(logger: StateManagementTypes.Logger) {
    this.logger = logger;

    this.controllerRegisteredEmitter = new EventEmitter<ControllerEventEmitter>(
      'controllerRegistered',
      logger,
    );
  }

  registerController(controller: StateManagementTypes.Controller, controllerId: string): string {
    if (!controller) {
      this.logger.error('Controller cannot be null or undefined');

      return '';
    }

    if (this.controllers[controllerId]) {
      this.logger.debug(`Controller with ID ${controllerId} is already registered. Overwriting.`);
    }

    this.controllers[controllerId] = controller;
    this.logger.debug(`Registered controller: ${controllerId}`);

    this.controllerRegisteredEmitter.emit(controller, controllerId);

    return controllerId;
  }

  getController(id: string): StateManagementTypes.Controller | undefined {
    if (!id) {
      this.logger.error('Controller ID cannot be null or undefined');

      return undefined;
    }

    const controller = this.controllers[id];

    if (!controller) {
      this.logger.warn(`No controller found with ID: ${id}`);
    }

    return controller;
  }

  getAllControllers(): Record<string, StateManagementTypes.Controller> {
    return { ...this.controllers };
  }

  onControllerRegistered(
    callback: (controller: StateManagementTypes.Controller, id: string) => void,
  ): void {
    this.controllerRegisteredEmitter.addListener(callback);
  }
}
