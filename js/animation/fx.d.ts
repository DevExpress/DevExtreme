import {
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

export interface animationConfig {
    /**
     * @docid animationConfig.complete
     * @type function
     * @type_function_param1 $element:dxElement
     * @type_function_param2 config:object
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    complete?: (($element: dxElement, config: any) => any);
    /**
     * @docid animationConfig.delay
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    delay?: number;
    /**
     * @docid animationConfig.direction
     * @type Enums.Direction
     * @default undefined
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    direction?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid animationConfig.duration
     * @type number
     * @default 400
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    duration?: number;
    /**
     * @docid animationConfig.easing
     * @type string
     * @default 'ease'
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    easing?: string;
    /**
     * @docid animationConfig.from
     * @type number|string|object
     * @default {}
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    from?: number | string | any;
    /**
     * @docid animationConfig.staggerDelay
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    staggerDelay?: number;
    /**
     * @docid animationConfig.start
     * @type function
     * @type_function_param1 $element:dxElement
     * @type_function_param2 config:object
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    start?: (($element: dxElement, config: any) => any);
    /**
     * @docid animationConfig.to
     * @type number|string|object
     * @default {}
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    to?: number | string | any;
    /**
     * @docid animationConfig.type
     * @type Enums.AnimationType
     * @default 'custom'
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    type?: 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';
}

declare const fx: {
    /**
     * @docid fxmethods.animate
     * @publicName animate(element, config)
     * @param1 element:Node
     * @param2 config:animationConfig
     * @return Promise<void>
     * @namespace DevExpress.fx
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    animate(element: Element, config: animationConfig): Promise<void> & JQueryPromise<void>;
    
    /**
     * @docid fxmethods.isAnimating
     * @publicName isAnimating(element)
     * @param1 element:Node
     * @return boolean
     * @namespace DevExpress.fx
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    isAnimating(element: Element): boolean;
    
    /**
     * @docid fxmethods.stop
     * @publicName stop(element, jumpToEnd)
     * @param1 element:Node
     * @param2 jumpToEnd:boolean
     * @namespace DevExpress.fx
     * @prevFileNamespace DevExpress.animation
     * @public
     */
    stop(element: Element, jumpToEnd: boolean): void;
}
export default fx;
