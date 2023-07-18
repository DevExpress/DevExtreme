/** @public */
interface Stack {
    /**
     * @docid
     * @type Enums.StackPosition|object
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
     */
    direction?: 'down-push' | 'up-push' | 'left-push' | 'right-push' | 'down-stack' | 'up-stack' | 'left-stack' | 'right-stack';
}

/**
 * @docid ui.notify
 * @static
 * @publicName notify(message,type,displayTime)
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
 * @param2 stack:object
 * @param2_field direction:string
 * @param2_field position:string
 * @public
 */
declare function notify(message: string, stack?: Stack): void;

/**
 * @docid ui.notify
 * @static
 * @publicName notify(options,stack)
 * @param1 options:object
 * @param2 stack:object
 * @param2_field direction:string
 * @param2_field position:string
 * @public
 */
declare function notify(options: any, stack?: Stack): void;

export default notify;
