/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import eventsEngine from '@js/common/core/events/core/events_engine';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import {
  ADAPTIVE_ITEM_TEXT_CLASS,
  COMMAND_ADAPTIVE_HIDDEN_CLASS,
  HIDDEN_COLUMN_CLASS,
  HIDDEN_COLUMNS_WIDTH,
} from '../const';

function focusCellHandler(e): void {
  const $nextCell = e.data?.$nextCell;

  eventsEngine.off($nextCell, 'focus', focusCellHandler);
  // @ts-expect-error
  eventsEngine.trigger($nextCell, 'dxclick');
}

export const adaptivityKeyboardNavigationViewControllerExtender = (
  Base: ModuleType<KeyboardNavigationController>,
): ModuleType<KeyboardNavigationController> => class AdaptivityKeyboardNavigationViewControllerExtender
  extends Base {
  public _isCellValid($cell, isClick?) {
    return (
      super._isCellValid($cell, isClick)
        && !$cell.hasClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS))
        && !$cell.hasClass(COMMAND_ADAPTIVE_HIDDEN_CLASS)
    );
  }

  protected _processNextCellInMasterDetail($nextCell, $cell) {
    super._processNextCellInMasterDetail($nextCell, $cell);

    const isCellOrBatchMode = this._editingController.isCellOrBatchEditMode();
    const isEditing = this._editingController.isEditing();

    if (
      isEditing
        && $nextCell
        && isCellOrBatchMode
        && !this._isInsideEditForm($nextCell)
    ) {
      eventsEngine.off($nextCell, 'focus', focusCellHandler);
      eventsEngine.on($nextCell, 'focus', { $nextCell }, focusCellHandler);

      // @ts-expect-error
      eventsEngine.trigger($cell, 'focus');
    }
  }

  protected isFocusableColumn(column: Column): boolean {
    return super.isFocusableColumn(column) && column.visibleWidth !== HIDDEN_COLUMNS_WIDTH;
  }

  public _isCellElement($cell) {
    return super._isCellElement($cell) || $cell.hasClass(ADAPTIVE_ITEM_TEXT_CLASS);
  }
};
