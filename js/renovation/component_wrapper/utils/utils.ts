// eslint-disable-next-line import/named
import $, { dxElementWrapper } from '../../../core/renderer';
import { each } from '../../../core/utils/iterator';

export const removeDifferentElements = (
  $children: dxElementWrapper,
  $newChildren: dxElementWrapper,
): void => {
  each($newChildren, (__: never, element: Element) => {
    let hasComponent = false;
    each($children, (_: never, oldElement: Element) => {
      if (element === oldElement) {
        hasComponent = true;
      }
    });
    if (!hasComponent && element.parentNode) {
      // @ts-expect-error The renderer's remove() function requires an argument in .d.ts.
      // We currenlty suppress the error if we don't need the argument (see Grids).
      // We should change the .d.ts (maybe make the parameter optional).
      $(newElement).remove();
    }
  });
};
