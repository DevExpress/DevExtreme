/**
 * @public
 * @docid
 * @section commonObjectStructures
 * @namespace DevExpress
 */
export type Device = {
  /**
   * @docid
   * @public
   */
  android?: boolean;
  /**
   * @docid
   * @public
   */
  deviceType?: 'phone' | 'tablet' | 'desktop';
  /**
   * @docid
   * @public
   */
  generic?: boolean;
  /**
   * @docid
   * @public
   */
  grade?: 'A' | 'B' | 'C';
  /**
   * @docid
   * @public
   */
  ios?: boolean;
  /**
   * @docid
   * @public
   */
  phone?: boolean;
  /**
   * @docid
   * @public
   */
  platform?: 'android' | 'ios' | 'generic';
  /**
   * @docid
   * @public
   */
  tablet?: boolean;
  /**
   * @docid
   * @public
   */
  version?: Array<number>;
};

type EventName = 'orientationChanged';

/**
* @docid
* @publicName devices
* @section Utils
* @namespace DevExpress
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
* @namespace DevExpress
* @hidden
* @public
*/
// eslint-disable-next-line @typescript-eslint/init-declarations
export const devices: DevicesObject;

/**
 * @docid
 * @publicName hideTopOverlay()
 * @namespace DevExpress
 * @public
 */
export function hideTopOverlay(): boolean;

/**
 * @docid utils.initMobileViewport
 * @publicName initMobileViewport(options)
 * @namespace DevExpress.utils
 * @public
 */
export function initMobileViewport(options: { allowZoom?: boolean; allowPan?: boolean; allowSelection?: boolean }): void;

/**
 * @docid
 * @public
 */
export interface dxSchedulerTimeZone {
  /**
   * @docid
   */
  id: string;
  /**
   * @docid
   */
  offset: number;
  /**
   * @docid
   */
  title: string;
}

/**
* @docid utils.getTimeZones
* @publicName getTimeZones(date)
* @param1 date:Date|undefined
* @namespace DevExpress.utils
* @static
* @public
*/
export function getTimeZones(date?: Date): Array<dxSchedulerTimeZone>;
