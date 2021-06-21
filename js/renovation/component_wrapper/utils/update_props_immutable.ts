import { isPlainObject } from '../../../core/utils/type';
import { getPathParts } from '../../../core/utils/data';

function cloneObjectProp(
  value: Record<string, unknown> | unknown[],
  fullNameParts: (string | number)[],
): Record<string, unknown> | unknown[] {
  const result = Array.isArray(value) ? [...value] : { ...value };

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

  if (isPlainObject(currentPropsValue) || (name !== fullName && Array.isArray(currentPropsValue))) {
    result[name] = cloneObjectProp(currentPropsValue, getPathParts(fullName).slice(1));
  } else {
    result[name] = currentPropsValue;
  }
}
