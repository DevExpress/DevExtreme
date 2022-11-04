function callPropCallback<T>(
    callback: ((value: T) => void) | undefined,
    value: T
): void {
    callback && callback(value);
}

export { callPropCallback };
