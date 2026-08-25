import { SCROLLING_MODE_INFINITE, SCROLLING_MODE_VIRTUAL } from '../const';

interface ScrollingModeController {
  option: (name: string) => unknown;
}

export const isVirtualMode = (that: ScrollingModeController): boolean => that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL;

export const isAppendMode = (that: ScrollingModeController): boolean => that.option('scrolling.mode') === SCROLLING_MODE_INFINITE;

export const isVirtualPaging = (that: ScrollingModeController): boolean => isVirtualMode(that)
  || isAppendMode(that);
