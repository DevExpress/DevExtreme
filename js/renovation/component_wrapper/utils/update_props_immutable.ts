import { isPlainObject } from '../../../core/utils/type';

function cloneObjectProp(
  value: Record<string, unknown>,
  fullNameParts: string[],
): Record<string, unknown> {
  const result = { ...value };
  if (fullNameParts.length > 1) {
    const name = fullNameParts[0];
    result[name] = cloneObjectProp(value[name] as Record<string, unknown>, fullNameParts.slice(1));
  }
  return result;
}

export function updatePropsImmutable(
  props: Record<string, unknown>,
  option: Record<string, unknown>,
  name: string,
  fullName: string,
): void {
  const currentPropsValue = option[name];
  const result = props;
  if (name !== fullName) {
    if (Array.isArray(currentPropsValue)) {
      const matchIndex = /\[\s*(\d+)\s*\]/g.exec(fullName);
      if (matchIndex) {
        const newArray = [...currentPropsValue];
        const index = parseInt(matchIndex[1], 10);
        result[name] = newArray;
        if (isPlainObject(newArray[index])) {
          newArray[index] = { ...currentPropsValue[index] };
        }
      }
      return;
    }
  }
  if (isPlainObject(currentPropsValue)) {
    result[name] = cloneObjectProp(currentPropsValue, fullName.split('.').slice(1));
  } else {
    result[name] = currentPropsValue;
  }
}
