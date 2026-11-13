import type { DeferredObj } from '@js/core/utils/deferred';

import type { DataObject, Key } from '../data_controller/types';
import type { GridCoreClass, Mixin } from '../types';
import type { SelectionPublicMethods } from './types';

export function PublicMethods<TBase extends GridCoreClass>(
  GridCore: TBase,
): Mixin<TBase, SelectionPublicMethods> {
  return class GridCoreWithSelectionController extends GridCore {
    public isCardSelected(key: Key): boolean {
      return this.selectionController.isCardSelected(key);
    }

    public getSelectedCardKeys(): Key[] {
      return this.selectionController.getSelectedCardKeys();
    }

    public getSelectedCardsData(): DataObject[] {
      return this.selectionController.getSelectedCardsData();
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
