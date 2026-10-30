import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils';

import { KEYBOARD_NAVIGATION_NAMESPACE } from '../../const';

export const CLICK_EVENT = addNamespace(pointerEvents.down, KEYBOARD_NAVIGATION_NAMESPACE);

export const NAV_KEYS = {
  upArrow: 'ArrowUp',
  downArrow: 'ArrowDown',
  leftArrow: 'ArrowLeft',
  rightArrow: 'ArrowRight',
  home: 'Home',
  end: 'End',
  pageDown: 'PageDown',
} as const;
