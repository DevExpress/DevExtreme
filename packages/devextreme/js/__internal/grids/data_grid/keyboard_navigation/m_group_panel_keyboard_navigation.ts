import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import { Direction } from '@ts/grids/grid_core/keyboard_navigation/const';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation_core';
import type { Views } from '@ts/grids/grid_core/m_types';

import { CLASSES as GROUPING_CLASSES } from '../grouping/const';
import gridCore from '../m_core';

export class GroupPanelKeyboardNavigationController extends KeyboardNavigationControllerCore {
  protected headerPanel!: Views['headerPanel'];

  private isGroupColumnValidForReordering(groupColumn, direction: Direction): boolean {
    const groupedColumns = this._columnsController.getGroupColumns();

    return direction === Direction.Next
      ? groupColumn.index !== groupedColumns[groupedColumns.length - 1].index
      : groupColumn.index !== groupedColumns[0].index;
  }

  private leftRightKeysHandler(e): void {
    const { originalEvent } = e;

    if (isCommandKeyPressed(originalEvent)) {
      const groupColumn: any = $(originalEvent.target).data('columnData');
      const direction = this.getDirectionByKeyName(e.keyName);

      if (this.isGroupColumnValidForReordering(groupColumn, direction)) {
        const newGroupIndex = direction === Direction.Next
          ? groupColumn.groupIndex + 2
          : groupColumn.groupIndex - 1;
        const newFocusedGroupColumnIndex = direction === Direction.Next
          ? groupColumn.groupIndex + 1
          : groupColumn.groupIndex - 1;

        this.isNeedToFocus = true;
        this.setFocusedCellPosition(0, newFocusedGroupColumnIndex);
        this._columnsController.columnOption(
          groupColumn.index,
          'groupIndex',
          newGroupIndex,
        );
      }

      originalEvent?.preventDefault();
    }
  }

  protected _getCell(cellPosition): any {
    const $groupColumnElements = this.headerPanel?.getColumnElements();

    return $groupColumnElements?.eq(cellPosition.columnIndex);
  }

  protected getFocusedView() {
    return this.getView('headerPanel');
  }

  protected getFocusedViewElement() {
    return this.headerPanel?.element()?.find(`.${GROUPING_CLASSES.groupPanel}`);
  }

  protected getFocusinSelector(): string {
    return `.${GROUPING_CLASSES.groupPanelItem}`;
  }

  protected keyDownHandler(e): void {
    const isHandled = this.processOnKeyDown(e);

    if (isHandled) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (e.keyName) {
      case 'leftArrow':
      case 'rightArrow':
        this.leftRightKeysHandler(e);
        break;
    }
  }

  public init(): void {
    this.headerPanel = this.getView('headerPanel');
    super.init();
  }
}

gridCore.registerModule('groupPanelKeyboardNavigation', {
  controllers: {
    groupPanelKeyboardNavigation: GroupPanelKeyboardNavigationController,
  },
});
