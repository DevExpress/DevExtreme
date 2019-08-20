import $ from "../../core/renderer";
import core from "./ui.grid_core.modules";
import { each } from "../../core/utils/iterator";
import { combineFilters } from "./ui.grid_core.utils";
import { equalByValue } from "../../core/utils/common";
import { isDefined, isBoolean } from "../../core/utils/type";
import { Deferred, when } from "../../core/utils/deferred";
import { getIndexByKey } from "./ui.grid_core.utils";

var ROW_FOCUSED_CLASS = "dx-row-focused",
    FOCUSED_ROW_SELECTOR = ".dx-row" + "." + ROW_FOCUSED_CLASS,
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled";

exports.FocusController = core.ViewController.inherit((function() {
    return {
        init: function() {
            this._dataController = this.getController("data");
            this._keyboardController = this.getController("keyboardNavigation");
            this.component._optionsByReference.focusedRowKey = true;
        },

        optionChanged: function(args) {
            if(args.name === "focusedRowIndex") {
                this._focusRowByIndex(args.value);
                args.handled = true;
            } else if(args.name === "focusedRowKey") {
                this._focusRowByKey(args.value);
                args.handled = true;
            } else if(args.name === "focusedColumnIndex") {
                args.handled = true;
            } else if(args.name === "focusedRowEnabled") {
                args.handled = true;
            } else {
                this.callBase(args);
            }
        },

        _focusRowByIndex: function(index) {
            if(!this.option("focusedRowEnabled")) {
                return;
            }

            index = index !== undefined ? index : this.option("focusedRowIndex");

            if(index < 0) {
                this._resetFocusedRow();
            } else {
                this._focusRowByIndexCore(index);
            }
        },
        _focusRowByIndexCore: function(index) {
            var dataController = this.getController("data"),
                pageSize = dataController.pageSize(),
                setKeyByIndex = () => {
                    if(this._isValidFocusedRowIndex(index)) {
                        let rowIndex = Math.min(index - dataController.getRowIndexOffset(), dataController.items().length - 1),
                            focusedRowKey = dataController.getKeyByRowIndex(rowIndex);

                        if(focusedRowKey !== undefined && !this.isRowFocused(focusedRowKey)) {
                            this.option("focusedRowKey", focusedRowKey);
                        }
                    }
                };

            if(pageSize >= 0) {
                if(!this._isLocalRowIndex(index)) {
                    let pageIndex = Math.floor(index / dataController.pageSize());
                    when(dataController.pageIndex(pageIndex), dataController.waitReady()).done(() => {
                        setKeyByIndex();
                    });
                } else {
                    setKeyByIndex();
                }
            }
        },
        _isLocalRowIndex(index) {
            var dataController = this.getController("data"),
                isVirtualScrolling = this.getController("keyboardNavigation")._isVirtualScrolling();

            if(isVirtualScrolling) {
                let pageIndex = Math.floor(index / dataController.pageSize()),
                    virtualItems = dataController.virtualItemsCount(),
                    virtualItemsBegin = virtualItems ? virtualItems.begin : -1,
                    visibleRowsCount = dataController.getVisibleRows().length + dataController.getRowIndexOffset(),
                    visiblePagesCount = Math.ceil(visibleRowsCount / dataController.pageSize());

                return virtualItemsBegin <= index && visiblePagesCount > pageIndex;
            }

            return true;
        },
        _setFocusedRowKeyByIndex: function(index) {
            var dataController = this.getController("data");
            if(this._isValidFocusedRowIndex(index)) {
                let rowIndex = Math.min(index - dataController.getRowIndexOffset(), dataController.items().length - 1),
                    focusedRowKey = dataController.getKeyByRowIndex(rowIndex);

                if(focusedRowKey !== undefined && !this.isRowFocused(focusedRowKey)) {
                    this.option("focusedRowKey", focusedRowKey);
                }
            }
        },

        _focusRowByKey: function(key) {
            if(key === undefined) {
                this._resetFocusedRow();
            } else {
                this.navigateToRow(key);
            }
        },

        _resetFocusedRow: function() {
            if(this.option("focusedRowKey") === undefined && this.option("focusedRowIndex") < 0) {
                return;
            }

            this.option("focusedRowKey", undefined);
            this.getController("keyboardNavigation").setFocusedRowIndex(-1);
            this.option("focusedRowIndex", -1);
            this.getController("data").updateItems({
                changeType: "updateFocusedRow",
                focusedRowKey: undefined
            });
        },

        _isValidFocusedRowIndex: function(rowIndex) {
            var dataController = this.getController("data"),
                row = dataController.getVisibleRows()[rowIndex];

            return !row || row.rowType === "data" || row.rowType === "group";
        },

        publicMethods: function() {
            return ["navigateToRow", "isRowFocused"];
        },

        /**
         * @name GridBaseMethods.navigateToRow
         * @publicName navigateToRow(key)
         * @param1 key:any
         */
        navigateToRow: function(key) {
            var that = this,
                dataController = this.getController("data"),
                rowIndex = this.option("focusedRowIndex"),
                result = new Deferred();

            if(key === undefined || !dataController.dataSource()) {
                return result.reject().promise();
            }

            let rowIndexByKey = that._getFocusedRowIndexByKey(key),
                isPaginate = dataController.getDataSource().paginate();

            if(!isPaginate || rowIndex >= 0 && rowIndex === rowIndexByKey) {
                that._triggerUpdateFocusedRow(key, result);
            } else {
                dataController.getPageIndexByKey(key).done(function(pageIndex) {
                    if(pageIndex < 0) {
                        result.resolve(-1);
                        return;
                    }
                    if(pageIndex === dataController.pageIndex()) {
                        dataController.reload().done(function() {
                            if(that.isRowFocused(key)) {
                                result.resolve(that._getFocusedRowIndexByKey(key));
                            } else {
                                that._triggerUpdateFocusedRow(key, result);
                            }
                        }).fail(result.reject);
                    } else {
                        dataController.pageIndex(pageIndex).done(function() {
                            if(that.option("scrolling.rowRenderingMode") === "virtual") {
                                setTimeout(function() {
                                    that._navigateToVirtualRow(key, result);
                                });
                            } else {
                                that._triggerUpdateFocusedRow(key, result);
                            }

                        }).fail(result.reject);
                    }
                }).fail(result.reject);
            }

            return result.promise();
        },

        _navigateToVirtualRow: function(key, result) {
            var that = this,
                dataController = this.getController("data"),
                rowsScrollController = dataController._rowsScrollController,
                rowIndex = getIndexByKey(key, dataController.items(true)),
                scrollable = that.getView("rowsView").getScrollable();

            if(rowsScrollController && scrollable && rowIndex >= 0) {
                var focusedRowIndex = rowIndex + dataController.getRowIndexOffset() - dataController.getRowIndexDelta(),
                    offset = rowsScrollController.getItemOffset(focusedRowIndex);

                var triggerUpdateFocusedRow = function() {
                    that.component.off("contentReady", triggerUpdateFocusedRow);
                    that._triggerUpdateFocusedRow(key, result);
                };

                that.component.on("contentReady", triggerUpdateFocusedRow);
                scrollable.scrollTo({ y: offset });
            }
        },

        _triggerUpdateFocusedRow: function(key, result) {
            var dataController = this.getController("data"),
                focusedRowIndex = this._getFocusedRowIndexByKey(key);

            if(this._isValidFocusedRowIndex(focusedRowIndex)) {
                this.getController("keyboardNavigation").setFocusedRowIndex(focusedRowIndex);

                if(this.option("focusedRowEnabled")) {
                    dataController.updateItems({
                        changeType: "updateFocusedRow",
                        focusedRowKey: key
                    });
                } else {
                    let rowIndex = dataController.getRowIndexByKey(key);
                    this._scrollToFocusedRow(this.getView("rowsView").getRow(rowIndex));
                }

                result && result.resolve(focusedRowIndex);
            } else {
                result && result.resolve(-1);
            }
        },

        _getFocusedRowIndexByKey: function(key) {
            var dataController = this.getController("data"),
                rowIndex = dataController.getRowIndexByKey(key);
            return rowIndex >= 0 ? rowIndex + dataController.getRowIndexOffset() : -1;
        },

        _focusRowByKeyOrIndex: function() {
            var focusedRowKey = this.option("focusedRowKey"),
                currentFocusedRowIndex = this.option("focusedRowIndex"),
                keyboardController = this.getController("keyboardNavigation"),
                dataController = this.getController("data");

            if(focusedRowKey !== undefined) {
                let visibleRowIndex = dataController.getRowIndexByKey(focusedRowKey);
                if(visibleRowIndex >= 0) {
                    if(keyboardController._isVirtualScrolling()) {
                        currentFocusedRowIndex = visibleRowIndex + dataController.getRowIndexOffset();
                    }
                    keyboardController.setFocusedRowIndex(currentFocusedRowIndex);
                    this._triggerUpdateFocusedRow(focusedRowKey);
                } else {
                    this.navigateToRow(focusedRowKey).done(focusedRowIndex => {
                        if(currentFocusedRowIndex >= 0 && focusedRowIndex < 0) {
                            this._focusRowByIndex();
                        }
                    });
                }
            } else if(currentFocusedRowIndex >= 0) {
                this.getController("focus")._focusRowByIndex(currentFocusedRowIndex);
            }
        },

        /**
         * @name GridBaseMethods.isRowFocused
         * @publicName isRowFocused(key)
         * @param1 key:any
         * @return boolean
         */
        isRowFocused: function(key) {
            var focusedRowKey = this.option("focusedRowKey");

            if(focusedRowKey !== undefined) {
                return equalByValue(key, this.option("focusedRowKey"));
            }
        },

        updateFocusedRow: function(change) {
            var that = this,
                focusedRowIndex = that._dataController.getRowIndexByKey(change.focusedRowKey),
                rowsView = that.getView("rowsView"),
                $focusedRow,
                $tableElement;

            each(rowsView.getTableElements(), function(index, element) {
                $tableElement = $(element);
                that._clearPreviousFocusedRow($tableElement, focusedRowIndex);
                let isMainTable = index === 0;
                $focusedRow = that._prepareFocusedRow(change.items[focusedRowIndex], $tableElement, focusedRowIndex);
                if(isMainTable) {
                    that.getController("keyboardNavigation")._fireFocusedRowChanged($focusedRow);
                }
            });
        },
        _clearPreviousFocusedRow: function($tableElement, focusedRowIndex) {
            var $prevRowFocusedElement = $tableElement.find(FOCUSED_ROW_SELECTOR),
                $firstRow;
            $prevRowFocusedElement
                .removeClass(ROW_FOCUSED_CLASS)
                .removeClass(CELL_FOCUS_DISABLED_CLASS)
                .removeAttr("tabindex");
            $prevRowFocusedElement.children("td").removeAttr("tabindex");
            if(focusedRowIndex !== 0) {
                $firstRow = $(this.getView("rowsView").getRowElement(0));
                $firstRow.removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr("tabIndex");
            }
        },
        _prepareFocusedRow: function(changedItem, $tableElement, focusedRowIndex) {
            var $row,
                tabIndex = this.option("tabindex") || 0;

            if(changedItem && (changedItem.rowType === "data" || changedItem.rowType === "group")) {
                $row = $(this.getView("rowsView")._getRowElements($tableElement).eq(focusedRowIndex));
                $row.addClass(ROW_FOCUSED_CLASS).attr("tabindex", tabIndex);
                this._scrollToFocusedRow($row);
            }

            return $row;
        },

        _scrollToFocusedRow: function($row) {
            var that = this,
                rowsView = that.getView("rowsView"),
                $rowsViewElement = rowsView.element(),
                $focusedRow;

            if(!$rowsViewElement) {
                return;
            }

            $focusedRow = $row && $row.length ? $row : $rowsViewElement.find(FOCUSED_ROW_SELECTOR);

            if($focusedRow.length > 0) {
                var focusedRowRect = $focusedRow[0].getBoundingClientRect(),
                    rowsViewRect = rowsView.element()[0].getBoundingClientRect(),
                    diff;

                if(focusedRowRect.bottom > rowsViewRect.bottom) {
                    diff = focusedRowRect.bottom - rowsViewRect.bottom;
                } else if(focusedRowRect.top < rowsViewRect.top) {
                    diff = focusedRowRect.top - rowsViewRect.top;
                }

                if(diff) {
                    rowsView.scrollTo({ y: rowsView._scrollTop + diff });
                }
            }
        }
    };
})());

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions.focusedRowEnabled
             * @type boolean
             * @default false
             */
            focusedRowEnabled: false,

            /**
             * @name GridBaseOptions.focusedRowKey
             * @type any
             * @default undefined
             * @fires GridBaseOptions.onFocusedRowChanged
             */
            focusedRowKey: undefined,

            /**
             * @name GridBaseOptions.focusedRowIndex
             * @type number
             * @default -1
             * @fires GridBaseOptions.onFocusedRowChanged
             */
            focusedRowIndex: -1,

            /**
             * @name GridBaseOptions.focusedColumnIndex
             * @type number
             * @default -1
             * @fires GridBaseOptions.onFocusedCellChanged
             */
            focusedColumnIndex: -1
        };
    },

    controllers: {
        focus: exports.FocusController
    },

    extenders: {
        controllers: {
            keyboardNavigation: {
                init: function() {
                    var rowIndex = this.option("focusedRowIndex"),
                        columnIndex = this.option("focusedColumnIndex");

                    if(this.option("focusedRowEnabled")) {
                        this.createAction("onFocusedRowChanging", { excludeValidators: ["disabled", "readOnly"] });
                        this.createAction("onFocusedRowChanged", { excludeValidators: ["disabled", "readOnly"] });
                    }

                    this.createAction("onFocusedCellChanging", { excludeValidators: ["disabled", "readOnly"] });
                    this.createAction("onFocusedCellChanged", { excludeValidators: ["disabled", "readOnly"] });

                    this.callBase();

                    this.setRowFocusType();

                    this._focusedCellPosition = { };
                    if(isDefined(rowIndex)) {
                        this._focusedCellPosition.rowIndex = this.option("focusedRowIndex");
                    }
                    if(isDefined(columnIndex)) {
                        this._focusedCellPosition.columnIndex = this.option("focusedColumnIndex");
                    }
                },

                setFocusedRowIndex: function(rowIndex) {
                    this.callBase(rowIndex);

                    let visibleRow = this.getController("data").getVisibleRows()[rowIndex];
                    if(!visibleRow || !visibleRow.inserted) {
                        this.option("focusedRowIndex", rowIndex);
                    }
                },

                setFocusedColumnIndex: function(columnIndex) {
                    this.callBase(columnIndex);
                    this.option("focusedColumnIndex", columnIndex);
                },

                _escapeKeyHandler: function(eventArgs, isEditing) {
                    if(isEditing || !this.option("focusedRowEnabled")) {
                        this.callBase(eventArgs, isEditing);
                        return;
                    }
                    if(this.isCellFocusType()) {
                        this.setRowFocusType();
                        this._focus(this._getCellElementFromTarget(eventArgs.originalEvent.target), true);
                    }
                },

                _updateFocusedCellPosition: function($cell, direction) {
                    var prevRowIndex = this.option("focusedRowIndex"),
                        prevColumnIndex = this.option("focusedColumnIndex");

                    if(this.callBase($cell, direction)) {
                        this._fireFocusedCellChanged($cell, prevColumnIndex, prevRowIndex);
                    }
                }
            },

            editorFactory: {
                renderFocusOverlay: function($element, hideBorder) {
                    var keyboardController = this.getController("keyboardNavigation"),
                        focusedRowEnabled = this.option("focusedRowEnabled"),
                        editingController = this.getController("editing"),
                        isRowElement = keyboardController._getElementType($element) === "row",
                        $cell;

                    if(!focusedRowEnabled || !keyboardController.isRowFocusType() || editingController.isEditing()) {
                        this.callBase($element, hideBorder);
                    } else if(focusedRowEnabled) {
                        if(isRowElement && !$element.hasClass(ROW_FOCUSED_CLASS)) {
                            $cell = keyboardController.getFirstValidCellInRow($element);
                            keyboardController.focus($cell);
                        }
                    }
                }
            },

            columns: {
                getSortDataSourceParameters: function() {
                    var result = this.callBase.apply(this, arguments),
                        dataController = this.getController("data"),
                        dataSource = dataController._dataSource,
                        store = dataController.store(),
                        key = store && store.key(),
                        remoteOperations = dataSource && dataSource.remoteOperations() || {},
                        isLocalOperations = Object.keys(remoteOperations).every(operationName => !remoteOperations[operationName]);

                    if(this.option("focusedRowEnabled") && key) {
                        key = Array.isArray(key) ? key : [key];
                        var notSortedKeys = key.filter(key => !this.columnOption(key, "sortOrder"));

                        if(notSortedKeys.length) {
                            result = result || [];
                            if(isLocalOperations) {
                                result.push({ selector: dataSource.getDataIndexGetter(), desc: false });
                            } else {
                                notSortedKeys.forEach(notSortedKey => result.push({ selector: notSortedKey, desc: false }));
                            }
                        }
                    }

                    return result;
                }
            },

            data: {
                _applyChange: function(change) {
                    if(change && change.changeType === "updateFocusedRow") return;

                    return this.callBase.apply(this, arguments);
                },

                _fireChanged: function(e) {
                    var isPartialUpdateWithDeleting;

                    if(this.option("focusedRowEnabled") && this._dataSource) {
                        let isPartialUpdate = e.changeType === "update" && e.repaintChangesOnly;

                        isPartialUpdateWithDeleting = isPartialUpdate && e.changeTypes && e.changeTypes.indexOf("remove") >= 0;

                        if(isPartialUpdateWithDeleting) {
                            this.callBase(e);
                        }

                        if(e.changeType === "refresh" || isPartialUpdateWithDeleting) {
                            this.processUpdateFocusedRow();
                        }
                    }

                    if(!isPartialUpdateWithDeleting) {
                        this.callBase(e);
                    }
                },
                processUpdateFocusedRow: function() {
                    var prevPageIndex = this._prevPageIndex,
                        pageIndex = this.pageIndex(),
                        prevRenderingPageIndex = this._prevRenderingPageIndex || 0,
                        renderingPageIndex = this._rowsScrollController ? this._rowsScrollController.pageIndex() : 0,
                        operationTypes = this._dataSource.operationTypes() || {},
                        focusController = this.getController("focus"),
                        reload = operationTypes.reload,
                        isVirtualScrolling = this.getController("keyboardNavigation")._isVirtualScrolling(),
                        focusedRowKey = this.option("focusedRowKey"),
                        paging = prevPageIndex !== undefined && prevPageIndex !== pageIndex,
                        pagingByRendering = renderingPageIndex !== prevRenderingPageIndex;

                    this._prevPageIndex = pageIndex;
                    this._prevRenderingPageIndex = renderingPageIndex;

                    if(reload && focusedRowKey !== undefined) {
                        focusController.navigateToRow(focusedRowKey).done(function(focusedRowIndex) {
                            if(focusedRowIndex < 0) {
                                focusController._focusRowByIndex();
                            }
                        });
                    } else if(paging) {
                        if(!isVirtualScrolling && this.option("focusedRowIndex") >= 0) {
                            focusController._focusRowByIndex();
                        }
                    } else if(!pagingByRendering) {
                        focusController._focusRowByKeyOrIndex();
                    }
                },

                getPageIndexByKey: function(key) {
                    var that = this,
                        d = new Deferred();

                    that.getGlobalRowIndexByKey(key).done(function(globalIndex) {
                        d.resolve(globalIndex >= 0 ? Math.floor(globalIndex / that.pageSize()) : -1);
                    }).fail(d.reject);

                    return d.promise();
                },
                getGlobalRowIndexByKey: function(key) {
                    if(this._dataSource.group()) {
                        return this._calculateGlobalRowIndexByGroupedData(key);
                    }
                    return this._calculateGlobalRowIndexByFlatData(key);
                },
                _calculateGlobalRowIndexByFlatData: function(key, groupFilter, useGroup) {
                    var that = this,
                        deferred = new Deferred(),
                        dataSource = that._dataSource,
                        filter = that._generateFilterByKey(key);

                    dataSource.load({
                        filter: that._concatWithCombinedFilter(filter),
                        skip: 0,
                        take: 1
                    }).done(function(data) {
                        if(data.length > 0) {
                            filter = that._generateOperationFilterByKey(key, data[0], useGroup);
                            dataSource.load({
                                filter: that._concatWithCombinedFilter(filter, groupFilter),
                                skip: 0,
                                take: 1,
                                requireTotalCount: true
                            }).done(function(_, extra) {
                                deferred.resolve(extra.totalCount);
                            });
                        } else {
                            deferred.resolve(-1);
                        }
                    });

                    return deferred.promise();
                },
                _concatWithCombinedFilter: function(filter, groupFilter) {
                    var combinedFilter = this.getCombinedFilter();
                    return combineFilters([filter, combinedFilter, groupFilter]);
                },
                _generateBooleanFilter: function(selector, value, sortInfo) {
                    let result;

                    if(value === false) {
                        result = [selector, "=", sortInfo.desc ? true : null];
                    } else if(value === true ? !sortInfo.desc : sortInfo.desc) {
                        result = [selector, "<>", value];
                    }

                    return result;
                },
                _generateOperationFilterByKey: function(key, rowData, useGroup) {
                    var that = this,
                        booleanFilter,
                        dataSource = that._dataSource,
                        filter = that._generateFilterByKey(key, "<"),
                        sort = that._columnsController.getSortDataSourceParameters(!dataSource.remoteOperations().filtering);

                    if(useGroup) {
                        var group = that._columnsController.getGroupDataSourceParameters(!dataSource.remoteOperations().filtering);
                        if(group) {
                            sort = sort ? group.concat(sort) : group;
                        }
                    }

                    if(sort) {
                        sort.slice().reverse().forEach(function(sortInfo) {
                            var selector = sortInfo.selector,
                                getter,
                                value;

                            if(typeof selector === "function") {
                                getter = selector;
                            } else {
                                getter = that._columnsController.columnOption(selector, "selector");
                            }

                            value = getter ? getter(rowData) : rowData[selector];
                            filter = [[selector, "=", value], "and", filter];

                            if(value === null || isBoolean(value)) {
                                booleanFilter = that._generateBooleanFilter(selector, value, sortInfo);

                                if(booleanFilter) {
                                    filter = [booleanFilter, "or", filter];
                                }
                            } else {
                                filter = [[selector, sortInfo.desc ? ">" : "<", value], "or", filter];
                            }
                        });
                    }

                    return filter;
                },
                _generateFilterByKey: function(key, operation) {
                    var dataSourceKey = this._dataSource.key(),
                        filter = [],
                        keyPart;

                    if(!operation) {
                        operation = "=";
                    }

                    if(Array.isArray(dataSourceKey)) {
                        for(var i = 0; i < dataSourceKey.length; ++i) {
                            keyPart = key[dataSourceKey[i]];
                            if(keyPart) {
                                if(filter.length > 0) {
                                    filter.push("and");
                                }
                                filter.push([dataSourceKey[i], operation, keyPart]);
                            }
                        }
                    } else {
                        filter = [dataSourceKey, operation, key];
                    }

                    return filter;
                }
            }
        },

        views: {
            rowsView: {
                _createRow: function(row) {
                    var $row = this.callBase(row);

                    if(this.option("focusedRowEnabled") && row) {
                        if(this.getController("focus").isRowFocused(row.key)) {
                            $row.addClass(ROW_FOCUSED_CLASS);
                        }
                    }

                    return $row;
                },

                _checkRowKeys: function(options) {
                    this.callBase.apply(this, arguments);

                    if(this.option("focusedRowEnabled") && this.option("dataSource")) {
                        var store = this._dataController.store();
                        if(store && !store.key()) {
                            this._dataController.fireError("E1042", "Row focusing");
                        }
                    }
                },

                _update: function(change) {
                    if(change.changeType === "updateFocusedRow") {
                        if(this.option("focusedRowEnabled")) {
                            this.getController("focus").updateFocusedRow(change);
                        }
                    } else {
                        this.callBase(change);
                    }
                },

                updateFocusElementTabIndex: function($cellElements) {
                    if(this.option("focusedRowEnabled")) {
                        this._setFocusedRowElementTabIndex();
                    } else {
                        this.callBase($cellElements);
                    }
                },
                _setFocusedRowElementTabIndex: function() {
                    var that = this,
                        focusedRowKey = that.option("focusedRowKey"),
                        tabIndex = that.option("tabIndex"),
                        rowIndex = that._dataController.getRowIndexByKey(focusedRowKey),
                        columnIndex = that.option("focusedColumnIndex"),
                        $cellElements = that.getCellElements(rowIndex >= 0 ? rowIndex : 0),
                        $row = $cellElements.eq(0).parent(),
                        dataSource = that.component.getController("data")._dataSource,
                        operationTypes = dataSource && dataSource.operationTypes();

                    that._scrollToFocusOnResize = that._scrollToFocusOnResize || function() {
                        that.getController("focus")._scrollToFocusedRow($row);
                        that.resizeCompleted.remove(that._scrollToFocusOnResize);
                    };

                    if($row.length) {
                        $row.attr("tabIndex", tabIndex);
                        if(rowIndex >= 0) {
                            if(columnIndex < 0) {
                                columnIndex = 0;
                            }

                            rowIndex += that.getController("data").getRowIndexOffset();
                            that.getController("keyboardNavigation").setFocusedCellPosition(rowIndex, columnIndex);

                            if(operationTypes && !operationTypes.paging) {
                                that.resizeCompleted.remove(that._scrollToFocusOnResize);
                                that.resizeCompleted.add(that._scrollToFocusOnResize);
                            }
                        }
                    }
                }
            }
        }
    }
};
