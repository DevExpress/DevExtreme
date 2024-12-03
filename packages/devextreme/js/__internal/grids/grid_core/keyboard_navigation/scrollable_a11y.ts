/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */

/*
This extender is to fix accessibilty issue: Scrollable should always have focusable element inside.
When there are fixed columns on the left and grid has scroll, scrollable element does not have
any focusable elements inside, because first cell of fixed table gets tabIndex.

This fix makes first cell in not fixed table to always have tabIndex, so checker won't show error.
And to make navigation via Tab key working properly some focus event handlers are added.
*/

import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined, isEmptyObject } from '@js/core/utils/type';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import type { KeyboardNavigationController } from './m_keyboard_navigation';

// eslint-disable-next-line max-len
export const keyboardNavigationScrollableA11yExtender = (Base: ModuleType<KeyboardNavigationController>): ModuleType<KeyboardNavigationController> => class ScrollableA11yExtender extends Base {
  private _$firstNotFixedCell: dxElementWrapper | undefined;

  protected rowsViewFocusHandler(event: any): void {
    const $target = $(event.target);

    this.translateFocusIfNeed(event, $target);

    super.rowsViewFocusHandler(event);
  }

  protected rowsViewFocusOutHandler(): void {
    super.rowsViewFocusOutHandler();
    this.makeScrollableFocusableIfNeed();
  }

  private translateFocusIfNeed(event: Event, $target: dxElementWrapper): void {
    const needTranslateFocus = this.isScrollableNeedFocusable();
    const isFirstCellFixed = this._isFixedColumn(0);

    if (!needTranslateFocus || !isFirstCellFixed) {
      return;
    }

    const $firstCell = this._rowsView.getCell({ rowIndex: 0, columnIndex: 0 });
    const firstCellHasTabIndex = !!$firstCell.attr('tabindex');

    // @ts-expect-error dxElementWrapper doesn't have overload for 'is' method
    const notFixedCellIsTarget = $target.is(this._$firstNotFixedCell);

    if (firstCellHasTabIndex && notFixedCellIsTarget) {
      event.preventDefault();

      this._focus($firstCell);
    }
  }

  protected rowsViewRenderCompleted(e: any): void {
    this._$firstNotFixedCell = this.getFirstNotFixedCell();
    this.makeScrollableFocusableIfNeed();

    super.rowsViewRenderCompleted(e);
  }

  public _focus($cell: any, disableFocus?: any, skipFocusEvent?: any): void {
    super._focus($cell, disableFocus, skipFocusEvent);

    this.makeScrollableFocusableIfNeed();
  }

  protected _tabKeyHandler(eventArgs: any, isEditing: any): void {
    const isCellPositionDefined = isDefined(this._focusedCellPosition)
      && !isEmptyObject(this._focusedCellPosition);
    const isOriginalHandlerRequired = !isCellPositionDefined
      || (!eventArgs.shift && this._isLastValidCell(this._focusedCellPosition))
      || (eventArgs.shift && this._isFirstValidCell(this._focusedCellPosition));
    const isNeedFocusable = this.isScrollableNeedFocusable();

    if (isOriginalHandlerRequired && isNeedFocusable) {
      this._$firstNotFixedCell?.removeAttr('tabIndex');
    }

    super._tabKeyHandler(eventArgs, isEditing);
  }

  private getFirstNotFixedCell(): dxElementWrapper | undefined {
    const columns = this._columnsController.getVisibleColumns();
    const columnIndex = columns.findIndex(({ fixed }) => !fixed);
    const isEditing = this._editingController?.isEditing();

    return columnIndex === -1 || isEditing
      ? undefined
      : this._rowsView._getCellElement(0, columnIndex);
  }

  private isScrollableNeedFocusable(): boolean {
    const hasScrollable = !!this._rowsView.getScrollable();
    // @ts-expect-error _fixedTableElement is declared in rowsView extender
    const hasFixedTable = !!this._rowsView._fixedTableElement?.length;
    const isCellsRendered = !!this._rowsView.getCellElements(0)?.length;

    return hasScrollable && hasFixedTable && isCellsRendered;
  }

  private makeScrollableFocusableIfNeed(): void {
    const needFocusable = this.isScrollableNeedFocusable();

    if (!needFocusable || !this._$firstNotFixedCell) {
      return;
    }

    this._applyTabIndexToElement(this._$firstNotFixedCell);
  }
};
