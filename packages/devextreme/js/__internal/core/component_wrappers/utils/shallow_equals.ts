export const shallowEquals = (
  firstObject: Record<string, unknown>,
  secondObject: Record<string, unknown>,
): boolean => {
  if (Object.keys(firstObject).length !== Object.keys(secondObject).length) {
    return false;
  }
  return Object.keys(firstObject).every((key) => firstObject[key] === secondObject[key]);
};
