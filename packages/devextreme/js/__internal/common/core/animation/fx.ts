/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-use-before-define */
import type { AnimationConfig } from '@js/common/core/animation';
import { cancelAnimationFrame, requestAnimationFrame } from '@js/common/core/animation/frame';
import positionUtils from '@js/common/core/animation/position';
import {
  clearCache,
  getTranslate,
  getTranslateCss,
  locate,
  parseTranslate,
} from '@js/common/core/animation/translator';
import { getPublicElement } from '@js/core/element';
import errors from '@js/core/errors';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { isFunction, isPlainObject } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import eventsEngine from '@js/events/core/events_engine';
import { removeEvent } from '@js/events/remove';
import { addNamespace } from '@js/events/utils/index';
import {
  convertTransitionTimingFuncToEasing,
  getEasing,
} from '@ts/common/core/animation/easing';
import type { TranslateVector } from '@ts/common/core/animation/translator';
import supportUtils from '@ts/core/utils/m_support';

const window = getWindow();
const removeEventName = addNamespace(removeEvent, 'dxFX');

const RELATIVE_VALUE_REGEX = /^([+-])=(.*)/i;
const ANIM_DATA_KEY = 'dxAnimData';
const ANIM_QUEUE_KEY = 'dxAnimQueue';
const TRANSFORM_PROP = 'transform';

interface TransitionAnimationConfig extends AnimationConfig {
  cleanupWhen?: Promise<unknown>;
  transitionAnimation: {
    deferred: DeferredObj<unknown>;
    finish: () => void;
    cleanup?: () => void;
  };
}

type FrameAnimation = Pick<AnimationConfig, 'to' | 'from' | 'easing' | 'duration'> & {
  currentValue: AnimationConfig['from'];
  startTime: number;
  delayTimeout?: number;
  animationFrameId?: number;
  finish: () => void;
  draw: () => void;
};

interface FrameAnimationConfig extends AnimationConfig {
  draw: Function;
  frameAnimation?: FrameAnimation;
}

type TransformConfig = Record<string, number> & {
  translate?: TranslateVector;
  scale?: number;
};

type AnimationStrategyName = 'transition' | 'frame' | 'noAnimation';

const TransitionAnimationStrategy = {
  initAnimation($element: dxElementWrapper, config: TransitionAnimationConfig): void {
    $element.css({
      transitionProperty: 'none',
    });

    if (typeof config.from === 'string') {
      $element.addClass(config.from);
    } else {
      setProps($element, config.from);
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    // @ts-expect-error
    const deferred = new Deferred();
    const { cleanupWhen } = config;

    config.transitionAnimation = {
      deferred,
      finish(): void {
        that._finishTransition($element);
        if (cleanupWhen) {
          when(deferred, cleanupWhen).always(() => {
            that._cleanup($element, config);
          });
        } else {
          that._cleanup($element, config);
        }
        deferred.resolveWith($element, [config, $element]);
      },
    };

    this._completeAnimationCallback($element, config)
      .done(() => {
        config.transitionAnimation.finish();
      })
      .fail(() => {
        deferred.rejectWith($element, [config, $element]);
      });

    if (!config.duration) {
      config.transitionAnimation.finish();
    }

    // NOTE: Hack for setting 'from' css by browser before run animation
    //       Do not move this hack to initAnimation since
    //       some css props can be changed in the 'start' callback (T231434)
    //       Unfortunately this can't be unit tested
    // TODO: find better way if possible
    $element.css('transform');
  },
  animate($element: dxElementWrapper, config: TransitionAnimationConfig): Promise<unknown> {
    this._startAnimation($element, config);
    return config.transitionAnimation.deferred.promise();
  },

  _completeAnimationCallback(
    $element: dxElementWrapper,
    config: TransitionAnimationConfig,
  ): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    // @ts-expect-error
    const startTime = Date.now() + config.delay;
    // @ts-expect-error
    const deferred: DeferredObj<unknown> = new Deferred();
    // @ts-expect-error
    const transitionEndFired: DeferredObj<unknown> = new Deferred();
    // @ts-expect-error
    const simulatedTransitionEndFired: DeferredObj<unknown> = new Deferred();
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let simulatedEndEventTimer: number | undefined;
    const transitionEndEventFullName = `${supportUtils.transitionEndEventName()}.dxFX`;

    config.transitionAnimation.cleanup = function (): void {
      clearTimeout(simulatedEndEventTimer);
      clearTimeout(waitForJSCompleteTimer);
      eventsEngine.off($element, transitionEndEventFullName);
      eventsEngine.off($element, removeEventName);
    };

    eventsEngine.one($element, transitionEndEventFullName, () => {
      // NOTE: prevent native transitionEnd event from previous animation in queue (Chrome)
      // @ts-expect-error
      if (Date.now() - startTime >= config.duration) {
        transitionEndFired.reject();
      }
    });
    eventsEngine.off($element, removeEventName);
    eventsEngine.on($element, removeEventName, () => {
      that.stop($element, config);
      deferred.reject();
    });

    // Fix for a visual bug (T244514): do not setup the timer until all js code has finished working
    // eslint-disable-next-line no-restricted-globals
    const waitForJSCompleteTimer = setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      simulatedEndEventTimer = setTimeout(
        () => {
          simulatedTransitionEndFired.reject();
        },
        // @ts-expect-error
        config.duration + config.delay + fx._simulatedTransitionEndDelay, /* T255863 */
      ) as unknown as number;

      when(transitionEndFired, simulatedTransitionEndFired).fail(() => {
        deferred.resolve();
      });
    });

    return deferred.promise();
  },

  _startAnimation($element: dxElementWrapper, config: TransitionAnimationConfig): void {
    $element.css({
      transitionProperty: 'all',
      transitionDelay: `${config.delay}ms`,
      transitionDuration: `${config.duration}ms`,
      transitionTimingFunction: config.easing,
    });

    if (typeof config.to === 'string') {
      $element[0].className += ` ${config.to}`;
      // Do not uncomment: performance critical
      // $element.addClass(config.to);
    } else if (config.to) {
      setProps($element, config.to);
    }
  },

  _finishTransition($element: dxElementWrapper): void {
    $element.css('transition', 'none');
  },

  _cleanup($element: dxElementWrapper, config: TransitionAnimationConfig): void {
    // @ts-expect-error
    config.transitionAnimation.cleanup();

    if (typeof config.from === 'string') {
      $element.removeClass(config.from);
      // @ts-expect-error
      $element.removeClass(config.to);
    }
  },

  stop($element: dxElementWrapper, config: TransitionAnimationConfig, jumpToEnd?: boolean): void {
    if (!config) {
      return;
    }

    if (jumpToEnd) {
      config.transitionAnimation.finish();
    } else {
      if (isPlainObject(config.to)) {
        each(config.to, (key) => {
          // @ts-expect-error
          $element.css(key, $element.css(key));
        });
      }
      this._finishTransition($element);
      this._cleanup($element, config);
    }
  },
};

const FrameAnimationStrategy = {
  initAnimation($element: dxElementWrapper, config: FrameAnimationConfig): void {
    setProps($element, config.from);
  },
  animate($element: dxElementWrapper, config: FrameAnimationConfig): Promise<unknown> {
    // @ts-expect-error
    const deferred: DeferredObj<unknown> = new Deferred();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    if (!config) {
      return deferred.reject().promise();
    }

    each(config.to, (prop) => {
      // @ts-expect-error
      if (config.from[prop] === undefined) {
        // @ts-expect-error
        config.from[prop] = that._normalizeValue($element.css(prop));
      }
    });

    // @ts-expect-error
    if (config.to[TRANSFORM_PROP]) {
      // @ts-expect-error
      config.from[TRANSFORM_PROP] = that._parseTransform(config.from[TRANSFORM_PROP]);
      // @ts-expect-error
      config.to[TRANSFORM_PROP] = that._parseTransform(config.to[TRANSFORM_PROP]);
    }

    config.frameAnimation = {
      to: config.to,
      from: config.from,
      currentValue: config.from,
      // @ts-expect-error
      easing: convertTransitionTimingFuncToEasing(config.easing),
      duration: config.duration,
      startTime: new Date().valueOf(),
      finish(): void {
        this.currentValue = this.to;
        this.draw();
        // @ts-expect-error
        cancelAnimationFrame(config.frameAnimation.animationFrameId);
        deferred.resolve();
      },
      draw(): void {
        if (config.draw) {
          config.draw(this.currentValue);
          return;
        }

        const currentValue = extend({}, this.currentValue);

        if (currentValue[TRANSFORM_PROP]) {
          // @ts-expect-error
          // eslint-disable-next-line consistent-return
          currentValue[TRANSFORM_PROP] = map(currentValue[TRANSFORM_PROP], (value, prop) => {
            if (prop === 'translate') {
              return getTranslateCss(value);
            } if (prop === 'scale') {
              return `scale(${value})`;
            } if (prop.substr(0, prop.length - 1) === 'rotate') {
              return `${prop}(${value}deg)`;
            }
          }).join(' ');
        }

        $element.css(currentValue);
      },
    };

    if (config.delay) {
      config.frameAnimation.startTime += config.delay;
      // eslint-disable-next-line no-restricted-globals
      config.frameAnimation.delayTimeout = setTimeout(() => {
        that._startAnimation($element, config);
      }, config.delay) as unknown as number;
    } else {
      that._startAnimation($element, config);
    }
    return deferred.promise();
  },

  _startAnimation($element: dxElementWrapper, config: FrameAnimationConfig): void {
    eventsEngine.off($element, removeEventName);
    eventsEngine.on($element, removeEventName, () => {
      if (config.frameAnimation) {
        // @ts-expect-error
        cancelAnimationFrame(config.frameAnimation.animationFrameId);
      }
    });

    this._animationStep($element, config);
  },

  _parseTransform(transformString: string): TransformConfig {
    const result: TransformConfig = {};

    each(transformString.match(/\w+\d*\w*\([^)]*\)\s*/g), (i, part) => {
      const translateData = parseTranslate(part);
      const scaleData = part.match(/scale\((.+?)\)/);
      const rotateData = part.match(/(rotate.)\((.+)deg\)/);

      if (translateData) {
        result.translate = translateData;
      }

      if (scaleData && scaleData[1]) {
        result.scale = parseFloat(scaleData[1]);
      }

      if (rotateData && rotateData[1]) {
        result[rotateData[1]] = parseFloat(rotateData[2]);
      }
    });

    return result;
  },

  stop($element: dxElementWrapper, config: FrameAnimationConfig, jumpToEnd?: boolean): void {
    const frameAnimation = config && config.frameAnimation;

    if (!frameAnimation) {
      return;
    }

    // @ts-expect-error
    cancelAnimationFrame(frameAnimation.animationFrameId);
    clearTimeout(frameAnimation.delayTimeout);

    if (jumpToEnd) {
      frameAnimation.finish();
    }

    delete config.frameAnimation;
  },

  _animationStep($element: dxElementWrapper, config: FrameAnimationConfig): void {
    const frameAnimation = config && config.frameAnimation;

    if (!frameAnimation) {
      return;
    }

    const now = new Date().valueOf();

    // @ts-expect-error
    if (now >= frameAnimation.startTime + frameAnimation.duration) {
      frameAnimation.finish();
      return;
    }

    // eslint-disable-next-line @stylistic/max-len
    frameAnimation.currentValue = this._calcStepValue(frameAnimation, now - frameAnimation.startTime);
    frameAnimation.draw();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    frameAnimation.animationFrameId = requestAnimationFrame(() => {
      that._animationStep($element, config);
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _calcStepValue(frameAnimation: FrameAnimation, currentDuration: number): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calcValueRecursively = function (from: FrameAnimation['from'], to: FrameAnimation['to']): any {
      const result = Array.isArray(to) ? [] : {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const calcEasedValue = function (propName: string): any {
        // @ts-expect-error
        const x = currentDuration / frameAnimation.duration;
        const t = currentDuration;
        // @ts-expect-error
        const b = 1 * from[propName];
        // @ts-expect-error
        const c = to[propName] - from[propName];
        const d = frameAnimation.duration;

        // @ts-expect-error
        return getEasing(frameAnimation.easing)(x, t, b, c, d);
      };

      // @ts-expect-error
      // eslint-disable-next-line consistent-return
      each(to, (propName: string, endPropValue) => {
        // @ts-expect-error
        if (typeof endPropValue === 'string' && parseFloat(endPropValue) === false) {
          return true;
        }

        result[propName] = typeof endPropValue === 'object'
          // @ts-expect-error
          ? calcValueRecursively(from[propName], endPropValue)
          : calcEasedValue(propName);
      });

      return result;
    };

    return calcValueRecursively(frameAnimation.from, frameAnimation.to);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _normalizeValue(value: any): any {
    const numericValue = parseFloat(value);

    // @ts-expect-error
    if (numericValue === false) {
      return value;
    }

    return numericValue;
  },
};

const FallbackToNoAnimationStrategy = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  initAnimation() {
  },
  animate(): Promise<unknown> {
    // @ts-expect-error
    return (new Deferred() as DeferredObj<unknown>).resolve().promise();
  },
  stop: noop,
  isSynchronous: true,
};

type AnimationStrategy = typeof TransitionAnimationStrategy
  | typeof FrameAnimationStrategy
  | typeof FallbackToNoAnimationStrategy;

const getAnimationStrategy = function (
  config: AnimationConfig & { strategy?: AnimationStrategyName },
): AnimationStrategy {
  // eslint-disable-next-line no-param-reassign
  config = config || {};
  const animationStrategies = {
    transition: supportUtils.transition() ? TransitionAnimationStrategy : FrameAnimationStrategy,
    frame: FrameAnimationStrategy,
    noAnimation: FallbackToNoAnimationStrategy,
  };
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  let strategy = config.strategy || 'transition';

  if (config.type === 'css' && !supportUtils.transition()) {
    strategy = 'noAnimation';
  }

  return animationStrategies[strategy];
};

const baseConfigValidator = function (config, animationType, validate, typeMessage): void {
  each(['from', 'to'], function () {
    if (!validate(config[this])) {
      throw errors.Error('E0010', animationType, this, typeMessage);
    }
  });
};

const isObjectConfigValidator = function (config, animationType): void {
  return baseConfigValidator(config, animationType, (target) => isPlainObject(target), 'a plain object');
};

const isStringConfigValidator = function (config, animationType): void {
  return baseConfigValidator(config, animationType, (target) => typeof target === 'string', 'a string');
};

const CustomAnimationConfigurator = {
  setup(): void {
  },
};

const CssAnimationConfigurator = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validateConfig(config): void {
    isStringConfigValidator(config, 'css');
  },

  setup(): void {
  },
};

const positionAliases = {
  top: { my: 'bottom center', at: 'top center' },
  bottom: { my: 'top center', at: 'bottom center' },
  right: { my: 'left center', at: 'right center' },
  left: { my: 'right center', at: 'left center' },
};

const SlideAnimationConfigurator = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validateConfig(config): void {
    isObjectConfigValidator(config, 'slide');
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup($element: dxElementWrapper, config): void {
    const location = locate($element);

    if (config.type !== 'slide') {
      const positioningConfig = config.type === 'slideIn' ? config.from : config.to;

      positioningConfig.position = extend({ of: window }, positionAliases[config.direction]);
      setupPosition($element, positioningConfig);
    }

    this._setUpConfig(location, config.from);
    this._setUpConfig(location, config.to);

    clearCache($element);
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _setUpConfig(location, config): void {
    config.left = 'left' in config ? config.left : '+=0';
    config.top = 'top' in config ? config.top : '+=0';

    this._initNewPosition(location, config);
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _initNewPosition(location, config): void {
    const position = {
      left: config.left,
      top: config.top,
    };

    delete config.left;
    delete config.top;

    let relativeValue = this._getRelativeValue(position.left);
    if (relativeValue !== undefined) {
      position.left = relativeValue + location.left;
    } else {
      config.left = 0;
    }

    relativeValue = this._getRelativeValue(position.top);
    if (relativeValue !== undefined) {
      position.top = relativeValue + location.top;
    } else {
      config.top = 0;
    }

    config[TRANSFORM_PROP] = getTranslateCss({ x: position.left, y: position.top });
  },

  // @ts-ignore
  // eslint-disable-next-line consistent-return, @typescript-eslint/explicit-module-boundary-types
  _getRelativeValue(value): number | undefined {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let relativeValue: RegExpExecArray | null | undefined;
    // eslint-disable-next-line no-cond-assign
    if (typeof value === 'string' && (relativeValue = RELATIVE_VALUE_REGEX.exec(value))) {
      // @ts-expect-error
      return parseInt(`${relativeValue[1]}1`, 10) * relativeValue[2];
    }
  },
};

const FadeAnimationConfigurator = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup($element: dxElementWrapper, config): void {
    const { from, to } = config;
    const defaultFromOpacity = config.type === 'fadeOut' ? 1 : 0;
    const defaultToOpacity = config.type === 'fadeOut' ? 0 : 1;
    let fromOpacity: string | undefined = isPlainObject(from)
      ? String(from.opacity ?? defaultFromOpacity)
      : String(from);
    let toOpacity: string | number = isPlainObject(to)
      ? String(to.opacity ?? defaultToOpacity)
      : String(to);

    if (!config.skipElementInitialStyles) {
      fromOpacity = $element.css('opacity');
    }

    switch (config.type) {
      case 'fadeIn':
        toOpacity = 1;
        break;
      case 'fadeOut':
        toOpacity = 0;
        break;
      default:
        break;
    }

    config.from = {
      visibility: 'visible',
      opacity: fromOpacity,
    };

    config.to = {
      opacity: toOpacity,
    };
  },
};

const PopAnimationConfigurator = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validateConfig(config): void {
    isObjectConfigValidator(config, 'pop');
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup($element: dxElementWrapper, config): void {
    const { from, to } = config;
    const fromOpacity = 'opacity' in from ? from.opacity : $element.css('opacity');
    const toOpacity = 'opacity' in to ? to.opacity : 1;
    const fromScale = 'scale' in from ? from.scale : 0;
    const toScale = 'scale' in to ? to.scale : 1;

    config.from = {
      opacity: fromOpacity,
    };

    const translate = getTranslate($element);

    config.from[TRANSFORM_PROP] = this._getCssTransform(translate, fromScale);

    config.to = {
      opacity: toOpacity,
    };
    config.to[TRANSFORM_PROP] = this._getCssTransform(translate, toScale);
  },

  _getCssTransform(translate: TranslateVector, scale: number): string {
    return `${getTranslateCss(translate)}scale(${scale})`;
  },
};

const animationConfigurators = {
  custom: CustomAnimationConfigurator,
  slide: SlideAnimationConfigurator,
  slideIn: SlideAnimationConfigurator,
  slideOut: SlideAnimationConfigurator,
  fade: FadeAnimationConfigurator,
  fadeIn: FadeAnimationConfigurator,
  fadeOut: FadeAnimationConfigurator,
  pop: PopAnimationConfigurator,
  css: CssAnimationConfigurator,
};

type AnimationConfigurator = typeof animationConfigurators[keyof typeof animationConfigurators];

const getAnimationConfigurator = function (config): AnimationConfigurator {
  const result: AnimationConfigurator = animationConfigurators[config.type];
  if (!result) {
    throw errors.Error('E0011', config.type);
  }

  return result;
};

const defaultJSConfig = {
  type: 'custom',
  from: {},
  to: {},
  duration: 400,
  start: noop,
  complete: noop,
  easing: 'ease',
  delay: 0,
};
const defaultCssConfig = {
  duration: 400,
  easing: 'ease',
  delay: 0,
};

export interface Animation {
  element: dxElementWrapper;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  configurator: AnimationConfigurator;
  strategy: AnimationStrategy;
  isSynchronous: boolean;
  setup: () => void;
  start: () => DeferredObj<unknown>;
  stop: (jumpToEnd?: boolean) => void;
  deferred: DeferredObj<unknown>;
  startTimeout?: number;
  isStarted?: boolean;
}

function setupAnimationOnElement(): void {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const animation: Animation = this;
  const $element = animation.element;
  const { config } = animation;

  setupPosition($element, config.from);
  setupPosition($element, config.to);

  animation.configurator.setup($element, config);

  $element.data(ANIM_DATA_KEY, animation);

  if (fx.off) {
    config.duration = 0;
    config.delay = 0;
  }

  animation.strategy.initAnimation($element, config);

  if (config.start) {
    const element = getPublicElement($element);
    config.start.apply(this, [element, config]);
  }
}

const onElementAnimationComplete = function (animation: Animation): void {
  const $element = animation.element;
  const { config } = animation;

  $element.removeData(ANIM_DATA_KEY);
  if (config.complete) {
    const element = getPublicElement($element);
    config.complete.apply(this, [element, config]);
  }
  animation.deferred.resolveWith(this, [$element, config]);
};

const startAnimationOnElement = function (): DeferredObj<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const animation: Animation = this;
  const $element = animation.element;
  const { config } = animation;

  animation.isStarted = true;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return animation.strategy.animate($element, config)
    // @ts-expect-error
    .done(() => {
      onElementAnimationComplete(animation);
    })
    .fail(function () {
      animation.deferred.rejectWith(this, [$element, config]);
    });
};

const stopAnimationOnElement = function (jumpToEnd?: boolean): void {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const animation: Animation = this;
  const $element = animation.element;
  const { config } = animation;

  clearTimeout(animation.startTimeout);

  if (!animation.isStarted) {
    animation.start();
  }

  animation.strategy.stop($element, config, jumpToEnd);
};

const scopedRemoveEvent = addNamespace(removeEvent, 'dxFXStartAnimation');

const subscribeToRemoveEvent = function (animation: Animation): void {
  eventsEngine.off(animation.element, scopedRemoveEvent);
  eventsEngine.on(animation.element, scopedRemoveEvent, () => {
    fx.stop(animation.element);
  });

  animation.deferred.always(() => {
    eventsEngine.off(animation.element, scopedRemoveEvent);
  });
};

const createAnimation = function (
  element: dxElementWrapper | Element | undefined,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  initialConfig,
): Animation {
  const defaultConfig = initialConfig.type === 'css' ? defaultCssConfig : defaultJSConfig;
  const config = extend(true, {}, defaultConfig, initialConfig);
  const configurator = getAnimationConfigurator(config);
  const strategy = getAnimationStrategy(config);
  const animation = {
    element: $(element),
    config,
    configurator,
    strategy,
    // @ts-expect-error
    isSynchronous: strategy.isSynchronous,
    setup: setupAnimationOnElement,
    start: startAnimationOnElement,
    stop: stopAnimationOnElement,
    // @ts-expect-error
    deferred: new Deferred(),
  };

  if ('validateConfig' in configurator && isFunction(configurator.validateConfig)) {
    configurator.validateConfig(config);
  }

  subscribeToRemoveEvent(animation);

  return animation;
};

const animate = function (
  element: dxElementWrapper | Element | undefined,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  config,
): Promise<unknown> {
  const $element = $(element);

  if (!$element.length) {
    // @ts-expect-error
    return (new Deferred() as DeferredObj<unknown>).resolve().promise();
  }

  const animation = createAnimation($element, config);

  pushInAnimationQueue($element, animation);
  return animation.deferred.promise();
};

function pushInAnimationQueue($element: dxElementWrapper, animation: Animation): void {
  const queueData = getAnimQueueData($element);
  writeAnimQueueData($element, queueData);
  queueData.push(animation);

  if (!isAnimating($element)) {
    shiftFromAnimationQueue($element, queueData);
  }
}

function getAnimQueueData($element: dxElementWrapper): Animation[] {
  // @ts-expect-error
  return $element.data(ANIM_QUEUE_KEY) || [];
}

function writeAnimQueueData($element: dxElementWrapper, queueData: Animation[]): void {
  $element.data(ANIM_QUEUE_KEY, queueData);
}

const destroyAnimQueueData = function ($element: dxElementWrapper): void {
  $element.removeData(ANIM_QUEUE_KEY);
};

function isAnimating(element: dxElementWrapper | Element | undefined): boolean {
  const $element = $(element);
  return !!$element.data(ANIM_DATA_KEY);
}

function shiftFromAnimationQueue($element: dxElementWrapper, queueData?: Animation[]): void {
  // eslint-disable-next-line no-param-reassign
  queueData = getAnimQueueData($element);
  if (!queueData.length) {
    return;
  }

  const animation = queueData.shift();
  if (queueData.length === 0) {
    destroyAnimQueueData($element);
  }

  // @ts-expect-error
  executeAnimation(animation).done(() => {
    if (!isAnimating($element)) {
      shiftFromAnimationQueue($element);
    }
  });
}

function executeAnimation(animation: Animation): Promise<unknown> {
  animation.setup();
  if (fx.off || animation.isSynchronous) {
    animation.start();
  } else {
    // eslint-disable-next-line no-restricted-globals
    animation.startTimeout = setTimeout(() => {
      animation.start();
    }) as unknown as number;
  }

  return animation.deferred.promise();
}

function setupPosition($element: dxElementWrapper, config): void {
  if (!config || !config.position) {
    return;
  }

  const win = $(window);
  let left = 0;
  let top = 0;
  const position = positionUtils.calculate($element, config.position);
  const offset = $element.offset();
  const currentPosition = $element.position();

  // @ts-expect-error
  if (currentPosition.top > offset.top) {
    // @ts-expect-error
    top = win.scrollTop();
  }

  // @ts-expect-error
  if (currentPosition.left > offset.left) {
    // @ts-expect-error
    left = win.scrollLeft();
  }

  extend(config, {
    // @ts-expect-error
    left: position.h.location - offset.left + currentPosition.left - left,
    // @ts-expect-error
    top: position.v.location - offset.top + currentPosition.top - top,
  });

  delete config.position;
}

function setProps($element: dxElementWrapper, props): void {
  each(props, (key, value) => {
    try {
      $element.css(key, isFunction(value) ? value() : value);
      // eslint-disable-next-line no-empty
    } catch (e) { }
  });
}

const stop = function (element: dxElementWrapper | Element | undefined, jumpToEnd?: boolean): void {
  const $element = $(element);
  const queueData = getAnimQueueData($element);

  // TODO: think about complete all animation in queue
  each(queueData, (_, animation) => {
    animation.config.delay = 0;
    animation.config.duration = 0;
    animation.isSynchronous = true;
  });

  if (!isAnimating($element)) {
    shiftFromAnimationQueue($element, queueData);
  }
  const animation = $element.data(ANIM_DATA_KEY) as unknown as Animation;

  if (animation) {
    animation.stop(jumpToEnd);
  }

  $element.removeData(ANIM_DATA_KEY);
  destroyAnimQueueData($element);
};

const fx = {
  off: false,
  animationTypes: animationConfigurators,
  animate,
  createAnimation,
  isAnimating,
  stop,
  _simulatedTransitionEndDelay: 100,
};

export default fx;
