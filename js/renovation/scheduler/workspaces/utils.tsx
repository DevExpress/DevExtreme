export const getKeyByDateAndGroup = (date: Date, group?: object): string => {
  const keyFromDate = date.toString();
  if (!group) return keyFromDate;

  return Object.keys(group).reduce(
    (currentKey, resourceName) => `${currentKey}_${resourceName}_${group[resourceName]}`,
    keyFromDate,
  );
};
