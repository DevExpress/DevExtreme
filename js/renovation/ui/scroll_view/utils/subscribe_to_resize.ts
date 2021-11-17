import resizeObserverSingleton from '../../../../core/resize_observer';
import { EffectReturn } from '../../../utils/effect_return';
import { getWindow, hasWindow } from '../../../../core/utils/window';

export function subscribeToResize(
  element: HTMLDivElement | undefined | null,
  handler: (el: HTMLDivElement) => void,
): EffectReturn {
  if (hasWindow() && element) {
    resizeObserverSingleton.observe(
      element,
      (entries: { target }) => {
        // TODO Vitik workaround for temporary fix:
        // testing\testcafe\tests\renovation\scheduler\appointments\recurrence.ts
        /* istanbul ignore next: temporary workaround */
        getWindow().requestAnimationFrame(() => {
          /* istanbul ignore next: temporary workaround */
          if (!Array.isArray(entries) || !entries.length) {
            /* istanbul ignore next: temporary workaround */
            return;
          }
          handler(entries.target);
        });
      },
    );

    return (): void => {
      resizeObserverSingleton.unobserve(element);
    };
  }

  return undefined;
}
