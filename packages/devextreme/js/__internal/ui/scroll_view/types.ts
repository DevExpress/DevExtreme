import type { Orientation } from '@js/common';
import type { DxEvent } from '@js/events';
import type { ScrollEvent } from '@js/ui/scroll_view';

export interface ScrollableBoundary {
  reachedBottom: boolean;
  reachedLeft: boolean;
  reachedRight: boolean;
  reachedTop: boolean;
}

export interface ScrollEventArgs extends Partial<ScrollableBoundary> {
  event?: ScrollEvent | DxMouseEvent | DxEvent;
  scrollOffset: ScrollOffset;
}

export interface ScrollLocationChangeArgs {
  fullScrollProp: 'scrollLeft' | 'scrollTop';
  location: number;
}

export type ScrollableShowScrollbar = 'onScroll' | 'onHover' | 'always' | 'never';

export type RefreshStrategy = 'pullDown' | 'swipeDown' | 'simulated';
export interface ScrollOffset {
  top: number;
  left: number;
}

export type AllowedDirections = Record<Orientation, boolean>;

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
