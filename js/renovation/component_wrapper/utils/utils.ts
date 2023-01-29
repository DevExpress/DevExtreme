// eslint-disable-next-line import/named
import { dxElementWrapper } from '../../../core/renderer';
import { each } from '../../../core/utils/iterator';

export const removeDifferentElements = (
  $children: dxElementWrapper,
  $newChildren: dxElementWrapper,
): void => {
  each($newChildren, (__: unknown, element: Element) => {
    let hasComponent = false;
    each($children, (_: unknown, oldElement: Element) => {
      if (element === oldElement) {
        hasComponent = true;
      }
    });
    if (!hasComponent && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
};
