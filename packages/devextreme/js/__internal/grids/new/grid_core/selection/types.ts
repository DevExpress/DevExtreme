import type { SingleMultipleOrNone } from '@js/common';
import type { SelectionColumnDisplayMode } from '@js/common/grids';

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

export type { SelectionColumnDisplayMode as ShowCheckBoxesMode };

export interface SelectionOptions {
  mode: SingleMultipleOrNone;

  showCheckBoxesMode?: SelectionColumnDisplayMode;
}
