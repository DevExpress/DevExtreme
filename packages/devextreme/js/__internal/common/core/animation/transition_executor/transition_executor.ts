import fx from '@js/common/core/animation/fx';
import Class from '@js/core/class';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { map } from '@js/core/utils/iterator';
import { isFunction, isPlainObject } from '@js/core/utils/type';
import { presets } from '@ts/common/core/animation/presets/m_presets';
import commonUtils from '@ts/core/utils/m_common';

import type { Animation } from '../fx';

const directionPostfixes = {
  forward: ' dx-forward',
  backward: ' dx-backward',
  none: ' dx-no-direction',
  undefined: ' dx-no-direction',
};
const DX_ANIMATING_CLASS = 'dx-animating';

export const TransitionExecutor = Class.inherit({
  ctor() {
    this._accumulatedDelays = {
      enter: 0,
      leave: 0,
    };
    this._animations = [];
    this.reset();
  },

  _createAnimations($elements, initialConfig, configModifier, type) {
    // eslint-disable-next-line no-param-reassign
    $elements = $($elements);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const result: Animation[] = [];

    // eslint-disable-next-line no-param-reassign
    configModifier = configModifier || {};
    const animationConfig = this._prepareElementAnimationConfig(
      initialConfig,
      configModifier,
      type,
    );

    if (animationConfig) {
      $elements.each(function () {
        const animation: Animation | undefined = that._createAnimation(
          $(this),
          animationConfig,
          configModifier,
        );
        if (animation) {
          animation.element.addClass(DX_ANIMATING_CLASS);
          animation.setup();
          result.push(animation);
        }
      });
    }

    return result;
  },

  _prepareElementAnimationConfig(config, configModifier, type) {
    // eslint-disable-next-line no-undef-init, @typescript-eslint/no-explicit-any
    let result: any = undefined;

    if (typeof config === 'string') {
      const presetName = config;
      // eslint-disable-next-line no-param-reassign
      config = presets.getPreset(presetName);
    }

    if (!config) {
      result = undefined;
    } else if (isFunction(config[type])) {
      result = config[type];
    } else {
      result = extend({
        skipElementInitialStyles: true,
        cleanupWhen: this._completePromise,
      }, config, configModifier);

      if (!result.type || result.type === 'css') {
        const cssClass = `dx-${type}`;
        const extraCssClasses = (result.extraCssClasses ? ` ${result.extraCssClasses}` : '') + directionPostfixes[result.direction];

        result.type = 'css';
        result.from = (result.from || cssClass) + extraCssClasses;
        result.to = result.to || `${cssClass}-active`;
      }

      result.staggerDelay = result.staggerDelay || 0;
      result.delay = result.delay || 0;

      if (result.staggerDelay) {
        result.delay += this._accumulatedDelays[type];
        this._accumulatedDelays[type] += result.staggerDelay;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  },

  _createAnimation(
    $element: dxElementWrapper,
    animationConfig,
    configModifier,
  ): Animation | undefined {
    // eslint-disable-next-line no-undef-init
    let result: Animation | undefined = undefined;

    if (isPlainObject(animationConfig)) {
      result = fx.createAnimation($element, animationConfig);
    } else if (isFunction(animationConfig)) {
      result = animationConfig($element, configModifier);
    }

    return result;
  },

  _startAnimations(): void {
    const animations: Animation[] = this._animations;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < animations.length; i += 1) {
      animations[i].start();
    }
  },

  _stopAnimations(jumpToEnd?: boolean): void {
    const animations: Animation[] = this._animations;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < animations.length; i += 1) {
      animations[i].stop(jumpToEnd);
    }
  },

  _clearAnimations(): void {
    const animations: Animation[] = this._animations;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < animations.length; i += 1) {
      animations[i].element.removeClass(DX_ANIMATING_CLASS);
    }

    this._animations.length = 0;
  },

  reset(): void {
    this._accumulatedDelays.enter = 0;
    this._accumulatedDelays.leave = 0;
    this._clearAnimations();
    // @ts-expect-error
    this._completeDeferred = new Deferred();
    this._completePromise = this._completeDeferred.promise();
  },

  enter($elements: dxElementWrapper, animationConfig, configModifier): void {
    const animations = this._createAnimations($elements, animationConfig, configModifier, 'enter');
    // eslint-disable-next-line prefer-spread
    this._animations.push.apply(this._animations, animations);
  },

  leave($elements: dxElementWrapper, animationConfig, configModifier): void {
    const animations = this._createAnimations($elements, animationConfig, configModifier, 'leave');
    // eslint-disable-next-line prefer-spread
    this._animations.push.apply(this._animations, animations);
  },

  start() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    // eslint-disable-next-line no-undef-init
    let result: DeferredObj<unknown> | undefined = undefined;

    if (!this._animations.length) {
      that.reset();
      // @ts-expect-error
      result = new Deferred().resolve().promise();
    } else {
      const animationDeferreds = map(this._animations, (animation: Animation) => {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const result: DeferredObj<unknown> = new Deferred();

        animation.deferred.always(() => {
          result.resolve();
        });

        return result.promise();
      });

      result = when.apply($, animationDeferreds)
        .always(() => {
          that._completeDeferred.resolve();
          that.reset();
        });

      commonUtils.executeAsync(() => {
        that._startAnimations();
      });
    }

    return result;
  },

  stop(jumpToEnd?: boolean): void {
    this._stopAnimations(jumpToEnd);
  },
});
