import { dxElementWrapper } from '../../../core/renderer.d';
import { each } from '../../../core/utils/iterator';

export const addAttributes = (
  $element: dxElementWrapper,
  attributes: {
    name: string;
    value: string | number | null;
  }[],
): void => {
  each(attributes, (_: never, { name, value }) => {
    if (name === 'class') {
      $element.addClass(value);
    } else {
      $element.attr(name, value);
    }
  });
};

export function getAriaName(name: string): string {
  return name === 'role' || name === 'id'
    ? name
    : `aria-${name}`;
}

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
