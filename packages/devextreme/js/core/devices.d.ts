import { Device, EventName } from '../common/core/environment';

export {
  Device,
} from '../common/core/environment';

/**
 * An object that serves as a namespace for the methods and events specifying information on the current device.
 */
declare class DevicesObject {
  constructor(options?: { window?: Window });
  /**
   * Gets information on the current device.
   */
  current(): Device;
  /**
   * Overrides actual device information to force the application to operate as if it was running on a specified device.
   */
  current(deviceName: string | Device): void;
  /**
   * Detaches all event handlers from a single event.
   */
  off(eventName: EventName): this;
  /**
   * Detaches a particular event handler from a single event.
   */
  off(eventName: EventName, eventHandler: Function): this;
  /**
   * Subscribes to an event.
   */
  on(eventName: EventName, eventHandler: Function): this;
  /**
   * Subscribes to events.
   */
  on(events: { [key in EventName]?: Function }): this;
  /**
   * Returns the current device orientation.
   */
  orientation(): 'portrait' | 'landscape' | undefined;
  /**
   * Returns real information about the current device regardless of the value passed to the DevExpress.devices.current(deviceName) method.
   */
  real(): Device;
  isSimulator(): boolean;
}

/**
                                                                  * 
                                                                  */
                                                                 declare const devices: DevicesObject;

export default devices;
