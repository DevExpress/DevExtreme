export const shallowEquals = (
  firstObject: Record<string, unknown>,
  secondObject: Record<string, unknown>,
): boolean => {
  if (Object.keys(firstObject).length !== Object.keys(secondObject).length) {
    return false;
  }

  return Object.entries(firstObject).every(([key, firstValue]) => {
    const secondValue = secondObject[key];

    if (firstValue instanceof Date && secondValue instanceof Date) {
      return firstValue.getTime() === secondValue.getTime();
    }

    return firstValue === secondValue;
  });
};
