/**
 * @public
 * @docid
 * @section commonObjectStructures
 * @namespace DevExpress
 * @export default
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

/**
 * @docid
 * @publicName devices
 * @section Utils
 * @namespace DevExpress
 * @public
 */
declare class DevicesObject {
    constructor(options: { window?: Window });
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
     * @return this
     * @public
     */
    off(eventName: string): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @return this
     * @public
     */
    off(eventName: string, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
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
     * @public
     */
    orientation(): string;
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
 */

declare const devices: DevicesObject;
export default devices;
