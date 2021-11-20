import resizeObserverSingleton from '../../../../core/resize_observer';
import { EffectReturn } from '../../../utils/effect_return';
import { getWindow, hasWindow } from '../../../../core/utils/window';

export function subscribeToResize(
  element: HTMLDivElement | undefined | null,
  handler: (el: HTMLDivElement) => void,
): EffectReturn {
  if (hasWindow() && element) {
    let resizeAnimationFrameID = -1;

    resizeObserverSingleton.observe(
      element,
      ({ target }) => {
        resizeAnimationFrameID = getWindow().requestAnimationFrame(() => { handler(target); });
      },
    );

    return (): void => {
      cancelAnimationFrame(resizeAnimationFrameID);
      resizeObserverSingleton.unobserve(element);
    };
  }

  return undefined;
}
