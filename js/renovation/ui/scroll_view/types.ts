export interface ScrollViewBoundary {
  reachedBottom: boolean;
  reachedLeft: boolean;
  reachedRight: boolean;
  reachedTop: boolean;
}

export interface ScrollEventArgs extends Partial<ScrollViewBoundary> {
  event: Event;
  scrollOffset: Partial<ScrollOffset>;
}

export type ScrollViewDirection = 'both' | 'horizontal' | 'vertical';

export interface ScrollViewLocation {
  top: number;
  left: number;
}

export interface ScrollOffset {
  top: number;
  left: number;
  bottom: number;
  right: number;
}
