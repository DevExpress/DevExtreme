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
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-plusplus */

import { cancelAnimationFrame, requestAnimationFrame } from '@js/common/core/animation/frame';

export const noop = function () { };
export const easingFunctions = {
  easeOutCubic(pos, start, end) { return pos === 1 ? end : (1 - (1 - pos) ** 3) * (end - start) + +start; },
  linear(pos, start, end) { return pos === 1 ? end : pos * (end - start) + +start; },
};

export const animationSvgStep = {
  segments(elem, params, progress, easing, currentParams) {
    const { from } = params;
    const { to } = params;
    let curSeg;
    let seg;
    let i;
    let j;
    const segments = [];

    for (i = 0; i < from.length; i++) {
      curSeg = from[i];
      seg = [curSeg[0]];
      if (curSeg.length > 1) {
        for (j = 1; j < curSeg.length; j++) {
          seg.push(easing(progress, curSeg[j], to[i][j]));
        }
      }
      // @ts-expect-error
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

function step(now) {
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

function delayTick(now) {
  if (now - this._startTime >= this.delay) {
    this.tick = step;
  }
  return true;
}

function start(now) {
  this._startTime = now;
  this.tick = this.delay ? delayTick : step;
  return true;
}

export function Animation(element, params, options) {
  const that = this;
  that._progress = 0;
  that.element = element;
  that.params = params;
  that.options = options;
  that.duration = options.partitionDuration ? options.duration * options.partitionDuration : options.duration;
  that.delay = options.delay && options.duration * options.delay || 0;
  that._animateStep = options.animateStep || animationSvgStep;
  that._easing = easingFunctions[options.easing] || easingFunctions.easeOutCubic;
  that._currentParams = {};
  that.tick = start;
}

Animation.prototype = {
  _calcProgress(now) {
    return Math.min(1, (now - this.delay - this._startTime) / this.duration);
  },

  stop(disableComplete) {
    const that = this;
    const { options } = that;
    const animateStep = that._animateStep;

    that.stop = that.tick = noop;

    animateStep.complete && animateStep.complete(that.element, that._currentParams);
    options.complete && !disableComplete && options.complete();
  },
};

export function AnimationController(element) {
  const that = this;
  that._animationCount = 0;
  that._timerId = null;
  that._animations = {};
  that.element = element;
}

AnimationController.prototype = {
  _loop() {
    const that = this;
    const animations = that._animations;
    let activeAnimation = 0;
    const now = new Date().getTime();
    let an;
    const endAnimation = that._endAnimation;

    for (an in animations) {
      if (!animations[an].tick(now)) {
        delete animations[an];
      }
      activeAnimation++;
    }
    if (activeAnimation === 0) {
      that.stop();
      that._endAnimationTimer = endAnimation && setTimeout(() => {
        if (that._animationCount === 0) {
          endAnimation();
          that._endAnimation = null;
        }
      });
      return;
    }
    that._timerId = requestAnimationFrame.call(null, () => {
      that._loop();
    }, that.element);
  },

  addAnimation(animation) {
    const that = this;
    that._animations[that._animationCount++] = animation;
    clearTimeout(that._endAnimationTimer);
    if (!that._timerId) {
      clearTimeout(that._startDelay);
      that._startDelay = setTimeout(() => {
        that._timerId = 1;
        that._loop();
      }, 0);
    }
  },

  animateElement(elem, params, options) {
    if (elem && params && options) {
      elem.animation && elem.animation.stop();
      this.addAnimation(elem.animation = new Animation(elem, params, options));
    }
  },

  onEndAnimation(endAnimation) {
    this._animationCount ? this._endAnimation = endAnimation : endAnimation();
  },

  dispose() {
    this.stop();
    this.element = null;
  },

  stop() {
    const that = this;

    that._animations = {};
    that._animationCount = 0;
    cancelAnimationFrame(that._timerId);
    clearTimeout(that._startDelay);
    clearTimeout(that._endAnimationTimer);
    that._timerId = null;
  },

  lock() {
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
  },
};
