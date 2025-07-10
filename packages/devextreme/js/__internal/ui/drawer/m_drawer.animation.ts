import type { AnimationConfig, AnimationState, AnimationType } from '@js/common/core/animation';
import { fx } from '@js/common/core/animation';
import type { dxElementWrapper } from '@js/core/renderer';
import { camelize } from '@js/core/utils/inflector';

interface DrawerAnimationConfig extends AnimationConfig {
  $element: dxElementWrapper;
}

interface DrawerMoveAnimationConfig extends DrawerAnimationConfig {
  position: number;
}

interface DrawerMarginAnimationConfig extends DrawerAnimationConfig {
  margin?: number;
}
interface DrawerSizeAnimationConfig extends DrawerAnimationConfig {
  size?: number;
  marginTop?: number;
}

export interface FadeConfig {
  from: number;
  to: number;
}

export const animation = {
  moveTo(config: DrawerMoveAnimationConfig): void {
    const {
      $element, position, direction = 'left', duration, complete,
    } = config;
    let toConfig = {} as AnimationState;
    // eslint-disable-next-line no-undef-init
    let animationType: AnimationType | undefined = undefined;

    switch (direction) {
      case 'right':
        // @ts-expect-error ts-error
        toConfig = { transform: `translate(${position}px, 0px)` };
        // @ts-expect-error ts-error
        animationType = 'custom';
        break;
      case 'left':
        toConfig = { left: position };
        animationType = 'slide';
        break;
      case 'top':
      case 'bottom':
        toConfig = { top: position };
        animationType = 'slide';
        break;
      default:
        break;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate($element.get(0), {
      type: animationType,
      to: toConfig,
      duration,
      complete,
    });
  },

  margin(config: DrawerMarginAnimationConfig): void {
    const {
      $element, margin, direction = 'left', duration, complete,
    } = config;
    const marginName = `margin${camelize(direction, true)}`;

    const toConfig: AnimationState = {
      [marginName]: margin,
    } as AnimationState;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate($element.get(0), {
      to: toConfig,
      duration,
      complete,
    });
  },
  fade($element: dxElementWrapper, config: FadeConfig, duration: number | undefined, completeAction: AnimationConfig['complete']): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate($element.get(0), {
      type: 'fade',
      to: config.to,
      from: config.from,
      duration,
      complete: completeAction,
    });
  },

  size(config: DrawerSizeAnimationConfig): void {
    const {
      $element, size, direction = 'left', marginTop = 0, duration, complete,
    } = config;
    const toConfig: AnimationState = {} as AnimationState;

    if (direction === 'right' || direction === 'left') {
      // @ts-expect-error ts-error
      toConfig.width = size;
    } else {
      // @ts-expect-error ts-error
      toConfig.height = size;
    }

    if (direction === 'bottom') {
      // @ts-expect-error ts-error
      toConfig.marginTop = marginTop;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate($element.get(0), {
      to: toConfig,
      duration,
      complete,
    });
  },

  complete($element: dxElementWrapper): void {
    fx.stop($element.get(0), true);
  },
};
