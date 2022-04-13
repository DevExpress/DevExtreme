/** @public */
type StackPosition = 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'top center' | 'bottom center' | 'left center' | 'right center' | 'center';

/** @public */
type StackDirection = 'down' | 'up' | 'left' | 'right' | 'down-reverse' | 'up-reverse' | 'left-reverse' | 'right-reverse';

/** @public */
interface Stack {
    /**
     * @docid
     * @type Enums.StackPosition|object
     */
    position?: StackPosition | {
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
     * @type Enums.StackDirection
     */
    direction?: StackDirection;
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
 * @publicName notify(message,stack)
 * @param1 message:string
 * @param2 stack:object
 * @public
 */
declare function notify(message: string, stack?: Stack): void;

/**
 * @docid ui.notify
 * @static
 * @publicName notify(options,stack)
 * @param1 options:object
 * @param2 stack:object
 * @public
 */
declare function notify(options: any, stack?: Stack): void;

export default notify;
