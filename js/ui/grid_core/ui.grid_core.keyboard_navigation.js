"use strict";

var $ = require("../../core/renderer"),
    domAdapter = require("../../core/dom_adapter"),
    eventsEngine = require("../../events/core/events_engine"),
    core = require("./ui.grid_core.modules"),
    isDefined = require("../../core/utils/type").isDefined,
    inArray = require("../../core/utils/array").inArray,
    focused = require("../widget/selectors").focused,
    each = require("../../core/utils/iterator").each,
    KeyboardProcessor = require("../widget/ui.keyboard_processor"),
    eventUtils = require("../../events/utils"),
    pointerEvents = require("../../events/pointer");

var ROWS_VIEW_CLASS = "rowsview",
    EDIT_FORM_CLASS = "edit-form",
    GROUP_FOOTER_CLASS = "group-footer",
    ROW_CLASS = "dx-row",
    DATA_ROW_CLASS = "dx-data-row",
    GROUP_ROW_CLASS = "dx-group-row",
    EDIT_FORM_ITEM_CLASS = "edit-form-item",
    MASTER_DETAIL_ROW_CLASS = "dx-master-detail-row",
    FREESPACE_ROW_CLASS = "dx-freespace-row",
    MASTER_DETAIL_CELL_CLASS = "dx-master-detail-cell",
    DROPDOWN_EDITOR_OVERLAY_CLASS = "dx-dropdowneditor-overlay",
    COMMAND_EXPAND_CLASS = "dx-command-expand",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",

    INTERACTIVE_ELEMENTS_SELECTOR = "input:not([type='hidden']), textarea, a, [tabindex]",

    VIEWS = ["rowsView"],

    EDIT_MODE_ROW = "row",
    EDIT_MODE_FORM = "form",
    EDIT_MODE_BATCH = "batch",
    EDIT_MODE_CELL = "cell";

function isGroupRow($row) {
    return $row && $row.hasClass(GROUP_ROW_CLASS);
}

function isDetailRow($row) {
    return $row && $row.hasClass(MASTER_DETAIL_ROW_CLASS);
}

function isFreeSpaceRow($row) {
    return $row && $row.hasClass(FREESPACE_ROW_CLASS);
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

    _updateFocus: function() {
        var that = this,
            $cell = that._getFocusedCell();

        if($cell && !(that._isMasterDetailCell($cell) && !that._isRowEditMode())) {
            if(that._hasSkipRow($cell.parent())) {
                $cell = that._getNextCell(this._focusedCellPosition && this._focusedCellPosition.rowIndex > 0 ? "upArrow" : "downArrow");
            }
            if($cell && $cell.length > 0) {
                setTimeout(function() {
                    if($cell.is("td") || $cell.hasClass(that.addWidgetPrefix(EDIT_FORM_ITEM_CLASS))) {
                        if(that.getController("editorFactory").focus()) {
                            that._focus($cell);
                        } else if(that._isHiddenFocus) {
                            that._focus($cell, true);
                        }
                        if(that._editingController.isEditing()) {
                            that._focusInteractiveElement.bind(that)($cell);
                        }
                    } else {
                        eventsEngine.trigger($cell, "focus");
                    }
                });
            }
        }
    },

    _applyTabIndexToElement: function($element) {
        var tabIndex = this.option("tabIndex");
        $element.attr("tabIndex", isDefined(tabIndex) ? tabIndex : 0);
    },

    _clickHandler: function(e) {
        var event = e.event,
            $target = $(event.currentTarget),
            $grid = $(event.target).closest("." + this.getWidgetContainerClass()).parent(),
            data = event.data;

        if($grid.is(this.component.$element()) && this._isCellValid($target)) {
            $target = this._isInsideEditForm($target) ? $(event.target) : $target;
            this._focusView(data.view, data.viewIndex);
            this._updateFocusedCellPosition($target);
            if(!this._editingController.isEditing() && !this._isCellEditMode() && !this._isMasterDetailCell($target)) {
                this._focus($target, true);
            }
        } else if($target.is("td")) {
            this._resetFocusedCell();
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
                view.renderCompleted.add(function() {
                    var $element = view.element();
                    eventsEngine.off($element, eventUtils.addNamespace(pointerEvents.down, "dxDataGridKeyboardNavigation"), clickAction);
                    eventsEngine.on($element, eventUtils.addNamespace(pointerEvents.down, "dxDataGridKeyboardNavigation"), "." + ROW_CLASS + " > td, ." + ROW_CLASS, {
                        viewIndex: index,
                        view: view
                    }, clickAction);

                    that._initKeyDownProcessor(that, $element, that._keyDownHandler);

                    if(that._focusedView && that._focusedView.name === view.name && (that._isNeedFocus || that._isHiddenFocus)) {
                        that._updateFocus();
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

            this._focusedCellPosition = {
                columnIndex: columnIndex,
                rowIndex: rowIndex
            };
        }
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
                visibleColumns = this._columnsController.getVisibleColumns(),
                visibleRowIndex = rowsView.getRowIndex($cell.parent()),
                columnIndex = rowsView.getCellIndex($cell),
                column = visibleColumns[columnIndex],
                visibleColumnCount = this._getVisibleColumnCount(),
                editingController = this._editingController,
                editMode = editingController && editingController.getEditMode(),
                isEditingCurrentRow = editingController && (editMode === EDIT_MODE_ROW ? editingController.isEditRow(visibleRowIndex) : editingController.isEditing()),
                isMasterDetailRow = isDetailRow($cell.parent()),
                isValidGroupSpaceColumn = function() {
                    return !isMasterDetailRow && column && !isDefined(column.groupIndex) || parseInt($cell.attr("colspan")) > 1;
                };

            if(this._isMasterDetailCell($cell)) {
                return true;
            }

            if(visibleColumnCount > columnIndex && isValidGroupSpaceColumn()) {
                var isExpandColumn = column.command === "expand";

                return (column && !column.command && (!isEditingCurrentRow || column.allowEditing)) || !isEditingCurrentRow && isExpandColumn;
            }
        }
    },

    _isCellByPositionValid: function(cellPosition) {
        var $cell = this._getCell(cellPosition);

        return this._isCellValid($cell);
    },

    _focus: function($cell, disableFocus) {
        var $row = $cell.parent();

        if(isFreeSpaceRow($row)) {
            return;
        }

        var $focusedCell = this._getFocusedCell(),
            focusedView = this._focusedView,
            $focusViewElement = focusedView && focusedView.element(),
            $focusElement;

        $focusedCell && $focusedCell.is("td") && $focusedCell.removeAttr("tabIndex");

        this._isHiddenFocus = disableFocus;

        if(isGroupRow($row)) {
            $focusElement = $row;
            if(focusedView) {
                this._focusedCellPosition.rowIndex = this._getRowIndex($row);
            }
        } else if(isCellElement($cell)) {
            $focusElement = $cell;
            this._updateFocusedCellPosition($cell);
        }

        if($focusElement) {
            this._applyTabIndexToElement($focusElement);
            eventsEngine.trigger($focusElement, "focus");
        }
        if(disableFocus) {
            $focusViewElement && $focusViewElement.find("." + CELL_FOCUS_DISABLED_CLASS + "[tabIndex]").removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr("tabIndex");
            $focusElement.addClass(CELL_FOCUS_DISABLED_CLASS);
        } else {
            $focusViewElement && $focusViewElement.find("." + CELL_FOCUS_DISABLED_CLASS + ":not(." + MASTER_DETAIL_CELL_CLASS + ")").removeClass(CELL_FOCUS_DISABLED_CLASS);
            this.getController("editorFactory").focus($focusElement);
        }
    },

    _hasSkipRow: function($row) {
        var row = $row && $row.get(0);
        return row && (row.style.display === "none" || $row.hasClass(this.addWidgetPrefix(GROUP_FOOTER_CLASS)) || (isDetailRow($row) && !$row.hasClass(this.addWidgetPrefix(EDIT_FORM_CLASS))));
    },

    _enterKeyHandler: function(eventArgs, isEditing) {
        var $cell = this._getFocusedCell(),
            editingOptions = this.option("editing"),
            rowIndex = this._getFocusedRowIndex(),
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
                    eventsEngine.trigger($target, "focus");
                    this._editingController.closeEditCell();
                    eventArgs.originalEvent.preventDefault();
                }
            } else {
                var column = this._columnsController.getVisibleColumns()[this._focusedCellPosition.columnIndex];

                if(editingOptions.allowUpdating && column && column.allowEditing) {
                    if(this._isRowEditMode()) {
                        this._editingController.editRow(rowIndex);
                    } else {
                        this._focusedCellPosition && this._editingController.editCell(rowIndex, this._focusedCellPosition.columnIndex);
                    }
                }
            }
        }
    },

    _getFocusedRowIndex: function() {
        if(this._focusedCellPosition) {
            return this._focusedCellPosition.rowIndex - this._dataController.getRowIndexOffset();
        }

        return null;
    },

    _leftRightKeysHandler: function(eventArgs, isEditing) {
        var rowIndex = this._getFocusedRowIndex(),
            $row = this._focusedView && this._focusedView.getRow(rowIndex),
            directionCode,
            $cell;

        if(!isEditing && $row && !isGroupRow($row) && !isDetailRow($row)) {
            directionCode = this._getDirectionCodeByKey(eventArgs.key);
            $cell = this._getNextCell(directionCode);
            if($cell && this._isCellValid($cell)) {
                this._focus($cell);
            }
            eventArgs.originalEvent.preventDefault();
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
        var rowIndex = this._getFocusedRowIndex(),
            $row = this._focusedView && this._focusedView.getRow(rowIndex),
            $cell;

        if(!isEditing && $row && !isDetailRow($row)) {
            $cell = this._getNextCell(eventArgs.key);
            if($cell && this._isCellValid($cell)) {
                this._focus($cell);
            }
            eventArgs.originalEvent.preventDefault();
        }
    },

    _isVirtualScrolling: function() {
        var scrollingMode = this.option("scrolling.mode");
        return scrollingMode === "virtual" || scrollingMode === "infinite";
    },

    _scrollBy: function(top) {
        var that = this,
            scrollable = this.getView("rowsView").getScrollable();

        if(that._focusedCellPosition) {
            var scrollHandler = function() {
                scrollable.off(scrollHandler);
                setTimeout(function() {
                    var columnIndex = that._focusedCellPosition.columnIndex;
                    var rowIndex = that.getView("rowsView").getTopVisibleItemIndex() + that._dataController.getRowIndexOffset();
                    that.getController("editorFactory").loseFocus();

                    var $rowsView = that.getView("rowsView").element();
                    that._applyTabIndexToElement($rowsView);
                    eventsEngine.trigger($rowsView, "focus");

                    that._focusedCellPosition.rowIndex = rowIndex;
                    that._focusedCellPosition.columnIndex = columnIndex;
                });
            };
            scrollable.on("scroll", scrollHandler);
        }
        scrollable.scrollBy({ left: 0, top: top });
    },

    _pageUpDownKeyHandler: function(eventArgs) {
        var pageIndex = this._dataController.pageIndex(),
            pageCount = this._dataController.pageCount(),
            pagingEnabled = this.option("paging.enabled"),
            isPageUp = eventArgs.key === "pageUp",
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
        var rowIndex = this._getFocusedRowIndex(),
            $target = $(eventArgs.originalEvent && eventArgs.originalEvent.target);

        if(this.option("selection") && this.option("selection").mode !== "none" && !isEditing && ($target.parent().hasClass(DATA_ROW_CLASS) || $target.hasClass(this.addWidgetPrefix(ROWS_VIEW_CLASS)))) {
            this._selectionController.changeItemSelection(rowIndex, {
                shift: eventArgs.shift,
                control: eventArgs.ctrl
            });
            eventArgs.originalEvent.preventDefault();
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
            eventTarget = eventArgs.originalEvent.target,
            $cell;

        if(this._handleTabKeyOnMasterDetailCell(eventTarget, direction)) {
            return;
        }

        if(editingOptions && eventTarget && !isOriginalHandlerRequired) {
            if($(eventTarget).hasClass(this.addWidgetPrefix(ROWS_VIEW_CLASS))) {
                this._resetFocusedCell();
            }
            if(isEditing) {
                var column,
                    row,
                    isEditingAllowed;

                this._updateFocusedCellPosition(this._getCellElementFromTarget(eventTarget));
                $cell = this._getNextCell(direction);

                if(!$cell || this._handleTabKeyOnMasterDetailCell($cell, direction)) {
                    return;
                }

                column = this._columnsController.getVisibleColumns()[this.getView("rowsView").getCellIndex($cell)];
                row = this._dataController.items()[this._getRowIndex($cell && $cell.parent())];

                isEditingAllowed = (editingOptions.allowUpdating || row && row.inserted) && column.allowEditing;

                if(!isEditingAllowed) {
                    this._editingController.closeEditCell();
                }

                if(this._focusCell($cell)) {
                    if(!this._isRowEditMode() && isEditingAllowed) {
                        this._editingController.editCell(this._getFocusedRowIndex(), this._focusedCellPosition.columnIndex);
                    } else {
                        this._focusInteractiveElement($cell, eventArgs.shift);
                    }
                }
            } else {
                $cell = this._getCellElementFromTarget(eventTarget);
                var $lastInteractiveElement = this._getInteractiveElement($cell, !eventArgs.shift);
                if($lastInteractiveElement.length && eventTarget !== $lastInteractiveElement.get(0)) {
                    isOriginalHandlerRequired = true;
                } else {
                    if(this._focusedCellPosition.rowIndex === undefined && $(eventTarget).hasClass(ROW_CLASS)) {
                        this._updateFocusedCellPosition($(eventTarget).children().first());
                    }
                    $cell = this._getNextCell(direction, this._getElementType(eventTarget));
                    this._focusCell($cell);

                    this._focusInteractiveElement($cell, eventArgs.shift);
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
        if(isEditing) {
            var $cell = this._getCellElementFromTarget(eventArgs.originalEvent.target);
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
            args = {
                handled: false,
                event: e.originalEvent
            };

        this.executeAction("onKeyDown", args);

        if(e.originalEvent.isDefaultPrevented()) {
            return;
        }

        this._isNeedFocus = true;
        this._isNeedScroll = true;

        this._updateFocusedCellPosition(this._getCellElementFromTarget(args.event.target));

        if(!args.handled) {
            switch(e.key) {
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
                e.originalEvent.stopPropagation();
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
            includeCommandCells = inArray(keyCode, ["next", "previous"]) > -1,
            rowIndex,
            newFocusedCellPosition,
            isLastCellOnDirection = keyCode === "previous" ? this._isFirstValidCell(focusedCellPosition) : this._isLastValidCell(focusedCellPosition),
            $cell,
            $row;

        if(this._focusedView && focusedCellPosition) {
            newFocusedCellPosition = this._getNewPositionByCode(focusedCellPosition, elementType, keyCode);
            $cell = this._getCell(newFocusedCellPosition);

            if(!this._isCellValid($cell) && this._isCellInRow(newFocusedCellPosition, includeCommandCells) && !isLastCellOnDirection) {
                $cell = this._getNextCell(keyCode, "cell", newFocusedCellPosition);
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
        var checkingPosition = { columnIndex: cellPosition.columnIndex + 1, rowIndex: cellPosition.rowIndex },
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
                var $target = $(e.event.target);
                if(!$target.closest("." + that.addWidgetPrefix(ROWS_VIEW_CLASS)).length && !$target.closest("." + DROPDOWN_EDITOR_OVERLAY_CLASS).length) {
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
        var $element = $(element);
        var focusView = this._getFocusedViewByElement($element);

        if(focusView) {
            this._focusView(focusView.view, focusView.viewIndex);
            this._isNeedFocus = true;
            this._isNeedScroll = true;
            this._focus($element);
            this._focusInteractiveElement($element);
        }
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
                // TODO implement
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
             * @type_function_param1_field3 jQueryEvent:jQuery.Event:deprecated(event)
             * @type_function_param1_field4 event:event
             * @type_function_param1_field5 handled:boolean
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
                    var that = this,
                        cellElements = that.getCellElements(0),
                        keyboardNavigation = that.getController("keyboardNavigation"),
                        tabIndex = that.option("tabIndex"),
                        oldFocusedView = keyboardNavigation._focusedView,
                        $row,
                        $cell,
                        $element = that.element();

                    if($element && !focused($element)) {
                        $element.attr("tabIndex", null);
                    }

                    if(that.option("useKeyboard") && cellElements) {
                        $row = cellElements.eq(0).parent();

                        if(isGroupRow($row)) {
                            $row.attr("tabIndex", tabIndex);
                        } else {
                            keyboardNavigation._focusedView = that;
                            for(var i = 0; i < cellElements.length; i++) {
                                $cell = cellElements.eq(i);
                                if(keyboardNavigation._isCellValid($cell)) {
                                    if(isCellElement($cell)) {
                                        $cell.attr("tabIndex", tabIndex);
                                    }
                                    break;
                                }
                            }

                            keyboardNavigation._focusedView = oldFocusedView;
                        }
                    }
                },
                renderDelayedTemplates: function() {
                    this.callBase.apply(this, arguments);
                    this.renderFocusState();
                },
                _renderCore: function(change) {
                    this.callBase(change);
                    this.renderFocusState();
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
                init: function() {
                    this.callBase();
                    this._keyboardNavigationController = this.getController("keyboardNavigation");
                }
            }
        }
    }
};
