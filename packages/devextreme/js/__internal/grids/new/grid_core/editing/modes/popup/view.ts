import type { SubsGets } from '@ts/core/reactive/index';
import { combined } from '@ts/core/reactive/index';

import { View } from '../../../core/view';
import type { Properties } from './edit_popup';
import { EditPopup } from './edit_popup';

export class PopupView extends View<Properties> {
  protected component = EditPopup;

  protected getProps(): SubsGets<Properties> {
    return combined({
      row: null,
    });
  }
}
