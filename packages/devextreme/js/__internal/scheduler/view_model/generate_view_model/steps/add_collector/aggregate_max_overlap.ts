interface ItemWithMaxLevel {
  maxLevel: number;
}

export const aggregateMaxOverlap = <T extends ItemWithMaxLevel>(
  items: T[],
  keyFn: (item: T) => number,
): number[] => {
  const result = items.reduce<number[]>((overlaps, item) => {
    const key = keyFn(item);
    overlaps[key] = Math.max(overlaps[key] ?? 0, item.maxLevel);

    return overlaps;
  }, []);

  for (let i = 0; i < result.length; i += 1) {
    result[i] ??= 0;
  }

  return result;
};
