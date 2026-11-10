import type { dxElementWrapper } from '@js/core/renderer';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/editor_factory';
import type { ModuleType } from '@ts/grids/grid_core/types';
import { FIELD_ITEM_CONTENT_CLASS } from '@ts/ui/form/constants';

import { CLASSES } from '../const';

export const adaptivityEditorFactoryViewControllerExtender = (
  Base: ModuleType<EditorFactory>,
): ModuleType<EditorFactory> => class AdaptivityEditorFactoryViewControllerExtender extends Base {
  protected _needHideBorder($element: dxElementWrapper): boolean {
    return super._needHideBorder($element)
      || (!!$element?.hasClass(FIELD_ITEM_CONTENT_CLASS) && !!$element?.find('.dx-checkbox').length);
  }

  protected _getFocusCellSelector(): string {
    return `${super._getFocusCellSelector()}, .dx-adaptive-detail-row .dx-field-item > .${FIELD_ITEM_CONTENT_CLASS}`;
  }

  /**
   * Overrides interface
   */
  public _getRevertTooltipsSelector(): string {
    return `${super._getRevertTooltipsSelector()}, .${FIELD_ITEM_CONTENT_CLASS} .${this.addWidgetPrefix(CLASSES.revertTooltip)}`;
  }
};
