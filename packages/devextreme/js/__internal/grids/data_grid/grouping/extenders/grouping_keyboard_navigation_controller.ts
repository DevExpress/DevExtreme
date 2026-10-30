import { isDefined } from '@js/core/utils/type';
import type { Grouping, MasterDetail } from '@js/ui/data_grid';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import { CLASSES as COLUMNS_CONTROLLER_CLASSES } from '@ts/grids/grid_core/columns_controller/const';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import type { KeyboardNavigationDataController } from '@ts/grids/grid_core/keyboard_navigation/types';
import { isGroupRow } from '@ts/grids/grid_core/keyboard_navigation/utils';
import type { ModuleType } from '@ts/grids/grid_core/types';

import type { GroupingDataControllerExtension } from '../types';

export const groupingKeyboardNavigationControllerExtender = (
  Base: ModuleType<KeyboardNavigationController>,
): ModuleType<KeyboardNavigationController> => class GroupingKeyboardNavigationControllerExtender
  extends Base {
  protected declare _dataController: KeyboardNavigationDataController
  & GroupingDataControllerExtension;

  private needToggleRowExpand(rowIndex: number): boolean {
    const $row = this._focusedView?.getRow(rowIndex);
    const $cell = this._getFocusedCell();
    const allowCollapsing: Grouping['allowCollapsing'] = this.option('grouping.allowCollapsing');
    const masterDetailEnabled: MasterDetail['enabled'] = this.option('masterDetail.enabled');

    return Boolean(allowCollapsing && isGroupRow($row))
      || Boolean(masterDetailEnabled && $cell.hasClass(COLUMNS_CONTROLLER_CLASSES.commandExpand));
  }

  protected _enterKeyHandler(eventArgs: KeyboardKeyDownEvent, isEditing: boolean): void {
    const rowIndex = this.getVisibleRowIndex();

    if (!this.needToggleRowExpand(rowIndex)) {
      super._enterKeyHandler(eventArgs, isEditing);
      return;
    }

    const key = this._dataController.getKeyByRowIndex(rowIndex);
    const item = this._dataController.items()[rowIndex];
    const isNotContinuation = item?.data && !item.data.isContinuation;

    if (isDefined(key) && isNotContinuation) {
      this._dataController.changeRowExpand(key);
    }
  }
};
