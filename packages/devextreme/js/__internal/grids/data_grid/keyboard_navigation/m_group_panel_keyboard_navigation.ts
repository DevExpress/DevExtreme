import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import { hiddenFocus } from '@js/ui/shared/accessibility';
import { Direction, ViewName } from '@ts/grids/grid_core/keyboard_navigation/const';
import { ColumnKeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_column_keyboard_navigation_core';
import type { Views } from '@ts/grids/grid_core/m_types';

import { CLASSES as GROUPING_CLASSES } from '../grouping/const';
import gridCore from '../m_core';

export class GroupPanelKeyboardNavigationController extends ColumnKeyboardNavigationController {
  private isNeedToHiddenFocusAfterClick = false;

  private groupItemClickHandlerContext!: (event: any) => void;

  private headerPanel!: Views['headerPanel'];

  private groupItemClickHandler(e) {
    const groupColumn: any = $(e.originalEvent.target).data('columnData');

    this.isNeedToHiddenFocusAfterClick = this._columnsController?.allowColumnSorting(groupColumn);
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
      const column: any = $(originalEvent.target).data('columnData');
      const direction = this.getDirectionByKeyName(e.keyName);

      if (this.isColumnValidForReordering(column, direction)) {
        this.moveColumn({
          column,
          sourceLocation: 'group',
          targetLocation: 'group',
          direction,
        });
      }

      originalEvent?.preventDefault();
    }
  }

  protected getVisibleIndex(column) {
    return column.groupIndex;
  }

  protected getNewVisibleIndex(visibleIndex, direction, sourceLocation, targetLocation) {
    if (targetLocation === ViewName.Headers) {
      return -1;
    }

    return super.getNewVisibleIndex(visibleIndex, direction, sourceLocation, targetLocation);
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

    if (e.keyName === 'leftArrow' || e.keyName === 'rightArrow') {
      this.leftRightKeysHandler(e);
    }
  }

  protected renderCompleted(e: any) {
    const { isNeedToFocus } = this;

    super.renderCompleted(e);
    this.unsubscribeFromGroupItemClick();
    this.subscribeToGroupItemClick();

    if (!isNeedToFocus && this.isNeedToHiddenFocusAfterClick) {
      const $focusElement = this._getFocusedCell();

      if ($focusElement?.length) {
        hiddenFocus($focusElement.get(0));
      }

      this.isNeedToHiddenFocusAfterClick = false;
    }
  }

  public init(): void {
    this.headerPanel = this.getView('headerPanel');
    this.groupItemClickHandlerContext = this.groupItemClickHandlerContext
      ?? this.groupItemClickHandler.bind(this);
    super.init();
  }

  public isColumnValidForReordering(groupColumn, direction: Direction): boolean {
    const allowDragging = this.headerPanel.allowDragging(groupColumn);

    if (!allowDragging) {
      return false;
    }

    const groupedColumns = this._columnsController.getGroupColumns();

    return direction === Direction.Next
      ? groupColumn.groupIndex !== groupedColumns.length - 1
      : groupColumn.groupIndex !== 0;
  }
}

gridCore.registerModule('groupPanelKeyboardNavigation', {
  controllers: {
    groupPanelKeyboardNavigation: GroupPanelKeyboardNavigationController,
  },
});
