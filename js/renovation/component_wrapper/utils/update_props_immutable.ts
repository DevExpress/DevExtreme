import { isPlainObject } from '../../../core/utils/type';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnknownObject { }

function cloneObjectProp(value: UnknownObject, fullNameParts: string[]): UnknownObject {
  const result = { ...value };
  if (fullNameParts.length > 1) {
    const name = fullNameParts[0];
    result[name] = cloneObjectProp(value[name], fullNameParts.slice(1));
  }
  return result;
}

export function updatePropsImmutable(
  props: UnknownObject, option: UnknownObject, name: string, fullName: string,
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
