/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import { REVERT_TOOLTIP_CLASS } from '../const';

export const adaptivityEditorFactoryExtender = (
  Base: ModuleType<EditorFactory>,
): ModuleType<EditorFactory> => class AdaptivityEditorFactoryExtender extends Base {
  protected _needHideBorder($element) {
    return super._needHideBorder($element) || ($element?.hasClass('dx-field-item-content') && $element?.find('.dx-checkbox').length);
  }

  protected _getFocusCellSelector() {
    return `${super._getFocusCellSelector()}, .dx-adaptive-detail-row .dx-field-item > .dx-field-item-content`;
  }

  /**
   * Overrides interface
   */
  public _getRevertTooltipsSelector() {
    return `${super._getRevertTooltipsSelector()}, .dx-field-item-content .${this.addWidgetPrefix(REVERT_TOOLTIP_CLASS)}`;
  }
};
