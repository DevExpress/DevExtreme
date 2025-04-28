/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import { hiddenFocus } from '@js/ui/shared/accessibility';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/m_header_panel';
import { CONTEXT_MENU_MOVE_NEXT_ICON, CONTEXT_MENU_MOVE_PREVIOUS_ICON, Direction } from '@ts/grids/grid_core/keyboard_navigation/const';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation_core';
import type { ModuleType, Views } from '@ts/grids/grid_core/m_types';

import { CLASSES as GROUPING_CLASSES } from '../grouping/const';
import gridCore from '../m_core';

export class GroupPanelKeyboardNavigationController extends KeyboardNavigationControllerCore {
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
      const groupColumn: any = $(originalEvent.target).data('columnData');
      const direction = this.getDirectionByKeyName(e.keyName);

      if (this.isGroupColumnValidForReordering(groupColumn, direction)) {
        this.moveGroupColumn(groupColumn, direction);
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

  public isGroupColumnValidForReordering(groupColumn, direction: Direction): boolean {
    const allowDragging = this.headerPanel.allowDragging(groupColumn);

    if (!allowDragging) {
      return false;
    }

    const groupedColumns = this._columnsController.getGroupColumns();

    return direction === Direction.Next
      ? groupColumn.groupIndex !== groupedColumns.length - 1
      : groupColumn.groupIndex !== 0;
  }

  public moveGroupColumn(groupColumn, direction) {
  /*
    We need to add 2 to the index instead of 1,
    because that's how normalization of these indexes works.

    For example, we have columns with the following indexes:
    0 1 2 3

    We drag 1 to the right. Its index becomes 3.
    0 2 3(1) 3(3)

    After normalization of the indexes:
    0 1(2) 2(1) 3(3)
  */
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
}

const headerPanel = (Base: ModuleType<HeaderPanel>) => class HeaderPanelKeyboardNavigationExtender extends Base {
  private isNeedToFocusGroupColumn = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected contextMenuHiddenHandler(e) {
    const groupPanelKeyboardNavigationController = this.getController('groupPanelKeyboardNavigation');

    if (this.isNeedToFocusGroupColumn) {
      groupPanelKeyboardNavigationController?.restoreFocus();
      this.isNeedToFocusGroupColumn = false;
    }
  }

  public getContextMenuItems(options) {
    let items: any = super.getContextMenuItems(options);
    const { column } = options;
    const allowDragging = this.allowDragging(column);

    if (allowDragging) {
      const groupPanelKeyboardNavigationController = this.getController('groupPanelKeyboardNavigation');

      if (groupPanelKeyboardNavigationController) {
        const rtlEnabled = this.option('rtlEnabled');
        const keyboardNavigationTexts = this.option('keyboardNavigation.texts');
        const onItemClick = (e) => {
          this.isNeedToFocusGroupColumn = true;
          groupPanelKeyboardNavigationController.moveGroupColumn(column, e.itemData?.value);
        };

        items = items ?? [];
        items.push(
          {
            text: keyboardNavigationTexts?.movePrevious,
            value: Direction.Previous,
            beginGroup: true,
            disabled: !groupPanelKeyboardNavigationController.isGroupColumnValidForReordering(
              column,
              Direction.Previous,
            ),
            icon: rtlEnabled ? CONTEXT_MENU_MOVE_NEXT_ICON : CONTEXT_MENU_MOVE_PREVIOUS_ICON,
            onItemClick,
          },
          {
            text: keyboardNavigationTexts?.moveNext,
            value: Direction.Next,
            disabled: !groupPanelKeyboardNavigationController.isGroupColumnValidForReordering(
              column,
              Direction.Next,
            ),
            icon: rtlEnabled ? CONTEXT_MENU_MOVE_PREVIOUS_ICON : CONTEXT_MENU_MOVE_NEXT_ICON,
            onItemClick,
          },
        );
      }
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
