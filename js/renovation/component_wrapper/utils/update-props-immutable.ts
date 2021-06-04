import { isPlainObject } from '../../../core/utils/type';

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
    result[name] = { ...currentPropsValue as Record<string, unknown> };
  } else {
    result[name] = currentPropsValue;
  }
}
