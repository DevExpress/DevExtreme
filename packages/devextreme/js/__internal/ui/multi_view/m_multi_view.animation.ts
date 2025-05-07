import { fx } from '@js/common/core/animation';
import { move } from '@js/common/core/animation/translator';
import type { dxElementWrapper } from '@js/core/renderer';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _translator = {
  move(
    $element: dxElementWrapper,
    position: string | number,
  ): void {
    move($element, { left: position });
  },
};

export const animation = {
  moveTo(
    $element: dxElementWrapper,
    position: number,
    duration: number,
    completeAction: () => void,
  ): void {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate($element, {
      type: 'slide',
      to: { left: position },
      duration,
      complete: completeAction,
    });
  },

  complete($element: dxElementWrapper): void {
    // @ts-expect-error
    fx.stop($element, true);
  },
};
