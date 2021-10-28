export const hasClasses = async (
  element: Selector,
  classes: string[],
): Promise<boolean> => (await element.classNames)
  .filter((source) => classes.find((target) => target === source))
  .length === classes.length;
