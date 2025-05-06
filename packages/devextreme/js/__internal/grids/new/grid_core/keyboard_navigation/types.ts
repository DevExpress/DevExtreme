/* eslint-disable spellcheck/spell-checker */
import type { RefObject } from 'inferno';

export interface WithElementRef {
  elementRef?: RefObject<HTMLElement>;
}

export interface WithTabIndex {
  tabIndex?: number;
}

export type WithoutTabIndex<T> = Exclude<T, 'tabIndex'>;

export interface WithKeyDown {
  onKeyDown?: (key: KeyboardEvent) => void;
}

export interface WithKbnProps {
  navigationEnabled?: boolean;
}
