// shadow equality
function shadowComparer(
    prev: unknown,
    next: unknown
): boolean {
    const isDifferentTypes = typeof prev !== typeof next;

    if (isDifferentTypes) {
        return false;
    }

    const notReferenceTypes = !(prev instanceof Object) || !(next instanceof Object);
    const isFunctionTypes = typeof prev === 'function' && typeof next === 'function';

    if (notReferenceTypes || isFunctionTypes) {
        return prev === next;
    }

    const prevObj = prev as {[index: string]: unknown};
    const nextObj = next as {[index: string]: unknown};
    const prevKeys = Object.keys(prevObj);
    const nextKeys = Object.keys(nextObj);

    if (prevKeys.length !== nextKeys.length) {
        return false;
    }

    for (const key of prevKeys) {
        if (prevObj[key] !== nextObj[key]) {
            return false;
        }
    }

    return true;
}

export { shadowComparer };
