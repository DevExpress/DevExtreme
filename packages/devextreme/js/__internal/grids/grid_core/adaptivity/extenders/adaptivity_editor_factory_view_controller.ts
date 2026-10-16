/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';
import type { ModuleType } from '@ts/grids/grid_core/types';
import { FIELD_ITEM_CONTENT_CLASS } from '@ts/ui/form/constants';

import { REVERT_TOOLTIP_CLASS } from '../const';

export const adaptivityEditorFactoryViewControllerExtender = (
  Base: ModuleType<EditorFactory>,
): ModuleType<EditorFactory> => class AdaptivityEditorFactoryViewControllerExtender extends Base {
  protected _needHideBorder($element) {
    return super._needHideBorder($element) || ($element?.hasClass(FIELD_ITEM_CONTENT_CLASS) && $element?.find('.dx-checkbox').length);
  }

  protected _getFocusCellSelector() {
    return `${super._getFocusCellSelector()}, .dx-adaptive-detail-row .dx-field-item > .${FIELD_ITEM_CONTENT_CLASS}`;
  }

  /**
   * Overrides interface
   */
  public _getRevertTooltipsSelector() {
    return `${super._getRevertTooltipsSelector()}, .${FIELD_ITEM_CONTENT_CLASS} .${this.addWidgetPrefix(REVERT_TOOLTIP_CLASS)}`;
  }
};
