import { DxElement } from '../core/element';
import { DxPromise } from '../core/utils/deferred';
import { PositionConfig } from './position';

import {
    AnimationType,
    Direction,
} from '../docEnums';

/**
 * @docid
 * @public
 * @type object
 */
export type AnimationState = string | number | {
    /**
     * @docid
     * @public
     */
    opacity: number;
} | {
    /**
     * @docid
     * @public
     */
    scale: number;
} | {
    /**
     * @docid
     * @public
     */
    position: PositionConfig;
} | {
    /**
    * @docid
    * @public
    */
    left: number;
} | {
    /**
    * @docid
    * @public
    */
    top: number;
};

/**
 * @docid
 * @namespace DevExpress
 * @type object
 * @public
 */
export type AnimationConfig = {
    /**
     * @docid
     * @type_function_param1 $element:DxElement
     * @type_function_param2 config:object
     * @public
     */
    complete?: (($element: DxElement, config: AnimationConfig) => void);
    /**
     * @docid
     * @default 0
     * @public
     */
    delay?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    direction?: Direction;
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
    from?: AnimationState;
    /**
     * @docid
     * @default undefined
     * @public
     */
    staggerDelay?: number;
    /**
     * @docid
     * @type_function_param1 $element:DxElement
     * @type_function_param2 config:AnimationConfig
     * @public
     */
    start?: (($element: DxElement, config: AnimationConfig) => void);
    /**
     * @docid
     * @default {}
     * @public
     */
    to?: AnimationState;
    /**
     * @docid
     * @default 'custom'
     * @public
     */
    type?: AnimationType;
};

/**
 * @public
 * @deprecated Use the AnimationConfig type instead
 */
export type animationConfig = AnimationConfig;

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
     * @param2 config:AnimationConfig
     * @return Promise<void>
     * @namespace DevExpress.fx
     * @public
     */
    animate(element: Element, config: AnimationConfig): DxPromise<void>;

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
};
export default fx;
