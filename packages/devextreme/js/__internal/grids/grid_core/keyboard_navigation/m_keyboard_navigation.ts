/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { keyboard } from '@js/common/core/events/short';
import {
  addNamespace,
  createEvent,
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import { noop } from '@js/core//utils/common';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { Deferred, when } from '@js/core/utils/deferred';
import {
  getHeight,
  getOuterHeight,
  getOuterWidth,
  getWidth,
} from '@js/core/utils/size';
import { isDeferred, isDefined, isEmptyObject } from '@js/core/utils/type';
import * as accessibility from '@js/ui/shared/accessibility';
import { focused } from '@js/ui/widget/selectors';
import { isElementInDom } from '@ts/core/utils/m_dom';
import type { AdaptiveColumnsController } from '@ts/grids/grid_core/adaptivity/m_adaptivity';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';
import { memoize } from '@ts/utils/memoize';

import {
  EDIT_FORM_CLASS,
  EDIT_MODE_BATCH,
  EDIT_MODE_CELL,
  EDIT_MODE_FORM,
  EDIT_MODE_ROW,
  EDITOR_CELL_CLASS,
  FILTER_ROW_CLASS,
  FOCUSABLE_ELEMENT_SELECTOR,
  ROW_CLASS,
} from '../editing/const';
import modules from '../m_modules';
import type {
  Controllers, ModuleType, OptionChanged, RowKey, Views,
} from '../m_types';
import gridCoreUtils from '../m_utils';
import {
  ADAPTIVE_COLUMN_NAME_CLASS,
  CELL_FOCUS_DISABLED_CLASS,
  COLUMN_HEADERS_VIEW,
  COMMAND_CELL_SELECTOR,
  COMMAND_EDIT_CLASS,
  COMMAND_EXPAND_CLASS,
  COMMAND_SELECT_CLASS,
  DATA_ROW_CLASS,
  DATEBOX_WIDGET_NAME,
  DROPDOWN_EDITOR_OVERLAY_CLASS,
  EDIT_FORM_ITEM_CLASS,
  FAST_EDITING_DELETE_KEY,
  FOCUS_STATE_CLASS,
  FOCUS_TYPE_CELL,
  FOCUS_TYPE_ROW,
  FOCUSED_CLASS,
  FREESPACE_ROW_CLASS,
  FUNCTIONAL_KEYS,
  INTERACTIVE_ELEMENTS_SELECTOR,
  MASTER_DETAIL_CELL_CLASS,
  NON_FOCUSABLE_ELEMENTS_SELECTOR,
  REVERT_BUTTON_CLASS,
  ROWS_VIEW,
  ROWS_VIEW_CLASS,
  TABLE_CLASS,
  WIDGET_CLASS,
} from './const';
import { GridCoreKeyboardNavigationDom } from './dom';
import {
  isCellInHeaderRow,
  isDataRow,
  isDetailRow,
  isEditForm,
  isEditorCell,
  isElementDefined,
  isFixedColumnIndexOffsetRequired,
  isGroupFooterRow,
  isGroupRow,
  isMobile,
  isNotFocusedRow,
  shouldPreventScroll,
} from './m_keyboard_navigation_utils';
import { keyboardNavigationScrollableA11yExtender } from './scrollable_a11y';

export class KeyboardNavigationController extends modules.ViewController {
  private _updateFocusTimeout: any;

  public _fastEditingStarted: any;

  public _focusedCellPosition: any;

  private _canceledCellPosition: any;

  private focusedHandlerWithContext!: ($element: dxElementWrapper) => void;

  private rowsViewRenderCompletedWithContext!: (e: any) => void;

  private columnHeadersViewRenderCompletedWithContext!: (e: any) => void;

  private rowsViewFocusHandlerContext!: (event: any) => void;

  private rowsViewFocusOutHandlerContext!: (event: Event) => void;

  public _isNeedScroll: any;

  private _focusedView?: RowsView | null;

  public _isNeedFocus: any;

  private _isHiddenFocus: any;

  private _documentClickHandler: any;

  private _pointerEventAction: any;

  private _rowsViewKeyDownListener: any;

  private _columnHeadersViewKeyDownListener: any;

  private focusType: any;

  private _testInteractiveElement: any;

  protected _dataController!: Controllers['data'];

  private _selectionController!: Controllers['selection'];

  protected _editingController!: Controllers['editing'];

  private _headerPanel!: Views['headerPanel'];

  protected _rowsView!: Views['rowsView'];

  protected _columnHeadersView!: Views['columnHeadersView'];

  protected _columnsController!: Controllers['columns'];

  private _editorFactory!: Controllers['editorFactory'];

  private _focusController!: Controllers['focus'];

  private _adaptiveColumnsController!: Controllers['adaptiveColumns'];

  private _columnResizerController!: Controllers['columnsResizer'];

  // #region Initialization
  public init() {
    this._dataController = this.getController('data');
    this._selectionController = this.getController('selection');
    this._editingController = this.getController('editing');
    this._headerPanel = this.getView('headerPanel');
    this._rowsView = this.getView('rowsView');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._columnsController = this.getController('columns');
    this._editorFactory = this.getController('editorFactory');
    this._focusController = this.getController('focus');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._columnResizerController = this.getController('columnsResizer');

    this._memoFireFocusedCellChanged = memoize(this._memoFireFocusedCellChanged.bind(this), { compareType: 'value' });
    this._memoFireFocusedRowChanged = memoize(this._memoFireFocusedRowChanged.bind(this), { compareType: 'value' });

    this.focusedHandlerWithContext = this.focusedHandlerWithContext || this.focusedHandler.bind(this);
    this.columnHeadersViewRenderCompletedWithContext = this.columnHeadersViewRenderCompletedWithContext || this.columnHeadersViewRenderCompleted.bind(this);
    this.rowsViewRenderCompletedWithContext = this.rowsViewRenderCompletedWithContext || this.rowsViewRenderCompleted.bind(this);
    this.rowsViewFocusHandlerContext = this.rowsViewFocusHandlerContext || this.rowsViewFocusHandler.bind(this);
    this.rowsViewFocusOutHandlerContext = this.rowsViewFocusOutHandlerContext
      ?? this.rowsViewFocusOutHandler.bind(this);

    this._updateFocusTimeout = null;
    this._fastEditingStarted = false;
    this._focusedCellPosition = {};
    this._canceledCellPosition = null;

    if (this.isKeyboardEnabled()) {
      accessibility.subscribeVisibilityChange();
      this._editorFactory?.focused.add(this.focusedHandlerWithContext);
      this.createAction('onKeyDown');
    } else {
      accessibility.unsubscribeVisibilityChange();
      this._editorFactory?.focused.remove(this.focusedHandlerWithContext);
    }

    this.initColumnHeadersViewHandler();
    this.initRowsViewHandlers();
    this.initDocumentHandlers();
  }

  public dispose() {
    super.dispose();
    this._resetFocusedView();
    keyboard.off(this._rowsViewKeyDownListener);
    keyboard.off(this._columnHeadersViewKeyDownListener);
    eventsEngine.off(
      domAdapter.getDocument(),
      addNamespace(pointerEvents.down, 'dxDataGridKeyboardNavigation'),
      this._documentClickHandler,
    );
    clearTimeout(this._updateFocusTimeout);
    accessibility.unsubscribeVisibilityChange();
  }

  private focusedHandler($element: dxElementWrapper): void {
    this.setupFocusedView();

    if (this._isNeedScroll) {
      if (
        $element.is(':visible')
        && this._focusedView
        && this._focusedView.getScrollable()
      ) {
        this._focusedView._scrollToElement($element);
        this._isNeedScroll = false;
      }
    }
  }

  protected rowsViewFocusHandler(event: any): void {
    const $element = $(event.target);
    const isRelatedTargetInRowsView = $(event.relatedTarget).closest(
      this._rowsView.element(),
    ).length;
    const isLink = $element.is('a');

    if (
      event.relatedTarget
      && isLink
      && !isRelatedTargetInRowsView
      && this._isEventInCurrentGrid(event)
    ) {
      let $focusedCell = this._getFocusedCell();

      $focusedCell = !isElementDefined($focusedCell)
        ? this._rowsView.getCellElements(0)!.filter('[tabindex]').eq(0)
        : $focusedCell;

      if (!$element.closest($focusedCell).length) {
        event.preventDefault();
        // @ts-expect-error
        eventsEngine.trigger($focusedCell, 'focus');
      }
    }

    const isCell = $element.is('td');
    const needSetFocusPosition = (this.option('focusedRowIndex') ?? -1) < 0;
    if (isCell && needSetFocusPosition) {
      this._updateFocusedCellPosition($element);
    }
  }

  protected rowsViewFocusOutHandler(): void {
    this._toggleInertAttr(false);
  }

  protected subscribeToRowsViewFocusEvent(): void {
    const $rowsView = this._rowsView?.element();

    eventsEngine.on($rowsView, 'focusin', this.rowsViewFocusHandlerContext);
    eventsEngine.on($rowsView, 'focusout', this.rowsViewFocusOutHandlerContext);
  }

  protected unsubscribeFromRowsViewFocusEvent(): void {
    const $rowsView = this._rowsView?.element();

    eventsEngine.off($rowsView, 'focusin', this.rowsViewFocusHandlerContext);
    eventsEngine.off($rowsView, 'focusout', this.rowsViewFocusOutHandlerContext);
  }

  protected columnHeadersViewRenderCompleted(): void {
    this.initColumnHeadersViewKeyDownHandler();
  }

  protected rowsViewRenderCompleted(e: any): void {
    const $rowsView = this._rowsView.element();
    const isFullUpdate = !e || e.changeType === 'refresh';
    const isFocusedViewCorrect = this._focusedView && this._focusedView.name === this._rowsView.name;
    let needUpdateFocus = false;
    const isAppend = e && (e.changeType === 'append' || e.changeType === 'prepend');
    // @ts-expect-error
    const root = $(domAdapter.getRootNode($rowsView.get && $rowsView.get(0)));
    const $focusedElement = root.find(':focus');
    const isFocusedElementCorrect = this._isFocusedElementCorrect($focusedElement, $rowsView, e);

    this.unsubscribeFromRowsViewFocusEvent();
    this.subscribeToRowsViewFocusEvent();

    this.initPointerEventHandler();
    this.initRowsViewKeyDownHandler();
    this._setRowsViewAttributes();

    if (isFocusedViewCorrect && isFocusedElementCorrect) {
      needUpdateFocus = this._isNeedFocus
        ? !isAppend
        : this._isHiddenFocus && isFullUpdate && !e?.virtualColumnsScrolling;
      if (needUpdateFocus) {
        this._updateFocus(true);
      }
    }
  }

  private _isFocusedElementCorrect($focusedElement, $rowsView, e) {
    if ($focusedElement.length && !$focusedElement.closest($rowsView).length) {
      return false;
    }

    if (!$focusedElement.length && e?.virtualColumnsScrolling) {
      const focusedColumnIndex = this._focusedCellPosition?.columnIndex ?? -1;
      const focusedColumnIndexWithoutOffset = focusedColumnIndex - this._getFocusedColumnIndexOffset(focusedColumnIndex);

      return focusedColumnIndexWithoutOffset >= 0;
    }

    return true;
  }

  private initColumnHeadersViewHandler(): void {
    this.unsubscribeFromColumnHeadersViewKeyDownEvent();

    this._columnHeadersView?.renderCompleted?.remove(this.columnHeadersViewRenderCompletedWithContext);

    if (this.isKeyboardEnabled()) {
      this._columnHeadersView?.renderCompleted?.add(this.columnHeadersViewRenderCompletedWithContext);
    }
  }

  private initRowsViewHandlers(): void {
    this.unsubscribeFromRowsViewFocusEvent();
    this.unsubscribeFromPointerEvent();
    this.unsubscribeFromRowsViewKeyDownEvent();

    this._rowsView?.renderCompleted?.remove(this.rowsViewRenderCompletedWithContext);

    if (this.isKeyboardEnabled()) {
      this._rowsView.renderCompleted.add(this.rowsViewRenderCompletedWithContext);
    }
  }

  private initDocumentHandlers(): void {
    const document = domAdapter.getDocument();

    this._documentClickHandler = this._documentClickHandler || this.createAction((e) => {
      const $target = $(e.event.target);

      const tableSelector = `.${this.addWidgetPrefix(TABLE_CLASS)}`;
      const rowsViewSelector = `.${this.addWidgetPrefix(ROWS_VIEW_CLASS)}`;
      const editorOverlaySelector = `.${DROPDOWN_EDITOR_OVERLAY_CLASS}`;

      // if click was on the datagrid table, but the target element is no more presented in the DOM
      const needKeepFocus = !!$target.closest(tableSelector).length && !isElementInDom($target);

      if (needKeepFocus) {
        e.event.preventDefault();
        return;
      }

      const isRowsViewClick = this._isEventInCurrentGrid(e.event) && !!$target.closest(rowsViewSelector).length;
      const isEditorOverlayClick = !!$target.closest(editorOverlaySelector).length;
      const isColumnResizing = !!this._columnResizerController?.isResizing();

      if (!isRowsViewClick && !isEditorOverlayClick && !isColumnResizing) {
        const isClickOutsideFocusedView = this._focusedView
          ? $target.closest(this._focusedView.element()).length === 0
          : true;

        if (isClickOutsideFocusedView) {
          this._resetFocusedCell(true);
        }

        this._resetFocusedView();
      }
    });

    eventsEngine.off(
      document,
      addNamespace(pointerEvents.down, 'dxDataGridKeyboardNavigation'),
      this._documentClickHandler,
    );

    if (this.isKeyboardEnabled()) {
      eventsEngine.on(
        document,
        addNamespace(pointerEvents.down, 'dxDataGridKeyboardNavigation'),
        this._documentClickHandler,
      );
    }
  }

  private _setRowsViewAttributes() {
    const $rowsView = this._getRowsViewElement();
    const isGridEmpty = !this._dataController.getVisibleRows().length;
    if (isGridEmpty) {
      this._applyTabIndexToElement($rowsView);
    }
  }

  private unsubscribeFromPointerEvent(): void {
    const pointerEventName = !isMobile() ? pointerEvents.down : clickEventName;
    const $rowsView = this._getRowsViewElement();

    this._pointerEventAction && eventsEngine.off(
      $rowsView,
      addNamespace(pointerEventName, 'dxDataGridKeyboardNavigation'),
      this._pointerEventAction,
    );
  }

  private subscribeToPointerEvent(): void {
    const pointerEventName = !isMobile() ? pointerEvents.down : clickEventName;
    const $rowsView = this._getRowsViewElement();
    const clickSelector = `.${ROW_CLASS} > td, .${ROW_CLASS}`;

    eventsEngine.on(
      $rowsView,
      addNamespace(pointerEventName, 'dxDataGridKeyboardNavigation'),
      clickSelector,
      this._pointerEventAction,
    );
  }

  private initPointerEventHandler(): void {
    this._pointerEventAction = this._pointerEventAction || this.createAction(this._pointerEventHandler);
    this.unsubscribeFromPointerEvent();
    this.subscribeToPointerEvent();
  }

  private unsubscribeFromColumnHeadersViewKeyDownEvent(): void {
    if (this._columnHeadersViewKeyDownListener) {
      keyboard.off(this._columnHeadersViewKeyDownListener);
    }
  }

  private subscribeToColumnHeadersViewKeyDownEvent(): void {
    const $columnHeadersView = this._columnHeadersView.element();

    this._columnHeadersViewKeyDownListener = keyboard.on($columnHeadersView, null, (e) => this._columnHeadersViewKeyDownHandler(e));
  }

  private initColumnHeadersViewKeyDownHandler(): void {
    this.unsubscribeFromColumnHeadersViewKeyDownEvent();
    this.subscribeToColumnHeadersViewKeyDownEvent();
  }

  private unsubscribeFromRowsViewKeyDownEvent(): void {
    keyboard.off(this._rowsViewKeyDownListener);
  }

  private subscribeToRowsViewKeyDownEvent(): void {
    const $rowsView = this._getRowsViewElement();

    this._rowsViewKeyDownListener = keyboard.on($rowsView, null, (e) => this._rowsViewKeyDownHandler(e));
  }

  private initRowsViewKeyDownHandler(): void {
    this._rowsViewKeyDownListener && this.unsubscribeFromRowsViewKeyDownEvent();
    this.subscribeToRowsViewKeyDownEvent();
  }

  // #endregion Initialization

  // #region Options
  public optionChanged(args: OptionChanged) {
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

  public isRowFocusType() {
    return this.focusType === FOCUS_TYPE_ROW;
  }

  public isCellFocusType() {
    return this.focusType === FOCUS_TYPE_CELL;
  }

  public setRowFocusType() {
    if (this.option('focusedRowEnabled')) {
      this.focusType = FOCUS_TYPE_ROW;
    }
  }

  public setCellFocusType() {
    this.focusType = FOCUS_TYPE_CELL;
  }
  // #endregion Options

  // #region Key_Handlers

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected headerTabKeyHandler(e) {}

  private _columnHeadersViewKeyDownHandler(e) {
    if (e.keyName === 'tab') {
      this.headerTabKeyHandler(e);
    }
  }

  private _rowsViewKeyDownHandler(e) {
    let needStopPropagation = true;
    this._isNeedFocus = true;
    this._isNeedScroll = true;
    let isHandled = this._processOnKeyDown(e);
    const isEditing = this._editingController?.isEditing();
    const { originalEvent } = e;

    if (originalEvent.isDefaultPrevented()) {
      this._isNeedFocus = false;
      this._isNeedScroll = false;
      return;
    }

    !FUNCTIONAL_KEYS.includes(e.keyName)
      && this._updateFocusedCellPositionByTarget(originalEvent.target);

    if (!isHandled) {
      // eslint-disable-next-line default-case
      switch (e.keyName) {
        case 'leftArrow':
        case 'rightArrow':
          this._leftRightKeysHandler(e, isEditing);
          isHandled = true;
          break;

        case 'upArrow':
        case 'downArrow':
          if (e.ctrl) {
            accessibility.selectView('rowsView', this, originalEvent);
          } else {
            this._upDownKeysHandler(e, isEditing);
          }
          isHandled = true;
          break;

        case 'pageUp':
        case 'pageDown':
          this._pageUpDownKeyHandler(e);
          isHandled = true;
          break;

        case 'space':
          isHandled = this._spaceKeyHandler(e, isEditing);
          break;

        case 'A':
          if (isCommandKeyPressed(e.originalEvent)) {
            this._ctrlAKeyHandler(e, isEditing);
            isHandled = true;
          } else {
            isHandled = this._beginFastEditing(e.originalEvent);
          }
          break;

        case 'tab':
          this._tabKeyHandler(e, isEditing);
          isHandled = true;
          break;

        case 'enter':
          this._enterKeyHandler(e, isEditing);
          isHandled = true;
          break;

        case 'escape':
          isHandled = this._escapeKeyHandler(e, isEditing);
          break;

        case 'F':
          if (isCommandKeyPressed(e.originalEvent)) {
            this._ctrlFKeyHandler(e);
            isHandled = true;
          } else {
            isHandled = this._beginFastEditing(e.originalEvent);
          }
          break;

        case 'F2':
          this._f2KeyHandler();
          isHandled = true;
          break;

        case 'del':
        case 'backspace':
          if (this._isFastEditingAllowed() && !this._isFastEditingStarted()) {
            isHandled = this._beginFastEditing(originalEvent, true);
          }
          break;
      }

      if (!isHandled && !this._beginFastEditing(originalEvent)) {
        this._isNeedFocus = false;
        this._isNeedScroll = false;
        needStopPropagation = false;
      }

      if (needStopPropagation) {
        originalEvent.stopPropagation();
      }
    }
  }

  private _processOnKeyDown(eventArgs) {
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

  private _closeEditCell() {
    const d = Deferred();
    setTimeout(() => {
      this._editingController.closeEditCell().always(d.resolve);
    });
    return d;
  }

  /**
   * @extended: TreeList's keyboard_navigation
   */
  protected _leftRightKeysHandler(eventArgs, isEditing) {
    const rowIndex = this.getVisibleRowIndex();
    const $event = eventArgs.originalEvent;
    const $row = this._focusedView && this._focusedView.getRow(rowIndex);
    const directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
    const isEditingNavigationMode = this._isFastEditingStarted();
    const allowNavigate = (!isEditing || isEditingNavigationMode) && isDataRow($row);

    if (allowNavigate) {
      this.setCellFocusType();

      isEditingNavigationMode && this._closeEditCell();
      if (this._isVirtualColumnRender()) {
        this._processVirtualHorizontalPosition(directionCode);
      }
      const $cell = this._getNextCell(directionCode);
      if (isElementDefined($cell)) {
        this._arrowKeysHandlerFocusCell($event, $cell, directionCode);
      }

      $event && $event.preventDefault();
    }
  }

  private isInsideMasterDetail($target): boolean {
    const $masterDetail = $target.closest(`.${MASTER_DETAIL_CELL_CLASS}`);
    return !!$masterDetail.get(0)
      && this.elementIsInsideGrid($masterDetail)
      && !$target.is($masterDetail);
  }

  private _upDownKeysHandler(eventArgs, isEditing) {
    const visibleRowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView && this._focusedView.getRow(visibleRowIndex);
    const $event = eventArgs.originalEvent;
    const isUpArrow = eventArgs.keyName === 'upArrow';
    const dataSource = this._dataController.dataSource();
    const isRowEditingInCurrentRow = this._editingController?.isEditRowByIndex?.(visibleRowIndex);
    const isEditingNavigationMode = this._isFastEditingStarted();
    const isInsideMasterDetail = this.isInsideMasterDetail($($event?.target));
    const allowNavigate = (!isRowEditingInCurrentRow || !isEditing || isEditingNavigationMode)
      && $row
      && !isEditForm($row)
      && !isInsideMasterDetail;

    if (allowNavigate) {
      isEditingNavigationMode && this._closeEditCell();
      if (!this._navigateNextCell($event, eventArgs.keyName)) {
        if (
          this._isVirtualRowRender()
          && isUpArrow
          && dataSource
          && !dataSource.isLoading()
        ) {
          const rowHeight = getOuterHeight($row);
          const rowIndex = this._focusedCellPosition.rowIndex - 1;
          this._scrollBy(0, -rowHeight, rowIndex, $event);
        }
      }

      $event && $event.preventDefault();
    }
  }

  private _pageUpDownKeyHandler(eventArgs) {
    const pageIndex = this._dataController.pageIndex();
    const pageCount = this._dataController.pageCount();
    const pagingEnabled = this.option('paging.enabled');
    const isPageUp = eventArgs.keyName === 'pageUp';
    const pageStep = isPageUp ? -1 : 1;
    const scrollable = this._rowsView.getScrollable();

    if (pagingEnabled && !this._isVirtualScrolling()) {
      if (
        (isPageUp ? pageIndex > 0 : pageIndex < pageCount - 1)
        && !this._isVirtualScrolling()
      ) {
        this._dataController.pageIndex(pageIndex + pageStep);
        eventArgs.originalEvent.preventDefault();
      }
    } else if (
      scrollable
      && getHeight(scrollable.container()) < getHeight(scrollable.$content())
    ) {
      this._scrollBy(0, getHeight(scrollable.container()) * pageStep);
      eventArgs.originalEvent.preventDefault();
    }
  }

  private _spaceKeyHandler(eventArgs, isEditing) {
    const rowIndex = this.getVisibleRowIndex();
    const $target = $(
      eventArgs.originalEvent && eventArgs.originalEvent.target,
    );

    if (
      this.option('selection')
      && (this.option('selection') as any).mode !== 'none'
      && !isEditing
    ) {
      const isFocusedRowElement = this._getElementType($target) === 'row'
        && this.isRowFocusType()
        && isDataRow($target);
      const isFocusedSelectionCell = $target.hasClass(COMMAND_SELECT_CLASS);
      if (
        isFocusedSelectionCell
        && this.option('selection.showCheckBoxesMode') === 'onClick'
      ) {
        this._selectionController.startSelectionWithCheckboxes();
      }
      if (
        isFocusedRowElement
        || $target.parent().hasClass(DATA_ROW_CLASS)
        || $target.hasClass(this.addWidgetPrefix(ROWS_VIEW_CLASS))
      ) {
        this._selectionController.changeItemSelection(rowIndex, {
          shift: eventArgs.shift,
          control: eventArgs.ctrl,
        });
        eventArgs.originalEvent.preventDefault();

        return true;
      }

      return false;
    }
    return this._beginFastEditing(eventArgs.originalEvent);
  }

  private _ctrlAKeyHandler(eventArgs, isEditing) {
    if (
      !isEditing
      && !eventArgs.alt
      && this.option('selection.mode') === 'multiple'
      && this.option('selection.allowSelectAll')
    ) {
      this._selectionController.selectAll();
      eventArgs.originalEvent.preventDefault();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _toggleInertAttr(value: boolean): void {}

  protected _tabKeyHandler(eventArgs, isEditing) {
    const editingOptions = this.option('editing');
    const direction = eventArgs.shift ? 'previous' : 'next';
    const isCellPositionDefined = isDefined(this._focusedCellPosition)
      && !isEmptyObject(this._focusedCellPosition);
    const isFirstValidCell = eventArgs.shift && this._isFirstValidCell(this._focusedCellPosition);
    const isLastValidCell = !eventArgs.shift && this._isLastValidCell(this._focusedCellPosition);

    let isOriginalHandlerRequired = !isCellPositionDefined || isFirstValidCell || isLastValidCell;

    const eventTarget = eventArgs.originalEvent.target;
    const focusedViewElement = this._focusedView && this._focusedView.element();

    if (this._handleTabKeyOnMasterDetailCell(eventTarget, direction)) {
      return;
    }

    $(focusedViewElement).addClass(FOCUS_STATE_CLASS);

    if (editingOptions && eventTarget && !isOriginalHandlerRequired) {
      if ($(eventTarget).hasClass(this.addWidgetPrefix(ROWS_VIEW_CLASS))) {
        this._resetFocusedCell();
      }

      if (this._isVirtualColumnRender()) {
        this._processVirtualHorizontalPosition(direction);
      }

      if (isEditing) {
        if (!this._editingCellTabHandler(eventArgs, direction)) {
          return;
        }
      } else if (this._targetCellTabHandler(eventArgs, direction)) {
        isOriginalHandlerRequired = true;
      }
    }

    if (isOriginalHandlerRequired) {
      const $cell = this._getFocusedCell();
      const isCommandCell = $cell.is(COMMAND_CELL_SELECTOR);
      if (isLastValidCell && !isCommandCell) {
        this._toggleInertAttr(true);
      }
      this._editorFactory.loseFocus();

      if (this._editingController.isEditing() && !this._isRowEditMode()) {
        this._resetFocusedCell(true);
        this._resetFocusedView();
        this._closeEditCell();
      }
    } else {
      eventArgs.originalEvent.preventDefault();
    }
  }

  private _getMaxHorizontalOffset() {
    const scrollable = this.component.getScrollable();
    return scrollable
      ? scrollable.scrollWidth() - getWidth(this._rowsView.element())
      : 0;
  }

  private _isColumnRendered(columnIndex) {
    const allVisibleColumns = this._columnsController.getVisibleColumns(
      null,
      true,
    );
    const renderedVisibleColumns = this._columnsController.getVisibleColumns();
    const column = allVisibleColumns[columnIndex];
    let result = false;

    if (column) {
      result = renderedVisibleColumns.indexOf(column) >= 0;
    }

    return result;
  }

  protected _isFixedColumn(columnIndex) {
    const allVisibleColumns = this._columnsController.getVisibleColumns(
      null,
      true,
    );
    const column = allVisibleColumns[columnIndex];
    return !!column && !!column.fixed;
  }

  private _isColumnVirtual(columnIndex) {
    const localColumnIndex = columnIndex - this._columnsController.getColumnIndexOffset();
    const visibleColumns = this._columnsController.getVisibleColumns();
    const column = visibleColumns[localColumnIndex];
    return !!column && column.command === 'virtual';
  }

  private _processVirtualHorizontalPosition(direction) {
    const scrollable = this.component.getScrollable();
    const columnIndex = this.getColumnIndex();
    let nextColumnIndex;
    let horizontalScrollPosition = 0;
    let needToScroll = false;

    // eslint-disable-next-line default-case
    switch (direction) {
      case 'next':
      case 'nextInRow': {
        const columnsCount = this._getVisibleColumnCount();
        nextColumnIndex = columnIndex + 1;
        horizontalScrollPosition = this.option('rtlEnabled')
          ? this._getMaxHorizontalOffset()
          : 0;
        if (direction === 'next') {
          needToScroll = columnsCount === nextColumnIndex
            || (this._isFixedColumn(columnIndex)
              && !this._isColumnRendered(nextColumnIndex));
        } else {
          needToScroll = columnsCount > nextColumnIndex
            && this._isFixedColumn(columnIndex)
            && !this._isColumnRendered(nextColumnIndex);
        }
        break;
      }
      case 'previous':
      case 'previousInRow': {
        nextColumnIndex = columnIndex - 1;
        horizontalScrollPosition = this.option('rtlEnabled')
          ? 0
          : this._getMaxHorizontalOffset();
        if (direction === 'previous') {
          const columnIndexOffset = this._columnsController.getColumnIndexOffset();
          const leftEdgePosition = nextColumnIndex < 0 && columnIndexOffset === 0;
          needToScroll = leftEdgePosition
            || (this._isFixedColumn(columnIndex)
              && !this._isColumnRendered(nextColumnIndex));
        } else {
          needToScroll = nextColumnIndex >= 0
            && this._isFixedColumn(columnIndex)
            && !this._isColumnRendered(nextColumnIndex);
        }
        break;
      }
    }

    if (needToScroll) {
      scrollable.scrollTo({ left: horizontalScrollPosition });
    } else if (
      isDefined(nextColumnIndex)
      && isDefined(direction)
      && this._isColumnVirtual(nextColumnIndex)
    ) {
      horizontalScrollPosition = this._getHorizontalScrollPositionOffset(direction);
      horizontalScrollPosition !== 0
        && scrollable.scrollBy({ left: horizontalScrollPosition, top: 0 });
    }
  }

  private _getHorizontalScrollPositionOffset(direction) {
    let positionOffset = 0;
    const $currentCell = this._getCell(this._focusedCellPosition);
    const currentCellWidth = $currentCell && getOuterWidth($currentCell);
    if (currentCellWidth > 0) {
      const rtlMultiplier = this.option('rtlEnabled') ? -1 : 1;
      positionOffset = direction === 'nextInRow' || direction === 'next'
        ? currentCellWidth * rtlMultiplier
        : currentCellWidth * rtlMultiplier * -1;
    }
    return positionOffset;
  }

  private _editingCellTabHandler(eventArgs, direction) {
    const eventTarget = eventArgs.originalEvent.target;
    let $cell = this._getCellElementFromTarget(eventTarget);
    let isEditingAllowed;
    const $event = eventArgs.originalEvent;
    const elementType = this._getElementType(eventTarget);

    if ($cell.is(COMMAND_CELL_SELECTOR)) {
      return !this._targetCellTabHandler(eventArgs, direction);
    }

    this._updateFocusedCellPosition($cell);
    const nextCellInfo = this._getNextCellByTabKey(
      $event,
      direction,
      elementType,
    );
    $cell = nextCellInfo.$cell;

    if (!$cell || this._handleTabKeyOnMasterDetailCell($cell, direction)) {
      return false;
    }

    const column = this._getColumnByCellElement($cell);
    const $row = $cell.parent();
    const rowIndex = this._getRowIndex($row);
    const row = this._dataController.items()[rowIndex] as any;
    const editingController = this._editingController;

    if (column && column.allowEditing) {
      const isDataRow = !row || row.rowType === 'data';
      isEditingAllowed = editingController.allowUpdating({ row })
        ? isDataRow
        : row && row.isNewRow;
    }

    if (!isEditingAllowed) {
      this._closeEditCell();
    }

    if (this._focusCell($cell, !nextCellInfo.isHighlighted)) {
      if (!this._isRowEditMode() && isEditingAllowed) {
        this._editFocusedCell();
      } else {
        this._focusInteractiveElement($cell, eventArgs.shift);
      }
    }

    return true;
  }

  private _targetCellTabHandler(eventArgs, direction) {
    const $event = eventArgs.originalEvent;
    let eventTarget = $event.target;
    let elementType = this._getElementType(eventTarget);
    let $cell = this._getCellElementFromTarget(eventTarget);
    const $lastInteractiveElement = elementType === 'cell' && this._getInteractiveElement(
      $cell,
      !eventArgs.shift,
    );
    let isOriginalHandlerRequired = false;

    if (
      !isEditorCell(this, $cell)
      && $lastInteractiveElement?.length
      && eventTarget !== $lastInteractiveElement.get(0)
    ) {
      isOriginalHandlerRequired = true;
    } else {
      if (
        this._focusedCellPosition.rowIndex === undefined
        && $(eventTarget).hasClass(ROW_CLASS)
      ) {
        this._updateFocusedCellPosition($cell);
      }

      elementType = this._getElementType(eventTarget);
      if (this.isRowFocusType()) {
        this.setCellFocusType();
        if (elementType === 'row' && isDataRow($(eventTarget))) {
          eventTarget = this.getFirstValidCellInRow($(eventTarget));
          elementType = this._getElementType(eventTarget);
        }
      }

      const nextCellInfo = this._getNextCellByTabKey(
        $event,
        direction,
        elementType,
      );
      $cell = nextCellInfo.$cell;

      if (!$cell) {
        return false;
      }

      $cell = this._checkNewLineTransition($event, $cell);
      if (!$cell) {
        return false;
      }

      this._focusCell($cell, !nextCellInfo.isHighlighted);

      if (!isEditorCell(this, $cell)) {
        this._focusInteractiveElement($cell, eventArgs.shift);
      }
    }

    return isOriginalHandlerRequired;
  }

  private _getNextCellByTabKey($event, direction, elementType) {
    let $cell = this._getNextCell(direction, elementType);

    const args = $cell && this._fireFocusedCellChanging($event, $cell, true);

    if (!args || args.cancel) {
      return {};
    }

    if (args.$newCellElement) {
      $cell = args.$newCellElement;
    }

    return {
      $cell,
      isHighlighted: args.isHighlighted,
    };
  }

  private _checkNewLineTransition($event, $cell) {
    const rowIndex = this.getVisibleRowIndex();
    const $row = $cell.parent();

    if (rowIndex !== this._getRowIndex($row)) {
      const cellPosition = this._getCellPosition($cell);
      const args = this._fireFocusedRowChanging($event, $row);
      if (args.cancel) {
        return;
      }
      if (args.rowIndexChanged && cellPosition) {
        this.setFocusedColumnIndex(cellPosition.columnIndex);
        $cell = this._getFocusedCell();
      }
    }

    return $cell;
  }

  private _enterKeyHandler(eventArgs, isEditing) {
    const rowIndex = this.getVisibleRowIndex();
    const key = this._dataController.getKeyByRowIndex(rowIndex);

    const $row = this._focusedView?.getRow(rowIndex);
    const $cell = this._getFocusedCell();

    const needExpandGroupRow = this.option('grouping.allowCollapsing') && isGroupRow($row);
    const needExpandMasterDetailRow = this.option('masterDetail.enabled') && $cell?.hasClass(COMMAND_EXPAND_CLASS);
    const needExpandAdaptiveRow = $cell?.hasClass(ADAPTIVE_COLUMN_NAME_CLASS);

    if (needExpandGroupRow || needExpandMasterDetailRow) {
      const item = this._dataController.items()[rowIndex];

      const isNotContinuation = item?.data && !item.data.isContinuation;

      if (isDefined(key) && isNotContinuation) {
        (this._dataController as any).changeRowExpand(key);
      }
    } else if (needExpandAdaptiveRow) {
      this._adaptiveColumnsController.toggleExpandAdaptiveDetailRow(key);

      this._updateFocusedCellPosition($cell);
    } else if (this.getMasterDetailCell($cell)?.is($cell)) {
      if ($cell.is(':focus')) {
        this.focusFirstInteractiveElementInside($cell);
      }
    } else if (!$cell?.hasClass(COMMAND_EDIT_CLASS)) {
      this._processEnterKeyForDataCell(eventArgs, isEditing);
    }
  }

  private focusFirstInteractiveElementInside($el: dxElementWrapper): void {
    ($el.find(INTERACTIVE_ELEMENTS_SELECTOR).get(0) as HTMLElement).focus();
  }

  private _processEnterKeyForDataCell(eventArgs, isEditing) {
    const direction = this._getEnterKeyDirection(eventArgs);
    const allowEditingOnEnterKey = this._allowEditingOnEnterKey();

    if (isEditing || (!allowEditingOnEnterKey && direction)) {
      this._handleEnterKeyEditingCell(eventArgs.originalEvent).done(() => {
        if (direction === 'next' || direction === 'previous') {
          this._targetCellTabHandler(eventArgs, direction);
        } else if (direction === 'upArrow' || direction === 'downArrow') {
          this._navigateNextCell(eventArgs.originalEvent, direction);
        }
      });
    } else if (allowEditingOnEnterKey) {
      this._startEditing(eventArgs);
    }
  }

  private _getEnterKeyDirection(eventArgs) {
    const enterKeyDirection = this.option(
      'keyboardNavigation.enterKeyDirection',
    );
    const isShift = eventArgs.shift;

    if (enterKeyDirection === 'column') {
      return isShift ? 'upArrow' : 'downArrow';
    }
    if (enterKeyDirection === 'row') {
      return isShift ? 'previous' : 'next';
    }

    return undefined;
  }

  private _handleEnterKeyEditingCell(event) {
    const d = Deferred();
    const { target } = event;
    const $cell = this._getCellElementFromTarget(target);
    const isRowEditMode = this._isRowEditMode();

    this._updateFocusedCellPosition($cell);

    if (isRowEditMode) {
      this._focusEditFormCell($cell);
      setTimeout(
        this._editingController.saveEditData.bind(this._editingController),
      );
      d.resolve();
    } else {
      // @ts-expect-error
      eventsEngine.trigger($(target), 'change');
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._closeEditCell().always(d.resolve);

      event.preventDefault();
    }
    return d;
  }

  /**
   * @extended
   */
  protected _escapeKeyHandler(eventArgs, isEditing): boolean {
    const $cell = this._getCellElementFromTarget(
      eventArgs.originalEvent.target,
    );
    if (isEditing) {
      this._updateFocusedCellPosition($cell);
      if (!this._isRowEditMode()) {
        if (this._editingController.getEditMode() === 'cell') {
          this._editingController.cancelEditData();
        } else {
          this._closeEditCell();
        }
      } else {
        this._focusEditFormCell($cell);
        this._editingController.cancelEditData();
        if (this._dataController.items().length === 0) {
          this._resetFocusedCell();
          this._editorFactory.loseFocus();
        }
      }
      eventArgs.originalEvent.preventDefault();

      return true;
    }

    const masterDetailCell = this.getMasterDetailCell($cell);
    if (masterDetailCell) {
      this._focusCell(masterDetailCell);
      return true;
    }

    return false;
  }

  private _ctrlFKeyHandler(eventArgs) {
    if (this.option('searchPanel.visible')) {
      // @ts-expect-error
      const searchTextEditor = this._headerPanel.getSearchTextEditor();
      if (searchTextEditor) {
        searchTextEditor.focus();
        eventArgs.originalEvent.preventDefault();
      }
    }
  }

  private _f2KeyHandler() {
    const isEditing = this._editingController.isEditing();
    const rowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView && this._focusedView.getRow(rowIndex);

    if (!isEditing && isDataRow($row)) {
      this._startEditing();
    }
  }

  private _navigateNextCell($event, keyCode) {
    const $cell = this._getNextCell(keyCode);
    const directionCode = this._getDirectionCodeByKey(keyCode);
    const isCellValid = $cell && this._isCellValid($cell);
    const result = isCellValid
      ? this._arrowKeysHandlerFocusCell($event, $cell, directionCode)
      : false;
    return result;
  }

  private _arrowKeysHandlerFocusCell($event, $nextCell, direction) {
    const isVerticalDirection = direction === 'prevRow' || direction === 'nextRow';

    const args = this._fireFocusChangingEvents(
      $event,
      $nextCell,
      isVerticalDirection,
      true,
    );

    $nextCell = args.$newCellElement;

    if (!args.cancel && this._isCellValid($nextCell)) {
      this._focus($nextCell, !args.isHighlighted);
      return true;
    }
    return false;
  }

  private _beginFastEditing(originalEvent, isDeleting?) {
    if (
      !this._isFastEditingAllowed()
      || originalEvent.altKey
      || originalEvent.ctrlKey
      || this._editingController.isEditing()
    ) {
      return false;
    }

    if (isDeleting) {
      this._startEditing(originalEvent, FAST_EDITING_DELETE_KEY);
    } else {
      const { key } = originalEvent;
      const keyCode = originalEvent.keyCode || originalEvent.which;
      const fastEditingKey = key || (keyCode && String.fromCharCode(keyCode));

      if (
        fastEditingKey
        && (fastEditingKey.length === 1
          || fastEditingKey === FAST_EDITING_DELETE_KEY)
      ) {
        this._startEditing(originalEvent, fastEditingKey);
      }
    }

    return true;
  }
  // #endregion Key_Handlers

  // #region Pointer_Event_Handler
  public _pointerEventHandler(e) {
    const event = e.event || e;
    let $target = $(event.currentTarget);
    const focusedViewElement = this._rowsView?.element();
    const $parent = $target.parent();
    const isInteractiveElement = $(event.target).is(
      INTERACTIVE_ELEMENTS_SELECTOR,
    );
    const isRevertButton = !!$(event.target).closest(`.${REVERT_BUTTON_CLASS}`)
      .length;
    const isExpandCommandCell = $target.hasClass(COMMAND_EXPAND_CLASS);

    if (!this._isEventInCurrentGrid(event)) {
      return;
    }

    if (
      !isRevertButton
      && (this._isCellValid($target, !isInteractiveElement) || isExpandCommandCell)
    ) {
      $target = this._isInsideEditForm($target) ? $(event.target) : $target;

      this._focusView();
      $(focusedViewElement).removeClass(FOCUS_STATE_CLASS);

      if ($parent.hasClass(FREESPACE_ROW_CLASS)) {
        this._updateFocusedCellPosition($target);
        this._applyTabIndexToElement(this._focusedView!.element());
        this._focusedView!.focus(true);
      } else if (!this.getMasterDetailCell($target)) {
        this._clickTargetCellHandler(event, $target);
      } else {
        this._updateFocusedCellPosition($target);
      }
    } else if ($target.is('td')) {
      this._resetFocusedCell();
    }
  }

  private _clickTargetCellHandler(event, $cell) {
    const column = this._getColumnByCellElement($cell);
    const isCellEditMode = this._isCellEditMode();

    this.setCellFocusType();

    const args = this._fireFocusChangingEvents(event, $cell, true);
    $cell = args.$newCellElement;
    if (!args.cancel) {
      if (args.resetFocusedRow) {
        this._focusController._resetFocusedRow();
        return;
      }

      if (args.rowIndexChanged) {
        $cell = this._getFocusedCell();
      }

      if (!args.isHighlighted && !isCellEditMode) {
        this.setRowFocusType();
      }

      this._updateFocusedCellPosition($cell);

      if (
        this._allowRowUpdating()
        && isCellEditMode
        && column
        && column.allowEditing
      ) {
        this._isNeedFocus = false;
        this._isHiddenFocus = false;
      } else {
        $cell = this._getFocusedCell();
        const $target = event
          && $(event.target).closest(`${NON_FOCUSABLE_ELEMENTS_SELECTOR}, td`);
        const skipFocusEvent = $target && $target.not($cell).is(NON_FOCUSABLE_ELEMENTS_SELECTOR);
        const isEditor = !!column && !column.command && $cell.hasClass(EDITOR_CELL_CLASS);
        const isDisabled = !isEditor && (!args.isHighlighted || skipFocusEvent);
        this._focus($cell, isDisabled, skipFocusEvent);
      }
    } else {
      this.setRowFocusType();
      this.setFocusedRowIndex(args.prevRowIndex);
      if (this._editingController.isEditing() && isCellEditMode) {
        this._closeEditCell();
      }
    }
  }

  private _allowRowUpdating() {
    const rowIndex = this.getVisibleRowIndex();
    const row = this._dataController.items()[rowIndex];

    return this._editingController.allowUpdating({ row }, 'click');
  }
  // #endregion Pointer_Event_Handler

  // #region Focusing
  public focus(element) {
    let activeElementSelector;
    const focusedRowEnabled = this.option('focusedRowEnabled');
    const isHighlighted = this._isCellElement($(element));

    if (!element) {
      activeElementSelector = '.dx-datagrid-rowsview .dx-row[tabindex]';
      if (!focusedRowEnabled) {
        activeElementSelector
          += ', .dx-datagrid-rowsview .dx-row > td[tabindex]';
      }
      element = this.component.$element().find(activeElementSelector).first();
    }

    element && this._focusElement($(element), isHighlighted);
  }

  private getFocusedView() {
    return this._focusedView;
  }

  public setupFocusedView() {
    if (this.isKeyboardEnabled() && !isDefined(this._focusedView)) {
      this._focusView();
    }
  }

  private _focusElement($element, isHighlighted) {
    const rowsViewElement = $(this._getRowsViewElement());
    const $focusedView = $element.closest(rowsViewElement);
    const isRowFocusType = this.isRowFocusType();
    let args: any = {};

    if (
      !$focusedView.length
      || (this._isCellElement($element) && !this._isCellValid($element))
    ) {
      return;
    }

    this._focusView();
    this._isNeedFocus = true;
    this._isNeedScroll = true;

    if (this._isCellElement($element) || isGroupRow($element)) {
      this.setCellFocusType();
      args = this._fireFocusChangingEvents(
        null,
        $element,
        true,
        isHighlighted,
      );
      $element = args.$newCellElement;
      if (isRowFocusType && !args.isHighlighted) {
        this.setRowFocusType();
      }
    }

    if (!args.cancel) {
      this._focus($element, !args.isHighlighted);
      this._focusInteractiveElement($element);
    }
  }

  private _getFocusedViewByElement($element) {
    const view = this.getFocusedView();
    const $view = view && $(view.element());
    return $element && $element.closest($view).length !== 0;
  }

  private _focusView() {
    this._focusedView = this._rowsView;
  }

  private _resetFocusedView() {
    this.setRowFocusType();
    this._focusedView = null;
  }

  private _focusInteractiveElement($cell, isLast?) {
    if (!$cell) return;

    const $focusedElement = this._getInteractiveElement($cell, isLast);

    /// #DEBUG
    this._testInteractiveElement = $focusedElement;
    /// #ENDDEBUG

    gridCoreUtils.focusAndSelectElement(this, $focusedElement);
  }

  public _focus($cell, disableFocus?, skipFocusEvent?) {
    const $row = $cell && !$cell.hasClass(ROW_CLASS)
      ? $cell.closest(`.${ROW_CLASS}`)
      : $cell;

    if ($row && isNotFocusedRow($row)) {
      return;
    }

    const focusedView = this._focusedView;
    const $focusViewElement = focusedView && focusedView.element();
    let $focusElement;

    this._isHiddenFocus = disableFocus;

    const isRowFocus = isGroupRow($row) || isGroupFooterRow($row) || this.isRowFocusType();

    if (isRowFocus) {
      $focusElement = $row;
      if (focusedView) {
        this.setFocusedRowIndex(this._getRowIndex($row));
      }
    } else if (this._isCellElement($cell)) {
      $focusElement = $cell;
      this._updateFocusedCellPosition($cell);
    }
    if ($focusElement) {
      if ($focusViewElement) {
        $focusViewElement
          .find('.dx-row[tabindex], .dx-row > td[tabindex]')
          .filter((i, node) => gridCoreUtils.isElementInCurrentGrid(this, $(node)))
          .not($focusElement)
          .removeClass(CELL_FOCUS_DISABLED_CLASS)
          .removeClass(FOCUSED_CLASS)
          .removeAttr('tabindex');
      }

      eventsEngine.one($focusElement, 'blur', (e) => {
        if (e.relatedTarget) {
          $focusElement
            .removeClass(CELL_FOCUS_DISABLED_CLASS)
            .removeClass(FOCUSED_CLASS);
        }
      });
      if (!skipFocusEvent) {
        this._applyTabIndexToElement($focusElement);
        // @ts-expect-error
        eventsEngine.trigger($focusElement, 'focus');
      }
      if (disableFocus) {
        $focusElement.addClass(CELL_FOCUS_DISABLED_CLASS);
        if (isRowFocus) {
          $cell.addClass(CELL_FOCUS_DISABLED_CLASS);
        }
      } else {
        this._editorFactory.focus($focusElement);
      }
    }
  }

  public _updateFocus(isRenderView?) {
    this._updateFocusTimeout = setTimeout(() => {
      if (this._needFocusEditingCell()) {
        this._editingController._focusEditingCell();
        return;
      }

      let $cell = this._getFocusedCell();
      const isEditing = this._editingController.isEditing();

      if (!this.getMasterDetailCell($cell) || this._isRowEditMode()) {
        if (this._hasSkipRow($cell.parent())) {
          const direction = this._focusedCellPosition && this._focusedCellPosition.rowIndex > 0
            ? 'upArrow'
            : 'downArrow';
          $cell = this._getNextCell(direction);
        }
        if (isElementDefined($cell)) {
          if (
            $cell.is('td')
            || $cell.hasClass(this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS))
          ) {
            const isCommandCell = $cell.is(COMMAND_CELL_SELECTOR);
            const $focusedElementInsideCell = $cell.find(':focus');
            const isFocusedElementDefined = isElementDefined(
              $focusedElementInsideCell,
            );
            const column = this._getColumnByCellElement($cell);
            if (
              (isRenderView || !isCommandCell)
              && this._editorFactory.focus()
            ) {
              if (isCommandCell && isFocusedElementDefined) {
                gridCoreUtils.focusAndSelectElement(
                  this,
                  $focusedElementInsideCell,
                );
                return;
              }
              !isFocusedElementDefined && this._focus($cell);
            } else if (
              !isFocusedElementDefined
              && (this._isNeedFocus || this._isHiddenFocus)
            ) {
              this._focus($cell, this._isHiddenFocus);
            }
            if (isEditing && !column?.showEditorAlways) {
              this._focusInteractiveElement.bind(this)($cell);
            }
          } else {
            // @ts-expect-error
            eventsEngine.trigger($cell, 'focus');
          }
        }
      }
    });
  }

  private _getColumnByCellElement($cell) {
    const cellIndex = this._rowsView.getCellIndex($cell);
    const columnIndex = cellIndex + this._columnsController.getColumnIndexOffset();
    return this._columnsController.getVisibleColumns(null, true)[columnIndex];
  }

  private _needFocusEditingCell() {
    const isCellEditMode = this._editingController.getEditMode() === EDIT_MODE_CELL;
    const isBatchEditMode = this._editingController.getEditMode() === EDIT_MODE_BATCH;

    const cellEditModeHasChanges = isCellEditMode && this._editingController.hasChanges();
    const isNewRowBatchEditMode = isBatchEditMode && this._editingController.isNewRowInEditMode();
    const $cell = this._getFocusedCell();

    return (
      $cell.children().length === 0
      || $cell.find(FOCUSABLE_ELEMENT_SELECTOR).length > 0
    ) && (cellEditModeHasChanges || isNewRowBatchEditMode);
  }

  public _getFocusedCell() {
    return $(this._getCell(this._focusedCellPosition));
  }

  private _updateFocusedCellPositionByTarget(target) {
    const elementType = this._getElementType(target);
    if (
      elementType === 'row'
      && isDefined(this._focusedCellPosition?.columnIndex)
    ) {
      const $row = $(target);
      this._focusedView
        && isGroupRow($row)
        && this.setFocusedRowIndex(this._getRowIndex($row));
    } else {
      this._updateFocusedCellPosition(this._getCellElementFromTarget(target));
    }
  }

  /**
   * @extended: focus
   */
  protected _updateFocusedCellPosition($cell, direction?) {
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

  private _getFocusedColumnIndexOffset(columnIndex) {
    let offset = 0;
    const column = this._columnsController.getVisibleColumns()[columnIndex];
    if (column && column.fixed) {
      offset = this._getFixedColumnIndexOffset(column);
    } else if (columnIndex >= 0) {
      offset = this._columnsController.getColumnIndexOffset();
    }
    return offset;
  }

  private _getFixedColumnIndexOffset(column) {
    const offset = isFixedColumnIndexOffsetRequired(this, column)
      ? this._getVisibleColumnCount()
        - this._columnsController.getVisibleColumns().length
      : 0;
    return offset;
  }

  private _getCellPosition($cell, direction?): {
    rowIndex: number;
    columnIndex: number;
  } | undefined {
    let columnIndex;
    const $row = isElementDefined($cell) && $cell.closest('tr');

    if (isElementDefined($row)) {
      const rowIndex = this._getRowIndex($row);

      columnIndex = this._rowsView.getCellIndex($cell, rowIndex);
      columnIndex += this._getFocusedColumnIndexOffset(columnIndex);

      if (direction) {
        columnIndex = direction === 'previous' ? columnIndex - 1 : columnIndex + 1;
        columnIndex = this._applyColumnIndexBoundaries(columnIndex);
      }

      return { rowIndex, columnIndex };
    }

    return undefined;
  }

  private _focusCell($cell, isDisabled?) {
    if (this._isCellValid($cell)) {
      this._focus($cell, isDisabled);
      return true;
    }

    return undefined;
  }

  private _focusEditFormCell($cell) {
    if ($cell.hasClass(MASTER_DETAIL_CELL_CLASS)) {
      this._editorFactory.focus($cell, true);
    }
  }

  public _resetFocusedCell(preventScroll?) {
    const $cell = this._getFocusedCell();

    isElementDefined($cell) && $cell.removeAttr('tabindex').removeClass(CELL_FOCUS_DISABLED_CLASS);
    this._isNeedFocus = false;
    this._isNeedScroll = false;
    this._focusedCellPosition = {};
    clearTimeout(this._updateFocusTimeout);
    this._focusedView?.renderFocusState({ preventScroll });
  }

  private restoreFocusableElement(rowIndex, $event) {
    const that = this;
    let args;
    let $rowElement;
    const isUpArrow = isDefined(rowIndex);
    const $rowsViewElement = this._rowsView.element();
    const { columnIndex } = that._focusedCellPosition;
    const rowIndexOffset = that._dataController.getRowIndexOffset();

    rowIndex = isUpArrow
      ? rowIndex
      : this._rowsView.getTopVisibleItemIndex() + rowIndexOffset;

    if (!isUpArrow) {
      that._editorFactory.loseFocus();
      that._applyTabIndexToElement($rowsViewElement);
      // @ts-expect-error
      eventsEngine.trigger($rowsViewElement, 'focus');
    } else {
      $rowElement = this._rowsView.getRow(rowIndex - rowIndexOffset);
      args = that._fireFocusedRowChanging($event, $rowElement);

      if (!args.cancel && args.rowIndexChanged) {
        rowIndex = args.newRowIndex;
      }
    }

    if (!isUpArrow || !args.cancel) {
      that.setFocusedCellPosition(rowIndex, columnIndex);
    }

    isUpArrow && that._updateFocus();
  }

  // #endregion Focusing
  // #region Cell_Position
  private _getNewPositionByCode(cellPosition, elementType, code) {
    let { columnIndex } = cellPosition;
    let { rowIndex } = cellPosition;
    let visibleColumnsCount;

    if (cellPosition.rowIndex === undefined && code === 'next') {
      return { columnIndex: 0, rowIndex: 0 };
    }

    // eslint-disable-next-line default-case
    switch (code) {
      case 'nextInRow':
      case 'next':
        visibleColumnsCount = this._getVisibleColumnCount();
        if (
          columnIndex < visibleColumnsCount - 1
          && elementType !== 'row'
          && this._hasValidCellAfterPosition({ columnIndex, rowIndex })
        ) {
          columnIndex++;
        } else if (!this._isLastRow(rowIndex) && code === 'next') {
          columnIndex = 0;
          rowIndex++;
        }
        break;
      case 'previousInRow':
      case 'previous':
        if (
          columnIndex > 0
          && elementType !== 'row'
          && this._hasValidCellBeforePosition({ columnIndex, rowIndex })
        ) {
          columnIndex--;
        } else if (rowIndex > 0 && code === 'previous') {
          rowIndex--;
          visibleColumnsCount = this._getVisibleColumnCount();
          columnIndex = visibleColumnsCount - 1;
        }
        break;
      case 'upArrow':
        rowIndex = rowIndex > 0 ? rowIndex - 1 : rowIndex;
        break;
      case 'downArrow':
        rowIndex = !this._isLastRow(rowIndex) ? rowIndex + 1 : rowIndex;
        break;
    }

    return { columnIndex, rowIndex };
  }

  public setFocusedCellPosition(rowIndex, columnIndex) {
    this.setFocusedRowIndex(rowIndex);
    this.setFocusedColumnIndex(columnIndex);
  }

  /**
   * @extended: focus
   */
  public setFocusedRowIndex(rowIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }
    this._focusedCellPosition.rowIndex = rowIndex;
  }

  /**
   * @extended: focus
   */
  protected setFocusedColumnIndex(columnIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }
    this._focusedCellPosition.columnIndex = columnIndex;
  }

  private getRowIndex() {
    return this._focusedCellPosition ? this._focusedCellPosition.rowIndex : -1;
  }

  public getColumnIndex() {
    return this._focusedCellPosition
      ? this._focusedCellPosition.columnIndex
      : -1;
  }

  /**
   * @extended: TreeList's keyboard navigation
   */
  public getVisibleRowIndex() {
    const rowIndex = this._focusedCellPosition?.rowIndex;
    return !isDefined(rowIndex) || rowIndex < 0
      ? -1
      : rowIndex - this._dataController.getRowIndexOffset();
  }

  public getVisibleColumnIndex() {
    const columnIndex = this._focusedCellPosition?.columnIndex;
    return !isDefined(columnIndex)
      ? -1
      : columnIndex - this._columnsController.getColumnIndexOffset();
  }

  private _applyColumnIndexBoundaries(columnIndex) {
    const visibleColumnsCount = this._getVisibleColumnCount();

    if (columnIndex < 0) {
      columnIndex = 0;
    } else if (columnIndex >= visibleColumnsCount) {
      columnIndex = visibleColumnsCount - 1;
    }

    return columnIndex;
  }

  private _isCellByPositionValid(cellPosition) {
    const $cell = $(this._getCell(cellPosition));
    return this._isCellValid($cell);
  }

  private _isLastRow(rowIndex: number): boolean {
    const dataController = this._dataController;

    if (this._isVirtualRowRender()) {
      return rowIndex >= (dataController as any).getMaxRowIndex();
    }

    const lastVisibleIndex = Math.max(
      ...dataController.items()
        .map((item, index) => (item.visible !== false ? index : -1)),
    );

    return rowIndex === lastVisibleIndex;
  }

  protected _isFirstValidCell(cellPosition) {
    let isFirstValidCell = false;

    if (cellPosition.rowIndex === 0 && cellPosition.columnIndex >= 0) {
      isFirstValidCell = isFirstValidCell || !this._hasValidCellBeforePosition(cellPosition);
    }

    return isFirstValidCell;
  }

  private _hasValidCellBeforePosition(cellPosition) {
    let { columnIndex } = cellPosition;
    let hasValidCells = false;

    while (columnIndex > 0 && !hasValidCells) {
      const checkingPosition = {
        columnIndex: --columnIndex,
        rowIndex: cellPosition.rowIndex,
      };

      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }
    return hasValidCells;
  }

  private _hasValidCellAfterPosition(cellPosition) {
    let { columnIndex } = cellPosition;
    let hasValidCells = false;
    const visibleColumnCount = this._getVisibleColumnCount();

    while (columnIndex < visibleColumnCount - 1 && !hasValidCells) {
      const checkingPosition = {
        columnIndex: ++columnIndex,
        rowIndex: cellPosition.rowIndex,
      };

      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }
    return hasValidCells;
  }

  protected _isLastValidCell(cellPosition) {
    const nextColumnIndex = cellPosition.columnIndex >= 0 ? cellPosition.columnIndex + 1 : 0;
    const { rowIndex } = cellPosition;
    const checkingPosition = {
      columnIndex: nextColumnIndex,
      rowIndex,
    };
    const visibleRows = this._dataController.getVisibleRows();
    const row = visibleRows && visibleRows[rowIndex];
    const isLastRow = this._isLastRow(rowIndex);

    if (!isLastRow) {
      return false;
    }

    const isFullRowFocus = row?.rowType === 'group' || row?.rowType === 'groupFooter';
    if (isFullRowFocus && cellPosition.columnIndex > 0) {
      return true;
    }

    if (cellPosition.columnIndex === this._getVisibleColumnCount() - 1) {
      return true;
    }

    if (this._isCellByPositionValid(checkingPosition)) {
      return false;
    }

    return this._isLastValidCell(checkingPosition);
  }

  // #endregion Cell_Position
  // #region DOM_Manipulation
  /**
   * @extended: adaptivity
   */
  public _isCellValid($cell, isClick?) {
    if (isElementDefined($cell)) {
      const $row = $cell.parent();
      const columnIndex = this._rowsView.getCellIndex($cell) + this._columnsController.getColumnIndexOffset();
      const column = this._getColumnByCellElement($cell);
      const visibleColumnCount = this._getVisibleColumnCount();
      const editingController = this._editingController;
      const isMasterDetailRow = isDetailRow($row);
      const isShowWhenGrouped = column && column.showWhenGrouped;
      const isDataCell = column && !$cell.hasClass(COMMAND_EXPAND_CLASS) && isDataRow($row);
      const isValidGroupSpaceColumn = function () {
        // eslint-disable-next-line radix
        return (
          (!isMasterDetailRow
            && column
            && (!isDefined(column.groupIndex)
              || (isShowWhenGrouped && isDataCell)))
          || parseInt($cell.attr('colspan'), 10) > 1
        );
      };

      const isDragCell = GridCoreKeyboardNavigationDom.isDragCell($cell);
      if (isDragCell) {
        return false;
      }

      if (this.getMasterDetailCell($cell)) {
        return true;
      }

      if (visibleColumnCount > columnIndex && isValidGroupSpaceColumn()) {
        const rowItems = this._dataController.items();
        const visibleRowIndex = this._rowsView.getRowIndex($row);
        const row = rowItems[visibleRowIndex];
        const isCellEditing = editingController
          && this._isCellEditMode()
          && editingController.isEditing();
        const isRowEditingInCurrentRow = editingController && editingController.isEditRow(visibleRowIndex);
        const isEditing = isRowEditingInCurrentRow || isCellEditing;

        if (column.command) {
          if (this._isLegacyNavigation()) {
            return !isEditing && column.command === 'expand';
          }
          if (isCellEditing) {
            return false;
          }
          if (isRowEditingInCurrentRow) {
            return column.command !== 'select';
          }
          return !isEditing;
        }

        if (isCellEditing && row && row.rowType !== 'data') {
          return false;
        }

        return !isEditing || column.allowEditing || isClick;
      }
    }
  }

  public getFirstValidCellInRow($row, columnIndex?) {
    const that = this;
    const $cells = $row.find('> td');
    let $cell;
    let $result;

    columnIndex = columnIndex || 0;

    for (let i = columnIndex; i < $cells.length; ++i) {
      $cell = $cells.eq(i);
      if (that._isCellValid($cell)) {
        $result = $cell;
        break;
      }
    }

    return $result;
  }

  private _getNextCell(keyCode, elementType?, cellPosition?) {
    const focusedCellPosition = cellPosition || this._focusedCellPosition;
    const isRowFocusType = this.isRowFocusType();
    const includeCommandCells = isRowFocusType || ['next', 'previous'].includes(keyCode);
    let $cell;
    let $row;

    if (this._focusedView && focusedCellPosition) {
      const newFocusedCellPosition = this._getNewPositionByCode(
        focusedCellPosition,
        elementType,
        keyCode,
      );
      $cell = $(this._getCell(newFocusedCellPosition));
      const isLastCellOnDirection = keyCode === 'previous'
        ? this._isFirstValidCell(newFocusedCellPosition)
        : this._isLastValidCell(newFocusedCellPosition);

      if (
        isElementDefined($cell)
        && !this._isCellValid($cell)
        && this._isCellInRow(newFocusedCellPosition, includeCommandCells)
        && !isLastCellOnDirection
      ) {
        if (isRowFocusType) {
          $cell = this.getFirstValidCellInRow(
            $cell.parent(),
            newFocusedCellPosition.columnIndex,
          );
        } else {
          $cell = this._getNextCell(keyCode, 'cell', newFocusedCellPosition);
        }
      }

      $row = isElementDefined($cell) && $cell.parent();
      if (this._hasSkipRow($row)) {
        const rowIndex = this._getRowIndex($row);
        if (!this._isLastRow(rowIndex)) {
          $cell = this._getNextCell(keyCode, 'row', {
            columnIndex: focusedCellPosition.columnIndex,
            rowIndex,
          });
        } else {
          return null;
        }
      }

      return isElementDefined($cell) ? $cell : null;
    }
    return null;
  }

  // #endregion DOM_Manipulation
  // #region Editing
  private _startEditing(eventArgs?, fastEditingKey?) {
    const focusedCellPosition = this._focusedCellPosition;
    const visibleRowIndex = this.getVisibleRowIndex();
    const visibleColumnIndex = this.getVisibleColumnIndex();
    const row = this._dataController.items()[visibleRowIndex];
    const column = this._columnsController.getVisibleColumns()[visibleColumnIndex];

    if (this._isAllowEditing(row, column)) {
      if (this._isRowEditMode()) {
        this._editingController.editRow(visibleRowIndex);
      } else if (focusedCellPosition) {
        this._startEditCell(eventArgs, fastEditingKey);
      }
    }
  }

  public _isAllowEditing(row, column) {
    return (
      this._editingController.allowUpdating({ row })
      && column
      && column.allowEditing
    );
  }

  private _editFocusedCell() {
    const rowIndex = this.getVisibleRowIndex();
    const colIndex = this.getVisibleColumnIndex();

    return this._editingController.editCell(rowIndex, colIndex);
  }

  private _startEditCell(eventArgs, fastEditingKey) {
    this._fastEditingStarted = isDefined(fastEditingKey);
    const editResult = this._editFocusedCell();
    const isEditResultDeferred = isDeferred(editResult);
    const isFastEditingStarted = this._isFastEditingStarted();

    if (!isFastEditingStarted || (!isEditResultDeferred && !editResult)) {
      return;
    }

    const editorValue = isEditResultDeferred && fastEditingKey === FAST_EDITING_DELETE_KEY
      ? ''
      : fastEditingKey;
    const editResultDeferred = isEditResultDeferred ? editResult : Deferred().resolve();
    const waitTemplatesDeferred = this._rowsView.waitAsyncTemplates(true);

    // NOTE T1158801: wait async templates before handle cell editing.
    when(editResultDeferred, waitTemplatesDeferred)
      .done(() => { this._editingCellHandler(eventArgs, editorValue); });
  }

  private _editingCellHandler(eventArgs, editorValue) {
    const $input = this._getFocusedCell()
      .find(INTERACTIVE_ELEMENTS_SELECTOR)
      .eq(0);
    const $inputElement = $input.get(0);

    if (!$inputElement) {
      return;
    }

    const keyDownEvent = createEvent(eventArgs, {
      type: 'keydown',
      target: $inputElement,
    });
    const keyPressEvent = createEvent(eventArgs, {
      type: 'keypress',
      target: $inputElement,
    });
    const inputEvent = createEvent(eventArgs, {
      type: 'input',
      target: $inputElement,
    });

    if (inputEvent.originalEvent) {
      inputEvent.originalEvent = createEvent(inputEvent.originalEvent, {
        data: editorValue,
      }); // T1116105
    }

    ($inputElement as HTMLInputElement).select?.();
    // @ts-expect-error
    eventsEngine.trigger($input, keyDownEvent);

    if (!keyDownEvent.isDefaultPrevented()) {
      // @ts-expect-error
      eventsEngine.trigger($input, keyPressEvent);
      if (!keyPressEvent.isDefaultPrevented()) {
        const timeout = browser.mozilla ? 25 : 0; // T882996
        setTimeout(() => {
          const inputValue = this._getKeyPressInputValue($input, editorValue);
          $input.val(inputValue);

          const $widgetContainer = $input.closest(`.${WIDGET_CLASS}`);
          eventsEngine.off($widgetContainer, 'focusout'); // for NumberBox to save entered symbol
          eventsEngine.one($widgetContainer, 'focusout', () => {
            // @ts-expect-error
            eventsEngine.trigger($input, 'change');
          });
          // @ts-expect-error
          eventsEngine.trigger($input, inputEvent);
        }, timeout);
      }
    }
  }

  /*
  * NOTE: See the T1203026 ticket.
  * The method is created for cases where the editor in the column is formatted according to the 'decimal' type.
  * After the native event 'keydown', the '-' sign is formatted by the editor into '-0'.
  * Subsequent assignment of '-' to the editor's value is treated as a text change, causing the inversion of the value from '-0' to '0'.
  * To prevent this inversion, it is necessary to assign to the value the same content as in the editor: '-0'.
  */
  private _getKeyPressInputValue(
    $input: dxElementWrapper,
    editorValue: any,
  ): any {
    const inputCurrentValue: any = $input.val();

    return editorValue === '-' && inputCurrentValue === '-0'
      ? '-0'
      : editorValue;
  }

  // #endregion Editing
  // #region Events
  private _fireFocusChangingEvents($event, $cell, fireRowEvent, isHighlighted?) {
    let args: any = {};
    const cellPosition: Partial<ReturnType<(KeyboardNavigationController['_getCellPosition'])>> = this._getCellPosition($cell) ?? {};

    if (this.isCellFocusType()) {
      args = this._fireFocusedCellChanging($event, $cell, isHighlighted);
      if (!args.cancel) {
        cellPosition.columnIndex = args.newColumnIndex;
        cellPosition.rowIndex = args.newRowIndex;
        isHighlighted = args.isHighlighted;
        $cell = $(this._getCell(cellPosition));
      }
    }

    if (!args.cancel && fireRowEvent && $cell) {
      args = this._fireFocusedRowChanging($event, $cell.parent());
      if (!args.cancel) {
        cellPosition.rowIndex = args.newRowIndex;
        args.isHighlighted = isHighlighted;
      }
    }

    args.$newCellElement = $(this._getCell(cellPosition));
    if (!args.$newCellElement.length) {
      args.$newCellElement = $cell;
    }

    return args;
  }

  private _fireFocusedCellChanging(
    $event: Event,
    $cellElement: dxElementWrapper,
    isHighlighted: boolean,
  ) {
    const prevColumnIndex = this.option('focusedColumnIndex');
    const prevRowIndex = this.option('focusedRowIndex');
    const cellPosition = this._getCellPosition($cellElement);
    const columnIndex = cellPosition ? cellPosition.columnIndex : -1;
    const rowIndex = cellPosition ? cellPosition.rowIndex : -1;
    const visibleRows = this._dataController.getVisibleRows();
    const visibleColumns = this._columnsController.getVisibleColumns();

    const args: any = {
      cellElement: $cellElement,
      prevColumnIndex,
      prevRowIndex,
      newColumnIndex: columnIndex,
      newRowIndex: rowIndex,
      rows: visibleRows,
      columns: visibleColumns,
      event: $event,
      isHighlighted: isHighlighted || false,
      cancel: false,
    };

    this._canceledCellPosition = null;

    this.executeAction('onFocusedCellChanging', args);
    if (args.newColumnIndex !== columnIndex || args.newRowIndex !== rowIndex) {
      args.$newCellElement = $(
        this._getCell({
          columnIndex: args.newColumnIndex,
          rowIndex: args.newRowIndex,
        }),
      );
    }

    if (args.cancel) {
      this._canceledCellPosition = { rowIndex, columnIndex };
    }

    return args;
  }

  public _fireFocusedCellChanged($cell: dxElementWrapper | undefined): void {
    const columnIndex = this._rowsView.getCellIndex($cell);
    const rowOptions: any = $cell?.parent().data('options');
    const focusedRowKey = rowOptions?.key;

    this._memoFireFocusedCellChanged(focusedRowKey, columnIndex);
  }

  private _memoFireFocusedCellChanged(
    rowKey: RowKey,
    columnIndex: number,
  ): void {
    const $cell = this._getFocusedCell();
    const rowIndex = this._getRowIndex($cell?.parent());
    const localRowIndex = Math.min(
      rowIndex - this._dataController.getRowIndexOffset(),
      this._dataController.items().length - 1,
    );
    const isEditingCell = this._editingController.isEditCell(
      localRowIndex,
      columnIndex,
    );

    if (isEditingCell) {
      return;
    }

    const row = this._dataController.items()[localRowIndex];
    const column = this._columnsController.getVisibleColumns()[columnIndex];
    this.executeAction('onFocusedCellChanged', {
      cellElement: ($cell ? getPublicElement($cell) : undefined)!,
      columnIndex,
      rowIndex,
      row: row as any,
      column,
    });
  }

  private _fireFocusedRowChanging(eventArgs: any, $newFocusedRow: dxElementWrapper) {
    const newRowIndex = this._getRowIndex($newFocusedRow);
    const prevFocusedRowIndex = this.option('focusedRowIndex');
    const loadingOperationTypes = this._dataController.loadingOperationTypes();

    const args: any = {
      rowElement: $newFocusedRow,
      prevRowIndex: prevFocusedRowIndex,
      newRowIndex,
      event: eventArgs,
      rows: this._dataController.getVisibleRows(),
      cancel: false,
    };

    const loadingOperations = loadingOperationTypes.sorting || loadingOperationTypes.grouping || loadingOperationTypes.filtering || loadingOperationTypes.paging;
    if (
      !this._dataController
      || (this._dataController.isLoading() && loadingOperations)
    ) {
      args.cancel = true;
      return args;
    }

    if (this.option('focusedRowEnabled')) {
      this.executeAction('onFocusedRowChanging', args);
      if (!args.cancel && args.newRowIndex !== newRowIndex) {
        args.resetFocusedRow = args.newRowIndex < 0;
        if (!args.resetFocusedRow) {
          this.setFocusedRowIndex(args.newRowIndex);
        }
        args.rowIndexChanged = true;
      }
    }

    return args;
  }

  public _fireFocusedRowChanged(): void {
    const focusedRowEnabled = this.option('focusedRowEnabled');
    const focusedRowKey = this.option('focusedRowKey');
    const focusedRowIndex = this._focusController?.getFocusedRowIndexByKey(focusedRowKey);

    if (!focusedRowEnabled || (isDefined(focusedRowKey) && focusedRowIndex < 0)) {
      return;
    }

    this._memoFireFocusedRowChanged(focusedRowKey, focusedRowIndex);
  }

  private _memoFireFocusedRowChanged(focusedRowKey: RowKey, focusedRowIndex: number): void {
    const localRowIndex = focusedRowIndex - this._dataController.getRowIndexOffset();

    this.executeAction('onFocusedRowChanged', {
      rowElement: focusedRowIndex < 0
        ? undefined
        : this._rowsView.getRowElement(localRowIndex),
      rowIndex: focusedRowIndex,
      row: focusedRowIndex < 0
        ? undefined
        : this._dataController.getVisibleRows()[localRowIndex] as any,
    });
  }

  // #endregion Events
  private _isEventInCurrentGrid(event) {
    return gridCoreUtils.isElementInCurrentGrid(this, $(event.target));
  }

  private _isRowEditMode() {
    const editMode = this._editingController.getEditMode();
    return editMode === EDIT_MODE_ROW || editMode === EDIT_MODE_FORM;
  }

  private _isCellEditMode() {
    const editMode = this._editingController.getEditMode();
    return editMode === EDIT_MODE_CELL || editMode === EDIT_MODE_BATCH;
  }

  private _isFastEditingAllowed() {
    return (
      this._isCellEditMode() && this.option('keyboardNavigation.editOnKeyPress')
    );
  }

  private _getInteractiveElement($cell, isLast) {
    const $focusedElement = $cell
      .find(INTERACTIVE_ELEMENTS_SELECTOR)
      .filter(':visible');

    return isLast ? $focusedElement.last() : $focusedElement.first();
  }

  public _applyTabIndexToElement($element) {
    const tabIndex = this.option('tabIndex') ?? 0;

    $element.attr('tabindex', tabIndex);
  }

  private _getCell(cellPosition) {
    if (this._focusedView && cellPosition) {
      const rowIndexOffset = this._dataController.getRowIndexOffset();
      const column = this._columnsController.getVisibleColumns(null, true)[
        cellPosition.columnIndex
      ];
      const columnIndexOffset = column && column.fixed
        ? this._getFixedColumnIndexOffset(column)
        : this._columnsController.getColumnIndexOffset();
      const rowIndex = cellPosition.rowIndex >= 0
        ? cellPosition.rowIndex - rowIndexOffset
        : -1;
      const columnIndex = cellPosition.columnIndex >= 0
        ? cellPosition.columnIndex - columnIndexOffset
        : -1;

      return this._focusedView.getCell({
        rowIndex,
        columnIndex,
      });
    }
  }

  private _getRowIndex($row) {
    let rowIndex = this._rowsView.getRowIndex($row);

    if (rowIndex >= 0) {
      rowIndex += this._dataController.getRowIndexOffset();
    }

    return rowIndex;
  }

  private _hasSkipRow($row) {
    const row = $row && $row.get(0);
    return row && row.style.display === 'none';
  }

  private _allowEditingOnEnterKey() {
    return this.option('keyboardNavigation.enterKeyAction') === 'startEdit';
  }

  private _isLegacyNavigation() {
    return this.option('useLegacyKeyboardNavigation');
  }

  /**
   * @extended: TreeList's keyboard_navigation
   */
  protected _getDirectionCodeByKey(key) {
    let directionCode;

    // eslint-disable-next-line default-case
    switch (key) {
      case 'upArrow':
        directionCode = 'prevRow';
        break;
      case 'downArrow':
        directionCode = 'nextRow';
        break;
      case 'leftArrow':
        directionCode = this.option('rtlEnabled')
          ? 'nextInRow'
          : 'previousInRow';
        break;
      case 'rightArrow':
        directionCode = this.option('rtlEnabled')
          ? 'previousInRow'
          : 'nextInRow';
        break;
    }

    return directionCode;
  }

  public _isVirtualScrolling() {
    const scrollingMode = this.option('scrolling.mode');
    return scrollingMode === 'virtual' || scrollingMode === 'infinite';
  }

  private _isVirtualRowRender() {
    return (
      this._isVirtualScrolling() || gridCoreUtils.isVirtualRowRendering(this)
    );
  }

  private _isVirtualColumnRender() {
    return this.option('scrolling.columnRenderingMode') === 'virtual';
  }

  private _scrollBy(left, top, rowIndex?, $event?) {
    const that = this;
    const scrollable = this._rowsView.getScrollable();

    if (that._focusedCellPosition) {
      const scrollHandler = function () {
        scrollable.off('scroll', scrollHandler);
        setTimeout(that.restoreFocusableElement.bind(that, rowIndex, $event));
      };
      scrollable.on('scroll', scrollHandler);
    }
    return scrollable.scrollBy({ left, top });
  }

  protected _isInsideEditForm(element) {
    const $editForm = $(element).closest(
      `.${this.addWidgetPrefix(EDIT_FORM_CLASS)}`,
    );

    return $editForm.length && this.elementIsInsideGrid($editForm);
  }

  public getMasterDetailCell(element): dxElementWrapper | null {
    const $masterDetailCell = $(element).closest(
      `.${MASTER_DETAIL_CELL_CLASS}`,
    );

    if ($masterDetailCell.length && this.elementIsInsideGrid($masterDetailCell)) {
      return $masterDetailCell;
    }

    return null;
  }

  /**
   * @extended: adaptivity
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _processNextCellInMasterDetail($nextCell, _$cell) {
    if (!this._isInsideEditForm($nextCell) && $nextCell) {
      this._applyTabIndexToElement($nextCell);
    }
  }

  private _handleTabKeyOnMasterDetailCell(target, direction) {
    if (this.getMasterDetailCell(target)) {
      this._updateFocusedCellPosition($(target), direction);

      const $nextCell = this._getNextCell(direction, 'row');
      this._processNextCellInMasterDetail($nextCell, $(target));
      return true;
    }

    return false;
  }

  public _getElementType(target) {
    return $(target).is('tr') ? 'row' : 'cell';
  }

  public _isFastEditingStarted() {
    return this._isFastEditingAllowed() && this._fastEditingStarted;
  }

  private _getVisibleColumnCount() {
    return this._columnsController.getVisibleColumns(null, true).length;
  }

  private _isCellInRow(cellPosition, includeCommandCells) {
    const { columnIndex } = cellPosition;
    const visibleColumnsCount = this._getVisibleColumnCount();

    return includeCommandCells
      ? columnIndex >= 0 && columnIndex <= visibleColumnsCount - 1
      : columnIndex > 0 && columnIndex < visibleColumnsCount - 1;
  }

  /**
   * @extended: adaptivity
   */
  public _isCellElement($element) {
    return $element.length && $element[0].tagName === 'TD';
  }

  public _getCellElementFromTarget(target) {
    const elementType = this._getElementType(target);
    const $targetElement = $(target);
    let $cell;
    if (elementType === 'cell') {
      $cell = $targetElement.closest(`.${ROW_CLASS} > td`);
    } else {
      $cell = $targetElement.children().not(`.${COMMAND_EXPAND_CLASS}`).first();
    }
    return $cell;
  }

  private _getRowsViewElement() {
    return this._rowsView?.element();
  }

  public isKeyboardEnabled() {
    return this.option('keyboardNavigation.enabled');
  }

  public _processCanceledEditCellPosition(rowIndex, columnIndex) {
    if (this._canceledCellPosition) {
      const isCanceled = this._canceledCellPosition.rowIndex === rowIndex
        && this._canceledCellPosition.columnIndex === columnIndex;
      this._canceledCellPosition = null;
      return isCanceled;
    }

    return undefined;
  }

  public updateFocusedRowIndex() {
    const dataController = this._dataController;
    const visibleRowIndex = this.getVisibleRowIndex();
    const visibleItems = dataController.items();
    const lastVisibleIndex = visibleItems.length ? visibleItems.length - 1 : -1;
    const rowIndexOffset = dataController.getRowIndexOffset();

    if (lastVisibleIndex >= 0 && visibleRowIndex > lastVisibleIndex) {
      this.setFocusedRowIndex(lastVisibleIndex + rowIndexOffset);
    }
  }
}

const rowsView = (Base: ModuleType<RowsView>) => class RowsViewKeyboardExtender extends Base {
  protected _rowClick(e) {
    const editRowIndex = this._editingController.getEditRowIndex();
    const isKeyboardEnabled = this._keyboardNavigationController.isKeyboardEnabled();

    if (editRowIndex === e.rowIndex) {
      this._keyboardNavigationController.setCellFocusType();
    }

    const needTriggerPointerEventHandler = (isMobile() || !isKeyboardEnabled) && this.option('focusedRowEnabled');
    if (needTriggerPointerEventHandler) {
      this._triggerPointerDownEventHandler(e, !isKeyboardEnabled);
    }

    super._rowClick.apply(this, arguments as any);
  }

  private _triggerPointerDownEventHandler(e, force) {
    const { originalEvent } = e.event;
    if (originalEvent) {
      const $cell = $(originalEvent.target);
      const columnIndex = this.getCellIndex($cell);
      const column = this._columnsController.getVisibleColumns()[columnIndex];
      const row = this._dataController.items()[e.rowIndex];

      if (this._keyboardNavigationController._isAllowEditing(row, column) || force) {
        const eventArgs = createEvent(originalEvent, { currentTarget: originalEvent.target });
        this._keyboardNavigationController._pointerEventHandler(eventArgs);
      }
    }
  }

  public renderFocusState(params) {
    super.renderFocusState(params);

    const { preventScroll, pageSizeChanged } = params ?? {};
    const $rowsViewElement = this.element();

    if ($rowsViewElement && !focused($rowsViewElement)) {
      $rowsViewElement.attr('tabindex', null);
    }

    pageSizeChanged && this._keyboardNavigationController.updateFocusedRowIndex();

    let rowIndex = this._keyboardNavigationController.getVisibleRowIndex();
    if (!isDefined(rowIndex) || rowIndex < 0) {
      rowIndex = 0;
    }

    const cellElements = this.getCellElements(rowIndex);
    if (this._keyboardNavigationController.isKeyboardEnabled() && cellElements?.length) {
      this.updateFocusElementTabIndex(cellElements, preventScroll);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private updateFocusElementTabIndex(cellElements, preventScroll?) {
    const $row = cellElements.eq(0).parent();

    if (isGroupRow($row)) {
      this._keyboardNavigationController._applyTabIndexToElement($row);
    } else {
      let columnIndex = this._keyboardNavigationController.getColumnIndex();
      if (!isDefined(columnIndex) || columnIndex < 0) {
        columnIndex = 0;
      }
      this._updateFocusedCellTabIndex(cellElements, columnIndex);
    }
  }

  private _updateFocusedCellTabIndex(cellElements, columnIndex) {
    const keyboardController = this._keyboardNavigationController;
    const cellElementsLength = cellElements ? cellElements.length : -1;
    const updateCellTabIndex = function ($cell) {
      const isMasterDetailCell = !!keyboardController.getMasterDetailCell($cell);
      const isValidCell = keyboardController._isCellValid($cell);
      if (!isMasterDetailCell && isValidCell && keyboardController._isCellElement($cell)) {
        keyboardController._applyTabIndexToElement($cell);
        keyboardController.setCellFocusType();
        return true;
      }

      return undefined;
    };

    const $cell = GridCoreKeyboardNavigationDom.getCellToFocus(cellElements, columnIndex);

    if ($cell.length) {
      updateCellTabIndex($cell);
    } else {
      if (cellElementsLength <= columnIndex) {
        columnIndex = cellElementsLength - 1;
      }
      for (let i = columnIndex; i < cellElementsLength; ++i) {
        if (updateCellTabIndex($(cellElements[i]))) {
          break;
        }
      }
    }
  }

  public renderDelayedTemplates(change) {
    super.renderDelayedTemplates.apply(this, arguments as any);
    this.waitAsyncTemplates().done(() => {
      this._renderFocusByChange(change);
    });
  }

  private _renderFocusByChange(change) {
    const { operationTypes, repaintChangesOnly } = change ?? {};
    const { fullReload, pageSize } = operationTypes ?? {};

    const hasInsertsOrRemoves = !!change?.changeTypes?.find(
      (changeType) => changeType === 'insert' || changeType === 'remove',
    );

    if (!change || !repaintChangesOnly || fullReload || pageSize || hasInsertsOrRemoves) {
      const preventScroll = shouldPreventScroll(this);
      this.renderFocusState({
        preventScroll,
        pageSizeChanged: pageSize,
      });
    }
  }

  protected _renderCore(change) {
    const deferred = super._renderCore.apply(this, arguments as any);
    this._renderFocusByChange(change);
    return deferred;
  }

  private _editCellPrepared($cell) {
    const editorInstance = this._getEditorInstance($cell);
    const isEditingNavigationMode = this._keyboardNavigationController?._isFastEditingStarted();

    if (editorInstance && isEditingNavigationMode) {
      this._handleEditingNavigationMode(editorInstance);
    }

    // @ts-expect-error
    super._editCellPrepared.apply(this, arguments);
  }

  private _handleEditingNavigationMode(editorInstance) {
    ['downArrow', 'upArrow'].forEach((keyName) => {
      const originalKeyHandler = editorInstance._supportedKeys()[keyName];
      editorInstance.registerKeyHandler(keyName, (e) => {
        const isDropDownOpened = editorInstance._input().attr('aria-expanded') === 'true';
        if (isDropDownOpened) {
          return originalKeyHandler && originalKeyHandler.call(editorInstance, e);
        }
      });
    });

    editorInstance.registerKeyHandler('leftArrow', noop);
    editorInstance.registerKeyHandler('rightArrow', noop);

    const isDateBoxWithMask = editorInstance.NAME === DATEBOX_WIDGET_NAME && editorInstance.option('useMaskBehavior');
    if (isDateBoxWithMask) {
      editorInstance.registerKeyHandler('enter', noop);
    }
  }

  private _getEditorInstance($cell) {
    const $editor = $cell.find('.dx-texteditor').eq(0);

    return gridCoreUtils.getWidgetInstance($editor);
  }
};

const editing = (Base: ModuleType<EditingController>) => class EditingControllerKeyboardExtender extends Base {
  /**
   * interface override
   */
  public editCell(rowIndex, columnIndex) {
    if (this._keyboardNavigationController._processCanceledEditCellPosition(rowIndex, columnIndex)) {
      return false;
    }

    const isCellEditing = super.editCell(rowIndex, columnIndex);
    if (isCellEditing) {
      this._keyboardNavigationController.setupFocusedView();
    }

    return isCellEditing;
  }

  public editRow(rowIndex) {
    const visibleColumnIndex = this._keyboardNavigationController.getVisibleColumnIndex();
    const column = this._columnsController.getVisibleColumns()[visibleColumnIndex];

    if (column && column.type || this.option('editing.mode') === EDIT_MODE_FORM) {
      this._keyboardNavigationController._resetFocusedCell();
    }
    super.editRow(rowIndex);

    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected addRow(parentKey) {
    this._keyboardNavigationController.setupFocusedView();
    this._keyboardNavigationController.setCellFocusType();

    return super.addRow.apply(this, arguments as any);
  }

  protected getFocusedCellInRow(rowIndex) {
    let $cell = super.getFocusedCellInRow(rowIndex);
    const rowIndexOffset = this._dataController.getRowIndexOffset();
    const focusedRowIndex = this._keyboardNavigationController._focusedCellPosition.rowIndex - rowIndexOffset;

    if (this._keyboardNavigationController.isKeyboardEnabled() && focusedRowIndex === rowIndex) {
      const $focusedCell = this._keyboardNavigationController._getFocusedCell();
      if (isElementDefined($focusedCell) && !$focusedCell.hasClass(COMMAND_EDIT_CLASS)) {
        $cell = $focusedCell;
      }
    }

    return $cell;
  }

  protected _processCanceledEditingCell() {
    this.closeEditCell().done(() => {
      this._keyboardNavigationController._updateFocus();
    });
  }

  /**
   * interface override
   */
  public closeEditCell() {
    const keyboardNavigation = this._keyboardNavigationController;
    keyboardNavigation._fastEditingStarted = false;

    const result = super.closeEditCell.apply(this, arguments as any);

    const $focusedElement = this._getFocusedElement();
    const isFilterCell = !!$focusedElement.closest(`.${this.addWidgetPrefix(FILTER_ROW_CLASS)}`).length;

    if (!isFilterCell) {
      keyboardNavigation._updateFocus();
    }

    return result;
  }

  private _getFocusedElement() {
    const $element = $(this.component.element?.());
    const $focusedElement = $element.find(':focus');

    return $focusedElement;
  }

  protected _delayedInputFocus() {
    this._keyboardNavigationController._isNeedScroll = true;
    super._delayedInputFocus.apply(this, arguments as any);
  }

  protected _isEditingStart() {
    const cancel = super._isEditingStart.apply(this, arguments as any);

    if (cancel && !this._keyboardNavigationController._isNeedFocus) {
      const $cell = this._keyboardNavigationController._getFocusedCell();
      this._keyboardNavigationController._focus($cell, true);
    }

    return cancel;
  }
};

const data = (Base: ModuleType<DataController>) => class DataControllerKeyboardExtender extends Base {
  protected _correctRowIndices(getRowIndexCorrection) {
    const that = this;
    const focusedCellPosition = this._keyboardNavigationController._focusedCellPosition;

    super._correctRowIndices.apply(that, arguments as any);

    if (focusedCellPosition && focusedCellPosition.rowIndex >= 0) {
      const focusedRowIndexCorrection = getRowIndexCorrection(focusedCellPosition.rowIndex);
      if (focusedRowIndexCorrection) {
        focusedCellPosition.rowIndex += focusedRowIndexCorrection;
        this._editorFactoryController.refocus();
      }
    }
  }

  private getMaxRowIndex() {
    let result = this.items().length - 1;
    // @ts-expect-error
    const virtualItemsCount = this.virtualItemsCount();

    if (virtualItemsCount) {
      const rowIndexOffset = this.getRowIndexOffset();
      result += rowIndexOffset + virtualItemsCount.end;
    }

    return result;
  }
};

const adaptiveColumns = (Base: ModuleType<AdaptiveColumnsController>) => class AdaptiveColumnsKeyboardExtender extends Base {
  protected _showHiddenCellsInView({ viewName, $cells, isCommandColumn }) {
    super._showHiddenCellsInView.apply(this, arguments as any);

    viewName === COLUMN_HEADERS_VIEW && !isCommandColumn && $cells.each((_, cellElement) => {
      const $cell = $(cellElement);
      isCellInHeaderRow($cell) && $cell.attr('tabindex', 0);
    });
  }

  protected _hideVisibleCellInView({ viewName, $cell, isCommandColumn }) {
    super._hideVisibleCellInView.apply(this, arguments as any);

    if (viewName === COLUMN_HEADERS_VIEW && !isCommandColumn && isCellInHeaderRow($cell)) {
      $cell.removeAttr('tabindex');
    }
  }

  protected _hideVisibleColumnInView({ view, isCommandColumn, visibleIndex }) {
    super._hideVisibleColumnInView({ view, isCommandColumn, visibleIndex });
    if (view.name === ROWS_VIEW) {
      this._rowsView.renderFocusState(null);
    }
  }
};

export const keyboardNavigationModule: import('../m_types').Module = {
  defaultOptions() {
    return {
      useLegacyKeyboardNavigation: false,

      keyboardNavigation: {
        enabled: true,
        enterKeyAction: 'startEdit',
        enterKeyDirection: 'none',
        editOnKeyPress: false,
      },
    };
  },
  controllers: {
    keyboardNavigation: KeyboardNavigationController,
  },
  extenders: {
    views: {
      rowsView,
    },
    controllers: {
      editing,
      data,
      adaptiveColumns,
      keyboardNavigation: keyboardNavigationScrollableA11yExtender,
    },
  },
};
