import fx from '@js/common/core/animation/fx';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { map } from '@js/core/utils/iterator';
import { isFunction, isPlainObject } from '@js/core/utils/type';
import type {
  AnimationFactory,
  TransitionAnimationConfig,
  TransitionPreset,
  TransitionType,
} from '@ts/common/core/animation/presets/m_presets';
import { presets } from '@ts/common/core/animation/presets/m_presets';
import commonUtils from '@ts/core/utils/m_common';

import type { Animation } from '../fx';

const directionPostfixes: Record<string, string> = {
  forward: ' dx-forward',
  backward: ' dx-backward',
  none: ' dx-no-direction',
  undefined: ' dx-no-direction',
};
const DX_ANIMATING_CLASS = 'dx-animating';

type TransitionElements = Parameters<typeof $>[0];

interface ElementAnimationConfig extends TransitionAnimationConfig {
  skipElementInitialStyles: boolean;
  cleanupWhen: Promise<unknown>;
}

type ElementAnimation = ElementAnimationConfig | AnimationFactory;

export class TransitionExecutor {
  _accumulatedDelays: Record<TransitionType, number>;

  _animations: Animation[];

  _completeDeferred!: DeferredObj<unknown>;

  _completePromise!: Promise<unknown>;

  constructor() {
    this._accumulatedDelays = {
      enter: 0,
      leave: 0,
    };
    this._animations = [];
    this.reset();
  }

  _createAnimations(
    elements: TransitionElements,
    initialConfig: TransitionPreset | string | undefined,
    configModifier: TransitionAnimationConfig | undefined,
    type: TransitionType,
  ): Animation[] {
    const $elements = $(elements);
    const result: Animation[] = [];

    const modifier = configModifier || {};
    const animationConfig = this._prepareElementAnimationConfig(
      initialConfig,
      modifier,
      type,
    );

    if (animationConfig) {
      $elements.each((_, element) => {
        const animation = this._createAnimation(
          $(element),
          animationConfig,
          modifier,
        );
        if (animation) {
          animation.element.addClass(DX_ANIMATING_CLASS);
          animation.setup();
          result.push(animation);
        }

        return true;
      });
    }

    return result;
  }

  _prepareElementAnimationConfig(
    initialConfig: TransitionPreset | string | undefined,
    configModifier: TransitionAnimationConfig,
    type: TransitionType,
  ): ElementAnimation | undefined {
    const config = typeof initialConfig === 'string'
      ? presets.getPreset(initialConfig)
      : initialConfig;

    if (!config) {
      return undefined;
    }
    if (isFunction(config[type])) {
      return config[type];
    }

    const result: ElementAnimationConfig = extend({
      skipElementInitialStyles: true,
      cleanupWhen: this._completePromise,
    }, config, configModifier);

    if (!result.type || result.type === 'css') {
      const cssClass = `dx-${type}`;
      const extraCssClasses = (result.extraCssClasses ? ` ${result.extraCssClasses}` : '') + directionPostfixes[String(result.direction)];

      result.type = 'css';
      // eslint-disable-next-line @typescript-eslint/no-base-to-string -- the former `+ ''` coercion
      result.from = String(result.from || cssClass) + extraCssClasses;
      result.to = result.to || `${cssClass}-active`;
    }

    result.staggerDelay = result.staggerDelay || 0;
    result.delay = result.delay || 0;

    if (result.staggerDelay) {
      result.delay += this._accumulatedDelays[type];
      this._accumulatedDelays[type] += result.staggerDelay;
    }

    return result;
  }

  _createAnimation(
    $element: dxElementWrapper,
    animationConfig: ElementAnimation,
    configModifier: TransitionAnimationConfig,
  ): Animation | undefined {
    if (isFunction(animationConfig)) {
      return animationConfig($element, configModifier);
    }
    if (isPlainObject(animationConfig)) {
      return fx.createAnimation($element, animationConfig);
    }

    return undefined;
  }

  _startAnimations(): void {
    for (const animation of this._animations) {
      animation.start();
    }
  }

  _stopAnimations(jumpToEnd?: boolean): void {
    for (const animation of this._animations) {
      animation.stop(jumpToEnd);
    }
  }

  _clearAnimations(): void {
    for (const animation of this._animations) {
      animation.element.removeClass(DX_ANIMATING_CLASS);
    }

    this._animations.length = 0;
  }

  reset(): void {
    this._accumulatedDelays.enter = 0;
    this._accumulatedDelays.leave = 0;
    this._clearAnimations();
    this._completeDeferred = Deferred();
    this._completePromise = this._completeDeferred.promise();
  }

  enter(
    elements: TransitionElements,
    animationConfig: TransitionPreset | string | undefined,
    configModifier?: TransitionAnimationConfig,
  ): void {
    const animations = this._createAnimations(elements, animationConfig, configModifier, 'enter');
    this._animations.push(...animations);
  }

  leave(
    elements: TransitionElements,
    animationConfig: TransitionPreset | string | undefined,
    configModifier?: TransitionAnimationConfig,
  ): void {
    const animations = this._createAnimations(elements, animationConfig, configModifier, 'leave');
    this._animations.push(...animations);
  }

  start(): DeferredObj<unknown> | Promise<unknown> {
    if (!this._animations.length) {
      this.reset();

      return Deferred().resolve().promise();
    }

    const animationDeferreds = map(this._animations, (animation: Animation) => {
      const animationDeferred = Deferred();

      animation.deferred.always(() => {
        animationDeferred.resolve();
      });

      return animationDeferred.promise();
    });

    const result = when.apply($, animationDeferreds)
      .always(() => {
        this._completeDeferred.resolve();
        this.reset();
      });

    commonUtils.executeAsync(() => {
      this._startAnimations();
    });

    return result;
  }

  stop(jumpToEnd?: boolean): void {
    this._stopAnimations(jumpToEnd);
  }
}
