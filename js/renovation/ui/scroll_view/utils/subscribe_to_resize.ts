import resizeObserverSingleton from '../../../../core/resize_observer';
import { EffectReturn } from '../../../utils/effect_return';
import { hasWindow } from '../../../../core/utils/window';

export function subscribeToResize(
  element: HTMLDivElement | undefined | null,
  handler: (el: HTMLDivElement) => void,
): EffectReturn {
  if (hasWindow() && element) {
    resizeObserverSingleton.observe(
      element,
      ({ target }) => { handler(target); },
    );

    return (): void => {
      resizeObserverSingleton.unobserve(element);
    };
  }

  return undefined;
}
