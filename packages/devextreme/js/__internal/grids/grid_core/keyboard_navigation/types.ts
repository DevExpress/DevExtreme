import type { DxEvent } from '@js/events';

export type NavigationDirection = 'next' | 'previous' | 'nextInRow' | 'previousInRow';

export type NavigationKeyCode = NavigationDirection | 'upArrow' | 'downArrow';

export type NavigationElementType = 'cell' | 'row';

export interface FocusedCellPosition {
  columnIndex: number;
  rowIndex: number;
}

export interface ScrollOffset {
  left?: number;
  top?: number;
}

export interface HorizontalBounds {
  left: number;
  right: number;
}

export interface KeyDownEvent {
  originalEvent: DxEvent<KeyboardEvent>;
  keyName: string;
  shift: boolean;
}
