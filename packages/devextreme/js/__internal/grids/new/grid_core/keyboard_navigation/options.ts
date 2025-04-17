import type { DxElement } from '@js/core/element';

export interface KeyDownEvent {
  handled: boolean;
  event: KeyboardEvent;
  element: DxElement;
}

export interface FocusedCardChangedEvent<TCardData = unknown> {
  cardIndex: number;
  card: TCardData;
  cardElement: DxElement;
}

export interface Options {
  keyboardNavigation?: {
    enabled?: boolean;
  };
  onKeyDown?: (event: KeyDownEvent) => void;
  onFocusedCardChanged?: (event: FocusedCardChangedEvent) => void;
}

export const defaultOptions = {
  keyboardNavigation: {
    enabled: true,
  },
} satisfies Options;
