import getScrollRtlBehavior from '../../../../core/utils/scroll_rtl_behavior';

function isScrollInverted(rtlEnabled: boolean): boolean {
  const { decreasing, positive } = getScrollRtlBehavior();

  // eslint-disable-next-line no-bitwise
  return rtlEnabled && !!(decreasing ^ positive);
}

export function getScrollSign(rtlEnabled: boolean): number {
  return isScrollInverted(rtlEnabled) && getScrollRtlBehavior().positive ? -1 : 1;
}

export function normalizeOffsetLeft(
  scrollLeft: number, maxLeftOffset: number, rtlEnabled: boolean,
): number {
  if (isScrollInverted(rtlEnabled)) {
    if (getScrollRtlBehavior().positive) {
      // for ie11 support
      return maxLeftOffset - scrollLeft;
    }

    return maxLeftOffset + scrollLeft;
  }

  return scrollLeft;
}
