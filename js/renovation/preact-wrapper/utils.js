import { each } from '../../core/utils/iterator';

const addAttributes = ($element, attributes) => {
  each(attributes, (_, { name, value }) => {
    if (name === 'class') {
      $element.addClass(value);
    } else {
      $element.attr(name, value);
    }
  });
};

// NOTE: function for jQuery templates
export const wrapElement = ($element, $wrapper) => {
  const { attributes } = $wrapper.get(0);
  const children = $wrapper.contents();

  addAttributes($element, attributes);

  $wrapper.remove();
  each(children, (_, child) => {
    $element.append(child);
  });

  return children;
};

export const removeDifferentElements = ($children, $newChildren) => {
  each($newChildren, (__, element) => {
    let hasComponent = false;
    each($children, (_, oldElement) => {
      if (element === oldElement) {
        hasComponent = true;
      }
    });
    if (!hasComponent) {
      element.parentNode.removeChild(element);
    }
  });
};
