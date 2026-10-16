import eventsEngine from '@js/common/core/events/core/events_engine';
import { keyboard } from '@js/common/core/events/short';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { getBoundingRect } from '@js/core/utils/position';
import type { DxEvent } from '@js/events';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type Scrollable from '@ts/ui/scroll_view/scrollable';
import { getElementLocationInternal } from '@ts/ui/scroll_view/utils/get_element_location_internal';

import modules from '../modules/modules';
import type { Controllers, OptionChanged, Views } from '../types';
import gridCoreUtils from '../utils';
import type { ColumnsView } from '../views/columns_view';
import type { ViewDataChange } from '../views/types';
import { Direction } from './const';
import type { FocusedCellPosition, HorizontalBounds, NavigationDirection } from './types';
import { isElementDefined, isFixedColumnIndexOffsetRequired } from './utils';

export class KeyboardNavigationController extends modules.ViewController {
  private keyDownListener?: string;

  private resizeCompletedWithContext!: () => void;

  protected needToRestoreFocus = false;

  protected renderCompletedWithContext!: (e?: unknown) => void;

  protected focusinHandlerContext!: (event: DxEvent<FocusEvent>) => void;

  protected _columnsController!: Controllers['columns'];

  protected _resizeController!: Controllers['resizing'];

  protected _rowsView!: Views['rowsView'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- rows KBN resets it to {}
  public _focusedCellPosition: any;

  private _applyColumnIndexBoundaries(columnIndex: number): number {
    const visibleColumnCount = this._columnsController.getVisibleColumns(null, true).length;

    if (columnIndex < 0) {
      return 0;
    }

    if (columnIndex >= visibleColumnCount) {
      return visibleColumnCount - 1;
    }

    return columnIndex;
  }

  private unsubscribeFromKeyDownEvent(): void {
    if (this.keyDownListener) {
      keyboard.off(this.keyDownListener);
    }
  }

  private subscribeToKeyDownEvent(): void {
    const $focusedViewElement = this.getFocusedViewElement();

    if ($focusedViewElement) {
      this.keyDownListener = keyboard.on($focusedViewElement, null, (e) => this.keyDownHandler(e));
    }
  }

  private unsubscribeFromFocusinEvent(): void {
    const $focusedView = this.getFocusedViewElement();

    if ($focusedView) {
      eventsEngine.off($focusedView, 'focusin', this.focusinHandlerContext);
    }
  }

  private subscribeToFocusinEvent(): void {
    const $focusedView = this.getFocusedViewElement();
    const focusinSelector = this.getFocusinSelector();

    if ($focusedView) {
      eventsEngine.on($focusedView, 'focusin', focusinSelector, this.focusinHandlerContext);
    }
  }

  private getScrollPadding($container: dxElementWrapper): HorizontalBounds {
    const containerRect = getBoundingRect($container.get(0));
    const containerBoundingRect = this.getContainerBoundingRect($container);

    return {
      left: containerBoundingRect.left - containerRect.left,
      right: containerRect.right - containerBoundingRect.right,
    };
  }

  private getVirtualCellWidth(): number {
    const visibleColumns = this._columnsController.getVisibleColumns(undefined, true);
    const widths = gridCoreUtils.getColumnWidths(visibleColumns);
    const focusedColumnIndex = this._focusedCellPosition?.columnIndex ?? 0;

    return widths[focusedColumnIndex] ?? 0;
  }

  private getNextCellLocation(
    $cell: dxElementWrapper | null,
    direction?: NavigationDirection,
  ): number {
    const scrollable = this.getScrollable();
    const isVirtualColumnRender = this._isVirtualColumnRender();

    if (!scrollable || ($cell === null && !isVirtualColumnRender)) {
      return 0;
    }

    if ($cell === null) {
      const isLeftDirection = direction === 'previous' || direction === 'previousInRow';
      const multiplier = isLeftDirection !== this.option('rtlEnabled') ? -1 : 1;

      return scrollable.scrollLeft() + multiplier * this.getVirtualCellWidth();
    }

    const scrollPadding = this.getScrollPadding($(scrollable.container()));

    return getElementLocationInternal(
      $cell[0],
      'horizontal',
      $(this.getFocusedView()?.getContent())[0],
      scrollable.scrollOffset(),
      scrollPadding,
      this.addWidgetPrefix(VIEW_CLASSES.table),
    );
  }

  protected resizeCompleted(): void {}

  protected getColumnIndexOffset(visibleIndex: number): number {
    let offset = 0;
    const column = this._columnsController.getVisibleColumns()[visibleIndex];

    if (column?.fixed) {
      offset = this._getFixedColumnIndexOffset(column);
    } else if (visibleIndex >= 0) {
      offset = this._columnsController.getColumnIndexOffset();
    }

    return offset;
  }

  protected getFocusedViewElement(): dxElementWrapper | undefined {
    return this.getFocusedView()?.element();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
  protected keyDownHandler(e: KeyboardKeyDownEvent): void {}

  protected initKeyDownHandler(): void {
    this.unsubscribeFromKeyDownEvent();
    this.subscribeToKeyDownEvent();
  }

  protected getFocusinSelector(): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
  protected focusinHandler(e: DxEvent<FocusEvent>): void {}

  protected initHandlers(): void {
    const focusedView = this.getFocusedView();

    this.unsubscribeFromKeyDownEvent();

    focusedView?.renderCompleted?.remove(this.renderCompletedWithContext);
    this._resizeController?.resizeCompleted?.remove(this.resizeCompletedWithContext);

    if (this.isKeyboardEnabled()) {
      focusedView?.renderCompleted?.add(this.renderCompletedWithContext);
      this._resizeController?.resizeCompleted?.add(this.resizeCompletedWithContext);
    }
  }

  protected getFocusedView(): ColumnsView | undefined {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
  protected _getCell(cellPosition: FocusedCellPosition): dxElementWrapper | undefined {
    return undefined;
  }

  protected _getRowIndex($row: dxElementWrapper): number {
    return $row?.index();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
  protected getCellIndex($cell: dxElementWrapper, rowIndex?: number): number {
    return $cell?.index();
  }

  protected _getFixedColumnIndexOffset(column: Column): number {
    const visibleColumnCount = this._columnsController.getVisibleColumns(null, true).length;
    const offset = isFixedColumnIndexOffsetRequired(this, column)
      ? visibleColumnCount
        - this._columnsController.getVisibleColumns().length
      : 0;

    return offset;
  }

  protected getNewVisibleIndex(
    visibleIndex: number,
    rowIndex: number,
    direction: NavigationDirection,
  ): number {
    return direction === 'previous' ? visibleIndex - 1 : visibleIndex + 1;
  }

  protected _getCellPosition(
    $cell: dxElementWrapper,
    direction?: NavigationDirection,
  ): FocusedCellPosition | undefined {
    const $row = isElementDefined($cell) ? $cell.closest('tr') : undefined;

    if ($row && isElementDefined($row)) {
      const rowIndex = this._getRowIndex($row);
      let columnIndex = this.getCellIndex($cell, rowIndex);

      columnIndex += this.getColumnIndexOffset(columnIndex);

      if (direction) {
        columnIndex = this.getNewVisibleIndex(columnIndex, rowIndex, direction);
        columnIndex = this._applyColumnIndexBoundaries(columnIndex);
      }

      return { rowIndex, columnIndex };
    }

    return undefined;
  }

  protected _getColumnByCellElement($cell: dxElementWrapper, rowIndex?: number): Column {
    const cellIndex = this.getCellIndex($cell);
    const columnIndex = cellIndex + this._columnsController.getColumnIndexOffset();

    return this._columnsController.getVisibleColumns(rowIndex, true)[columnIndex];
  }

  protected processOnKeyDown(eventArgs: KeyboardKeyDownEvent): boolean {
    const { originalEvent } = eventArgs;
    const args = {
      handled: false,
      event: originalEvent,
    };

    this.executeAction('onKeyDown', args);

    eventArgs.ctrl = originalEvent.ctrlKey;
    eventArgs.alt = originalEvent.altKey;
    eventArgs.shift = originalEvent.shiftKey;

    return !!args.handled;
  }

  /**
     * @extended: focus
     */
  protected setFocusedColumnIndex(columnIndex: number): void {
    this._focusedCellPosition ??= {};
    this._focusedCellPosition.columnIndex = columnIndex;
  }

  /**
   * @extended: focus
   */
  protected _updateFocusedCellPosition(
    $cell: dxElementWrapper,
    direction?: NavigationDirection,
  ): FocusedCellPosition | undefined {
    const position = this._getCellPosition($cell, direction);

    if (position) {
      if (
        !$cell.length
        || (position.rowIndex >= 0 && position.columnIndex >= 0)
      ) {
        this.setFocusedCellPosition(position.rowIndex, position.columnIndex);
      }
    }
    return position;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
  protected renderCompleted(e?: ViewDataChange): void {
    this.initKeyDownHandler();

    this.unsubscribeFromFocusinEvent();
    this.subscribeToFocusinEvent();
  }

  protected getScrollable(): Scrollable {
    return this._rowsView.getScrollable() as Scrollable;
  }

  protected scrollLeft(scrollLeft: number): DeferredObj<void> {
    const scrollable = this.getScrollable();

    if (!scrollable || scrollable.scrollLeft() === scrollLeft) {
      return Deferred<undefined>().resolve();
    }

    const d = Deferred<undefined>();
    const scrollHandler = (): void => {
      scrollable.off('scroll', scrollHandler);

      const normalizeScrollLeft = this._rowsView.normalizeScrollLeft(scrollLeft);

      if (this._columnsController?.isNeedToRenderVirtualColumns(normalizeScrollLeft)) {
        const renderCompletedHandler = (): void => {
          this._rowsView.renderCompleted.remove(renderCompletedHandler);
          d.resolve();
        };

        this._rowsView.renderCompleted.add(renderCompletedHandler);
      } else {
        d.resolve();
      }
    };

    scrollable.on('scroll', scrollHandler);
    scrollable.scrollTo({ left: scrollLeft });

    return d;
  }

  protected scrollToNextCell(
    $nextCell: dxElementWrapper | null,
    direction?: NavigationDirection,
  ): DeferredObj<void> {
    const scrollLeft = this.getNextCellLocation($nextCell, direction);

    return this.scrollLeft(scrollLeft);
  }

  protected _isVirtualColumnRender(): boolean {
    return this.option('scrolling.columnRenderingMode') === 'virtual';
  }

  protected getContainerBoundingRect($container: dxElementWrapper): HorizontalBounds {
    const containerRect = getBoundingRect($container.get(0));

    return {
      left: containerRect.left,
      right: containerRect.right,
    };
  }

  public init(): void {
    this._columnsController = this.getController('columns');
    this._resizeController = this.getController('resizing');
    this._rowsView = this.getView('rowsView');
    this._focusedCellPosition = {};

    if (this.isKeyboardEnabled()) {
      this.createAction('onKeyDown');
    }

    this.renderCompletedWithContext = this.renderCompletedWithContext
      ?? this.renderCompleted.bind(this);

    this.resizeCompletedWithContext = this.resizeCompletedWithContext
    ?? this.resizeCompleted.bind(this);

    this.focusinHandlerContext = this.focusinHandlerContext ?? this.focusinHandler.bind(this);

    this.initHandlers();
  }

  public dispose(): void {
    keyboard.off(this.keyDownListener);
  }

  /**
     * @extended: focus
     */
  public setFocusedRowIndex(rowIndex: number): void {
    this._focusedCellPosition ??= {};
    this._focusedCellPosition.rowIndex = rowIndex;
  }

  public setFocusedCellPosition(rowIndex: number, columnIndex: number): void {
    this.setFocusedRowIndex(rowIndex);
    this.setFocusedColumnIndex(columnIndex);
  }

  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'keyboardNavigation':
        if (args.fullName === 'keyboardNavigation.enabled') {
          this.init();
        }
        args.handled = true;
        break;
      case 'useLegacyKeyboardNavigation':
        this.init();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  public isKeyboardEnabled(): boolean | undefined {
    return this.option('keyboardNavigation.enabled');
  }

  public _getFocusedCell(): dxElementWrapper {
    return $(this._getCell(this._focusedCellPosition));
  }

  public getDirectionByKeyName(keyName: string): Direction {
    const rtlEnabled = this.option('rtlEnabled');

    switch (keyName) {
      case 'leftArrow': {
        return rtlEnabled ? Direction.Next : Direction.Previous;
      }
      case 'rightArrow': {
        return rtlEnabled ? Direction.Previous : Direction.Next;
        break;
      }
      default: {
        return Direction.Next;
      }
    }
  }
}
