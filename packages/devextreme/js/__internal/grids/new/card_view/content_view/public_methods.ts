/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DxElement } from '@js/core/element';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import type { Constructor } from '@ts/grids/new/grid_core/types';

import * as Base from '../../grid_core/content_view/public_methods';
import type { Key } from '../../grid_core/data_controller/types';
import type { CardViewBase } from '../widget';
import * as cardModule from './content/card/card';
import { ContentView } from './view';

export function PublicMethods<T extends Constructor<CardViewBase>>(GridCore: T) {
  return class CardViewWithContentView extends Base.PublicMethods(GridCore) {
    public getCardElement(cardIndex: number): DxElement {
      const card = $(this.element()).find(cardModule.CLASSES.card).eq(cardIndex);

      return getPublicElement(card);
    }

    public getVisibleCards(): DataRow[] {
      const contentView = this.diContext.get(ContentView);
      return contentView.items.unreactive_get();
    }

    public getCardIndexByKey(key: Key): number {
      const contentView = this.diContext.get(ContentView);
      const cards = contentView.items.unreactive_get();

      return cards.findIndex((card) => card.key === key);
    }

    public getKeyByCardIndex(cardIndex: number): Key {
      return this.getVisibleCards()[cardIndex]?.key;
    }
  };
}
