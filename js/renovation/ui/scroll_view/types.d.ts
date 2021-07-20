export interface ScrollableBoundary {
  reachedBottom: boolean;
  reachedLeft: boolean;
  reachedRight: boolean;
  reachedTop: boolean;
}

export interface ScrollEventArgs extends Partial<ScrollableBoundary> {
  event?: Event;
  scrollOffset: ScrollOffset;
}

export type ScrollableShowScrollbar = 'onScroll' | 'onHover' | 'always' | 'never';

export type ScrollableDirection = 'both' | 'horizontal' | 'vertical';

export type RefreshStrategy = 'pullDown' | 'swipeDown' | 'simulated';
export interface ScrollOffset {
  top: number;
  left: number;
}

export interface DxMouseEvent extends MouseEvent {
  originalEvent: DxMouseEvent;
  delta: number;
  isScrollingEvent: boolean;
  cancel: boolean;
  velocity: { x: number; y: number };
}

export interface DxKeyboardEvent extends KeyboardEvent {
  originalEvent: DxKeyboardEvent;
}
