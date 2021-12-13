export function normalizeOffsetLeft(
  scrollLeft: number, maxLeftOffset: number, rtlEnabled: boolean,
): number {
  if (rtlEnabled) {
    return maxLeftOffset + scrollLeft;
  }

  return scrollLeft;
}
