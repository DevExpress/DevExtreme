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
 * @param2 stackOptions:StackOptions
 * @public
 */
declare function notify(message: string, stackOptions?: StackOptions): void;

/**
 * @docid ui.notify
 * @static
 * @publicName notify(options,stackOptions)
 * @param1 options:object
 * @param2 stackOptions:StackOptions
 * @public
 */
declare function notify(options: any, stackOptions?: StackOptions): void;

interface StackOptions {
    /**
     * @docid
     * @type Enums.NotifyStackPosition|object
     */
    position?: 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'top center' | 'bottom center' | 'left center' | 'right center' | 'center' | {
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
     * @type Enums.NotifyStackDirection
     */
    direction?: 'down' | 'up' | 'left' | 'right' | 'down-reverse' | 'up-reverse' | 'left-reverse' | 'right-reverse';
}

 export default notify;
