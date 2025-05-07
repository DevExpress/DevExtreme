import { Device, EventName } from '../common/core/environment';

export {
  Device,
} from '../common/core/environment';

/**
* @docid
* @publicName devices
* @section Utils
* @public
*/
declare class DevicesObject {
  constructor(options?: { window?: Window });
  /**
   * @docid
   * @publicName current()
   * @public
   */
  current(): Device;
  /**
   * @docid
   * @publicName current(deviceName)
   * @public
   */
  current(deviceName: string | Device): void;
  /**
   * @docid
   * @publicName off(eventName)
   * @param1 eventName:string
   * @return this
   * @public
   */
  off(eventName: EventName): this;
  /**
   * @docid
   * @publicName off(eventName, eventHandler)
   * @param1 eventName:string
   * @return this
   * @public
   */
  off(eventName: EventName, eventHandler: Function): this;
  /**
   * @docid
   * @publicName on(eventName, eventHandler)
   * @param1 eventName:string
   * @return this
   * @public
   */
  on(eventName: EventName, eventHandler: Function): this;
  /**
   * @docid
   * @publicName on(events)
   * @param1 events:object
   * @return this
   * @public
   */
  on(events: { [key in EventName]?: Function }): this;
  /**
   * @docid
   * @publicName orientation()
   * @return String
   * @public
   */
  orientation(): 'portrait' | 'landscape' | undefined;
  /**
   * @docid
   * @publicName real()
   * @public
   */
  real(): Device;
  isSimulator(): boolean;
}

/**
* @const devices
* @namespace DevExpress.common.core.environment
* @hidden
* @public
*/
// eslint-disable-next-line @typescript-eslint/init-declarations
declare const devices: DevicesObject;

export default devices;
