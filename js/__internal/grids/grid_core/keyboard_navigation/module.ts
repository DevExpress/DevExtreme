// @ts-check

import {
  getOuterHeight, getHeight, getWidth, getOuterWidth,
} from '@js/core/utils/size';
import $ from '@js/core/../core/renderer';
import domAdapter from '@js/core/../core/dom_adapter';
import eventsEngine from '@js/core/../events/core/events_engine';
import { isDefined, isEmptyObject } from '@js/core/../core/utils/type';
import { focused } from '@js/ui/widget/selectors';
import { addNamespace, createEvent, isCommandKeyPressed } from '@js/core/../events/utils/index';
import pointerEvents from '@js/events/pointer';
import { name as clickEventName } from '@js/core/../events/click';
import { noop } from '@js/core/../core/utils/common';
import * as accessibility from '@js/ui/shared/accessibility';
import browser from '@js/core/utils/browser';
import { keyboard } from '@js/events/short';
import devices from '@js/core/devices';
import gridCoreUtils from '../module_utils';
import core from '../modules';
import { GridCoreKeyboardNavigationDom } from './dom';

// TODO: Move these constants to const.js
const ROWS_VIEW_CLASS = 'rowsview';
const EDIT_FORM_CLASS = 'edit-form';
const GROUP_FOOTER_CLASS = 'group-footer';
const ROW_CLASS = 'dx-row';
const DATA_ROW_CLASS = 'dx-data-row';
const GROUP_ROW_CLASS = 'dx-group-row';
const HEADER_ROW_CLASS = 'dx-header-row';
const EDIT_FORM_ITEM_CLASS = 'edit-form-item';
const MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
const FREESPACE_ROW_CLASS = 'dx-freespace-row';
const VIRTUAL_ROW_CLASS = 'dx-virtual-row';
const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const EDITOR_CELL_CLASS = 'dx-editor-cell';
const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
const COMMAND_EXPAND_CLASS = 'dx-command-expand';
const COMMAND_SELECT_CLASS = 'dx-command-select';
const COMMAND_EDIT_CLASS = 'dx-command-edit';
const COMMAND_CELL_SELECTOR = '[class^=dx-command]';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const DATEBOX_WIDGET_NAME = 'dxDateBox';
const FOCUS_STATE_CLASS = 'dx-state-focused';
const WIDGET_CLASS = 'dx-widget';
const REVERT_BUTTON_CLASS = 'dx-revert-button';

const FAST_EDITING_DELETE_KEY = 'delete';

const INTERACTIVE_ELEMENTS_SELECTOR = 'input:not([type=\'hidden\']), textarea, a, select, button, [tabindex], .dx-checkbox';
const NON_FOCUSABLE_ELEMENTS_SELECTOR = `${INTERACTIVE_ELEMENTS_SELECTOR}, .dx-dropdowneditor-icon`;

const EDIT_MODE_ROW = 'row';
const EDIT_MODE_FORM = 'form';
const EDIT_MODE_BATCH = 'batch';
const EDIT_MODE_CELL = 'cell';

const FOCUS_TYPE_ROW = 'row';
const FOCUS_TYPE_CELL = 'cell';

const COLUMN_HEADERS_VIEW = 'columnHeadersView';
const FUNCTIONAL_KEYS = ['shift', 'control', 'alt'];

function isGroupRow($row) {
  return $row && $row.hasClass(GROUP_ROW_CLASS);
}

function isDetailRow($row) {
  return $row && $row.hasClass(MASTER_DETAIL_ROW_CLASS);
}

function isDataRow($row) {
  return $row && !isGroupRow($row) && !isDetailRow($row);
}

function isNotFocusedRow($row) {
  return !$row || ($row.hasClass(FREESPACE_ROW_CLASS) || $row.hasClass(VIRTUAL_ROW_CLASS));
}

function isEditorCell(that, $cell) {
  return !that._isRowEditMode() && $cell && !$cell.hasClass(COMMAND_SELECT_CLASS) && $cell.hasClass(EDITOR_CELL_CLASS);
}

function isElementDefined($element) {
  return isDefined($element) && $element.length > 0;
}

function isMobile() {
  return devices.current().deviceType !== 'desktop';
}

function isCellInHeaderRow($cell) {
  return !!$cell.parent(`.${HEADER_ROW_CLASS}`).length;
}

function isFixedColumnIndexOffsetRequired(that, column) {
  const rtlEnabled = that.option('rtlEnabled');
  let result = false;
  if (rtlEnabled) {
    result = !(column.fixedPosition === 'right' || (isDefined(column.command) && !isDefined(column.fixedPosition)));
  } else {
    result = !(!isDefined(column.fixedPosition) || column.fixedPosition === 'left');
  }
  return result;
}

function shouldPreventScroll(that) {
  const keyboardController = that.getController('keyboardNavigation');
  return keyboardController._isVirtualScrolling() ? that.option('focusedRowIndex') === keyboardController.getRowIndex() : false;
}

const keyboardNavigationMembers: Partial<import('./module_types').KeyboardNavigationController> = {
  // #region Initialization
  init() {
    this._dataController = this.getController('data');
    this._selectionController = this.getController('selection');
    this._editingController = this.getController('editing');
    this._headerPanel = this.getView('headerPanel');
    this._columnsController = this.getController('columns');
    this._editorFactory = this.getController('editorFactory');

    if (this.isKeyboardEnabled()) {
      accessibility.subscribeVisibilityChange();

      this._updateFocusTimeout = null;
      this._fastEditingStarted = false;
      this._focusedCellPosition = {};
      this._canceledCellPosition = null;

      const elementFocused = ($element) => {
        this.setupFocusedView();

        if (this._isNeedScroll) {
          if ($element.is(':visible') && this._focusedView && this._focusedView.getScrollable) {
            this._focusedView._scrollToElement($element);
            this._isNeedScroll = false;
          }
        }
      };
      this._editorFactory.focused.add(elementFocused);

      this._initViewHandlers();
      this._initDocumentHandlers();

      this.createAction('onKeyDown');
    }
  },
  _initViewHandlers() {
    const rowsView = this.getView('rowsView');
    const rowsViewFocusHandler = (event) => {
      const $element = $(event.target);
      const isRelatedTargetInRowsView = $(event.relatedTarget).closest(rowsView.element()).length;
      const isLink = $element.is('a');

      if (event.relatedTarget && isLink && !isRelatedTargetInRowsView && this._isEventInCurrentGrid(event)) {
        let $focusedCell = this._getFocusedCell();

        $focusedCell = !isElementDefined($focusedCell) ? rowsView.getCellElements(0).filter('[tabindex]').eq(0) : $focusedCell;

        if (!$element.closest($focusedCell).length) {
          event.preventDefault();
          // @ts-expect-error
          eventsEngine.trigger($focusedCell, 'focus');
        }
      }
    };

    rowsView.renderCompleted.add((e) => {
      const $rowsView = rowsView.element();
      const isFullUpdate = !e || e.changeType === 'refresh';
      const isFocusedViewCorrect = this._focusedView && this._focusedView.name === rowsView.name;
      let needUpdateFocus = false;
      const isAppend = e && (e.changeType === 'append' || e.changeType === 'prepend');
      // @ts-expect-error
      const root = $(domAdapter.getRootNode($rowsView.get && $rowsView.get(0)));
      const $focusedElement = root.find(':focus');
      const isFocusedElementCorrect = !$focusedElement.length || $focusedElement.closest($rowsView).length;

      eventsEngine.off($rowsView, 'focusin', rowsViewFocusHandler);
      eventsEngine.on($rowsView, 'focusin', rowsViewFocusHandler);

      this._initPointerEventHandler();
      this._initKeyDownHandler();
      this._setRowsViewAttributes();

      if (isFocusedViewCorrect && isFocusedElementCorrect) {
        needUpdateFocus = this._isNeedFocus ? !isAppend : this._isHiddenFocus && isFullUpdate && !e?.virtualColumnsScrolling;
        needUpdateFocus && this._updateFocus(true);
      }
    });
  },

  _initDocumentHandlers() {
    const document = domAdapter.getDocument();

    this._documentClickHandler = this.createAction((e) => {
      const $target = $(e.event.target);
      const isCurrentRowsViewClick = this._isEventInCurrentGrid(e.event) && $target.closest(`.${this.addWidgetPrefix(ROWS_VIEW_CLASS)}`).length;
      const isEditorOverlay = $target.closest(`.${DROPDOWN_EDITOR_OVERLAY_CLASS}`).length;
      const columnsResizerController = this.getController('columnsResizer');
      const isColumnResizing = !!columnsResizerController && columnsResizerController.isResizing();
      if (!isCurrentRowsViewClick && !isEditorOverlay && !isColumnResizing) {
        // @ts-expect-error
        const targetInsideFocusedView = this._focusedView ? $target.parents().filter(this._focusedView.element()).length > 0 : false;

        !targetInsideFocusedView && this._resetFocusedCell(true);
        this._resetFocusedView();
      }
    });

    eventsEngine.on(document, addNamespace(pointerEvents.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
  },

  _setRowsViewAttributes() {
    const $rowsView = this._getRowsViewElement();
    const isGridEmpty = !this._dataController.getVisibleRows().length;
    if (isGridEmpty) {
      this._applyTabIndexToElement($rowsView);
    }
  },

  _initPointerEventHandler() {
    const pointerEventName = !isMobile() ? pointerEvents.down : clickEventName;
    const clickSelector = `.${ROW_CLASS} > td, .${ROW_CLASS}`;
    const $rowsView = this._getRowsViewElement();
    if (!isDefined(this._pointerEventAction)) {
      this._pointerEventAction = this.createAction(this._pointerEventHandler);
    }
    eventsEngine.off($rowsView, addNamespace(pointerEventName, 'dxDataGridKeyboardNavigation'), this._pointerEventAction);
    eventsEngine.on($rowsView, addNamespace(pointerEventName, 'dxDataGridKeyboardNavigation'), clickSelector, this._pointerEventAction);
  },

  _initKeyDownHandler() {
    const $rowsView = this._getRowsViewElement();
    keyboard.off(this._keyDownListener);
    this._keyDownListener = keyboard.on($rowsView, null, (e) => this._keyDownHandler(e));
  },

  dispose() {
    this.callBase();
    this._resetFocusedView();
    keyboard.off(this._keyDownListener);
    eventsEngine.off(domAdapter.getDocument(), addNamespace(pointerEvents.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
    clearTimeout(this._updateFocusTimeout);
    accessibility.unsubscribeVisibilityChange();
  },
  // #endregion Initialization

  // #region Options
  optionChanged(args) {
    const that = this;

    switch (args.name) {
      case 'keyboardNavigation':
      case 'useLegacyKeyboardNavigation':
        args.handled = true;
        break;
      default:
        that.callBase(args);
    }
  },

  isRowFocusType() {
    return this.focusType === FOCUS_TYPE_ROW;
  },

  isCellFocusType() {
    return this.focusType === FOCUS_TYPE_CELL;
  },

  setRowFocusType() {
    if (this.option('focusedRowEnabled')) {
      this.focusType = FOCUS_TYPE_ROW;
    }
  },

  setCellFocusType() {
    this.focusType = FOCUS_TYPE_CELL;
  },
  // #endregion Options

  // #region Key_Handlers
  _keyDownHandler(e) {
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

    !FUNCTIONAL_KEYS.includes(e.keyName) && this._updateFocusedCellPositionByTarget(originalEvent.target);

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
          this._escapeKeyHandler(e, isEditing);
          isHandled = true;
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
  },
  _processOnKeyDown(eventArgs) {
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
  },
  _closeEditCell() {
    setTimeout(() => {
      this._editingController.closeEditCell();
    });
  },
  _leftRightKeysHandler(eventArgs, isEditing) {
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
  },
  _upDownKeysHandler(eventArgs, isEditing) {
    const visibleRowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView && this._focusedView.getRow(visibleRowIndex);
    const $event = eventArgs.originalEvent;
    const isUpArrow = eventArgs.keyName === 'upArrow';
    const dataSource = this._dataController.dataSource();
    const isRowEditingInCurrentRow = this._editingController?.isEditRowByIndex?.(visibleRowIndex);
    const isEditingNavigationMode = this._isFastEditingStarted();
    const allowNavigate = (!isRowEditingInCurrentRow || !isEditing || isEditingNavigationMode) && $row && !isDetailRow($row);

    if (allowNavigate) {
      isEditingNavigationMode && this._closeEditCell();
      if (!this._navigateNextCell($event, eventArgs.keyName)) {
        if (this._isVirtualRowRender() && isUpArrow && dataSource && !dataSource.isLoading()) {
          const rowHeight = getOuterHeight($row);
          const rowIndex = this._focusedCellPosition.rowIndex - 1;
          this._scrollBy(0, -rowHeight, rowIndex, $event);
        }
      }

      $event && $event.preventDefault();
    }
  },
  _pageUpDownKeyHandler(eventArgs) {
    const pageIndex = this._dataController.pageIndex();
    const pageCount = this._dataController.pageCount();
    const pagingEnabled = this.option('paging.enabled');
    const isPageUp = eventArgs.keyName === 'pageUp';
    const pageStep = isPageUp ? -1 : 1;
    const scrollable = this.getView('rowsView').getScrollable();

    if (pagingEnabled && !this._isVirtualScrolling()) {
      if ((isPageUp ? pageIndex > 0 : pageIndex < pageCount - 1) && !this._isVirtualScrolling()) {
        this._dataController.pageIndex(pageIndex + pageStep);
        eventArgs.originalEvent.preventDefault();
      }
    } else if (scrollable && getHeight(scrollable.container()) < getHeight(scrollable.$content())) {
      this._scrollBy(0, getHeight(scrollable.container()) * pageStep);
      eventArgs.originalEvent.preventDefault();
    }
  },
  _spaceKeyHandler(eventArgs, isEditing) {
    const rowIndex = this.getVisibleRowIndex();
    const $target = $(eventArgs.originalEvent && eventArgs.originalEvent.target);

    if (this.option('selection') && this.option('selection').mode !== 'none' && !isEditing) {
      const isFocusedRowElement = this._getElementType($target) === 'row' && this.isRowFocusType() && isDataRow($target);
      const isFocusedSelectionCell = $target.hasClass(COMMAND_SELECT_CLASS);
      if (isFocusedSelectionCell && this.option('selection.showCheckBoxesMode') === 'onClick') {
        this._selectionController.startSelectionWithCheckboxes();
      }
      if (isFocusedRowElement || $target.parent().hasClass(DATA_ROW_CLASS) || $target.hasClass(this.addWidgetPrefix(ROWS_VIEW_CLASS))) {
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
  },
  _ctrlAKeyHandler(eventArgs, isEditing) {
    if (!isEditing && !eventArgs.alt && this.option('selection.mode') === 'multiple' && this.option('selection.allowSelectAll')) {
      this._selectionController.selectAll();
      eventArgs.originalEvent.preventDefault();
    }
  },
  _tabKeyHandler(eventArgs, isEditing) {
    const editingOptions = this.option('editing');
    const direction = eventArgs.shift ? 'previous' : 'next';
    const isCellPositionDefined = isDefined(this._focusedCellPosition) && !isEmptyObject(this._focusedCellPosition);

    let isOriginalHandlerRequired = !isCellPositionDefined
            || (!eventArgs.shift && this._isLastValidCell(this._focusedCellPosition))
            || (eventArgs.shift && this._isFirstValidCell(this._focusedCellPosition));

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
      this._editorFactory.loseFocus();
      if (this._editingController.isEditing() && !this._isRowEditMode()) {
        this._resetFocusedCell(true);
        this._resetFocusedView();
        this._closeEditCell();
      }
    } else {
      eventArgs.originalEvent.preventDefault();
    }
  },
  _getMaxHorizontalOffset() {
    const scrollable = this.component.getScrollable();
    const rowsView = this.getView('rowsView');
    const offset = scrollable ? scrollable.scrollWidth() - getWidth(rowsView.element()) : 0;
    return offset;
  },
  _isColumnRendered(columnIndex) {
    const allVisibleColumns = this._columnsController.getVisibleColumns(null, true);
    const renderedVisibleColumns = this._columnsController.getVisibleColumns();
    const column = allVisibleColumns[columnIndex];
    let result = false;

    if (column) {
      result = renderedVisibleColumns.indexOf(column) >= 0;
    }

    return result;
  },
  _isFixedColumn(columnIndex) {
    const allVisibleColumns = this._columnsController.getVisibleColumns(null, true);
    const column = allVisibleColumns[columnIndex];
    return !!column && !!column.fixed;
  },
  _isColumnVirtual(columnIndex) {
    const localColumnIndex = columnIndex - this._columnsController.getColumnIndexOffset();
    const visibleColumns = this._columnsController.getVisibleColumns();
    const column = visibleColumns[localColumnIndex];
    return !!column && column.command === 'virtual';
  },
  _processVirtualHorizontalPosition(direction) {
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
        horizontalScrollPosition = this.option('rtlEnabled') ? this._getMaxHorizontalOffset() : 0;
        if (direction === 'next') {
          needToScroll = columnsCount === nextColumnIndex || (this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex));
        } else {
          needToScroll = columnsCount > nextColumnIndex && (this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex));
        }
        break;
      }
      case 'previous':
      case 'previousInRow': {
        nextColumnIndex = columnIndex - 1;
        horizontalScrollPosition = this.option('rtlEnabled') ? 0 : this._getMaxHorizontalOffset();
        if (direction === 'previous') {
          const columnIndexOffset = this._columnsController.getColumnIndexOffset();
          const leftEdgePosition = nextColumnIndex < 0 && columnIndexOffset === 0;
          needToScroll = leftEdgePosition || (this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex));
        } else {
          needToScroll = nextColumnIndex >= 0 && (this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex));
        }
        break;
      }
    }

    if (needToScroll) {
      scrollable.scrollTo({ left: horizontalScrollPosition });
    } else if (isDefined(nextColumnIndex) && isDefined(direction) && this._isColumnVirtual(nextColumnIndex)) {
      horizontalScrollPosition = this._getHorizontalScrollPositionOffset(direction);
      horizontalScrollPosition !== 0 && scrollable.scrollBy({ left: horizontalScrollPosition, top: 0 });
    }
  },
  _getHorizontalScrollPositionOffset(direction) {
    let positionOffset = 0;
    const $currentCell = this._getCell(this._focusedCellPosition);
    const currentCellWidth = $currentCell && getOuterWidth($currentCell);
    if (currentCellWidth > 0) {
      const rtlMultiplier = this.option('rtlEnabled') ? -1 : 1;
      positionOffset = direction === 'nextInRow' || direction === 'next' ? currentCellWidth * rtlMultiplier : currentCellWidth * rtlMultiplier * -1;
    }
    return positionOffset;
  },
  _editingCellTabHandler(eventArgs, direction) {
    const eventTarget = eventArgs.originalEvent.target;
    let $cell = this._getCellElementFromTarget(eventTarget);
    let isEditingAllowed;
    const $event = eventArgs.originalEvent;
    const elementType = this._getElementType(eventTarget);

    if ($cell.is(COMMAND_CELL_SELECTOR)) {
      return !this._targetCellTabHandler(eventArgs, direction);
    }

    this._updateFocusedCellPosition($cell);
    const nextCellInfo = this._getNextCellByTabKey($event, direction, elementType);
    $cell = nextCellInfo.$cell;

    if (!$cell || this._handleTabKeyOnMasterDetailCell($cell, direction)) {
      return false;
    }

    const columnsController = this._columnsController;
    const cellIndex = this.getView('rowsView').getCellIndex($cell);
    const columnIndex = cellIndex + columnsController.getColumnIndexOffset();
    const column = columnsController.getVisibleColumns(null, true)[columnIndex];
    const $row = $cell.parent();
    const rowIndex = this._getRowIndex($row);
    const row = this._dataController.items()[rowIndex];
    const editingController = this._editingController;

    if (column && column.allowEditing) {
      const isDataRow = !row || row.rowType === 'data';
      isEditingAllowed = editingController.allowUpdating({ row }) ? isDataRow : row && row.isNewRow;
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
  },
  _targetCellTabHandler(eventArgs, direction) {
    const $event = eventArgs.originalEvent;
    let eventTarget = $event.target;
    let $cell = this._getCellElementFromTarget(eventTarget);
    const $lastInteractiveElement = this._getInteractiveElement($cell, !eventArgs.shift);
    let isOriginalHandlerRequired = false;
    let elementType;

    if (!isEditorCell(this, $cell) && $lastInteractiveElement.length && eventTarget !== $lastInteractiveElement.get(0)) {
      isOriginalHandlerRequired = true;
    } else {
      if (this._focusedCellPosition.rowIndex === undefined && $(eventTarget).hasClass(ROW_CLASS)) {
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

      const nextCellInfo = this._getNextCellByTabKey($event, direction, elementType);
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
  },
  _getNextCellByTabKey($event, direction, elementType) {
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
  },
  _checkNewLineTransition($event, $cell) {
    const rowIndex = this.getVisibleRowIndex();
    const $row = $cell.parent();

    if (rowIndex !== this._getRowIndex($row)) {
      const cellPosition = this._getCellPosition($cell);
      const args = this._fireFocusedRowChanging($event, $row);
      if (args.cancel) {
        return;
      }
      if (args.rowIndexChanged) {
        this.setFocusedColumnIndex(cellPosition.columnIndex);
        $cell = this._getFocusedCell();
      }
    }

    return $cell;
  },

  _enterKeyHandler(eventArgs, isEditing) {
    const $cell = this._getFocusedCell();
    const rowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView && this._focusedView.getRow(rowIndex);

    if ((this.option('grouping.allowCollapsing') && isGroupRow($row))
            || (this.option('masterDetail.enabled') && $cell && $cell.hasClass(COMMAND_EXPAND_CLASS))) {
      const key = this._dataController.getKeyByRowIndex(rowIndex);
      const item = this._dataController.items()[rowIndex];

      if (key !== undefined && item && item.data && !item.data.isContinuation) {
        this._dataController.changeRowExpand(key);
      }
    } else {
      this._processEnterKeyForDataCell(eventArgs, isEditing);
    }
  },

  _processEnterKeyForDataCell(eventArgs, isEditing) {
    const direction = this._getEnterKeyDirection(eventArgs);
    const allowEditingOnEnterKey = this._allowEditingOnEnterKey();

    if (isEditing || !allowEditingOnEnterKey && direction) {
      this._handleEnterKeyEditingCell(eventArgs.originalEvent);
      if (direction === 'next' || direction === 'previous') {
        this._targetCellTabHandler(eventArgs, direction);
      } else if (direction === 'upArrow' || direction === 'downArrow') {
        this._navigateNextCell(eventArgs.originalEvent, direction);
      }
    } else if (allowEditingOnEnterKey) {
      this._startEditing(eventArgs);
    }
  },

  _getEnterKeyDirection(eventArgs) {
    const enterKeyDirection = this.option('keyboardNavigation.enterKeyDirection');
    const isShift = eventArgs.shift;

    if (enterKeyDirection === 'column') {
      return isShift ? 'upArrow' : 'downArrow';
    }
    if (enterKeyDirection === 'row') {
      return isShift ? 'previous' : 'next';
    }

    return undefined;
  },

  _handleEnterKeyEditingCell(event) {
    const { target } = event;
    const $cell = this._getCellElementFromTarget(target);
    const isRowEditMode = this._isRowEditMode();

    this._updateFocusedCellPosition($cell);

    if (isRowEditMode) {
      this._focusEditFormCell($cell);
      setTimeout(this._editingController.saveEditData.bind(this._editingController));
    } else {
      // @ts-expect-error
      eventsEngine.trigger($(target), 'change');
      this._closeEditCell();

      event.preventDefault();
    }
  },

  _escapeKeyHandler(eventArgs, isEditing) {
    const $cell = this._getCellElementFromTarget(eventArgs.originalEvent.target);
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
    }
  },

  _ctrlFKeyHandler(eventArgs) {
    if (this.option('searchPanel.visible')) {
      const searchTextEditor = this._headerPanel.getSearchTextEditor();
      if (searchTextEditor) {
        searchTextEditor.focus();
        eventArgs.originalEvent.preventDefault();
      }
    }
  },

  _f2KeyHandler() {
    const isEditing = this._editingController.isEditing();
    const rowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView && this._focusedView.getRow(rowIndex);

    if (!isEditing && isDataRow($row)) {
      this._startEditing();
    }
  },

  _navigateNextCell($event, keyCode) {
    const $cell = this._getNextCell(keyCode);
    const directionCode = this._getDirectionCodeByKey(keyCode);
    const isCellValid = $cell && this._isCellValid($cell);
    const result = isCellValid ? this._arrowKeysHandlerFocusCell($event, $cell, directionCode) : false;
    return result;
  },

  _arrowKeysHandlerFocusCell($event, $nextCell, direction) {
    const isVerticalDirection = direction === 'prevRow' || direction === 'nextRow';

    const args = this._fireFocusChangingEvents($event, $nextCell, isVerticalDirection, true);

    $nextCell = args.$newCellElement;

    if (!args.cancel && this._isCellValid($nextCell)) {
      this._focus($nextCell, !args.isHighlighted);
      return true;
    }
    return false;
  },

  _beginFastEditing(originalEvent, isDeleting) {
    if (!this._isFastEditingAllowed() || originalEvent.altKey || originalEvent.ctrlKey || this._editingController.isEditing()) {
      return false;
    }

    if (isDeleting) {
      this._startEditing(originalEvent, FAST_EDITING_DELETE_KEY);
    } else {
      const { key } = originalEvent;
      const keyCode = originalEvent.keyCode || originalEvent.which;
      const fastEditingKey = key || keyCode && String.fromCharCode(keyCode);

      if (fastEditingKey && (fastEditingKey.length === 1 || fastEditingKey === FAST_EDITING_DELETE_KEY)) {
        this._startEditing(originalEvent, fastEditingKey);
      }
    }

    return true;
  },
  // #endregion Key_Handlers

  // #region Pointer_Event_Handler
  _pointerEventHandler(e) {
    const event = e.event || e;
    let $target = $(event.currentTarget);
    const rowsView = this.getView('rowsView');
    const focusedViewElement = rowsView && rowsView.element();
    const $parent = $target.parent();
    const isInteractiveElement = $(event.target).is(INTERACTIVE_ELEMENTS_SELECTOR);
    const isRevertButton = !!$(event.target).closest(`.${REVERT_BUTTON_CLASS}`).length;
    const isExpandCommandCell = $target.hasClass(COMMAND_EXPAND_CLASS);

    if (!this._isEventInCurrentGrid(event)) {
      return;
    }

    if (!isRevertButton && (this._isCellValid($target, !isInteractiveElement) || isExpandCommandCell)) {
      $target = this._isInsideEditForm($target) ? $(event.target) : $target;

      this._focusView();
      $(focusedViewElement).removeClass(FOCUS_STATE_CLASS);

      if ($parent.hasClass(FREESPACE_ROW_CLASS)) {
        this._updateFocusedCellPosition($target);
        this._applyTabIndexToElement(this._focusedView.element());
        this._focusedView.focus(true);
      } else if (!this._isMasterDetailCell($target)) {
        this._clickTargetCellHandler(event, $target);
      } else {
        this._updateFocusedCellPosition($target);
      }
    } else if ($target.is('td')) {
      this._resetFocusedCell();
    }
  },

  _clickTargetCellHandler(event, $cell) {
    const columnIndex = this.getView('rowsView').getCellIndex($cell);
    const column = this._columnsController.getVisibleColumns()[columnIndex];
    const isCellEditMode = this._isCellEditMode();

    this.setCellFocusType();

    const args = this._fireFocusChangingEvents(event, $cell, true);
    $cell = args.$newCellElement;
    if (!args.cancel) {
      if (args.resetFocusedRow) {
        this.getController('focus')._resetFocusedRow();
        return;
      }

      if (args.rowIndexChanged) {
        $cell = this._getFocusedCell();
      }

      if (!args.isHighlighted && !isCellEditMode) {
        this.setRowFocusType();
      }

      this._updateFocusedCellPosition($cell);

      if (this._allowRowUpdating() && isCellEditMode && column && column.allowEditing) {
        this._isNeedFocus = false;
        this._isHiddenFocus = false;
      } else {
        $cell = this._getFocusedCell();
        const $target = event && $(event.target).closest(`${NON_FOCUSABLE_ELEMENTS_SELECTOR}, td`);
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
  },

  _allowRowUpdating() {
    const rowIndex = this.getVisibleRowIndex();
    const row = this._dataController.items()[rowIndex];

    return this._editingController.allowUpdating({ row }, 'click');
  },
  // #endregion Pointer_Event_Handler

  // #region Focusing
  focus(element) {
    let activeElementSelector;
    const focusedRowEnabled = this.option('focusedRowEnabled');
    const isHighlighted = this._isCellElement($(element));

    if (!element) {
      activeElementSelector = '.dx-datagrid-rowsview .dx-row[tabindex]';
      if (!focusedRowEnabled) {
        activeElementSelector += ', .dx-datagrid-rowsview .dx-row > td[tabindex]';
      }
      // @ts-expect-error
      element = this.component.$element().find(activeElementSelector).first();
    }

    element && this._focusElement($(element), isHighlighted);
  },

  getFocusedView() {
    return this._focusedView;
  },

  setupFocusedView() {
    if (this.isKeyboardEnabled() && !isDefined(this._focusedView)) {
      this._focusView();
    }
  },

  _focusElement($element, isHighlighted) {
    const rowsViewElement = $(this._getRowsViewElement());
    const $focusedView = $element.closest(rowsViewElement);
    const isRowFocusType = this.isRowFocusType();
    let args: any = {};

    if (!$focusedView.length || this._isCellElement($element) && !this._isCellValid($element)) {
      return;
    }

    this._focusView();
    this._isNeedFocus = true;
    this._isNeedScroll = true;

    if (this._isCellElement($element) || isGroupRow($element)) {
      this.setCellFocusType();
      args = this._fireFocusChangingEvents(null, $element, false, isHighlighted);
      $element = args.$newCellElement;
      if (isRowFocusType && !args.isHighlighted) {
        this.setRowFocusType();
      }
    }

    if (!args.cancel) {
      this._focus($element, !args.isHighlighted);
      this._focusInteractiveElement($element);
    }
  },

  _getFocusedViewByElement($element) {
    const view = this.getFocusedView();
    const $view = view && $(view.element());
    return $element && $element.closest($view).length !== 0;
  },

  _focusView() {
    this._focusedView = this.getView('rowsView');
  },

  _resetFocusedView() {
    this.setRowFocusType();
    this._focusedView = null;
  },

  _focusInteractiveElement($cell, isLast) {
    if (!$cell) return;

    const $focusedElement = this._getInteractiveElement($cell, isLast);

    /// #DEBUG
    this._testInteractiveElement = $focusedElement;
    /// #ENDDEBUG

    gridCoreUtils.focusAndSelectElement(this, $focusedElement);
  },

  _focus($cell, disableFocus, skipFocusEvent) {
    const $row = $cell && !$cell.hasClass(ROW_CLASS) ? $cell.closest(`.${ROW_CLASS}`) : $cell;

    if ($row && isNotFocusedRow($row)) {
      return;
    }

    const focusedView = this._focusedView;
    const $focusViewElement = focusedView && focusedView.element();
    let $focusElement;

    this._isHiddenFocus = disableFocus;

    const isRowFocus = isGroupRow($row) || this.isRowFocusType();

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
          .not($focusElement)
          .removeClass(CELL_FOCUS_DISABLED_CLASS)
          .removeAttr('tabindex');
      }

      // @ts-expect-error
      eventsEngine.one($focusElement, 'blur', (e) => {
        if (e.relatedTarget) {
          $focusElement.removeClass(CELL_FOCUS_DISABLED_CLASS);
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
  },

  _updateFocus(isRenderView) {
    this._updateFocusTimeout = setTimeout(() => {
      const editingController = this._editingController;
      const isCellEditMode = editingController.getEditMode() === EDIT_MODE_CELL;
      const isBatchEditMode = editingController.getEditMode() === EDIT_MODE_BATCH;

      if ((isCellEditMode && editingController.hasChanges()) || (isBatchEditMode && editingController.isNewRowInEditMode())) {
        editingController._focusEditingCell();
        return;
      }

      let $cell = this._getFocusedCell();
      const isEditing = editingController.isEditing();

      if ($cell && !(this._isMasterDetailCell($cell) && !this._isRowEditMode())) {
        if (this._hasSkipRow($cell.parent())) {
          const direction = this._focusedCellPosition && this._focusedCellPosition.rowIndex > 0 ? 'upArrow' : 'downArrow';
          $cell = this._getNextCell(direction);
        }
        if (isElementDefined($cell)) {
          if ($cell.is('td') || $cell.hasClass(this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS))) {
            const isCommandCell = $cell.is(COMMAND_CELL_SELECTOR);
            const $focusedElementInsideCell = $cell.find(':focus');
            const isFocusedElementDefined = isElementDefined($focusedElementInsideCell);
            if ((isRenderView || !isCommandCell) && this._editorFactory.focus()) {
              if (isCommandCell && isFocusedElementDefined) {
                gridCoreUtils.focusAndSelectElement(this, $focusedElementInsideCell);
                return;
              }
              !isFocusedElementDefined && this._focus($cell);
            } else if (!isFocusedElementDefined && (this._isNeedFocus || this._isHiddenFocus)) {
              this._focus($cell, this._isHiddenFocus);
            }
            if (isEditing) {
              this._focusInteractiveElement.bind(this)($cell);
            }
          } else {
            // @ts-expect-error
            eventsEngine.trigger($cell, 'focus');
          }
        }
      }
    });
  },

  _getFocusedCell() {
    return $(this._getCell(this._focusedCellPosition));
  },

  _updateFocusedCellPositionByTarget(target) {
    const elementType = this._getElementType(target);
    if (elementType === 'row' && isDefined(this._focusedCellPosition?.columnIndex)) {
      const $row = $(target);
      this._focusedView && isGroupRow($row) && this.setFocusedRowIndex(this._getRowIndex($row));
    } else {
      this._updateFocusedCellPosition(this._getCellElementFromTarget(target));
    }
  },

  _updateFocusedCellPosition($cell, direction) {
    const position = this._getCellPosition($cell, direction);
    if (position) {
      if (!$cell.length || position.rowIndex >= 0 && position.columnIndex >= 0) {
        this.setFocusedCellPosition(position.rowIndex, position.columnIndex);
      }
    }
    return position;
  },
  _getFocusedColumnIndexOffset(columnIndex) {
    let offset = 0;
    const column = this._columnsController.getVisibleColumns()[columnIndex];
    if (column && column.fixed) {
      offset = this._getFixedColumnIndexOffset(column);
    } else if (columnIndex >= 0) {
      offset = this._columnsController.getColumnIndexOffset();
    }
    return offset;
  },
  _getFixedColumnIndexOffset(column) {
    const offset = isFixedColumnIndexOffsetRequired(this, column) ? this._getVisibleColumnCount() - this._columnsController.getVisibleColumns().length : 0;
    return offset;
  },
  _getCellPosition($cell, direction) {
    let columnIndex;
    const $row = isElementDefined($cell) && $cell.closest('tr');
    const rowsView = this.getView('rowsView');

    if (isElementDefined($row)) {
      const rowIndex = this._getRowIndex($row);

      columnIndex = rowsView.getCellIndex($cell, rowIndex);
      columnIndex += this._getFocusedColumnIndexOffset(columnIndex);

      if (direction) {
        columnIndex = direction === 'previous' ? columnIndex - 1 : columnIndex + 1;
        columnIndex = this._applyColumnIndexBoundaries(columnIndex);
      }

      return { rowIndex, columnIndex };
    }

    return undefined;
  },
  _focusCell($cell, isDisabled) {
    if (this._isCellValid($cell)) {
      this._focus($cell, isDisabled);
      return true;
    }

    return undefined;
  },
  _focusEditFormCell($cell) {
    if ($cell.hasClass(MASTER_DETAIL_CELL_CLASS)) {
      this._editorFactory.focus($cell, true);
    }
  },
  _resetFocusedCell(preventScroll) {
    const $cell = this._getFocusedCell();

    isElementDefined($cell) && $cell.removeAttr('tabindex');
    this._isNeedFocus = false;
    this._isNeedScroll = false;
    this._focusedCellPosition = {};
    clearTimeout(this._updateFocusTimeout);
    this._focusedView?.renderFocusState({ preventScroll });
  },
  restoreFocusableElement(rowIndex, $event) {
    const that = this;
    let args;
    let $rowElement;
    const isUpArrow = isDefined(rowIndex);
    const rowsView = that.getView('rowsView');
    const $rowsViewElement = rowsView.element();
    const { columnIndex } = that._focusedCellPosition;
    const rowIndexOffset = that._dataController.getRowIndexOffset();

    rowIndex = isUpArrow ? rowIndex : rowsView.getTopVisibleItemIndex() + rowIndexOffset;

    if (!isUpArrow) {
      that._editorFactory.loseFocus();
      that._applyTabIndexToElement($rowsViewElement);
      // @ts-expect-error
      eventsEngine.trigger($rowsViewElement, 'focus');
    } else {
      $rowElement = rowsView.getRow(rowIndex - rowIndexOffset);
      args = that._fireFocusedRowChanging($event, $rowElement);

      if (!args.cancel && args.rowIndexChanged) {
        rowIndex = args.newRowIndex;
      }
    }

    if (!isUpArrow || !args.cancel) {
      that.setFocusedCellPosition(rowIndex, columnIndex);
    }

    isUpArrow && that._updateFocus();
  },
  // #endregion Focusing
  // #region Cell_Position
  _getNewPositionByCode(cellPosition, elementType, code) {
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
        if (columnIndex < visibleColumnsCount - 1 && elementType !== 'row' && this._hasValidCellAfterPosition({ columnIndex, rowIndex })) {
          columnIndex++;
        } else if (!this._isLastRow(rowIndex) && code === 'next') {
          columnIndex = 0;
          rowIndex++;
        }
        break;
      case 'previousInRow':
      case 'previous':
        if (columnIndex > 0 && elementType !== 'row' && this._hasValidCellBeforePosition({ columnIndex, rowIndex })) {
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
  },
  setFocusedCellPosition(rowIndex, columnIndex) {
    this.setFocusedRowIndex(rowIndex);
    this.setFocusedColumnIndex(columnIndex);
  },
  setFocusedRowIndex(rowIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }
    this._focusedCellPosition.rowIndex = rowIndex;
  },
  setFocusedColumnIndex(columnIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }
    this._focusedCellPosition.columnIndex = columnIndex;
  },
  getRowIndex() {
    return this._focusedCellPosition ? this._focusedCellPosition.rowIndex : -1;
  },
  getColumnIndex() {
    return this._focusedCellPosition ? this._focusedCellPosition.columnIndex : -1;
  },
  getVisibleRowIndex() {
    const rowIndex = this._focusedCellPosition && this._focusedCellPosition.rowIndex;
    if (!isDefined(rowIndex) || rowIndex < 0) {
      return -1;
    }
    return rowIndex - this._dataController.getRowIndexOffset();
  },
  getVisibleColumnIndex() {
    const columnIndex = this._focusedCellPosition && this._focusedCellPosition.columnIndex;
    if (!isDefined(columnIndex)) {
      return -1;
    }
    return columnIndex - this._columnsController.getColumnIndexOffset();
  },
  _applyColumnIndexBoundaries(columnIndex) {
    const visibleColumnsCount = this._getVisibleColumnCount();

    if (columnIndex < 0) {
      columnIndex = 0;
    } else if (columnIndex >= visibleColumnsCount) {
      columnIndex = visibleColumnsCount - 1;
    }

    return columnIndex;
  },
  _isCellByPositionValid(cellPosition) {
    const $cell = $(this._getCell(cellPosition));
    return this._isCellValid($cell);
  },
  _isLastRow(rowIndex) {
    const dataController = this._dataController;
    const visibleItems = dataController.items().filter((item) => item.visible !== false);

    if (this._isVirtualRowRender()) {
      return rowIndex >= dataController.getMaxRowIndex();
    }

    return rowIndex === visibleItems.length - 1;
  },
  _isFirstValidCell(cellPosition) {
    let isFirstValidCell = false;

    if (cellPosition.rowIndex === 0 && cellPosition.columnIndex >= 0) {
      isFirstValidCell = isFirstValidCell || !this._hasValidCellBeforePosition(cellPosition);
    }

    return isFirstValidCell;
  },
  _hasValidCellBeforePosition(cellPosition) {
    let { columnIndex } = cellPosition;
    let hasValidCells = false;

    while (columnIndex > 0 && !hasValidCells) {
      const checkingPosition = { columnIndex: --columnIndex, rowIndex: cellPosition.rowIndex };

      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }
    return hasValidCells;
  },
  _hasValidCellAfterPosition(cellPosition) {
    let { columnIndex } = cellPosition;
    let hasValidCells = false;
    const visibleColumnCount = this._getVisibleColumnCount();

    while (columnIndex < visibleColumnCount - 1 && !hasValidCells) {
      const checkingPosition = { columnIndex: ++columnIndex, rowIndex: cellPosition.rowIndex };

      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }
    return hasValidCells;
  },
  _isLastValidCell(cellPosition) {
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

    if (row && row.rowType === 'group' && cellPosition.columnIndex > 0) {
      return true;
    }

    if (cellPosition.columnIndex === this._getVisibleColumnCount() - 1) {
      return true;
    }

    if (this._isCellByPositionValid(checkingPosition)) {
      return false;
    }

    return this._isLastValidCell(checkingPosition);
  },
  // #endregion Cell_Position
  // #region DOM_Manipulation
  _isCellValid($cell, isClick) {
    if (isElementDefined($cell)) {
      const rowsView = this.getView('rowsView');
      const $row = $cell.parent();
      const columnsController = this._columnsController;
      const columnIndex = rowsView.getCellIndex($cell) + columnsController.getColumnIndexOffset();
      const column = columnsController.getVisibleColumns(null, true)[columnIndex];
      const visibleColumnCount = this._getVisibleColumnCount();
      const editingController = this._editingController;
      const isMasterDetailRow = isDetailRow($row);
      const isShowWhenGrouped = column && column.showWhenGrouped;
      const isDataCell = column && !$cell.hasClass(COMMAND_EXPAND_CLASS) && isDataRow($row);
      const isValidGroupSpaceColumn = function () {
        // eslint-disable-next-line radix
        return !isMasterDetailRow && column && (!isDefined(column.groupIndex) || isShowWhenGrouped && isDataCell) || parseInt($cell.attr('colspan')) > 1;
      };

      const isDragCell = GridCoreKeyboardNavigationDom.isDragCell($cell);
      if (isDragCell) {
        return false;
      }

      if (this._isMasterDetailCell($cell)) {
        return true;
      }

      if (visibleColumnCount > columnIndex && isValidGroupSpaceColumn()) {
        const rowItems = this._dataController.items();
        const visibleRowIndex = rowsView.getRowIndex($row);
        const row = rowItems[visibleRowIndex];
        const isCellEditing = editingController && this._isCellEditMode() && editingController.isEditing();
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
  },
  getFirstValidCellInRow($row, columnIndex) {
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
  },
  _getNextCell(keyCode, elementType, cellPosition) {
    const focusedCellPosition = cellPosition || this._focusedCellPosition;
    const isRowFocusType = this.isRowFocusType();
    const includeCommandCells = isRowFocusType || ['next', 'previous'].includes(keyCode);
    let $cell;
    let $row;

    if (this._focusedView && focusedCellPosition) {
      const newFocusedCellPosition = this._getNewPositionByCode(focusedCellPosition, elementType, keyCode);
      $cell = $(this._getCell(newFocusedCellPosition));
      const isLastCellOnDirection = keyCode === 'previous' ? this._isFirstValidCell(newFocusedCellPosition) : this._isLastValidCell(newFocusedCellPosition);

      if (isElementDefined($cell) && !this._isCellValid($cell) && this._isCellInRow(newFocusedCellPosition, includeCommandCells) && !isLastCellOnDirection) {
        if (isRowFocusType) {
          $cell = this.getFirstValidCellInRow($cell.parent(), newFocusedCellPosition.columnIndex);
        } else {
          $cell = this._getNextCell(keyCode, 'cell', newFocusedCellPosition);
        }
      }

      $row = isElementDefined($cell) && $cell.parent();
      if (this._hasSkipRow($row)) {
        const rowIndex = this._getRowIndex($row);
        if (!this._isLastRow(rowIndex)) {
          $cell = this._getNextCell(keyCode, 'row', { columnIndex: focusedCellPosition.columnIndex, rowIndex });
        } else {
          return null;
        }
      }

      return isElementDefined($cell) ? $cell : null;
    }
    return null;
  },
  // #endregion DOM_Manipulation
  // #region Editing
  _startEditing(eventArgs, fastEditingKey) {
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
  },
  _isAllowEditing(row, column) {
    return this._editingController.allowUpdating({ row }) && column && column.allowEditing;
  },
  _editFocusedCell() {
    const rowIndex = this.getVisibleRowIndex();
    const colIndex = this.getVisibleColumnIndex();

    return this._editingController.editCell(rowIndex, colIndex);
  },
  _startEditCell(eventArgs, fastEditingKey) {
    this._fastEditingStarted = isDefined(fastEditingKey);
    const editResult = this._editFocusedCell();

    if (this._isFastEditingStarted()) {
      if (editResult === true) {
        this._editingCellHandler(eventArgs, fastEditingKey);
      } else if (editResult && editResult.done) {
        const editorValue = fastEditingKey !== FAST_EDITING_DELETE_KEY ? fastEditingKey : '';
        editResult.done(() => this._editingCellHandler(eventArgs, editorValue));
      }
    }
  },
  _editingCellHandler(eventArgs, editorValue) {
    const $input = this._getFocusedCell().find(INTERACTIVE_ELEMENTS_SELECTOR).eq(0);
    const keyDownEvent = createEvent(eventArgs, { type: 'keydown', target: $input.get(0) });
    const keyPressEvent = createEvent(eventArgs, { type: 'keypress', target: $input.get(0) });
    const inputEvent = createEvent(eventArgs, { type: 'input', target: $input.get(0) });

    if (inputEvent.originalEvent) {
      inputEvent.originalEvent = createEvent(inputEvent.originalEvent, { data: editorValue }); // T1116105
    }

    $input.get(0).select?.();
    // @ts-expect-error
    eventsEngine.trigger($input, keyDownEvent);

    if (!keyDownEvent.isDefaultPrevented()) {
      // @ts-expect-error
      eventsEngine.trigger($input, keyPressEvent);
      if (!keyPressEvent.isDefaultPrevented()) {
        const timeout = browser.mozilla ? 25 : 0; // T882996
        setTimeout(() => {
          $input.val(editorValue);

          const $widgetContainer = $input.closest(`.${WIDGET_CLASS}`);
          // @ts-expect-error
          eventsEngine.off($widgetContainer, 'focusout'); // for NumberBox to save entered symbol
          // @ts-expect-error
          eventsEngine.one($widgetContainer, 'focusout', () => {
            // @ts-expect-error
            eventsEngine.trigger($input, 'change');
          });
          // @ts-expect-error
          eventsEngine.trigger($input, inputEvent);
        }, timeout);
      }
    }
  },
  // #endregion Editing
  // #region Events
  _fireFocusChangingEvents($event, $cell, fireRowEvent, isHighlighted) {
    let args: any = {};
    const cellPosition = this._getCellPosition($cell) || {};

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
  },
  _fireFocusedCellChanging($event, $cellElement, isHighlighted) {
    const that = this;
    const prevCellIndex = that.option('focusedColumnIndex');
    const prevRowIndex = that.option('focusedRowIndex');
    const cellPosition = that._getCellPosition($cellElement);
    const columnIndex = cellPosition ? cellPosition.columnIndex : -1;
    const rowIndex = cellPosition ? cellPosition.rowIndex : -1;
    const args: any = {
      cellElement: $cellElement,
      prevColumnIndex: prevCellIndex,
      prevRowIndex,
      newColumnIndex: columnIndex,
      newRowIndex: rowIndex,
      rows: that._dataController.getVisibleRows(),
      columns: that._columnsController.getVisibleColumns(),
      event: $event,
      isHighlighted: isHighlighted || false,
      cancel: false,
    };

    this._canceledCellPosition = null;

    that.executeAction('onFocusedCellChanging', args);
    if (args.newColumnIndex !== columnIndex || args.newRowIndex !== rowIndex) {
      args.$newCellElement = $(this._getCell({ columnIndex: args.newColumnIndex, rowIndex: args.newRowIndex }));
    }

    if (args.cancel) {
      this._canceledCellPosition = { rowIndex, columnIndex };
    }

    return args;
  },
  _fireFocusedCellChanged($cellElement, prevCellIndex, prevRowIndex) {
    const that = this;
    const dataController = that._dataController;
    const columnIndex = that.getView('rowsView').getCellIndex($cellElement);
    const rowIndex = this._getRowIndex($cellElement && $cellElement.parent());
    const localRowIndex = Math.min(rowIndex - dataController.getRowIndexOffset(), dataController.items().length - 1);
    const isEditingCell = that._editingController.isEditCell(localRowIndex, columnIndex);
    const row = dataController.items()[localRowIndex];

    if (!isEditingCell && (prevCellIndex !== columnIndex || prevRowIndex !== rowIndex)) {
      that.executeAction('onFocusedCellChanged', {
        cellElement: $cellElement,
        columnIndex,
        rowIndex,
        row,
        column: that._columnsController.getVisibleColumns()[columnIndex],
      });
    }
  },
  _fireFocusedRowChanging(eventArgs, $newFocusedRow) {
    const newRowIndex = this._getRowIndex($newFocusedRow);
    const dataController = this._dataController;
    const prevFocusedRowIndex = this.option('focusedRowIndex');
    const loadingOperationTypes = dataController.loadingOperationTypes();
    const args: any = {
      rowElement: $newFocusedRow,
      prevRowIndex: prevFocusedRowIndex,
      newRowIndex,
      event: eventArgs,
      rows: dataController.getVisibleRows(),
      cancel: false,
    };

    if (!dataController || dataController.isLoading() && (loadingOperationTypes.reload || loadingOperationTypes.paging)) {
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
  },
  _fireFocusedRowChanged($rowElement) {
    let row;

    const focusedRowKey = this.option('focusedRowKey');

    const focusController = this.getController('focus');
    const focusedRowIndex = focusController?.getFocusedRowIndexByKey(focusedRowKey);

    if (this.option('focusedRowEnabled')) {
      if (focusedRowIndex >= 0) {
        const dataController = this._dataController;
        row = focusedRowIndex >= 0 && dataController.getVisibleRows()[focusedRowIndex - dataController.getRowIndexOffset()];
      }
      this.executeAction('onFocusedRowChanged', {
        rowElement: $rowElement,
        rowIndex: focusedRowIndex,
        row,
      });
    }
  },
  // #endregion Events
  _isEventInCurrentGrid(event) {
    return gridCoreUtils.isElementInCurrentGrid(this, $(event.target));
  },
  _isRowEditMode() {
    const editMode = this._editingController.getEditMode();
    return editMode === EDIT_MODE_ROW || editMode === EDIT_MODE_FORM;
  },
  _isCellEditMode() {
    const editMode = this._editingController.getEditMode();
    return editMode === EDIT_MODE_CELL || editMode === EDIT_MODE_BATCH;
  },
  _isFastEditingAllowed() {
    return this._isCellEditMode() && this.option('keyboardNavigation.editOnKeyPress');
  },
  _getInteractiveElement($cell, isLast) {
    const $focusedElement = $cell.find(INTERACTIVE_ELEMENTS_SELECTOR).filter(':visible');

    return isLast ? $focusedElement.last() : $focusedElement.first();
  },
  _applyTabIndexToElement($element) {
    const tabIndex = this.option('tabIndex') || 0;
    $element.attr('tabindex', isDefined(tabIndex) ? tabIndex : 0);
  },
  _getCell(cellPosition) {
    if (this._focusedView && cellPosition) {
      const rowIndexOffset = this._dataController.getRowIndexOffset();
      const column = this._columnsController.getVisibleColumns(null, true)[cellPosition.columnIndex];
      const columnIndexOffset = column && column.fixed ? this._getFixedColumnIndexOffset(column) : this._columnsController.getColumnIndexOffset();
      const rowIndex = cellPosition.rowIndex >= 0 ? cellPosition.rowIndex - rowIndexOffset : -1;
      const columnIndex = cellPosition.columnIndex >= 0 ? cellPosition.columnIndex - columnIndexOffset : -1;

      return this._focusedView.getCell({
        rowIndex,
        columnIndex,
      });
    }
  },
  _getRowIndex($row) {
    const rowsView = this.getView('rowsView');
    let rowIndex = rowsView.getRowIndex($row);

    if (rowIndex >= 0) {
      rowIndex += this._dataController.getRowIndexOffset();
    }

    return rowIndex;
  },
  _hasSkipRow($row) {
    const row = $row && $row.get(0);
    return row && (row.style.display === 'none' || $row.hasClass(this.addWidgetPrefix(GROUP_FOOTER_CLASS)) || (isDetailRow($row) && !$row.hasClass(this.addWidgetPrefix(EDIT_FORM_CLASS))));
  },
  _allowEditingOnEnterKey() {
    return this.option('keyboardNavigation.enterKeyAction') === 'startEdit';
  },
  _isLegacyNavigation() {
    return this.option('useLegacyKeyboardNavigation');
  },
  _getDirectionCodeByKey(key) {
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
        directionCode = this.option('rtlEnabled') ? 'nextInRow' : 'previousInRow';
        break;
      case 'rightArrow':
        directionCode = this.option('rtlEnabled') ? 'previousInRow' : 'nextInRow';
        break;
    }

    return directionCode;
  },
  _isVirtualScrolling() {
    const scrollingMode = this.option('scrolling.mode');
    return scrollingMode === 'virtual' || scrollingMode === 'infinite';
  },
  _isVirtualRowRender() {
    return this._isVirtualScrolling() || gridCoreUtils.isVirtualRowRendering(this);
  },
  _isVirtualColumnRender() {
    return this.option('scrolling.columnRenderingMode') === 'virtual';
  },
  _scrollBy(left, top, rowIndex, $event) {
    const that = this;
    const scrollable = this.getView('rowsView').getScrollable();

    if (that._focusedCellPosition) {
      const scrollHandler = function () {
        scrollable.off('scroll', scrollHandler);
        setTimeout(that.restoreFocusableElement.bind(that, rowIndex, $event));
      };
      scrollable.on('scroll', scrollHandler);
    }
    return scrollable.scrollBy({ left, top });
  },
  _isInsideEditForm(element) {
    const $editForm = $(element).closest(`.${this.addWidgetPrefix(EDIT_FORM_CLASS)}`);

    return $editForm.length && this.elementIsInsideGrid($editForm);
  },
  _isMasterDetailCell(element) {
    const $masterDetailCell = $(element).closest(`.${MASTER_DETAIL_CELL_CLASS}`);

    return $masterDetailCell.length && this.elementIsInsideGrid($masterDetailCell);
  },
  _processNextCellInMasterDetail($nextCell) {
    if (!this._isInsideEditForm($nextCell) && $nextCell) {
      this._applyTabIndexToElement($nextCell);
    }
  },
  _handleTabKeyOnMasterDetailCell(target, direction) {
    if (this._isMasterDetailCell(target)) {
      this._updateFocusedCellPosition($(target), direction);

      const $nextCell = this._getNextCell(direction, 'row');
      this._processNextCellInMasterDetail($nextCell, $(target));
      return true;
    }

    return false;
  },
  _getElementType(target) {
    return $(target).is('tr') ? 'row' : 'cell';
  },
  _isFastEditingStarted() {
    return this._isFastEditingAllowed() && this._fastEditingStarted;
  },
  _getVisibleColumnCount() {
    return this._columnsController.getVisibleColumns(null, true).length;
  },
  _isCellInRow(cellPosition, includeCommandCells) {
    const { columnIndex } = cellPosition;
    const visibleColumnsCount = this._getVisibleColumnCount();

    return includeCommandCells ? columnIndex >= 0 && columnIndex <= visibleColumnsCount - 1 : columnIndex > 0 && columnIndex < visibleColumnsCount - 1;
  },
  _isCellElement($element) {
    return $element.length && $element[0].tagName === 'TD';
  },
  _getCellElementFromTarget(target) {
    const elementType = this._getElementType(target);
    const $targetElement = $(target);
    let $cell;
    if (elementType === 'cell') {
      $cell = $targetElement.closest(`.${ROW_CLASS} > td`);
    } else {
      $cell = $targetElement.children().not(`.${COMMAND_EXPAND_CLASS}`).first();
    }
    return $cell;
  },
  _getRowsViewElement() {
    const rowsView = this.getView('rowsView');
    return rowsView && rowsView.element();
  },
  isKeyboardEnabled() {
    return this.option('keyboardNavigation.enabled');
  },
  _processCanceledEditCellPosition(rowIndex, columnIndex) {
    if (this._canceledCellPosition) {
      const isCanceled = this._canceledCellPosition.rowIndex === rowIndex && this._canceledCellPosition.columnIndex === columnIndex;
      this._canceledCellPosition = null;
      return isCanceled;
    }

    return undefined;
  },
  updateFocusedRowIndex() {
    const dataController = this._dataController;
    const visibleRowIndex = this.getVisibleRowIndex();
    const visibleItems = dataController.items();
    const lastVisibleIndex = visibleItems.length ? visibleItems.length - 1 : -1;
    const rowIndexOffset = dataController.getRowIndexOffset();

    lastVisibleIndex >= 0 && visibleRowIndex > lastVisibleIndex && this.setFocusedRowIndex(lastVisibleIndex + rowIndexOffset);
  },
};

const KeyboardNavigationController: any = core.ViewController.inherit(keyboardNavigationMembers);

export const keyboardNavigationModule: import('../module_types').Module = {
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
      rowsView: {
        _rowClick(e) {
          const editRowIndex = this.getController('editing').getEditRowIndex();
          const keyboardController = this.getController('keyboardNavigation');
          const isKeyboardEnabled = keyboardController.isKeyboardEnabled();

          if (editRowIndex === e.rowIndex) {
            keyboardController.setCellFocusType();
          }

          const needTriggerPointerEventHandler = (isMobile() || !isKeyboardEnabled) && this.option('focusedRowEnabled');
          if (needTriggerPointerEventHandler) {
            this._triggerPointerDownEventHandler(e, !isKeyboardEnabled);
          }

          this.callBase.apply(this, arguments);
        },
        _triggerPointerDownEventHandler(e, force) {
          const { originalEvent } = e.event;
          if (originalEvent) {
            const keyboardController = this.getController('keyboardNavigation');
            const $cell = $(originalEvent.target);
            const columnIndex = this.getCellIndex($cell);
            const column = this.getController('columns').getVisibleColumns()[columnIndex];
            const row = this.getController('data').items()[e.rowIndex];

            if (keyboardController._isAllowEditing(row, column) || force) {
              const eventArgs = createEvent(originalEvent, { currentTarget: originalEvent.target });
              keyboardController._pointerEventHandler(eventArgs);
            }
          }
        },
        renderFocusState(params) {
          const { preventScroll, pageSizeChanged } = params ?? {};
          const keyboardController = this.getController('keyboardNavigation');
          const $rowsViewElement = this.element();

          if ($rowsViewElement && !focused($rowsViewElement)) {
            $rowsViewElement.attr('tabindex', null);
          }

          pageSizeChanged && keyboardController.updateFocusedRowIndex();

          let rowIndex = keyboardController.getVisibleRowIndex();
          if (!isDefined(rowIndex) || rowIndex < 0) {
            rowIndex = 0;
          }

          const cellElements = this.getCellElements(rowIndex);
          if (keyboardController.isKeyboardEnabled() && cellElements.length) {
            this.updateFocusElementTabIndex(cellElements, preventScroll);
          }
        },
        updateFocusElementTabIndex(cellElements) {
          const keyboardController = this.getController('keyboardNavigation');
          const $row = cellElements.eq(0).parent();

          if (isGroupRow($row)) {
            keyboardController._applyTabIndexToElement($row);
          } else {
            let columnIndex = keyboardController.getColumnIndex();
            if (!isDefined(columnIndex) || columnIndex < 0) {
              columnIndex = 0;
            }
            this._updateFocusedCellTabIndex(cellElements, columnIndex);
          }
        },
        _updateFocusedCellTabIndex(cellElements, columnIndex) {
          const keyboardController = this.getController('keyboardNavigation');
          const cellElementsLength = cellElements ? cellElements.length : -1;
          const updateCellTabIndex = function ($cell) {
            const isMasterDetailCell = keyboardController._isMasterDetailCell($cell);
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
        },
        renderDelayedTemplates(change) {
          this.callBase.apply(this, arguments);
          this._renderFocusByChange(change);
        },
        _renderFocusByChange(change) {
          const { operationTypes, repaintChangesOnly } = change ?? {};
          const { fullReload, pageSize } = operationTypes ?? {};

          if (!change || !repaintChangesOnly || fullReload || pageSize) {
            const preventScroll = shouldPreventScroll(this);
            this.renderFocusState({
              preventScroll,
              pageSizeChanged: pageSize,
            });
          }
        },
        _renderCore(change) {
          const deferred = this.callBase.apply(this, arguments);
          this._renderFocusByChange(change);
          return deferred;
        },
        _editCellPrepared($cell) {
          const editorInstance = this._getEditorInstance($cell);
          const keyboardController = this.getController('keyboardNavigation');
          const isEditingNavigationMode = keyboardController && keyboardController._isFastEditingStarted();

          if (editorInstance && isEditingNavigationMode) {
            this._handleEditingNavigationMode(editorInstance);
          }

          this.callBase.apply(this, arguments);
        },
        _handleEditingNavigationMode(editorInstance) {
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
        },
        _getEditorInstance($cell) {
          const $editor = $cell.find('.dx-texteditor').eq(0);

          return gridCoreUtils.getWidgetInstance($editor);
        },
      },
    },
    controllers: {
      editing: {
        editCell(rowIndex, columnIndex) {
          const keyboardController = this.getController('keyboardNavigation');

          if (keyboardController._processCanceledEditCellPosition(rowIndex, columnIndex)) {
            return false;
          }

          const isCellEditing = this.callBase(rowIndex, columnIndex);
          if (isCellEditing) {
            keyboardController.setupFocusedView();
          }

          return isCellEditing;
        },
        editRow(rowIndex) {
          const keyboardController = this.getController('keyboardNavigation');
          const visibleColumnIndex = keyboardController.getVisibleColumnIndex();
          const column = this._columnsController.getVisibleColumns()[visibleColumnIndex];

          if (column && column.type || this.option('editing.mode') === EDIT_MODE_FORM) {
            keyboardController._resetFocusedCell();
          }
          this.callBase(rowIndex);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        addRow(parentKey) {
          const keyboardController = this.getController('keyboardNavigation');

          keyboardController.setupFocusedView();
          keyboardController.setCellFocusType();

          return this.callBase.apply(this, arguments);
        },
        getFocusedCellInRow(rowIndex) {
          const keyboardNavigationController = this.getController('keyboardNavigation');
          let $cell = this.callBase(rowIndex);

          if (keyboardNavigationController.isKeyboardEnabled() && keyboardNavigationController._focusedCellPosition.rowIndex === rowIndex) {
            const $focusedCell = keyboardNavigationController._getFocusedCell();
            if (isElementDefined($focusedCell) && !$focusedCell.hasClass(COMMAND_EDIT_CLASS)) {
              $cell = $focusedCell;
            }
          }

          return $cell;
        },
        _processCanceledEditingCell() {
          this.closeEditCell().done(() => {
            const keyboardNavigation = this.getController('keyboardNavigation');
            keyboardNavigation._updateFocus();
          });
        },
        init() {
          this.callBase();
          this._keyboardNavigationController = this.getController('keyboardNavigation');
        },
        closeEditCell() {
          const keyboardNavigation = this._keyboardNavigationController;
          keyboardNavigation._fastEditingStarted = false;

          const result = this.callBase.apply(this, arguments);

          keyboardNavigation._updateFocus();

          return result;
        },
        _delayedInputFocus() {
          this._keyboardNavigationController._isNeedScroll = true;
          this.callBase.apply(this, arguments);
        },
        _isEditingStart() {
          const keyboardNavigation = this.getController('keyboardNavigation');
          const cancel = this.callBase.apply(this, arguments);

          if (cancel && !keyboardNavigation._isNeedFocus) {
            const $cell = keyboardNavigation._getFocusedCell();
            keyboardNavigation._focus($cell, true);
          }

          return cancel;
        },
      },
      data: {
        _correctRowIndices(getRowIndexCorrection) {
          const that = this;
          const keyboardNavigationController = that.getController('keyboardNavigation');
          const editorFactory = that.getController('editorFactory');
          const focusedCellPosition = keyboardNavigationController._focusedCellPosition;

          that.callBase.apply(that, arguments);

          if (focusedCellPosition && focusedCellPosition.rowIndex >= 0) {
            const focusedRowIndexCorrection = getRowIndexCorrection(focusedCellPosition.rowIndex);
            if (focusedRowIndexCorrection) {
              focusedCellPosition.rowIndex += focusedRowIndexCorrection;
              editorFactory.refocus();
            }
          }
        },
        getMaxRowIndex() {
          let result = this.items().length - 1;
          const virtualItemsCount = this.virtualItemsCount();

          if (virtualItemsCount) {
            const rowIndexOffset = this.getRowIndexOffset();
            result += rowIndexOffset + virtualItemsCount.end;
          }

          return result;
        },
      },
      adaptiveColumns: {
        _showHiddenCellsInView({ viewName, $cells, isCommandColumn }) {
          this.callBase.apply(this, arguments);

          viewName === COLUMN_HEADERS_VIEW && !isCommandColumn && $cells.each((_, cellElement) => {
            const $cell = $(cellElement);
            isCellInHeaderRow($cell) && $cell.attr('tabindex', 0);
          });
        },
        _hideVisibleCellInView({ viewName, $cell, isCommandColumn }) {
          this.callBase.apply(this, arguments);

          if (viewName === COLUMN_HEADERS_VIEW && !isCommandColumn && isCellInHeaderRow($cell)) {
            $cell.removeAttr('tabindex');
          }
        },
      },
    },
  },
};
