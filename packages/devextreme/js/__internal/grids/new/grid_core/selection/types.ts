import type { SingleMultipleOrNone } from '@js/common';

import type { DataObject, Key } from '../data_controller/types';

export type SelectedCardKeys = any[];

export interface SelectionChangedEvent {
  selectedItems: DataObject[];

  selectedItemKeys: Key[];

  addedItemKeys: Key[];

  removedItemKeys: Key[];

  addedItems: DataObject[];

  removedItems: DataObject[];
}

export interface SelectionOptions {
  mode: SingleMultipleOrNone;
}
