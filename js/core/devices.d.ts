/**
 * @docid
 * @section commonObjectStructures
 * @type object
 * @namespace DevExpress
 * @module core/devices
 * @export default
 */
export interface Device {
    /**
     * @docid
     * @public
     */
    android?: boolean;
    /**
     * @docid
     * @type string
     * @acceptValues 'phone'|'tablet'|'desktop'
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
     * @type string
     * @acceptValues 'A'|'B'|'C'
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
     * @type string
     * @acceptValues 'android'|'ios'|'generic'
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
}

/**
 * @docid
 * @publicName devices
 * @section Utils
 * @namespace DevExpress
 * @module core/devices
 * @export default
 * @public
 */
declare class DevicesObject {
    constructor(options: { window?: Window });
    /**
     * @docid
     * @publicName current()
     * @return Device
     * @public
     */
    current(): Device;
    /**
     * @docid
     * @publicName current(deviceName)
     * @param1 deviceName:string|Device
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
    off(eventName: string): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @public
     */
    off(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @public
     */
    on(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @public
     */
    on(events: any): this;
    /**
     * @docid
     * @publicName orientation()
     * @return String
     * @public
     */
    orientation(): string;
    /**
     * @docid
     * @publicName real()
     * @return Device
     * @public
     */
    real(): Device;
    isSimulator(): boolean;
}

/**
 * @const devices
 * @namespace DevExpress
 * @hidden
 */

declare const devices: DevicesObject;
export default devices;
