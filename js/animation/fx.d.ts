import { DxElement } from '../core/element';
import { DxPromise } from '../core/utils/deferred';
import { positionConfig } from './position';

export type animationState = string | number | 
{ opacity: number; } | 
{ scale: number; } | 
{ position: positionConfig; } |
{ left: number; } | 
{ top: number; };

/**
 * @docid
 * @namespace DevExpress
 * @type object
 */
export interface animationConfig {
    /**
     * @docid
     * @type_function_param1 $element:DxElement
     * @type_function_param2 config:animationConfig
     * @public
     */
    complete?: (($element: DxElement, config: animationConfig) => void);
    /**
     * @docid
     * @default 0
     * @public
     */
    delay?: number;
    /**
     * @docid
     * @type Enums.Direction
     * @default undefined
     * @public
     */
    direction?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid
     * @default 400
     * @public
     */
    duration?: number;
    /**
     * @docid
     * @default 'ease'
     * @public
     */
    easing?: string;
    /**
     * @docid
     * @default {}
     * @public
     */    
    from?: animationState;
    /**
     * @docid
     * @default undefined
     * @public
     */
    staggerDelay?: number;
    /**
     * @docid
     * @type_function_param1 $element:DxElement
     * @type_function_param2 config:object
     * @public
     */
    start?: (($element: DxElement, config: animationConfig) => void);
    /**
     * @docid
     * @default {}
     * @public
     */
    to?: animationState;
    /**
     * @docid
     * @type Enums.AnimationType
     * @default 'custom'
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
     * @param2 config:object
     * @return Promise<void>
     * @namespace DevExpress.fx
     * @public
     */
    animate(element: Element, config: animationConfig): DxPromise<void>;

    /**
     * @docid
     * @publicName isAnimating(element)
     * @param1 element:Element
     * @return boolean
     * @namespace DevExpress.fx
     * @public
     */
    isAnimating(element: Element): boolean;

    /**
     * @docid
     * @publicName stop(element, jumpToEnd)
     * @param1 element:Element
     * @param2 jumpToEnd:boolean
     * @namespace DevExpress.fx
     * @public
     */
    stop(element: Element, jumpToEnd: boolean): void;
}
export default fx;
