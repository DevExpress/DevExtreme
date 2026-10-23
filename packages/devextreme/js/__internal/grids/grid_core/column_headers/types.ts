import type { SortOrder } from '@js/common';
import type { DxEvent } from '@js/events';

import type { GridContextMenuItem } from '../views/types';

export interface SortMenuItem extends GridContextMenuItem {
  value?: SortOrder | 'none';
}

export interface ElementVisibilityOptions {
  visible?: boolean;
}

export interface KeyboardActionArgs {
  event: DxEvent;
}
