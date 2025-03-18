/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Key } from '../data_controller/types';
import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget';

export function PublicMethods<TBase extends Constructor<GridCoreNewBase>>(GridCore: TBase) {
  return class GridCoreWithSelectionController extends GridCore {
    public isCardSelected(key: Key): boolean {
      return this.selectionController.isCardSelected(key);
    }

    public clearSelection(): void {
      this.selectionController.clearSelection();
    }

    public getSelectedCardKeys(): Key[] {
      return this.selectionController.getSelectedCardKeys();
    }
  };
}
