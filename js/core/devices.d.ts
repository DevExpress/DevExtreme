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
     * @prevFileNamespace DevExpress.core
     * @public
     */
    android?: boolean;
    /**
     * @docid
     * @type string
     * @acceptValues 'phone'|'tablet'|'desktop'
     * @prevFileNamespace DevExpress.core
     * @public
     */
    deviceType?: 'phone' | 'tablet' | 'desktop';
    /**
     * @docid
     * @prevFileNamespace DevExpress.core
     * @public
     */
    generic?: boolean;
    /**
     * @docid
     * @type string
     * @acceptValues 'A'|'B'|'C'
     * @prevFileNamespace DevExpress.core
     * @public
     */
    grade?: 'A' | 'B' | 'C';
    /**
     * @docid
     * @prevFileNamespace DevExpress.core
     * @public
     */
    ios?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.core
     * @public
     */
    phone?: boolean;
    /**
     * @docid
     * @type string
     * @acceptValues 'android'|'ios'|'generic'
     * @prevFileNamespace DevExpress.core
     * @public
     */
    platform?: 'android' | 'ios' | 'generic';
    /**
     * @docid
     * @prevFileNamespace DevExpress.core
     * @public
     */
    tablet?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.core
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
 * @prevFileNamespace DevExpress.core
 * @public
 */
declare class DevicesObject {
    constructor(options?: { window?: Window });
    /**
     * @docid
     * @publicName current()
     * @return Device
     * @prevFileNamespace DevExpress.core
     * @public
     */
    current(): Device;
    /**
     * @docid
     * @publicName current(deviceName)
     * @param1 deviceName:string|Device
     * @prevFileNamespace DevExpress.core
     * @public
     */
    current(deviceName: string | Device): void;
    /**
     * @docid
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    off(eventName: string): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    off(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    on(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
     on(events: {[key: string]: Function}): this;
    /**
     * @docid
     * @publicName orientation()
     * @return String
     * @prevFileNamespace DevExpress.core
     * @public
     */
    orientation(): 'portrait' | 'landscape' | undefined;
    /**
     * @docid
     * @publicName real()
     * @return Device
     * @prevFileNamespace DevExpress.core
     * @public
     */
    real(): Device;
    isSimulator(): boolean;
}

/**
 * @const devices
 * @namespace DevExpress
 * @hidden
 * @prevFileNamespace DevExpress.core
 */

declare const devices: DevicesObject;
export default devices;
