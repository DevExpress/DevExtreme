/* eslint-disable spellcheck/spell-checker */
import { isDefined } from '@ts/core/utils/type';

import { ItemsController } from '../items_controller/items_controller';
import type { GridCoreClass, Mixin } from '../types';
import { EditingController } from './controller';
import type { EditingPublicMethods } from './types';

export function PublicMethods<T extends GridCoreClass>(
  GridCore: T,
): Mixin<T, EditingPublicMethods> {
  return class GridCoreWithEditing extends GridCore {
    public addCard(): Promise<void> {
      const controller = this.diContext.get(EditingController);
      return controller.addCard();
    }

    public cancelEditData(): void {
      const controller = this.diContext.get(EditingController);
      controller.clear();
    }

    public deleteCard(cardIndex: number): void {
      const controller = this.diContext.get(EditingController);
      const itemsController = this.diContext.get(ItemsController);
      const cardKey = itemsController.items.peek()[cardIndex]?.key;

      if (isDefined(cardKey)) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        controller.deleteCard(cardKey);
      }
    }

    public editCard(cardIndex: number): void {
      const controller = this.diContext.get(EditingController);
      const itemsController = this.diContext.get(ItemsController);
      const cardKey = itemsController.items.peek()[cardIndex]?.key;

      if (isDefined(cardKey)) {
        controller.editCard(cardKey);
      }
    }

    public hasEditData(): boolean {
      const controller = this.diContext.get(EditingController);
      return controller.changes.peek().length > 0;
    }

    public saveEditData(): Promise<void> {
      const controller = this.diContext.get(EditingController);
      return controller.save();
    }
  };
}
