export interface Device {
    /**
     * @docid Device.android
     * @type boolean
     * @prevFileNamespace DevExpress.core
     * @public
     */
    android?: boolean;
    /**
     * @docid Device.deviceType
     * @type string
     * @acceptValues 'phone'|'tablet'|'desktop'
     * @prevFileNamespace DevExpress.core
     * @public
     */
    deviceType?: 'phone' | 'tablet' | 'desktop';
    /**
     * @docid Device.generic
     * @type boolean
     * @prevFileNamespace DevExpress.core
     * @public
     */
    generic?: boolean;
    /**
     * @docid Device.grade
     * @type string
     * @acceptValues 'A'|'B'|'C'
     * @prevFileNamespace DevExpress.core
     * @public
     */
    grade?: 'A' | 'B' | 'C';
    /**
     * @docid Device.ios
     * @type boolean
     * @prevFileNamespace DevExpress.core
     * @public
     */
    ios?: boolean;
    /**
     * @docid Device.phone
     * @type boolean
     * @prevFileNamespace DevExpress.core
     * @public
     */
    phone?: boolean;
    /**
     * @docid Device.platform
     * @type string
     * @acceptValues 'android'|'ios'|'generic'
     * @prevFileNamespace DevExpress.core
     * @public
     */
    platform?: 'android' | 'ios' | 'generic';
    /**
     * @docid Device.tablet
     * @type boolean
     * @prevFileNamespace DevExpress.core
     * @public
     */
    tablet?: boolean;
    /**
     * @docid Device.version
     * @type Array<number>
     * @prevFileNamespace DevExpress.core
     * @public
     */
    version?: Array<number>;
}

/**
 * @docid DevicesObject
 * @publicName devices
 * @section Utils
 * @namespace DevExpress
 * @module core/devices
 * @export default
 * @prevFileNamespace DevExpress.core
 * @public
 */
declare class DevicesObject {
    constructor(options: { window?: Window });
    /**
     * @docid DevicesObjectmethods.current
     * @publicName current()
     * @return Device
     * @prevFileNamespace DevExpress.core
     * @public
     */
    current(): Device;
    /**
     * @docid DevicesObjectmethods.current
     * @publicName current(deviceName)
     * @param1 deviceName:string|Device
     * @prevFileNamespace DevExpress.core
     * @public
     */
    current(deviceName: string | Device): void;
    /**
     * @docid DevicesObjectMethods.off
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    off(eventName: string): this;
    /**
     * @docid DevicesObjectMethods.off
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    off(eventName: string, eventHandler: Function): this;
    /**
     * @docid DevicesObjectMethods.on
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    on(eventName: string, eventHandler: Function): this;
    /**
     * @docid DevicesObjectMethods.on
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @prevFileNamespace DevExpress.core
     * @public
     */
    on(events: any): this;
    /**
     * @docid DevicesObjectMethods.orientation
     * @publicName orientation()
     * @return String
     * @prevFileNamespace DevExpress.core
     * @public
     */
    orientation(): string;
    /**
     * @docid DevicesObjectMethods.real
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
 * @type DevicesObject
 * @namespace DevExpress
 * @hidden
 * @prevFileNamespace DevExpress.core
 */

declare const devices: DevicesObject;
export default devices;
