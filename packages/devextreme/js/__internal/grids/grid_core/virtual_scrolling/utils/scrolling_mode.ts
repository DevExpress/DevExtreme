import type { InternalGridOptions } from '@ts/grids/grid_core/types';

import { SCROLLING_MODE_INFINITE, SCROLLING_MODE_STANDARD, SCROLLING_MODE_VIRTUAL } from '../const';

type ScrollingOptions = InternalGridOptions['scrolling'];

export function isStandardMode(scrolling: ScrollingOptions): boolean {
  return scrolling?.mode === SCROLLING_MODE_STANDARD;
}

export function isVirtualMode(scrolling: ScrollingOptions): boolean {
  return scrolling?.mode === SCROLLING_MODE_VIRTUAL;
}

export function isInfiniteMode(scrolling: ScrollingOptions): boolean {
  return scrolling?.mode === SCROLLING_MODE_INFINITE;
}

export function isVirtualPaging(scrolling: ScrollingOptions): boolean {
  return isVirtualMode(scrolling) || isInfiniteMode(scrolling);
}

export function isVirtualRowRendering(scrolling: ScrollingOptions): boolean {
  if (scrolling?.legacyMode === false && isVirtualPaging(scrolling)) {
    return true;
  }

  return scrolling?.rowRenderingMode === SCROLLING_MODE_VIRTUAL;
}
