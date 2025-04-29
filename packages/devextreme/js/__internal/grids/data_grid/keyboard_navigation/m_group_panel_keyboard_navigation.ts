/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { hiddenFocus } from '@js/ui/shared/accessibility';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/m_header_panel';
import { CONTEXT_MENU_MOVE_NEXT_ICON, CONTEXT_MENU_MOVE_PREVIOUS_ICON, Direction } from '@ts/grids/grid_core/keyboard_navigation/const';
import { ColumnKeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_column_keyboard_navigation_core';
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

      if (this.isGroupColumnValidForReordering(column, direction)) {
        this.moveColumn({
          column,
          direction,
          sourceLocation: 'group',
          targetLocation: 'group',
        });
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
        const onItemClick = (e) => {
          this.isNeedToFocusGroupColumn = true;
          groupPanelKeyboardNavigationController.moveColumn({
            column: options.column,
            direction: e.itemData?.value,
            sourceLocation: 'group',
            targetLocation: 'group',
          });
        };

        items = items ?? [];
        items.push(
          {
            text: messageLocalization.format('dxDataGrid-moveColumnToTheLeft'),
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
            text: messageLocalization.format('dxDataGrid-moveColumnToTheRight'),
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
