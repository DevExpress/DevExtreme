// eslint-disable-next-line import/named
import { dxElementWrapper } from '../../../core/renderer';
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
      element.parentNode.removeChild(element);
    }
  });
};
