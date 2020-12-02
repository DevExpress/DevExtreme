export interface ScrollableBoundary {
  reachedBottom: boolean;
  reachedLeft: boolean;
  reachedRight: boolean;
  reachedTop: boolean;
}

export interface ScrollEventArgs extends Partial<ScrollableBoundary> {
  event: Event;
  scrollOffset: Partial<ScrollOffset>;
}

export type ScrollableDirection = 'both' | 'horizontal' | 'vertical';

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
