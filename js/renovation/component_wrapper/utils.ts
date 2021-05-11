import { each } from '../../core/utils/iterator';
import { isPlainObject } from '../../core/utils/type';

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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UnknownObject { }
export function updatePropsImmutable(
  props: UnknownObject, option: UnknownObject, name: string, fullName: string,
): void {
  const currentPropsValue = option[name];
  const result = props;
  if (name !== fullName) {
    if (Array.isArray(currentPropsValue)) {
      const newArray = [...currentPropsValue];
      result[name] = newArray;
      const matchIndex = /\[\s*(\d+)\s*\]/g.exec(fullName);
      if (matchIndex) {
        const index = parseInt(matchIndex[1], 10);
        if (isPlainObject(newArray[index])) {
          newArray[index] = { ...currentPropsValue[index] };
        }
      }
      return;
    }
  }
  if (isPlainObject(currentPropsValue)) {
    result[name] = { ...currentPropsValue };
  } else {
    result[name] = currentPropsValue;
  }
}
