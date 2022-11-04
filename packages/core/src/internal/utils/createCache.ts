function createCache<TArgs, TResult>(
    func: (arg: TArgs) => TResult,
    comparer: (prev: TArgs, next: TArgs) => boolean
): (arg: TArgs) => TResult {
    let cachedArg: TArgs;
    let cachedResult: TResult;

    return (arg: TArgs) => {
        const isFirstCall = cachedArg === undefined || cachedResult === undefined;
        const comparerResult = !isFirstCall && comparer(cachedArg, arg);

        if (comparerResult) {
            return cachedResult;
        }

        cachedArg = arg;
        cachedResult = func(arg);
        return cachedResult;
    };
}

export { createCache };
