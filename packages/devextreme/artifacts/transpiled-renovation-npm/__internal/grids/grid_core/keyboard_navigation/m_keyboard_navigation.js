"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyboardNavigationModule = exports.KeyboardNavigationController = void 0;
var _common = require("../../../../core/utils/common");
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _element = require("../../../../core/element");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _browser = _interopRequireDefault(require("../../../../core/utils/browser"));
var _deferred = require("../../../../core/utils/deferred");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _pointer = _interopRequireDefault(require("../../../../events/pointer"));
var _short = require("../../../../events/short");
var _index = require("../../../../events/utils/index");
var accessibility = _interopRequireWildcard(require("../../../../ui/shared/accessibility"));
var _selectors = require("../../../../ui/widget/selectors");
var _memoize = require("../../../utils/memoize");
var _const = require("../editing/const");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _const2 = require("./const");
var _dom = require("./dom");
var _m_keyboard_navigation_utils = require("./m_keyboard_navigation_utils");
var _scrollable_a11y = require("./scrollable_a11y");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

class KeyboardNavigationController extends _m_modules.default.ViewController {
  // #region Initialization
  init() {
    this._dataController = this.getController('data');
    this._selectionController = this.getController('selection');
    this._editingController = this.getController('editing');
    this._headerPanel = this.getView('headerPanel');
    this._rowsView = this.getView('rowsView');
    this._columnsController = this.getController('columns');
    this._editorFactory = this.getController('editorFactory');
    this._focusController = this.getController('focus');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._columnResizerController = this.getController('columnsResizer');
    this._memoFireFocusedCellChanged = (0, _memoize.memoize)(this._memoFireFocusedCellChanged.bind(this), {
      compareType: 'value'
    });
    this._memoFireFocusedRowChanged = (0, _memoize.memoize)(this._memoFireFocusedRowChanged.bind(this), {
      compareType: 'value'
    });
    this.focusedHandlerWithContext = this.focusedHandlerWithContext || this.focusedHandler.bind(this);
    this.renderCompletedWithContext = this.renderCompletedWithContext || this.renderCompleted.bind(this);
    this.rowsViewFocusHandlerContext = this.rowsViewFocusHandlerContext || this.rowsViewFocusHandler.bind(this);
    this.rowsViewFocusOutHandlerContext = this.rowsViewFocusOutHandlerContext ?? this.rowsViewFocusOutHandler.bind(this);
    this._updateFocusTimeout = null;
    this._fastEditingStarted = false;
    this._focusedCellPosition = {};
    this._canceledCellPosition = null;
    if (this.isKeyboardEnabled()) {
      var _this$_editorFactory;
      accessibility.subscribeVisibilityChange();
      (_this$_editorFactory = this._editorFactory) === null || _this$_editorFactory === void 0 || _this$_editorFactory.focused.add(this.focusedHandlerWithContext);
      this.createAction('onKeyDown');
    } else {
      var _this$_editorFactory2;
      accessibility.unsubscribeVisibilityChange();
      (_this$_editorFactory2 = this._editorFactory) === null || _this$_editorFactory2 === void 0 || _this$_editorFactory2.focused.remove(this.focusedHandlerWithContext);
    }
    this.initViewHandlers();
    this.initDocumentHandlers();
  }
  dispose() {
    super.dispose();
    this._resetFocusedView();
    _short.keyboard.off(this._keyDownListener);
    _events_engine.default.off(_dom_adapter.default.getDocument(), (0, _index.addNamespace)(_pointer.default.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
    clearTimeout(this._updateFocusTimeout);
    accessibility.unsubscribeVisibilityChange();
  }
  focusedHandler($element) {
    this.setupFocusedView();
    if (this._isNeedScroll) {
      if ($element.is(':visible') && this._focusedView && this._focusedView.getScrollable()) {
        this._focusedView._scrollToElement($element);
        this._isNeedScroll = false;
      }
    }
  }
  rowsViewFocusHandler(event) {
    const $element = (0, _renderer.default)(event.target);
    const isRelatedTargetInRowsView = (0, _renderer.default)(event.relatedTarget).closest(this._rowsView.element()).length;
    const isLink = $element.is('a');
    if (event.relatedTarget && isLink && !isRelatedTargetInRowsView && this._isEventInCurrentGrid(event)) {
      let $focusedCell = this._getFocusedCell();
      $focusedCell = !(0, _m_keyboard_navigation_utils.isElementDefined)($focusedCell) ? this._rowsView.getCellElements(0).filter('[tabindex]').eq(0) : $focusedCell;
      if (!$element.closest($focusedCell).length) {
        event.preventDefault();
        // @ts-expect-error
        _events_engine.default.trigger($focusedCell, 'focus');
      }
    }
    const isCell = $element.is('td');
    const needSetFocusPosition = (this.option('focusedRowIndex') ?? -1) < 0;
    if (isCell && needSetFocusPosition) {
      this._updateFocusedCellPosition($element);
    }
  }
  rowsViewFocusOutHandler() {
    this._toggleInertAttr(false);
  }
  subscribeToRowsViewFocusEvent() {
    var _this$_rowsView;
    const $rowsView = (_this$_rowsView = this._rowsView) === null || _this$_rowsView === void 0 ? void 0 : _this$_rowsView.element();
    _events_engine.default.on($rowsView, 'focusin', this.rowsViewFocusHandlerContext);
    _events_engine.default.on($rowsView, 'focusout', this.rowsViewFocusOutHandlerContext);
  }
  unsubscribeFromRowsViewFocusEvent() {
    var _this$_rowsView2;
    const $rowsView = (_this$_rowsView2 = this._rowsView) === null || _this$_rowsView2 === void 0 ? void 0 : _this$_rowsView2.element();
    _events_engine.default.off($rowsView, 'focusin', this.rowsViewFocusHandlerContext);
    _events_engine.default.off($rowsView, 'focusout', this.rowsViewFocusOutHandlerContext);
  }
  renderCompleted(e) {
    const $rowsView = this._rowsView.element();
    const isFullUpdate = !e || e.changeType === 'refresh';
    const isFocusedViewCorrect = this._focusedView && this._focusedView.name === this._rowsView.name;
    let needUpdateFocus = false;
    const isAppend = e && (e.changeType === 'append' || e.changeType === 'prepend');
    // @ts-expect-error
    const root = (0, _renderer.default)(_dom_adapter.default.getRootNode($rowsView.get && $rowsView.get(0)));
    const $focusedElement = root.find(':focus');
    const isFocusedElementCorrect = !$focusedElement.length || $focusedElement.closest($rowsView).length;
    this.unsubscribeFromRowsViewFocusEvent();
    this.subscribeToRowsViewFocusEvent();
    this.initPointerEventHandler();
    this.initKeyDownHandler();
    this._setRowsViewAttributes();
    if (isFocusedViewCorrect && isFocusedElementCorrect) {
      needUpdateFocus = this._isNeedFocus ? !isAppend : this._isHiddenFocus && isFullUpdate && !(e !== null && e !== void 0 && e.virtualColumnsScrolling);
      needUpdateFocus && this._updateFocus(true);
    }
  }
  initViewHandlers() {
    var _this$_rowsView3;
    this.unsubscribeFromRowsViewFocusEvent();
    this.unsubscribeFromPointerEvent();
    this.unsubscribeFromKeyDownEvent();
    (_this$_rowsView3 = this._rowsView) === null || _this$_rowsView3 === void 0 || (_this$_rowsView3 = _this$_rowsView3.renderCompleted) === null || _this$_rowsView3 === void 0 || _this$_rowsView3.remove(this.renderCompletedWithContext);
    if (this.isKeyboardEnabled()) {
      this._rowsView.renderCompleted.add(this.renderCompletedWithContext);
    }
  }
  initDocumentHandlers() {
    const document = _dom_adapter.default.getDocument();
    this._documentClickHandler = this._documentClickHandler || this.createAction(e => {
      const $target = (0, _renderer.default)(e.event.target);
      const isCurrentRowsViewClick = this._isEventInCurrentGrid(e.event) && $target.closest(`.${this.addWidgetPrefix(_const2.ROWS_VIEW_CLASS)}`).length;
      const isEditorOverlay = $target.closest(`.${_const2.DROPDOWN_EDITOR_OVERLAY_CLASS}`).length;
      const isColumnResizing = !!this._columnResizerController && this._columnResizerController.isResizing();
      if (!isCurrentRowsViewClick && !isEditorOverlay && !isColumnResizing) {
        const targetInsideFocusedView = this._focusedView ? $target.parents().filter(this._focusedView.element()).length > 0 : false;
        !targetInsideFocusedView && this._resetFocusedCell(true);
        this._resetFocusedView();
      }
    });
    _events_engine.default.off(document, (0, _index.addNamespace)(_pointer.default.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
    if (this.isKeyboardEnabled()) {
      _events_engine.default.on(document, (0, _index.addNamespace)(_pointer.default.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
    }
  }
  _setRowsViewAttributes() {
    const $rowsView = this._getRowsViewElement();
    const isGridEmpty = !this._dataController.getVisibleRows().length;
    if (isGridEmpty) {
      this._applyTabIndexToElement($rowsView);
    }
  }
  unsubscribeFromPointerEvent() {
    const pointerEventName = !(0, _m_keyboard_navigation_utils.isMobile)() ? _pointer.default.down : _click.name;
    const $rowsView = this._getRowsViewElement();
    this._pointerEventAction && _events_engine.default.off($rowsView, (0, _index.addNamespace)(pointerEventName, 'dxDataGridKeyboardNavigation'), this._pointerEventAction);
  }
  subscribeToPointerEvent() {
    const pointerEventName = !(0, _m_keyboard_navigation_utils.isMobile)() ? _pointer.default.down : _click.name;
    const $rowsView = this._getRowsViewElement();
    const clickSelector = `.${_const.ROW_CLASS} > td, .${_const.ROW_CLASS}`;
    _events_engine.default.on($rowsView, (0, _index.addNamespace)(pointerEventName, 'dxDataGridKeyboardNavigation'), clickSelector, this._pointerEventAction);
  }
  initPointerEventHandler() {
    this._pointerEventAction = this._pointerEventAction || this.createAction(this._pointerEventHandler);
    this.unsubscribeFromPointerEvent();
    this.subscribeToPointerEvent();
  }
  unsubscribeFromKeyDownEvent() {
    _short.keyboard.off(this._keyDownListener);
  }
  subscribeToKeyDownEvent() {
    const $rowsView = this._getRowsViewElement();
    this._keyDownListener = _short.keyboard.on($rowsView, null, e => this._keyDownHandler(e));
  }
  initKeyDownHandler() {
    this._keyDownListener && this.unsubscribeFromKeyDownEvent();
    this.subscribeToKeyDownEvent();
  }
  // #endregion Initialization
  // #region Options
  optionChanged(args) {
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
  isRowFocusType() {
    return this.focusType === _const2.FOCUS_TYPE_ROW;
  }
  isCellFocusType() {
    return this.focusType === _const2.FOCUS_TYPE_CELL;
  }
  setRowFocusType() {
    if (this.option('focusedRowEnabled')) {
      this.focusType = _const2.FOCUS_TYPE_ROW;
    }
  }
  setCellFocusType() {
    this.focusType = _const2.FOCUS_TYPE_CELL;
  }
  // #endregion Options
  // #region Key_Handlers
  _keyDownHandler(e) {
    var _this$_editingControl;
    let needStopPropagation = true;
    this._isNeedFocus = true;
    this._isNeedScroll = true;
    let isHandled = this._processOnKeyDown(e);
    const isEditing = (_this$_editingControl = this._editingController) === null || _this$_editingControl === void 0 ? void 0 : _this$_editingControl.isEditing();
    const {
      originalEvent
    } = e;
    if (originalEvent.isDefaultPrevented()) {
      this._isNeedFocus = false;
      this._isNeedScroll = false;
      return;
    }
    !_const2.FUNCTIONAL_KEYS.includes(e.keyName) && this._updateFocusedCellPositionByTarget(originalEvent.target);
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
          if ((0, _index.isCommandKeyPressed)(e.originalEvent)) {
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
          if ((0, _index.isCommandKeyPressed)(e.originalEvent)) {
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
  _processOnKeyDown(eventArgs) {
    const {
      originalEvent
    } = eventArgs;
    const args = {
      handled: false,
      event: originalEvent
    };
    this.executeAction('onKeyDown', args);
    eventArgs.ctrl = originalEvent.ctrlKey;
    eventArgs.alt = originalEvent.altKey;
    eventArgs.shift = originalEvent.shiftKey;
    return !!args.handled;
  }
  _closeEditCell() {
    const d = (0, _deferred.Deferred)();
    setTimeout(() => {
      this._editingController.closeEditCell().always(d.resolve);
    });
    return d;
  }
  /**
   * @extended: TreeList's keyboard_navigation
   */
  _leftRightKeysHandler(eventArgs, isEditing) {
    const rowIndex = this.getVisibleRowIndex();
    const $event = eventArgs.originalEvent;
    const $row = this._focusedView && this._focusedView.getRow(rowIndex);
    const directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
    const isEditingNavigationMode = this._isFastEditingStarted();
    const allowNavigate = (!isEditing || isEditingNavigationMode) && (0, _m_keyboard_navigation_utils.isDataRow)($row);
    if (allowNavigate) {
      this.setCellFocusType();
      isEditingNavigationMode && this._closeEditCell();
      if (this._isVirtualColumnRender()) {
        this._processVirtualHorizontalPosition(directionCode);
      }
      const $cell = this._getNextCell(directionCode);
      if ((0, _m_keyboard_navigation_utils.isElementDefined)($cell)) {
        this._arrowKeysHandlerFocusCell($event, $cell, directionCode);
      }
      $event && $event.preventDefault();
    }
  }
  isInsideMasterDetail($target) {
    const $masterDetail = $target.closest(`.${_const2.MASTER_DETAIL_CELL_CLASS}`);
    return !!$masterDetail.get(0) && this.elementIsInsideGrid($masterDetail) && !$target.is($masterDetail);
  }
  _upDownKeysHandler(eventArgs, isEditing) {
    var _this$_editingControl2, _this$_editingControl3;
    const visibleRowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView && this._focusedView.getRow(visibleRowIndex);
    const $event = eventArgs.originalEvent;
    const isUpArrow = eventArgs.keyName === 'upArrow';
    const dataSource = this._dataController.dataSource();
    const isRowEditingInCurrentRow = (_this$_editingControl2 = this._editingController) === null || _this$_editingControl2 === void 0 || (_this$_editingControl3 = _this$_editingControl2.isEditRowByIndex) === null || _this$_editingControl3 === void 0 ? void 0 : _this$_editingControl3.call(_this$_editingControl2, visibleRowIndex);
    const isEditingNavigationMode = this._isFastEditingStarted();
    const isInsideMasterDetail = this.isInsideMasterDetail((0, _renderer.default)($event === null || $event === void 0 ? void 0 : $event.target));
    const allowNavigate = (!isRowEditingInCurrentRow || !isEditing || isEditingNavigationMode) && $row && !(0, _m_keyboard_navigation_utils.isEditForm)($row) && !isInsideMasterDetail;
    if (allowNavigate) {
      isEditingNavigationMode && this._closeEditCell();
      if (!this._navigateNextCell($event, eventArgs.keyName)) {
        if (this._isVirtualRowRender() && isUpArrow && dataSource && !dataSource.isLoading()) {
          const rowHeight = (0, _size.getOuterHeight)($row);
          const rowIndex = this._focusedCellPosition.rowIndex - 1;
          this._scrollBy(0, -rowHeight, rowIndex, $event);
        }
      }
      $event && $event.preventDefault();
    }
  }
  _pageUpDownKeyHandler(eventArgs) {
    const pageIndex = this._dataController.pageIndex();
    const pageCount = this._dataController.pageCount();
    const pagingEnabled = this.option('paging.enabled');
    const isPageUp = eventArgs.keyName === 'pageUp';
    const pageStep = isPageUp ? -1 : 1;
    const scrollable = this._rowsView.getScrollable();
    if (pagingEnabled && !this._isVirtualScrolling()) {
      if ((isPageUp ? pageIndex > 0 : pageIndex < pageCount - 1) && !this._isVirtualScrolling()) {
        this._dataController.pageIndex(pageIndex + pageStep);
        eventArgs.originalEvent.preventDefault();
      }
    } else if (scrollable && (0, _size.getHeight)(scrollable.container()) < (0, _size.getHeight)(scrollable.$content())) {
      this._scrollBy(0, (0, _size.getHeight)(scrollable.container()) * pageStep);
      eventArgs.originalEvent.preventDefault();
    }
  }
  _spaceKeyHandler(eventArgs, isEditing) {
    const rowIndex = this.getVisibleRowIndex();
    const $target = (0, _renderer.default)(eventArgs.originalEvent && eventArgs.originalEvent.target);
    if (this.option('selection') && this.option('selection').mode !== 'none' && !isEditing) {
      const isFocusedRowElement = this._getElementType($target) === 'row' && this.isRowFocusType() && (0, _m_keyboard_navigation_utils.isDataRow)($target);
      const isFocusedSelectionCell = $target.hasClass(_const2.COMMAND_SELECT_CLASS);
      if (isFocusedSelectionCell && this.option('selection.showCheckBoxesMode') === 'onClick') {
        this._selectionController.startSelectionWithCheckboxes();
      }
      if (isFocusedRowElement || $target.parent().hasClass(_const2.DATA_ROW_CLASS) || $target.hasClass(this.addWidgetPrefix(_const2.ROWS_VIEW_CLASS))) {
        this._selectionController.changeItemSelection(rowIndex, {
          shift: eventArgs.shift,
          control: eventArgs.ctrl
        });
        eventArgs.originalEvent.preventDefault();
        return true;
      }
      return false;
    }
    return this._beginFastEditing(eventArgs.originalEvent);
  }
  _ctrlAKeyHandler(eventArgs, isEditing) {
    if (!isEditing && !eventArgs.alt && this.option('selection.mode') === 'multiple' && this.option('selection.allowSelectAll')) {
      this._selectionController.selectAll();
      eventArgs.originalEvent.preventDefault();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _toggleInertAttr(value) {}
  _tabKeyHandler(eventArgs, isEditing) {
    const editingOptions = this.option('editing');
    const direction = eventArgs.shift ? 'previous' : 'next';
    const isCellPositionDefined = (0, _type.isDefined)(this._focusedCellPosition) && !(0, _type.isEmptyObject)(this._focusedCellPosition);
    const isFirstValidCell = eventArgs.shift && this._isFirstValidCell(this._focusedCellPosition);
    const isLastValidCell = !eventArgs.shift && this._isLastValidCell(this._focusedCellPosition);
    let isOriginalHandlerRequired = !isCellPositionDefined || isFirstValidCell || isLastValidCell;
    const eventTarget = eventArgs.originalEvent.target;
    const focusedViewElement = this._focusedView && this._focusedView.element();
    if (this._handleTabKeyOnMasterDetailCell(eventTarget, direction)) {
      return;
    }
    (0, _renderer.default)(focusedViewElement).addClass(_const2.FOCUS_STATE_CLASS);
    if (editingOptions && eventTarget && !isOriginalHandlerRequired) {
      if ((0, _renderer.default)(eventTarget).hasClass(this.addWidgetPrefix(_const2.ROWS_VIEW_CLASS))) {
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
      if (isLastValidCell) {
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
  _getMaxHorizontalOffset() {
    const scrollable = this.component.getScrollable();
    return scrollable ? scrollable.scrollWidth() - (0, _size.getWidth)(this._rowsView.element()) : 0;
  }
  _isColumnRendered(columnIndex) {
    const allVisibleColumns = this._columnsController.getVisibleColumns(null, true);
    const renderedVisibleColumns = this._columnsController.getVisibleColumns();
    const column = allVisibleColumns[columnIndex];
    let result = false;
    if (column) {
      result = renderedVisibleColumns.indexOf(column) >= 0;
    }
    return result;
  }
  _isFixedColumn(columnIndex) {
    const allVisibleColumns = this._columnsController.getVisibleColumns(null, true);
    const column = allVisibleColumns[columnIndex];
    return !!column && !!column.fixed;
  }
  _isColumnVirtual(columnIndex) {
    const localColumnIndex = columnIndex - this._columnsController.getColumnIndexOffset();
    const visibleColumns = this._columnsController.getVisibleColumns();
    const column = visibleColumns[localColumnIndex];
    return !!column && column.command === 'virtual';
  }
  _processVirtualHorizontalPosition(direction) {
    const scrollable = this.component.getScrollable();
    const columnIndex = this.getColumnIndex();
    let nextColumnIndex;
    let horizontalScrollPosition = 0;
    let needToScroll = false;
    // eslint-disable-next-line default-case
    switch (direction) {
      case 'next':
      case 'nextInRow':
        {
          const columnsCount = this._getVisibleColumnCount();
          nextColumnIndex = columnIndex + 1;
          horizontalScrollPosition = this.option('rtlEnabled') ? this._getMaxHorizontalOffset() : 0;
          if (direction === 'next') {
            needToScroll = columnsCount === nextColumnIndex || this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          } else {
            needToScroll = columnsCount > nextColumnIndex && this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          }
          break;
        }
      case 'previous':
      case 'previousInRow':
        {
          nextColumnIndex = columnIndex - 1;
          horizontalScrollPosition = this.option('rtlEnabled') ? 0 : this._getMaxHorizontalOffset();
          if (direction === 'previous') {
            const columnIndexOffset = this._columnsController.getColumnIndexOffset();
            const leftEdgePosition = nextColumnIndex < 0 && columnIndexOffset === 0;
            needToScroll = leftEdgePosition || this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          } else {
            needToScroll = nextColumnIndex >= 0 && this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          }
          break;
        }
    }
    if (needToScroll) {
      scrollable.scrollTo({
        left: horizontalScrollPosition
      });
    } else if ((0, _type.isDefined)(nextColumnIndex) && (0, _type.isDefined)(direction) && this._isColumnVirtual(nextColumnIndex)) {
      horizontalScrollPosition = this._getHorizontalScrollPositionOffset(direction);
      horizontalScrollPosition !== 0 && scrollable.scrollBy({
        left: horizontalScrollPosition,
        top: 0
      });
    }
  }
  _getHorizontalScrollPositionOffset(direction) {
    let positionOffset = 0;
    const $currentCell = this._getCell(this._focusedCellPosition);
    const currentCellWidth = $currentCell && (0, _size.getOuterWidth)($currentCell);
    if (currentCellWidth > 0) {
      const rtlMultiplier = this.option('rtlEnabled') ? -1 : 1;
      positionOffset = direction === 'nextInRow' || direction === 'next' ? currentCellWidth * rtlMultiplier : currentCellWidth * rtlMultiplier * -1;
    }
    return positionOffset;
  }
  _editingCellTabHandler(eventArgs, direction) {
    const eventTarget = eventArgs.originalEvent.target;
    let $cell = this._getCellElementFromTarget(eventTarget);
    let isEditingAllowed;
    const $event = eventArgs.originalEvent;
    const elementType = this._getElementType(eventTarget);
    if ($cell.is(_const2.COMMAND_CELL_SELECTOR)) {
      return !this._targetCellTabHandler(eventArgs, direction);
    }
    this._updateFocusedCellPosition($cell);
    const nextCellInfo = this._getNextCellByTabKey($event, direction, elementType);
    $cell = nextCellInfo.$cell;
    if (!$cell || this._handleTabKeyOnMasterDetailCell($cell, direction)) {
      return false;
    }
    const column = this._getColumnByCellElement($cell);
    const $row = $cell.parent();
    const rowIndex = this._getRowIndex($row);
    const row = this._dataController.items()[rowIndex];
    const editingController = this._editingController;
    if (column && column.allowEditing) {
      const isDataRow = !row || row.rowType === 'data';
      isEditingAllowed = editingController.allowUpdating({
        row
      }) ? isDataRow : row && row.isNewRow;
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
  _targetCellTabHandler(eventArgs, direction) {
    const $event = eventArgs.originalEvent;
    let eventTarget = $event.target;
    let elementType = this._getElementType(eventTarget);
    let $cell = this._getCellElementFromTarget(eventTarget);
    const $lastInteractiveElement = elementType === 'cell' && this._getInteractiveElement($cell, !eventArgs.shift);
    let isOriginalHandlerRequired = false;
    if (!(0, _m_keyboard_navigation_utils.isEditorCell)(this, $cell) && $lastInteractiveElement !== null && $lastInteractiveElement !== void 0 && $lastInteractiveElement.length && eventTarget !== $lastInteractiveElement.get(0)) {
      isOriginalHandlerRequired = true;
    } else {
      if (this._focusedCellPosition.rowIndex === undefined && (0, _renderer.default)(eventTarget).hasClass(_const.ROW_CLASS)) {
        this._updateFocusedCellPosition($cell);
      }
      elementType = this._getElementType(eventTarget);
      if (this.isRowFocusType()) {
        this.setCellFocusType();
        if (elementType === 'row' && (0, _m_keyboard_navigation_utils.isDataRow)((0, _renderer.default)(eventTarget))) {
          eventTarget = this.getFirstValidCellInRow((0, _renderer.default)(eventTarget));
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
      if (!(0, _m_keyboard_navigation_utils.isEditorCell)(this, $cell)) {
        this._focusInteractiveElement($cell, eventArgs.shift);
      }
    }
    return isOriginalHandlerRequired;
  }
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
      isHighlighted: args.isHighlighted
    };
  }
  _checkNewLineTransition($event, $cell) {
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
  _enterKeyHandler(eventArgs, isEditing) {
    var _this$_focusedView, _this$getMasterDetail;
    const rowIndex = this.getVisibleRowIndex();
    const key = this._dataController.getKeyByRowIndex(rowIndex);
    const $row = (_this$_focusedView = this._focusedView) === null || _this$_focusedView === void 0 ? void 0 : _this$_focusedView.getRow(rowIndex);
    const $cell = this._getFocusedCell();
    const needExpandGroupRow = this.option('grouping.allowCollapsing') && (0, _m_keyboard_navigation_utils.isGroupRow)($row);
    const needExpandMasterDetailRow = this.option('masterDetail.enabled') && ($cell === null || $cell === void 0 ? void 0 : $cell.hasClass(_const2.COMMAND_EXPAND_CLASS));
    const needExpandAdaptiveRow = $cell === null || $cell === void 0 ? void 0 : $cell.hasClass(_const2.ADAPTIVE_COLUMN_NAME_CLASS);
    if (needExpandGroupRow || needExpandMasterDetailRow) {
      const item = this._dataController.items()[rowIndex];
      const isNotContinuation = (item === null || item === void 0 ? void 0 : item.data) && !item.data.isContinuation;
      if ((0, _type.isDefined)(key) && isNotContinuation) {
        this._dataController.changeRowExpand(key);
      }
    } else if (needExpandAdaptiveRow) {
      this._adaptiveColumnsController.toggleExpandAdaptiveDetailRow(key);
      this._updateFocusedCellPosition($cell);
    } else if ((_this$getMasterDetail = this.getMasterDetailCell($cell)) !== null && _this$getMasterDetail !== void 0 && _this$getMasterDetail.is($cell)) {
      if ($cell.is(':focus')) {
        this.focusFirstInteractiveElementInside($cell);
      }
    } else if (!($cell !== null && $cell !== void 0 && $cell.hasClass(_const2.COMMAND_EDIT_CLASS))) {
      this._processEnterKeyForDataCell(eventArgs, isEditing);
    }
  }
  focusFirstInteractiveElementInside($el) {
    $el.find(_const2.INTERACTIVE_ELEMENTS_SELECTOR).get(0).focus();
  }
  _processEnterKeyForDataCell(eventArgs, isEditing) {
    const direction = this._getEnterKeyDirection(eventArgs);
    const allowEditingOnEnterKey = this._allowEditingOnEnterKey();
    if (isEditing || !allowEditingOnEnterKey && direction) {
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
  }
  _handleEnterKeyEditingCell(event) {
    const d = (0, _deferred.Deferred)();
    const {
      target
    } = event;
    const $cell = this._getCellElementFromTarget(target);
    const isRowEditMode = this._isRowEditMode();
    this._updateFocusedCellPosition($cell);
    if (isRowEditMode) {
      this._focusEditFormCell($cell);
      setTimeout(this._editingController.saveEditData.bind(this._editingController));
      d.resolve();
    } else {
      // @ts-expect-error
      _events_engine.default.trigger((0, _renderer.default)(target), 'change');
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._closeEditCell().always(d.resolve);
      event.preventDefault();
    }
    return d;
  }
  /**
   * @extended
   */
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
      return true;
    }
    const masterDetailCell = this.getMasterDetailCell($cell);
    if (masterDetailCell) {
      this._focusCell(masterDetailCell);
      return true;
    }
    return false;
  }
  _ctrlFKeyHandler(eventArgs) {
    if (this.option('searchPanel.visible')) {
      // @ts-expect-error
      const searchTextEditor = this._headerPanel.getSearchTextEditor();
      if (searchTextEditor) {
        searchTextEditor.focus();
        eventArgs.originalEvent.preventDefault();
      }
    }
  }
  _f2KeyHandler() {
    const isEditing = this._editingController.isEditing();
    const rowIndex = this.getVisibleRowIndex();
    const $row = this._focusedView && this._focusedView.getRow(rowIndex);
    if (!isEditing && (0, _m_keyboard_navigation_utils.isDataRow)($row)) {
      this._startEditing();
    }
  }
  _navigateNextCell($event, keyCode) {
    const $cell = this._getNextCell(keyCode);
    const directionCode = this._getDirectionCodeByKey(keyCode);
    const isCellValid = $cell && this._isCellValid($cell);
    const result = isCellValid ? this._arrowKeysHandlerFocusCell($event, $cell, directionCode) : false;
    return result;
  }
  _arrowKeysHandlerFocusCell($event, $nextCell, direction) {
    const isVerticalDirection = direction === 'prevRow' || direction === 'nextRow';
    const args = this._fireFocusChangingEvents($event, $nextCell, isVerticalDirection, true);
    $nextCell = args.$newCellElement;
    if (!args.cancel && this._isCellValid($nextCell)) {
      this._focus($nextCell, !args.isHighlighted);
      return true;
    }
    return false;
  }
  _beginFastEditing(originalEvent, isDeleting) {
    if (!this._isFastEditingAllowed() || originalEvent.altKey || originalEvent.ctrlKey || this._editingController.isEditing()) {
      return false;
    }
    if (isDeleting) {
      this._startEditing(originalEvent, _const2.FAST_EDITING_DELETE_KEY);
    } else {
      const {
        key
      } = originalEvent;
      const keyCode = originalEvent.keyCode || originalEvent.which;
      const fastEditingKey = key || keyCode && String.fromCharCode(keyCode);
      if (fastEditingKey && (fastEditingKey.length === 1 || fastEditingKey === _const2.FAST_EDITING_DELETE_KEY)) {
        this._startEditing(originalEvent, fastEditingKey);
      }
    }
    return true;
  }
  // #endregion Key_Handlers
  // #region Pointer_Event_Handler
  _pointerEventHandler(e) {
    var _this$_rowsView4;
    const event = e.event || e;
    let $target = (0, _renderer.default)(event.currentTarget);
    const focusedViewElement = (_this$_rowsView4 = this._rowsView) === null || _this$_rowsView4 === void 0 ? void 0 : _this$_rowsView4.element();
    const $parent = $target.parent();
    const isInteractiveElement = (0, _renderer.default)(event.target).is(_const2.INTERACTIVE_ELEMENTS_SELECTOR);
    const isRevertButton = !!(0, _renderer.default)(event.target).closest(`.${_const2.REVERT_BUTTON_CLASS}`).length;
    const isExpandCommandCell = $target.hasClass(_const2.COMMAND_EXPAND_CLASS);
    if (!this._isEventInCurrentGrid(event)) {
      return;
    }
    if (!isRevertButton && (this._isCellValid($target, !isInteractiveElement) || isExpandCommandCell)) {
      $target = this._isInsideEditForm($target) ? (0, _renderer.default)(event.target) : $target;
      this._focusView();
      (0, _renderer.default)(focusedViewElement).removeClass(_const2.FOCUS_STATE_CLASS);
      if ($parent.hasClass(_const2.FREESPACE_ROW_CLASS)) {
        this._updateFocusedCellPosition($target);
        this._applyTabIndexToElement(this._focusedView.element());
        this._focusedView.focus(true);
      } else if (!this.getMasterDetailCell($target)) {
        this._clickTargetCellHandler(event, $target);
      } else {
        this._updateFocusedCellPosition($target);
      }
    } else if ($target.is('td')) {
      this._resetFocusedCell();
    }
  }
  _clickTargetCellHandler(event, $cell) {
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
      if (this._allowRowUpdating() && isCellEditMode && column && column.allowEditing) {
        this._isNeedFocus = false;
        this._isHiddenFocus = false;
      } else {
        $cell = this._getFocusedCell();
        const $target = event && (0, _renderer.default)(event.target).closest(`${_const2.NON_FOCUSABLE_ELEMENTS_SELECTOR}, td`);
        const skipFocusEvent = $target && $target.not($cell).is(_const2.NON_FOCUSABLE_ELEMENTS_SELECTOR);
        const isEditor = !!column && !column.command && $cell.hasClass(_const.EDITOR_CELL_CLASS);
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
  _allowRowUpdating() {
    const rowIndex = this.getVisibleRowIndex();
    const row = this._dataController.items()[rowIndex];
    return this._editingController.allowUpdating({
      row
    }, 'click');
  }
  // #endregion Pointer_Event_Handler
  // #region Focusing
  focus(element) {
    let activeElementSelector;
    const focusedRowEnabled = this.option('focusedRowEnabled');
    const isHighlighted = this._isCellElement((0, _renderer.default)(element));
    if (!element) {
      activeElementSelector = '.dx-datagrid-rowsview .dx-row[tabindex]';
      if (!focusedRowEnabled) {
        activeElementSelector += ', .dx-datagrid-rowsview .dx-row > td[tabindex]';
      }
      // @ts-expect-error
      element = this.component.$element().find(activeElementSelector).first();
    }
    element && this._focusElement((0, _renderer.default)(element), isHighlighted);
  }
  getFocusedView() {
    return this._focusedView;
  }
  setupFocusedView() {
    if (this.isKeyboardEnabled() && !(0, _type.isDefined)(this._focusedView)) {
      this._focusView();
    }
  }
  _focusElement($element, isHighlighted) {
    const rowsViewElement = (0, _renderer.default)(this._getRowsViewElement());
    const $focusedView = $element.closest(rowsViewElement);
    const isRowFocusType = this.isRowFocusType();
    let args = {};
    if (!$focusedView.length || this._isCellElement($element) && !this._isCellValid($element)) {
      return;
    }
    this._focusView();
    this._isNeedFocus = true;
    this._isNeedScroll = true;
    if (this._isCellElement($element) || (0, _m_keyboard_navigation_utils.isGroupRow)($element)) {
      this.setCellFocusType();
      args = this._fireFocusChangingEvents(null, $element, true, isHighlighted);
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
  _getFocusedViewByElement($element) {
    const view = this.getFocusedView();
    const $view = view && (0, _renderer.default)(view.element());
    return $element && $element.closest($view).length !== 0;
  }
  _focusView() {
    this._focusedView = this._rowsView;
  }
  _resetFocusedView() {
    this.setRowFocusType();
    this._focusedView = null;
  }
  _focusInteractiveElement($cell, isLast) {
    if (!$cell) return;
    const $focusedElement = this._getInteractiveElement($cell, isLast);
    
    _m_utils.default.focusAndSelectElement(this, $focusedElement);
  }
  _focus($cell, disableFocus, skipFocusEvent) {
    const $row = $cell && !$cell.hasClass(_const.ROW_CLASS) ? $cell.closest(`.${_const.ROW_CLASS}`) : $cell;
    if ($row && (0, _m_keyboard_navigation_utils.isNotFocusedRow)($row)) {
      return;
    }
    const focusedView = this._focusedView;
    const $focusViewElement = focusedView && focusedView.element();
    let $focusElement;
    this._isHiddenFocus = disableFocus;
    const isRowFocus = (0, _m_keyboard_navigation_utils.isGroupRow)($row) || (0, _m_keyboard_navigation_utils.isGroupFooterRow)($row) || this.isRowFocusType();
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
        $focusViewElement.find('.dx-row[tabindex], .dx-row > td[tabindex]').filter((i, node) => _m_utils.default.isElementInCurrentGrid(this, (0, _renderer.default)(node))).not($focusElement).removeClass(_const2.CELL_FOCUS_DISABLED_CLASS).removeClass(_const2.FOCUSED_CLASS).removeAttr('tabindex');
      }
      // @ts-expect-error
      _events_engine.default.one($focusElement, 'blur', e => {
        if (e.relatedTarget) {
          $focusElement.removeClass(_const2.CELL_FOCUS_DISABLED_CLASS).removeClass(_const2.FOCUSED_CLASS);
        }
      });
      if (!skipFocusEvent) {
        this._applyTabIndexToElement($focusElement);
        // @ts-expect-error
        _events_engine.default.trigger($focusElement, 'focus');
      }
      if (disableFocus) {
        $focusElement.addClass(_const2.CELL_FOCUS_DISABLED_CLASS);
        if (isRowFocus) {
          $cell.addClass(_const2.CELL_FOCUS_DISABLED_CLASS);
        }
      } else {
        this._editorFactory.focus($focusElement);
      }
    }
  }
  _updateFocus(isRenderView) {
    this._updateFocusTimeout = setTimeout(() => {
      if (this._needFocusEditingCell()) {
        this._editingController._focusEditingCell();
        return;
      }
      let $cell = this._getFocusedCell();
      const isEditing = this._editingController.isEditing();
      if (!this.getMasterDetailCell($cell) || this._isRowEditMode()) {
        if (this._hasSkipRow($cell.parent())) {
          const direction = this._focusedCellPosition && this._focusedCellPosition.rowIndex > 0 ? 'upArrow' : 'downArrow';
          $cell = this._getNextCell(direction);
        }
        if ((0, _m_keyboard_navigation_utils.isElementDefined)($cell)) {
          if ($cell.is('td') || $cell.hasClass(this.addWidgetPrefix(_const2.EDIT_FORM_ITEM_CLASS))) {
            const isCommandCell = $cell.is(_const2.COMMAND_CELL_SELECTOR);
            const $focusedElementInsideCell = $cell.find(':focus');
            const isFocusedElementDefined = (0, _m_keyboard_navigation_utils.isElementDefined)($focusedElementInsideCell);
            const column = this._getColumnByCellElement($cell);
            if ((isRenderView || !isCommandCell) && this._editorFactory.focus()) {
              if (isCommandCell && isFocusedElementDefined) {
                _m_utils.default.focusAndSelectElement(this, $focusedElementInsideCell);
                return;
              }
              !isFocusedElementDefined && this._focus($cell);
            } else if (!isFocusedElementDefined && (this._isNeedFocus || this._isHiddenFocus)) {
              this._focus($cell, this._isHiddenFocus);
            }
            if (isEditing && !(column !== null && column !== void 0 && column.showEditorAlways)) {
              this._focusInteractiveElement.bind(this)($cell);
            }
          } else {
            // @ts-expect-error
            _events_engine.default.trigger($cell, 'focus');
          }
        }
      }
    });
  }
  _getColumnByCellElement($cell) {
    const cellIndex = this._rowsView.getCellIndex($cell);
    const columnIndex = cellIndex + this._columnsController.getColumnIndexOffset();
    return this._columnsController.getVisibleColumns(null, true)[columnIndex];
  }
  _needFocusEditingCell() {
    const isCellEditMode = this._editingController.getEditMode() === _const.EDIT_MODE_CELL;
    const isBatchEditMode = this._editingController.getEditMode() === _const.EDIT_MODE_BATCH;
    const cellEditModeHasChanges = isCellEditMode && this._editingController.hasChanges();
    const isNewRowBatchEditMode = isBatchEditMode && this._editingController.isNewRowInEditMode();
    const $cell = this._getFocusedCell();
    return ($cell.children().length === 0 || $cell.find(_const.FOCUSABLE_ELEMENT_SELECTOR).length > 0) && (cellEditModeHasChanges || isNewRowBatchEditMode);
  }
  _getFocusedCell() {
    return (0, _renderer.default)(this._getCell(this._focusedCellPosition));
  }
  _updateFocusedCellPositionByTarget(target) {
    var _this$_focusedCellPos;
    const elementType = this._getElementType(target);
    if (elementType === 'row' && (0, _type.isDefined)((_this$_focusedCellPos = this._focusedCellPosition) === null || _this$_focusedCellPos === void 0 ? void 0 : _this$_focusedCellPos.columnIndex)) {
      const $row = (0, _renderer.default)(target);
      this._focusedView && (0, _m_keyboard_navigation_utils.isGroupRow)($row) && this.setFocusedRowIndex(this._getRowIndex($row));
    } else {
      this._updateFocusedCellPosition(this._getCellElementFromTarget(target));
    }
  }
  /**
   * @extended: focus
   */
  _updateFocusedCellPosition($cell, direction) {
    const position = this._getCellPosition($cell, direction);
    if (position) {
      if (!$cell.length || position.rowIndex >= 0 && position.columnIndex >= 0) {
        this.setFocusedCellPosition(position.rowIndex, position.columnIndex);
      }
    }
    return position;
  }
  _getFocusedColumnIndexOffset(columnIndex) {
    let offset = 0;
    const column = this._columnsController.getVisibleColumns()[columnIndex];
    if (column && column.fixed) {
      offset = this._getFixedColumnIndexOffset(column);
    } else if (columnIndex >= 0) {
      offset = this._columnsController.getColumnIndexOffset();
    }
    return offset;
  }
  _getFixedColumnIndexOffset(column) {
    const offset = (0, _m_keyboard_navigation_utils.isFixedColumnIndexOffsetRequired)(this, column) ? this._getVisibleColumnCount() - this._columnsController.getVisibleColumns().length : 0;
    return offset;
  }
  _getCellPosition($cell, direction) {
    let columnIndex;
    const $row = (0, _m_keyboard_navigation_utils.isElementDefined)($cell) && $cell.closest('tr');
    if ((0, _m_keyboard_navigation_utils.isElementDefined)($row)) {
      const rowIndex = this._getRowIndex($row);
      columnIndex = this._rowsView.getCellIndex($cell, rowIndex);
      columnIndex += this._getFocusedColumnIndexOffset(columnIndex);
      if (direction) {
        columnIndex = direction === 'previous' ? columnIndex - 1 : columnIndex + 1;
        columnIndex = this._applyColumnIndexBoundaries(columnIndex);
      }
      return {
        rowIndex,
        columnIndex
      };
    }
    return undefined;
  }
  _focusCell($cell, isDisabled) {
    if (this._isCellValid($cell)) {
      this._focus($cell, isDisabled);
      return true;
    }
    return undefined;
  }
  _focusEditFormCell($cell) {
    if ($cell.hasClass(_const2.MASTER_DETAIL_CELL_CLASS)) {
      this._editorFactory.focus($cell, true);
    }
  }
  _resetFocusedCell(preventScroll) {
    var _this$_focusedView2;
    const $cell = this._getFocusedCell();
    (0, _m_keyboard_navigation_utils.isElementDefined)($cell) && $cell.removeAttr('tabindex');
    this._isNeedFocus = false;
    this._isNeedScroll = false;
    this._focusedCellPosition = {};
    clearTimeout(this._updateFocusTimeout);
    (_this$_focusedView2 = this._focusedView) === null || _this$_focusedView2 === void 0 || _this$_focusedView2.renderFocusState({
      preventScroll
    });
  }
  restoreFocusableElement(rowIndex, $event) {
    const that = this;
    let args;
    let $rowElement;
    const isUpArrow = (0, _type.isDefined)(rowIndex);
    const $rowsViewElement = this._rowsView.element();
    const {
      columnIndex
    } = that._focusedCellPosition;
    const rowIndexOffset = that._dataController.getRowIndexOffset();
    rowIndex = isUpArrow ? rowIndex : this._rowsView.getTopVisibleItemIndex() + rowIndexOffset;
    if (!isUpArrow) {
      that._editorFactory.loseFocus();
      that._applyTabIndexToElement($rowsViewElement);
      // @ts-expect-error
      _events_engine.default.trigger($rowsViewElement, 'focus');
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
  _getNewPositionByCode(cellPosition, elementType, code) {
    let {
      columnIndex
    } = cellPosition;
    let {
      rowIndex
    } = cellPosition;
    let visibleColumnsCount;
    if (cellPosition.rowIndex === undefined && code === 'next') {
      return {
        columnIndex: 0,
        rowIndex: 0
      };
    }
    // eslint-disable-next-line default-case
    switch (code) {
      case 'nextInRow':
      case 'next':
        visibleColumnsCount = this._getVisibleColumnCount();
        if (columnIndex < visibleColumnsCount - 1 && elementType !== 'row' && this._hasValidCellAfterPosition({
          columnIndex,
          rowIndex
        })) {
          columnIndex++;
        } else if (!this._isLastRow(rowIndex) && code === 'next') {
          columnIndex = 0;
          rowIndex++;
        }
        break;
      case 'previousInRow':
      case 'previous':
        if (columnIndex > 0 && elementType !== 'row' && this._hasValidCellBeforePosition({
          columnIndex,
          rowIndex
        })) {
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
    return {
      columnIndex,
      rowIndex
    };
  }
  setFocusedCellPosition(rowIndex, columnIndex) {
    this.setFocusedRowIndex(rowIndex);
    this.setFocusedColumnIndex(columnIndex);
  }
  /**
   * @extended: focus
   */
  setFocusedRowIndex(rowIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }
    this._focusedCellPosition.rowIndex = rowIndex;
  }
  /**
   * @extended: focus
   */
  setFocusedColumnIndex(columnIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }
    this._focusedCellPosition.columnIndex = columnIndex;
  }
  getRowIndex() {
    return this._focusedCellPosition ? this._focusedCellPosition.rowIndex : -1;
  }
  getColumnIndex() {
    return this._focusedCellPosition ? this._focusedCellPosition.columnIndex : -1;
  }
  /**
   * @extended: TreeList's keyboard navigation
   */
  getVisibleRowIndex() {
    var _this$_focusedCellPos2;
    const rowIndex = (_this$_focusedCellPos2 = this._focusedCellPosition) === null || _this$_focusedCellPos2 === void 0 ? void 0 : _this$_focusedCellPos2.rowIndex;
    return !(0, _type.isDefined)(rowIndex) || rowIndex < 0 ? -1 : rowIndex - this._dataController.getRowIndexOffset();
  }
  getVisibleColumnIndex() {
    var _this$_focusedCellPos3;
    const columnIndex = (_this$_focusedCellPos3 = this._focusedCellPosition) === null || _this$_focusedCellPos3 === void 0 ? void 0 : _this$_focusedCellPos3.columnIndex;
    return !(0, _type.isDefined)(columnIndex) ? -1 : columnIndex - this._columnsController.getColumnIndexOffset();
  }
  _applyColumnIndexBoundaries(columnIndex) {
    const visibleColumnsCount = this._getVisibleColumnCount();
    if (columnIndex < 0) {
      columnIndex = 0;
    } else if (columnIndex >= visibleColumnsCount) {
      columnIndex = visibleColumnsCount - 1;
    }
    return columnIndex;
  }
  _isCellByPositionValid(cellPosition) {
    const $cell = (0, _renderer.default)(this._getCell(cellPosition));
    return this._isCellValid($cell);
  }
  _isLastRow(rowIndex) {
    const dataController = this._dataController;
    if (this._isVirtualRowRender()) {
      return rowIndex >= dataController.getMaxRowIndex();
    }
    const lastVisibleIndex = Math.max(...dataController.items().map((item, index) => item.visible !== false ? index : -1));
    return rowIndex === lastVisibleIndex;
  }
  _isFirstValidCell(cellPosition) {
    let isFirstValidCell = false;
    if (cellPosition.rowIndex === 0 && cellPosition.columnIndex >= 0) {
      isFirstValidCell = isFirstValidCell || !this._hasValidCellBeforePosition(cellPosition);
    }
    return isFirstValidCell;
  }
  _hasValidCellBeforePosition(cellPosition) {
    let {
      columnIndex
    } = cellPosition;
    let hasValidCells = false;
    while (columnIndex > 0 && !hasValidCells) {
      const checkingPosition = {
        columnIndex: --columnIndex,
        rowIndex: cellPosition.rowIndex
      };
      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }
    return hasValidCells;
  }
  _hasValidCellAfterPosition(cellPosition) {
    let {
      columnIndex
    } = cellPosition;
    let hasValidCells = false;
    const visibleColumnCount = this._getVisibleColumnCount();
    while (columnIndex < visibleColumnCount - 1 && !hasValidCells) {
      const checkingPosition = {
        columnIndex: ++columnIndex,
        rowIndex: cellPosition.rowIndex
      };
      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }
    return hasValidCells;
  }
  _isLastValidCell(cellPosition) {
    const nextColumnIndex = cellPosition.columnIndex >= 0 ? cellPosition.columnIndex + 1 : 0;
    const {
      rowIndex
    } = cellPosition;
    const checkingPosition = {
      columnIndex: nextColumnIndex,
      rowIndex
    };
    const visibleRows = this._dataController.getVisibleRows();
    const row = visibleRows && visibleRows[rowIndex];
    const isLastRow = this._isLastRow(rowIndex);
    if (!isLastRow) {
      return false;
    }
    const isFullRowFocus = (row === null || row === void 0 ? void 0 : row.rowType) === 'group' || (row === null || row === void 0 ? void 0 : row.rowType) === 'groupFooter';
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
  _isCellValid($cell, isClick) {
    if ((0, _m_keyboard_navigation_utils.isElementDefined)($cell)) {
      const $row = $cell.parent();
      const columnIndex = this._rowsView.getCellIndex($cell) + this._columnsController.getColumnIndexOffset();
      const column = this._getColumnByCellElement($cell);
      const visibleColumnCount = this._getVisibleColumnCount();
      const editingController = this._editingController;
      const isMasterDetailRow = (0, _m_keyboard_navigation_utils.isDetailRow)($row);
      const isShowWhenGrouped = column && column.showWhenGrouped;
      const isDataCell = column && !$cell.hasClass(_const2.COMMAND_EXPAND_CLASS) && (0, _m_keyboard_navigation_utils.isDataRow)($row);
      const isValidGroupSpaceColumn = function () {
        // eslint-disable-next-line radix
        return !isMasterDetailRow && column && (!(0, _type.isDefined)(column.groupIndex) || isShowWhenGrouped && isDataCell) || parseInt($cell.attr('colspan'), 10) > 1;
      };
      const isDragCell = _dom.GridCoreKeyboardNavigationDom.isDragCell($cell);
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
  }
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
  }
  _getNextCell(keyCode, elementType, cellPosition) {
    const focusedCellPosition = cellPosition || this._focusedCellPosition;
    const isRowFocusType = this.isRowFocusType();
    const includeCommandCells = isRowFocusType || ['next', 'previous'].includes(keyCode);
    let $cell;
    let $row;
    if (this._focusedView && focusedCellPosition) {
      const newFocusedCellPosition = this._getNewPositionByCode(focusedCellPosition, elementType, keyCode);
      $cell = (0, _renderer.default)(this._getCell(newFocusedCellPosition));
      const isLastCellOnDirection = keyCode === 'previous' ? this._isFirstValidCell(newFocusedCellPosition) : this._isLastValidCell(newFocusedCellPosition);
      if ((0, _m_keyboard_navigation_utils.isElementDefined)($cell) && !this._isCellValid($cell) && this._isCellInRow(newFocusedCellPosition, includeCommandCells) && !isLastCellOnDirection) {
        if (isRowFocusType) {
          $cell = this.getFirstValidCellInRow($cell.parent(), newFocusedCellPosition.columnIndex);
        } else {
          $cell = this._getNextCell(keyCode, 'cell', newFocusedCellPosition);
        }
      }
      $row = (0, _m_keyboard_navigation_utils.isElementDefined)($cell) && $cell.parent();
      if (this._hasSkipRow($row)) {
        const rowIndex = this._getRowIndex($row);
        if (!this._isLastRow(rowIndex)) {
          $cell = this._getNextCell(keyCode, 'row', {
            columnIndex: focusedCellPosition.columnIndex,
            rowIndex
          });
        } else {
          return null;
        }
      }
      return (0, _m_keyboard_navigation_utils.isElementDefined)($cell) ? $cell : null;
    }
    return null;
  }
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
  }
  _isAllowEditing(row, column) {
    return this._editingController.allowUpdating({
      row
    }) && column && column.allowEditing;
  }
  _editFocusedCell() {
    const rowIndex = this.getVisibleRowIndex();
    const colIndex = this.getVisibleColumnIndex();
    return this._editingController.editCell(rowIndex, colIndex);
  }
  _startEditCell(eventArgs, fastEditingKey) {
    this._fastEditingStarted = (0, _type.isDefined)(fastEditingKey);
    const editResult = this._editFocusedCell();
    const isEditResultDeferred = (0, _type.isDeferred)(editResult);
    const isFastEditingStarted = this._isFastEditingStarted();
    if (!isFastEditingStarted || !isEditResultDeferred && !editResult) {
      return;
    }
    const editorValue = isEditResultDeferred && fastEditingKey === _const2.FAST_EDITING_DELETE_KEY ? '' : fastEditingKey;
    const editResultDeferred = isEditResultDeferred ? editResult : (0, _deferred.Deferred)().resolve();
    const waitTemplatesDeferred = this._rowsView.waitAsyncTemplates(true);
    // NOTE T1158801: wait async templates before handle cell editing.
    (0, _deferred.when)(editResultDeferred, waitTemplatesDeferred).done(() => {
      this._editingCellHandler(eventArgs, editorValue);
    });
  }
  _editingCellHandler(eventArgs, editorValue) {
    var _$inputElement$select;
    const $input = this._getFocusedCell().find(_const2.INTERACTIVE_ELEMENTS_SELECTOR).eq(0);
    const $inputElement = $input.get(0);
    if (!$inputElement) {
      return;
    }
    const keyDownEvent = (0, _index.createEvent)(eventArgs, {
      type: 'keydown',
      target: $inputElement
    });
    const keyPressEvent = (0, _index.createEvent)(eventArgs, {
      type: 'keypress',
      target: $inputElement
    });
    const inputEvent = (0, _index.createEvent)(eventArgs, {
      type: 'input',
      target: $inputElement
    });
    if (inputEvent.originalEvent) {
      inputEvent.originalEvent = (0, _index.createEvent)(inputEvent.originalEvent, {
        data: editorValue
      }); // T1116105
    }
    (_$inputElement$select = $inputElement.select) === null || _$inputElement$select === void 0 || _$inputElement$select.call($inputElement);
    // @ts-expect-error
    _events_engine.default.trigger($input, keyDownEvent);
    if (!keyDownEvent.isDefaultPrevented()) {
      // @ts-expect-error
      _events_engine.default.trigger($input, keyPressEvent);
      if (!keyPressEvent.isDefaultPrevented()) {
        const timeout = _browser.default.mozilla ? 25 : 0; // T882996
        setTimeout(() => {
          const inputValue = this._getKeyPressInputValue($input, editorValue);
          $input.val(inputValue);
          const $widgetContainer = $input.closest(`.${_const2.WIDGET_CLASS}`);
          _events_engine.default.off($widgetContainer, 'focusout'); // for NumberBox to save entered symbol
          // @ts-expect-error
          _events_engine.default.one($widgetContainer, 'focusout', () => {
            // @ts-expect-error
            _events_engine.default.trigger($input, 'change');
          });
          // @ts-expect-error
          _events_engine.default.trigger($input, inputEvent);
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
  _getKeyPressInputValue($input, editorValue) {
    const inputCurrentValue = $input.val();
    return editorValue === '-' && inputCurrentValue === '-0' ? '-0' : editorValue;
  }
  // #endregion Editing
  // #region Events
  _fireFocusChangingEvents($event, $cell, fireRowEvent, isHighlighted) {
    let args = {};
    const cellPosition = this._getCellPosition($cell) ?? {};
    if (this.isCellFocusType()) {
      args = this._fireFocusedCellChanging($event, $cell, isHighlighted);
      if (!args.cancel) {
        cellPosition.columnIndex = args.newColumnIndex;
        cellPosition.rowIndex = args.newRowIndex;
        isHighlighted = args.isHighlighted;
        $cell = (0, _renderer.default)(this._getCell(cellPosition));
      }
    }
    if (!args.cancel && fireRowEvent && $cell) {
      args = this._fireFocusedRowChanging($event, $cell.parent());
      if (!args.cancel) {
        cellPosition.rowIndex = args.newRowIndex;
        args.isHighlighted = isHighlighted;
      }
    }
    args.$newCellElement = (0, _renderer.default)(this._getCell(cellPosition));
    if (!args.$newCellElement.length) {
      args.$newCellElement = $cell;
    }
    return args;
  }
  _fireFocusedCellChanging($event, $cellElement, isHighlighted) {
    const prevColumnIndex = this.option('focusedColumnIndex');
    const prevRowIndex = this.option('focusedRowIndex');
    const cellPosition = this._getCellPosition($cellElement);
    const columnIndex = cellPosition ? cellPosition.columnIndex : -1;
    const rowIndex = cellPosition ? cellPosition.rowIndex : -1;
    const visibleRows = this._dataController.getVisibleRows();
    const visibleColumns = this._columnsController.getVisibleColumns();
    const args = {
      cellElement: $cellElement,
      prevColumnIndex,
      prevRowIndex,
      newColumnIndex: columnIndex,
      newRowIndex: rowIndex,
      rows: visibleRows,
      columns: visibleColumns,
      event: $event,
      isHighlighted: isHighlighted || false,
      cancel: false
    };
    this._canceledCellPosition = null;
    this.executeAction('onFocusedCellChanging', args);
    if (args.newColumnIndex !== columnIndex || args.newRowIndex !== rowIndex) {
      args.$newCellElement = (0, _renderer.default)(this._getCell({
        columnIndex: args.newColumnIndex,
        rowIndex: args.newRowIndex
      }));
    }
    if (args.cancel) {
      this._canceledCellPosition = {
        rowIndex,
        columnIndex
      };
    }
    return args;
  }
  _fireFocusedCellChanged($cell) {
    const columnIndex = this._rowsView.getCellIndex($cell);
    const rowOptions = $cell === null || $cell === void 0 ? void 0 : $cell.parent().data('options');
    const focusedRowKey = rowOptions === null || rowOptions === void 0 ? void 0 : rowOptions.key;
    this._memoFireFocusedCellChanged(focusedRowKey, columnIndex);
  }
  _memoFireFocusedCellChanged(rowKey, columnIndex) {
    const $cell = this._getFocusedCell();
    const rowIndex = this._getRowIndex($cell === null || $cell === void 0 ? void 0 : $cell.parent());
    const localRowIndex = Math.min(rowIndex - this._dataController.getRowIndexOffset(), this._dataController.items().length - 1);
    const isEditingCell = this._editingController.isEditCell(localRowIndex, columnIndex);
    if (isEditingCell) {
      return;
    }
    const row = this._dataController.items()[localRowIndex];
    const column = this._columnsController.getVisibleColumns()[columnIndex];
    this.executeAction('onFocusedCellChanged', {
      cellElement: $cell ? (0, _element.getPublicElement)($cell) : undefined,
      columnIndex,
      rowIndex,
      row: row,
      column
    });
  }
  _fireFocusedRowChanging(eventArgs, $newFocusedRow) {
    const newRowIndex = this._getRowIndex($newFocusedRow);
    const prevFocusedRowIndex = this.option('focusedRowIndex');
    const loadingOperationTypes = this._dataController.loadingOperationTypes();
    const args = {
      rowElement: $newFocusedRow,
      prevRowIndex: prevFocusedRowIndex,
      newRowIndex,
      event: eventArgs,
      rows: this._dataController.getVisibleRows(),
      cancel: false
    };
    const loadingOperations = loadingOperationTypes.sorting || loadingOperationTypes.grouping || loadingOperationTypes.filtering || loadingOperationTypes.paging;
    if (!this._dataController || this._dataController.isLoading() && loadingOperations) {
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
  _fireFocusedRowChanged() {
    var _this$_focusControlle;
    const focusedRowEnabled = this.option('focusedRowEnabled');
    const focusedRowKey = this.option('focusedRowKey');
    const focusedRowIndex = (_this$_focusControlle = this._focusController) === null || _this$_focusControlle === void 0 ? void 0 : _this$_focusControlle.getFocusedRowIndexByKey(focusedRowKey);
    if (!focusedRowEnabled || (0, _type.isDefined)(focusedRowKey) && focusedRowIndex < 0) {
      return;
    }
    this._memoFireFocusedRowChanged(focusedRowKey, focusedRowIndex);
  }
  _memoFireFocusedRowChanged(focusedRowKey, focusedRowIndex) {
    const localRowIndex = focusedRowIndex - this._dataController.getRowIndexOffset();
    this.executeAction('onFocusedRowChanged', {
      rowElement: focusedRowIndex < 0 ? undefined : this._rowsView.getRowElement(localRowIndex),
      rowIndex: focusedRowIndex,
      row: focusedRowIndex < 0 ? undefined : this._dataController.getVisibleRows()[localRowIndex]
    });
  }
  // #endregion Events
  _isEventInCurrentGrid(event) {
    return _m_utils.default.isElementInCurrentGrid(this, (0, _renderer.default)(event.target));
  }
  _isRowEditMode() {
    const editMode = this._editingController.getEditMode();
    return editMode === _const.EDIT_MODE_ROW || editMode === _const.EDIT_MODE_FORM;
  }
  _isCellEditMode() {
    const editMode = this._editingController.getEditMode();
    return editMode === _const.EDIT_MODE_CELL || editMode === _const.EDIT_MODE_BATCH;
  }
  _isFastEditingAllowed() {
    return this._isCellEditMode() && this.option('keyboardNavigation.editOnKeyPress');
  }
  _getInteractiveElement($cell, isLast) {
    const $focusedElement = $cell.find(_const2.INTERACTIVE_ELEMENTS_SELECTOR).filter(':visible');
    return isLast ? $focusedElement.last() : $focusedElement.first();
  }
  _applyTabIndexToElement($element) {
    const tabIndex = this.option('tabIndex') ?? 0;
    $element.attr('tabindex', tabIndex);
  }
  _getCell(cellPosition) {
    if (this._focusedView && cellPosition) {
      const rowIndexOffset = this._dataController.getRowIndexOffset();
      const column = this._columnsController.getVisibleColumns(null, true)[cellPosition.columnIndex];
      const columnIndexOffset = column && column.fixed ? this._getFixedColumnIndexOffset(column) : this._columnsController.getColumnIndexOffset();
      const rowIndex = cellPosition.rowIndex >= 0 ? cellPosition.rowIndex - rowIndexOffset : -1;
      const columnIndex = cellPosition.columnIndex >= 0 ? cellPosition.columnIndex - columnIndexOffset : -1;
      return this._focusedView.getCell({
        rowIndex,
        columnIndex
      });
    }
  }
  _getRowIndex($row) {
    let rowIndex = this._rowsView.getRowIndex($row);
    if (rowIndex >= 0) {
      rowIndex += this._dataController.getRowIndexOffset();
    }
    return rowIndex;
  }
  _hasSkipRow($row) {
    const row = $row && $row.get(0);
    return row && row.style.display === 'none';
  }
  _allowEditingOnEnterKey() {
    return this.option('keyboardNavigation.enterKeyAction') === 'startEdit';
  }
  _isLegacyNavigation() {
    return this.option('useLegacyKeyboardNavigation');
  }
  /**
   * @extended: TreeList's keyboard_navigation
   */
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
  }
  _isVirtualScrolling() {
    const scrollingMode = this.option('scrolling.mode');
    return scrollingMode === 'virtual' || scrollingMode === 'infinite';
  }
  _isVirtualRowRender() {
    return this._isVirtualScrolling() || _m_utils.default.isVirtualRowRendering(this);
  }
  _isVirtualColumnRender() {
    return this.option('scrolling.columnRenderingMode') === 'virtual';
  }
  _scrollBy(left, top, rowIndex, $event) {
    const that = this;
    const scrollable = this._rowsView.getScrollable();
    if (that._focusedCellPosition) {
      const scrollHandler = function () {
        scrollable.off('scroll', scrollHandler);
        setTimeout(that.restoreFocusableElement.bind(that, rowIndex, $event));
      };
      scrollable.on('scroll', scrollHandler);
    }
    return scrollable.scrollBy({
      left,
      top
    });
  }
  _isInsideEditForm(element) {
    const $editForm = (0, _renderer.default)(element).closest(`.${this.addWidgetPrefix(_const.EDIT_FORM_CLASS)}`);
    return $editForm.length && this.elementIsInsideGrid($editForm);
  }
  getMasterDetailCell(element) {
    const $masterDetailCell = (0, _renderer.default)(element).closest(`.${_const2.MASTER_DETAIL_CELL_CLASS}`);
    if ($masterDetailCell.length && this.elementIsInsideGrid($masterDetailCell)) {
      return $masterDetailCell;
    }
    return null;
  }
  /**
   * @extended: adaptivity
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _processNextCellInMasterDetail($nextCell, _$cell) {
    if (!this._isInsideEditForm($nextCell) && $nextCell) {
      this._applyTabIndexToElement($nextCell);
    }
  }
  _handleTabKeyOnMasterDetailCell(target, direction) {
    if (this.getMasterDetailCell(target)) {
      this._updateFocusedCellPosition((0, _renderer.default)(target), direction);
      const $nextCell = this._getNextCell(direction, 'row');
      this._processNextCellInMasterDetail($nextCell, (0, _renderer.default)(target));
      return true;
    }
    return false;
  }
  _getElementType(target) {
    return (0, _renderer.default)(target).is('tr') ? 'row' : 'cell';
  }
  _isFastEditingStarted() {
    return this._isFastEditingAllowed() && this._fastEditingStarted;
  }
  _getVisibleColumnCount() {
    return this._columnsController.getVisibleColumns(null, true).length;
  }
  _isCellInRow(cellPosition, includeCommandCells) {
    const {
      columnIndex
    } = cellPosition;
    const visibleColumnsCount = this._getVisibleColumnCount();
    return includeCommandCells ? columnIndex >= 0 && columnIndex <= visibleColumnsCount - 1 : columnIndex > 0 && columnIndex < visibleColumnsCount - 1;
  }
  /**
   * @extended: adaptivity
   */
  _isCellElement($element) {
    return $element.length && $element[0].tagName === 'TD';
  }
  _getCellElementFromTarget(target) {
    const elementType = this._getElementType(target);
    const $targetElement = (0, _renderer.default)(target);
    let $cell;
    if (elementType === 'cell') {
      $cell = $targetElement.closest(`.${_const.ROW_CLASS} > td`);
    } else {
      $cell = $targetElement.children().not(`.${_const2.COMMAND_EXPAND_CLASS}`).first();
    }
    return $cell;
  }
  _getRowsViewElement() {
    var _this$_rowsView5;
    return (_this$_rowsView5 = this._rowsView) === null || _this$_rowsView5 === void 0 ? void 0 : _this$_rowsView5.element();
  }
  isKeyboardEnabled() {
    return this.option('keyboardNavigation.enabled');
  }
  _processCanceledEditCellPosition(rowIndex, columnIndex) {
    if (this._canceledCellPosition) {
      const isCanceled = this._canceledCellPosition.rowIndex === rowIndex && this._canceledCellPosition.columnIndex === columnIndex;
      this._canceledCellPosition = null;
      return isCanceled;
    }
    return undefined;
  }
  updateFocusedRowIndex() {
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
exports.KeyboardNavigationController = KeyboardNavigationController;
const rowsView = Base => class RowsViewKeyboardExtender extends Base {
  _rowClick(e) {
    const editRowIndex = this._editingController.getEditRowIndex();
    const isKeyboardEnabled = this._keyboardNavigationController.isKeyboardEnabled();
    if (editRowIndex === e.rowIndex) {
      this._keyboardNavigationController.setCellFocusType();
    }
    const needTriggerPointerEventHandler = ((0, _m_keyboard_navigation_utils.isMobile)() || !isKeyboardEnabled) && this.option('focusedRowEnabled');
    if (needTriggerPointerEventHandler) {
      this._triggerPointerDownEventHandler(e, !isKeyboardEnabled);
    }
    super._rowClick.apply(this, arguments);
  }
  _triggerPointerDownEventHandler(e, force) {
    const {
      originalEvent
    } = e.event;
    if (originalEvent) {
      const $cell = (0, _renderer.default)(originalEvent.target);
      const columnIndex = this.getCellIndex($cell);
      const column = this._columnsController.getVisibleColumns()[columnIndex];
      const row = this._dataController.items()[e.rowIndex];
      if (this._keyboardNavigationController._isAllowEditing(row, column) || force) {
        const eventArgs = (0, _index.createEvent)(originalEvent, {
          currentTarget: originalEvent.target
        });
        this._keyboardNavigationController._pointerEventHandler(eventArgs);
      }
    }
  }
  renderFocusState(params) {
    super.renderFocusState(params);
    const {
      preventScroll,
      pageSizeChanged
    } = params ?? {};
    const $rowsViewElement = this.element();
    if ($rowsViewElement && !(0, _selectors.focused)($rowsViewElement)) {
      $rowsViewElement.attr('tabindex', null);
    }
    pageSizeChanged && this._keyboardNavigationController.updateFocusedRowIndex();
    let rowIndex = this._keyboardNavigationController.getVisibleRowIndex();
    if (!(0, _type.isDefined)(rowIndex) || rowIndex < 0) {
      rowIndex = 0;
    }
    const cellElements = this.getCellElements(rowIndex);
    if (this._keyboardNavigationController.isKeyboardEnabled() && cellElements !== null && cellElements !== void 0 && cellElements.length) {
      this.updateFocusElementTabIndex(cellElements, preventScroll);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateFocusElementTabIndex(cellElements, preventScroll) {
    const $row = cellElements.eq(0).parent();
    if ((0, _m_keyboard_navigation_utils.isGroupRow)($row)) {
      this._keyboardNavigationController._applyTabIndexToElement($row);
    } else {
      let columnIndex = this._keyboardNavigationController.getColumnIndex();
      if (!(0, _type.isDefined)(columnIndex) || columnIndex < 0) {
        columnIndex = 0;
      }
      this._updateFocusedCellTabIndex(cellElements, columnIndex);
    }
  }
  _updateFocusedCellTabIndex(cellElements, columnIndex) {
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
    const $cell = _dom.GridCoreKeyboardNavigationDom.getCellToFocus(cellElements, columnIndex);
    if ($cell.length) {
      updateCellTabIndex($cell);
    } else {
      if (cellElementsLength <= columnIndex) {
        columnIndex = cellElementsLength - 1;
      }
      for (let i = columnIndex; i < cellElementsLength; ++i) {
        if (updateCellTabIndex((0, _renderer.default)(cellElements[i]))) {
          break;
        }
      }
    }
  }
  renderDelayedTemplates(change) {
    super.renderDelayedTemplates.apply(this, arguments);
    this.waitAsyncTemplates().done(() => {
      this._renderFocusByChange(change);
    });
  }
  _renderFocusByChange(change) {
    var _change$changeTypes;
    const {
      operationTypes,
      repaintChangesOnly
    } = change ?? {};
    const {
      fullReload,
      pageSize
    } = operationTypes ?? {};
    const hasInsertsOrRemoves = !!(change !== null && change !== void 0 && (_change$changeTypes = change.changeTypes) !== null && _change$changeTypes !== void 0 && _change$changeTypes.find(changeType => changeType === 'insert' || changeType === 'remove'));
    if (!change || !repaintChangesOnly || fullReload || pageSize || hasInsertsOrRemoves) {
      const preventScroll = (0, _m_keyboard_navigation_utils.shouldPreventScroll)(this);
      this.renderFocusState({
        preventScroll,
        pageSizeChanged: pageSize
      });
    }
  }
  _renderCore(change) {
    const deferred = super._renderCore.apply(this, arguments);
    this._renderFocusByChange(change);
    return deferred;
  }
  _editCellPrepared($cell) {
    var _this$_keyboardNaviga;
    const editorInstance = this._getEditorInstance($cell);
    const isEditingNavigationMode = (_this$_keyboardNaviga = this._keyboardNavigationController) === null || _this$_keyboardNaviga === void 0 ? void 0 : _this$_keyboardNaviga._isFastEditingStarted();
    if (editorInstance && isEditingNavigationMode) {
      this._handleEditingNavigationMode(editorInstance);
    }
    // @ts-expect-error
    super._editCellPrepared.apply(this, arguments);
  }
  _handleEditingNavigationMode(editorInstance) {
    ['downArrow', 'upArrow'].forEach(keyName => {
      const originalKeyHandler = editorInstance._supportedKeys()[keyName];
      editorInstance.registerKeyHandler(keyName, e => {
        const isDropDownOpened = editorInstance._input().attr('aria-expanded') === 'true';
        if (isDropDownOpened) {
          return originalKeyHandler && originalKeyHandler.call(editorInstance, e);
        }
      });
    });
    editorInstance.registerKeyHandler('leftArrow', _common.noop);
    editorInstance.registerKeyHandler('rightArrow', _common.noop);
    const isDateBoxWithMask = editorInstance.NAME === _const2.DATEBOX_WIDGET_NAME && editorInstance.option('useMaskBehavior');
    if (isDateBoxWithMask) {
      editorInstance.registerKeyHandler('enter', _common.noop);
    }
  }
  _getEditorInstance($cell) {
    const $editor = $cell.find('.dx-texteditor').eq(0);
    return _m_utils.default.getWidgetInstance($editor);
  }
};
const editing = Base => class EditingControllerKeyboardExtender extends Base {
  /**
   * interface override
   */
  editCell(rowIndex, columnIndex) {
    if (this._keyboardNavigationController._processCanceledEditCellPosition(rowIndex, columnIndex)) {
      return false;
    }
    const isCellEditing = super.editCell(rowIndex, columnIndex);
    if (isCellEditing) {
      this._keyboardNavigationController.setupFocusedView();
    }
    return isCellEditing;
  }
  editRow(rowIndex) {
    const visibleColumnIndex = this._keyboardNavigationController.getVisibleColumnIndex();
    const column = this._columnsController.getVisibleColumns()[visibleColumnIndex];
    if (column && column.type || this.option('editing.mode') === _const.EDIT_MODE_FORM) {
      this._keyboardNavigationController._resetFocusedCell();
    }
    super.editRow(rowIndex);
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addRow(parentKey) {
    this._keyboardNavigationController.setupFocusedView();
    this._keyboardNavigationController.setCellFocusType();
    return super.addRow.apply(this, arguments);
  }
  getFocusedCellInRow(rowIndex) {
    let $cell = super.getFocusedCellInRow(rowIndex);
    const rowIndexOffset = this._dataController.getRowIndexOffset();
    const focusedRowIndex = this._keyboardNavigationController._focusedCellPosition.rowIndex - rowIndexOffset;
    if (this._keyboardNavigationController.isKeyboardEnabled() && focusedRowIndex === rowIndex) {
      const $focusedCell = this._keyboardNavigationController._getFocusedCell();
      if ((0, _m_keyboard_navigation_utils.isElementDefined)($focusedCell) && !$focusedCell.hasClass(_const2.COMMAND_EDIT_CLASS)) {
        $cell = $focusedCell;
      }
    }
    return $cell;
  }
  _processCanceledEditingCell() {
    this.closeEditCell().done(() => {
      this._keyboardNavigationController._updateFocus();
    });
  }
  /**
   * interface override
   */
  closeEditCell() {
    const keyboardNavigation = this._keyboardNavigationController;
    keyboardNavigation._fastEditingStarted = false;
    const result = super.closeEditCell.apply(this, arguments);
    keyboardNavigation._updateFocus();
    return result;
  }
  _delayedInputFocus() {
    this._keyboardNavigationController._isNeedScroll = true;
    super._delayedInputFocus.apply(this, arguments);
  }
  _isEditingStart() {
    const cancel = super._isEditingStart.apply(this, arguments);
    if (cancel && !this._keyboardNavigationController._isNeedFocus) {
      const $cell = this._keyboardNavigationController._getFocusedCell();
      this._keyboardNavigationController._focus($cell, true);
    }
    return cancel;
  }
};
const data = Base => class DataControllerKeyboardExtender extends Base {
  _correctRowIndices(getRowIndexCorrection) {
    const that = this;
    const focusedCellPosition = this._keyboardNavigationController._focusedCellPosition;
    super._correctRowIndices.apply(that, arguments);
    if (focusedCellPosition && focusedCellPosition.rowIndex >= 0) {
      const focusedRowIndexCorrection = getRowIndexCorrection(focusedCellPosition.rowIndex);
      if (focusedRowIndexCorrection) {
        focusedCellPosition.rowIndex += focusedRowIndexCorrection;
        this._editorFactoryController.refocus();
      }
    }
  }
  getMaxRowIndex() {
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
const adaptiveColumns = Base => class AdaptiveColumnsKeyboardExtender extends Base {
  _showHiddenCellsInView(_ref) {
    let {
      viewName,
      $cells,
      isCommandColumn
    } = _ref;
    super._showHiddenCellsInView.apply(this, arguments);
    viewName === _const2.COLUMN_HEADERS_VIEW && !isCommandColumn && $cells.each((_, cellElement) => {
      const $cell = (0, _renderer.default)(cellElement);
      (0, _m_keyboard_navigation_utils.isCellInHeaderRow)($cell) && $cell.attr('tabindex', 0);
    });
  }
  _hideVisibleCellInView(_ref2) {
    let {
      viewName,
      $cell,
      isCommandColumn
    } = _ref2;
    super._hideVisibleCellInView.apply(this, arguments);
    if (viewName === _const2.COLUMN_HEADERS_VIEW && !isCommandColumn && (0, _m_keyboard_navigation_utils.isCellInHeaderRow)($cell)) {
      $cell.removeAttr('tabindex');
    }
  }
  _hideVisibleColumnInView(_ref3) {
    let {
      view,
      isCommandColumn,
      visibleIndex
    } = _ref3;
    super._hideVisibleColumnInView({
      view,
      isCommandColumn,
      visibleIndex
    });
    if (view.name === _const2.ROWS_VIEW) {
      this._rowsView.renderFocusState(null);
    }
  }
};
const keyboardNavigationModule = exports.keyboardNavigationModule = {
  defaultOptions() {
    return {
      useLegacyKeyboardNavigation: false,
      keyboardNavigation: {
        enabled: true,
        enterKeyAction: 'startEdit',
        enterKeyDirection: 'none',
        editOnKeyPress: false
      }
    };
  },
  controllers: {
    keyboardNavigation: KeyboardNavigationController
  },
  extenders: {
    views: {
      rowsView
    },
    controllers: {
      editing,
      data,
      adaptiveColumns,
      keyboardNavigation: _scrollable_a11y.keyboardNavigationScrollableA11yExtender
    }
  }
};