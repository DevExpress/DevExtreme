import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import { hiddenFocus } from '@js/ui/shared/accessibility';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import type { Column, GroupColumn } from '@ts/grids/grid_core/columns_controller/types';
import { ColumnKeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/column_keyboard_navigation_core';
import { Direction } from '@ts/grids/grid_core/keyboard_navigation/const';
import type { FocusedCellPosition } from '@ts/grids/grid_core/keyboard_navigation/types';
import type { Views } from '@ts/grids/grid_core/types';
import type { ViewDataChange } from '@ts/grids/grid_core/views/types';

import gridCore from '../core';
import { CLASSES as GROUPING_CLASSES } from '../grouping/const';
import { ColumnKeyboardNavigationMixin } from './column_keyboard_navigation_mixin';

export class GroupPanelKeyboardNavigationController
  extends ColumnKeyboardNavigationMixin(ColumnKeyboardNavigationController) {
  private isNeedToHiddenFocusAfterClick: boolean | undefined = false;

  private groupItemClickHandlerContext!: (event: DxEvent<MouseEvent>) => void;

  private headerPanel!: Views['headerPanel'];

  private groupItemClickHandler(e: DxEvent<MouseEvent>): void {
    const $groupedColumnElement = $(e.originalEvent.target);
    const groupColumn = this._columnsController.columnOption(`groupIndex:${$groupedColumnElement.index()}`);

    this.isNeedToHiddenFocusAfterClick = this._columnsController?.allowColumnSorting(groupColumn);
  }

  private unsubscribeFromGroupItemClick(): void {
    const $focusedView = this.getFocusedViewElement();

    if ($focusedView) {
      eventsEngine.off($focusedView, clickEventName, this.groupItemClickHandlerContext);
    }
  }

  private subscribeToGroupItemClick(): void {
    const $focusedView = this.getFocusedViewElement();

    if ($focusedView) {
      eventsEngine.on(
        $focusedView,
        clickEventName,
        `.${GROUPING_CLASSES.groupPanelItem}`,
        this.groupItemClickHandlerContext,
      );
    }
  }

  private leftRightKeysHandler(e: KeyboardKeyDownEvent): void {
    const { originalEvent } = e;

    if (isCommandKeyPressed(originalEvent)) {
      const $groupedColumnElement = $(originalEvent.target);
      const column = this._columnsController.columnOption(`groupIndex:${$groupedColumnElement.index()}`);
      const direction = this.getDirectionByKeyName(e.keyName);

      if (column && this.canReorderColumn(column, direction)) {
        this.moveColumn(column, direction);
      }

      originalEvent?.preventDefault();
    }
  }

  protected getVisibleIndex(column: GroupColumn): number {
    return column.groupIndex;
  }

  protected getColumnFromEvent(e: KeyboardKeyDownEvent): Column | undefined {
    const $groupedColumnElement = $(e.originalEvent.target);

    return this._columnsController
      .columnOption(`groupIndex:${$groupedColumnElement.index()}`);
  }

  protected getNewFocusedColumnBeforeUngrouping(column: GroupColumn): Column | undefined {
    const visibleColumnIndex: number = column.groupIndex;
    const groupColumns: Column[] = this._columnsController.getGroupColumns();

    return visibleColumnIndex === groupColumns.length - 1
      ? groupColumns[visibleColumnIndex - 1]
      : groupColumns[visibleColumnIndex + 1];
  }

  protected _getCell(cellPosition: FocusedCellPosition): dxElementWrapper | undefined {
    const $groupColumnElements = this.headerPanel?.getColumnElements();

    return $groupColumnElements?.eq(cellPosition.columnIndex);
  }

  protected getFocusedView(): Views['headerPanel'] {
    return this.getView('headerPanel');
  }

  protected getFocusedViewElement(): dxElementWrapper | undefined {
    return this.headerPanel?.element()?.find(`.${GROUPING_CLASSES.groupPanel}`);
  }

  protected getFocusinSelector(): string {
    return `.${GROUPING_CLASSES.groupPanelItem}`;
  }

  protected focusinHandler(e: DxEvent<FocusEvent>): void {
    this.setFocusedCellPosition(0, $(e.target).index());
  }

  protected keyDownHandler(e: KeyboardKeyDownEvent): boolean {
    let isHandled = super.keyDownHandler(e);

    if (isHandled) {
      return true;
    }

    if (e.keyName === 'leftArrow' || e.keyName === 'rightArrow') {
      this.leftRightKeysHandler(e);
      isHandled = true;
    }

    return isHandled;
  }

  protected renderCompleted(e?: ViewDataChange): void {
    super.renderCompleted(e);
    this.unsubscribeFromGroupItemClick();
    this.subscribeToGroupItemClick();

    if (!this.needToRestoreFocus && this.isNeedToHiddenFocusAfterClick) {
      const $focusElement = this._getFocusedCell();

      if ($focusElement?.length) {
        hiddenFocus($focusElement.get(0));
      }

      this.isNeedToHiddenFocusAfterClick = false;
    }
  }

  public canUngroupColumnByPressingKey(e: KeyboardKeyDownEvent): boolean {
    return super.canUngroupColumnByPressingKey(e) || e.keyName === 'backspace' || e.keyName === 'del';
  }

  public getFirstFocusableVisibleIndex(): number {
    const columns = this.headerPanel?.getColumns();

    return columns?.length ? 0 : -1;
  }

  public init(): void {
    this.headerPanel = this.getView('headerPanel');
    this.groupItemClickHandlerContext = this.groupItemClickHandlerContext
      ?? this.groupItemClickHandler.bind(this);

    super.init();
  }

  public canReorderColumn(groupColumn: Column, direction: Direction): boolean {
    const allowDragging = this.headerPanel.allowDragging(groupColumn);

    if (!allowDragging) {
      return false;
    }

    const groupedColumns = this._columnsController.getGroupColumns();

    return direction === Direction.Next
      ? groupColumn.groupIndex !== groupedColumns.length - 1
      : groupColumn.groupIndex !== 0;
  }

  public ungroupAllColumns(): void {
    this.updateViewFocusPosition();
    super.ungroupAllColumns();
  }
}

gridCore.registerModule('groupPanelKeyboardNavigation', {
  controllers: {
    groupPanelKeyboardNavigation: GroupPanelKeyboardNavigationController,
  },
});

declare module '@ts/grids/grid_core/types' {
  interface Controllers {
    groupPanelKeyboardNavigation: GroupPanelKeyboardNavigationController;
  }
}
