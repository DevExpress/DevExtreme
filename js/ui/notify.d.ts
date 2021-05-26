

/**
 * @docid ui.notify
 * @static
 * @publicName notify(message,type,displayTime)
 * @param1 message:string
 * @param2 type:string|undefined
 * @param3 displayTime:integer|undefined
 * @module ui/notify
 * @export default
 * @public
 */
declare function notify(message: string, type?: string, displayTime?: number): void;

/**
 * @docid ui.notify
 * @static
 * @publicName notify(options,type,displayTime)
 * @param1 options:object
 * @param2 type:string|undefined
 * @param3 displayTime:integer|undefined
 * @module ui/notify
 * @export default
 * @public
 */
declare function notify(options: any, type?: string, displayTime?: number): void;

export default notify;
