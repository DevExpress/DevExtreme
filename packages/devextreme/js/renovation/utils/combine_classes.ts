export function combineClasses(classesMap: { [key: string]: boolean }): string {
  return Object.keys(classesMap)
    .filter((p) => classesMap[p])
    .join(' ');
}
