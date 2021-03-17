import { each } from '../../core/utils/iterator';

export const addAttributes = ($element, attributes): void => {
  each(attributes, (_, { name, value }) => {
    if (name === 'class') {
      $element.addClass(value);
    } else {
      $element.attr(name, value);
    }
  });
};

export function getAriaName(name: string): string {
  return (name === 'role' || name === 'id')
    ? name
    : `aria-${name}`;
}

// NOTE: function for jQuery templates
export const wrapElement = ($element, $wrapper): any => {
  const { attributes } = $wrapper.get(0);
  const children = $wrapper.contents();

  addAttributes($element, attributes);

  $wrapper.remove();
  each(children, (_, child) => {
    $element.append(child);
  });

  return children;
};

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
