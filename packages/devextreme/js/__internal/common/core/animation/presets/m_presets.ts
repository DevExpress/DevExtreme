import type { AnimationConfig } from '@js/common/core/animation';
import fx from '@js/common/core/animation/fx';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { getWidth } from '@js/core/utils/size';
import type { ComponentProperties } from '@ts/core/widget/component';
import { Component } from '@ts/core/widget/component';

import type { Animation } from '../fx';

export type TransitionDirection = 'forward' | 'backward' | 'none';

export type TransitionType = 'enter' | 'leave';

export interface TransitionAnimationConfig extends Omit<AnimationConfig, 'direction'> {
  direction?: TransitionDirection;
  extraCssClasses?: string;
}

export type AnimationFactory = (
  $element: dxElementWrapper,
  configModifier: TransitionAnimationConfig,
) => Animation;

export interface TransitionAnimationFactories {
  enter: AnimationFactory;
  leave: AnimationFactory;
}

export type TransitionPreset = TransitionAnimationConfig & Partial<TransitionAnimationFactories>;

export interface PresetConfig {
  device?: DefaultOptionsRule<unknown>['device'];
  animation: TransitionPreset | string;
}

interface RegisteredPreset {
  name: string;
  config: PresetConfig;
}

const directionPostfixes: Record<string, string> = {
  forward: ' dx-forward',
  backward: ' dx-backward',
  none: ' dx-no-direction',
  undefined: ' dx-no-direction',
};

const optionPrefix = 'preset_';

type PresetOptionName = `${typeof optionPrefix}${string}`;

export interface AnimationPresetCollectionProperties
  extends ComponentProperties<AnimationPresetCollection> {
  [presetOptionName: PresetOptionName]: TransitionPreset | string | undefined;
  defaultAnimationDuration: number;
  defaultAnimationDelay: number;
  defaultStaggerAnimationDuration: number;
  defaultStaggerAnimationDelay: number;
  defaultStaggerAnimationStartDelay: number;
}

const isAndroidDevice = (): boolean => !!(
  // @ts-expect-error devices.real is a method, `.android` on it is always undefined
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  devices.current().android || devices.real.android
);

class AnimationPresetCollection
  extends Component<AnimationPresetCollection, AnimationPresetCollectionProperties> {
  _registeredPresets: RegisteredPreset[];

  constructor() {
    super();
    this._registeredPresets = [];
    this.resetToDefaults();
  }

  _getDefaultOptions(): AnimationPresetCollectionProperties {
    return {
      ...super._getDefaultOptions(),
      defaultAnimationDuration: 400,
      defaultAnimationDelay: 0,
      defaultStaggerAnimationDuration: 300,
      defaultStaggerAnimationDelay: 40,
      defaultStaggerAnimationStartDelay: 500, // hack for better animations on ipad mini
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<AnimationPresetCollectionProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(device): boolean {
          return !!device.phone;
        },
        options: {
          defaultStaggerAnimationDuration: 350,
          defaultStaggerAnimationDelay: 50,
          defaultStaggerAnimationStartDelay: 0,
        },
      },
      { // T254756
        device(): boolean {
          return isAndroidDevice();
        },
        options: {
          defaultAnimationDelay: 100,
        },
      },
    ]);
  }

  _getPresetOptionName(animationName: string): PresetOptionName {
    return `${optionPrefix}${animationName}`;
  }

  // T257755
  _createAndroidSlideAnimationConfig(
    throughOpacity: number,
    widthMultiplier: number,
  ): TransitionAnimationFactories {
    const createBaseConfig = (
      configModifier: TransitionAnimationConfig,
    ): TransitionAnimationConfig => ({
      type: 'slide',
      delay: configModifier.delay === undefined
        ? this.option('defaultAnimationDelay')
        : configModifier.delay,
      duration: configModifier.duration === undefined
        ? this.option('defaultAnimationDuration')
        : configModifier.duration,
    });

    return {
      enter: ($element, configModifier): Animation => {
        const width = getWidth($element.parent()) * widthMultiplier;
        const { direction } = configModifier;
        const config = createBaseConfig(configModifier);
        config.to = {
          left: 0,
          opacity: 1,
        };

        if (direction === 'forward') {
          config.from = {
            left: width,
            opacity: throughOpacity,
          };
        } else if (direction === 'backward') {
          config.from = {
            left: -width,
            opacity: throughOpacity,
          };
        } else {
          config.from = {
            left: 0,
            opacity: 0,
          };
        }

        return fx.createAnimation($element, config);
      },
      leave: ($element, configModifier): Animation => {
        const width = getWidth($element.parent()) * widthMultiplier;
        const { direction } = configModifier;
        const config = createBaseConfig(configModifier);

        config.from = {
          left: 0,
          opacity: 1,
        };

        switch (direction) {
          case 'forward':
            config.to = {
              left: -width,
              opacity: throughOpacity,
            };
            break;
          case 'backward':
            config.to = {
              left: width,
              opacity: throughOpacity,
            };
            break;
          default:
            config.to = {
              left: 0,
              opacity: 0,
            };
        }

        return fx.createAnimation($element, config);
      },
    };
  }

  _createOpenDoorConfig(): TransitionAnimationFactories {
    const createBaseConfig = (
      configModifier: TransitionAnimationConfig,
    ): TransitionAnimationConfig => ({
      type: 'css',
      extraCssClasses: 'dx-opendoor-animation',
      delay: configModifier.delay === undefined
        ? this.option('defaultAnimationDelay')
        : configModifier.delay,
      duration: configModifier.duration === undefined
        ? this.option('defaultAnimationDuration')
        : configModifier.duration,
    });

    return {
      enter: ($element, configModifier): Animation => {
        const { direction } = configModifier;
        const config = createBaseConfig(configModifier);

        config.delay = direction === 'none' ? config.delay : config.duration;
        config.from = `dx-enter dx-opendoor-animation${directionPostfixes[String(direction)]}`;
        config.to = 'dx-enter-active';

        return fx.createAnimation($element, config);
      },
      leave: ($element, configModifier): Animation => {
        const { direction } = configModifier;
        const config = createBaseConfig(configModifier);

        config.from = `dx-leave dx-opendoor-animation${directionPostfixes[String(direction)]}`;
        config.to = 'dx-leave-active';

        return fx.createAnimation($element, config);
      },
    };
  }

  _createWinPopConfig(): TransitionAnimationFactories {
    const baseConfig: TransitionAnimationConfig = {
      type: 'css',
      extraCssClasses: 'dx-win-pop-animation',
      duration: this.option('defaultAnimationDuration'),
    };

    return {
      enter: ($element, configModifier): Animation => {
        const config = baseConfig;
        const { direction } = configModifier;

        config.delay = direction === 'none' ? this.option('defaultAnimationDelay') : this.option('defaultAnimationDuration') / 2;
        config.from = `dx-enter dx-win-pop-animation${directionPostfixes[String(direction)]}`;
        config.to = 'dx-enter-active';

        return fx.createAnimation($element, config);
      },
      leave: ($element, configModifier): Animation => {
        const config = baseConfig;
        const { direction } = configModifier;

        config.delay = this.option('defaultAnimationDelay');
        config.from = `dx-leave dx-win-pop-animation${directionPostfixes[String(direction)]}`;
        config.to = 'dx-leave-active';

        return fx.createAnimation($element, config);
      },
    };
  }

  resetToDefaults(): void {
    this.clear();
    this.registerDefaultPresets();
    this.applyChanges();
  }

  clear(name?: string): void {
    const newRegisteredPresets: RegisteredPreset[] = [];

    each(this._registeredPresets, (index, preset: RegisteredPreset) => {
      if (!name || name === preset.name) {
        this.option(this._getPresetOptionName(preset.name), undefined);
      } else {
        newRegisteredPresets.push(preset);
      }
    });
    this._registeredPresets = newRegisteredPresets;
    this.applyChanges();
  }

  registerPreset(name: string, config: PresetConfig): void {
    this._registeredPresets.push({
      name,
      config,
    });
  }

  applyChanges(): void {
    const customRules: DefaultOptionsRule<AnimationPresetCollectionProperties>[] = [];

    each(this._registeredPresets, (index, preset: RegisteredPreset) => {
      const rule: DefaultOptionsRule<AnimationPresetCollectionProperties> = {
        device: preset.config.device,
        options: {},
      };

      rule.options[this._getPresetOptionName(preset.name)] = preset.config.animation;
      customRules.push(rule);
    });

    this._setOptionsByDevice(customRules);
  }

  getPreset(name: string): TransitionPreset | undefined {
    let result: TransitionPreset | string | undefined = name;

    while (typeof result === 'string') {
      result = this.option(this._getPresetOptionName(result));
    }

    return result;
  }

  registerDefaultPresets(): void {
    this.registerPreset('pop', {
      animation: {
        extraCssClasses: 'dx-android-pop-animation',
        delay: this.option('defaultAnimationDelay'),
        duration: this.option('defaultAnimationDuration'),
      },
    });
    this.registerPreset('openDoor', {
      animation: this._createOpenDoorConfig(),
    });
    this.registerPreset('win-pop', {
      animation: this._createWinPopConfig(),
    });
    this.registerPreset('fade', {
      animation: {
        extraCssClasses: 'dx-fade-animation',
        delay: this.option('defaultAnimationDelay'),
        duration: this.option('defaultAnimationDuration'),
      },
    });
    this.registerPreset('slide', {
      device() {
        return isAndroidDevice();
      },
      animation: this._createAndroidSlideAnimationConfig(1, 1),
    });
    this.registerPreset('slide', {
      device() {
        return !isAndroidDevice();
      },
      animation: {
        extraCssClasses: 'dx-slide-animation',
        delay: this.option('defaultAnimationDelay'),
        duration: this.option('defaultAnimationDuration'),
      },
    });
    this.registerPreset('ios7-slide', {
      animation: {
        extraCssClasses: 'dx-ios7-slide-animation',
        delay: this.option('defaultAnimationDelay'),
        duration: this.option('defaultAnimationDuration'),
      },
    });
    this.registerPreset('overflow', {
      animation: {
        extraCssClasses: 'dx-overflow-animation',
        delay: this.option('defaultAnimationDelay'),
        duration: this.option('defaultAnimationDuration'),
      },
    });
    this.registerPreset('ios7-toolbar', {
      device() {
        return !isAndroidDevice();
      },
      animation: {
        extraCssClasses: 'dx-ios7-toolbar-animation',
        delay: this.option('defaultAnimationDelay'),
        duration: this.option('defaultAnimationDuration'),
      },
    });
    this.registerPreset('ios7-toolbar', {
      device() {
        return isAndroidDevice();
      },
      animation: this._createAndroidSlideAnimationConfig(0, 0.4),
    });
    this.registerPreset('stagger-fade', {
      animation: {
        extraCssClasses: 'dx-fade-animation',
        staggerDelay: this.option('defaultStaggerAnimationDelay'),
        duration: this.option('defaultStaggerAnimationDuration'),
        delay: this.option('defaultStaggerAnimationStartDelay'),
      },
    });
    this.registerPreset('stagger-slide', {
      animation: {
        extraCssClasses: 'dx-slide-animation',
        staggerDelay: this.option('defaultStaggerAnimationDelay'),
        duration: this.option('defaultStaggerAnimationDuration'),
        delay: this.option('defaultStaggerAnimationStartDelay'),
      },
    });
    this.registerPreset('stagger-fade-slide', {
      animation: {
        extraCssClasses: 'dx-fade-slide-animation',
        staggerDelay: this.option('defaultStaggerAnimationDelay'),
        duration: this.option('defaultStaggerAnimationDuration'),
        delay: this.option('defaultStaggerAnimationStartDelay'),
      },
    });
    this.registerPreset('stagger-drop', {
      animation: {
        extraCssClasses: 'dx-drop-animation',
        staggerDelay: this.option('defaultStaggerAnimationDelay'),
        duration: this.option('defaultStaggerAnimationDuration'),
        delay: this.option('defaultStaggerAnimationStartDelay'),
      },
    });
    this.registerPreset('stagger-fade-drop', {
      animation: {
        extraCssClasses: 'dx-fade-drop-animation',
        staggerDelay: this.option('defaultStaggerAnimationDelay'),
        duration: this.option('defaultStaggerAnimationDuration'),
        delay: this.option('defaultStaggerAnimationStartDelay'),
      },
    });
    this.registerPreset('stagger-fade-rise', {
      animation: {
        extraCssClasses: 'dx-fade-rise-animation',
        staggerDelay: this.option('defaultStaggerAnimationDelay'),
        duration: this.option('defaultStaggerAnimationDuration'),
        delay: this.option('defaultStaggerAnimationStartDelay'),
      },
    });
    this.registerPreset('stagger-3d-drop', {
      animation: {
        extraCssClasses: 'dx-3d-drop-animation',
        staggerDelay: this.option('defaultStaggerAnimationDelay'),
        duration: this.option('defaultStaggerAnimationDuration'),
        delay: this.option('defaultStaggerAnimationStartDelay'),
      },
    });
    this.registerPreset('stagger-fade-zoom', {
      animation: {
        extraCssClasses: 'dx-fade-zoom-animation',
        staggerDelay: this.option('defaultStaggerAnimationDelay'),
        duration: this.option('defaultStaggerAnimationDuration'),
        delay: this.option('defaultStaggerAnimationStartDelay'),
      },
    });
  }
}

const animationPresets = new AnimationPresetCollection();
export {
  AnimationPresetCollection as PresetCollection,
  animationPresets as presets,
};
