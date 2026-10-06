/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-plusplus */

import { cancelAnimationFrame, requestAnimationFrame } from '@ts/common/core/animation/frame';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

type EasingFunction = (pos: number, start: number, end: number) => number;

type AnimationParams = Record<string, ThemeValue>;

interface AnimatedElement {
  attr: (attrs: AnimationParams) => unknown;
  animation?: Animation;
}

type AnimationStep = (
  element: AnimatedElement,
  params: ThemeValue,
  progress: number,
  easing: EasingFunction,
  currentParams: AnimationParams,
  attributeName: string,
) => void;

interface AnimationSteps {
  [attributeName: string]: AnimationStep | undefined;
  base: AnimationStep;
  complete?: (element: AnimatedElement, currentParams: AnimationParams) => void;
}

export interface AnimationOptions {
  duration: number;
  partitionDuration?: number;
  delay?: number;
  easing?: string;
  animateStep?: AnimationSteps;
  unstoppable?: boolean;
  step?: (easedProgress: number, progress: number) => void;
  complete?: () => void;
}

type AnimationTick = (this: Animation, now: number) => unknown;

export const noop = function (): void { };
export const easingFunctions: Record<string, EasingFunction> = {
  easeOutCubic(pos, start, end) { return pos === 1 ? end : (1 - (1 - pos) ** 3) * (end - start) + +start; },
  linear(pos, start, end) { return pos === 1 ? end : pos * (end - start) + +start; },
};

export const animationSvgStep: AnimationSteps = {
  segments(elem, params, progress, easing, currentParams) {
    const { from } = params;
    const { to } = params;
    let curSeg;
    let seg;
    let i;
    let j;
    const segments: ThemeValue[][] = [];

    for (i = 0; i < from.length; i++) {
      curSeg = from[i];
      seg = [curSeg[0]];
      if (curSeg.length > 1) {
        for (j = 1; j < curSeg.length; j++) {
          seg.push(easing(progress, curSeg[j], to[i][j]));
        }
      }
      segments.push(seg);
    }
    currentParams.segments = params.end && progress === 1 ? params.end : segments;
    elem.attr({ segments });
  },

  arc(elem, params, progress, easing) {
    const { from } = params;
    const { to } = params;
    const current = {};
    for (const i in from) {
      current[i] = easing(progress, from[i], to[i]);
    }
    elem.attr(current);
  },

  transform(elem, params, progress, easing, currentParams) {
    const { from } = params;
    const { to } = params;
    const current = {};
    for (const i in from) {
      current[i] = currentParams[i] = easing(progress, from[i], to[i]);
    }
    elem.attr(current);
  },

  base(elem, params, progress, easing, currentParams, attributeName) {
    const obj = {};
    obj[attributeName] = currentParams[attributeName] = easing(progress, params.from, params.to);
    elem.attr(obj);
  },

  _: noop,

  complete(element, currentSettings) {
    element.attr(currentSettings);
  },
};

function step(this: Animation, now: number): unknown {
  const that = this;
  const animateStep = that._animateStep;
  let attrName;
  that._progress = that._calcProgress(now);

  for (attrName in that.params) {
    const anim = animateStep[attrName] || animateStep.base;
    anim(that.element, that.params[attrName], that._progress, that._easing, that._currentParams, attrName);
  }

  that.options.step && that.options.step(that._easing(that._progress, 0, 1), that._progress);

  if (that._progress === 1) return that.stop();

  return true;
}

function delayTick(this: Animation, now: number): boolean {
  if (now - this._startTime >= this.delay) {
    this.tick = step;
  }
  return true;
}

function start(this: Animation, now: number): boolean {
  this._startTime = now;
  this.tick = this.delay ? delayTick : step;
  return true;
}

export class Animation {
  declare _progress: number;

  declare element: AnimatedElement;

  declare params: AnimationParams;

  declare options: AnimationOptions;

  declare duration: number;

  declare delay: number;

  declare _animateStep: AnimationSteps;

  declare _easing: EasingFunction;

  declare _currentParams: AnimationParams;

  declare _startTime: number;

  declare tick: AnimationTick;

  constructor(element: AnimatedElement, params: AnimationParams, options: AnimationOptions) {
    this._progress = 0;
    this.element = element;
    this.params = params;
    this.options = options;
    this.duration = options.partitionDuration ? options.duration * options.partitionDuration : options.duration;
    this.delay = options.delay && options.duration * options.delay || 0;
    this._animateStep = options.animateStep || animationSvgStep;
    // @ts-expect-error an unknown or missing easing name falls back to easeOutCubic
    this._easing = easingFunctions[options.easing] || easingFunctions.easeOutCubic;
    this._currentParams = {};
    this.tick = start;
  }

  _calcProgress(now: number): number {
    return Math.min(1, (now - this.delay - this._startTime) / this.duration);
  }

  stop(disableComplete?: boolean): void {
    const { options } = this;
    const animateStep = this._animateStep;

    this.stop = this.tick = noop;

    animateStep.complete && animateStep.complete(this.element, this._currentParams);
    options.complete && !disableComplete && options.complete();
  }
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let AnimationController = class AnimationController {
  declare _animationCount: number;

  declare _timerId: number | null;

  declare _animations: Record<number, Animation>;

  declare element: Element | null;

  declare _startDelay?: ReturnType<typeof setTimeout>;

  declare _endAnimation?: (() => void) | null;

  declare _endAnimationTimer?: ReturnType<typeof setTimeout> | null;

  constructor(element: Element) {
    this._animationCount = 0;
    this._timerId = null;
    this._animations = {};
    this.element = element;
  }

  _loop(): void {
    const animations = this._animations;
    let activeAnimation = 0;
    const now = new Date().getTime();
    let an;
    const endAnimation = this._endAnimation;

    for (an in animations) {
      if (!animations[an].tick(now)) {
        delete animations[an];
      }
      activeAnimation++;
    }
    if (activeAnimation === 0) {
      this.stop();
      this._endAnimationTimer = endAnimation && setTimeout(() => {
        if (this._animationCount === 0) {
          endAnimation();
          this._endAnimation = null;
        }
      });
      return;
    }
    this._timerId = requestAnimationFrame.call(null, () => {
      this._loop();
    }, this.element);
  }

  addAnimation(animation: Animation): void {
    this._animations[this._animationCount++] = animation;
    // @ts-expect-error the handle is null when _loop() had no end callback, clearTimeout(null) is a no-op
    clearTimeout(this._endAnimationTimer);
    if (!this._timerId) {
      clearTimeout(this._startDelay);
      this._startDelay = setTimeout(() => {
        this._timerId = 1;
        this._loop();
      }, 0);
    }
  }

  animateElement(elem: AnimatedElement, params: AnimationParams, options: AnimationOptions): void {
    if (elem && params && options) {
      elem.animation && elem.animation.stop();
      this.addAnimation(elem.animation = new Animation(elem, params, options));
    }
  }

  onEndAnimation(endAnimation: () => void): void {
    this._animationCount ? this._endAnimation = endAnimation : endAnimation();
  }

  dispose(): void {
    this.stop();
    this.element = null;
  }

  stop(): void {
    this._animations = {};
    this._animationCount = 0;
    // @ts-expect-error the timer handle is null when no frame is requested, cancelAnimationFrame(null) is a no-op
    cancelAnimationFrame(this._timerId);
    clearTimeout(this._startDelay);
    // @ts-expect-error the handle is null when _loop() had no end callback, clearTimeout(null) is a no-op
    clearTimeout(this._endAnimationTimer);
    this._timerId = null;
  }

  lock(): void {
    let an;
    const animations = this._animations;
    let unstoppable; // T261694
    let hasUnstoppableInAnimations;

    for (an in animations) {
      unstoppable = animations[an].options.unstoppable;
      hasUnstoppableInAnimations = hasUnstoppableInAnimations || unstoppable;
      if (!unstoppable) {
        animations[an].stop(true);
        delete animations[an];
      }
    }
    !hasUnstoppableInAnimations && this.stop();
  }
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_AnimationController(value: typeof AnimationController): void {
  AnimationController = value;
}
/// #ENDDEBUG
