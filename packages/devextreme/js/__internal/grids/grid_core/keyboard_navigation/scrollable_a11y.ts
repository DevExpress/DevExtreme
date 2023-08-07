/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */

/*
This extender is to fix accessibilty issue: Scrollable should always have focusable element inside.
When there are fixed columns on the left and grid has scroll, scrollable element does not have
any focusable elements inside, because first cell of fixed table gets tabIndex.
*/

import $, { dxElementWrapper } from '@js/core/renderer';
import { isDefined, isEmptyObject } from '@js/core/utils/type';
import eventsEngine from '@js/events/core/events_engine';
import { ModuleType } from '@ts/grids/grid_core/m_types';
import { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import { KeyboardNavigationController } from './m_keyboard_navigation';

// eslint-disable-next-line max-len
const keyboardNavigationScrollableA11yExtender = (Base: ModuleType<KeyboardNavigationController>): ModuleType<KeyboardNavigationController> => class ScrollableA11yExtender extends Base {
  private _$firstNotFixedCell: dxElementWrapper | undefined;

  private rowsViewFocusOutHandlerContext!: (event: any) => void;

  init(): void {
    super.init();

    // eslint-disable-next-line max-len
    this.rowsViewFocusOutHandlerContext = this.rowsViewFocusOutHandlerContext || this.rowsViewFocusOutHandler.bind(this);
  }

  protected subscribeToRowsViewFocusEvent(): void {
    super.subscribeToRowsViewFocusEvent();

    const $rowsView = this._rowsView?.element();

    eventsEngine.on($rowsView, 'focusout', this.rowsViewFocusOutHandlerContext);
  }

  protected unsubscribeFromRowsViewFocusEvent(): void {
    super.unsubscribeFromRowsViewFocusEvent();

    const $rowsView = this._rowsView?.element();

    eventsEngine.off($rowsView, 'focusout', this.rowsViewFocusOutHandlerContext);
  }

  protected rowsViewFocusHandler(event: any): void {
    const $target = $(event.target);

    this.translateFocusIfNeed(event, $target);

    super.rowsViewFocusHandler(event);
  }

  private rowsViewFocusOutHandler(): void {
    this._rowsView.makeScrollableFocusableIfNeed();
  }

  private translateFocusIfNeed(event: any, $target: dxElementWrapper): void {
    const needTranslateFocus = this._rowsView.isScrollableNeedFocusable();

    if (!needTranslateFocus) {
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

  protected renderCompleted(e: any): void {
    this._$firstNotFixedCell = this._rowsView.getFirstNotFixedCell();

    super.renderCompleted(e);
  }

  protected _tabKeyHandler(eventArgs: any, isEditing: any): void {
    const isCellPositionDefined = isDefined(this._focusedCellPosition)
      && !isEmptyObject(this._focusedCellPosition);
    const isOriginalHandlerRequired = !isCellPositionDefined
      || (!eventArgs.shift && this._isLastValidCell(this._focusedCellPosition))
      || (eventArgs.shift && this._isFirstValidCell(this._focusedCellPosition));

    if (isOriginalHandlerRequired) {
      if (this._rowsView.isScrollableNeedFocusable()) {
        this._$firstNotFixedCell?.removeAttr('tabIndex');
      }
    }

    super._tabKeyHandler(eventArgs, isEditing);
  }
};

// eslint-disable-next-line max-len
const rowsViewScrollableA11yExtender = (Base: ModuleType<RowsView>): ModuleType<RowsView> => class ScrollableA11yExtender extends Base {
  getFirstNotFixedCell(): dxElementWrapper | undefined {
    const columns = this._columnsController.getVisibleColumns();
    const notFixedColumns = columns.filter((column) => !column.fixed);

    if (notFixedColumns.length === 0) {
      return undefined;
    }

    const columnIndex = notFixedColumns[0].visibleIndex;

    return this._getCellElement(0, columnIndex);
  }

  isScrollableNeedFocusable(): boolean {
    const hasScrollable = !!this.getScrollable();
    const hasFixedTable = !!(this as any)._fixedTableElement?.length;
    const hasFirstCell = !!this.getCell({ rowIndex: 0, columnIndex: 0 })?.length;
    const isFirstCellFixed = (this as any)._keyboardController._isFixedColumn(0) as boolean;

    return hasScrollable && hasFixedTable && hasFirstCell && isFirstCellFixed;
  }

  makeScrollableFocusableIfNeed(): void {
    const needFocusable = this.isScrollableNeedFocusable();

    if (!needFocusable) {
      return;
    }

    const $firstNotFixedCell = this.getFirstNotFixedCell();

    if ($firstNotFixedCell) {
      (this as any)._keyboardController._applyTabIndexToElement($firstNotFixedCell);
    }
  }

  renderFocusState(params): void {
    // @ts-expect-error asb
    super.renderFocusState(params);

    this.makeScrollableFocusableIfNeed();
  }
};

export const keyboardNavigationScrollableA11yModule = {
  extenders: {
    controllers: {
      keyboardNavigation: keyboardNavigationScrollableA11yExtender,
    },
    views: {
      rowsView: rowsViewScrollableA11yExtender,
    },
  },
};
