import type { DxElement } from '@js/core/element';
import type { CardInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ContentViewPublicMethods } from '@ts/grids/new/grid_core/content_view/types';
import type { Key } from '@ts/grids/new/grid_core/data_controller/types';

export interface SelectCardOptions {
  control?: boolean;
  shift?: boolean;
  needToUpdateCheckboxes?: boolean;
}

export interface CardHoldEvent {
  event?: MouseEvent;
  card: CardInfo;
}

export interface CardViewContentViewPublicMethods extends ContentViewPublicMethods {
  getCardElement: (cardIndex: number) => DxElement;
  getVisibleCards: () => CardInfo[];
  getCardIndexByKey: (key: Key) => number;
  getKeyByCardIndex: (cardIndex: number) => Key;
}
