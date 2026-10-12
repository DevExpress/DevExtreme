export type NavigationDirection = 'next' | 'previous' | 'nextInRow' | 'previousInRow';

export type NavigationKeyCode = NavigationDirection | 'upArrow' | 'downArrow';

export type NavigationElementType = 'cell' | 'row';

export interface HorizontalBounds {
  left: number;
  right: number;
}

export interface KeyDownEvent {
  originalEvent: KeyboardEvent;
  keyName: string;
  shift: boolean;
}
