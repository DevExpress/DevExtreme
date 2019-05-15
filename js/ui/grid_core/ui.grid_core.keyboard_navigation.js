import $ from "../../core/renderer";
import domAdapter from "../../core/dom_adapter";
import eventsEngine from "../../events/core/events_engine";
import core from "./ui.grid_core.modules";
import { isDefined } from "../../core/utils/type";
import { inArray } from "../../core/utils/array";
import { focused } from "../widget/selectors";
import { each } from "../../core/utils/iterator";
import KeyboardProcessor from "../widget/ui.keyboard_processor";
import eventUtils from "../../events/utils";
import pointerEvents from "../../events/pointer";

var ROWS_VIEW_CLASS = "rowsview",
    EDIT_FORM_CLASS = "edit-form",
    GROUP_FOOTER_CLASS = "group-footer",
    ROW_CLASS = "dx-row",
    DATA_ROW_CLASS = "dx-data-row",
    GROUP_ROW_CLASS = "dx-group-row",
    EDIT_FORM_ITEM_CLASS = "edit-form-item",
    MASTER_DETAIL_ROW_CLASS = "dx-master-detail-row",
    FREESPACE_ROW_CLASS = "dx-freespace-row",
    VIRTUAL_ROW_CLASS = "dx-virtual-row",
    MASTER_DETAIL_CELL_CLASS = "dx-master-detail-cell",
    DROPDOWN_EDITOR_OVERLAY_CLASS = "dx-dropdowneditor-overlay",
    COMMAND_EXPAND_CLASS = "dx-command-expand",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",

    INTERACTIVE_ELEMENTS_SELECTOR = "input:not([type='hidden']), textarea, a, [tabindex]",

    VIEWS = ["rowsView"],

    EDIT_MODE_ROW = "row",
    EDIT_MODE_FORM = "form",
    EDIT_MODE_BATCH = "batch",
    EDIT_MODE_CELL = "cell",

    FOCUS_TYPE_ROW = "row",
    FOCUS_TYPE_CELL = "cell";

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
    return $element.length && $element[0].tagName === "TD";
}

var KeyboardNavigationController = core.ViewController.inherit({
    _isRowEditMode: function() {
        var editMode = this._editingController.getEditMode();
        return editMode === EDIT_MODE_ROW || editMode === EDIT_MODE_FORM;
    },

    _isCellEditMode: function() {
        var editMode = this._editingController.getEditMode();
        return editMode === EDIT_MODE_CELL || editMode === EDIT_MODE_BATCH;
    },

    _focusView: function(view, viewIndex) {
        this._focusedViews.viewIndex = viewIndex;
        this._focusedView = view;
    },

    _getInteractiveElement: function($cell, isLast) {
        var $focusedElement = $cell.find(INTERACTIVE_ELEMENTS_SELECTOR).filter(":visible");

        return isLast ? $focusedElement.last() : $focusedElement.first();
    },

    _focusInteractiveElement: function($cell, isLast) {
        if(!$cell) return;

        var $focusedElement = this._getInteractiveElement($cell, isLast);

        ///#DEBUG
        this._testInteractiveElement = $focusedElement;
        ///#ENDDEBUG

        eventsEngine.trigger($focusedElement, "focus");
    },

    _updateFocus: function(editingCanceled) {
        var that = this;
        setTimeout(function() {
            var $cell = that._getFocusedCell(),
                $cellEditingCell = that._isCellEditMode() && $cell;

            if($cell && !(that._isMasterDetailCell($cell) && !that._isRowEditMode())) {
                if(that._hasSkipRow($cell.parent())) {
                    $cell = that._getNextCell(that._focusedCellPosition && that._focusedCellPosition.rowIndex > 0 ? "upArrow" : "downArrow");
                }
                if($cell && $cell.length > 0) {
                    if($cell.is("td") || $cell.hasClass(that.addWidgetPrefix(EDIT_FORM_ITEM_CLASS))) {
                        if(that.getController("editorFactory").focus() || $cellEditingCell) {
                            let args = that._fireFocusChangingEvents(null, $cell, true, !editingCanceled);
                            $cell = args.$newCellElement;
                            that._focus($cell, !args.isHighlighted);
                        } else if(that._isHiddenFocus) {
                            that._focus($cell, true);
                        }
                        if(that._editingController.isEditing()) {
                            that._focusInteractiveElement.bind(that)($cell);
                        }
                    } else {
                        eventsEngine.trigger($cell, "focus");
                    }
                }
            }
        });
    },

    _applyTabIndexToElement: function($element) {
        var tabIndex = this.option("tabIndex");
        $element.attr("tabIndex", isDefined(tabIndex) ? tabIndex : 0);
    },
    _isEventInCurrentGrid: function(event) {
        var $grid = $(event.target).closest("." + this.getWidgetContainerClass()).parent();
        return $grid.is(this.component.$element());
    },
    _clickHandler: function(e) {
        var event = e.event,
            $target = $(event.currentTarget),
            data = event.data;

        if(this._isEventInCurrentGrid(event) && this._isCellValid($target)) {
            $target = this._isInsideEditForm($target) ? $(event.target) : $target;
            this._focusView(data.view, data.viewIndex);

            if($target.parent().hasClass(FREESPACE_ROW_CLASS)) {

                this._updateFocusedCellPosition($target);

                this._focusedView.element().attr("tabindex", 0);
                this._focusedView.focus();
            } else if(!this._editingController.isEditing() && !this._isMasterDetailCell($target)) {
                this._clickTargetCellHandler(event, $target);
            } else {
                this._updateFocusedCellPosition($target);
            }
        } else if($target.is("td")) {
            this._resetFocusedCell();
        }
    },

    _allowRowUpdating: function() {
        var rowIndex = this.getVisibleRowIndex(),
            row = this._dataController.items()[rowIndex];

        return this._editingController.allowUpdating({ row: row });
    },

    _clickTargetCellHandler: function(event, $cell) {
        var columnIndex = this.getView("rowsView").getCellIndex($cell),
            column = this._columnsController.getVisibleColumns()[columnIndex],
            isCellEditMode = this._isCellEditMode(),
            args;

        this.setCellFocusType();
        args = this._fireFocusChangingEvents(event, $cell, true);
        $cell = args.$newCellElement;

        if(!args.cancel) {
            if(args.rowIndexChanged) {
                $cell = this._getFocusedCell();
            }

            if(!args.isHighlighted && !isCellEditMode) {
                this.setRowFocusType();
            }

            this._updateFocusedCellPosition($cell);

            if(this._allowRowUpdating() && isCellEditMode && column && column.allowEditing) {
                this._isHiddenFocus = false;
            } else {
                let $target = event && $(event.target),
                    isInteractiveTarget = $target && $target.not($cell).is(INTERACTIVE_ELEMENTS_SELECTOR),
                    isDisabled = !args.isHighlighted || isInteractiveTarget;
                this._focus($cell, isDisabled, isInteractiveTarget);
            }
        } else {
            this.setRowFocusType();
            this.setFocusedRowIndex(args.prevRowIndex);
            $cell = this._getFocusedCell();
            if(this._isCellValid($cell)) {
                this._focus($cell, true);
            }
        }
    },

    _initFocusedViews: function() {
        var that = this,
            clickAction = that.createAction(that._clickHandler);

        that._focusedViews = [];

        each(VIEWS, function(key, viewName) {
            var view = that.getView(viewName);
            if(view && view.isVisible()) {
                that._focusedViews.push(view);
            }
        });

        each(that._focusedViews, function(index, view) {
            if(view) {
                view.renderCompleted.add(function(e) {
                    var $element = view.element(),
                        isFullUpdate = !e || e.changeType === "refresh",
                        isFocusedViewCorrect = that._focusedView && that._focusedView.name === view.name,
                        needUpdateFocus = false,
                        isAppend = e && (e.changeType === "append" || e.changeType === "prepend");

                    eventsEngine.off($element, eventUtils.addNamespace(pointerEvents.down, "dxDataGridKeyboardNavigation"), clickAction);
                    eventsEngine.on($element, eventUtils.addNamespace(pointerEvents.down, "dxDataGridKeyboardNavigation"), "." + ROW_CLASS + " > td, ." + ROW_CLASS, {
                        viewIndex: index,
                        view: view
                    }, clickAction);

                    that._initKeyDownProcessor(that, $element, that._keyDownHandler);

                    if(isFocusedViewCorrect) {
                        needUpdateFocus = that._isNeedFocus ? !isAppend : that._isHiddenFocus && isFullUpdate;
                        needUpdateFocus && that._updateFocus();
                    }
                });
            }
        });
    },

    _initKeyDownProcessor: function(context, element, handler) {
        if(this._keyDownProcessor) {
            this._keyDownProcessor.dispose();
            this._keyDownProcessor = null;
        }
        this._keyDownProcessor = new KeyboardProcessor({
            element: element,
            context: context,
            handler: handler
        });
    },

    _getCell: function(cellPosition) {
        if(this._focusedView && cellPosition) {
            return this._focusedView.getCell({
                rowIndex: cellPosition.rowIndex - this._dataController.getRowIndexOffset(),
                columnIndex: cellPosition.columnIndex,
            });
        }
    },

    _getFocusedCell: function() {
        return this._getCell(this._focusedCellPosition);
    },

    _getRowIndex: function($row) {
        var that = this,
            focusedView = that._focusedView,
            rowIndex = -1;

        if(focusedView) {
            rowIndex = focusedView.getRowIndex($row);
        }

        if(rowIndex >= 0) {
            rowIndex += that._dataController.getRowIndexOffset();
        }

        return rowIndex;
    },

    _updateFocusedCellPosition: function($cell, direction) {
        var position = this._getCellPosition($cell, direction);
        if(position) {
            if(!$cell.length || position.rowIndex >= 0 && position.columnIndex >= 0) {
                this.setFocusedCellPosition(position.rowIndex, position.columnIndex);
            }
        }
    },
    _getCellPosition: function($cell, direction) {
        var that = this,
            rowIndex,
            columnIndex,
            $rowElement = $cell.closest("tr");

        if($rowElement.length > 0 && that._focusedView) {
            rowIndex = $rowElement.length > 0 && that._getRowIndex($rowElement);

            columnIndex = that._focusedView.getCellIndex($cell, rowIndex);

            if(direction) {
                columnIndex = direction === "previous" ? columnIndex - 1 : columnIndex + 1;
                columnIndex = that._applyColumnIndexBoundaries(columnIndex);
            }

            return { rowIndex: rowIndex, columnIndex: columnIndex };
        }
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
        var visibleColumnsCount = this._getVisibleColumnCount();

        if(columnIndex < 0) {
            columnIndex = 0;
        } else if(columnIndex >= visibleColumnsCount) {
            columnIndex = visibleColumnsCount - 1;
        }

        return columnIndex;
    },


    _isCellValid: function($cell) {
        if(isDefined($cell)) {
            var rowsView = this.getView("rowsView"),
                $row = $cell.parent(),
                visibleColumns = this._columnsController.getVisibleColumns(),
                columnIndex = rowsView.getCellIndex($cell),
                column = visibleColumns[columnIndex],
                visibleColumnCount = this._getVisibleColumnCount(),
                editingController = this._editingController,
                isMasterDetailRow = isDetailRow($row),
                isShowWhenGrouped = column && column.showWhenGrouped,
                isDataCell = column && !$cell.hasClass(COMMAND_EXPAND_CLASS) && isDataRow($row),
                isValidGroupSpaceColumn = function() {
                    return !isMasterDetailRow && column && (!isDefined(column.groupIndex) || isShowWhenGrouped && isDataCell) || parseInt($cell.attr("colspan")) > 1;
                };

            if(this._isMasterDetailCell($cell)) {
                return true;
            }

            if(visibleColumnCount > columnIndex && isValidGroupSpaceColumn()) {
                let rowItems = this._dataController.items(),
                    visibleRowIndex = rowsView.getRowIndex($row),
                    row = rowItems[visibleRowIndex],
                    isCellEditing = editingController && this._isCellEditMode() && editingController.isEditing(),
                    isRowEditingInCurrentRow = editingController && editingController.isEditRow(visibleRowIndex),
                    isEditing = isRowEditingInCurrentRow || isCellEditing;

                if(column.command) {
                    return !isEditing && column.command === "expand";
                }

                if(isCellEditing && row && row.rowType !== "data") {
                    return false;
                }

                return !isEditing || column.allowEditing;
            }
        }
    },

    _isCellByPositionValid: function(cellPosition) {
        var $cell = this._getCell(cellPosition);

        return this._isCellValid($cell);
    },

    _focus: function($cell, disableFocus, isInteractiveElement) {
        var $row = ($cell && $cell.is("td")) ? $cell.parent() : $cell;

        if($row && isNotFocusedRow($row)) {
            return;
        }

        var $prevFocusedCell = this._getFocusedCell(),
            focusedView = this._focusedView,
            $focusViewElement = focusedView && focusedView.element(),
            $focusElement;

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

        $prevFocusedCell && $prevFocusedCell.is("td") && $prevFocusedCell.not($focusElement).removeAttr("tabIndex");

        if($focusElement) {
            if(!isInteractiveElement) {
                this._applyTabIndexToElement($focusElement);
                eventsEngine.trigger($focusElement, "focus");
            }
            if(disableFocus) {
                $focusViewElement && $focusViewElement.find("." + CELL_FOCUS_DISABLED_CLASS + "[tabIndex]").not($focusElement).removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr("tabIndex");
                $focusElement.addClass(CELL_FOCUS_DISABLED_CLASS);
            } else {
                $focusViewElement && $focusViewElement.find("." + CELL_FOCUS_DISABLED_CLASS + ":not(." + MASTER_DETAIL_CELL_CLASS + ")").removeClass(CELL_FOCUS_DISABLED_CLASS);
                this.getController("editorFactory").focus($focusElement);
            }
        }
    },

    _hasSkipRow: function($row) {
        var row = $row && $row.get(0);
        return row && (row.style.display === "none" || $row.hasClass(this.addWidgetPrefix(GROUP_FOOTER_CLASS)) || (isDetailRow($row) && !$row.hasClass(this.addWidgetPrefix(EDIT_FORM_CLASS))));
    },

    _enterKeyHandler: function(eventArgs, isEditing) {
        var $cell = this._getFocusedCell(),
            rowIndex = this.getVisibleRowIndex(),
            $row = this._focusedView && this._focusedView.getRow(rowIndex);

        if((this.option("grouping.allowCollapsing") && isGroupRow($row)) ||
            (this.option("masterDetail.enabled") && $cell && $cell.hasClass(COMMAND_EXPAND_CLASS))) {
            var key = this._dataController.getKeyByRowIndex(rowIndex),
                item = this._dataController.items()[rowIndex];

            if(key !== undefined && item && item.data && !item.data.isContinuation) {
                this._dataController.changeRowExpand(key);
            }
        } else {
            if(isEditing) {
                $cell = this._getCellElementFromTarget(eventArgs.originalEvent.target);
                this._updateFocusedCellPosition($cell);
                if(this._isRowEditMode()) {
                    this._focusEditFormCell($cell);
                    setTimeout(this._editingController.saveEditData.bind(this._editingController));
                } else {
                    var $target = $(eventArgs.originalEvent.target);
                    eventsEngine.trigger($target, "blur");
                    this._editingController.closeEditCell();
                    eventArgs.originalEvent.preventDefault();
                }
            } else {
                var column = this._columnsController.getVisibleColumns()[this._focusedCellPosition.columnIndex],
                    row = this._dataController.items()[rowIndex];

                if(this._editingController.allowUpdating({ row: row }) && column && column.allowEditing) {
                    if(this._isRowEditMode()) {
                        this._editingController.editRow(rowIndex);
                    } else {
                        this._focusedCellPosition && this._editingController.editCell(rowIndex, this._focusedCellPosition.columnIndex);
                    }
                }
            }
        }
    },

    _leftRightKeysHandler: function(eventArgs, isEditing) {
        var rowIndex = this.getVisibleRowIndex(),
            $event = eventArgs.originalEvent,
            $row = this._focusedView && this._focusedView.getRow(rowIndex),
            directionCode;

        if(!isEditing && isDataRow($row)) {
            this.setCellFocusType();
            directionCode = this._getDirectionCodeByKey(eventArgs.keyName);

            this._arrowKeysHandlerFocusCell($event, this._getNextCell(directionCode));

            if($event) {
                $event.preventDefault();
            }
        }
    },

    _getDirectionCodeByKey: function(key) {
        var directionCode;

        if(this.option("rtlEnabled")) {
            directionCode = key === "leftArrow" ? "nextInRow" : "previousInRow";
        } else {
            directionCode = key === "leftArrow" ? "previousInRow" : "nextInRow";
        }

        return directionCode;
    },

    _upDownKeysHandler: function(eventArgs, isEditing) {
        var rowIndex = this.getVisibleRowIndex(),
            $row = this._focusedView && this._focusedView.getRow(rowIndex),
            $event = eventArgs.originalEvent,
            $cell,
            rowHeight,
            isUpArrow = eventArgs.keyName === "upArrow",
            dataSource = this._dataController.dataSource();

        if(!isEditing && $row && !isDetailRow($row)) {
            $cell = this._getNextCell(eventArgs.keyName);
            if($cell && this._isCellValid($cell)) {

                this._arrowKeysHandlerFocusCell($event, $cell, true);

            } else if(this._isVirtualScrolling() && isUpArrow && dataSource && !dataSource.isLoading()) {
                rowHeight = $row.outerHeight();
                rowIndex = this._focusedCellPosition.rowIndex - 1;
                this._scrollBy(-rowHeight, rowIndex, $event);
            }

            if($event) {
                $event.preventDefault();
            }
        }
    },

    _arrowKeysHandlerFocusCell: function($event, $cell, upDown) {
        var args = this._fireFocusChangingEvents($event, $cell, upDown, true);
        $cell = args.$newCellElement;
        if(!args.cancel && this._isCellValid($cell)) {
            this._focus($cell, !args.isHighlighted);
        }
    },

    _fireFocusChangingEvents: function($event, $cell, fireRowEvent, isHighlighted) {
        var args = { },
            cellPosition = this._getCellPosition($cell) || { };

        if(this.isCellFocusType()) {
            args = this._fireFocusedCellChanging($event, $cell, isHighlighted);
            if(!args.cancel) {
                cellPosition.columnIndex = args.newColumnIndex;
                cellPosition.rowIndex = args.newRowIndex;
                isHighlighted = args.isHighlighted;
            }
        }

        if(!args.cancel && fireRowEvent) {
            args = this._fireFocusedRowChanging($event, $cell.parent());
            if(!args.cancel) {
                cellPosition.rowIndex = args.newRowIndex;
                args.isHighlighted = isHighlighted;
            }
        }

        args.$newCellElement = this._getCell(cellPosition);
        if(!args.$newCellElement || !args.$newCellElement.length) {
            args.$newCellElement = $cell;
        }

        return args;
    },

    _isVirtualScrolling: function() {
        var scrollingMode = this.option("scrolling.mode");
        return scrollingMode === "virtual" || scrollingMode === "infinite";
    },

    _scrollBy: function(top, rowIndex, $event) {
        var that = this,
            scrollable = this.getView("rowsView").getScrollable();

        if(that._focusedCellPosition) {
            var scrollHandler = function() {
                scrollable.off("scroll", scrollHandler);
                setTimeout(that.restoreFocusableElement.bind(that, rowIndex, $event));
            };
            scrollable.on("scroll", scrollHandler);
        }
        scrollable.scrollBy({ left: 0, top: top });
    },

    restoreFocusableElement: function(rowIndex, $event) {
        var that = this,
            args,
            $rowElement,
            isUpArrow = isDefined(rowIndex),
            rowsView = that.getView("rowsView"),
            $rowsViewElement = rowsView.element(),
            columnIndex = that._focusedCellPosition.columnIndex,
            rowIndexOffset = that._dataController.getRowIndexOffset();

        rowIndex = isUpArrow ? rowIndex : rowsView.getTopVisibleItemIndex() + rowIndexOffset;

        if(!isUpArrow) {
            that.getController("editorFactory").loseFocus();
            that._applyTabIndexToElement($rowsViewElement);
            eventsEngine.trigger($rowsViewElement, "focus");
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

    _pageUpDownKeyHandler: function(eventArgs) {
        var pageIndex = this._dataController.pageIndex(),
            pageCount = this._dataController.pageCount(),
            pagingEnabled = this.option("paging.enabled"),
            isPageUp = eventArgs.keyName === "pageUp",
            pageStep = (isPageUp ? -1 : 1),
            scrollable = this.getView("rowsView").getScrollable();

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
        var rowIndex = this.getVisibleRowIndex(),
            $target = $(eventArgs.originalEvent && eventArgs.originalEvent.target),
            isFocusedRowElement;

        if(this.option("selection") && this.option("selection").mode !== "none" && !isEditing) {
            isFocusedRowElement = this._getElementType($target) === "row" && this.isRowFocusType() && isDataRow($target);
            if(isFocusedRowElement) {
                this._selectionController.startSelectionWithCheckboxes();
            }
            if(isFocusedRowElement || $target.parent().hasClass(DATA_ROW_CLASS) || $target.hasClass(this.addWidgetPrefix(ROWS_VIEW_CLASS))) {
                this._selectionController.changeItemSelection(rowIndex, {
                    shift: eventArgs.shift,
                    control: eventArgs.ctrl
                });
                eventArgs.originalEvent.preventDefault();
            }
        }
    },

    _ctrlAKeyHandler: function(eventArgs, isEditing) {
        if(!isEditing && eventArgs.ctrl && !eventArgs.alt && this.option("selection.mode") === "multiple" && this.option("selection.allowSelectAll")) {
            this._selectionController.selectAll();
            eventArgs.originalEvent.preventDefault();
        }
    },

    _isInsideEditForm: function(element) {
        return $(element).closest("." + this.addWidgetPrefix(EDIT_FORM_CLASS)).length > 0;
    },

    _isMasterDetailCell: function(element) {
        var $masterDetailCell = $(element).closest("." + MASTER_DETAIL_CELL_CLASS),
            $masterDetailGrid = $masterDetailCell.closest("." + this.getWidgetContainerClass()).parent();

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

            var $nextCell = this._getNextCell(direction, "row");
            this._processNextCellInMasterDetail($nextCell);
            return true;
        }

        return false;
    },

    _tabKeyHandler: function(eventArgs, isEditing) {
        var editingOptions = this.option("editing"),
            direction = eventArgs.shift ? "previous" : "next",
            isOriginalHandlerRequired = !eventArgs.shift && this._isLastValidCell(this._focusedCellPosition) || (eventArgs.shift && this._isFirstValidCell(this._focusedCellPosition)),
            eventTarget = eventArgs.originalEvent.target;

        if(this._handleTabKeyOnMasterDetailCell(eventTarget, direction)) {
            return;
        }

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
            this.getController("editorFactory").loseFocus();
            if(this._editingController.isEditing() && !this._isRowEditMode()) {
                this._resetFocusedCell();
                this._editingController.closeEditCell();
            }
        } else {
            eventArgs.originalEvent.preventDefault();
        }
    },
    _editingCellTabHandler: function(eventArgs, direction) {
        var editingOptions = this.option("editing"),
            eventTarget = eventArgs.originalEvent.target,
            column,
            row,
            $cell,
            isEditingAllowed;

        this._updateFocusedCellPosition(this._getCellElementFromTarget(eventTarget));
        $cell = this._getNextCell(direction);

        if(!$cell || this._handleTabKeyOnMasterDetailCell($cell, direction)) {
            return false;
        }

        column = this._columnsController.getVisibleColumns()[this.getView("rowsView").getCellIndex($cell)];
        row = this._dataController.items()[this._getRowIndex($cell && $cell.parent())];

        if(column.allowEditing) {
            let isDataRow = !row || row.rowType === "data";
            isEditingAllowed = editingOptions.allowUpdating ? isDataRow : row && row.inserted;
        }

        if(!isEditingAllowed) {
            this._editingController.closeEditCell();
        }

        if(this._focusCell($cell)) {
            if(!this._isRowEditMode() && isEditingAllowed) {
                this._editingController.editCell(this.getVisibleRowIndex(), this._focusedCellPosition.columnIndex);
            } else {
                this._focusInteractiveElement($cell, eventArgs.shift);
            }
        }

        return true;
    },
    _targetCellTabHandler: function(eventArgs, direction) {
        var $event = eventArgs.originalEvent,
            eventTarget = $event.target,
            $cell = this._getCellElementFromTarget(eventTarget),
            $lastInteractiveElement = this._getInteractiveElement($cell, !eventArgs.shift),
            isOriginalHandlerRequired = false,
            elementType;

        if($lastInteractiveElement.length && eventTarget !== $lastInteractiveElement.get(0)) {
            isOriginalHandlerRequired = true;
        } else {
            if(this._focusedCellPosition.rowIndex === undefined && $(eventTarget).hasClass(ROW_CLASS)) {
                this._updateFocusedCellPosition($(eventTarget).children().first());
            }

            elementType = this._getElementType(eventTarget);
            if(this.isRowFocusType()) {
                this.setCellFocusType();
                if(elementType === "row" && isDataRow($(eventTarget))) {
                    eventTarget = this.getFirstValidCellInRow($(eventTarget));
                    elementType = this._getElementType(eventTarget);
                }
            }

            $cell = this._getNextCellByTabKey($event, direction, elementType);
            if(!$cell) {
                return false;
            }

            $cell = this._checkNewLineTransition($event, $cell);
            if(!$cell) {
                return false;
            }

            this._focusCell($cell);
            this._focusInteractiveElement($cell, eventArgs.shift);
        }

        return isOriginalHandlerRequired;
    },
    _getNextCellByTabKey: function($event, direction, elementType) {
        var $cell = this._getNextCell(direction, elementType),
            args = this._fireFocusedCellChanging($event, $cell, true);
        if(args.cancel) {
            return;
        }
        if(args.$newCellElement) {
            $cell = args.$newCellElement;
        }
        return $cell;
    },
    _checkNewLineTransition: function($event, $cell) {
        var rowIndex = this.getVisibleRowIndex(),
            $row = $cell.parent();

        if(rowIndex !== this._getRowIndex($row)) {
            var cellPosition = this._getCellPosition($cell),
                args = this._fireFocusedRowChanging($event, $row);
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

    getFirstValidCellInRow: function($row, columnIndex) {
        var that = this,
            $cells = $row.find("> td"),
            $cell,
            $result;

        columnIndex = columnIndex || 0;

        for(var i = columnIndex; i < $cells.length; ++i) {
            $cell = $cells.eq(i);
            if(that._isCellValid($cell)) {
                $result = $cell;
                break;
            }
        }

        return $result;
    },

    _focusCell: function($cell) {
        if(this._isCellValid($cell)) {
            this._focus($cell);
            return true;
        }
    },

    _getElementType: function(target) {
        return $(target).is("tr") ? "row" : "cell";
    },

    _focusEditFormCell: function($cell) {
        if($cell.hasClass(MASTER_DETAIL_CELL_CLASS)) {
            this.getController("editorFactory").focus($cell, true);
        }
    },

    _escapeKeyHandler: function(eventArgs, isEditing) {
        var $cell = this._getCellElementFromTarget(eventArgs.originalEvent.target);
        if(isEditing) {
            this._updateFocusedCellPosition($cell);
            if(!this._isRowEditMode()) {
                if(this._editingController.getEditMode() === "cell") {
                    this._editingController.cancelEditData();
                } else {
                    this._editingController.closeEditCell();
                }
            } else {
                this._focusEditFormCell($cell);
                this._editingController.cancelEditData();
            }
            eventArgs.originalEvent.preventDefault();
        }
    },

    _ctrlFKeyHandler: function(eventArgs) {
        if(eventArgs.ctrl && this.option("searchPanel") && this.option("searchPanel").visible) {
            ///#DEBUG
            this._testHeaderPanelFocused = true;
            ///#ENDDEBUG
            this._headerPanel.focus();
            eventArgs.originalEvent.preventDefault();
        }
    },

    _keyDownHandler: function(e) {
        var isEditing = this._editingController.isEditing(),
            needStopPropagation = true,
            originalEvent = e.originalEvent,
            args = {
                handled: false,
                event: originalEvent
            };

        this.executeAction("onKeyDown", args);

        if(originalEvent.isDefaultPrevented()) {
            return;
        }

        this._isNeedFocus = true;
        this._isNeedScroll = true;

        this._updateFocusedCellPosition(this._getCellElementFromTarget(args.event.target));

        if(!args.handled) {
            switch(e.keyName) {
                case "leftArrow":
                case "rightArrow":
                    this._leftRightKeysHandler(e, isEditing);
                    break;
                case "upArrow":
                case "downArrow":
                    this._upDownKeysHandler(e, isEditing);
                    break;
                case "pageUp":
                case "pageDown":
                    this._pageUpDownKeyHandler(e);
                    break;
                case "space":
                    this._spaceKeyHandler(e, isEditing);
                    break;
                case "A":
                    this._ctrlAKeyHandler(e, isEditing);
                    break;
                case "tab":
                    this._tabKeyHandler(e, isEditing);
                    break;
                case "enter":
                    this._enterKeyHandler(e, isEditing);
                    break;
                case "escape":
                    this._escapeKeyHandler(e, isEditing);
                    break;
                case "F":
                    this._ctrlFKeyHandler(e);
                    break;
                default:
                    this._isNeedFocus = false;
                    this._isNeedScroll = false;
                    needStopPropagation = false;
                    break;
            }

            if(needStopPropagation) {
                originalEvent.stopPropagation();
            }
        }
    },

    _isLastRow: function(rowIndex) {
        if(this._isVirtualScrolling()) {
            return rowIndex >= this._dataController.totalItemsCount() - 1;
        }
        return rowIndex === this.getController("data").items().length - 1;
    },

    _getNextCell: function(keyCode, elementType, cellPosition) {
        var focusedCellPosition = cellPosition || this._focusedCellPosition,
            isRowFocusType = this.isRowFocusType(),
            includeCommandCells = isRowFocusType || inArray(keyCode, ["next", "previous"]) > -1,
            rowIndex,
            newFocusedCellPosition,
            isLastCellOnDirection = keyCode === "previous" ? this._isFirstValidCell(focusedCellPosition) : this._isLastValidCell(focusedCellPosition),
            $cell,
            $row;

        if(this._focusedView && focusedCellPosition) {
            newFocusedCellPosition = this._getNewPositionByCode(focusedCellPosition, elementType, keyCode);
            $cell = this._getCell(newFocusedCellPosition);

            if($cell && !this._isCellValid($cell) && this._isCellInRow(newFocusedCellPosition, includeCommandCells) && !isLastCellOnDirection) {
                if(isRowFocusType) {
                    $cell = this.getFirstValidCellInRow($cell.parent(), newFocusedCellPosition.columnIndex);
                } else {
                    $cell = this._getNextCell(keyCode, "cell", newFocusedCellPosition);
                }
            }

            $row = $cell && $cell.parent();
            if(this._hasSkipRow($row)) {
                rowIndex = this._getRowIndex($row);
                if(!this._isLastRow(rowIndex)) {
                    $cell = this._getNextCell(keyCode, "row", { columnIndex: focusedCellPosition.columnIndex, rowIndex: rowIndex });
                } else {
                    return null;
                }
            }

            return $cell;
        }
        return null;
    },

    _getNewPositionByCode: function(cellPosition, elementType, code) {
        var columnIndex = cellPosition.columnIndex,
            rowIndex = cellPosition.rowIndex,
            visibleColumnsCount;

        if(cellPosition.rowIndex === undefined && code === "next") {
            return { columnIndex: 0, rowIndex: 0 };
        }

        switch(code) {
            case "nextInRow":
            case "next":
                visibleColumnsCount = this._getVisibleColumnCount();
                if(columnIndex < visibleColumnsCount - 1 && !this._isLastValidCell({ columnIndex: columnIndex, rowIndex: rowIndex }) && elementType !== "row") {
                    columnIndex++;
                } else if(!this._isLastRow(rowIndex) && code === "next") {
                    columnIndex = 0;
                    rowIndex++;
                }
                break;
            case "previousInRow":
            case "previous":
                if(columnIndex > 0 && !this._isFirstValidCell({ columnIndex: columnIndex, rowIndex: rowIndex }) && elementType !== "row") {
                    columnIndex--;
                } else if(rowIndex > 0 && code === "previous") {
                    rowIndex--;
                    visibleColumnsCount = this._getVisibleColumnCount();
                    columnIndex = visibleColumnsCount - 1;
                }
                break;
            case "upArrow":
                rowIndex = rowIndex > 0 ? rowIndex - 1 : rowIndex;
                break;
            case "downArrow":
                rowIndex = !this._isLastRow(rowIndex) ? rowIndex + 1 : rowIndex;
                break;
        }

        return { columnIndex: columnIndex, rowIndex: rowIndex };
    },

    _isFirstValidCell: function(cellPosition) {
        var isFirstValidCell = false;

        if(cellPosition.rowIndex === 0 && cellPosition.columnIndex >= 0) {
            isFirstValidCell = isFirstValidCell || !this._haveValidCellBeforePosition(cellPosition);
        }

        return isFirstValidCell;
    },

    _haveValidCellBeforePosition: function(cellPosition) {
        var columnIndex = cellPosition.columnIndex,
            hasValidCells = false;

        while(columnIndex > 0 && !hasValidCells) {
            var checkingPosition = { columnIndex: --columnIndex, rowIndex: cellPosition.rowIndex };

            hasValidCells = this._isCellByPositionValid(checkingPosition);
        }
        return hasValidCells;
    },

    _isLastValidCell: function(cellPosition) {
        var nextColumnIndex = cellPosition.columnIndex >= 0 ? cellPosition.columnIndex + 1 : 0,
            checkingPosition = {
                columnIndex: nextColumnIndex,
                rowIndex: cellPosition.rowIndex
            },
            visibleColumnsCount = this._getVisibleColumnCount(),
            isCheckingCellValid = this._isCellByPositionValid(checkingPosition);

        if(!this._isLastRow(cellPosition.rowIndex)) {
            return false;
        }

        if(cellPosition.columnIndex === visibleColumnsCount - 1) {
            return true;
        }

        if(isCheckingCellValid) {
            return false;
        }

        return this._isLastValidCell(checkingPosition);
    },

    _getVisibleColumnCount: function() {
        return this.getController("columns").getVisibleColumns().length;
    },

    _isCellInRow: function(cellPosition, includeCommandCells) {
        var columnIndex = cellPosition.columnIndex,
            visibleColumnsCount = this._getVisibleColumnCount();

        return includeCommandCells ? columnIndex >= 0 && columnIndex <= visibleColumnsCount - 1 : columnIndex > 0 && columnIndex < visibleColumnsCount - 1;
    },

    _resetFocusedCell: function() {
        var that = this,
            $cell = that._getFocusedCell();

        $cell && $cell.removeAttr("tabIndex");

        that._focusedView && that._focusedView.renderFocusState && that._focusedView.renderFocusState();

        that._isNeedFocus = false;
        that._isNeedScroll = false;
        that._focusedCellPosition = {};
    },

    _getCellElementFromTarget: function(target) {
        return $(target).closest("." + ROW_CLASS + "> td");
    },

    init: function() {
        var that = this;
        if(that.option("useKeyboard")) {
            that._dataController = that.getController("data");
            that._selectionController = that.getController("selection");
            that._editingController = that.getController("editing");
            that._headerPanel = that.getView("headerPanel");
            that._columnsController = that.getController("columns");
            that.getController("editorFactory").focused.add(function($element) {
                that.setupFocusedView();

                if(that._isNeedScroll) {
                    if($element.is(":visible") && that._focusedView && that._focusedView.getScrollable) {
                        that._scrollToElement($element);
                        that._isNeedScroll = false;
                    }
                }
            });

            that._focusedCellPosition = {};

            that._initFocusedViews();

            that._documentClickHandler = that.createAction(function(e) {
                var $target = $(e.event.target),
                    isCurrentRowsViewClick = that._isEventInCurrentGrid(e.event) && $target.closest("." + that.addWidgetPrefix(ROWS_VIEW_CLASS)).length,
                    isEditorOverlay = $target.closest("." + DROPDOWN_EDITOR_OVERLAY_CLASS).length;
                if(!isCurrentRowsViewClick && !isEditorOverlay) {
                    that._resetFocusedCell();
                }
            });

            that.createAction("onKeyDown");

            eventsEngine.on(domAdapter.getDocument(), eventUtils.addNamespace(pointerEvents.down, "dxDataGridKeyboardNavigation"), that._documentClickHandler);
        }
    },

    _scrollToElement: function($element, offset) {
        var scrollable = this._focusedView.getScrollable();
        scrollable && scrollable.update();
        scrollable && scrollable.scrollToElement($element, offset);
    },

    /**
    * @name GridBaseMethods.focus
    * @publicName focus(element)
    * @param1 element:Node|jQuery
    */
    focus: function(element) {
        var activeElementSelector,
            focusedRowEnabled = this.option("focusedRowEnabled"),
            isHighlighted = isCellElement($(element));

        if(!element) {
            activeElementSelector = focusedRowEnabled ? ".dx-row[tabindex]" : ".dx-row[tabIndex], .dx-row > td[tabindex]";
            element = this.component.$element().find(activeElementSelector).first();
        }

        element && this._focusElement($(element), isHighlighted);
    },

    _focusElement: function($element, isHighlighted) {
        var focusView = this._getFocusedViewByElement($element),
            isRowFocusType = this.isRowFocusType(),
            args = { };

        if(!focusView || isCellElement($element) && !this._isCellValid($element)) {
            return;
        }

        this._focusView(focusView.view, focusView.viewIndex);
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

        this._focus($element, !args.isHighlighted);
        this._focusInteractiveElement($element);
    },

    getFocusedView: function() {
        return this._focusedView;
    },

    _getFocusedViewByElement: function($element) {
        var condition = function(view) {
            return $element.closest(view._$element).length;
        };

        return this._getFocusedViewByCondition(condition);
    },

    _getFocusedViewByCondition: function(conditionFunction) {
        var focusView;

        each(this._focusedViews, function(index, view) {
            if(conditionFunction(view)) {
                focusView = {
                    viewIndex: index,
                    view: view
                };
                return false;
            }
        });

        return focusView;
    },

    isRowFocusType: function() {
        return this.focusType === FOCUS_TYPE_ROW;
    },

    isCellFocusType: function() {
        return this.focusType === FOCUS_TYPE_CELL;
    },

    setRowFocusType: function() {
        if(this.option("focusedRowEnabled")) {
            this.focusType = FOCUS_TYPE_ROW;
        }
    },

    setCellFocusType: function() {
        this.focusType = FOCUS_TYPE_CELL;
    },

    focusViewByName: function(viewName) {
        var view = this._getFocusedViewByName(viewName);

        this._focusView(view.view, view.viewIndex);
    },

    setupFocusedView: function() {
        if(this.option("useKeyboard") && !isDefined(this._focusedView)) {
            this.focusViewByName("rowsView");
        }
    },

    _getFocusedViewByName: function(viewName) {
        var condition = function(view) {
            return view.name === viewName;
        };

        return this._getFocusedViewByCondition(condition);
    },

    optionChanged: function(args) {
        var that = this;

        switch(args.name) {
            case "useKeyboard":
                args.handled = true;
                break;
            default:
                that.callBase(args);
        }
    },

    dispose: function() {
        this.callBase();
        this._focusedView = null;
        this._focusedViews = null;
        this._keyDownProcessor && this._keyDownProcessor.dispose();
        eventsEngine.off(domAdapter.getDocument(), eventUtils.addNamespace(pointerEvents.down, "dxDataGridKeyboardNavigation"), this._documentClickHandler);
    },

    _fireFocusedCellChanging: function($event, $cellElement, isHighlighted) {
        var that = this,
            prevCellIndex = that.option("focusedColumnIndex"),
            prevRowIndex = that.option("focusedRowIndex"),
            cellPosition = that._getCellPosition($cellElement),
            columnIndex = cellPosition ? cellPosition.columnIndex : -1,
            rowIndex = cellPosition ? cellPosition.rowIndex : -1,
            args = {
                cellElement: $cellElement,
                prevColumnIndex: prevCellIndex,
                prevRowIndex: prevRowIndex,
                newColumnIndex: columnIndex,
                newRowIndex: rowIndex,
                rows: that.getController("data").getVisibleRows(),
                columns: that.getController("columns").getVisibleColumns(),
                event: $event,
                isHighlighted: isHighlighted || false,
                cancel: false
            };

        that.executeAction("onFocusedCellChanging", args);
        if(args.newColumnIndex !== columnIndex || args.newRowIndex !== rowIndex) {
            args.$newCellElement = this._getCell({ columnIndex: args.newColumnIndex, rowIndex: args.newRowIndex });
        }

        return args;
    },

    _fireFocusedCellChanged: function($cellElement, prevCellIndex, prevRowIndex) {
        var that = this,
            columnIndex = that.option("focusedColumnIndex"),
            dataController,
            row,
            focusedRowIndex = that.option("focusedRowIndex");

        if(prevCellIndex !== columnIndex || prevRowIndex !== focusedRowIndex) {
            dataController = that.getController("data");
            row = dataController.getVisibleRows()[focusedRowIndex - dataController.getRowIndexOffset()];
            that.executeAction("onFocusedCellChanged", {
                cellElement: $cellElement,
                columnIndex: columnIndex,
                rowIndex: focusedRowIndex,
                row: row,
                column: that.getController("columns").getVisibleColumns()[columnIndex]
            });
        }
    },

    _fireFocusedRowChanging: function(eventArgs, $newFocusedRow) {
        var newRowIndex = this._getRowIndex($newFocusedRow),
            dataController = this.getController("data"),
            prevFocusedRowIndex = this.getVisibleRowIndex(),
            args = {
                rowElement: $newFocusedRow,
                prevRowIndex: prevFocusedRowIndex,
                newRowIndex: newRowIndex,
                event: eventArgs,
                rows: this.getController("data").getVisibleRows(),
                cancel: false
            };

        if(!dataController || dataController.isLoading()) {
            args.cancel = true;
            return args;
        }
        if(this.option("focusedRowEnabled")) {
            this.executeAction("onFocusedRowChanging", args);
            if(!args.cancel && args.newRowIndex !== newRowIndex) {
                this.setFocusedRowIndex(args.newRowIndex);
                args.rowIndexChanged = true;
            }
        }

        return args;
    },

    _fireFocusedRowChanged: function($rowElement) {
        var row,
            dataController,
            focusedRowIndex = this.option("focusedRowIndex");

        if(this.option("focusedRowEnabled")) {
            if(focusedRowIndex >= 0) {
                dataController = this.getController("data");
                row = focusedRowIndex >= 0 && dataController.getVisibleRows()[focusedRowIndex - dataController.getRowIndexOffset()];
            }
            this.executeAction("onFocusedRowChanged", {
                rowElement: $rowElement,
                rowIndex: focusedRowIndex,
                row: row
            });
        }
    }
});

/**
* @name GridBaseMethods.registerKeyHandler
* @publicName registerKeyHandler(key, handler)
* @hidden
* @inheritdoc
*/

module.exports = {
    defaultOptions: function() {
        return {
            useKeyboard: true
            /**
             * @name GridBaseOptions.onKeyDown
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
             * @type_function_param1_field5 event:event
             * @type_function_param1_field6 handled:boolean
             * @extends Action
             * @action
             */

            /**
             * @name dxDataGridOptions.onFocusedCellChanging
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 cellElement:dxElement
             * @type_function_param1_field5 prevColumnIndex:number
             * @type_function_param1_field6 prevRowIndex:number
             * @type_function_param1_field7 newColumnIndex:number
             * @type_function_param1_field8 newRowIndex:number
             * @type_function_param1_field9 event:event
             * @type_function_param1_field10 rows:Array<dxDataGridRowObject>
             * @type_function_param1_field11 columns:Array<dxDataGridColumn>
             * @type_function_param1_field12 cancel:boolean
             * @type_function_param1_field13 isHighlighted:boolean
             * @extends Action
             * @action
             */
            /**
             * @name dxTreeListOptions.onFocusedCellChanging
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 cellElement:dxElement
             * @type_function_param1_field5 prevColumnIndex:number
             * @type_function_param1_field6 prevRowIndex:number
             * @type_function_param1_field7 newColumnIndex:number
             * @type_function_param1_field8 newRowIndex:number
             * @type_function_param1_field9 event:event
             * @type_function_param1_field10 rows:Array<dxTreeListRowObject>
             * @type_function_param1_field11 columns:Array<dxTreeListColumn>
             * @type_function_param1_field12 cancel:boolean
             * @type_function_param1_field13 isHighlighted:boolean
             * @extends Action
             * @action
             */

            /**
             * @name dxDataGridOptions.onFocusedCellChanged
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 cellElement:dxElement
             * @type_function_param1_field5 columnIndex:number
             * @type_function_param1_field6 rowIndex:number
             * @type_function_param1_field7 row:dxDataGridRowObject
             * @type_function_param1_field8 column:dxDataGridColumn
             * @extends Action
             * @action
             */
            /**
             * @name dxTreeListOptions.onFocusedCellChanged
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 cellElement:dxElement
             * @type_function_param1_field5 columnIndex:number
             * @type_function_param1_field6 rowIndex:number
             * @type_function_param1_field7 row:dxTreeListRowObject
             * @type_function_param1_field8 column:dxTreeListColumn
             * @extends Action
             * @action
             */

            /**
             * @name dxDataGridOptions.onFocusedRowChanging
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 rowElement:dxElement
             * @type_function_param1_field5 prevRowIndex:number
             * @type_function_param1_field6 newRowIndex:number
             * @type_function_param1_field7 event:event
             * @type_function_param1_field8 rows:Array<dxDataGridRowObject>
             * @type_function_param1_field9 cancel:boolean
             * @extends Action
             * @action
             */
            /**
             * @name dxTreeListOptions.onFocusedRowChanging
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 rowElement:dxElement
             * @type_function_param1_field5 prevRowIndex:number
             * @type_function_param1_field6 newRowIndex:number
             * @type_function_param1_field7 event:event
             * @type_function_param1_field8 rows:Array<dxTreeListRowObject>
             * @type_function_param1_field9 cancel:boolean
             * @extends Action
             * @action
             */

            /**
             * @name dxDataGridOptions.onFocusedRowChanged
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 rowElement:dxElement
             * @type_function_param1_field5 rowIndex:number
             * @type_function_param1_field6 row:dxDataGridRowObject
             * @extends Action
             * @action
             */
            /**
             * @name dxTreeListOptions.onFocusedRowChanged
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 rowElement:dxElement
             * @type_function_param1_field5 rowIndex:number
             * @type_function_param1_field6 row:dxTreeListRowObject
             * @extends Action
             * @action
             */
        };
    },
    controllers: {
        keyboardNavigation: KeyboardNavigationController
    },
    extenders: {
        views: {
            rowsView: {
                renderFocusState: function() {
                    var dataController = this._dataController,
                        rowIndex = this.option("focusedRowIndex") || 0,
                        $element = this.element(),
                        cellElements;

                    if($element && !focused($element)) {
                        $element.attr("tabIndex", null);
                    }

                    if(rowIndex < 0 || rowIndex >= dataController.getVisibleRows().length) {
                        rowIndex = 0;
                    }

                    cellElements = this.getCellElements(rowIndex);

                    if(this.option("useKeyboard") && cellElements) {
                        this.updateFocusElementTabIndex(cellElements);
                    }
                },
                updateFocusElementTabIndex: function(cellElements) {
                    var that = this,
                        $row = cellElements.eq(0).parent(),
                        columnIndex = that.option("focusedColumnIndex"),
                        tabIndex = that.option("tabIndex");

                    if(!columnIndex || columnIndex < 0) {
                        columnIndex = 0;
                    }

                    if(isGroupRow($row)) {
                        $row.attr("tabIndex", tabIndex);
                    } else {
                        that._updateFocusedCellTabIndex(cellElements, columnIndex);
                    }
                },
                _updateFocusedCellTabIndex: function(cellElements, columnIndex) {
                    var that = this,
                        $cell,
                        tabIndex = that.option("tabIndex"),
                        keyboardNavigation = that.getController("keyboardNavigation"),
                        oldFocusedView = keyboardNavigation._focusedView,
                        cellElementsLength = cellElements ? cellElements.length : -1;

                    keyboardNavigation._focusedView = that;

                    if(cellElementsLength > 0) {
                        if(cellElementsLength <= columnIndex) {
                            columnIndex = cellElementsLength - 1;
                        }
                        for(var i = columnIndex; i < cellElementsLength; ++i) {
                            $cell = $(cellElements[i]);
                            if(!keyboardNavigation._isMasterDetailCell($cell)) {
                                if(keyboardNavigation._isCellValid($cell) && isCellElement($cell)) {
                                    $cell.attr("tabIndex", tabIndex);
                                    keyboardNavigation.setCellFocusType();
                                    break;
                                }
                            }
                        }
                    }

                    keyboardNavigation._focusedView = oldFocusedView;
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
                }
            }
        },
        controllers: {
            editing: {
                editCell: function(rowIndex, columnIndex) {
                    var isCellEditing = this.callBase(rowIndex, columnIndex),
                        keyboardNavigationController = this.getController("keyboardNavigation");

                    if(isCellEditing) {
                        keyboardNavigationController.setupFocusedView();
                    }

                    return isCellEditing;
                },
                editRow: function(rowIndex) {
                    if(this.option("editing.mode") === EDIT_MODE_FORM) {
                        this._keyboardNavigationController._resetFocusedCell();
                    }
                    this.callBase(rowIndex);
                },
                addRow: function(parentKey) {
                    this.getController("keyboardNavigation").setupFocusedView();

                    this.callBase.apply(this, arguments);
                },
                getFocusedCellInRow: function(rowIndex) {
                    var keyboardNavigationController = this.getController("keyboardNavigation"),
                        $cell = this.callBase(rowIndex);

                    if(this.option("useKeyboard") && keyboardNavigationController._focusedCellPosition.rowIndex === rowIndex) {
                        $cell = keyboardNavigationController._getFocusedCell() || $cell;
                    }

                    return $cell;
                },
                _processCanceledEditingCell: function() {
                    this.closeEditCell().done(() => {
                        let keyboardNavigation = this.getController("keyboardNavigation");
                        keyboardNavigation._updateFocus(true);
                    });
                },
                init: function() {
                    this.callBase();
                    this._keyboardNavigationController = this.getController("keyboardNavigation");
                }
            },
            data: {
                _correctRowIndices: function(getRowIndexCorrection) {
                    var that = this,
                        keyboardNavigationController = that.getController("keyboardNavigation"),
                        editorFactory = that.getController("editorFactory"),
                        focusedCellPosition = keyboardNavigationController._focusedCellPosition;

                    that.callBase.apply(that, arguments);

                    if(focusedCellPosition && focusedCellPosition.rowIndex >= 0) {
                        var focusedRowIndexCorrection = getRowIndexCorrection(focusedCellPosition.rowIndex);
                        if(focusedRowIndexCorrection) {
                            focusedCellPosition.rowIndex += focusedRowIndexCorrection;
                            editorFactory.focus(editorFactory.focus());
                        }
                    }
                }
            }
        }
    }
};
