import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils';

export const EVENT_NAMESPACE = 'dxDataGridKeyboardNavigation';

export const CLICK_EVENT = addNamespace(pointerEvents.down, EVENT_NAMESPACE);

export const NAV_KEYS = {
  upArrow: 'ArrowUp',
  downArrow: 'ArrowDown',
} as const;
