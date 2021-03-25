import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import core from './ui.grid_core.modules';
import { focusAndSelectElement, getWidgetInstance } from './ui.grid_core.utils';
import { isDefined, isEmptyObject } from '../../core/utils/type';
import { inArray } from '../../core/utils/array';
import { focused } from '../widget/selectors';
import * as eventUtils from '../../events/utils';
import pointerEvents from '../../events/pointer';
import clickEvent from '../../events/click';
import { noop } from '../../core/utils/common';
import * as accessibility from '../shared/accessibility';
import { isElementInCurrentGrid } from './ui.grid_core.utils';
import browser from '../../core/utils/browser';
import { keyboard } from '../../events/short';
import devices from '../../core/devices';

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
const EDIT_ROW_CLASS = 'dx-edit-row';
const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
const COMMAND_EXPAND_CLASS = 'dx-command-expand';
const COMMAND_SELECT_CLASS = 'dx-command-select';
const COMMAND_CELL_SELECTOR = '[class^=dx-command]';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const DATEBOX_WIDGET_NAME = 'dxDateBox';
const FOCUS_STATE_CLASS = 'dx-state-focused';
const WIDGET_CLASS = 'dx-widget';
const REVERT_BUTTON_CLASS = 'dx-revert-button';

const FAST_EDITING_DELETE_KEY = 'delete';

const INTERACTIVE_ELEMENTS_SELECTOR = 'input:not([type=\'hidden\']), textarea, a, select, button, [tabindex]';

const EDIT_MODE_ROW = 'row';
const EDIT_MODE_FORM = 'form';
const EDIT_MODE_BATCH = 'batch';
const EDIT_MODE_CELL = 'cell';

const FOCUS_TYPE_ROW = 'row';
const FOCUS_TYPE_CELL = 'cell';

const COLUMN_HEADERS_VIEW = 'columnHeadersView';


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

function isCellElement($element) {
    return $element.length && $element[0].tagName === 'TD';
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

const KeyboardNavigationController = core.ViewController.inherit({
    // #region Initialization
    init: function() {
        const that = this;

        if(that.isKeyboardEnabled()) {
            accessibility.subscribeVisibilityChange();
            that._dataController = that.getController('data');
            that._selectionController = that.getController('selection');
            that._editingController = that.getController('editing');
            that._headerPanel = that.getView('headerPanel');
            that._columnsController = that.getController('columns');

            that._fastEditingStarted = false;
            that._focusedCellPosition = {};
            that._canceledCellPosition = null;

            that.getController('editorFactory').focused.add(function($element) {
                that.setupFocusedView();

                if(that._isNeedScroll) {
                    if($element.is(':visible') && that._focusedView && that._focusedView.getScrollable) {
                        that._focusedView._scrollToElement($element);
                        that._isNeedScroll = false;
                    }
                }
            });

            that._initViewHandlers();
            that._initDocumentHandlers();

            that.createAction('onKeyDown');
        }
    },

    _initViewHandlers: function() {
        const pointerEventAction = this.createAction(this._pointerEventHandler);
        const rowsView = this.getView('rowsView');

        rowsView.renderCompleted.add((e) => {
            const $rowsView = rowsView.element();
            const isFullUpdate = !e || e.changeType === 'refresh';
            const isFocusedViewCorrect = this._focusedView && this._focusedView.name === rowsView.name;
            let needUpdateFocus = false;
            const isAppend = e && (e.changeType === 'append' || e.changeType === 'prepend');
            const clickSelector = `.${ROW_CLASS} > td, .${ROW_CLASS}`;
            const $focusedElement = $(':focus');
            const isFocusedElementCorrect = !$focusedElement.length || $focusedElement.closest($rowsView).length || (browser.msie && $focusedElement.is('body'));
            const pointerEventName = !isMobile() ? pointerEvents.down : clickEvent.name;

            eventsEngine.off($rowsView, eventUtils.addNamespace(pointerEventName, 'dxDataGridKeyboardNavigation'), pointerEventAction);
            eventsEngine.on($rowsView, eventUtils.addNamespace(pointerEventName, 'dxDataGridKeyboardNavigation'), clickSelector, pointerEventAction);

            this._initKeyDownHandler($rowsView, e => this._keyDownHandler(e));

            this._setRowsViewAttributes($rowsView);

            if(isFocusedViewCorrect && isFocusedElementCorrect) {
                needUpdateFocus = this._isNeedFocus ? !isAppend : this._isHiddenFocus && isFullUpdate;
                needUpdateFocus && this._updateFocus(true);
            }
        });
    },

    _resetFocusedView: function() {
        this._focusedView = null;
        this._resetFocusedCell();
    },

    _initDocumentHandlers: function() {
        const that = this;
        const document = domAdapter.getDocument();

        that._documentClickHandler = that.createAction(function(e) {
            const $target = $(e.event.target);
            const isCurrentRowsViewClick = that._isEventInCurrentGrid(e.event) && $target.closest(`.${that.addWidgetPrefix(ROWS_VIEW_CLASS)}`).length;
            const isEditorOverlay = $target.closest(`.${DROPDOWN_EDITOR_OVERLAY_CLASS}`).length;
            if(!isCurrentRowsViewClick && !isEditorOverlay) {
                that._resetFocusedView();
            }
        });

        eventsEngine.on(document, eventUtils.addNamespace(pointerEvents.down, 'dxDataGridKeyboardNavigation'), that._documentClickHandler);
    },

    _setRowsViewAttributes: function($rowsView) {
        const isGridEmpty = !this._dataController.getVisibleRows().length;
        if(isGridEmpty) {
            this._applyTabIndexToElement($rowsView);
        }
    },

    _initKeyDownHandler: function(element, handler) {
        keyboard.off(this._keyDownListener);
        this._keyDownListener = keyboard.on(element, null, handler);
    },

    dispose: function() {
        this.callBase();
        this._focusedView = null;
        keyboard.off(this._keyDownListener);
        eventsEngine.off(domAdapter.getDocument(), eventUtils.addNamespace(pointerEvents.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
        accessibility.unsubscribeVisibilityChange();
    },
    // #endregion Initialization

    // #region Options
    optionChanged: function(args) {
        const that = this;

        switch(args.name) {
            case 'keyboardNavigation':
            case 'useLegacyKeyboardNavigation':
                args.handled = true;
                break;
            default:
                that.callBase(args);
        }
    },

    isRowFocusType: function() {
        return this.focusType === FOCUS_TYPE_ROW;
    },

    isCellFocusType: function() {
        return this.focusType === FOCUS_TYPE_CELL;
    },

    setRowFocusType: function() {
        if(this.option('focusedRowEnabled')) {
            this.focusType = FOCUS_TYPE_ROW;
        }
    },

    setCellFocusType: function() {
        this.focusType = FOCUS_TYPE_CELL;
    },
    // #endregion Options

    // #region Key_Handlers
    _keyDownHandler: function(e) {
        const isEditing = this._editingController.isEditing();
        let needStopPropagation = true;
        const originalEvent = e.originalEvent;
        const isHandled = this._processOnKeyDown(e);

        if(originalEvent.isDefaultPrevented()) {
            return;
        }

        this._isNeedFocus = true;
        this._isNeedScroll = true;

        this._updateFocusedCellPositionByTarget(originalEvent.target);

        if(!isHandled) {
            switch(e.keyName) {
                case 'leftArrow':
                case 'rightArrow':
                    this._leftRightKeysHandler(e, isEditing);
                    break;

                case 'upArrow':
                case 'downArrow':
                    if(e.ctrl) {
                        accessibility.selectView('rowsView', this, originalEvent);
                    } else {
                        this._upDownKeysHandler(e, isEditing);
                    }
                    break;

                case 'pageUp':
                case 'pageDown':
                    this._pageUpDownKeyHandler(e);
                    break;

                case 'space':
                    this._spaceKeyHandler(e, isEditing);
                    break;

                case 'A':
                    if(e.ctrl) {
                        this._ctrlAKeyHandler(e, isEditing);
                    } else {
                        this._beginFastEditing(e.originalEvent);
                    }
                    break;

                case 'tab':
                    this._tabKeyHandler(e, isEditing);
                    break;

                case 'enter':
                    this._enterKeyHandler(e, isEditing);
                    break;

                case 'escape':
                    this._escapeKeyHandler(e, isEditing);
                    break;

                case 'F':
                    if(e.ctrl) {
                        this._ctrlFKeyHandler(e);
                    } else {
                        this._beginFastEditing(e.originalEvent);
                    }
                    break;

                case 'F2':
                    this._f2KeyHandler();
                    break;

                case 'del':
                case 'backspace':
                    if(this._isFastEditingAllowed() && !this._isFastEditingStarted()) {
                        this._beginFastEditing(originalEvent, true);
                    }
                    break;

                default:
                    if(!this._beginFastEditing(originalEvent)) {
                        this._isNeedFocus = false;
                        this._isNeedScroll = false;
                        needStopPropagation = false;
                    }
                    break;
            }

            if(needStopPropagation) {
                originalEvent.stopPropagation();
            }
        }
    },
    _processOnKeyDown: function(eventArgs) {
        const originalEvent = eventArgs.originalEvent;
        const args = {
            handled: false,
            event: originalEvent
        };

        this.executeAction('onKeyDown', args);

        eventArgs.ctrl = originalEvent.ctrlKey;
        eventArgs.alt = originalEvent.altKey;
        eventArgs.shift = originalEvent.shiftKey;

        return !!args.handled;
    },

    _closeEditCell: function() {
        setTimeout(() => {
            this._editingController.closeEditCell();
        });
    },

    _leftRightKeysHandler: function(eventArgs, isEditing) {
        const rowIndex = this.getVisibleRowIndex();
        const $event = eventArgs.originalEvent;
        const $row = this._focusedView && this._focusedView.getRow(rowIndex);
        const directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
        const isEditingNavigationMode = this._isFastEditingStarted();
        const allowNavigate = (!isEditing || isEditingNavigationMode) && isDataRow($row);

        if(allowNavigate) {
            this.setCellFocusType();

            isEditingNavigationMode && this._closeEditCell();
            const $cell = this._getNextCell(directionCode);
            if(isElementDefined($cell)) {
                this._arrowKeysHandlerFocusCell($event, $cell);
            }

            $event && $event.preventDefault();
        }
    },

    _upDownKeysHandler: function(eventArgs, isEditing) {
        let rowIndex = this.getVisibleRowIndex();
        const $row = this._focusedView && this._focusedView.getRow(rowIndex);
        const $event = eventArgs.originalEvent;
        const isUpArrow = eventArgs.keyName === 'upArrow';
        const dataSource = this._dataController.dataSource();
        const isEditingNavigationMode = this._isFastEditingStarted();
        const allowNavigate = (!isEditing || isEditingNavigationMode) && $row && !isDetailRow($row);

        if(allowNavigate) {
            isEditingNavigationMode && this._closeEditCell();
            if(!this._navigateNextCell($event, eventArgs.keyName)) {
                if(this._isVirtualScrolling() && isUpArrow && dataSource && !dataSource.isLoading()) {
                    const rowHeight = $row.outerHeight();
                    rowIndex = this._focusedCellPosition.rowIndex - 1;
                    this._scrollBy(-rowHeight, rowIndex, $event);
                }
            }

            $event && $event.preventDefault();
        }
    },

    _pageUpDownKeyHandler: function(eventArgs) {
        const pageIndex = this._dataController.pageIndex();
        const pageCount = this._dataController.pageCount();
        const pagingEnabled = this.option('paging.enabled');
        const isPageUp = eventArgs.keyName === 'pageUp';
        const pageStep = (isPageUp ? -1 : 1);
        const scrollable = this.getView('rowsView').getScrollable();

        if(pagingEnabled && !this._isVirtualScrolling()) {
            if((isPageUp ? pageIndex > 0 : pageIndex < pageCount - 1) && !this._isVirtualScrolling()) {
                this._dataController.pageIndex(pageIndex + pageStep);
                eventArgs.originalEvent.preventDefault();
            }
        } else if(scrollable && scrollable._container().height() < scrollable.$content().height()) {
            this._scrollBy(scrollable._container().height() * pageStep);
            eventArgs.originalEvent.preventDefault();
        }
    },

    _spaceKeyHandler: function(eventArgs, isEditing) {
        const rowIndex = this.getVisibleRowIndex();
        const $target = $(eventArgs.originalEvent && eventArgs.originalEvent.target);
        if(this.option('selection') && this.option('selection').mode !== 'none' && !isEditing) {
            const isFocusedRowElement = this._getElementType($target) === 'row' && this.isRowFocusType() && isDataRow($target);
            const isFocusedSelectionCell = $target.hasClass(COMMAND_SELECT_CLASS);
            if(isFocusedSelectionCell && this.option('selection.showCheckBoxesMode') === 'onClick') {
                this._selectionController.startSelectionWithCheckboxes();
            }
            if(isFocusedRowElement || $target.parent().hasClass(DATA_ROW_CLASS) || $target.hasClass(this.addWidgetPrefix(ROWS_VIEW_CLASS))) {
                this._selectionController.changeItemSelection(rowIndex, {
                    shift: eventArgs.shift,
                    control: eventArgs.ctrl
                });
                eventArgs.originalEvent.preventDefault();
            }
        } else {
            this._beginFastEditing(eventArgs.originalEvent);
        }
    },

    _ctrlAKeyHandler: function(eventArgs, isEditing) {
        if(!isEditing && eventArgs.ctrl && !eventArgs.alt && this.option('selection.mode') === 'multiple' && this.option('selection.allowSelectAll')) {
            this._selectionController.selectAll();
            eventArgs.originalEvent.preventDefault();
        }
    },

    _tabKeyHandler: function(eventArgs, isEditing) {
        const editingOptions = this.option('editing');
        const direction = eventArgs.shift ? 'previous' : 'next';
        const isCellPositionDefined = isDefined(this._focusedCellPosition) && !isEmptyObject(this._focusedCellPosition);
        let isOriginalHandlerRequired = !isCellPositionDefined || (!eventArgs.shift && this._isLastValidCell(this._focusedCellPosition)) || (eventArgs.shift && this._isFirstValidCell(this._focusedCellPosition));
        const eventTarget = eventArgs.originalEvent.target;
        const focusedViewElement = this._focusedView && this._focusedView.element();

        if(this._handleTabKeyOnMasterDetailCell(eventTarget, direction)) {
            return;
        }

        $(focusedViewElement).addClass(FOCUS_STATE_CLASS);

        if(editingOptions && eventTarget && !isOriginalHandlerRequired) {
            if($(eventTarget).hasClass(this.addWidgetPrefix(ROWS_VIEW_CLASS))) {
                this._resetFocusedCell();
            }
            if(isEditing) {
                if(!this._editingCellTabHandler(eventArgs, direction)) {
                    return;
                }
            } else {
                if(this._targetCellTabHandler(eventArgs, direction)) {
                    isOriginalHandlerRequired = true;
                }
            }
        }

        if(isOriginalHandlerRequired) {
            this.getController('editorFactory').loseFocus();
            if(this._editingController.isEditing() && !this._isRowEditMode()) {
                this._resetFocusedCell();
                this._closeEditCell();
            }
        } else {
            eventArgs.originalEvent.preventDefault();
        }
    },
    _editingCellTabHandler: function(eventArgs, direction) {
        const eventTarget = eventArgs.originalEvent.target;
        let $cell = this._getCellElementFromTarget(eventTarget);
        let isEditingAllowed;
        const $event = eventArgs.originalEvent;
        const elementType = this._getElementType(eventTarget);

        if($cell.is(COMMAND_CELL_SELECTOR)) {
            return !this._targetCellTabHandler(eventArgs, direction);
        }

        this._updateFocusedCellPosition($cell);
        const nextCellInfo = this._getNextCellByTabKey($event, direction, elementType);
        $cell = nextCellInfo.$cell;

        if(!$cell || this._handleTabKeyOnMasterDetailCell($cell, direction)) {
            return false;
        }

        const column = this._columnsController.getVisibleColumns()[this.getView('rowsView').getCellIndex($cell)];
        const row = this._dataController.items()[this._getRowIndex($cell && $cell.parent())];

        if(column.allowEditing) {
            const isDataRow = !row || row.rowType === 'data';
            isEditingAllowed = this._editingController.allowUpdating({ row: row }) ? isDataRow : row && row.isNewRow;
        }

        if(!isEditingAllowed) {
            this._closeEditCell();
        }

        if(this._focusCell($cell, !nextCellInfo.isHighlighted)) {
            if(!this._isRowEditMode() && isEditingAllowed) {
                this._editingController.editCell(this.getVisibleRowIndex(), this._focusedCellPosition.columnIndex);
            } else {
                this._focusInteractiveElement($cell, eventArgs.shift);
            }
        }

        return true;
    },
    _targetCellTabHandler: function(eventArgs, direction) {
        const $event = eventArgs.originalEvent;
        let eventTarget = $event.target;
        let $cell = this._getCellElementFromTarget(eventTarget);
        const $lastInteractiveElement = this._getInteractiveElement($cell, !eventArgs.shift);
        let isOriginalHandlerRequired = false;
        let elementType;

        if(!isEditorCell(this, $cell) && $lastInteractiveElement.length && eventTarget !== $lastInteractiveElement.get(0)) {
            isOriginalHandlerRequired = true;
        } else {
            if(this._focusedCellPosition.rowIndex === undefined && $(eventTarget).hasClass(ROW_CLASS)) {
                this._updateFocusedCellPosition($cell);
            }

            elementType = this._getElementType(eventTarget);
            if(this.isRowFocusType()) {
                this.setCellFocusType();
                if(elementType === 'row' && isDataRow($(eventTarget))) {
                    eventTarget = this.getFirstValidCellInRow($(eventTarget));
                    elementType = this._getElementType(eventTarget);
                }
            }

            const nextCellInfo = this._getNextCellByTabKey($event, direction, elementType);
            $cell = nextCellInfo.$cell;

            if(!$cell) {
                return false;
            }

            $cell = this._checkNewLineTransition($event, $cell);
            if(!$cell) {
                return false;
            }

            this._focusCell($cell, !nextCellInfo.isHighlighted);

            if(!isEditorCell(this, $cell)) {
                this._focusInteractiveElement($cell, eventArgs.shift);
            }
        }

        return isOriginalHandlerRequired;
    },
    _getNextCellByTabKey: function($event, direction, elementType) {
        let $cell = this._getNextCell(direction, elementType);
        const args = $cell && this._fireFocusedCellChanging($event, $cell, true);

        if(!args || args.cancel) {
            return {};
        }

        if(args.$newCellElement) {
            $cell = args.$newCellElement;
        }

        return {
            $cell,
            isHighlighted: args.isHighlighted
        };
    },
    _checkNewLineTransition: function($event, $cell) {
        const rowIndex = this.getVisibleRowIndex();
        const $row = $cell.parent();

        if(rowIndex !== this._getRowIndex($row)) {
            const cellPosition = this._getCellPosition($cell);
            const args = this._fireFocusedRowChanging($event, $row);
            if(args.cancel) {
                return;
            }
            if(args.rowIndexChanged) {
                this.setFocusedColumnIndex(cellPosition.columnIndex);
                $cell = this._getFocusedCell();
            }
        }

        return $cell;
    },

    _enterKeyHandler: function(eventArgs, isEditing) {
        const $cell = this._getFocusedCell();
        const rowIndex = this.getVisibleRowIndex();
        const $row = this._focusedView && this._focusedView.getRow(rowIndex);

        if((this.option('grouping.allowCollapsing') && isGroupRow($row)) ||
            (this.option('masterDetail.enabled') && $cell && $cell.hasClass(COMMAND_EXPAND_CLASS))) {

            const key = this._dataController.getKeyByRowIndex(rowIndex);
            const item = this._dataController.items()[rowIndex];

            if(key !== undefined && item && item.data && !item.data.isContinuation) {
                this._dataController.changeRowExpand(key);
            }
        } else {
            this._processEnterKeyForDataCell(eventArgs, isEditing);
        }
    },

    _processEnterKeyForDataCell: function(eventArgs, isEditing) {
        const direction = this._getEnterKeyDirection(eventArgs);
        const allowEditingOnEnterKey = this._allowEditingOnEnterKey();

        if(isEditing || !allowEditingOnEnterKey && direction) {
            this._handleEnterKeyEditingCell(eventArgs.originalEvent);
            if(direction === 'next' || direction === 'previous') {
                this._targetCellTabHandler(eventArgs, direction);
            } else if(direction === 'upArrow' || direction === 'downArrow') {
                this._navigateNextCell(eventArgs.originalEvent, direction);
            }
        } else if(allowEditingOnEnterKey) {
            this._startEditing(eventArgs);
        }
    },

    _getEnterKeyDirection: function(eventArgs) {
        const enterKeyDirection = this.option('keyboardNavigation.enterKeyDirection');
        const isShift = eventArgs.shift;

        if(enterKeyDirection === 'column') {
            return isShift ? 'upArrow' : 'downArrow';
        }
        if(enterKeyDirection === 'row') {
            return isShift ? 'previous' : 'next';
        }
    },

    _handleEnterKeyEditingCell: function(event) {
        const target = event.target;
        const $cell = this._getCellElementFromTarget(target);
        const isRowEditMode = this._isRowEditMode();

        this._updateFocusedCellPosition($cell);

        if(isRowEditMode) {
            this._focusEditFormCell($cell);
            setTimeout(this._editingController.saveEditData.bind(this._editingController));
        } else {
            eventsEngine.trigger($(target), 'change');
            this._closeEditCell();

            event.preventDefault();
        }
    },

    _escapeKeyHandler: function(eventArgs, isEditing) {
        const $cell = this._getCellElementFromTarget(eventArgs.originalEvent.target);
        if(isEditing) {
            this._updateFocusedCellPosition($cell);
            if(!this._isRowEditMode()) {
                if(this._editingController.getEditMode() === 'cell') {
                    this._editingController.cancelEditData();
                } else {
                    this._closeEditCell();
                }
            } else {
                this._focusEditFormCell($cell);
                this._editingController.cancelEditData();
                if(this._dataController.items().length === 0) {
                    this._resetFocusedCell();
                    this.getController('editorFactory').loseFocus();
                }
            }
            eventArgs.originalEvent.preventDefault();
        }
    },

    _ctrlFKeyHandler: function(eventArgs) {
        if(this.option('searchPanel.visible')) {
            const searchTextEditor = this._headerPanel.getSearchTextEditor();
            if(searchTextEditor) {
                searchTextEditor.focus();
                eventArgs.originalEvent.preventDefault();
            }
        }
    },

    _f2KeyHandler: function() {
        const isEditing = this._editingController.isEditing();
        const rowIndex = this.getVisibleRowIndex();
        const $row = this._focusedView && this._focusedView.getRow(rowIndex);

        if(!isEditing && isDataRow($row)) {
            this._startEditing();
        }
    },

    _navigateNextCell: function($event, keyCode) {
        const $cell = this._getNextCell(keyCode);

        if($cell && this._isCellValid($cell)) {
            return this._arrowKeysHandlerFocusCell($event, $cell, true);
        }

        return false;
    },

    _arrowKeysHandlerFocusCell: function($event, $cell, upDown) {
        const args = this._fireFocusChangingEvents($event, $cell, upDown, true);
        $cell = args.$newCellElement;
        if(!args.cancel && this._isCellValid($cell)) {
            this._focus($cell, !args.isHighlighted);
            return true;
        }
        return false;
    },

    _beginFastEditing: function(originalEvent, isDeleting) {
        if(!this._isFastEditingAllowed() || originalEvent.altKey || originalEvent.ctrlKey || this._editingController.isEditing()) {
            return false;
        }

        if(isDeleting) {
            this._startEditing(originalEvent, FAST_EDITING_DELETE_KEY);
        } else {
            const key = originalEvent.key;
            const keyCode = originalEvent.keyCode || originalEvent.which;
            const fastEditingKey = key || keyCode && String.fromCharCode(keyCode);

            if(fastEditingKey && (fastEditingKey.length === 1 || fastEditingKey === FAST_EDITING_DELETE_KEY)) {
                this._startEditing(originalEvent, fastEditingKey);
            }
        }

        return true;
    },
    // #endregion Key_Handlers

    // #region Pointer_Event_Handler
    _pointerEventHandler: function(e) {
        const event = e.event || e;
        let $target = $(event.currentTarget);
        const rowsView = this.getView('rowsView');
        const focusedViewElement = rowsView && rowsView.element();
        const $parent = $target.parent();
        const isEditingRow = $parent.hasClass(EDIT_ROW_CLASS);
        const isInteractiveElement = $(event.target).is(INTERACTIVE_ELEMENTS_SELECTOR);
        const isRevertButton = !!$(event.target).closest(`.${REVERT_BUTTON_CLASS}`).length;
        const isExpandCommandCell = $target.hasClass(COMMAND_EXPAND_CLASS);

        if(!isRevertButton && this._isEventInCurrentGrid(event) && (this._isCellValid($target, !isInteractiveElement) || isExpandCommandCell)) {
            $target = this._isInsideEditForm($target) ? $(event.target) : $target;

            this._focusView();
            $(focusedViewElement).removeClass(FOCUS_STATE_CLASS);

            if($parent.hasClass(FREESPACE_ROW_CLASS)) {
                this._updateFocusedCellPosition($target);
                this._applyTabIndexToElement(this._focusedView.element());
                this._focusedView.focus();
            } else if(!this._isMasterDetailCell($target) && !isEditingRow) {
                this._clickTargetCellHandler(event, $target);
            } else {
                this._updateFocusedCellPosition($target);
            }
        } else if($target.is('td')) {
            this._resetFocusedCell();
        }
    },

    _clickTargetCellHandler: function(event, $cell) {
        const columnIndex = this.getView('rowsView').getCellIndex($cell);
        const column = this._columnsController.getVisibleColumns()[columnIndex];
        const isCellEditMode = this._isCellEditMode();

        this.setCellFocusType();

        const args = this._fireFocusChangingEvents(event, $cell, true);
        $cell = args.$newCellElement;
        if(!args.cancel) {
            if(args.resetFocusedRow) {
                this.getController('focus')._resetFocusedRow();
                return;
            }

            if(args.rowIndexChanged) {
                $cell = this._getFocusedCell();
            }

            if(!args.isHighlighted && !isCellEditMode) {
                this.setRowFocusType();
            }

            this._updateFocusedCellPosition($cell);

            if(this._allowRowUpdating() && isCellEditMode && column && column.allowEditing) {
                this._isNeedFocus = false;
                this._isHiddenFocus = false;
            } else {
                const $target = event && $(event.target).closest(INTERACTIVE_ELEMENTS_SELECTOR + ', td');
                const isInteractiveTarget = $target && $target.not($cell).is(INTERACTIVE_ELEMENTS_SELECTOR);
                const isEditor = !!column && !column.command && $cell.hasClass(EDITOR_CELL_CLASS);
                const isDisabled = !isEditor && (!args.isHighlighted || isInteractiveTarget);
                this._focus($cell, isDisabled, isInteractiveTarget);
            }
        } else {
            this.setRowFocusType();
            this.setFocusedRowIndex(args.prevRowIndex);
            $cell = this._getFocusedCell();
            if(this._editingController.isEditing() && isCellEditMode) {
                this._closeEditCell();
            }
        }
    },

    _allowRowUpdating: function() {
        const rowIndex = this.getVisibleRowIndex();
        const row = this._dataController.items()[rowIndex];

        return this._editingController.allowUpdating({ row: row }, 'click');
    },
    // #endregion Pointer_Event_Handler

    // #region Focusing
    focus: function(element) {
        let activeElementSelector;
        const focusedRowEnabled = this.option('focusedRowEnabled');
        const isHighlighted = isCellElement($(element));

        if(!element) {
            activeElementSelector = '.dx-datagrid-rowsview .dx-row[tabindex]';
            if(!focusedRowEnabled) {
                activeElementSelector += ', .dx-datagrid-rowsview .dx-row > td[tabindex]';
            }
            element = this.component.$element().find(activeElementSelector).first();
        }

        element && this._focusElement($(element), isHighlighted);
    },

    getFocusedView: function() {
        return this._focusedView;
    },

    setupFocusedView: function() {
        if(this.isKeyboardEnabled() && !isDefined(this._focusedView)) {
            this._focusView();
        }
    },

    _focusElement: function($element, isHighlighted) {
        const rowsViewElement = $(this._getRowsViewElement());
        const $focusedView = $element.closest(rowsViewElement);
        const isRowFocusType = this.isRowFocusType();
        let args = { };

        if(!$focusedView.length || isCellElement($element) && !this._isCellValid($element)) {
            return;
        }

        this._focusView();
        this._isNeedFocus = true;
        this._isNeedScroll = true;

        if(isCellElement($element) || isGroupRow($element)) {
            this.setCellFocusType();
            args = this._fireFocusChangingEvents(null, $element, false, isHighlighted);
            $element = args.$newCellElement;
            if(isRowFocusType && !args.isHighlighted) {
                this.setRowFocusType();
            }
        }

        if(!args.cancel) {
            this._focus($element, !args.isHighlighted);
            this._focusInteractiveElement($element);
        }
    },

    _getFocusedViewByElement: function($element) {
        const view = this.getFocusedView();
        const $view = view && $(view.element());
        return $element && $element.closest($view).length !== 0;
    },

    _focusView: function() {
        this._focusedView = this.getView('rowsView');
    },

    _focusInteractiveElement: function($cell, isLast) {
        if(!$cell) return;

        const $focusedElement = this._getInteractiveElement($cell, isLast);

        ///#DEBUG
        this._testInteractiveElement = $focusedElement;
        ///#ENDDEBUG

        focusAndSelectElement(this, $focusedElement);
    },

    _focus: function($cell, disableFocus, isInteractiveElement) {
        const $row = ($cell && !$cell.hasClass(ROW_CLASS)) ? $cell.closest(`.${ROW_CLASS}`) : $cell;

        if($row && isNotFocusedRow($row)) {
            return;
        }

        const focusedView = this._focusedView;
        const $focusViewElement = focusedView && focusedView.element();
        let $focusElement;

        this._isHiddenFocus = disableFocus;

        if(isGroupRow($row) || this.isRowFocusType()) {
            $focusElement = $row;
            if(focusedView) {
                this.setFocusedRowIndex(this._getRowIndex($row));
            }
        } else if(isCellElement($cell)) {
            $focusElement = $cell;
            this._updateFocusedCellPosition($cell);
        }
        if($focusElement) {
            if($focusViewElement) {
                $focusViewElement
                    .find('.dx-row[tabIndex], .dx-row > td[tabindex]')
                    .not($focusElement)
                    .removeClass(CELL_FOCUS_DISABLED_CLASS)
                    .removeAttr('tabIndex');
            }

            eventsEngine.one($focusElement, 'blur', e => {
                if(e.relatedTarget) {
                    $focusElement.removeClass(CELL_FOCUS_DISABLED_CLASS);
                }
            });
            if(!isInteractiveElement) {
                this._applyTabIndexToElement($focusElement);
                eventsEngine.trigger($focusElement, 'focus');
            }
            if(disableFocus) {
                $focusElement.addClass(CELL_FOCUS_DISABLED_CLASS);
            } else {
                this.getController('editorFactory').focus($focusElement);
            }
        }
    },

    _updateFocus: function(isRenderView) {
        const that = this;
        setTimeout(function() {
            const editingController = this._editingController;
            const isCellEditMode = editingController.getEditMode() === EDIT_MODE_CELL;

            if(!this.option('repaintChangesOnly') && isCellEditMode && editingController.hasChanges()) {
                editingController._focusEditingCell();
                return;
            }

            let $cell = that._getFocusedCell();
            const isEditing = editingController.isEditing();

            if($cell && !(that._isMasterDetailCell($cell) && !that._isRowEditMode())) {
                if(that._hasSkipRow($cell.parent())) {
                    const direction = that._focusedCellPosition && that._focusedCellPosition.rowIndex > 0 ? 'upArrow' : 'downArrow';
                    $cell = that._getNextCell(direction);
                }
                if(isElementDefined($cell)) {
                    if(isRenderView && !isEditing && that._checkCellOverlapped($cell)) {
                        return;
                    }
                    if($cell.is('td') || $cell.hasClass(that.addWidgetPrefix(EDIT_FORM_ITEM_CLASS))) {
                        const isCommandCell = $cell.is(COMMAND_CELL_SELECTOR);
                        const $focusedElementInsideCell = $cell.find(':focus');
                        const isFocusedElementDefined = isElementDefined($focusedElementInsideCell);
                        if((isRenderView || !isCommandCell) && that.getController('editorFactory').focus()) {
                            !isFocusedElementDefined && that._focus($cell);
                        } else if(!isFocusedElementDefined && (that._isNeedFocus || that._isHiddenFocus)) {
                            that._focus($cell, that._isHiddenFocus);
                        }
                        if(isEditing) {
                            that._focusInteractiveElement.bind(that)($cell);
                        }
                    } else {
                        eventsEngine.trigger($cell, 'focus');
                    }
                }
            }
        });
    },
    _checkCellOverlapped: function($cell) {
        const cellOffset = $cell.offset();
        const hasScrollable = this.component.getScrollable && this.component.getScrollable();
        let isOverlapped = false;

        if(hasScrollable) {
            if(cellOffset.left < 0) {
                isOverlapped = $cell.width() + cellOffset.left <= 0;
            } else if(cellOffset.top < 0) {
                isOverlapped = $cell.height() + cellOffset.top <= 0;
            }
        }

        return isOverlapped;
    },

    _getFocusedCell: function() {
        return $(this._getCell(this._focusedCellPosition));
    },

    _updateFocusedCellPositionByTarget: function(target) {
        const elementType = this._getElementType(target);
        if(elementType === 'row' && isDefined(this._focusedCellPosition?.columnIndex)) {
            const $row = $(target);
            this._focusedView && isGroupRow($row) && this.setFocusedRowIndex(this._getRowIndex($row));
        } else {
            this._updateFocusedCellPosition(this._getCellElementFromTarget(target));
        }
    },

    _updateFocusedCellPosition: function($cell, direction) {
        const position = this._getCellPosition($cell, direction);
        if(position) {
            if(!$cell.length || position.rowIndex >= 0 && position.columnIndex >= 0) {
                this.setFocusedCellPosition(position.rowIndex, position.columnIndex);
            }
        }
        return position;
    },
    _getCellPosition: function($cell, direction) {
        const that = this;
        let columnIndex;
        const $row = isElementDefined($cell) && $cell.closest('tr');
        const rowsView = this.getView('rowsView');

        if(isElementDefined($row)) {
            const rowIndex = that._getRowIndex($row);

            columnIndex = rowsView.getCellIndex($cell, rowIndex);

            if(direction) {
                columnIndex = direction === 'previous' ? columnIndex - 1 : columnIndex + 1;
                columnIndex = that._applyColumnIndexBoundaries(columnIndex);
            }

            return { rowIndex: rowIndex, columnIndex: columnIndex };
        }
    },

    _focusCell: function($cell, isDisabled) {
        if(this._isCellValid($cell)) {
            this._focus($cell, isDisabled);
            return true;
        }
    },

    _focusEditFormCell: function($cell) {
        if($cell.hasClass(MASTER_DETAIL_CELL_CLASS)) {
            this.getController('editorFactory').focus($cell, true);
        }
    },

    _resetFocusedCell: function() {
        const that = this;
        const $cell = that._getFocusedCell();

        $cell && $cell.removeAttr('tabIndex');

        that._focusedView && that._focusedView.renderFocusState && that._focusedView.renderFocusState();

        that._isNeedFocus = false;
        that._isNeedScroll = false;
        that._focusedCellPosition = {};
    },

    restoreFocusableElement: function(rowIndex, $event) {
        const that = this;
        let args;
        let $rowElement;
        const isUpArrow = isDefined(rowIndex);
        const rowsView = that.getView('rowsView');
        const $rowsViewElement = rowsView.element();
        const columnIndex = that._focusedCellPosition.columnIndex;
        const rowIndexOffset = that._dataController.getRowIndexOffset();

        rowIndex = isUpArrow ? rowIndex : rowsView.getTopVisibleItemIndex() + rowIndexOffset;

        if(!isUpArrow) {
            that.getController('editorFactory').loseFocus();
            that._applyTabIndexToElement($rowsViewElement);
            eventsEngine.trigger($rowsViewElement, 'focus');
        } else {
            $rowElement = rowsView.getRow(rowIndex - rowIndexOffset);
            args = that._fireFocusedRowChanging($event, $rowElement);

            if(!args.cancel && args.rowIndexChanged) {
                rowIndex = args.newRowIndex;
            }
        }

        if(!isUpArrow || !args.cancel) {
            that.setFocusedCellPosition(rowIndex, columnIndex);
        }

        isUpArrow && that._updateFocus();
    },
    // #endregion Focusing

    // #region Cell_Position
    _getNewPositionByCode: function(cellPosition, elementType, code) {
        let columnIndex = cellPosition.columnIndex;
        let rowIndex = cellPosition.rowIndex;
        let visibleColumnsCount;

        if(cellPosition.rowIndex === undefined && code === 'next') {
            return { columnIndex: 0, rowIndex: 0 };
        }

        switch(code) {
            case 'nextInRow':
            case 'next':
                visibleColumnsCount = this._getVisibleColumnCount();
                if(columnIndex < visibleColumnsCount - 1 && elementType !== 'row' && this._hasValidCellAfterPosition({ columnIndex: columnIndex, rowIndex: rowIndex })) {
                    columnIndex++;
                } else if(!this._isLastRow(rowIndex) && code === 'next') {
                    columnIndex = 0;
                    rowIndex++;
                }
                break;
            case 'previousInRow':
            case 'previous':
                if(columnIndex > 0 && elementType !== 'row' && this._hasValidCellBeforePosition({ columnIndex: columnIndex, rowIndex: rowIndex })) {
                    columnIndex--;
                } else if(rowIndex > 0 && code === 'previous') {
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

        return { columnIndex: columnIndex, rowIndex: rowIndex };
    },

    setFocusedCellPosition: function(rowIndex, columnIndex) {
        this.setFocusedRowIndex(rowIndex);
        this.setFocusedColumnIndex(columnIndex);
    },

    setFocusedRowIndex: function(rowIndex) {
        if(!this._focusedCellPosition) {
            this._focusedCellPosition = { };
        }
        this._focusedCellPosition.rowIndex = rowIndex;
    },

    setFocusedColumnIndex: function(columnIndex) {
        if(!this._focusedCellPosition) {
            this._focusedCellPosition = { };
        }
        this._focusedCellPosition.columnIndex = columnIndex;
    },

    getVisibleRowIndex: function() {
        if(this._focusedCellPosition) {
            if(!this._focusedCellPosition.rowIndex) {
                return this._focusedCellPosition.rowIndex;
            }
            return this._focusedCellPosition.rowIndex - this._dataController.getRowIndexOffset();
        }
        return null;
    },

    getVisibleColumnIndex: function() {
        if(this._focusedCellPosition) {
            return isDefined(this._focusedCellPosition.columnIndex) ? this._focusedCellPosition.columnIndex : -1;
        }
        return -1;
    },

    getFocusedColumnIndex: function() {
        return this._focusedCellPosition ? this._focusedCellPosition.columnIndex : null;
    },

    _applyColumnIndexBoundaries: function(columnIndex) {
        const visibleColumnsCount = this._getVisibleColumnCount();

        if(columnIndex < 0) {
            columnIndex = 0;
        } else if(columnIndex >= visibleColumnsCount) {
            columnIndex = visibleColumnsCount - 1;
        }

        return columnIndex;
    },

    _isCellByPositionValid: function(cellPosition) {
        const $cell = $(this._getCell(cellPosition));
        return this._isCellValid($cell);
    },

    _isLastRow: function(rowIndex) {
        if(this._isVirtualScrolling()) {
            return rowIndex >= this._dataController.totalItemsCount() - 1;
        }
        return rowIndex === this.getController('data').items().length - 1;
    },

    _isFirstValidCell: function(cellPosition) {
        let isFirstValidCell = false;

        if(cellPosition.rowIndex === 0 && cellPosition.columnIndex >= 0) {
            isFirstValidCell = isFirstValidCell || !this._hasValidCellBeforePosition(cellPosition);
        }

        return isFirstValidCell;
    },

    _hasValidCellBeforePosition: function(cellPosition) {
        let columnIndex = cellPosition.columnIndex;
        let hasValidCells = false;

        while(columnIndex > 0 && !hasValidCells) {
            const checkingPosition = { columnIndex: --columnIndex, rowIndex: cellPosition.rowIndex };

            hasValidCells = this._isCellByPositionValid(checkingPosition);
        }
        return hasValidCells;
    },

    _hasValidCellAfterPosition: function(cellPosition) {
        let columnIndex = cellPosition.columnIndex;
        let hasValidCells = false;
        const visibleColumnCount = this._getVisibleColumnCount();

        while(columnIndex < visibleColumnCount - 1 && !hasValidCells) {
            const checkingPosition = { columnIndex: ++columnIndex, rowIndex: cellPosition.rowIndex };

            hasValidCells = this._isCellByPositionValid(checkingPosition);
        }
        return hasValidCells;
    },

    _isLastValidCell: function(cellPosition) {
        const nextColumnIndex = cellPosition.columnIndex >= 0 ? cellPosition.columnIndex + 1 : 0;
        const rowIndex = cellPosition.rowIndex;
        const checkingPosition = {
            columnIndex: nextColumnIndex,
            rowIndex: rowIndex
        };
        const visibleRows = this.getController('data').getVisibleRows();
        const row = visibleRows && visibleRows[rowIndex];
        const isLastRow = this._isLastRow(rowIndex);

        if(!isLastRow) {
            return false;
        }

        if(row && row.rowType === 'group' && cellPosition.columnIndex > 0) {
            return true;
        }

        if(cellPosition.columnIndex === this._getVisibleColumnCount() - 1) {
            return true;
        }

        if(this._isCellByPositionValid(checkingPosition)) {
            return false;
        }

        return this._isLastValidCell(checkingPosition);
    },
    // #endregion Cell_Position

    // #region DOM_Manipulation
    _isCellValid: function($cell, isClick) {
        if(isElementDefined($cell) && this._columnsController) {
            const rowsView = this.getView('rowsView');
            const $row = $cell.parent();
            const visibleColumns = this._columnsController.getVisibleColumns();
            const columnIndex = rowsView.getCellIndex($cell);
            const column = visibleColumns[columnIndex];
            const visibleColumnCount = this._getVisibleColumnCount();
            const editingController = this._editingController;
            const isMasterDetailRow = isDetailRow($row);
            const isShowWhenGrouped = column && column.showWhenGrouped;
            const isDataCell = column && !$cell.hasClass(COMMAND_EXPAND_CLASS) && isDataRow($row);
            const isValidGroupSpaceColumn = function() {
                return !isMasterDetailRow && column && (!isDefined(column.groupIndex) || isShowWhenGrouped && isDataCell) || parseInt($cell.attr('colspan')) > 1;
            };

            if(this._isMasterDetailCell($cell)) {
                return true;
            }

            if(visibleColumnCount > columnIndex && isValidGroupSpaceColumn()) {
                const rowItems = this._dataController.items();
                const visibleRowIndex = rowsView.getRowIndex($row);
                const row = rowItems[visibleRowIndex];
                const isCellEditing = editingController && this._isCellEditMode() && editingController.isEditing();
                const isRowEditingInCurrentRow = editingController && editingController.isEditRow(visibleRowIndex);
                const isEditing = isRowEditingInCurrentRow || isCellEditing;

                if(column.command) {
                    if(this._isLegacyNavigation()) {
                        return !isEditing && column.command === 'expand';
                    }
                    if(isCellEditing) {
                        return !column.command;
                    }
                    if(isRowEditingInCurrentRow) {
                        return column.command !== 'select';
                    }
                    return !isEditing;
                }

                if(isCellEditing && row && row.rowType !== 'data') {
                    return false;
                }

                return !isEditing || column.allowEditing || isClick;
            }
        }
    },

    getFirstValidCellInRow: function($row, columnIndex) {
        const that = this;
        const $cells = $row.find('> td');
        let $cell;
        let $result;

        columnIndex = columnIndex || 0;

        for(let i = columnIndex; i < $cells.length; ++i) {
            $cell = $cells.eq(i);
            if(that._isCellValid($cell)) {
                $result = $cell;
                break;
            }
        }

        return $result;
    },

    _getNextCell: function(keyCode, elementType, cellPosition) {
        const focusedCellPosition = cellPosition || this._focusedCellPosition;
        const isRowFocusType = this.isRowFocusType();
        const includeCommandCells = isRowFocusType || inArray(keyCode, ['next', 'previous']) > -1;
        let $cell;
        let $row;

        if(this._focusedView && focusedCellPosition) {
            const newFocusedCellPosition = this._getNewPositionByCode(focusedCellPosition, elementType, keyCode);
            $cell = $(this._getCell(newFocusedCellPosition));
            const isLastCellOnDirection = keyCode === 'previous' ? this._isFirstValidCell(newFocusedCellPosition) : this._isLastValidCell(newFocusedCellPosition);

            if(isElementDefined($cell) && !this._isCellValid($cell) && this._isCellInRow(newFocusedCellPosition, includeCommandCells) && !isLastCellOnDirection) {
                if(isRowFocusType) {
                    $cell = this.getFirstValidCellInRow($cell.parent(), newFocusedCellPosition.columnIndex);
                } else {
                    $cell = this._getNextCell(keyCode, 'cell', newFocusedCellPosition);
                }
            }

            $row = isElementDefined($cell) && $cell.parent();
            if(this._hasSkipRow($row)) {
                const rowIndex = this._getRowIndex($row);
                if(!this._isLastRow(rowIndex)) {
                    $cell = this._getNextCell(keyCode, 'row', { columnIndex: focusedCellPosition.columnIndex, rowIndex: rowIndex });
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
    _startEditing: function(eventArgs, fastEditingKey) {
        const focusedCellPosition = this._focusedCellPosition;
        const rowIndex = this.getVisibleRowIndex();
        const row = this._dataController.items()[rowIndex];
        const column = this._columnsController.getVisibleColumns()[focusedCellPosition.columnIndex];

        if(this._isAllowEditing(row, column)) {
            if(this._isRowEditMode()) {
                this._editingController.editRow(rowIndex);
            } else if(focusedCellPosition) {
                this._startEditingCell(eventArgs, fastEditingKey);
            }
        }
    },

    _isAllowEditing: function(row, column) {
        return this.getController('editing').allowUpdating({ row: row }) && column && column.allowEditing;
    },

    _startEditingCell: function(eventArgs, fastEditingKey) {
        const that = this;
        const rowIndex = this.getVisibleRowIndex();
        const colIndex = this._focusedCellPosition.columnIndex;

        this._fastEditingStarted = isDefined(fastEditingKey);
        const deferred = this._editingController.editCell(rowIndex, colIndex);

        if(this._isFastEditingStarted()) {
            if(deferred === true) {
                that._editingCellHandler(eventArgs, fastEditingKey);
            } else if(deferred && deferred.done) {
                const editorValue = fastEditingKey !== FAST_EDITING_DELETE_KEY ? fastEditingKey : '';
                deferred.done(() => that._editingCellHandler(eventArgs, editorValue));
            }
        }
    },
    _editingCellHandler: function(eventArgs, editorValue) {
        const $input = this._getFocusedCell().find('.dx-texteditor-input').eq(0);
        const keyDownEvent = eventUtils.createEvent(eventArgs, { type: 'keydown', target: $input.get(0) });
        const keyPressEvent = eventUtils.createEvent(eventArgs, { type: 'keypress', target: $input.get(0) });
        const inputEvent = eventUtils.createEvent(eventArgs, { type: 'input', target: $input.get(0) });

        eventsEngine.trigger($input, keyDownEvent);
        if(!keyDownEvent.isDefaultPrevented()) {
            eventsEngine.trigger($input, keyPressEvent);
            if(!keyPressEvent.isDefaultPrevented()) {
                const timeout = browser.mozilla ? 25 : 0; // T882996
                setTimeout(() => {
                    $input.val(editorValue);

                    const $widgetContainer = $input.closest(`.${WIDGET_CLASS}`);
                    eventsEngine.off($widgetContainer, 'focusout'); // for NumberBox to save entered symbol
                    eventsEngine.one($widgetContainer, 'focusout', function() {
                        eventsEngine.trigger($input, 'change');
                    });
                    eventsEngine.trigger($input, inputEvent);
                }, timeout);

            }
        }
    },
    // #endregion Editing

    // #region Events
    _fireFocusChangingEvents: function($event, $cell, fireRowEvent, isHighlighted) {
        let args = { };
        const cellPosition = this._getCellPosition($cell) || { };

        if(this.isCellFocusType()) {
            args = this._fireFocusedCellChanging($event, $cell, isHighlighted);
            if(!args.cancel) {
                cellPosition.columnIndex = args.newColumnIndex;
                cellPosition.rowIndex = args.newRowIndex;
                isHighlighted = args.isHighlighted;
                $cell = $(this._getCell(cellPosition));
            }
        }

        if(!args.cancel && fireRowEvent && $cell) {
            args = this._fireFocusedRowChanging($event, $cell.parent());
            if(!args.cancel) {
                cellPosition.rowIndex = args.newRowIndex;
                args.isHighlighted = isHighlighted;
            }
        }

        args.$newCellElement = $(this._getCell(cellPosition));
        if(!args.$newCellElement.length) {
            args.$newCellElement = $cell;
        }

        return args;
    },

    _fireFocusedCellChanging: function($event, $cellElement, isHighlighted) {
        const that = this;
        const prevCellIndex = that.option('focusedColumnIndex');
        const prevRowIndex = that.option('focusedRowIndex');
        const cellPosition = that._getCellPosition($cellElement);
        const columnIndex = cellPosition ? cellPosition.columnIndex : -1;
        const rowIndex = cellPosition ? cellPosition.rowIndex : -1;
        const args = {
            cellElement: $cellElement,
            prevColumnIndex: prevCellIndex,
            prevRowIndex: prevRowIndex,
            newColumnIndex: columnIndex,
            newRowIndex: rowIndex,
            rows: that.getController('data').getVisibleRows(),
            columns: that.getController('columns').getVisibleColumns(),
            event: $event,
            isHighlighted: isHighlighted || false,
            cancel: false
        };

        this._canceledCellPosition = null;

        that.executeAction('onFocusedCellChanging', args);
        if(args.newColumnIndex !== columnIndex || args.newRowIndex !== rowIndex) {
            args.$newCellElement = $(this._getCell({ columnIndex: args.newColumnIndex, rowIndex: args.newRowIndex }));
        }

        if(args.cancel) {
            this._canceledCellPosition = { rowIndex: rowIndex, columnIndex: columnIndex };
        }

        return args;
    },

    _fireFocusedCellChanged: function($cellElement, prevCellIndex, prevRowIndex) {
        const that = this;
        let dataController = that.getController('data');
        const columnIndex = that.getView('rowsView').getCellIndex($cellElement);
        const rowIndex = this._getRowIndex($cellElement && $cellElement.parent());
        const localRowIndex = Math.min(rowIndex - dataController.getRowIndexOffset(), dataController.items().length - 1);
        const isEditingCell = that.getController('editing').isEditCell(localRowIndex, columnIndex);
        const row = dataController.items()[localRowIndex];

        if(!isEditingCell && (prevCellIndex !== columnIndex || prevRowIndex !== rowIndex)) {
            dataController = that.getController('data');
            that.executeAction('onFocusedCellChanged', {
                cellElement: $cellElement,
                columnIndex: columnIndex,
                rowIndex: rowIndex,
                row: row,
                column: that.getController('columns').getVisibleColumns()[columnIndex]
            });
        }
    },

    _fireFocusedRowChanging: function(eventArgs, $newFocusedRow) {
        const newRowIndex = this._getRowIndex($newFocusedRow);
        const dataController = this.getController('data');
        const prevFocusedRowIndex = this.option('focusedRowIndex');
        const loadingOperationTypes = dataController.loadingOperationTypes();
        const args = {
            rowElement: $newFocusedRow,
            prevRowIndex: prevFocusedRowIndex,
            newRowIndex: newRowIndex,
            event: eventArgs,
            rows: this.getController('data').getVisibleRows(),
            cancel: false
        };

        if(!dataController || dataController.isLoading() && (loadingOperationTypes.reload || loadingOperationTypes.paging)) {
            args.cancel = true;
            return args;
        }

        if(this.option('focusedRowEnabled')) {
            this.executeAction('onFocusedRowChanging', args);
            if(!args.cancel && args.newRowIndex !== newRowIndex) {
                args.resetFocusedRow = args.newRowIndex < 0;
                if(!args.resetFocusedRow) {
                    this.setFocusedRowIndex(args.newRowIndex);
                }
                args.rowIndexChanged = true;
            }
        }

        return args;
    },

    _fireFocusedRowChanged: function($rowElement) {
        let row;

        const focusedRowKey = this.option('focusedRowKey');

        const focusController = this.getController('focus');
        const focusedRowIndex = focusController?.getFocusedRowIndexByKey(focusedRowKey);

        if(this.option('focusedRowEnabled')) {
            if(focusedRowIndex >= 0) {
                const dataController = this.getController('data');
                row = focusedRowIndex >= 0 && dataController.getVisibleRows()[focusedRowIndex - dataController.getRowIndexOffset()];
            }
            this.executeAction('onFocusedRowChanged', {
                rowElement: $rowElement,
                rowIndex: focusedRowIndex,
                row: row
            });
        }
    },
    // #endregion Events

    _isEventInCurrentGrid: function(event) {
        return isElementInCurrentGrid(this, $(event.target));
    },

    _isRowEditMode: function() {
        const editMode = this.getController('editing').getEditMode();
        return editMode === EDIT_MODE_ROW || editMode === EDIT_MODE_FORM;
    },

    _isCellEditMode: function() {
        const editMode = this.getController('editing').getEditMode();
        return editMode === EDIT_MODE_CELL || editMode === EDIT_MODE_BATCH;
    },

    _isFastEditingAllowed: function() {
        return this._isCellEditMode() && this.option('keyboardNavigation.editOnKeyPress');
    },

    _getInteractiveElement: function($cell, isLast) {
        const $focusedElement = $cell.find(INTERACTIVE_ELEMENTS_SELECTOR).filter(':visible');

        return isLast ? $focusedElement.last() : $focusedElement.first();
    },

    _applyTabIndexToElement: function($element) {
        const tabIndex = this.option('tabIndex') || 0;
        $element.attr('tabindex', isDefined(tabIndex) ? tabIndex : 0);
    },

    _getCell: function(cellPosition) {
        if(this._focusedView && this._dataController && cellPosition) {
            return this._focusedView.getCell({
                rowIndex: cellPosition.rowIndex - this._dataController.getRowIndexOffset(),
                columnIndex: cellPosition.columnIndex,
            });
        }
    },

    _getRowIndex: function($row) {
        const rowsView = this.getView('rowsView');
        let rowIndex = rowsView.getRowIndex($row);

        if(rowIndex >= 0) {
            rowIndex += this.getController('data').getRowIndexOffset();
        }

        return rowIndex;
    },

    _hasSkipRow: function($row) {
        const row = $row && $row.get(0);
        return row && (row.style.display === 'none' || $row.hasClass(this.addWidgetPrefix(GROUP_FOOTER_CLASS)) || (isDetailRow($row) && !$row.hasClass(this.addWidgetPrefix(EDIT_FORM_CLASS))));
    },


    _allowEditingOnEnterKey: function() {
        return this.option('keyboardNavigation.enterKeyAction') === 'startEdit';
    },

    _isLegacyNavigation: function() {
        return this.option('useLegacyKeyboardNavigation');
    },

    _getDirectionCodeByKey: function(key) {
        let directionCode;

        if(this.option('rtlEnabled')) {
            directionCode = key === 'leftArrow' ? 'nextInRow' : 'previousInRow';
        } else {
            directionCode = key === 'leftArrow' ? 'previousInRow' : 'nextInRow';
        }

        return directionCode;
    },

    _isVirtualScrolling: function() {
        const scrollingMode = this.option('scrolling.mode');
        return scrollingMode === 'virtual' || scrollingMode === 'infinite';
    },

    _scrollBy: function(top, rowIndex, $event) {
        const that = this;
        const scrollable = this.getView('rowsView').getScrollable();

        if(that._focusedCellPosition) {
            const scrollHandler = function() {
                scrollable.off('scroll', scrollHandler);
                setTimeout(that.restoreFocusableElement.bind(that, rowIndex, $event));
            };
            scrollable.on('scroll', scrollHandler);
        }
        scrollable.scrollBy({ left: 0, top: top });
    },

    _isInsideEditForm: function(element) {
        return $(element).closest('.' + this.addWidgetPrefix(EDIT_FORM_CLASS)).length > 0;
    },

    _isMasterDetailCell: function(element) {
        const $masterDetailCell = $(element).closest('.' + MASTER_DETAIL_CELL_CLASS);
        const $masterDetailGrid = $masterDetailCell.closest('.' + this.getWidgetContainerClass()).parent();

        return $masterDetailCell.length && $masterDetailGrid.is(this.component.$element());
    },

    _processNextCellInMasterDetail: function($nextCell) {
        if(!this._isInsideEditForm($nextCell) && $nextCell) {
            this._applyTabIndexToElement($nextCell);
        }
    },

    _handleTabKeyOnMasterDetailCell: function(target, direction) {
        if(this._isMasterDetailCell(target)) {
            this._updateFocusedCellPosition($(target), direction);

            const $nextCell = this._getNextCell(direction, 'row');
            this._processNextCellInMasterDetail($nextCell);
            return true;
        }

        return false;
    },

    _getElementType: function(target) {
        return $(target).is('tr') ? 'row' : 'cell';
    },

    _isFastEditingStarted: function() {
        return this._isFastEditingAllowed() && this._fastEditingStarted;
    },

    _getVisibleColumnCount: function() {
        return this.getController('columns').getVisibleColumns().length;
    },

    _isCellInRow: function(cellPosition, includeCommandCells) {
        const columnIndex = cellPosition.columnIndex;
        const visibleColumnsCount = this._getVisibleColumnCount();

        return includeCommandCells ? columnIndex >= 0 && columnIndex <= visibleColumnsCount - 1 : columnIndex > 0 && columnIndex < visibleColumnsCount - 1;
    },

    _getCellElementFromTarget: function(target) {
        const elementType = this._getElementType(target);
        const $targetElement = $(target);
        let $cell;
        if(elementType === 'cell') {
            $cell = $targetElement.closest(`.${ROW_CLASS} > td`);
        } else {
            $cell = $targetElement.children().not('.' + COMMAND_EXPAND_CLASS).first();
        }
        return $cell;
    },

    _getRowsViewElement: function() {
        const rowsView = this.getView('rowsView');
        return rowsView && rowsView.element();
    },

    isKeyboardEnabled: function() {
        return this.option('keyboardNavigation.enabled');
    },

    _processCanceledEditCellPosition: function(rowIndex, columnIndex) {
        if(this._canceledCellPosition) {
            const isCanceled = this._canceledCellPosition.rowIndex === rowIndex && this._canceledCellPosition.columnIndex === columnIndex;
            this._canceledCellPosition = null;
            return isCanceled;
        }
    }
});

/**
* @name GridBaseMethods.registerKeyHandler
* @publicName registerKeyHandler(key, handler)
* @hidden
*/

module.exports = {
    defaultOptions: function() {
        return {
            useLegacyKeyboardNavigation: false,

            keyboardNavigation: {
                /**
                 * @name GridBaseOptions.keyboardNavigation.enabled
                 * @type boolean
                 * @default true
                 */
                enabled: true,

                /**
                 * @name GridBaseOptions.keyboardNavigation.enterKeyAction
                 * @type Enums.GridEnterKeyAction
                 * @default "startEdit"
                 */
                enterKeyAction: 'startEdit',
                /**
                 * @name GridBaseOptions.keyboardNavigation.enterKeyDirection
                 * @type Enums.GridEnterKeyDirection
                 * @default "none"
                 */
                enterKeyDirection: 'none',
                /**
                 * @name GridBaseOptions.keyboardNavigation.editOnKeyPress
                 * @type boolean
                 * @default false
                 */
                editOnKeyPress: false
            }
        };
    },
    controllers: {
        keyboardNavigation: KeyboardNavigationController
    },
    extenders: {
        views: {
            rowsView: {
                _rowClick: function(e) {
                    const editRowIndex = this.getController('editing').getEditRowIndex();
                    const keyboardController = this.getController('keyboardNavigation');

                    if(editRowIndex === e.rowIndex) {
                        keyboardController.setCellFocusType();
                    }

                    const needTriggerPointerEventHandler = isMobile() && this.option('focusedRowEnabled');
                    if(needTriggerPointerEventHandler) {
                        this._triggerPointerDownEventHandler(e);
                    }

                    this.callBase.apply(this, arguments);
                },
                _triggerPointerDownEventHandler: function(e) {
                    const originalEvent = e.event.originalEvent;
                    if(originalEvent) {
                        const keyboardController = this.getController('keyboardNavigation');
                        const $cell = $(originalEvent.target);
                        const columnIndex = this.getCellIndex($cell);
                        const column = this.getController('columns').getVisibleColumns()[columnIndex];
                        const row = this.getController('data').items()[e.rowIndex];

                        if(keyboardController._isAllowEditing(row, column)) {
                            const eventArgs = eventUtils.createEvent(originalEvent, { currentTarget: originalEvent.target });
                            keyboardController._pointerEventHandler(eventArgs);
                        }
                    }
                },

                renderFocusState: function() {
                    const dataController = this._dataController;
                    let rowIndex = this.option('focusedRowIndex') || 0;
                    const $rowsView = this.element();

                    if($rowsView && !focused($rowsView)) {
                        $rowsView.attr('tabIndex', null);
                    }

                    if(rowIndex < 0 || rowIndex >= dataController.getVisibleRows().length) {
                        rowIndex = 0;
                    }

                    const cellElements = this.getCellElements(rowIndex);
                    if(this.getController('keyboardNavigation').isKeyboardEnabled() && cellElements) {
                        this.updateFocusElementTabIndex(cellElements);
                    }
                },
                updateFocusElementTabIndex: function(cellElements) {
                    const keyboardController = this.getController('keyboardNavigation');
                    const $row = cellElements.eq(0).parent();
                    let columnIndex = this.option('focusedColumnIndex');

                    if(!columnIndex || columnIndex < 0) {
                        columnIndex = 0;
                    }

                    if(isGroupRow($row)) {
                        keyboardController._applyTabIndexToElement($row);
                    } else {
                        this._updateFocusedCellTabIndex(cellElements, columnIndex);
                    }
                },
                _updateFocusedCellTabIndex: function(cellElements, columnIndex) {
                    let $cell;
                    const keyboardController = this.getController('keyboardNavigation');
                    const oldFocusedView = keyboardController._focusedView;
                    const cellElementsLength = cellElements ? cellElements.length : -1;

                    keyboardController._focusedView = this;

                    if(cellElementsLength > 0) {
                        if(cellElementsLength <= columnIndex) {
                            columnIndex = cellElementsLength - 1;
                        }
                        for(let i = columnIndex; i < cellElementsLength; ++i) {
                            $cell = $(cellElements[i]);
                            if(!keyboardController._isMasterDetailCell($cell)) {
                                if(keyboardController._isCellValid($cell) && isCellElement($cell)) {
                                    keyboardController._applyTabIndexToElement($cell);
                                    keyboardController.setCellFocusType();
                                    break;
                                }
                            }
                        }
                    }

                    keyboardController._focusedView = oldFocusedView;
                },

                renderDelayedTemplates: function(change) {
                    this.callBase.apply(this, arguments);
                    if(!change || !change.repaintChangesOnly) {
                        this.renderFocusState();
                    }
                },

                _renderCore: function(change) {
                    this.callBase(change);
                    if(!change || !change.repaintChangesOnly) {
                        this.renderFocusState();
                    }
                },

                _editCellPrepared: function($cell) {
                    const editorInstance = this._getEditorInstance($cell);
                    const keyboardController = this.getController('keyboardNavigation');
                    const isEditingNavigationMode = keyboardController && keyboardController._isFastEditingStarted();

                    if(editorInstance && isEditingNavigationMode) {
                        this._handleEditingNavigationMode(editorInstance);
                    }

                    this.callBase.apply(this, arguments);
                },
                _handleEditingNavigationMode: function(editorInstance) {
                    ['downArrow', 'upArrow'].forEach(function(keyName) {
                        const originalKeyHandler = editorInstance._supportedKeys()[keyName];
                        editorInstance.registerKeyHandler(keyName, e => {
                            const isDropDownOpened = editorInstance._input().attr('aria-expanded') === 'true';
                            if(isDropDownOpened) {
                                return originalKeyHandler && originalKeyHandler.call(editorInstance, e);
                            }
                        });
                    });

                    editorInstance.registerKeyHandler('leftArrow', noop);
                    editorInstance.registerKeyHandler('rightArrow', noop);

                    const isDateBoxWithMask = editorInstance.NAME === DATEBOX_WIDGET_NAME && editorInstance.option('useMaskBehavior');
                    if(isDateBoxWithMask) {
                        editorInstance.registerKeyHandler('enter', noop);
                    }
                },
                _getEditorInstance: function($cell) {
                    const $editor = $cell.find('.dx-texteditor').eq(0);

                    return getWidgetInstance($editor);
                }
            }
        },
        controllers: {
            editing: {
                editCell: function(rowIndex, columnIndex) {
                    const keyboardController = this.getController('keyboardNavigation');

                    if(keyboardController._processCanceledEditCellPosition(rowIndex, columnIndex)) {
                        return false;
                    }

                    const isCellEditing = this.callBase(rowIndex, columnIndex);
                    if(isCellEditing) {
                        keyboardController.setupFocusedView();
                    }

                    return isCellEditing;
                },
                editRow: function(rowIndex) {
                    const keyboardController = this.getController('keyboardNavigation');
                    const columnIndex = this.option('focusedColumnIndex');
                    const column = this._columnsController.getVisibleColumns()[columnIndex];

                    if(column && column.type || this.option('editing.mode') === EDIT_MODE_FORM) {
                        keyboardController._resetFocusedCell();
                    }
                    this.callBase(rowIndex);
                },
                addRow: function(parentKey) {
                    const keyboardController = this.getController('keyboardNavigation');

                    keyboardController.setupFocusedView();
                    keyboardController.setCellFocusType();

                    return this.callBase.apply(this, arguments);
                },
                getFocusedCellInRow: function(rowIndex) {
                    const keyboardNavigationController = this.getController('keyboardNavigation');
                    let $cell = this.callBase(rowIndex);

                    if(keyboardNavigationController.isKeyboardEnabled() && keyboardNavigationController._focusedCellPosition.rowIndex === rowIndex) {
                        const $focusedCell = keyboardNavigationController._getFocusedCell();
                        if(isElementDefined($focusedCell) && !$focusedCell.hasClass('dx-command-edit')) {
                            $cell = $focusedCell;
                        }
                    }

                    return $cell;
                },
                _processCanceledEditingCell: function() {
                    this.closeEditCell().done(() => {
                        const keyboardNavigation = this.getController('keyboardNavigation');
                        keyboardNavigation._updateFocus();
                    });
                },
                init: function() {
                    this.callBase();
                    this._keyboardNavigationController = this.getController('keyboardNavigation');
                },
                closeEditCell: function() {
                    const keyboardNavigation = this._keyboardNavigationController;
                    keyboardNavigation._fastEditingStarted = false;

                    const result = this.callBase.apply(this, arguments);

                    keyboardNavigation._updateFocus();

                    return result;
                },
                _delayedInputFocus: function() {
                    this._keyboardNavigationController._isNeedScroll = true;
                    this.callBase.apply(this, arguments);
                },
                _isEditingStart: function() {
                    const keyboardNavigation = this.getController('keyboardNavigation');
                    const cancel = this.callBase.apply(this, arguments);

                    if(cancel && !keyboardNavigation._isNeedFocus) {
                        const $cell = keyboardNavigation._getFocusedCell();
                        keyboardNavigation._focus($cell, true);
                    }

                    return cancel;
                }
            },
            data: {
                _correctRowIndices: function(getRowIndexCorrection) {
                    const that = this;
                    const keyboardNavigationController = that.getController('keyboardNavigation');
                    const editorFactory = that.getController('editorFactory');
                    const focusedCellPosition = keyboardNavigationController._focusedCellPosition;

                    that.callBase.apply(that, arguments);

                    if(focusedCellPosition && focusedCellPosition.rowIndex >= 0) {
                        const focusedRowIndexCorrection = getRowIndexCorrection(focusedCellPosition.rowIndex);
                        if(focusedRowIndexCorrection) {
                            focusedCellPosition.rowIndex += focusedRowIndexCorrection;
                            editorFactory.refocus();
                        }
                    }
                }
            },
            adaptiveColumns: {
                _showHiddenCellsInView: function({ viewName, $cells, isCommandColumn }) {
                    this.callBase.apply(this, arguments);

                    viewName === COLUMN_HEADERS_VIEW && !isCommandColumn && $cells.each((_, cellElement) => {
                        const $cell = $(cellElement);
                        isCellInHeaderRow($cell) && $cell.attr('tabindex', 0);
                    });
                },
                _hideVisibleCellInView: function({ viewName, $cell, isCommandColumn }) {
                    this.callBase.apply(this, arguments);

                    if(viewName === COLUMN_HEADERS_VIEW && !isCommandColumn && isCellInHeaderRow($cell)) {
                        $cell.removeAttr('tabindex');
                    }
                }
            }
        }
    }
};
