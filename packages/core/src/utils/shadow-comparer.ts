// shadow equality
export function shadowComparer<T>(
  firstValue: T,
  secondValue: T,
): boolean {
  const differentTypes = typeof firstValue !== typeof secondValue;

  if (differentTypes) {
    return false;
  }

  const notReferenceTypes = !(firstValue instanceof Object) || !(secondValue instanceof Object);
  const functionTypes = typeof firstValue === 'function' && typeof secondValue === 'function';
  const dateTypes = firstValue instanceof Date && secondValue instanceof Date;

  if (notReferenceTypes || functionTypes) {
    return firstValue === secondValue;
  }

  if (dateTypes) {
    return firstValue.getTime() === secondValue.getTime();
  }

  const prevObj = firstValue as { [index: string]: unknown };
  const nextObj = secondValue as { [index: string]: unknown };
  const prevKeys = Object.keys(prevObj);
  const nextKeys = Object.keys(nextObj);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  return !prevKeys.some((key) => prevObj[key] !== nextObj[key]);
}
