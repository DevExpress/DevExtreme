import { isPlainObject, isString } from '../../../core/utils/type';

function parseOptionName(fullName: string): (string | number)[] | null {
  const parts: (string | number)[] = [];

  fullName.split('.').forEach((part) => {
    const match = /(.+?)\[\s*(\d+)\s*\]/g.exec(part);

    if (match) {
      parts.push(match[1], parseInt(match[2], 10));
    } else {
      parts.push(part);
    }
  });

  // if any of parts contains ']' or '[' even after parsing, then it's incorrect
  const isIncorrect = parts.some((part) => {
    if (isString(part)) {
      if (part.includes(']') || part.includes('[')) {
        return true;
      }
    }

    return false;
  });

  return isIncorrect ? null : parts;
}

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

  const fullNameParts = parseOptionName(fullName);
  if (!fullNameParts) {
    return;
  }

  if (isPlainObject(currentPropsValue) || (name !== fullName && Array.isArray(currentPropsValue))) {
    result[name] = cloneObjectProp(currentPropsValue, fullNameParts.slice(1));
  } else {
    result[name] = currentPropsValue;
  }
}
