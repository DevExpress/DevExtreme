import { DxElement, UserDefinedElementsArray, UserDefinedElement } from '../../core/element';
import { Device } from './environment';

import {
  HorizontalAlignment,
  PositionAlignment,
  VerticalAlignment,
  Direction,
} from '../../common';

import {
  DxPromise,
} from '../../core/utils/deferred';

export type AnimationType = 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';

/**
 * @docid utils.cancelAnimationFrame
 * @publicName cancelAnimationFrame(requestID)
 * @namespace DevExpress.common.core.animation
 * @public
 */
export function cancelAnimationFrame(requestID: number): void;

/**
 * @docid utils.requestAnimationFrame
 * @publicName requestAnimationFrame(callback)
 * @namespace DevExpress.common.core.animation
 * @public
 */
export function requestAnimationFrame(callback: Function): number;

/**
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common.core.animation
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
 * @namespace DevExpress.common.core.animation
 * @type object|number|string
 * @public
 */
export type AnimationConfig = {
    /**
     * @docid
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
    direction?: Direction | undefined;
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
    staggerDelay?: number | undefined;
    /**
     * @docid
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
 * @docid
 * @section utils
 * @namespace DevExpress.common.core.animation
 */
// eslint-disable-next-line @typescript-eslint/init-declarations
export const fx: {
    /**
     * @docid
     * @publicName animate(element, config)
     * @return Promise<void>
     * @namespace DevExpress.fx
     * @public
     */
    animate(element: Element, config: AnimationConfig): DxPromise<void>;

    /**
     * @docid
     * @publicName isAnimating(element)
     * @namespace DevExpress.fx
     * @public
     */
    isAnimating(element: Element): boolean;

    /**
     * @docid
     * @publicName stop(element, jumpToEnd)
     * @namespace DevExpress.fx
     * @public
     */
    stop(element: Element, jumpToEnd: boolean): void;
};

/**
 * @public
 * @namespace DevExpress.common.core.animation
 */
export type CollisionResolution = 'fit' | 'flip' | 'flipfit' | 'none';
/**
 * @public
 * @namespace DevExpress.common.core.animation
 */
export type CollisionResolutionCombination = 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit';

/**
 * @docid
 * @namespace DevExpress.common.core.animation
 * @type object
 * @public
 */
export type PositionConfig = {
    /**
     * @docid
     * @public
     */
    at?: PositionAlignment | {
      /**
       * @docid
       */
      x?: HorizontalAlignment;
      /**
       * @docid
       */
      y?: VerticalAlignment;
    };
    /**
     * @docid
     * @public
     */
    boundary?: string | UserDefinedElement | Window;
    /**
     * @docid
     * @public
     */
    boundaryOffset?: string | {
      /**
       * @docid
       * @default 0
       */
      x?: number;
      /**
       * @docid
       * @default 0
       */
      y?: number;
    };
    /**
     * @docid
     * @public
     */
    collision?: CollisionResolutionCombination | {
      /**
       * @docid
       * @default 'none'
       */
      x?: CollisionResolution;
      /**
       * @docid
       * @default 'none'
       */
      y?: CollisionResolution;
    };
    /**
     * @docid
     * @public
     */
    my?: PositionAlignment | {
      /**
       * @docid
       */
      x?: HorizontalAlignment;
      /**
       * @docid
       */
      y?: VerticalAlignment;
    };
    /**
     * @docid
     * @public
     */
    of?: string | UserDefinedElement | Window;
    /**
     * @docid
     * @public
     */
    offset?: string | {
      /**
       * @docid
       * @default 0
       */
      x?: number;
      /**
       * @docid
       * @default 0
       */
      y?: number;
    };
};

/**
 * @docid
 * @namespace DevExpress.common.core.animation
 * @public
 */
// eslint-disable-next-line @typescript-eslint/init-declarations
export const animationPresets: {
  /**
   * @docid
   * @publicName applyChanges()
   * @public
   */
  applyChanges(): void;
  /**
   * @docid
   * @publicName clear()
   * @public
   */
  clear(): void;
  /**
   * @docid
   * @publicName clear(name)
   * @public
   */
  clear(name: string): void;
  /**
   * @docid
   * @publicName getPreset(name)
   * @public
   */
  getPreset(name: string): AnimationConfig;
  /**
   * @docid
   * @publicName registerDefaultPresets()
   * @public
   */
  registerDefaultPresets(): void;
  /**
   * @docid
   * @publicName registerPreset(name, config)
   * @public
   */
  registerPreset(name: string, config: { animation: AnimationConfig; device?: Device }): void;
  /**
   * @docid
   * @publicName resetToDefaults()
   * @public
   */
  resetToDefaults(): void;
};

/**
 * @docid
 * @namespace DevExpress.common.core.animation
 * @public
 */
export class TransitionExecutor {
  /**
   * @docid
   * @publicName enter(elements, animation)
   * @param1 elements:jQuery
   * @public
   */
  enter(elements: UserDefinedElementsArray, animation: AnimationConfig | string): void;
  /**
   * @docid
   * @publicName leave(elements, animation)
   * @param1 elements:jQuery
   * @public
   */
  leave(elements: UserDefinedElementsArray, animation: AnimationConfig | string): void;
  /**
   * @docid
   * @publicName reset()
   * @public
   */
  reset(): void;
  /**
   * @docid
   * @publicName start()
   * @return Promise<void>
   * @public
   */
  start(): DxPromise<void>;
  /**
   * @docid
   * @publicName stop()
   * @public
   */
  stop(): void;
}
