import type { dxElementWrapper } from '@js/core/renderer';
import type { EngineEvent } from '@ts/events/core/events_engine';
import eventsEngine from '@ts/events/core/events_engine';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import { isCellBasedEditMode } from '@ts/grids/grid_core/editing/editing_utils';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/keyboard_navigation';
import type { ModuleType } from '@ts/grids/grid_core/types';

import { CLASSES } from '../const';
import { hasHiddenWidth } from '../utils';

type FocusCellEvent = EngineEvent & { data?: { $nextCell?: dxElementWrapper } };

function focusCellHandler(e: FocusCellEvent): void {
  const $nextCell = e.data?.$nextCell;

  eventsEngine.off($nextCell, 'focus', focusCellHandler);
  eventsEngine.trigger($nextCell, 'dxclick');
}

export const adaptivityKeyboardNavigationViewControllerExtender = (
  Base: ModuleType<KeyboardNavigationController>,
): ModuleType<
  KeyboardNavigationController
> => class AdaptivityKeyboardNavigationViewControllerExtender extends Base {
  public isCellValid($cell: dxElementWrapper, isClick?: boolean): boolean {
    return (
      super.isCellValid($cell, isClick)
        && !$cell.hasClass(this.addWidgetPrefix(CLASSES.hiddenColumn))
        && !$cell.hasClass(CLASSES.commandAdaptiveHidden)
    );
  }

  protected _processNextCellInMasterDetail(
    $nextCell: dxElementWrapper | null,
    $cell: dxElementWrapper,
  ): void {
    super._processNextCellInMasterDetail($nextCell, $cell);

    const isCellOrBatchMode = isCellBasedEditMode(this._editingController.getEditMode());
    const isEditing = this._editingController.isEditing();

    if (
      isEditing
        && $nextCell
        && isCellOrBatchMode
        && !this._isInsideEditForm($nextCell)
    ) {
      eventsEngine.off($nextCell, 'focus', focusCellHandler);
      eventsEngine.on($nextCell, 'focus', { $nextCell }, focusCellHandler);

      eventsEngine.trigger($cell, 'focus');
    }
  }

  protected isFocusableColumn(column: Column): boolean {
    return super.isFocusableColumn(column) && !hasHiddenWidth(column);
  }

  public isCellElement($cell: dxElementWrapper): boolean {
    return super.isCellElement($cell) || $cell.hasClass(CLASSES.adaptiveItemText);
  }
};
