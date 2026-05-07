import type { SelectAllMode, SingleMultipleOrNone } from '@js/common';
import type { EventInfo } from '@js/common/core/events';
import type { SelectionColumnDisplayMode } from '@js/common/grids';
import type dxCardView from '@js/ui/card_view';

import type { Key } from '../data_controller/types';

export type SelectedCardKeys = Key[];

export interface SelectionEventInfo<TCardData = unknown, TKey = unknown> {
  readonly currentSelectedCardKeys: TKey[];

  readonly currentDeselectedCardKeys: TKey[];

  readonly selectedCardKeys: TKey[];

  readonly selectedCardsData: TCardData[];

  readonly isSelectAll: boolean;

  readonly isDeselectAll: boolean;
}

export type SelectionChangingEvent<
  TCardData = unknown,
  TKey = unknown,
> = EventInfo<dxCardView> & SelectionEventInfo<TCardData, TKey> & {
  cancel: boolean | PromiseLike<boolean> | PromiseLike<void>;
};

export type SelectionChangedEvent<
  TCardData = unknown,
  TKey = unknown,
> = EventInfo<dxCardView> & SelectionEventInfo<TCardData, TKey>;

export type { SelectionColumnDisplayMode as ShowCheckBoxesMode };

export interface SelectionOptions {
  mode: SingleMultipleOrNone;

  showCheckBoxesMode?: SelectionColumnDisplayMode;

  allowSelectAll?: boolean;

  selectAllMode?: SelectAllMode;
}
