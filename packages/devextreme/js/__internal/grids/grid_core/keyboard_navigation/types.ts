export type NavigationDirection = 'next' | 'previous' | 'nextInRow' | 'previousInRow';

export type NavigationKeyCode = NavigationDirection | 'upArrow' | 'downArrow';

export type NavigationElementType = 'cell' | 'row';

export interface KeyDownEvent {
  originalEvent: KeyboardEvent;
  keyName: string;
  shift: boolean;
}
