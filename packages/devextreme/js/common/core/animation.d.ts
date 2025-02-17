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

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type AnimationType = 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';

/**
 * Cancels an animation frame request scheduled with the requestAnimationFrame method.
 */
export function cancelAnimationFrame(requestID: number): void;

/**
 * Makes the browser call a function to update animation before the next repaint.
 */
export function requestAnimationFrame(callback: Function): number;

/**
 * Describes an animation state.
 */
export type AnimationState = string | number | {
    /**
     * Element opacity.
     */
    opacity: number;
} | {
    /**
     * A value that controls element size.
     */
    scale: number;
} | {
    /**
     * Element position.
     */
    position: PositionConfig;
} | {
    /**
     * A shortcut that positions the element&apos;s left side relative to the parent element.
     */
    left: number;
} | {
    /**
     * A shortcut that positions the element&apos;s top side relative to the parent element.
     */
    top: number;
};

/**
 * Defines animation properties.
 */
export type AnimationConfig = {
    /**
     * A function called after animation is completed.
     */
    complete?: (($element: DxElement, config: AnimationConfig) => void);
    /**
     * A number specifying wait time before animation execution.
     */
    delay?: number;
    /**
     * Specifies the animation direction for the &apos;slideIn&apos; and &apos;slideOut&apos; animation types.
     */
    direction?: Direction | undefined;
    /**
     * A number specifying the time in milliseconds spent on animation.
     */
    duration?: number;
    /**
     * A string specifying the easing function for animation.
     */
    easing?: string;
    /**
     * Specifies an initial animation state. Use the to property to specify the final state.
     */
    from?: AnimationState;
    /**
     * A number specifying the time period to wait before the animation of the next stagger item starts.
     */
    staggerDelay?: number | undefined;
    /**
     * A function called before animation is started.
     */
    start?: (($element: DxElement, config: AnimationConfig) => void);
    /**
     * Specifies a final animation state. Use the from property to specify an initial state.
     */
    to?: AnimationState;
    /**
     * A string value specifying the animation type.
     */
    type?: AnimationType;
};

/**
                                                                  * An object that serves as a namespace for the methods that are used to animate UI elements.
                                                                  */
                                                                 export const fx: {
    /**
     * Animates an element.
     */
    animate(element: Element, config: AnimationConfig): DxPromise<void>;

    /**
     * Checks whether an element is being animated.
     */
    isAnimating(element: Element): boolean;

    /**
     * Stops an element&apos;s animation.
     */
    stop(element: Element, jumpToEnd: boolean): void;
};

export type CollisionResolution = 'fit' | 'flip' | 'flipfit' | 'none';
export type CollisionResolutionCombination = 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit';

/**
 * Configures the position of an overlay element.
 */
export type PositionConfig = {
    /**
     * Specifies the target element&apos;s side or corner where the overlay element should be positioned.
     */
    at?: PositionAlignment | {
      /**
       * Specifies a position in the horizontal direction (for left, right, or center alignment).
       */
      x?: HorizontalAlignment;
      /**
       * Specifies a position in the vertical direction (for top, bottom, or center alignment).
       */
      y?: VerticalAlignment;
    };
    /**
     * A boundary element in which the overlay element must be positioned.
     */
    boundary?: string | UserDefinedElement | Window;
    /**
     * Specifies the offset of boundaries from the boundary element.
     */
    boundaryOffset?: string | {
      /**
       * Specifies a horizontal offset.
       */
      x?: number;
      /**
       * Specifies a vertical offset.
       */
      y?: number;
    };
    /**
     * Specifies how to resolve collisions - when the overlay element exceeds the boundary element.
     */
    collision?: CollisionResolutionCombination | {
      /**
       * Specifies how to resolve horizontal collisions.
       */
      x?: CollisionResolution;
      /**
       * Specifies how to resolve vertical collisions.
       */
      y?: CollisionResolution;
    };
    /**
     * Specifies the overlay element&apos;s side or corner to align with a target element.
     */
    my?: PositionAlignment | {
      /**
       * Specifies a position in the horizontal direction (for left, right, or center alignment).
       */
      x?: HorizontalAlignment;
      /**
       * Specifies a position in the vertical direction (for top, bottom, or center alignment).
       */
      y?: VerticalAlignment;
    };
    /**
     * The target element relative to which the overlay element should be positioned.
     */
    of?: string | UserDefinedElement | Window;
    /**
     * Specifies the overlay element&apos;s offset from a specified position.
     */
    offset?: string | {
      /**
       * Specifies a horizontal offset.
       */
      x?: number;
      /**
       * Specifies a vertical offset.
       */
      y?: number;
    };
};

/**
                                                                  * A repository of animations.
                                                                  */
                                                                 export const animationPresets: {
  /**
   * Applies the changes made in the animation repository.
   */
  applyChanges(): void;
  /**
   * Removes all animations from the repository.
   */
  clear(): void;
  /**
   * Deletes an animation with a specific name.
   */
  clear(name: string): void;
  /**
   * Gets the configuration of an animation with a specific name.
   */
  getPreset(name: string): AnimationConfig;
  /**
   * Registers predefined animations in the animation repository.
   */
  registerDefaultPresets(): void;
  /**
   * Adds an animation with a specific name to the animation repository.
   */
  registerPreset(name: string, config: { animation: AnimationConfig; device?: Device }): void;
  /**
   * Deletes all custom animations.
   */
  resetToDefaults(): void;
};

/**
 * The manager that performs several specified animations at a time.
 */
export class TransitionExecutor {
  /**
   * Registers the set of elements that should be animated as &apos;entering&apos; using the specified animation configuration.
   */
  enter(elements: UserDefinedElementsArray, animation: AnimationConfig | string): void;
  /**
   * Registers a set of elements that should be animated as &apos;leaving&apos; using the specified animation configuration.
   */
  leave(elements: UserDefinedElementsArray, animation: AnimationConfig | string): void;
  /**
   * Deletes all the animations registered in the Transition Executor by using the enter(elements, animation) and leave(elements, animation) methods.
   */
  reset(): void;
  /**
   * Starts all the animations registered using the enter(elements, animation) and leave(elements, animation) methods beforehand.
   */
  start(): DxPromise<void>;
  /**
   * Stops all started animations.
   */
  stop(): void;
}
