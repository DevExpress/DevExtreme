export const splitByCondition = <T>(arr: T[], condition: (item: T) => boolean): T[][] => {
  const result: T[][] = [[], []];

  arr.forEach((item) => {
    if (condition(item)) {
      result[0].push(item);
    } else {
      result[1].push(item);
    }
  });

  return result;
};
