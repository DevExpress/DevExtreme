/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { isDefined } from '@ts/core/utils/m_type';

import { ItemsController } from '../items_controller/items_controller';
import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget';
import { EditingController } from './controller';

export function PublicMethods<T extends Constructor<GridCoreNewBase>>(GridCore: T) {
  return class GridCoreWithEditing extends GridCore {
    public addCard(): Promise<void> {
      const controller = this.diContext.get(EditingController);
      return controller.addCard();
    }

    public cancelEditData() {
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

    public editCard(cardIndex: number) {
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
