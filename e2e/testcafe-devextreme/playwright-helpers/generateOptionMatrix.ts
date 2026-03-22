type OptionMatrix<T> = {
  [K in keyof T]: T[K][];
};

export function generateOptionMatrix<T extends Record<string, unknown>>(
  matrix: OptionMatrix<T>,
): T[] {
  const keys = Object.keys(matrix) as (keyof T)[];
  const combinations: T[] = [];

  function generate(index: number, current: Partial<T>): void {
    if (index === keys.length) {
      combinations.push({ ...current } as T);
      return;
    }

    const key = keys[index];
    const values = matrix[key];

    for (const value of values) {
      current[key] = value;
      generate(index + 1, current);
    }
  }

  generate(0, {});
  return combinations;
}
