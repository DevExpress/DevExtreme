
export function byKeyComparer<T>(getter: (obj: T) => string): Parameters<Array<T>['sort']>[0] {
    return (objA: T, objB: T) => getter(objA).localeCompare(getter(objB));
}

export function getValues<T>(obj: Record<string, T>): T[] {
    return obj ? Object.keys(obj).map(k => obj[k]) : undefined;
}
