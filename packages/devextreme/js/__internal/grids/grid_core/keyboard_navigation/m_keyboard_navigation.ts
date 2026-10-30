/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import {
  addNamespace,
  createEvent,
  isCommandKeyPressed,
} from '@js/common/core/events/utils';
import domAdapter from '@js/core/dom_adapter';
import type { UserDefinedElement } from '@js/core/element';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import {
  getHeight,
  getOuterHeight,
  getWidth,
} from '@js/core/utils/size';
import { isDeferred, isDefined, isEmptyObject } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import * as accessibility from '@js/ui/shared/accessibility';
import { isElementInDom } from '@ts/core/utils/dom';
import { focused } from '@ts/core/utils/selectors';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import type { AdaptiveColumnsViewController } from '@ts/grids/grid_core/adaptivity/adaptivity';
import { CLASSES as ADAPTIVITY_CLASSES } from '@ts/grids/grid_core/adaptivity/const';
import type {
  HiddenCellInViewOptions,
  HiddenCellsInViewOptions,
  HideVisibleColumnInViewOptions,
} from '@ts/grids/grid_core/adaptivity/types';
import { CLASSES as COLUMNS_CONTROLLER_CLASSES } from '@ts/grids/grid_core/columns_controller/const';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ColumnsResizerViewController } from '@ts/grids/grid_core/columns_resizing_reordering/columns_resizing_reordering';
import type { DataChange, ProcessedItem, RowIndexCorrection } from '@ts/grids/grid_core/data_controller/types';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import {
  CLASSES as EDITING_CLASSES,
  EDIT_MODE,
  FOCUSABLE_ELEMENT_SELECTOR,
} from '@ts/grids/grid_core/editing/const';
import { isCellBasedEditMode } from '@ts/grids/grid_core/editing/editing_utils';
import type {
  CellBasedEditingController,
  EditCellResult,
  EditingRowsViewExtension,
  EditingStartOptions,
} from '@ts/grids/grid_core/editing/types';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/editor_factory';
import { CLASSES as FILTER_ROW_CLASSES } from '@ts/grids/grid_core/filter_row/const';
import type { FocusController } from '@ts/grids/grid_core/focus/m_focus';
import type { ResizingController } from '@ts/grids/grid_core/grid_view/grid_view';
import { CLASSES as MASTER_DETAIL_CLASSES } from '@ts/grids/grid_core/master_detail/const';
import type { SearchPanelViewController } from '@ts/grids/grid_core/search/search';
import { COMMAND_SELECT_CLASS } from '@ts/grids/grid_core/selection/const';
import type { SelectionController } from '@ts/grids/grid_core/selection/m_selection';
import type { Module, ModuleType, RowKey } from '@ts/grids/grid_core/types';
import gridCoreUtils from '@ts/grids/grid_core/utils';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type {
  CellPosition, FocusStateParams, RowPreparedOptions, RowsViewScrollEvent, ViewRowEvent,
} from '@ts/grids/grid_core/views/types';
import type Scrollable from '@ts/ui/scroll_view/scrollable';
import type TextEditorBase from '@ts/ui/text_box/text_editor.base';
import { memoize } from '@ts/utils/memoize';

import {
  CLASSES,
  COLUMN_HEADERS_VIEW,
  COMMAND_CELL_SELECTOR,
  DATEBOX_WIDGET_NAME,
  DRAG_COLUMN_NAME,
  FAST_EDITING_DELETE_KEY,
  FOCUS_TYPE_CELL,
  FOCUS_TYPE_ROW,
  FOCUSED_CELL_KEYS,
  FUNCTIONAL_KEYS,
  INTERACTIVE_ELEMENTS_SELECTOR,
  KEYBOARD_NAVIGATION_NAMESPACE,
  NON_FOCUSABLE_ELEMENTS_SELECTOR,
  ROWS_VIEW,
} from './const';
import { GridCoreKeyboardNavigationDom } from './dom';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './keyboard_navigation_core';
import { keyboardNavigationScrollableA11yExtender } from './scrollable_a11y';
import type {
  DirectionCode,
  FocusChangingArgs,
  FocusChangingResult,
  FocusedCellChangingArgs,
  FocusedRowChangingArgs,
  KeyboardNavigationDataController,
  KeyDownEvent,
  NavigationDirection,
  NavigationElementType,
  NavigationKeyCode,
  RenderCompletedChange,
  ScrollOffset,
  StartEditingEvent,
} from './types';
import {
  getInteractiveElement,
  getNextColumnIndex, isCellInHeaderRow,
  isDataRow,
  isEditForm,
  isEditorCell,
  isEditRow,
  isElementDefined,
  isGroupFooterRow,
  isGroupRow,
  isMobile,
  isNavigableColumnCell,
  isNotFocusedRow,
  isRowOrFormEditMode,
  shouldPreventScroll,
} from './utils';

export class KeyboardNavigationController extends KeyboardNavigationControllerCore {
  private _updateFocusTimeout?: ReturnType<typeof setTimeout>;

  public _fastEditingStarted!: boolean;

  private _canceledCellPosition!: CellPosition | null;

  private focusedHandlerWithContext!: ($element: dxElementWrapper) => void;

  private focusOutHandlerContext!: (event: DxEvent<FocusEvent>) => void;

  public _isNeedScroll?: boolean;

  protected _focusedView?: RowsView | null;

  public _isNeedFocus?: boolean;

  private _isHiddenFocus?: boolean;

  private _documentClickHandler?: (e: DxEvent) => void;

  private _pointerEventAction?: (e: DxEvent) => void;

  private focusType?: typeof FOCUS_TYPE_ROW | typeof FOCUS_TYPE_CELL;

  private _testInteractiveElement?: dxElementWrapper;

  protected _dataController!: KeyboardNavigationDataController;

  protected dataSourceController!: DataSourceController;

  private _selectionController!: SelectionController;

  protected _editingController!: CellBasedEditingController;

  protected _rowsView!: RowsView;

  private _editorFactory!: EditorFactory;

  private _focusController!: FocusController;

  private adaptiveColumnsController!: AdaptiveColumnsViewController;

  private _columnResizerController!: ColumnsResizerViewController;

  private searchPanel!: SearchPanelViewController;

  private _needNavigationToCell = false;

  private focusRestoreScrollTop = 0;

  // #region Initialization
  public init(): void {
    this._dataController = this.getController('data') as KeyboardNavigationDataController;
    this.dataSourceController = this.getController('dataSource');
    this._selectionController = this.getController('selection');
    this._editingController = this.getController('editing') as CellBasedEditingController;
    this._editorFactory = this.getController('editorFactory');
    this._focusController = this.getController('focus');
    this.adaptiveColumnsController = this.getController('adaptiveColumns');
    this._columnResizerController = this.getController('columnsResizer');
    this._rowsView = this.getView('rowsView');
    this.searchPanel = this.getController('searchPanel');

    super.init();

    this._memoFireFocusedCellChanged = memoize(this._memoFireFocusedCellChanged.bind(this), { compareType: 'value' });
    this._memoFireFocusedRowChanged = memoize(this._memoFireFocusedRowChanged.bind(this), { compareType: 'value' });

    this.focusedHandlerWithContext = this.focusedHandlerWithContext
      ?? this.focusedHandler.bind(this);
    this.focusOutHandlerContext = this.focusOutHandlerContext
      ?? this.focusOutHandler.bind(this);

    this._updateFocusTimeout = undefined;
    this._fastEditingStarted = false;
    this._canceledCellPosition = null;

    if (this.isKeyboardEnabled()) {
      accessibility.subscribeVisibilityChange();
      this._editorFactory?.focused.add(this.focusedHandlerWithContext);
    } else {
      accessibility.unsubscribeVisibilityChange();
      this._editorFactory?.focused.remove(this.focusedHandlerWithContext);
    }

    this.initDocumentHandlers();

    // init runs again on option changes, so drop the previous subscription first
    this._dataController.rowIndicesChanged.remove(this.rowIndicesChangedHandler);
    this._dataController.rowIndicesChanged.add(this.rowIndicesChangedHandler);
  }

  public dispose(): void {
    super.dispose();
    this._resetFocusedView();
    eventsEngine.off(
      domAdapter.getDocument(),
      addNamespace(pointerEvents.down, KEYBOARD_NAVIGATION_NAMESPACE),
      this._documentClickHandler,
    );
    clearTimeout(this._updateFocusTimeout);
    accessibility.unsubscribeVisibilityChange();
    this._dataController.rowIndicesChanged.remove(this.rowIndicesChangedHandler);
  }

  private readonly rowIndicesChangedHandler = (
    getRowIndexCorrection: RowIndexCorrection,
  ): void => {
    const focusedCellPosition = this._focusedCellPosition;

    if (focusedCellPosition?.rowIndex !== undefined && focusedCellPosition.rowIndex >= 0) {
      const focusedRowIndexCorrection = getRowIndexCorrection(focusedCellPosition.rowIndex);

      if (focusedRowIndexCorrection) {
        focusedCellPosition.rowIndex += focusedRowIndexCorrection;
        this._editorFactory.refocus();
      }
    }
  };

  private focusedHandler($element: dxElementWrapper): void {
    this.setupFocusedView();

    if (this._isNeedScroll && $element.is(':visible') && this._focusedView?.getScrollable()) {
      this._focusedView._scrollToElement($element);
      this._isNeedScroll = false;
    }
  }

  protected focusinHandler(event: DxEvent<FocusEvent>): void {
    const $element = $(event.target);
    const $relatedTarget = $(event.relatedTarget);
    const $rowsView = this._rowsView.element();
    const isRelatedTargetInRowsView = !!$rowsView && $relatedTarget.closest($rowsView).length > 0;
    const isFocusMovedToLink = !!event.relatedTarget && $element.is('a');

    if (isFocusMovedToLink && !isRelatedTargetInRowsView && this._isEventInCurrentGrid(event)) {
      let $focusedCell = this._getFocusedCell();

      $focusedCell = !isElementDefined($focusedCell)
        ? (this._rowsView.getCellElements(0) ?? $()).filter('[tabindex]').eq(0)
        : $focusedCell;

      if (!$element.closest($focusedCell).length) {
        event.preventDefault();
        // @ts-expect-error eventsEngine.trigger is not fully typed
        eventsEngine.trigger($focusedCell, 'focus');
      }
    }

    const isCell = $element.is('td');
    const needSetFocusPosition = (this.option('focusedRowIndex') ?? -1) < 0;
    if (isCell && needSetFocusPosition) {
      this._focusView();
      this._updateFocusedCellPosition($element);
    }
  }

  protected focusOutHandler(e: DxEvent<FocusEvent>): void {
    this._toggleInertAttr(false);

    if (e.relatedTarget && !this.isInsideFocusedView($(e.relatedTarget))) {
      this._isNeedFocus = false;
      this._isHiddenFocus = false;
      this._isNeedScroll = false;
    }
  }

  protected subscribeToRowsViewFocusEvent(): void {
    const $rowsView = this._rowsView?.element();

    eventsEngine.on($rowsView, 'focusin', this.focusinHandlerContext);
    eventsEngine.on($rowsView, 'focusout', this.focusOutHandlerContext);
  }

  protected unsubscribeFromRowsViewFocusEvent(): void {
    const $rowsView = this._rowsView?.element();

    eventsEngine.off($rowsView, 'focusin', this.focusinHandlerContext);
    eventsEngine.off($rowsView, 'focusout', this.focusOutHandlerContext);
  }

  protected resizeCompleted(): void {
    if (this.navigationToCellInProgress()) {
      this._resizeController.resetLastResizeTime(); // disable asynchronous resize
    }

    if (!this.needToRestoreFocus) {
      return;
    }

    const scrollLeft = this._rowsView?.getScrollable()?.scrollLeft() ?? 0;

    const isColumnRenderPending = this._columnsController.isNeedToRenderVirtualColumns(scrollLeft);

    if (!isColumnRenderPending && !this.isFocusedRowRenderPending()) {
      this.needToRestoreFocus = false;
      this.focusFirstOrLastCell();
    }
  }

  protected renderCompleted(e?: RenderCompletedChange): void {
    const $rowsView = this._rowsView.element();

    if (!$rowsView) {
      return;
    }

    const isFullUpdate = !e || e.changeType === 'refresh';
    const isFocusedViewCorrect = this._focusedView?.name === this._rowsView.name;
    const isAppend = e && (e.changeType === 'append' || e.changeType === 'prepend');
    // @ts-expect-error rendered view; get() is typed as Element
    const root = $(domAdapter.getRootNode($rowsView.get?.(0)));
    const $focusedElement = root.find(':focus');
    const isFocusedElementCorrect = this._isFocusedElementCorrect($focusedElement, $rowsView, e);

    this.unsubscribeFromRowsViewFocusEvent();
    this.subscribeToRowsViewFocusEvent();

    this.initPointerEventHandler();
    this.initKeyDownHandler();
    this._setRowsViewAttributes();

    if (isFocusedViewCorrect && isFocusedElementCorrect) {
      const needUpdateFocus = this._isNeedFocus
        ? !isAppend
        : this._isHiddenFocus && isFullUpdate && !e?.virtualColumnsScrolling;
      if (needUpdateFocus) {
        const isScrollEvent = !!e?.event?.type;
        const skipFocusEvent = e?.virtualColumnsScrolling && isScrollEvent;
        this.updateFocus(true, skipFocusEvent);
      }
    }
  }

  private _isFocusedElementCorrect(
    $focusedElement: dxElementWrapper,
    $rowsView: dxElementWrapper,
    e?: RenderCompletedChange,
  ): boolean {
    if ($focusedElement.length && !$focusedElement.closest($rowsView).length) {
      return false;
    }

    if (!$focusedElement.length && e?.virtualColumnsScrolling) {
      const focusedColumnIndex = this._focusedCellPosition?.columnIndex ?? -1;
      return this._isColumnRendered(focusedColumnIndex);
    }

    return true;
  }

  protected initHandlers(): void {
    this.unsubscribeFromRowsViewFocusEvent();
    this.unsubscribeFromPointerEvent();
    super.initHandlers();
  }

  private initDocumentHandlers(): void {
    const document = domAdapter.getDocument();

    this._documentClickHandler = this._documentClickHandler ?? this.createAction((
      e: { event: DxEvent },
    ) => {
      const $target = $(e.event.target);

      const tableSelector = `.${this.addWidgetPrefix(VIEW_CLASSES.table)}`;
      const rowsViewSelector = `.${this.addWidgetPrefix(VIEW_CLASSES.rowsView)}`;
      const editorOverlaySelector = `.${EDITING_CLASSES.dropDownEditorOverlay}`;

      // if click was on the datagrid table, but the target element is no more presented in the DOM
      const needKeepFocus = !!$target.closest(tableSelector).length && !isElementInDom($target);

      if (needKeepFocus) {
        e.event.preventDefault();
        return;
      }

      const isRowsViewClick = this._isEventInCurrentGrid(e.event)
        && !!$target.closest(rowsViewSelector).length;
      const isEditorOverlayClick = !!$target.closest(editorOverlaySelector).length;
      const isColumnResizing = !!this._columnResizerController?.isResizing();

      if (!isRowsViewClick && !isEditorOverlayClick && !isColumnResizing) {
        const $focusedViewElement = this._focusedView?.element();
        const isClickOutsideFocusedView = $focusedViewElement
          ? $target.closest($focusedViewElement).length === 0
          : true;

        if (isClickOutsideFocusedView) {
          this.resetFocusedCell(true);
        }

        this._resetFocusedView();
      }
    });

    eventsEngine.off(
      document,
      addNamespace(pointerEvents.down, KEYBOARD_NAVIGATION_NAMESPACE),
      this._documentClickHandler,
    );

    if (this.isKeyboardEnabled()) {
      eventsEngine.on(
        document,
        addNamespace(pointerEvents.down, KEYBOARD_NAVIGATION_NAMESPACE),
        this._documentClickHandler,
      );
    }
  }

  private _setRowsViewAttributes(): void {
    const $rowsView = this._getRowsViewElement();
    const isGridEmpty = !this._dataController.getVisibleRows().length;
    if (isGridEmpty && $rowsView) {
      this.applyTabIndexToElement($rowsView);
    }
  }

  private unsubscribeFromPointerEvent(): void {
    const pointerEventName = !isMobile() ? pointerEvents.down : clickEventName;
    const $rowsView = this._getRowsViewElement();

    if (this._pointerEventAction) {
      eventsEngine.off(
        $rowsView,
        addNamespace(pointerEventName, KEYBOARD_NAVIGATION_NAMESPACE),
        this._pointerEventAction,
      );
    }
  }

  private subscribeToPointerEvent(): void {
    const pointerEventName = !isMobile() ? pointerEvents.down : clickEventName;
    const $rowsView = this._getRowsViewElement();
    const clickSelector = `.${VIEW_CLASSES.row} > td, .${VIEW_CLASSES.row}`;

    eventsEngine.on(
      $rowsView,
      addNamespace(pointerEventName, KEYBOARD_NAVIGATION_NAMESPACE),
      clickSelector,
      this._pointerEventAction,
    );
  }

  private initPointerEventHandler(): void {
    this._pointerEventAction = this._pointerEventAction
      ?? this.createAction(this.pointerEventHandler);
    this.unsubscribeFromPointerEvent();
    this.subscribeToPointerEvent();
  }

  // #endregion Initialization

  // #region Options
  public isRowFocusType(): boolean {
    return this.focusType === FOCUS_TYPE_ROW;
  }

  public isCellFocusType(): boolean {
    return this.focusType === FOCUS_TYPE_CELL;
  }

  public setRowFocusType(): void {
    if (this.option('focusedRowEnabled')) {
      this.focusType = FOCUS_TYPE_ROW;
    }
  }

  public setCellFocusType(): void {
    this.focusType = FOCUS_TYPE_CELL;
  }
  // #endregion Options

  // #region Key_Handlers

  /**
   * Executes tab key navigation logic.
   * In editing mode — moves editing to the next/previous cell.
   * In normal mode — moves focus to the next/previous cell.
   * Falls back to browser's native tab behavior when focus should leave the grid.
   */
  private executeTabKey(
    event: KeyDownEvent,
    options: {
      hasEditingOptions: boolean;
      isLastValidCell: boolean;
      isOriginalHandlerRequired: boolean;
    },
  ): void {
    const isEditing = this._editingController.isEditing();
    const direction: NavigationDirection = event.shift ? 'previous' : 'next';
    const eventTarget = event.originalEvent.target as Element;
    const { hasEditingOptions, isLastValidCell } = options;
    let originalHandlerRequired = options.isOriginalHandlerRequired;

    // Try to handle tab navigation within the grid
    if (hasEditingOptions && eventTarget && !originalHandlerRequired) {
      if (isEditing) {
        // In editing mode: navigate to the next editable cell.
        // If the handler returns false, stop grid handling and fall back to native Tab behavior.
        if (!this.editingCellTabHandler(event, direction)) {
          return;
        }
      } else if (this.targetCellTabHandler(event, direction)) {
        // In normal mode: if handler signals that native tab is required,
        // let the browser handle focus transition out of the grid.
        originalHandlerRequired = true;
      }
    }

    // Let the browser handle tab natively — focus leaves the grid
    if (originalHandlerRequired) {
      this.handleNativeTabOut(isLastValidCell);
      return;
    }

    // Tab was handled by grid navigation — suppress browser default
    event.originalEvent.preventDefault();
  }

  /**
   * Handles the case when Tab should leave the grid to the next/previous focusable element.
   * Cleans up editing state if the grid is in cell/batch editing mode.
   */
  private handleNativeTabOut(isLastValidCell: boolean): void {
    const $cell = this._getFocusedCell();
    const isCommandCell = $cell.is(COMMAND_CELL_SELECTOR);

    if (isLastValidCell && !isCommandCell) {
      this._toggleInertAttr(true);
    }

    this._editorFactory.loseFocus();

    if (this._editingController.isEditing()
      && !isRowOrFormEditMode(this._editingController.getEditMode())) {
      // Focus the cell before closing the editor on native Tab-out,
      // so the browser's native Shift+Tab leaves from a stable anchor.
      ($cell.get(0) as HTMLElement | undefined)?.focus({ preventScroll: true });
      this.resetFocusedCell(true);
      this._resetFocusedView();
      this._closeEditCell();
    }
  }

  protected keyDownHandler(e: KeyboardKeyDownEvent): void {
    this._isNeedFocus = true;
    this._isNeedScroll = true;
    let isHandled = this.processOnKeyDown(e);
    const isEditing = this._editingController?.isEditing();

    if (e.originalEvent.isDefaultPrevented()) {
      this._isNeedFocus = false;
      this._isNeedScroll = false;
      return;
    }

    const isWaitingForRows = this.isWaitingForRowsRendering(e);

    if (!FUNCTIONAL_KEYS.includes(e.keyName) && !isWaitingForRows) {
      this._updateFocusedCellPositionByTarget(e.originalEvent.target);
    }

    if (isWaitingForRows && !isHandled && this.isFocusedCellKey(e)) {
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      return;
    }

    if (!isHandled) {
      switch (e.keyName) {
        case 'leftArrow':
        case 'rightArrow':
          this._leftRightKeysHandler(e, isEditing);
          isHandled = true;
          break;

        case 'upArrow':
        case 'downArrow':
          if (e.ctrl) {
            accessibility.selectView('rowsView', this, e.originalEvent);
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
          this.tabKeyHandler(e);
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
          if (this._isFastEditingAllowed() && !this.isFastEditingStarted()) {
            isHandled = this._beginFastEditing(e.originalEvent, true);
          }
          break;
        case 'home':
        case 'end':
          this.homeOrEndKeyHandler(e);
          break;
        default:
          break;
      }

      if (isHandled || this._beginFastEditing(e.originalEvent)) {
        e.originalEvent.stopPropagation();
      } else {
        this._isNeedFocus = false;
        this._isNeedScroll = false;
      }
    }
  }

  private _closeEditCell(): DeferredObj<unknown> {
    const d = Deferred();
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      this._editingController.closeEditCell().always(d.resolve);
    });
    return d;
  }

  /**
   * @extended: TreeList's keyboard_navigation
   */
  protected _leftRightKeysHandler(eventArgs: KeyboardKeyDownEvent, isEditing?: boolean): void {
    const rowIndex = this.getVisibleRowIndex();
    const { originalEvent } = eventArgs;
    const $row = this._focusedView?.getRow(rowIndex);
    const directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
    const isEditingNavigationMode = this.isFastEditingStarted();
    const allowNavigate = (!isEditing || isEditingNavigationMode) && isDataRow($row);

    if (!allowNavigate) {
      return;
    }

    if (directionCode !== 'nextInRow' && directionCode !== 'previousInRow') {
      return;
    }

    originalEvent?.preventDefault();
    this.setCellFocusType();

    if (isEditingNavigationMode) {
      this._closeEditCell();
    }

    const focusNextCell = (): void => {
      const $cell = this._getNextCell(directionCode);

      if ($cell && isElementDefined($cell)) {
        this._arrowKeysHandlerFocusCell(originalEvent, $cell, directionCode);
      }
    };

    if (this._isVirtualColumnRender()) {
      this._processVirtualHorizontalPosition(directionCode, eventArgs)
        .done(focusNextCell);
      return;
    }

    focusNextCell();
  }

  private isInsideMasterDetail($target: dxElementWrapper): boolean {
    const $masterDetail = $target.closest(`.${MASTER_DETAIL_CLASSES.detailCell}`);
    return !!$masterDetail.get(0)
      && this.elementIsInsideGrid($masterDetail)
      && !$target.is($masterDetail);
  }

  private isWaitingForRowsRendering(eventArgs: KeyboardKeyDownEvent): boolean {
    return this._rowsView.isWaitingForRowsLayout()
      && !this._editingController?.isEditing()
      && !this.isInsideMasterDetail($(eventArgs.originalEvent.target));
  }

  private isFocusedCellKey(eventArgs: KeyboardKeyDownEvent): boolean {
    const {
      keyName, key, ctrl, alt, originalEvent,
    } = eventArgs;
    const isViewSwitch = ctrl && (keyName === 'upArrow' || keyName === 'downArrow');
    const isCommandShortcut = isCommandKeyPressed(originalEvent) && (keyName === 'A' || keyName === 'F');
    const isFastEditingKey = key?.length === 1
      && !ctrl && !alt && !isCommandShortcut
      && this._isFastEditingAllowed();

    return !isViewSwitch && (FOCUSED_CELL_KEYS.includes(keyName) || isFastEditingKey);
  }

  private _upDownKeysHandler(eventArgs: KeyboardKeyDownEvent, isEditing: boolean): void {
    const visibleRowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView?.getRow(visibleRowIndex);
    const { originalEvent, keyName } = eventArgs;
    const isUpArrow = keyName === 'upArrow';
    const isRowEditingInCurrentRow = this._editingController?.isEditRowByIndex?.(visibleRowIndex);
    const isEditingNavigationMode = this.isFastEditingStarted();
    const isInsideMasterDetail = this.isInsideMasterDetail($(originalEvent?.target));
    const canLeaveEditor = !isRowEditingInCurrentRow || !isEditing || isEditingNavigationMode;
    const allowNavigate = canLeaveEditor && $row && !isEditForm($row) && !isInsideMasterDetail;

    if (!allowNavigate) {
      return;
    }

    if (keyName !== 'upArrow' && keyName !== 'downArrow') {
      return;
    }

    if (isEditingNavigationMode) {
      this._closeEditCell();
    }

    const isNavigated = this._navigateNextCell(originalEvent, keyName);
    const isUpFromFirstRenderedRow = !isNavigated && isUpArrow && this._isVirtualRowRender();
    const needScrollToPreviousRow = isUpFromFirstRenderedRow
      && this.dataSourceController.hasAdapter()
      && !this.dataSourceController.isLoading();

    if (needScrollToPreviousRow) {
      const rowHeight = Number(getOuterHeight($row));
      // @ts-expect-error a missing rowIndex gives NaN
      const rowIndex = this._focusedCellPosition.rowIndex - 1;
      this._scrollBy(0, -rowHeight, rowIndex, originalEvent);
    }

    if (originalEvent) {
      originalEvent.preventDefault();
    }
  }

  private _pageUpDownKeyHandler(eventArgs: KeyboardKeyDownEvent): void {
    const pageIndex = this._dataController.pageIndex();
    const pageCount = this.dataSourceController.pageCount();
    const pagingEnabled = this.option('paging.enabled');
    const isPageUp = eventArgs.keyName === 'pageUp';
    const pageStep = isPageUp ? -1 : 1;
    const hasAdjacentPage = isPageUp ? pageIndex > 0 : pageIndex < pageCount - 1;
    const scrollable = this._rowsView.getScrollable();

    if (pagingEnabled && !this.isVirtualScrolling()) {
      if (hasAdjacentPage) {
        this._dataController.pageIndex(pageIndex + pageStep);
        eventArgs.originalEvent.preventDefault();
      }
    } else {
      const hasVerticalScroll = !!scrollable
        && getHeight(scrollable.container()) < getHeight(scrollable.$content().get(0));

      if (hasVerticalScroll) {
        this._scrollBy(0, getHeight(scrollable.container()) * pageStep);
        eventArgs.originalEvent.preventDefault();
      }
    }
  }

  private _spaceKeyHandler(eventArgs: KeyboardKeyDownEvent, isEditing: boolean): boolean {
    const rowIndex = this.getVisibleRowIndex();
    const $target = $(eventArgs.originalEvent.target);
    const { selection } = this.option();

    if (selection && selection.mode !== 'none' && !isEditing) {
      const isFocusedSelectionCell = $target.hasClass(COMMAND_SELECT_CLASS);
      if (isFocusedSelectionCell && selection.showCheckBoxesMode === 'onClick') {
        this._selectionController.startSelectionWithCheckboxes();
      }

      const isFocusedRowElement = this.getElementType($target) === 'row'
        && this.isRowFocusType()
        && isDataRow($target);
      if (
        isFocusedRowElement
        || $target.parent().hasClass(VIEW_CLASSES.dataRow)
        || $target.hasClass(this.addWidgetPrefix(VIEW_CLASSES.rowsView))
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

  private _ctrlAKeyHandler(eventArgs: KeyboardKeyDownEvent, isEditing: boolean): void {
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

  /**
   * Handles Tab / Shift+Tab key press.
   * Determines navigation direction, checks boundary conditions,
   * and delegates to `executeTabKey` for the actual focus transition.
   */
  protected tabKeyHandler(event: KeyDownEvent): void {
    const direction: NavigationDirection = event.shift ? 'previous' : 'next';
    const eventTarget = event.originalEvent.target;

    // Master-detail cells use their own tab navigation logic
    if (this.handleTabKeyOnMasterDetailCell(eventTarget, direction)) {
      return;
    }

    $(this._focusedView?.element()).addClass(CLASSES.focusState);

    const { isLastValidCell, isOriginalHandlerRequired } = this.getTabBoundaryInfo(event);

    const hasEditingOptions = !!this.option('editing');
    const canHandleNavigation = hasEditingOptions && !!eventTarget && !isOriginalHandlerRequired;

    // Reset focused cell when the rows view container itself is focused (not a specific cell)
    if (
      canHandleNavigation
      && $(eventTarget).hasClass(this.addWidgetPrefix(VIEW_CLASSES.rowsView))
    ) {
      this.resetFocusedCell();
    }

    const tabOptions = { hasEditingOptions, isLastValidCell, isOriginalHandlerRequired };

    // For virtual columns, scroll to reveal the next column before navigating.
    // Skip scrolling when focus should cycle through interactive elements within the current cell.
    if (canHandleNavigation && this.needVirtualColumnScroll(eventTarget, event)) {
      this._processVirtualHorizontalPosition(direction, event)
        .done(() => this.executeTabKey(event, tabOptions));
      return;
    }

    this.executeTabKey(event, tabOptions);
  }

  /**
   * Determines whether horizontal scrolling is needed for virtual column tab navigation.
   * Returns false when focus should cycle through interactive elements within the current cell.
   */
  private needVirtualColumnScroll(eventTarget: Element, event: KeyDownEvent): boolean {
    if (!this._isVirtualColumnRender()) {
      return false;
    }

    const $cell = this.getCellElementFromTarget(eventTarget);

    return !this.isOriginalTabHandlerRequired($cell, event);
  }

  /**
   * Determines whether the focused cell is at the boundary of the grid.
   * When at the boundary, Tab/Shift+Tab should let focus leave the grid.
   */
  private getTabBoundaryInfo(event: KeyDownEvent): {
    isLastValidCell: boolean;
    isOriginalHandlerRequired: boolean;
  } {
    const hasFocusedCellPosition = isDefined(this._focusedCellPosition)
      && !isEmptyObject(this._focusedCellPosition);
    const isLastValidCell = !event.shift && hasFocusedCellPosition
      && this.isLastValidCell(this._focusedCellPosition);
    const isOriginalHandlerRequired = !hasFocusedCellPosition
      || (event.shift && this.isFirstValidCell(this._focusedCellPosition))
      || isLastValidCell;

    return { isLastValidCell, isOriginalHandlerRequired };
  }

  private _getMaxVerticalOffset(): number {
    const scrollable = this.component.getScrollable();

    return scrollable
      ? scrollable.scrollHeight() - Number(getHeight(this._rowsView.element()))
      : 0;
  }

  private _getMaxHorizontalOffset(): number {
    const scrollable = this.component.getScrollable();

    return scrollable
      ? scrollable.scrollWidth() - Number(getWidth(this._rowsView.element()))
      : 0;
  }

  private _isColumnRendered(columnIndex: number): boolean {
    const allVisibleColumns = this._columnsController.getVisibleColumns(
      null,
      true,
    );
    const renderedVisibleColumns = this._columnsController.getVisibleColumns();
    const column = allVisibleColumns[columnIndex];

    if (!column) {
      return false;
    }

    return renderedVisibleColumns.includes(column);
  }

  protected _isFixedColumn(columnIndex: number): boolean {
    const allVisibleColumns = this._columnsController.getVisibleColumns(
      null,
      true,
    );
    const column = allVisibleColumns[columnIndex];
    return !!column && !!column.fixed;
  }

  private _isColumnVirtual(columnIndex: number): boolean {
    const localColumnIndex = columnIndex - this._columnsController.getColumnIndexOffset();
    const visibleColumns = this._columnsController.getVisibleColumns();
    const column = visibleColumns[localColumnIndex];
    return !!column && column.command === 'virtual';
  }

  private _processVirtualHorizontalPosition(
    direction: NavigationDirection,
    event: KeyDownEvent,
  ): DeferredObj<void> {
    const columnIndex = this.getColumnIndex();

    if (columnIndex !== undefined) {
      const nextColumnIndex = getNextColumnIndex(direction, columnIndex);

      // Strategy 1: scroll to the grid's edge (beginning or end)
      if (this.needScrollToEdge(direction, columnIndex, nextColumnIndex)) {
        const scrollPosition = this.getEdgeScrollPosition(direction);

        event.originalEvent.preventDefault();

        return this.scrollLeft(scrollPosition);
      }

      // Strategy 2: scroll to reveal the next virtual column
      if (this._isColumnVirtual(nextColumnIndex)) {
        event.originalEvent.preventDefault();

        return this.scrollToNextCell(null, direction);
      }
    }

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return Deferred().resolve().promise();
  }

  private getEdgeScrollPosition(direction: NavigationDirection): number {
    const isForward = direction === 'next' || direction === 'nextInRow';

    if (this.option('rtlEnabled')) {
      return isForward ? this._getMaxHorizontalOffset() : 0;
    }

    return isForward ? 0 : this._getMaxHorizontalOffset();
  }

  private needScrollToEdge(
    direction: NavigationDirection,
    columnIndex: number,
    nextColumnIndex: number,
  ): boolean {
    const isFixedColumn = this._isFixedColumn(columnIndex);
    const isNextColumnRendered = this._isColumnRendered(nextColumnIndex);
    const needScrollPastFixed = isFixedColumn && !isNextColumnRendered;

    switch (direction) {
      case 'next': {
        const isLastColumn = this._getVisibleColumnCount() === nextColumnIndex;
        return isLastColumn || needScrollPastFixed;
      }
      case 'nextInRow':
        return this._getVisibleColumnCount() > nextColumnIndex && needScrollPastFixed;
      case 'previous': {
        const columnIndexOffset = this._columnsController.getColumnIndexOffset();
        const isAtLeftEdge = nextColumnIndex < 0 && columnIndexOffset === 0;
        return isAtLeftEdge || needScrollPastFixed;
      }
      case 'previousInRow':
        return nextColumnIndex >= 0 && needScrollPastFixed;
      default:
        return false;
    }
  }

  /**
   * Handles Tab key when a cell is being edited.
   * Moves focus and editing to the next/previous editable cell.
   * Returns true if tab was handled and further processing may be needed,
   * false if tab is fully handled or should fall through to native behavior.
   */
  private editingCellTabHandler(eventArgs: KeyDownEvent, direction: NavigationDirection): boolean {
    const eventTarget = eventArgs.originalEvent.target;
    const $targetCell = this.getCellElementFromTarget(eventTarget);

    // If focus is on an intermediate interactive element inside the cell,
    // let the browser cycle through elements within the cell first
    if (this.isOriginalTabHandlerRequired($targetCell, eventArgs)) {
      return false;
    }

    // Command cells (e.g. edit/delete buttons) delegate to non-editing tab handler
    if ($targetCell.is(COMMAND_CELL_SELECTOR)) {
      return !this.targetCellTabHandler(eventArgs, direction);
    }

    this._updateFocusedCellPosition($targetCell);

    const elementType = this.getElementType(eventTarget);
    const nextCellInfo = this.getNextCellByTabKey(
      eventArgs.originalEvent,
      direction,
      elementType,
    );
    const $nextCell = nextCellInfo.$cell;

    if (!$nextCell || this.handleTabKeyOnMasterDetailCell($nextCell, direction)) {
      return false;
    }

    this.focusAndEditNextCell($nextCell, nextCellInfo.isHighlighted, eventArgs.shift);

    return true;
  }

  /**
   * Focuses the next cell and starts editing if allowed.
   * Closes the current editor if the next cell is not editable.
   */
  private focusAndEditNextCell(
    $nextCell: dxElementWrapper,
    isHighlighted: boolean | undefined,
    isShift: boolean,
  ): void {
    const isEditingAllowed = this.canEditNextCell($nextCell);

    if (!isEditingAllowed) {
      this._closeEditCell();
    }

    const nextCellFocused = this._focusCell($nextCell, !isHighlighted);

    if (nextCellFocused) {
      if (!isRowOrFormEditMode(this._editingController.getEditMode()) && isEditingAllowed) {
        this._editFocusedCell();
      } else {
        this._focusInteractiveElement($nextCell, isShift);
      }
    }
  }

  /**
   * Checks whether editing is allowed in the given cell
   * based on the column's `allowEditing` flag and the row's editing permissions.
   */
  private canEditNextCell($cell: dxElementWrapper): boolean {
    const column = this._getColumnByCellElement($cell);

    if (!column?.allowEditing) {
      return false;
    }

    const $row = $cell.parent();
    const rowIndex = this._rowsView.getRowIndex($row);
    const row = this._dataController.items()[rowIndex];
    const isRowData = !row || row.rowType === 'data';

    return this._editingController.allowUpdating({ row }) && isRowData;
  }

  /**
   * Checks whether native browser tab behavior should be used.
   * Returns true when focus is on an interactive element inside a cell
   * that is not the boundary (last for Tab, first for Shift+Tab) interactive element,
   * meaning tab should cycle through elements within the cell first.
   */
  private isOriginalTabHandlerRequired($cell: dxElementWrapper, event: KeyDownEvent): boolean {
    const eventTarget = event.originalEvent.target;
    const elementType = this.getElementType(eventTarget);
    const $boundaryInteractiveElement = getInteractiveElement($cell, !event.shift);

    if (elementType !== 'cell' || $boundaryInteractiveElement.length === 0) {
      return false;
    }

    return eventTarget !== $boundaryInteractiveElement.get(0);
  }

  /**
   * Handles Tab key on a cell that is not being edited.
   * Moves focus to the next/previous cell and focuses its interactive elements.
   * Returns true if original (browser) tab behavior is required,
   * false if navigation was handled within the grid.
   */
  private targetCellTabHandler(eventArgs: KeyDownEvent, direction: NavigationDirection): boolean {
    const $event = eventArgs.originalEvent;
    let elementType = this.getElementType($event.target);
    const $cell = this.getCellElementFromTarget($event.target);

    // Non-editor cells with intermediate interactive elements use native tab
    if (!isEditorCell(this._editingController.getEditMode(), $cell)
      && this.isOriginalTabHandlerRequired($cell, eventArgs)) {
      return true;
    }

    // Initialize focused position when it hasn't been set yet
    if (
      this._focusedCellPosition.rowIndex === undefined
      && $($event.target).hasClass(VIEW_CLASSES.row)
    ) {
      this._updateFocusedCellPosition($cell);
    }

    if (this.isRowFocusType()) {
      this.setCellFocusType();
      elementType = this.getCellFocusElementType($event.target, elementType);
    }

    const nextCellInfo = this.getNextCellByTabKey($event, direction, elementType);

    if (!nextCellInfo.$cell) {
      return false;
    }

    // Handle row transition — fires focusedRowChanging event
    const $newFocusedCell: dxElementWrapper | undefined = this.checkNewLineTransition(
      $event,
      nextCellInfo.$cell,
    );

    if (!$newFocusedCell) {
      return false;
    }

    this._focusCell($newFocusedCell, !nextCellInfo.isHighlighted);

    if (!isEditorCell(this._editingController.getEditMode(), $newFocusedCell)) {
      this._focusInteractiveElement($newFocusedCell, eventArgs.shift);
    }

    return false;
  }

  /**
   * Returns the element type to navigate from after switching to cell focus mode.
   * If the target is a data row, it is the type of the row's first valid cell.
   */
  private getCellFocusElementType(
    target: Element,
    elementType: NavigationElementType,
  ): NavigationElementType {
    if (elementType === 'row' && isDataRow($(target))) {
      return this.getElementType(this.getFirstValidCellInRow($(target)));
    }

    return elementType;
  }

  /**
   * Finds the next cell for tab navigation and fires the `onFocusedCellChanging` event.
   * Returns `{ $cell, isHighlighted }` or an empty object if navigation was canceled.
   */
  private getNextCellByTabKey(
    $event: KeyboardEvent,
    direction: NavigationDirection,
    elementType: NavigationElementType,
  ): { $cell?: dxElementWrapper; isHighlighted?: boolean } {
    const $cell = this._getNextCell(direction, elementType);
    const args = $cell && this._fireFocusedCellChanging($event, $cell, true);

    if (!args || args.cancel) {
      return {};
    }

    return {
      $cell: args.$newCellElement ?? $cell,
      isHighlighted: args.isHighlighted,
    };
  }

  /**
   * Handles the row transition during tab navigation.
   * When the next cell belongs to a different row, fires the `onFocusedRowChanging` event.
   * Returns the target cell element, or undefined if the transition was canceled.
   */
  private checkNewLineTransition(
    $event: KeyboardEvent,
    $cell: dxElementWrapper,
  ): dxElementWrapper | undefined {
    const rowIndex = this.getVisibleRowIndex();
    const $row = $cell.parent();

    if (rowIndex !== this._getRowIndex($row)) {
      const cellPosition = this._getCellPosition($cell);
      const args = this._fireFocusedRowChanging($event, $row);

      if (args.cancel) {
        return undefined;
      }

      if (args.rowIndexChanged && cellPosition) {
        this.setFocusedColumnIndex(cellPosition.columnIndex);

        return this._getFocusedCell();
      }
    }

    return $cell;
  }

  /**
   * @extended: DataGrid's grouping
   */
  protected _enterKeyHandler(eventArgs: KeyboardKeyDownEvent, isEditing: boolean): void {
    const rowIndex = this.getVisibleRowIndex();
    const key = this._dataController.getKeyByRowIndex(rowIndex);
    const $cell = this._getFocusedCell();
    const needExpandAdaptiveRow = $cell?.hasClass(ADAPTIVITY_CLASSES.commandAdaptive);

    if (needExpandAdaptiveRow) {
      this.adaptiveColumnsController.toggleExpandAdaptiveDetailRow(key);

      this._updateFocusedCellPosition($cell);
    } else if (this.getMasterDetailCell($cell)?.is($cell)) {
      if ($cell.is(':focus')) {
        this.focusFirstInteractiveElementInside($cell);
      }
    } else if (!$cell?.hasClass(EDITING_CLASSES.commandEdit)) {
      this._processEnterKeyForDataCell(eventArgs, isEditing);
    }
  }

  private focusFirstInteractiveElementInside($el: dxElementWrapper): void {
    ($el.find(INTERACTIVE_ELEMENTS_SELECTOR).get(0) as HTMLElement).focus();
  }

  private _processEnterKeyForDataCell(eventArgs: KeyboardKeyDownEvent, isEditing: boolean): void {
    const direction = this._getEnterKeyDirection(eventArgs);
    const allowEditingOnEnterKey = this._allowEditingOnEnterKey();

    if (isEditing || (!allowEditingOnEnterKey && direction)) {
      this._handleEnterKeyEditingCell(eventArgs.originalEvent).done(() => {
        if (direction === 'next' || direction === 'previous') {
          this.targetCellTabHandler(eventArgs, direction);
        } else if (direction === 'upArrow' || direction === 'downArrow') {
          this._navigateNextCell(eventArgs.originalEvent, direction);
        }
      });
    } else if (allowEditingOnEnterKey) {
      this._startEditing(eventArgs);
    }
  }

  private _getEnterKeyDirection(eventArgs: KeyboardKeyDownEvent): NavigationKeyCode | undefined {
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

  private _handleEnterKeyEditingCell(event: DxEvent<KeyboardEvent>): DeferredObj<unknown> {
    const d = Deferred();
    const $cell = this.getCellElementFromTarget(event.target);
    const isRowOrFormMode = isRowOrFormEditMode(this._editingController.getEditMode());

    this._updateFocusedCellPosition($cell);

    if (isRowOrFormMode) {
      this._focusEditFormCell($cell);
      setTimeout(() => { this._editingController.saveEditData(); });
      d.resolve();
    } else {
      // @ts-expect-error eventsEngine.trigger is not fully typed
      eventsEngine.trigger($(event.target), 'change');
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._closeEditCell().always(d.resolve);

      event.preventDefault();
    }
    return d;
  }

  /**
   * @extended
   */
  protected _escapeKeyHandler(eventArgs: KeyboardKeyDownEvent, isEditing: boolean): boolean {
    const $cell = this.getCellElementFromTarget(eventArgs.originalEvent.target);

    if (isEditing) {
      this._updateFocusedCellPosition($cell);
      const editMode = this._editingController.getEditMode();

      if (!isRowOrFormEditMode(editMode)) {
        if (editMode === EDIT_MODE.cell) {
          this._editingController.cancelEditData();
        } else {
          this._closeEditCell();
        }
      } else {
        this._focusEditFormCell($cell);
        this._editingController.cancelEditData();
        if (this._dataController.items().length === 0) {
          this.resetFocusedCell();
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

  private _ctrlFKeyHandler(eventArgs: KeyboardKeyDownEvent): void {
    if (this.option('searchPanel.visible')) {
      const searchTextEditor = this.searchPanel.getSearchTextEditor();
      if (searchTextEditor) {
        searchTextEditor.focus();
        eventArgs.originalEvent.preventDefault();
      }
    }
  }

  private _f2KeyHandler(): void {
    const isEditing = this._editingController.isEditing();
    const rowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView?.getRow(rowIndex);

    if (!isEditing && isDataRow($row)) {
      this._startEditing();
    }
  }

  private _navigateNextCell(
    $event: DxEvent<KeyboardEvent>,
    keyCode: 'upArrow' | 'downArrow',
  ): boolean {
    const $cell = this._getNextCell(keyCode);
    const directionCode = this._getDirectionCodeByKey(keyCode);
    const isCellValid = $cell && this.isCellValid($cell);
    const result = isCellValid
      ? this._arrowKeysHandlerFocusCell($event, $cell, directionCode)
      : false;
    return result;
  }

  private _arrowKeysHandlerFocusCell(
    $event: DxEvent<KeyboardEvent>,
    $nextCell: dxElementWrapper,
    direction: DirectionCode | undefined,
  ): boolean {
    const isVerticalDirection = direction === 'prevRow' || direction === 'nextRow';

    const args = this._fireFocusChangingEvents(
      $event,
      $nextCell,
      isVerticalDirection,
      true,
    );

    const $newCell = args.$newCellElement;

    if (!args.cancel && this.isCellValid($newCell)) {
      this.applyFocus($newCell, !args.isHighlighted);
      return true;
    }
    return false;
  }

  private _beginFastEditing(originalEvent: DxEvent<KeyboardEvent>, isDeleting?: boolean): boolean {
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
        && (fastEditingKey.length === 1 || fastEditingKey === FAST_EDITING_DELETE_KEY)
      ) {
        this._startEditing(originalEvent, fastEditingKey);
      }
    }

    return true;
  }

  // ## Quick navigation through grid rows
  private isQuickNavigationPossible(): boolean {
    const visibleRowIndex = this.getVisibleRowIndex();
    const $row = this._rowsView?.getRow(visibleRowIndex);
    const dataRowTemplate = this.option('dataRowTemplate');
    const isEditRowByIndex = this._editingController?.isEditRowByIndex?.(visibleRowIndex);

    return !isEditRowByIndex && !dataRowTemplate && isDataRow($row);
  }

  private getFirstOrLastColumnIndex(needFirstColumnIndex: boolean): number {
    const allVisibleColumns = this._columnsController.getVisibleColumns(null, true);
    const findColumnIndex = (column: Column): boolean => this.isFocusableColumn(column);

    return needFirstColumnIndex
      ? allVisibleColumns.findIndex(findColumnIndex)
      : allVisibleColumns.map(findColumnIndex).lastIndexOf(true);
  }

  private getFirstOrLastRowIndex(needFirstRow: boolean): number {
    const rowCount = this.isVirtualScrolling()
      ? this.dataSourceController.totalItemsCount()
      : this._dataController.items(true)?.length;

    return needFirstRow ? 0 : rowCount - 1;
  }

  private calculateScrollLeft(needScrollToFirstCell: boolean): number {
    const result = needScrollToFirstCell ? 0 : this._getMaxHorizontalOffset();
    const isNeedToRenderVirtualColumns = this._columnsController
      ?.isNeedToRenderVirtualColumns(result);

    return isNeedToRenderVirtualColumns ? result : -1;
  }

  private calculateScrollTop(needScrollToFirstCell: boolean): number {
    const maxVerticalOffset = this._getMaxVerticalOffset();
    const hasScroll = maxVerticalOffset > 0;
    const isVirtualRowRender = this._isVirtualRowRender();

    if (isVirtualRowRender && hasScroll) {
      return needScrollToFirstCell ? 0 : maxVerticalOffset;
    }

    return -1;
  }

  private scrollTo(scrollOffset: ScrollOffset): void {
    const scrollable = this._rowsView?.getScrollable();

    scrollable?.scrollTo(scrollOffset);
  }

  private focusFirstOrLastCell(e?: KeyboardEvent): void {
    const $cell = this._getFocusedCell();

    this._focusElement($cell, true, e);
    this._rowsView.getScrollable()?.update();
  }

  private navigateToFirstOrLastRow(needNavigateToFirstCell: boolean, e: KeyboardEvent): void {
    const scrollTop = this.calculateScrollTop(needNavigateToFirstCell);
    const firstOrLastRowIndex = this.getFirstOrLastRowIndex(needNavigateToFirstCell);
    const firstOrLastColumnIndex = this.getFirstOrLastColumnIndex(needNavigateToFirstCell);

    this.silentUpdateFocusedCellPosition({
      columnIndex: firstOrLastColumnIndex,
      rowIndex: firstOrLastRowIndex,
    });

    if (scrollTop >= 0) {
      this._needNavigationToCell = true;
      this.scrollTo({ top: scrollTop });
    } else {
      this.navigateToFirstOrLastCell(needNavigateToFirstCell, e);
    }
  }

  private homeOrEndKeyHandler(e: KeyDownEvent): void {
    if (!this.isQuickNavigationPossible()) {
      return;
    }

    const needNavigateToFirstCell = e.keyName === 'home';

    if (isCommandKeyPressed(e.originalEvent)) {
      this.navigateToFirstOrLastRow(needNavigateToFirstCell, e.originalEvent);
    } else {
      this.navigateToFirstOrLastCell(needNavigateToFirstCell, e.originalEvent);
    }
    e.originalEvent.preventDefault();
  }

  protected isFocusableColumn(column: Column): boolean {
    return column.type !== DRAG_COLUMN_NAME;
  }

  public navigateToFirstOrLastCell(needNavigateToFirstCell: boolean, e?: KeyboardEvent): void {
    const firstOrLastColumnIndex = this.getFirstOrLastColumnIndex(needNavigateToFirstCell);

    this._needNavigationToCell = false;

    if (firstOrLastColumnIndex < 0) {
      return;
    }

    const scrollLeft = this.calculateScrollLeft(needNavigateToFirstCell);

    this.silentUpdateFocusedCellPosition({ columnIndex: firstOrLastColumnIndex });

    if (scrollLeft >= 0) {
      this.deferFocusRestore();
      this.scrollTo({ left: scrollLeft });
    } else if (this.isFocusedRowRenderPending()) {
      this.deferFocusRestore();
    } else {
      this.focusFirstOrLastCell(e);
    }
  }

  private deferFocusRestore(): void {
    this.needToRestoreFocus = true;
    this.focusRestoreScrollTop = this._rowsView.getScrollable()?.scrollTop() ?? 0;
  }

  public cancelFocusRestoreOnScrollAway(scrollTop: number): void {
    const isScrolledAway = Math.abs(scrollTop - this.focusRestoreScrollTop) >= 1;

    if (this.needToRestoreFocus && isScrolledAway && this.isFocusedRowRenderPending()) {
      this.needToRestoreFocus = false;
    }
  }

  private isFocusedRowRenderPending(): boolean {
    const rowIndex = this._focusedCellPosition?.rowIndex ?? -1;

    if (rowIndex < 0 || rowIndex > this.getFirstOrLastRowIndex(false)) {
      return false;
    }

    return !this._rowsView.getRow(this.getVisibleRowIndex())?.length;
  }

  public isQuickNavigationToFirstCell(): boolean {
    const firstColumnIndex = this.getFirstOrLastColumnIndex(true);

    return this._focusedCellPosition?.columnIndex === firstColumnIndex;
  }
  // #endregion Key_Handlers

  // #region Pointer_Event_Handler
  public pointerEventHandler(e: { event: DxEvent } | DxEvent): void {
    const event = 'event' in e ? e.event : e;
    let $target = $(event.currentTarget);
    const focusedViewElement = this._rowsView?.element();
    const $parent = $target.parent();
    const isInteractiveElement = $(event.target).is(INTERACTIVE_ELEMENTS_SELECTOR);
    const isRevertButton = !!$(event.target).closest(`.${CLASSES.revertButton}`).length;
    const isExpandCommandCell = $target.hasClass(COLUMNS_CONTROLLER_CLASSES.commandExpand);

    if (!this._isEventInCurrentGrid(event)) {
      return;
    }

    if (
      !isRevertButton
      && (this.isCellValid($target, !isInteractiveElement) || isExpandCommandCell)
    ) {
      $target = this._isInsideEditForm($target) ? $(event.target) : $target;

      this._focusView();
      $(focusedViewElement).removeClass(CLASSES.focusState);

      if ($parent.hasClass(VIEW_CLASSES.freeSpaceRow)) {
        this._updateFocusedCellPosition($target);
        const $focusedViewElement = this._focusedView?.element();
        if ($focusedViewElement) {
          this.applyTabIndexToElement($focusedViewElement);
        }
        this._focusedView?.focus(true);
      } else if (!this.getMasterDetailCell($target)) {
        this._clickTargetCellHandler(event, $target);
      } else {
        this._updateFocusedCellPosition($target);
      }
    } else if ($target.is('td')) {
      this.resetFocusedCell();
    }
  }

  private _clickTargetCellHandler(event: DxEvent, $cell: dxElementWrapper): void {
    const column = this._getColumnByCellElement($cell);
    const isCellOrBatchEditMode = isCellBasedEditMode(this._editingController.getEditMode());
    const isEditing = this._editingController.isEditing();

    this.setCellFocusType();

    const args = this._fireFocusChangingEvents(event, $cell, true);
    let $targetCell = args.$newCellElement;
    if (!args.cancel) {
      if (args.resetFocusedRow) {
        this._focusController._resetFocusedRow();
        return;
      }

      if (args.rowIndexChanged) {
        $targetCell = this._getFocusedCell();
      }

      if (!args.isHighlighted && !isCellOrBatchEditMode) {
        this.setRowFocusType();
      }

      this._updateFocusedCellPosition($targetCell);

      if (this._allowRowUpdating() && isCellOrBatchEditMode && column?.allowEditing) {
        this._isNeedFocus = false;
        this._isHiddenFocus = false;
      } else {
        $targetCell = this._getFocusedCell();
        const $target = $(event.target).closest(`${NON_FOCUSABLE_ELEMENTS_SELECTOR}, td`);
        const skipFocusEvent = $target.not($targetCell).is(NON_FOCUSABLE_ELEMENTS_SELECTOR);
        const isEditCell = !column?.command
          && isEditing
          && $targetCell.hasClass(EDITING_CLASSES.editorCell);

        const isDisabled = !isEditCell && (!args.isHighlighted || skipFocusEvent);
        this.applyFocus($targetCell, isDisabled, skipFocusEvent);
      }
    } else {
      this.setRowFocusType();
      this.setFocusedRowIndex(args.prevRowIndex);
      if (isEditing && isCellOrBatchEditMode) {
        this._closeEditCell();
      }
    }
  }

  private _allowRowUpdating(): boolean {
    const rowIndex = this.getVisibleRowIndex();
    const row = this._dataController.items()[rowIndex];

    return this._editingController.allowUpdating({ row }, 'click', false);
  }
  // #endregion Pointer_Event_Handler

  // #region Focusing
  public focus(element?: UserDefinedElement | dxElementWrapper): void {
    const isHighlighted = this.isCellElement($(element));
    let elementToFocus = element;

    if (!elementToFocus) {
      const activeRowSelector = `.${this.addWidgetPrefix(VIEW_CLASSES.rowsView)} .${VIEW_CLASSES.row}[tabindex]`;
      const activeCellSelector = `.${this.addWidgetPrefix(VIEW_CLASSES.rowsView)} .${VIEW_CLASSES.row} > td[tabindex]`;
      const selectors = [activeRowSelector, activeCellSelector].join(', ');
      elementToFocus = this.component.$element().find(selectors).first();
    }

    if (elementToFocus) {
      this._focusElement($(elementToFocus), isHighlighted);
    }
  }

  protected getFocusedView(): RowsView {
    return this.getView('rowsView');
  }

  public setupFocusedView(): void {
    if (this.isKeyboardEnabled() && !isDefined(this._focusedView)) {
      this._focusView();
    }
  }

  private _focusElement(
    $element: dxElementWrapper,
    isHighlighted: boolean,
    event?: KeyboardEvent,
  ): void {
    const rowsViewElement = $(this._getRowsViewElement());
    const $focusedView = $element.closest(rowsViewElement);
    const isRowFocusType = this.isRowFocusType();
    let args: FocusChangingArgs = {};
    let $elementToFocus = $element;

    if (
      !$focusedView.length
      || (this.isCellElement($element) && !this.isCellValid($element))
    ) {
      return;
    }

    this._focusView();
    this._isNeedFocus = true;
    this._isNeedScroll = true;

    if (this.isCellElement($element) || isGroupRow($element)) {
      this.setCellFocusType();
      const focusChangingArgs = this._fireFocusChangingEvents(
        event,
        $element,
        true,
        isHighlighted,
      );
      args = focusChangingArgs;
      $elementToFocus = focusChangingArgs.$newCellElement;

      if (isRowFocusType && !args.isHighlighted) {
        this.setRowFocusType();
      }
    }

    if (!args.cancel) {
      this.applyFocus($elementToFocus, !args.isHighlighted);

      if (this.getElementType($elementToFocus) !== 'row' || isEditRow($elementToFocus)) {
        this._focusInteractiveElement($elementToFocus);
      }
    }
  }

  private isInsideFocusedView($element: dxElementWrapper): boolean {
    const $focusedViewElement = this._focusedView?.element();

    return !!$focusedViewElement && $element.closest($focusedViewElement).length !== 0;
  }

  private _focusView(): void {
    this._focusedView = this._rowsView;
  }

  private _resetFocusedView(): void {
    this.setRowFocusType();
    this._focusedView = null;
  }

  private _focusInteractiveElement($cell: dxElementWrapper, isLast?: boolean): void {
    if (!$cell) {
      return;
    }

    const $focusedElement = getInteractiveElement($cell, isLast);

    /// #DEBUG
    this._testInteractiveElement = $focusedElement;
    /// #ENDDEBUG

    gridCoreUtils.focusAndSelectElement(this, $focusedElement);
  }

  public applyFocus(
    $cell: dxElementWrapper,
    disableFocus?: boolean,
    skipFocusEvent?: boolean,
    preventScroll?: boolean,
  ): void {
    const $row = $cell && !$cell.hasClass(VIEW_CLASSES.row)
      ? $cell.closest(`.${VIEW_CLASSES.row}`)
      : $cell;

    if ($row && isNotFocusedRow($row)) {
      return;
    }

    const focusedView = this._focusedView;
    const $focusViewElement = focusedView?.element();
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if-chain
    let $focusElement: dxElementWrapper | undefined;

    this._isHiddenFocus = disableFocus;

    const isRowFocus = isGroupRow($row) || isGroupFooterRow($row) || this.isRowFocusType();

    if (isRowFocus) {
      $focusElement = $row;
      if (focusedView) {
        this.setFocusedRowIndex(this._getRowIndex($row));
      }
    } else if (this.isCellElement($cell)) {
      $focusElement = $cell;
      this._updateFocusedCellPosition($cell);
    }
    if ($focusElement) {
      if ($focusViewElement) {
        $focusViewElement
          .find(`.${VIEW_CLASSES.row}[tabindex], .${VIEW_CLASSES.row} > td[tabindex]`)
          .filter((i, node) => gridCoreUtils.isElementInCurrentGrid(this, $(node)))
          .not($focusElement)
          .removeClass(EDITING_CLASSES.cellFocusDisabled)
          .removeClass(CLASSES.focused)
          .removeAttr('tabindex');
      }

      eventsEngine.one($focusElement, 'blur', (e) => {
        if (e.relatedTarget) {
          $focusElement
            .removeClass(EDITING_CLASSES.cellFocusDisabled)
            .removeClass(CLASSES.focused);
        }
      });
      if (!skipFocusEvent) {
        this.applyTabIndexToElement($focusElement);
        if (preventScroll) {
          ($focusElement.get(0) as HTMLElement | undefined)?.focus({ preventScroll });
        } else {
          // @ts-expect-error eventsEngine.trigger is not fully typed
          eventsEngine.trigger($focusElement, 'focus');
        }
      }
      if (disableFocus) {
        $focusElement.addClass(EDITING_CLASSES.cellFocusDisabled);
        if (isRowFocus) {
          $cell.addClass(EDITING_CLASSES.cellFocusDisabled);
        }
      } else {
        this._editorFactory.focus($focusElement);
      }
    }
  }

  public updateFocus(isRenderView: boolean, skipFocusEvent = false): void {
    this._updateFocusTimeout = setTimeout(() => {
      if (this._needFocusEditingCell()) {
        this._editingController._focusEditingCell();
        return;
      }

      let $cell: dxElementWrapper | null = this._getFocusedCell();
      const isEditing = this._editingController.isEditing();
      const isRowOrFormMode = isRowOrFormEditMode(this._editingController.getEditMode());

      if (this.getMasterDetailCell($cell) && !isRowOrFormMode) {
        return;
      }

      if (this._hasSkipRow($cell.parent())) {
        const focusedRowIndex = this._focusedCellPosition?.rowIndex;
        const direction = focusedRowIndex !== undefined && focusedRowIndex > 0
          ? 'upArrow'
          : 'downArrow';
        $cell = this._getNextCell(direction);
      }

      if (!$cell || !isElementDefined($cell)) {
        return;
      }

      if (
        $cell.is('td')
        || $cell.hasClass(this.addWidgetPrefix(EDITING_CLASSES.editFormItem))
      ) {
        const isCommandCell = $cell.is(COMMAND_CELL_SELECTOR);
        const $focusedElementInsideCell = $cell.find(':focus');
        const isFocusedElementDefined = isElementDefined($focusedElementInsideCell);
        const column = this._getColumnByCellElement($cell);
        const canFocusEditor = isRenderView || !isCommandCell;

        if (canFocusEditor && this._editorFactory.focus()) {
          if (isCommandCell && isFocusedElementDefined) {
            gridCoreUtils.focusAndSelectElement(
              this,
              $focusedElementInsideCell,
            );
            return;
          }
          if (!isFocusedElementDefined) {
            this.applyFocus($cell, false, skipFocusEvent, isRenderView);
          }
        } else if (
          !isFocusedElementDefined
          && (this._isNeedFocus || this._isHiddenFocus)
        ) {
          this.applyFocus($cell, this._isHiddenFocus, skipFocusEvent, isRenderView);
        }
        if (isEditing && !column?.showEditorAlways) {
          this._focusInteractiveElement.bind(this)($cell);
        }
      } else {
        // @ts-expect-error eventsEngine.trigger is not fully typed
        eventsEngine.trigger($cell, 'focus');
      }
    });
  }

  private _needFocusEditingCell(): boolean | undefined {
    const isCellEditMode = this._editingController.getEditMode() === EDIT_MODE.cell;
    const isBatchEditMode = this._editingController.getEditMode() === EDIT_MODE.batch;

    const cellEditModeHasChanges = isCellEditMode && this._editingController.hasChanges();
    const isNewRowBatchEditMode = isBatchEditMode && this._editingController.isNewRowInEditMode();
    const hasEditingChanges = cellEditModeHasChanges || isNewRowBatchEditMode;

    const $cell = this._getFocusedCell();
    const isCellFocusable = $cell.children().length === 0
      || $cell.find(FOCUSABLE_ELEMENT_SELECTOR).length > 0;

    return isCellFocusable && hasEditingChanges;
  }

  private _updateFocusedCellPositionByTarget(target: EventTarget | null): void {
    const elementType = this.getElementType(target);
    if (elementType === 'row' && isDefined(this._focusedCellPosition?.columnIndex)) {
      const $row = $(target);
      if (this._focusedView && isGroupRow($row)) {
        this.setFocusedRowIndex(this._getRowIndex($row));
      }
    } else {
      this._updateFocusedCellPosition(this.getCellElementFromTarget(target));
    }
  }

  private _focusCell($cell: dxElementWrapper, isDisabled?: boolean): boolean {
    if (this.isCellValid($cell)) {
      this.applyFocus($cell, isDisabled);
      return true;
    }

    return false;
  }

  private _focusEditFormCell($cell: dxElementWrapper): void {
    if ($cell.hasClass(MASTER_DETAIL_CLASSES.detailCell)) {
      this._editorFactory.focus($cell, true);
    }
  }

  public resetFocusedCell(preventScroll?: boolean): void {
    const $cell = this._getFocusedCell();

    if (isElementDefined($cell)) {
      $cell.removeAttr('tabindex').removeClass(EDITING_CLASSES.cellFocusDisabled);
    }
    this._isNeedFocus = false;
    this._isNeedScroll = false;
    this._focusedCellPosition = {};
    clearTimeout(this._updateFocusTimeout);
    this._focusedView?.renderFocusState({ preventScroll });
  }

  private restoreFocusableElement(rowIndex?: number, $event?: Event): void {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- set in the up-arrow branch
    let args: FocusedRowChangingArgs | undefined;
    const isUpArrow = isDefined(rowIndex);
    const $rowsViewElement = this._rowsView.element();

    if (!$rowsViewElement) {
      return;
    }

    const { columnIndex } = this._focusedCellPosition;
    const rowIndexOffset = this._dataController.getRowIndexOffset();

    let newRowIndex = isUpArrow
      ? rowIndex
      : this._rowsView.getTopVisibleItemIndex() + rowIndexOffset;

    if (!isUpArrow) {
      this._editorFactory.loseFocus();
      this.applyTabIndexToElement($rowsViewElement);
      // @ts-expect-error eventsEngine.trigger is not fully typed
      eventsEngine.trigger($rowsViewElement, 'focus');
    } else {
      // @ts-expect-error getRow() is typed as possibly undefined
      const $rowElement: dxElementWrapper = this._rowsView.getRow(newRowIndex - rowIndexOffset);
      args = this._fireFocusedRowChanging($event, $rowElement);

      if (!args.cancel && args.rowIndexChanged) {
        newRowIndex = args.newRowIndex;
      }
    }

    if (!isUpArrow || !args?.cancel) {
      this.setFocusedCellPosition(newRowIndex, columnIndex);
    }

    if (isUpArrow) {
      this.updateFocus(false);
    }
  }

  // #endregion Focusing
  // #region Cell_Position
  private silentUpdateFocusedCellPosition(
    newFocusedCellPosition: Partial<CellPosition>,
  ): void {
    this._focusedCellPosition = {
      ...this._focusedCellPosition ?? {},
      ...newFocusedCellPosition,
    };
  }

  private _getNewPositionByCode(
    cellPosition: Partial<CellPosition>,
    elementType: NavigationElementType | undefined,
    code: NavigationKeyCode,
  ): Partial<CellPosition> {
    const { columnIndex, rowIndex } = cellPosition;

    if (rowIndex === undefined) {
      return code === 'next' ? { columnIndex: 0, rowIndex: 0 } : { columnIndex, rowIndex };
    }

    const visibleColumnsCount = this._getVisibleColumnCount();

    switch (code) {
      case 'nextInRow':
      case 'next':
        if (
          columnIndex !== undefined
          && columnIndex < visibleColumnsCount - 1
          && elementType !== 'row'
          && this._hasValidCellAfterPosition({ columnIndex, rowIndex })
        ) {
          return { columnIndex: columnIndex + 1, rowIndex };
        }
        if (!this._isLastRow(rowIndex) && code === 'next') {
          return { columnIndex: 0, rowIndex: rowIndex + 1 };
        }
        return { columnIndex, rowIndex };
      case 'previousInRow':
      case 'previous':
        if (
          columnIndex !== undefined
          && columnIndex > 0
          && elementType !== 'row'
          && this.hasValidCellBeforePosition({ columnIndex, rowIndex })
        ) {
          return { columnIndex: columnIndex - 1, rowIndex };
        }
        if (rowIndex > 0 && code === 'previous') {
          return { columnIndex: visibleColumnsCount - 1, rowIndex: rowIndex - 1 };
        }
        return { columnIndex, rowIndex };
      case 'upArrow':
        return { columnIndex, rowIndex: rowIndex > 0 ? rowIndex - 1 : rowIndex };
      case 'downArrow':
        return { columnIndex, rowIndex: !this._isLastRow(rowIndex) ? rowIndex + 1 : rowIndex };
      default:
        return { columnIndex, rowIndex };
    }
  }

  public getColumnIndex(): number | undefined {
    return this._focusedCellPosition
      ? this._focusedCellPosition.columnIndex
      : -1;
  }

  /**
   * @extended: TreeList's keyboard navigation
   */
  public getVisibleRowIndex(): number {
    const rowIndex = this._focusedCellPosition?.rowIndex;
    return !isDefined(rowIndex) || rowIndex < 0
      ? -1
      : rowIndex - this._dataController.getRowIndexOffset();
  }

  public getVisibleColumnIndex(): number {
    const columnIndex = this._focusedCellPosition?.columnIndex;
    return !isDefined(columnIndex)
      ? -1
      : columnIndex - this._columnsController.getColumnIndexOffset();
  }

  private _isCellByPositionValid(cellPosition: CellPosition): boolean {
    const $cell = $(this._getCell(cellPosition));
    return this.isCellValid($cell);
  }

  private getMaxRowIndex(): number {
    const lastLoadedRowIndex = this._dataController.items().length - 1;
    const virtualItemsCount = this._dataController.virtualItemsCount?.();

    if (!virtualItemsCount) {
      return lastLoadedRowIndex;
    }

    return lastLoadedRowIndex + this._dataController.getRowIndexOffset() + virtualItemsCount.end;
  }

  private _isLastRow(rowIndex: number): boolean {
    if (this._isVirtualRowRender()) {
      return rowIndex >= this.getMaxRowIndex();
    }

    const lastVisibleIndex = Math.max(
      ...this._dataController.items()
        .map((item, index) => (item.visible !== false ? index : -1)),
    );

    return rowIndex === lastVisibleIndex;
  }

  protected isFirstValidCell(cellPosition: Partial<CellPosition>): boolean {
    const { columnIndex, rowIndex } = cellPosition;

    if (rowIndex !== 0 || columnIndex === undefined) {
      return false;
    }

    if (this.isFullRowFocusType(rowIndex) && columnIndex > 0) {
      return true;
    }

    return columnIndex >= 0 && !this.hasValidCellBeforePosition({ columnIndex, rowIndex });
  }

  private hasValidCellBeforePosition(cellPosition: CellPosition): boolean {
    let { columnIndex } = cellPosition;
    let hasValidCells = false;

    while (columnIndex > 0 && !hasValidCells) {
      columnIndex -= 1;
      const checkingPosition = {
        columnIndex,
        rowIndex: cellPosition.rowIndex,
      };

      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }
    return hasValidCells;
  }

  private _hasValidCellAfterPosition(cellPosition: CellPosition): boolean {
    let { columnIndex } = cellPosition;
    let hasValidCells = false;
    const visibleColumnCount = this._getVisibleColumnCount();

    while (columnIndex < visibleColumnCount - 1 && !hasValidCells) {
      columnIndex += 1;
      const checkingPosition = {
        columnIndex,
        rowIndex: cellPosition.rowIndex,
      };

      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }
    return hasValidCells;
  }

  protected isLastValidCell(cellPosition: Partial<CellPosition>): boolean {
    const { columnIndex, rowIndex } = cellPosition;

    if (rowIndex === undefined || !this._isLastRow(rowIndex)) {
      return false;
    }

    if (this.isFullRowFocusType(rowIndex) && columnIndex !== undefined && columnIndex > 0) {
      return true;
    }

    if (columnIndex === this._getVisibleColumnCount() - 1) {
      return true;
    }

    const nextColumnIndex = columnIndex !== undefined && columnIndex >= 0 ? columnIndex + 1 : 0;
    const checkingPosition = { columnIndex: nextColumnIndex, rowIndex };

    if (this._isCellByPositionValid(checkingPosition)) {
      return false;
    }

    return this.isLastValidCell(checkingPosition);
  }

  private isFullRowFocusType(rowIndex: number): boolean {
    const visibleRows = this._dataController.getVisibleRows();
    const row = visibleRows?.[rowIndex];

    return row?.rowType === 'group' || row?.rowType === 'groupFooter';
  }

  // #endregion Cell_Position
  // #region DOM_Manipulation
  /**
   * @extended: adaptivity
   */
  public isCellValid($cell: dxElementWrapper, isClick?: boolean): boolean {
    if (!isElementDefined($cell)) {
      return false;
    }

    const $row = $cell.parent();
    const column = this._getColumnByCellElement($cell);

    const isDragCell = GridCoreKeyboardNavigationDom.isDragCell($cell);
    if (isDragCell) {
      return false;
    }

    if (this.getMasterDetailCell($cell)) {
      return true;
    }

    if (column && isNavigableColumnCell($cell, column)) {
      const rowItems = this._dataController.items();
      const visibleRowIndex = this._rowsView.getRowIndex($row);
      const row = rowItems[visibleRowIndex];
      const isCellEditing = this._editingController
        && isCellBasedEditMode(this._editingController.getEditMode())
        && this._editingController.isEditing();
      const isRowEditingInCurrentRow = this._editingController?.isEditRow(visibleRowIndex);
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

      return !isEditing || !!column.allowEditing || !!isClick;
    }

    return false;
  }

  public getFirstValidCellInRow(
    $row: dxElementWrapper,
    columnIndex?: number,
  ): dxElementWrapper | undefined {
    const $cells = $row.find('> td');
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the loop below
    let $result: dxElementWrapper | undefined;

    const startIndex = columnIndex || 0;

    for (let i = startIndex; i < $cells.length; i += 1) {
      const $cell = $cells.eq(i);
      if (this.isCellValid($cell)) {
        $result = $cell;
        break;
      }
    }

    return $result;
  }

  private _getNextCell(
    keyCode: NavigationKeyCode,
    elementType?: NavigationElementType,
    cellPosition?: Partial<CellPosition>,
  ): dxElementWrapper | null {
    const focusedPosition = cellPosition ?? this._focusedCellPosition;

    if (!this._focusedView || !focusedPosition) {
      return null;
    }

    const newPosition = this._getNewPositionByCode(focusedPosition, elementType, keyCode);
    const $cell = $(this._getCell(newPosition));
    const $adjustedCell = this.adjustCellOnVerticalNav($cell, newPosition, keyCode);
    const $validCell = this.resolveInvalidCell($adjustedCell, newPosition, keyCode);

    return this.resolveHiddenRowCell($validCell, focusedPosition, keyCode);
  }

  // T1322130, T1322440: During vertical navigation, command cells (e.g. expand)
  // may be invalid because their column inherits groupIndex from the grouped data column.
  // Find the first valid data cell in the target row instead of recursing to the next row.
  private adjustCellOnVerticalNav(
    $cell: dxElementWrapper,
    position: Partial<CellPosition>,
    keyCode: NavigationKeyCode,
  ): dxElementWrapper {
    const isVerticalNav = keyCode === 'upArrow' || keyCode === 'downArrow';

    if (!isVerticalNav || !isElementDefined($cell) || this.isCellValid($cell)) {
      return $cell;
    }

    const { columnIndex } = position;
    const visibleColumns = this._columnsController.getVisibleColumns(null, true);
    const column = columnIndex === undefined ? undefined : visibleColumns[columnIndex];

    if (column?.command === 'expand') {
      return this.getFirstValidCellInRow($cell.parent(), columnIndex) ?? $cell;
    }

    return $cell;
  }

  private resolveInvalidCell(
    $cell: dxElementWrapper,
    position: Partial<CellPosition>,
    keyCode: NavigationKeyCode,
  ): dxElementWrapper | null | undefined {
    if (!isElementDefined($cell) || this.isCellValid($cell)) {
      return $cell;
    }

    const isRowFocus = this.isRowFocusType();
    const includeCommandCells = isRowFocus || keyCode === 'next' || keyCode === 'previous';
    const isBoundaryCell = keyCode === 'previous'
      ? this.isFirstValidCell(position)
      : this.isLastValidCell(position);

    if (!this._isCellInRow(position, includeCommandCells) || isBoundaryCell) {
      return $cell;
    }

    return isRowFocus
      ? this.getFirstValidCellInRow($cell.parent(), position.columnIndex)
      : this._getNextCell(keyCode, 'cell', position);
  }

  private resolveHiddenRowCell(
    $cell: dxElementWrapper | null | undefined,
    originalPosition: Partial<CellPosition>,
    keyCode: NavigationKeyCode,
  ): dxElementWrapper | null {
    if (!$cell || !isElementDefined($cell)) {
      return null;
    }

    const $row = $cell.parent();

    if (!this._hasSkipRow($row)) {
      return $cell;
    }

    const rowIndex = this._getRowIndex($row);

    if (this._isLastRow(rowIndex)) {
      return null;
    }

    return this._getNextCell(keyCode, 'row', {
      columnIndex: originalPosition.columnIndex,
      rowIndex,
    });
  }

  // #endregion DOM_Manipulation
  // #region Editing
  private _startEditing(eventArgs?: StartEditingEvent, fastEditingKey?: string): void {
    const focusedCellPosition = this._focusedCellPosition;
    const visibleRowIndex = this.getVisibleRowIndex();
    const visibleColumnIndex = this.getVisibleColumnIndex();
    const row = this._dataController.items()[visibleRowIndex];
    const column = this._columnsController.getVisibleColumns()[visibleColumnIndex];

    if (this.isAllowEditing(row, column)) {
      if (isRowOrFormEditMode(this._editingController.getEditMode())) {
        this._editingController.editRow(visibleRowIndex);
      } else if (focusedCellPosition) {
        this._startEditCell(eventArgs, fastEditingKey);
      }
    }
  }

  public isAllowEditing(
    row: ProcessedItem | undefined,
    column: Column | undefined,
  ): boolean {
    return this._editingController.allowUpdating({ row }) && !!column?.allowEditing;
  }

  private _editFocusedCell(): EditCellResult {
    const rowIndex = this.getVisibleRowIndex();
    const colIndex = this.getVisibleColumnIndex();

    return this._editingController.editCell(rowIndex, colIndex);
  }

  private _startEditCell(
    eventArgs: StartEditingEvent | undefined,
    fastEditingKey: string | undefined,
  ): void {
    this._fastEditingStarted = isDefined(fastEditingKey);
    const editResult = this._editFocusedCell();
    const isEditResultDeferred = isDeferred(editResult);
    const isFastEditingStarted = this.isFastEditingStarted();

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

  private _editingCellHandler(
    eventArgs: StartEditingEvent | undefined,
    editorValue: string | undefined,
  ): void {
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
    // @ts-expect-error eventsEngine.trigger is not fully typed
    eventsEngine.trigger($input, keyDownEvent);

    if (!keyDownEvent.isDefaultPrevented()) {
      // @ts-expect-error eventsEngine.trigger is not fully typed
      eventsEngine.trigger($input, keyPressEvent);
      if (!keyPressEvent.isDefaultPrevented()) {
        const timeout = browser.mozilla ? 25 : 0; // T882996
        setTimeout(() => {
          const inputValue = this._getKeyPressInputValue($input, editorValue);
          $input.val(inputValue);

          const $widgetContainer = $input.closest(`.${CLASSES.widget}`);
          eventsEngine.off($widgetContainer, 'focusout'); // for NumberBox to save entered symbol
          eventsEngine.one($widgetContainer, 'focusout', () => {
            // @ts-expect-error eventsEngine.trigger is not fully typed
            eventsEngine.trigger($input, 'change');
          });
          // @ts-expect-error eventsEngine.trigger is not fully typed
          eventsEngine.trigger($input, inputEvent);
        }, timeout);
      }
    }
  }

  /*
  * NOTE: See the T1203026 ticket.
  * The method is created for cases where the editor in the column is formatted
  * according to the 'decimal' type.
  * After the native event 'keydown', the '-' sign is formatted by the editor into '-0'.
  * Subsequent assignment of '-' to the editor's value is treated as a text change,
  * causing the inversion of the value from '-0' to '0'.
  * To prevent this inversion, it is necessary to assign to the value
  * the same content as in the editor: '-0'.
  */
  private _getKeyPressInputValue(
    $input: dxElementWrapper,
    editorValue: string | undefined,
  ): string | undefined {
    const inputCurrentValue = $input.val();

    return editorValue === '-' && inputCurrentValue === '-0'
      ? '-0'
      : editorValue;
  }

  // #endregion Editing
  // #region Events
  private _fireFocusChangingEvents(
    $event: Event | undefined,
    $cell: dxElementWrapper,
    fireRowEvent: boolean,
    isHighlighted?: boolean,
  ): FocusChangingResult {
    let args: FocusChangingArgs = {};
    const cellPosition = this._getCellPosition($cell) ?? { columnIndex: -1, rowIndex: -1 };
    let $targetCell = $cell;
    let isTargetHighlighted = isHighlighted;

    if (this.isCellFocusType()) {
      const cellArgs = this._fireFocusedCellChanging($event, $cell, isHighlighted);
      args = cellArgs;
      if (!cellArgs.cancel) {
        cellPosition.columnIndex = cellArgs.newColumnIndex;
        cellPosition.rowIndex = cellArgs.newRowIndex;
        isTargetHighlighted = cellArgs.isHighlighted;
        $targetCell = $(this._getCell(cellPosition));
      }
    }

    if (!args.cancel && fireRowEvent && $targetCell) {
      const rowArgs = this._fireFocusedRowChanging($event, $targetCell.parent());
      args = rowArgs;
      if (!rowArgs.cancel) {
        cellPosition.rowIndex = rowArgs.newRowIndex;
        rowArgs.isHighlighted = isTargetHighlighted;
      }
    }

    const $cellAtPosition = $(this._getCell(cellPosition));
    const $newCellElement = $cellAtPosition.length ? $cellAtPosition : $targetCell;

    return Object.assign(args, { $newCellElement });
  }

  private _fireFocusedCellChanging(
    $event: Event | undefined,
    $cellElement: dxElementWrapper,
    isHighlighted?: boolean,
  ): FocusedCellChangingArgs {
    const prevColumnIndex = this.option('focusedColumnIndex');
    const prevRowIndex = this.option('focusedRowIndex');
    const cellPosition = this._getCellPosition($cellElement);
    const columnIndex = cellPosition ? cellPosition.columnIndex : -1;
    const rowIndex = cellPosition ? cellPosition.rowIndex : -1;
    const visibleRows = this._dataController.getVisibleRows();
    const visibleColumns = this._columnsController.getVisibleColumns();

    const args: FocusedCellChangingArgs = {
      cellElement: $cellElement,
      prevColumnIndex,
      prevRowIndex,
      newColumnIndex: columnIndex,
      newRowIndex: rowIndex,
      rows: visibleRows,
      columns: visibleColumns,
      event: $event,
      isHighlighted: isHighlighted ?? false,
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

  protected _fireFocusedCellChanged($cell: dxElementWrapper): void {
    const columnIndex = this._rowsView.getCellIndex($cell);
    const rowOptions: RowPreparedOptions | undefined = $cell.parent().data('options');
    const focusedRowKey = rowOptions?.key;

    this._memoFireFocusedCellChanged(focusedRowKey, columnIndex);
  }

  private _memoFireFocusedCellChanged(
    rowKey: RowKey,
    columnIndex: number,
  ): void {
    const $cell = this._getFocusedCell();
    const $row = $cell?.parent();

    const rowIndex = this.getRowIndex();
    const localRowIndex = Math.min(
      this._rowsView.getRowIndex($row),
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
      cellElement: $cell ? getPublicElement($cell) : undefined,
      columnIndex,
      rowIndex,
      row,
      column,
    });
  }

  private _fireFocusedRowChanging(
    eventArgs: Event | undefined,
    $newFocusedRow: dxElementWrapper,
  ): FocusedRowChangingArgs {
    const newRowIndex = this._getRowIndex($newFocusedRow);
    const prevFocusedRowIndex = this.option('focusedRowIndex');
    const loadingOperationTypes = this.dataSourceController.loadingOperationTypes();

    const args: FocusedRowChangingArgs = {
      rowElement: $newFocusedRow,
      prevRowIndex: prevFocusedRowIndex,
      newRowIndex,
      event: eventArgs,
      rows: this._dataController.getVisibleRows(),
      cancel: false,
    };

    const loadingOperations = !!loadingOperationTypes.sorting
      || !!loadingOperationTypes.grouping
      || !!loadingOperationTypes.filtering
      || loadingOperationTypes.paging;
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

  public fireFocusedRowChanged(): void {
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
        : this._dataController.getVisibleRows()[localRowIndex],
    });
  }

  // #endregion Events
  private _isEventInCurrentGrid(event: DxEvent): boolean {
    return gridCoreUtils.isElementInCurrentGrid(this, $(event.target));
  }

  private _isFastEditingAllowed(): boolean {
    return isCellBasedEditMode(this._editingController.getEditMode())
      && !!this.option('keyboardNavigation.editOnKeyPress');
  }

  public applyTabIndexToElement($element: dxElementWrapper): void {
    const tabIndex = this.option('tabIndex') ?? 0;

    $element.attr('tabindex', tabIndex);
  }

  protected _getCell(cellPosition: Partial<CellPosition>): dxElementWrapper | undefined {
    if (this._focusedView && cellPosition) {
      const { rowIndex = -1, columnIndex = -1 } = cellPosition;
      const rowIndexOffset = this._dataController.getRowIndexOffset();
      const column = this._columnsController.getVisibleColumns(null, true)[columnIndex];
      const columnIndexOffset = column && column.fixed
        ? this._getFixedColumnIndexOffset(column)
        : this._columnsController.getColumnIndexOffset();

      return this._focusedView.getCell({
        rowIndex: rowIndex >= 0 ? rowIndex - rowIndexOffset : -1,
        columnIndex: columnIndex >= 0 ? columnIndex - columnIndexOffset : -1,
      });
    }

    return undefined;
  }

  protected _getRowIndex($row: dxElementWrapper): number {
    const rowIndex = this._rowsView.getRowIndex($row);

    if (rowIndex >= 0) {
      return rowIndex + this._dataController.getRowIndexOffset();
    }

    return rowIndex;
  }

  protected getCellIndex($cell: dxElementWrapper, rowIndex?: number): number {
    return this._rowsView.getCellIndex($cell, rowIndex);
  }

  private _hasSkipRow($row: dxElementWrapper): boolean {
    const row = $row && ($row.get(0) as HTMLElement | undefined);
    return row?.style.display === 'none';
  }

  private _allowEditingOnEnterKey(): boolean {
    return this.option('keyboardNavigation.enterKeyAction') === 'startEdit';
  }

  private _isLegacyNavigation(): boolean {
    return !!this.option('useLegacyKeyboardNavigation');
  }

  /**
   * @extended: TreeList's keyboard_navigation
   */
  protected _getDirectionCodeByKey(key: string): DirectionCode | undefined {
    switch (key) {
      case 'upArrow':
        return 'prevRow';
      case 'downArrow':
        return 'nextRow';
      case 'leftArrow':
        return this.option('rtlEnabled') ? 'nextInRow' : 'previousInRow';
      case 'rightArrow':
        return this.option('rtlEnabled') ? 'previousInRow' : 'nextInRow';
      default:
        return undefined;
    }
  }

  public isVirtualScrolling(): boolean {
    const scrollingMode = this.option('scrolling.mode');
    return scrollingMode === 'virtual' || scrollingMode === 'infinite';
  }

  private _isVirtualRowRender(): boolean {
    return (
      this.isVirtualScrolling() || gridCoreUtils.isVirtualRowRendering(this)
    );
  }

  private _scrollBy(left: number, top: number, rowIndex?: number, $event?: Event): void {
    // @ts-expect-error the scrollable is rendered here
    const scrollable: Scrollable = this._rowsView.getScrollable();

    if (this._focusedCellPosition) {
      const scrollHandler = (): void => {
        scrollable.off('scroll', scrollHandler);
        setTimeout(this.restoreFocusableElement.bind(this, rowIndex, $event));
      };
      scrollable.on('scroll', scrollHandler);
    }
    return scrollable.scrollBy({ left, top });
  }

  protected _isInsideEditForm(element: EventTarget | dxElementWrapper | null): boolean {
    const $editForm = $(element).closest(
      `.${this.addWidgetPrefix(EDITING_CLASSES.editForm)}`,
    );

    return !!$editForm.length && this.elementIsInsideGrid($editForm);
  }

  public getMasterDetailCell(
    element: EventTarget | dxElementWrapper | null,
  ): dxElementWrapper | null {
    const $masterDetailCell = $(element).closest(
      `.${MASTER_DETAIL_CLASSES.detailCell}`,
    );

    if ($masterDetailCell.length && this.elementIsInsideGrid($masterDetailCell)) {
      return $masterDetailCell;
    }

    return null;
  }

  /**
   * @extended: adaptivity
   */
  protected _processNextCellInMasterDetail(
    $nextCell: dxElementWrapper | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- overridable signature
    _$cell: dxElementWrapper,
  ): void {
    if (!this._isInsideEditForm($nextCell) && $nextCell) {
      this.applyTabIndexToElement($nextCell);
    }
  }

  /**
   * Handles tab navigation when focus is on or entering a master-detail cell.
   * Returns true if the master-detail handling was applied.
   */
  private handleTabKeyOnMasterDetailCell(
    target: Element | dxElementWrapper,
    direction: NavigationDirection,
  ): boolean {
    if (this.getMasterDetailCell(target)) {
      this._updateFocusedCellPosition($(target), direction);

      const $nextCell = this._getNextCell(direction, 'row');
      this._processNextCellInMasterDetail($nextCell, $(target));
      return true;
    }

    return false;
  }

  public getElementType(
    target: EventTarget | dxElementWrapper | null | undefined,
  ): NavigationElementType {
    return $(target).is('tr') ? 'row' : 'cell';
  }

  public isFastEditingStarted(): boolean {
    return this._isFastEditingAllowed() && this._fastEditingStarted;
  }

  private _getVisibleColumnCount(): number {
    return this._columnsController.getVisibleColumns(null, true).length;
  }

  private _isCellInRow(cellPosition: Partial<CellPosition>, includeCommandCells: boolean): boolean {
    const { columnIndex } = cellPosition;

    if (columnIndex === undefined) {
      return false;
    }

    const visibleColumnsCount = this._getVisibleColumnCount();

    return includeCommandCells
      ? columnIndex >= 0 && columnIndex <= visibleColumnsCount - 1
      : columnIndex > 0 && columnIndex < visibleColumnsCount - 1;
  }

  /**
   * @extended: adaptivity
   */
  public isCellElement($element: dxElementWrapper): boolean {
    return !!$element.length && $element[0].tagName === 'TD';
  }

  public getCellElementFromTarget(target: EventTarget | null): dxElementWrapper {
    const elementType = this.getElementType(target);
    const $targetElement = $(target);

    if (elementType === 'cell') {
      return $targetElement.closest(`.${VIEW_CLASSES.row} > td`);
    }

    return $targetElement.children().not(`.${COLUMNS_CONTROLLER_CLASSES.commandExpand}`).first();
  }

  private _getRowsViewElement(): dxElementWrapper | undefined {
    return this._rowsView?.element();
  }

  public processCanceledEditCellPosition(
    rowIndex: number,
    columnIndex: number | string,
  ): boolean | undefined {
    if (this._canceledCellPosition) {
      const isCanceled = this._canceledCellPosition.rowIndex === rowIndex
        && this._canceledCellPosition.columnIndex === columnIndex;
      this._canceledCellPosition = null;
      return isCanceled;
    }

    return undefined;
  }

  public updateFocusedRowIndex(): void {
    const visibleRowIndex = this.getVisibleRowIndex();
    const visibleItems = this._dataController.items();
    const lastVisibleIndex = visibleItems.length ? visibleItems.length - 1 : -1;
    const rowIndexOffset = this._dataController.getRowIndexOffset();

    if (lastVisibleIndex >= 0 && visibleRowIndex > lastVisibleIndex) {
      this.setFocusedRowIndex(lastVisibleIndex + rowIndexOffset);
    }
  }

  public needNavigationToCell(): boolean {
    return this._needNavigationToCell;
  }

  public navigationToCellInProgress(): boolean {
    return this.needToRestoreFocus || this.needNavigationToCell();
  }

  public getRowIndex(): number | undefined {
    return this._focusedCellPosition ? this._focusedCellPosition.rowIndex : -1;
  }
}

const rowsView = (
  Base: ModuleType<RowsView & EditingRowsViewExtension>,
): ModuleType<RowsView> => class RowsViewKeyboardExtender extends Base {
  protected _resizeController!: ResizingController;

  protected _rowClick(e: ViewRowEvent): void {
    const editRowIndex = this._editingController.getEditRowIndex();
    const isKeyboardEnabled = this._keyboardNavigationController.isKeyboardEnabled();

    if (editRowIndex === e.rowIndex) {
      this._keyboardNavigationController.setCellFocusType();
    }

    const isPointerOnly = isMobile() || !isKeyboardEnabled;
    const needTriggerPointerEventHandler = isPointerOnly && this.option('focusedRowEnabled');
    if (needTriggerPointerEventHandler) {
      this._triggerPointerDownEventHandler(e, !isKeyboardEnabled);
    }

    super._rowClick(e);
  }

  private _triggerPointerDownEventHandler(e: ViewRowEvent, force: boolean): void {
    const { originalEvent } = e.event;
    if (originalEvent) {
      const $cell = $(originalEvent.target);
      const columnIndex = this.getCellIndex($cell);
      const column = this._columnsController.getVisibleColumns()[columnIndex];
      const row = this._dataController.items()[e.rowIndex];

      if (this._keyboardNavigationController.isAllowEditing(row, column) || force) {
        const eventArgs = createEvent(originalEvent, { currentTarget: originalEvent.target });
        this._keyboardNavigationController.pointerEventHandler(eventArgs);
      }
    }
  }

  public renderFocusState(params: FocusStateParams): void {
    super.renderFocusState(params);

    if (this._keyboardNavigationController.navigationToCellInProgress()) {
      return;
    }

    const { preventScroll, pageSizeChanged } = params ?? {};
    const $rowsViewElement = this.element();

    if ($rowsViewElement && !focused($rowsViewElement)) {
      $rowsViewElement.attr('tabindex', null);
    }

    if (pageSizeChanged) {
      this._keyboardNavigationController.updateFocusedRowIndex();
    }

    let rowIndex = this._keyboardNavigationController.getVisibleRowIndex();
    if (!isDefined(rowIndex) || rowIndex < 0) {
      rowIndex = 0;
    }

    const cellElements = this.getCellElements(rowIndex);
    if (this._keyboardNavigationController.isKeyboardEnabled() && cellElements?.length) {
      this.updateFocusElementTabIndex(cellElements, preventScroll);
    }
  }

  private updateFocusElementTabIndex(
    cellElements: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    preventScroll?: boolean,
  ): void {
    const $row = cellElements.eq(0).parent();

    if (isGroupRow($row)) {
      this._keyboardNavigationController.applyTabIndexToElement($row);
    } else {
      let columnIndex = this._keyboardNavigationController.getColumnIndex();
      if (!isDefined(columnIndex) || columnIndex < 0) {
        columnIndex = 0;
      }
      this._updateFocusedCellTabIndex(cellElements, columnIndex);
    }
  }

  private _updateFocusedCellTabIndex(cellElements: dxElementWrapper, columnIndex: number): void {
    const cellElementsLength = cellElements ? cellElements.length : -1;
    const $cell = GridCoreKeyboardNavigationDom.getCellToFocus(cellElements, columnIndex);

    if ($cell.length) {
      this.updateCellTabIndex($cell);
    } else {
      const startIndex = cellElementsLength <= columnIndex ? cellElementsLength - 1 : columnIndex;
      for (let i = startIndex; i < cellElementsLength; i += 1) {
        if (this.updateCellTabIndex($(cellElements[i]))) {
          break;
        }
      }
    }
  }

  private updateCellTabIndex($cell: dxElementWrapper): boolean {
    const isMasterDetailCell = !!this._keyboardNavigationController.getMasterDetailCell($cell);
    const isValidCell = this._keyboardNavigationController.isCellValid($cell);
    const isCellElement = this._keyboardNavigationController.isCellElement($cell);

    if (!isMasterDetailCell && isValidCell && isCellElement) {
      this._keyboardNavigationController.applyTabIndexToElement($cell);
      this._keyboardNavigationController.setCellFocusType();
      return true;
    }

    return false;
  }

  public renderDelayedTemplates(change?: DataChange): void {
    super.renderDelayedTemplates(change);
    this.waitAsyncTemplates().done(() => {
      this._renderFocusByChange(change);
    });
  }

  private _renderFocusByChange(change?: DataChange): void {
    const { operationTypes, repaintChangesOnly } = change ?? {};
    const { fullReload, pageSize } = operationTypes ?? {};

    if (!change || !repaintChangesOnly || fullReload || pageSize) {
      const preventScroll = shouldPreventScroll(this._keyboardNavigationController);
      this.renderFocusState({
        preventScroll,
        pageSizeChanged: pageSize,
      });
    }
  }

  protected _renderCore(change?: DataChange): DeferredObj<unknown> {
    const deferred = super._renderCore(change);
    this._renderFocusByChange(change);
    return deferred;
  }

  public override editCellPrepared($cell: dxElementWrapper): void {
    const editorInstance = this._getEditorInstance($cell);
    const isEditingNavigationMode = this._keyboardNavigationController?.isFastEditingStarted();

    if (editorInstance && isEditingNavigationMode) {
      this._handleEditingNavigationMode(editorInstance);
    }

    super.editCellPrepared($cell);
  }

  private _handleEditingNavigationMode(editorInstance: TextEditorBase): void {
    ['downArrow', 'upArrow'].forEach((keyName) => {
      const originalKeyHandler = editorInstance._supportedKeys()[keyName];
      editorInstance.registerKeyHandler(keyName, (e) => {
        const isDropDownOpened = editorInstance._input().attr('aria-expanded') === 'true';
        if (isDropDownOpened) {
          return originalKeyHandler && originalKeyHandler.call(editorInstance, e);
        }

        return undefined;
      });
    });

    editorInstance.registerKeyHandler('leftArrow', noop);
    editorInstance.registerKeyHandler('rightArrow', noop);

    const isDateBoxWithMask = editorInstance.NAME === DATEBOX_WIDGET_NAME && editorInstance.option('useMaskBehavior');
    if (isDateBoxWithMask) {
      editorInstance.registerKeyHandler('enter', noop);
    }
  }

  private _getEditorInstance($cell: dxElementWrapper): TextEditorBase | undefined {
    const $editor = $cell.find('.dx-texteditor').eq(0);

    return gridCoreUtils.getWidgetInstance<TextEditorBase>($editor);
  }

  protected _handleScroll(e: RowsViewScrollEvent): void {
    super._handleScroll(e);

    this._keyboardNavigationController.cancelFocusRestoreOnScrollAway(e.scrollOffset.top);

    if (this._keyboardNavigationController.needNavigationToCell()) {
      this._keyboardNavigationController.navigateToFirstOrLastCell(
        this._keyboardNavigationController.isQuickNavigationToFirstCell(),
      );
    }
  }

  public init(): void {
    super.init();

    this._resizeController = this.getController('resizing');
  }
};

const editing = (
  Base: ModuleType<CellBasedEditingController>,
): ModuleType<CellBasedEditingController> => class EditingControllerKeyboardExtender extends Base {
  public override editCell(rowIndex: number, columnIndex: number | string): EditCellResult {
    if (
      this._keyboardNavigationController
        .processCanceledEditCellPosition(rowIndex, columnIndex)
    ) {
      return false;
    }

    const isCellEditing = super.editCell(rowIndex, columnIndex);

    if (isCellEditing) {
      this._keyboardNavigationController.setupFocusedView();
      this._keyboardNavigationController.setCellFocusType();
    }

    return isCellEditing;
  }

  public editRow(rowIndex: number): boolean | undefined {
    const visibleColumnIndex = this._keyboardNavigationController.getVisibleColumnIndex();
    const column = this._columnsController.getVisibleColumns()[visibleColumnIndex];

    if ((column && column.type) || this.getEditMode() === EDIT_MODE.form) {
      this._keyboardNavigationController.resetFocusedCell();
    }
    super.editRow(rowIndex);

    return undefined;
  }

  protected addRow(parentKey?: RowKey): DeferredObj<unknown> {
    this._keyboardNavigationController.setupFocusedView();
    this._keyboardNavigationController.setCellFocusType();

    return super.addRow(parentKey);
  }

  protected getFocusedCellInRow(rowIndex: number): dxElementWrapper | undefined {
    let $cell = super.getFocusedCellInRow(rowIndex);
    const rowIndexOffset = this._dataController.getRowIndexOffset();
    const { rowIndex: focusedRowIndex } = this._keyboardNavigationController._focusedCellPosition;

    if (
      this._keyboardNavigationController.isKeyboardEnabled()
      && focusedRowIndex !== undefined
      && focusedRowIndex - rowIndexOffset === rowIndex
    ) {
      const $focusedCell = this._keyboardNavigationController._getFocusedCell();
      if (isElementDefined($focusedCell) && !$focusedCell.hasClass(EDITING_CLASSES.commandEdit)) {
        $cell = $focusedCell;
      }
    }

    return $cell;
  }

  protected _processCanceledEditingCell(): void {
    this.closeEditCell().done(() => {
      this._keyboardNavigationController.updateFocus(false);
    });
  }

  public override closeEditCell(
    isError?: boolean | null,
    withoutSaveEditData?: boolean,
  ): DeferredObj<unknown> {
    const keyboardNavigation = this._keyboardNavigationController;
    keyboardNavigation._fastEditingStarted = false;

    const result = super.closeEditCell(isError, withoutSaveEditData);

    const $focusedElement = this._getFocusedElement();
    const isFilterCell = !!$focusedElement.closest(`.${this.addWidgetPrefix(FILTER_ROW_CLASSES.filterRow)}`).length;

    if (!isFilterCell) {
      keyboardNavigation.updateFocus(false);
    }

    return result;
  }

  private _getFocusedElement(): dxElementWrapper {
    const $element = $(this.component.element?.());
    const $focusedElement = $element.find(':focus');

    return $focusedElement;
  }

  protected _delayedInputFocus(
    $cell: dxElementWrapper | undefined,
    beforeFocusCallback?: (() => void) | null,
    callBeforeFocusCallbackAlways?: boolean,
  ): void {
    this._keyboardNavigationController._isNeedScroll = true;
    super._delayedInputFocus($cell, beforeFocusCallback, callBeforeFocusCallbackAlways);
  }

  protected _isEditingStart(options: EditingStartOptions): boolean {
    const cancel = super._isEditingStart(options);

    if (cancel && !this._keyboardNavigationController._isNeedFocus) {
      const $cell = this._keyboardNavigationController._getFocusedCell();
      this._keyboardNavigationController.applyFocus($cell, true);
    }

    return cancel;
  }
};

const adaptiveColumns = (
  Base: ModuleType<AdaptiveColumnsViewController>,
): ModuleType<AdaptiveColumnsViewController> => class AdaptiveColumnsKeyboardExtender extends Base {
  protected _showHiddenCellsInView(options: HiddenCellsInViewOptions): void {
    const { viewName, $cells, isCommandColumn } = options;
    super._showHiddenCellsInView(options);

    if (viewName === COLUMN_HEADERS_VIEW && !isCommandColumn) {
      $cells.each((_, cellElement) => {
        const $cell = $(cellElement);
        if (isCellInHeaderRow($cell)) {
          $cell.attr('tabindex', 0);
        }
      });
    }
  }

  protected _hideVisibleCellInView(options: HiddenCellInViewOptions): void {
    const { viewName, $cell, isCommandColumn } = options;
    super._hideVisibleCellInView(options);

    if (viewName === COLUMN_HEADERS_VIEW && !isCommandColumn && isCellInHeaderRow($cell)) {
      $cell.removeAttr('tabindex');
    }
  }

  protected _hideVisibleColumnInView({
    view, isCommandColumn, visibleIndex,
  }: HideVisibleColumnInViewOptions): void {
    super._hideVisibleColumnInView({ view, isCommandColumn, visibleIndex });
    if (view.name === ROWS_VIEW) {
      this._rowsView.renderFocusState({
        preventScroll: shouldPreventScroll(this._keyboardNavigationController),
      });
    }
  }
};

export const keyboardNavigationModule: Module = {
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
      // @ts-expect-error the extender assumes the editing extension of RowsView
      rowsView,
    },
    controllers: {
      // @ts-expect-error the extender assumes the cell-based extension of EditingController
      editing,
      adaptiveColumns,
      keyboardNavigation: keyboardNavigationScrollableA11yExtender,
    },
  },
};
