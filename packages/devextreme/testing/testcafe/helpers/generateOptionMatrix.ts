export type Options<TComponentOptions> = {
  [TProperty in keyof TComponentOptions]: TComponentOptions[TProperty][]
};

const generateOptionMatrixImpl = <T>(
  options: Options<T>,
  keys: (keyof T)[],
  index: number,
  current: T[],
): T[] => {
  if (index >= keys.length) {
    return current;
  }

  const key = keys[index];
  const values = options[key];
  const currentLength = current.length;

  for (let i = 1; i < values.length; i += 1) {
    const nextCombinations = current
      .slice(0, currentLength)
      .map<T>((item) => ({
      ...item,
      [key]: values[i],
    }));

    current.push(...nextCombinations);
  }

  return generateOptionMatrixImpl(options, keys, index + 1, current);
};

export const generateOptionMatrix = <T>(options: Options<T>): T[] => {
  const keys = Object.keys(options) as (keyof T)[];

  if (keys.length === 0) {
    return [];
  }

  const initialObject = {} as T;

  const baseObject = keys.reduce<T>((acc, key) => {
    const [firstValue] = options[key];
    acc[key] = firstValue;
    return acc;
  }, initialObject);

  const current = options[keys[0]].map<T>((value) => ({
    ...baseObject,
    [keys[0]]: value,
  }));

  return generateOptionMatrixImpl(options, keys, 1, current);
};
