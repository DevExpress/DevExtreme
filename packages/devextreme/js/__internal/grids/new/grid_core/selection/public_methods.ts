/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DeferredObj } from '@js/core/utils/deferred';

import type { CardInfo } from '../columns_controller/types';
import type { Key } from '../data_controller/types';
import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget';

export function PublicMethods<TBase extends Constructor<GridCoreNewBase>>(GridCore: TBase) {
  return class GridCoreWithSelectionController extends GridCore {
    public isCardSelected(key: Key): boolean {
      return this.selectionController.isCardSelected(key);
    }

    public getSelectedCardKeys(): Key[] {
      return this.selectionController.getSelectedCardKeys();
    }

    public getSelectedCards(): CardInfo[] {
      return this.selectionController.getSelectedCards();
    }

    public selectCards(keys: Key[], preserve = false): DeferredObj<unknown> | undefined {
      return this.selectionController.selectCards(keys, preserve);
    }

    public deselectCards(keys: Key[]): DeferredObj<unknown> | undefined {
      return this.selectionController.deselectCards(keys);
    }

    public selectCardsByIndexes(indexes: number[]): DeferredObj<unknown> | undefined {
      return this.selectionController.selectCardsByIndexes(indexes);
    }

    public deselectCardsByIndexes(indexes: number[]): DeferredObj<unknown> | undefined {
      return this.selectionController.deselectCardsByIndexes(indexes);
    }

    public selectAll(): DeferredObj<unknown> | undefined {
      return this.selectionController.selectAll();
    }

    public deselectAll(): DeferredObj<unknown> | undefined {
      return this.selectionController.deselectAll();
    }

    public clearSelection(): void {
      this.selectionController.clearSelection();
    }
  };
}
