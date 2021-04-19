import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

/**
 * @docid
 * @namespace DevExpress
 * @type object
 */
export interface animationConfig {
    /**
     * @docid
     * @type_function_param1 $element:dxElement
     * @type_function_param2 config:object
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    complete?: (($element: TElement, config: any) => void);
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    delay?: number;
    /**
     * @docid
     * @type Enums.Direction
     * @default undefined
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    direction?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid
     * @default 400
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    duration?: number;
    /**
     * @docid
     * @default 'ease'
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    easing?: string;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    from?: number | string | any;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    staggerDelay?: number;
    /**
     * @docid
     * @type_function_param1 $element:dxElement
     * @type_function_param2 config:object
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    start?: (($element: TElement, config: any) => void);
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    to?: number | string | any;
    /**
     * @docid
     * @type Enums.AnimationType
     * @default 'custom'
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    type?: 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';
}

/**
 * @docid
 * @section utils
 * @module animation/fx
 * @namespace DevExpress
 * @export default
 */
declare const fx: {
    /**
     * @docid
     * @publicName animate(element, config)
     * @param1 element:Element
     * @param2 config:animationConfig
     * @return Promise<void>
     * @namespace DevExpress.fx
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    animate(element: Element, config: animationConfig): TPromise<void>;

    /**
     * @docid
     * @publicName isAnimating(element)
     * @param1 element:Element
     * @return boolean
     * @namespace DevExpress.fx
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    isAnimating(element: Element): boolean;

    /**
     * @docid
     * @publicName stop(element, jumpToEnd)
     * @param1 element:Element
     * @param2 jumpToEnd:boolean
     * @namespace DevExpress.fx
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    stop(element: Element, jumpToEnd: boolean): void;
}
export default fx;
