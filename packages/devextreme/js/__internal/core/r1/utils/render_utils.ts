export const combineClasses = (
  classesMap: { [key: string]: boolean },
): string => Object.keys(classesMap)
  .filter((cssClass) => !!cssClass && classesMap[cssClass])
  .join(' ')
  .split(' ')
  .filter((cssClass, i, filteredClassesMap) => filteredClassesMap.indexOf(cssClass) === i)
  .join(' ');
