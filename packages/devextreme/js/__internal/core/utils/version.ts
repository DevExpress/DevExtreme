export type ComparableVersion = string | number | (string | number)[];

function toParts(value: ComparableVersion): number[] {
  const source = typeof value === 'number' ? [value] : value;
  const parts = typeof source === 'string' ? source.split('.') : source;

  return parts.map((part) => parseInt(String(part || 0), 10));
}

export function compare(
  x: ComparableVersion,
  y: ComparableVersion,
  maxLevel?: number,
): number {
  const xParts = toParts(x);
  const yParts = toParts(y);

  let length = Math.max(xParts.length, yParts.length);

  if (maxLevel !== undefined && isFinite(maxLevel)) {
    length = Math.min(length, maxLevel);
  }

  for (let i = 0; i < length; i += 1) {
    const xItem = xParts[i] ?? 0;
    const yItem = yParts[i] ?? 0;

    if (xItem < yItem) {
      return -1;
    }
    if (xItem > yItem) {
      return 1;
    }
  }

  return 0;
}
