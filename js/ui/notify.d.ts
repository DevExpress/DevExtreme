type NotifyStackPosition = 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'top center' | 'bottom center' | 'left center' | 'right center' | 'center';
type NotifyStackDirection = 'down' | 'up' | 'left' | 'right' | 'down-reverse' | 'up-reverse' | 'left-reverse' | 'right-reverse';

interface StackOptions {
    /**
     * @docid
     * @type string|object
     */
    position?: NotifyStackPosition | {
        /**
         * @docid
         * @type number
         */
        top?: number;
        /**
         * @docid
         * @type number
         */
        left?: number;
        /**
         * @docid
         * @type number
         */
        bottom?: number;
        /**
         * @docid
         * @type number
         */
        right?: number;
    };
    /**
     * @docid
     * @type string
     */
    direction?: NotifyStackDirection;
}

/**
 * @docid ui.notify
 * @static
 * @publicName notify(message,type,displayTime)
 * @param1 message:string
 * @param2 type:string|undefined
 * @param3 displayTime:integer|undefined
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
 * @public
 */
declare function notify(options: any, type?: string, displayTime?: number): void;

/**
 * @docid ui.notify
 * @static
 * @publicName notify(message,stackOptions)
 * @param1 message:string
 * @param2 stackOptions:object
 * @public
 */
declare function notify(message: string, stackOptions?: StackOptions): void;

/**
 * @docid ui.notify
 * @static
 * @publicName notify(options,stackOptions)
 * @param1 options:object
 * @param2 stackOptions:object
 * @public
 */
declare function notify(options: any, stackOptions?: StackOptions): void;

export default notify;
