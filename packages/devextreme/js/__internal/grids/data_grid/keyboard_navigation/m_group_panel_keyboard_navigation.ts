/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import { hiddenFocus } from '@js/ui/shared/accessibility';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/m_header_panel';
import { Direction } from '@ts/grids/grid_core/keyboard_navigation/const';
import { ColumnContextMenuMixin, ColumnKeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_column_keyboard_navigation_core';
import type { ModuleType, Views } from '@ts/grids/grid_core/m_types';

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

const headerPanel = (Base: ModuleType<HeaderPanel>) => class HeaderPanelKeyboardNavigationExtender extends ColumnContextMenuMixin(Base) {
  public getKeyboardNavigationController() {
    return this.getController('groupPanelKeyboardNavigation');
  }

  public isColumnReorderingEnabled(column) {
    return this.allowDragging(column);
  }

  public getContextMenuItems(options) {
    let items: any = super.getContextMenuItems(options);
    const $groupedColumnElement = $(options.targetElement).closest(`.${GROUPING_CLASSES.groupPanelItem}`);

    if (!$groupedColumnElement.length) {
      return;
    }

    options.column = $groupedColumnElement.data('columnData');

    const moveColumnItems = this.getMoveColumnContextMenuItems(options);

    if (moveColumnItems?.length) {
      items = items ?? [];
      items.push(...moveColumnItems);
    }

    return items;
  }
};

gridCore.registerModule('groupPanelKeyboardNavigation', {
  controllers: {
    groupPanelKeyboardNavigation: GroupPanelKeyboardNavigationController,
  },
  extenders: {
    views: {
      headerPanel,
    },
  },
});
