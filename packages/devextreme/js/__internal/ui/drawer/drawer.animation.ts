import type { Direction } from '@js/common';
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
  getMoveToConfig(direction: Direction, position: number): AnimationState | undefined {
    switch (direction) {
      case 'right':
        return { transform: `translate(${position}px, 0px)` } as unknown as AnimationState;
      case 'left':
        return { left: position };
      case 'top':
      case 'bottom':
        return { top: position };
      default:
        return undefined;
    }
  },

  moveTo(config: DrawerMoveAnimationConfig): void {
    const {
      $element, position, direction = 'left', duration, complete,
    } = config;
    const toConfig = this.getMoveToConfig(direction, position);
    // @ts-expect-error ts-error
    const animationType: AnimationType = direction === 'right' ? 'custom' : 'slide';

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
