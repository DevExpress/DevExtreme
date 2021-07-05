import { each } from '../../core/utils/iterator';

export const removeDifferentElements = ($children, $newChildren): void => {
  each($newChildren, (__, element) => {
    let hasComponent = false;
    each($children, (_, oldElement) => {
      if (element === oldElement) {
        hasComponent = true;
      }
    });
    if (!hasComponent && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
};
