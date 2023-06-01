import { isPlainObject } from '../../../core/utils/type';
import { getPathParts } from '../../../core/utils/data';

function cloneObjectValue(
  value: Record<string, unknown> | unknown[],
): Record<string, unknown> | unknown[] {
  return Array.isArray(value) ? [...value] : { ...value };
}

function cloneObjectProp(
  value: Record<string, unknown> | unknown[],
  prevValue: Record<string, unknown> | unknown[],
  fullNameParts: (string | number)[],
): Record<string, unknown> | unknown[] {
  const result = fullNameParts.length > 0 && prevValue && value !== prevValue
    ? cloneObjectValue(prevValue)
    : cloneObjectValue(value);

  const name = fullNameParts[0];
  if (fullNameParts.length > 1) {
    result[name] = cloneObjectProp(
      value[name] as Record<string, unknown>,
      prevValue?.[name] as Record<string, unknown>,
      fullNameParts.slice(1),
    );
  } else if (name) {
    if (isPlainObject(value[name])) {
      result[name] = cloneObjectValue(value[name]);
    } else {
      result[name] = value[name];
    }
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
  const prevPropsValue = props[name];
  const result = props;

  if (isPlainObject(currentPropsValue) || (name !== fullName && Array.isArray(currentPropsValue))) {
    result[name] = cloneObjectProp(
      currentPropsValue,
      prevPropsValue as Record<string, unknown>,
      getPathParts(fullName).slice(1),
    );
  } else {
    result[name] = currentPropsValue;
  }
}
