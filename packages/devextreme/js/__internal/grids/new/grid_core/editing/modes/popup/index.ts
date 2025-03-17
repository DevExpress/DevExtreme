import { computed } from '@ts/core/reactive/index';

import type { OptionsController } from '../../../options_controller/options_controller';
import type { ToolbarController } from '../../../toolbar/controller';
import * as buttons from '../../buttons';
import type { EditingController } from '../../controller';
import type { EditMode } from '../mode';

export class PopupMode implements EditMode {
  private readonly addCardButton = computed(
    (hintText) => buttons.addCard({
      onClick: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.editing.addNewCard();
      },
      hintText,
    }),
    [this.options.oneWay('editing.texts.addCard')],
  );

  constructor(
    private readonly options: OptionsController,
    private readonly editing: EditingController,
    private readonly toolbar: ToolbarController,
  ) {
    this.toolbar.addDefaultItem(this.addCardButton);
  }

  public addNewCardImpl(): Promise<void> {
    return Promise.resolve();
  }
}
