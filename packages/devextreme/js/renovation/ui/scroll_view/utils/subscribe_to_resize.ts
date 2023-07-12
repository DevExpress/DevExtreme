import resizeObserverSingleton from '../../../../core/resize_observer';
import { EffectReturn } from '../../../utils/effect_return';
import { hasWindow } from '../../../../core/utils/window';
import { requestAnimationFrame, cancelAnimationFrame } from '../../../../animation/frame';

export function subscribeToResize(
  element: HTMLDivElement | undefined | null,
  handler: (el: HTMLDivElement) => void,
): EffectReturn {
  if (hasWindow() && element) {
    let resizeAnimationFrameID = -1;

    resizeObserverSingleton.observe(
      element,
      ({ target }) => {
        resizeAnimationFrameID = requestAnimationFrame(() => { handler(target); });
      },
    );

    return (): void => {
      cancelAnimationFrame(resizeAnimationFrameID);
      resizeObserverSingleton.unobserve(element);
    };
  }

  return undefined;
}
