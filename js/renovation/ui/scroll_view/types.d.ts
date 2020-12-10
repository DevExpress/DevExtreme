export interface ScrollableBoundary {
  reachedBottom: boolean;
  reachedLeft: boolean;
  reachedRight: boolean;
  reachedTop: boolean;
}

export interface ScrollEventArgs extends Partial<ScrollableBoundary> {
  event: Event;
  scrollOffset: ScrollableLocation;
}

export type ScrollableDirection = 'both' | 'horizontal' | 'vertical';

export type ShowScrollBarMode = 'onScroll' | 'onHover' | 'always' | 'never';

export interface ScrollableLocation {
  top: number;
  left: number;
}

export interface ScrollOffset {
  top: number;
  left: number;
  bottom: number;
  right: number;
}
