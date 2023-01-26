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

export interface ScrollLocationChangeArgs {
  fullScrollProp: 'scrollLeft' | 'scrollTop';
  location: number;
}

export type ScrollableShowScrollbar = 'onScroll' | 'onHover' | 'always' | 'never';

export type ScrollableDirection = 'both' | 'horizontal' | 'vertical';

export type RefreshStrategy = 'pullDown' | 'swipeDown' | 'simulated';
export interface ScrollOffset {
  top: number;
  left: number;
}

export interface DxMouseEvent extends MouseEvent {
  originalEvent: MouseEvent;
  delta: { x: number; y: number };
  isScrollingEvent: boolean;
  cancel: boolean;
  velocity: { x: number; y: number };
}

export interface DxMouseWheelEvent extends MouseEvent {
  originalEvent: MouseEvent;
  delta: number;
}

export interface DxKeyboardEvent extends KeyboardEvent {
  originalEvent: DxKeyboardEvent;
}

export interface DomRect {
  width: number;
  height: number;
  bottom: number;
  top: number;
  left: number;
  right: number;
}

export interface ElementOffset {
  bottom?: number;
  top?: number;
  left?: number;
  right?: number;
}
