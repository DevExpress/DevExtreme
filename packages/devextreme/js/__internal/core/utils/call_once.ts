export function callOnce<TThis, TArgs extends unknown[], TResult>(
  handler: (this: TThis, ...args: TArgs) => TResult,
): (this: TThis, ...args: TArgs) => TResult {
  let wrappedHandler = function evaluate(this: TThis, ...args: TArgs): TResult {
    const result = handler.apply(this, args);

    wrappedHandler = (): TResult => result;

    return result;
  };

  return function callWrappedHandler(this: TThis, ...args: TArgs): TResult {
    return wrappedHandler.apply(this, args);
  };
}
