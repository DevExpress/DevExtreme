import { EventEmitter } from './event_emitter';
import type { IController, IControllerRegistry, ILogger } from './interfaces';

export class ControllerRegistry implements IControllerRegistry {
  private controllers: Record<string, IController> = {};

  private readonly logger: ILogger;

  private readonly controllerRegisteredEmitter: EventEmitter<
    (controller: IController, id: string) => void>;

  constructor(logger: ILogger) {
    this.logger = logger;
    this.controllerRegisteredEmitter = new EventEmitter<(controller: IController,
    id: string) => void
      >(
      'controllerRegistered',
      logger,
      );
  }

  registerController(controller: IController, controllerId: string): string {
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

  getController(id: string): IController | null {
    if (!id) {
      this.logger.error('Controller ID cannot be null or undefined');

      return null;
    }

    const controller = this.controllers[id];

    if (!controller) {
      this.logger.warn(`No controller found with ID: ${id}`);
    }

    return controller;
  }

  getAllControllers(): Record<string, IController> {
    return { ...this.controllers };
  }

  onControllerRegistered(
    callback: (controller: IController, id: string) => void,
  ): void {
    this.controllerRegisteredEmitter.addListener(callback);
  }
}
