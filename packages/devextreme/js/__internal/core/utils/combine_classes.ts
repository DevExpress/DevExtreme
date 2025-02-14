/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/unified-signatures */
export function combineClasses(
  classList: (undefined | string)[],
  classesMap: { [key: string]: boolean },
): string;
export function combineClasses(
  classesMap: { [key: string]: boolean },
): string;
export function combineClasses(
  classesList: (undefined | string)[],
): string;
export function combineClasses(
  classListOrMap: (undefined | string)[] | { [key: string]: boolean },
  classesMapOrUndefined?: { [key: string]: boolean },
): string {
  let classesList: (undefined | string)[];
  let classesMap: { [key: string]: boolean };

  if (arguments.length === 1) {
    if (Array.isArray(classListOrMap)) {
      classesList = classListOrMap;
      classesMap = {};
    } else {
      classesList = [];
      classesMap = classListOrMap;
    }
  } else {
    classesList = classListOrMap as (undefined | string)[];
    classesMap = classesMapOrUndefined as { [key: string]: boolean };
  }

  return classesList
    .filter((className): className is string => !!className)
    .concat(
      Object.keys(classesMap)
        .filter((p) => classesMap[p]),
    )
    .join(' ');
}
