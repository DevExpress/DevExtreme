var Callbacks = require("../../core/utils/callbacks"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    iteratorUtils = require("../../core/utils/iterator"),
    Class = require("../../core/class"),
    stringUtils = require("../../core/utils/string"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    virtualScrolling = require("../grid_core/ui.grid_core.virtual_scrolling_core"),
    virtualColumnsCore = require("../grid_core/ui.grid_core.virtual_columns_core"),
    stateStoring = require("../grid_core/ui.grid_core.state_storing_core"),
    PivotGridDataSource = require("./data_source"),
    pivotGridUtils = require("./ui.pivot_grid.utils"),
    foreachTree = pivotGridUtils.foreachTree,
    foreachTreeAsync = pivotGridUtils.foreachTreeAsync,
    createPath = pivotGridUtils.createPath,
    formatValue = pivotGridUtils.formatValue,
    math = Math,
    GRAND_TOTAL_TYPE = "GT",
    TOTAL_TYPE = "T",
    DATA_TYPE = "D",
    NOT_AVAILABLE = "#N/A";

var proxyMethod = function(instance, methodName, defaultResult) {
    if(!instance[methodName]) {
        instance[methodName] = function() {
            var dataSource = this._dataSource;
            return dataSource ? dataSource[methodName].apply(dataSource, arguments) : defaultResult;
        };
    }
};

exports.DataController = Class.inherit((function() {

    function getHeaderItemText(item, description, options) {
        var text = item.text;

        if(typeUtils.isDefined(item.displayText)) {
            text = item.displayText;
        } else if(typeUtils.isDefined(item.caption)) {
            text = item.caption;
        } else if(item.type === GRAND_TOTAL_TYPE) {
            text = options.texts.grandTotal;
        }

        if(item.isAdditionalTotal) {
            text = stringUtils.format(options.texts.total || '', text);
        }

        return text;
    }

    function formatCellValue(value, dataField, errorText) {
        return value === NOT_AVAILABLE ? errorText : formatValue(value, dataField);
    }

    var createHeaderInfo = (function() {
        var getHeaderItemsDepth = function(headerItems) {
            var depth = 0;

            foreachTree(headerItems, function(items) {
                depth = math.max(depth, items.length);
            });

            return depth;
        };

        var createInfoItem = function(headerItem, breadth, isHorizontal, isTree) {
            /**
            * @name dxPivotGridPivotGridCell
            * @type object
            */
            var infoItem = {
                /**
                * @name dxPivotGridPivotGridCell.type
                * @acceptValues "D" | "T" | "GT"
                * @type string
                */
                type: headerItem.type,
                text: headerItem.text
            };

            if(headerItem.path) {
                /**
                * @name dxPivotGridPivotGridCell.path
                * @type Array<string, number, Date>
                */
                infoItem.path = headerItem.path;
            }
            if(headerItem.width) {
                infoItem.width = headerItem.width;
            }
            if(typeUtils.isDefined(headerItem.wordWrapEnabled)) {
                infoItem.wordWrapEnabled = headerItem.wordWrapEnabled;
            }

            if(headerItem.isLast) {
                infoItem.isLast = true;
            }
            if(headerItem.sorted) {
                infoItem.sorted = true;
            }
            if(headerItem.isMetric) {
                infoItem.dataIndex = headerItem.dataIndex;
            }
            if(typeUtils.isDefined(headerItem.expanded)) {
                /**
                * @name dxPivotGridPivotGridCell.expanded
                * @type boolean
                */
                infoItem.expanded = headerItem.expanded;
            }
            if(breadth > 1) {
                infoItem[isHorizontal ? 'colspan' : 'rowspan'] = breadth;
            }
            if(headerItem.depthSize && headerItem.depthSize > 1) {
                infoItem[isHorizontal ? 'rowspan' : 'colspan'] = headerItem.depthSize;
            }

            if(headerItem.index >= 0) {
                infoItem.dataSourceIndex = headerItem.index;
            }

            if(isTree && headerItem.children && headerItem.children.length && !headerItem.children[0].isMetric) {
                infoItem.width = null;
                infoItem.isWhiteSpace = true;
            }

            return infoItem;
        };

        var addInfoItem = function(info, options) {
            var itemInfo,
                breadth = (options.lastIndex - options.index) || 1,
                addInfoItemCore = function(info, infoItem, itemIndex, depthIndex, isHorizontal) {
                    var index = isHorizontal ? depthIndex : itemIndex;
                    while(!info[index]) {
                        info.push([]);
                    }
                    if(isHorizontal) {
                        info[index].push(infoItem);
                    } else {
                        info[index].unshift(infoItem);
                    }
                };

            itemInfo = createInfoItem(options.headerItem, breadth, options.isHorizontal, options.isTree);
            addInfoItemCore(info, itemInfo, options.index, options.depth, options.isHorizontal);
            if(!options.headerItem.children || options.headerItem.children.length === 0) {
                return options.lastIndex + 1;
            }
            return options.lastIndex;
        };

        var isItemSorted = function(items, sortBySummaryPath) {
            var path,
                item = items[0],
                stringValuesUsed = typeUtils.isString(sortBySummaryPath[0]),
                headerItem = item.dataIndex >= 0 ? items[1] : item;

            if((stringValuesUsed && sortBySummaryPath[0].indexOf("&[") !== -1 && headerItem.key) || !headerItem.key) {
                path = createPath(items);
            } else {
                path = iteratorUtils.map(items, function(item) { return item.dataIndex >= 0 ? item.value : item.text; }).reverse();
            }

            if(item.type === GRAND_TOTAL_TYPE) {
                path = path.slice(1);
            }

            return path.join("/") === sortBySummaryPath.join("/");
        };

        var getViewHeaderItems = function(headerItems, headerDescriptions, cellDescriptions, depthSize, options) {
            var cellDescriptionsCount = cellDescriptions.length,
                viewHeaderItems = createViewHeaderItems(headerItems, headerDescriptions),
                dataFields = options.dataFields,
                d = new Deferred();

            when(viewHeaderItems).done(function(viewHeaderItems) {
                options.notifyProgress(0.5);

                if(options.showGrandTotals) {
                    viewHeaderItems[!options.showTotalsPrior ? "push" : "unshift"]({
                        type: GRAND_TOTAL_TYPE,
                        isEmpty: options.isEmptyGrandTotal
                    });
                }

                var hideTotals = options.showTotals === false || dataFields.length > 0 && (dataFields.length === options.hiddenTotals.length),
                    hideData = dataFields.length > 0 && options.hiddenValues.length === dataFields.length;

                if(hideData && hideTotals) {
                    depthSize = 1;
                }

                if(!hideTotals || options.layout === "tree") {
                    addAdditionalTotalHeaderItems(viewHeaderItems, headerDescriptions, options.showTotalsPrior, options.layout === "tree");
                }

                when(foreachTreeAsync(viewHeaderItems, function(items) {
                    var item = items[0];

                    if(!item.children || item.children.length === 0) {
                        item.depthSize = depthSize - items.length + 1;
                    }
                })).done(function() {
                    if(cellDescriptionsCount > 1) {
                        addMetricHeaderItems(viewHeaderItems, cellDescriptions, options);
                    }

                    !options.showEmpty && removeHiddenItems(viewHeaderItems);

                    options.notifyProgress(0.75);

                    when(foreachTreeAsync(viewHeaderItems, function(items) {
                        var item = items[0],
                            isMetric = item.isMetric,
                            field = headerDescriptions[items.length - 1] || {};

                        if(item.type === DATA_TYPE && !isMetric) {
                            item.width = field.width;
                        }

                        if(hideData === true && item.type === DATA_TYPE) {
                            var parentChildren = (items[1] ? items[1].children : viewHeaderItems) || [];

                            parentChildren.splice(inArray(item, parentChildren), 1);
                            return;
                        }

                        if(isMetric) {
                            item.wordWrapEnabled = cellDescriptions[item.dataIndex].wordWrapEnabled;
                        } else {
                            item.wordWrapEnabled = field.wordWrapEnabled;
                        }

                        item.isLast = !item.children || !item.children.length;
                        if(item.isLast) {
                            iteratorUtils.each(options.sortBySummaryPaths, function(index, sortBySummaryPath) {
                                if(!typeUtils.isDefined(item.dataIndex)) {
                                    sortBySummaryPath = sortBySummaryPath.slice(0);
                                    sortBySummaryPath.pop();
                                }

                                if(isItemSorted(items, sortBySummaryPath)) {
                                    item.sorted = true;
                                    return false;
                                }
                            });
                        }
                        item.text = getHeaderItemText(item, field, options);
                    })).done(function() {
                        if(!viewHeaderItems.length) {
                            viewHeaderItems.push({});
                        }
                        options.notifyProgress(1);
                        d.resolve(viewHeaderItems);
                    });
                });


            });

            return d;
        };

        function createHeaderItem(childrenStack, depth, index) {
            var parent = childrenStack[depth] = childrenStack[depth] || [],
                node = parent[index] = {};


            if(childrenStack[depth + 1]) {
                node.children = childrenStack[depth + 1];
                // T541266
                for(var i = depth + 1; i < childrenStack.length; i++) {
                    childrenStack[i] = undefined;
                }
                childrenStack.length = depth + 1;
            }

            return node;
        }

        function createViewHeaderItems(headerItems, headerDescriptions) {
            var headerDescriptionsCount = (headerDescriptions && headerDescriptions.length) || 0,
                childrenStack = [],
                d = new Deferred(),
                headerItem;

            when(foreachTreeAsync(headerItems, function(items, index) {
                var item = items[0],
                    path = createPath(items);

                headerItem = createHeaderItem(childrenStack, path.length, index);

                headerItem.type = DATA_TYPE;
                headerItem.value = item.value;
                headerItem.path = path;
                headerItem.text = item.text;
                headerItem.index = item.index;
                headerItem.displayText = item.displayText;
                headerItem.key = item.key;
                headerItem.isEmpty = item.isEmpty;

                if(path.length < headerDescriptionsCount && (!item.children || item.children.length !== 0)) {
                    headerItem.expanded = !!item.children;
                }
            })).done(function() {
                d.resolve(createHeaderItem(childrenStack, 0, 0).children || []);
            });

            return d;
        }

        var addMetricHeaderItems = function(headerItems, cellDescriptions, options) {
            foreachTree(headerItems, function(items) {
                var item = items[0],
                    i;

                if(!item.children || item.children.length === 0) {

                    item.children = [];
                    for(i = 0; i < cellDescriptions.length; i++) {
                        var isGrandTotal = item.type === GRAND_TOTAL_TYPE,
                            isTotal = item.type === TOTAL_TYPE,
                            isValue = item.type === DATA_TYPE,
                            columnIsHidden = cellDescriptions[i].visible === false ||
                            (isGrandTotal && inArray(i, options.hiddenGrandTotals) !== -1) ||
                            (isTotal && inArray(i, options.hiddenTotals) !== -1) ||
                            (isValue && inArray(i, options.hiddenValues) !== -1);

                        if(columnIsHidden) {
                            continue;
                        }

                        item.children.push({
                            caption: cellDescriptions[i].caption,
                            path: item.path,
                            type: item.type,
                            value: i,
                            index: item.index,
                            dataIndex: i,
                            isMetric: true,
                            isEmpty: item.isEmpty && item.isEmpty[i]
                        });
                    }
                }
            });
        };

        var addAdditionalTotalHeaderItems = function(headerItems, headerDescriptions, showTotalsPrior, isTree) {
            showTotalsPrior = showTotalsPrior || isTree;

            foreachTree(headerItems, function(items, index) {
                var item = items[0],
                    parentChildren = (items[1] ? items[1].children : headerItems) || [],
                    dataField = headerDescriptions[items.length - 1];

                if(item.type === DATA_TYPE && item.expanded && (dataField.showTotals !== false || isTree)) {
                    index !== -1 && parentChildren.splice(showTotalsPrior ? index : index + 1, 0, extend({}, item, {
                        children: null,
                        type: TOTAL_TYPE,
                        expanded: showTotalsPrior ? true : null,
                        isAdditionalTotal: true
                    }));

                    if(showTotalsPrior) {
                        item.expanded = null;
                    }
                }
            });
        };

        var removeEmptyParent = function(items, index) {
            var parent = items[index + 1];

            if(!items[index].children.length && parent && parent.children) {
                parent.children.splice(inArray(items[index], parent.children), 1);
                removeEmptyParent(items, index + 1);
            }

        };

        var removeHiddenItems = function(headerItems) {
            foreachTree([{ children: headerItems }], function(items, index) {
                var item = items[0],
                    parentChildren = (items[1] ? items[1].children : headerItems) || [],
                    isEmpty = item.isEmpty;

                if(isEmpty && isEmpty.length) {
                    isEmpty = item.isEmpty.filter(function(isEmpty) { return isEmpty; }).length === isEmpty.length;
                }

                if(item && !item.children && isEmpty) {
                    parentChildren.splice(index, 1);
                    removeEmptyParent(items, 1);
                }
            });
        };

        var fillHeaderInfo = function(info, viewHeaderItems, depthSize, isHorizontal, isTree) {
            var lastIndex = 0,
                index,
                depth,
                indexesByDepth = [0];

            foreachTree(viewHeaderItems, function(items) {
                var headerItem = items[0];
                depth = headerItem.isMetric ? depthSize : items.length - 1;
                while(indexesByDepth.length - 1 < depth) {
                    indexesByDepth.push(indexesByDepth[indexesByDepth.length - 1]);
                }
                index = indexesByDepth[depth] || 0;
                lastIndex = addInfoItem(info, {
                    headerItem: headerItem,
                    index: index, lastIndex: lastIndex,
                    depth: depth, isHorizontal: isHorizontal,
                    isTree: isTree
                });
                indexesByDepth.length = depth;
                indexesByDepth.push(lastIndex);
            });
        };

        return function(headerItems, headerDescriptions, cellDescriptions, isHorizontal, options) {
            var info = [],
                depthSize = getHeaderItemsDepth(headerItems) || 1,
                d = new Deferred();

            getViewHeaderItems(headerItems, headerDescriptions, cellDescriptions, depthSize, options).done(function(viewHeaderItems) {
                fillHeaderInfo(info, viewHeaderItems, depthSize, isHorizontal, options.layout === "tree");
                options.notifyProgress(1);
                d.resolve(info);
            });

            return d;
        };
    })();

    function createSortPaths(headerFields, dataFields) {
        var sortBySummaryPaths = [];

        iteratorUtils.each(headerFields, function(index, headerField) {
            var fieldIndex = pivotGridUtils.findField(dataFields, headerField.sortBySummaryField);
            if(fieldIndex >= 0) {
                sortBySummaryPaths.push((headerField.sortBySummaryPath || []).concat([fieldIndex]));
            }
        });
        return sortBySummaryPaths;
    }

    function foreachRowInfo(rowsInfo, callback) {
        var columnOffset = 0,
            columnOffsetResetIndexes = [];

        for(var i = 0; i < rowsInfo.length; i++) {
            for(var j = 0; j < rowsInfo[i].length; j++) {
                var rowSpanOffset = (rowsInfo[i][j].rowspan || 1) - 1,
                    visibleIndex = i + rowSpanOffset;

                if(columnOffsetResetIndexes[i]) {
                    columnOffset -= columnOffsetResetIndexes[i];
                    columnOffsetResetIndexes[i] = 0;
                }

                if(callback(rowsInfo[i][j], visibleIndex, i, j, columnOffset) === false) {
                    break;
                }

                columnOffsetResetIndexes[i + (rowsInfo[i][j].rowspan || 1)] = (columnOffsetResetIndexes[i + (rowsInfo[i][j].rowspan || 1)] || 0) + 1;
                columnOffset++;
            }
        }
    }

    function createCellsInfo(rowsInfo, columnsInfo, data, dataFields, dataFieldArea, errorText) {
        var info = [],
            dataFieldAreaInRows = dataFieldArea === "row",
            dataSourceCells = data.values;

        dataSourceCells.length && foreachRowInfo(rowsInfo, function(rowInfo, rowIndex) {
            var row = info[rowIndex] = [],
                dataRow = dataSourceCells[rowInfo.dataSourceIndex >= 0 ? rowInfo.dataSourceIndex : data.grandTotalRowIndex] || [];

            rowInfo.isLast && virtualColumnsCore.foreachColumnInfo(columnsInfo, function(columnInfo, columnIndex) {
                var dataIndex = (dataFieldAreaInRows ? rowInfo.dataIndex : columnInfo.dataIndex) || 0,
                    dataField = dataFields[dataIndex];

                if(columnInfo.isLast && dataField) {
                    var cell = dataRow[columnInfo.dataSourceIndex >= 0 ? columnInfo.dataSourceIndex : data.grandTotalColumnIndex],
                        cellValue;

                    if(!Array.isArray(cell)) {
                        cell = [cell];
                    }

                    cellValue = cell[dataIndex];

                    row[columnIndex] = {
                        /**
                        * @name dxPivotGridPivotGridCell.text
                        * @type string
                        */
                        text: formatCellValue(cellValue, dataField, errorText),
                        /**
                       * @name dxPivotGridPivotGridCell.value
                       */
                        value: cellValue,
                        format: dataField.format,
                        dataType: dataField.dataType,

                        /**
                        * @name dxPivotGridPivotGridCell.columnType
                        * @acceptValues "D" | "T" | "GT"
                        * @type string
                        */
                        columnType: columnInfo.type,

                        /**
                        * @name dxPivotGridPivotGridCell.rowType
                        * @acceptValues "D" | "T" | "GT"
                        * @type string
                        */
                        rowType: rowInfo.type,
                        /**
                       * @name dxPivotGridPivotGridCell.rowPath
                       * @type Array<string, number, Date>
                       */
                        rowPath: rowInfo.path || [],
                        /**
                        * @name dxPivotGridPivotGridCell.columnPath
                        * @type Array<string, number, Date>
                        */
                        columnPath: columnInfo.path || [],
                        /**
                        * @name dxPivotGridPivotGridCell.dataIndex
                        * @type number
                        */
                        dataIndex: dataIndex
                    };

                    if(dataField.width) {
                        row[columnIndex].width = dataField.width;
                    }
                }
            });
        });

        return info;
    }

    function getHeaderIndexedItems(headerItems, options) {
        var visibleIndex = 0,
            indexedItems = [];

        foreachTree(headerItems, function(items) {
            var headerItem = items[0],
                path = createPath(items);

            if(headerItem.children && options.showTotals === false) return;

            var indexedItem = extend(true, {}, headerItem, {
                visibleIndex: visibleIndex++,
                path: path
            });

            if(typeUtils.isDefined(indexedItem.index)) {
                indexedItems[indexedItem.index] = indexedItem;
            } else {
                indexedItems.push(indexedItem);
            }
        });
        return indexedItems;
    }

    function createScrollController(dataController, component, dataAdapter) {
        if(component && component.option("scrolling.mode") === "virtual") {
            return new virtualScrolling.VirtualScrollController(component, extend({
                hasKnownLastPage: function() {
                    return true;
                },
                pageCount: function() {
                    return math.ceil(this.totalItemsCount() / this.pageSize());
                },
                updateLoading: function() {

                },
                itemsCount: function() {
                    if(this.pageIndex() < this.pageCount() - 1) {
                        return this.pageSize();
                    } else {
                        return this.totalItemsCount() % this.pageSize();
                    }
                },
                items: function() {
                    return [];
                },
                viewportItems: function() {
                    return [];
                },
                onChanged: function() {

                },
                isLoading: function() {
                    return dataController.isLoading();
                },

                changingDuration: function() {
                    return dataController._changingDuration || 0;
                }
            }, dataAdapter));
        }
    }

    function getHiddenTotals(dataFields) {
        var result = [];
        iteratorUtils.each(dataFields, function(index, field) {
            if(field.showTotals === false) {
                result.push(index);
            }
        });
        return result;
    }

    function getHiddenValues(dataFields) {
        var result = [];

        dataFields.forEach(function(field, index) {
            if(field.showValues === undefined && field.showTotals === false || field.showValues === false) {
                result.push(index);
            }
        });

        return result;
    }

    function getHiddenGrandTotalsTotals(dataFields, columnFields) {
        var result = [];
        iteratorUtils.each(dataFields, function(index, field) {
            if(field.showGrandTotals === false) {
                result.push(index);
            }
        });

        if(columnFields.length === 0 && result.length === dataFields.length) {
            result = [];
        }

        return result;
    }

    var members = {
        ctor: function(options) {
            var that = this,
                virtualScrollControllerChanged = that._fireChanged.bind(that);

            options = that._options = options || {};

            that.dataSourceChanged = Callbacks();
            that._dataSource = that._createDataSource(options);

            that._rowsScrollController = createScrollController(that, options.component, {
                totalItemsCount: function() {
                    return that.totalRowCount();
                },
                pageIndex: function(index) {
                    return that.rowPageIndex(index);
                },
                pageSize: function() {
                    return that.rowPageSize();
                },

                load: function() {
                    if(that._rowsScrollController.pageIndex() >= this.pageCount()) {
                        that._rowsScrollController.pageIndex(this.pageCount() - 1);
                    }
                    return that._rowsScrollController.handleDataChanged(virtualScrollControllerChanged);
                }
            });

            that._columnsScrollController = createScrollController(that, options.component, {
                totalItemsCount: function() {
                    return that.totalColumnCount();
                },
                pageIndex: function(index) {
                    return that.columnPageIndex(index);
                },
                pageSize: function() {
                    return that.columnPageSize();
                },

                load: function() {
                    if(that._columnsScrollController.pageIndex() >= this.pageCount()) {
                        that._columnsScrollController.pageIndex(this.pageCount() - 1);
                    }

                    return that._columnsScrollController.handleDataChanged(virtualScrollControllerChanged);
                }

            });

            that._stateStoringController = new stateStoring.StateStoringController(options.component).init();

            that._columnsInfo = [];
            that._rowsInfo = [];
            that._cellsInfo = [];

            that.expandValueChanging = Callbacks();
            that.loadingChanged = Callbacks();
            that.progressChanged = Callbacks();
            that.scrollChanged = Callbacks();

            that.load();
            that._update();
            that.changed = Callbacks();
        },

        _fireChanged: function() {
            var that = this,
                startChanging = new Date();

            that.changed && !that._lockChanged && that.changed.fire();
            that._changingDuration = new Date() - startChanging;
        },

        load: function() {
            var that = this,
                stateStoringController = this._stateStoringController;

            if(stateStoringController.isEnabled() && !stateStoringController.isLoaded()) {
                stateStoringController.load().always(function(state) {
                    if(state) {
                        that._dataSource.state(state);
                    } else {
                        that._dataSource.load();
                    }
                });
            } else {
                that._dataSource.load();
            }
        },

        calculateVirtualContentParams: function(contentParams) {
            var that = this,
                rowsScrollController = that._rowsScrollController,
                columnsScrollController = that._columnsScrollController,
                rowViewportItemSize = contentParams.contentHeight / contentParams.rowCount,
                columnViewportItemSize = contentParams.contentWidth / contentParams.columnCount,
                oldColumnViewportItemSize,
                oldRowViewportItemSize,
                newLeftPosition,
                newTopPosition;

            if(rowsScrollController && columnsScrollController) {
                oldColumnViewportItemSize = columnsScrollController.viewportItemSize();
                oldRowViewportItemSize = rowsScrollController.viewportItemSize();

                rowsScrollController.viewportItemSize(rowViewportItemSize);
                columnsScrollController.viewportItemSize(columnViewportItemSize);

                rowsScrollController.viewportSize(contentParams.viewportHeight / rowsScrollController.viewportItemSize());
                rowsScrollController.setContentSize(contentParams.contentHeight);

                columnsScrollController.viewportSize(contentParams.viewportWidth / columnsScrollController.viewportItemSize());
                columnsScrollController.setContentSize(contentParams.contentWidth);

                commonUtils.deferUpdate(function() {
                    columnsScrollController.loadIfNeed();
                    rowsScrollController.loadIfNeed();
                });

                newLeftPosition = columnsScrollController.getViewportPosition() * columnViewportItemSize / oldColumnViewportItemSize;
                newTopPosition = rowsScrollController.getViewportPosition() * rowViewportItemSize / oldRowViewportItemSize;

                that.setViewportPosition(newLeftPosition, newTopPosition);

                that.scrollChanged.fire({
                    left: newLeftPosition,
                    top: newTopPosition
                });

                return {
                    contentTop: rowsScrollController.getContentOffset(),
                    contentLeft: columnsScrollController.getContentOffset(),
                    width: columnsScrollController.getVirtualContentSize(),
                    height: rowsScrollController.getVirtualContentSize()
                };
            }
        },

        setViewportPosition: function(left, top) {
            this._rowsScrollController.setViewportPosition(top || 0);
            this._columnsScrollController.setViewportPosition(left || 0);
        },

        subscribeToWindowScrollEvents: function($element) {
            this._rowsScrollController && this._rowsScrollController.subscribeToWindowScrollEvents($element);
        },

        updateWindowScrollPosition: function(position) {
            this._rowsScrollController && this._rowsScrollController.scrollTo(position);
        },

        updateViewOptions: function(options) {
            extend(this._options, options);
            this._update();
        },

        _handleExpandValueChanging: function(e) {
            this.expandValueChanging.fire(e);
        },
        _handleLoadingChanged: function(isLoading) {
            this.loadingChanged.fire(isLoading);
        },
        _handleProgressChanged: function(progress) {
            this.progressChanged.fire(progress);
        },
        _handleFieldsPrepared: function(e) {
            this._options.onFieldsPrepared && this._options.onFieldsPrepared(e);
        },
        _createDataSource: function(options) {
            var that = this,
                dataSourceOptions = options.dataSource,
                dataSource;

            that._isSharedDataSource = dataSourceOptions instanceof PivotGridDataSource;

            if(that._isSharedDataSource) {
                dataSource = dataSourceOptions;
            } else {
                dataSource = new PivotGridDataSource(dataSourceOptions);
            }

            that._expandValueChangingHandler = that._handleExpandValueChanging.bind(that);
            that._loadingChangedHandler = that._handleLoadingChanged.bind(that);
            that._progressChangedHandler = function(progress) {
                that._handleProgressChanged(progress * 0.8);
            };
            that._fieldsPreparedHandler = that._handleFieldsPrepared.bind(that);
            that._changedHandler = function() {
                that._update();
                that.dataSourceChanged.fire();
            };

            dataSource.on("changed", that._changedHandler);
            dataSource.on("expandValueChanging", that._expandValueChangingHandler);
            dataSource.on("loadingChanged", that._loadingChangedHandler);
            dataSource.on("progressChanged", that._progressChangedHandler);
            dataSource.on("fieldsPrepared", that._fieldsPreparedHandler);

            return dataSource;
        },

        getDataSource: function() {
            return this._dataSource;
        },
        isLoading: function() {
            return this._dataSource.isLoading();
        },
        beginLoading: function() {
            this._dataSource.beginLoading();
        },
        endLoading: function() {
            this._dataSource.endLoading();
        },
        _update: function() {
            var that = this,
                dataSource = that._dataSource,
                options = that._options,
                columnFields = dataSource.getAreaFields("column"),
                rowFields = dataSource.getAreaFields("row"),
                dataFields = dataSource.getAreaFields("data"),
                dataFieldsForRows = options.dataFieldArea === "row" ? dataFields : [],
                dataFieldsForColumns = options.dataFieldArea !== "row" ? dataFields : [],
                data = dataSource.getData(),
                hiddenTotals = getHiddenTotals(dataFields),
                hiddenValues = getHiddenValues(dataFields),
                hiddenGrandTotals = getHiddenGrandTotalsTotals(dataFields, columnFields),
                grandTotalsAreHiddenForNotAllDataFields = dataFields.length > 0 ? hiddenGrandTotals.length !== dataFields.length : true,
                notifyProgress = function(progress) {
                    this.progress = progress;
                    that._handleProgressChanged(0.8 + 0.1 * rowOptions.progress + 0.1 * columnOptions.progress);
                },
                rowOptions = {
                    isEmptyGrandTotal: data.isEmptyGrandTotalRow,
                    texts: options.texts || {},
                    hiddenTotals: hiddenTotals,
                    hiddenValues: hiddenValues,
                    hiddenGrandTotals: [],
                    showTotals: options.showRowTotals,
                    showGrandTotals: options.showRowGrandTotals !== false && grandTotalsAreHiddenForNotAllDataFields,
                    sortBySummaryPaths: createSortPaths(columnFields, dataFields),
                    showTotalsPrior: options.showTotalsPrior === "rows" || options.showTotalsPrior === "both",
                    showEmpty: !options.hideEmptySummaryCells,
                    layout: options.rowHeaderLayout,
                    fields: rowFields,
                    dataFields: dataFields,
                    progress: 0,
                    notifyProgress: notifyProgress
                },
                columnOptions = {
                    isEmptyGrandTotal: data.isEmptyGrandTotalColumn,
                    texts: options.texts || {},
                    hiddenTotals: hiddenTotals,
                    hiddenValues: hiddenValues,
                    hiddenGrandTotals: hiddenGrandTotals,
                    showTotals: options.showColumnTotals,
                    showTotalsPrior: options.showTotalsPrior === "columns" || options.showTotalsPrior === "both",
                    showGrandTotals: options.showColumnGrandTotals !== false && grandTotalsAreHiddenForNotAllDataFields,
                    sortBySummaryPaths: createSortPaths(rowFields, dataFields),
                    showEmpty: !options.hideEmptySummaryCells,
                    fields: columnFields,
                    dataFields: dataFields,
                    progress: 0,
                    notifyProgress: notifyProgress
                };

            if(!typeUtils.isDefined(data.grandTotalRowIndex)) {
                data.grandTotalRowIndex = getHeaderIndexedItems(data.rows, rowOptions).length;
            }
            if(!typeUtils.isDefined(data.grandTotalColumnIndex)) {
                data.grandTotalColumnIndex = getHeaderIndexedItems(data.columns, columnOptions).length;
            }

            dataSource._changeLoadingCount(1);

            when(
                createHeaderInfo(data.columns, columnFields, dataFieldsForColumns, true, columnOptions),
                createHeaderInfo(data.rows, rowFields, dataFieldsForRows, false, rowOptions)
            ).always(function() {
                dataSource._changeLoadingCount(-1);
            }).done(function(columnsInfo, rowsInfo) {
                that._columnsInfo = columnsInfo;
                that._rowsInfo = rowsInfo;

                if(that._rowsScrollController && that._columnsScrollController && that.changed) {
                    that._rowsScrollController.reset();
                    that._columnsScrollController.reset();

                    that._lockChanged = true;
                    that._rowsScrollController.load();
                    that._columnsScrollController.load();
                    that._lockChanged = false;
                }
            }).done(function() {
                that._fireChanged();
                if(that._stateStoringController.isEnabled() && !that._dataSource.isLoading()) {
                    that._stateStoringController.state(that._dataSource.state());
                    that._stateStoringController.save();
                }
            });
        },

        getRowsInfo: function(getAllData) {
            var that = this,
                rowsInfo = that._rowsInfo,
                scrollController = that._rowsScrollController,
                rowspan,
                i;

            if(scrollController && !getAllData) {
                var startIndex = scrollController.beginPageIndex() * that.rowPageSize(),
                    endIndex = scrollController.endPageIndex() * that.rowPageSize() + that.rowPageSize(),
                    newRowsInfo = [],
                    maxDepth = 1;

                foreachRowInfo(rowsInfo, function(rowInfo, visibleIndex, rowIndex, _, columnIndex) {
                    var isVisible = visibleIndex >= startIndex && rowIndex < endIndex,
                        index = rowIndex < startIndex ? 0 : rowIndex - startIndex,
                        cell = rowInfo;

                    if(isVisible) {
                        newRowsInfo[index] = newRowsInfo[index] || [];
                        rowspan = rowIndex < startIndex ? (rowInfo.rowspan - (startIndex - rowIndex)) || 1 : rowInfo.rowspan;

                        if(startIndex + index + rowspan > endIndex) {
                            rowspan = (endIndex - (index + startIndex)) || 1;
                        }

                        if(rowspan !== rowInfo.rowspan) {
                            cell = extend({}, cell, {
                                rowspan: rowspan
                            });
                        }

                        newRowsInfo[index].push(cell);

                        maxDepth = math.max(maxDepth, columnIndex + 1);
                    } else if(i > endIndex) {
                        return false;
                    }
                });

                foreachRowInfo(newRowsInfo, function(rowInfo, visibleIndex, rowIndex, columnIndex, realColumnIndex) {
                    var colspan = rowInfo.colspan || 1;

                    if(realColumnIndex + colspan > maxDepth) {
                        newRowsInfo[rowIndex][columnIndex] = extend({}, rowInfo, {
                            colspan: (maxDepth - realColumnIndex) || 1
                        });
                    }
                });

                return newRowsInfo;
            }

            return rowsInfo;
        },

        getColumnsInfo: function(getAllData) {
            var that = this,
                info = that._columnsInfo,
                scrollController = that._columnsScrollController;

            if(scrollController && !getAllData) {
                var startIndex = scrollController.beginPageIndex() * that.columnPageSize(),
                    endIndex = scrollController.endPageIndex() * that.columnPageSize() + that.columnPageSize();

                info = virtualColumnsCore.createColumnsInfo(info, startIndex, endIndex);
            }

            return info;
        },

        totalRowCount: function() {
            return this._rowsInfo.length;
        },

        rowPageIndex: function(index) {
            if(index !== undefined) {
                this._rowPageIndex = index;
            }
            return this._rowPageIndex || 0;
        },

        totalColumnCount: function() {
            var count = 0;
            if(this._columnsInfo && this._columnsInfo.length) {
                for(var i = 0; i < this._columnsInfo[0].length; i++) {
                    count += this._columnsInfo[0][i].colspan || 1;
                }
            }

            return count;
        },

        rowPageSize: function(size) {
            if(size !== undefined) {
                this._rowPageSize = size;
            }
            return this._rowPageSize || 20;
        },

        columnPageSize: function(size) {
            if(size !== undefined) {
                this._columnPageSize = size;
            }
            return this._columnPageSize || 20;
        },

        columnPageIndex: function(index) {
            if(index !== undefined) {
                this._columnPageIndex = index;
            }
            return this._columnPageIndex || 0;
        },

        getCellsInfo: function(getAllData) {
            var rowsInfo = this.getRowsInfo(getAllData),
                columnsInfo = this.getColumnsInfo(getAllData),
                data = this._dataSource.getData(),
                texts = this._options.texts || {};

            return createCellsInfo(rowsInfo, columnsInfo, data, this._dataSource.getAreaFields("data"), this._options.dataFieldArea, texts.dataNotAvailable);
        },

        dispose: function() {
            var that = this;
            if(that._isSharedDataSource) {
                that._dataSource.off("changed", that._changedHandler);
                that._dataSource.off("expandValueChanging", that._expandValueChangingHandler);
                that._dataSource.off("loadingChanged", that._loadingChangedHandler);
                that._dataSource.off("progressChanged", that._progressChangedHandler);
            } else {
                that._dataSource.dispose();
            }

            that._columnsScrollController && that._columnsScrollController.dispose();
            that._rowsScrollController && that._rowsScrollController.dispose();

            that._stateStoringController.dispose();

            that.expandValueChanging.empty();
            that.changed.empty();
            that.loadingChanged.empty();
            that.progressChanged.empty();
            that.scrollChanged.empty();
            that.dataSourceChanged.empty();
        }
    };

    proxyMethod(members, "applyPartialDataSource");
    proxyMethod(members, "collapseHeaderItem");
    proxyMethod(members, "expandHeaderItem");
    proxyMethod(members, "getData");
    proxyMethod(members, "isEmpty");

    return members;
})());
