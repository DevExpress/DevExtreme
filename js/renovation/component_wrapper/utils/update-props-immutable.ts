import { isPlainObject } from '../../../core/utils/type';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnknownObject { }

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
    result[name] = { ...currentPropsValue };
  } else {
    result[name] = currentPropsValue;
  }
}
