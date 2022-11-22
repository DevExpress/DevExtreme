export type PipeFunc<T> = (value: T) => T;

export function pipe<T>(
  ...funcArray: PipeFunc<T>[]
): PipeFunc<T> {
  return (value: T) => funcArray.reduce(
    (result, func) => func(result),
    value,
  );
}
