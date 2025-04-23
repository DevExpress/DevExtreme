import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import { hiddenFocus } from '@js/ui/shared/accessibility';
import { Direction } from '@ts/grids/grid_core/keyboard_navigation/const';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation_core';
import type { Views } from '@ts/grids/grid_core/m_types';

import { CLASSES as GROUPING_CLASSES } from '../grouping/const';
import gridCore from '../m_core';

export class GroupPanelKeyboardNavigationController extends KeyboardNavigationControllerCore {
  private isNeedToHiddenFocus = false;

  private groupItemClickHandlerContext!: (event: any) => void;

  private headerPanel!: Views['headerPanel'];

  private isGroupColumnValidForReordering(groupColumn, direction: Direction): boolean {
    const allowDragging = this.headerPanel.allowDragging(groupColumn);

    if (!allowDragging) {
      return false;
    }

    const groupedColumns = this._columnsController.getGroupColumns();

    return direction === Direction.Next
      ? groupColumn.index !== groupedColumns[groupedColumns.length - 1].index
      : groupColumn.index !== groupedColumns[0].index;
  }

  private groupItemClickHandler(e) {
    const groupColumn: any = $(e.originalEvent.target).data('columnData');

    this.isNeedToHiddenFocus = this._columnsController?.allowColumnSorting(groupColumn);
  }

  private unsubscribeFromGroupItemClick() {
    const $focusedView = this.getFocusedViewElement();

    if ($focusedView) {
      eventsEngine.off($focusedView, clickEventName, this.groupItemClickHandlerContext);
    }
  }

  private subscribeToGroupItemClick() {
    const $focusedView = this.getFocusedViewElement();

    if ($focusedView) {
      eventsEngine.on($focusedView, clickEventName, `.${GROUPING_CLASSES.groupPanelItem}`, this.groupItemClickHandlerContext);
    }
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

  protected focusinHandler(e: any): void {
    this.setFocusedCellPosition(0, $(e.target).index());
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

  protected renderCompleted(e: any) {
    const { isNeedToFocus } = this;

    super.renderCompleted(e);
    this.unsubscribeFromGroupItemClick();
    this.subscribeToGroupItemClick();

    if (!isNeedToFocus && this.isNeedToHiddenFocus) {
      const $focusElement = this._getFocusedCell();

      if ($focusElement?.length) {
        hiddenFocus($focusElement.get(0));
      }

      this.isNeedToHiddenFocus = false;
    }
  }

  public init(): void {
    this.headerPanel = this.getView('headerPanel');
    this.groupItemClickHandlerContext = this.groupItemClickHandlerContext
      ?? this.groupItemClickHandler.bind(this);
    super.init();
  }
}

gridCore.registerModule('groupPanelKeyboardNavigation', {
  controllers: {
    groupPanelKeyboardNavigation: GroupPanelKeyboardNavigationController,
  },
});
