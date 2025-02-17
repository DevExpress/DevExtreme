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
 * Creates a toast message.
 */
declare function notify(message: string, type?: string, displayTime?: number): void;

/**
 * Creates a toast message.
 */
declare function notify(options: any, type?: string, displayTime?: number): void;

/**
 * Creates a stackable toast message.
 */
declare function notify(message: string, stack?: Stack): void;

/**
 * Creates a stackable toast message.
 */
declare function notify(options: any, stack?: Stack): void;

export default notify;
