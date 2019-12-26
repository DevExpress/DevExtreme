import Callbacks from '../../core/utils/callbacks';
import { when, Deferred } from '../../core/utils/deferred';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import iteratorUtils from '../../core/utils/iterator';
import Class from '../../core/class';
import stringUtils from '../../core/utils/string';
import commonUtils from '../../core/utils/common';
import { isDefined, isString } from '../../core/utils/type';
import virtualScrolling from '../grid_core/ui.grid_core.virtual_scrolling_core';
import virtualColumnsCore from '../grid_core/ui.grid_core.virtual_columns_core';
import stateStoring from '../grid_core/ui.grid_core.state_storing_core';
import PivotGridDataSource from './data_source';
import pivotGridUtils, {
    foreachTree,
    foreachTreeAsync,
    createPath,
    formatValue
} from './ui.pivot_grid.utils';

const math = Math;
const GRAND_TOTAL_TYPE = 'GT';
const TOTAL_TYPE = 'T';
const DATA_TYPE = 'D';
const NOT_AVAILABLE = '#N/A';
const CHANGING_DURATION_IF_PAGINATE = 300;

const proxyMethod = function(instance, methodName, defaultResult) {
    if(!instance[methodName]) {
        instance[methodName] = function() {
            const dataSource = this._dataSource;
            return dataSource ? dataSource[methodName].apply(dataSource, arguments) : defaultResult;
        };
    }
};

exports.DataController = Class.inherit((function() {

    function getHeaderItemText(item, description, options) {
        let text = item.text;

        if(isDefined(item.displayText)) {
            text = item.displayText;
        } else if(isDefined(item.caption)) {
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

    const createHeaderInfo = (function() {
        const getHeaderItemsDepth = function(headerItems) {
            let depth = 0;

            foreachTree(headerItems, function(items) {
                depth = math.max(depth, items.length);
            });

            return depth;
        };

        const createInfoItem = function(headerItem, breadth, isHorizontal, isTree) {
            /**
            * @name dxPivotGridPivotGridCell
            * @type object
            */
            const infoItem = {
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
            if(isDefined(headerItem.wordWrapEnabled)) {
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
            if(isDefined(headerItem.expanded)) {
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

        const addInfoItem = function(info, options) {
            const breadth = (options.lastIndex - options.index) || 1;
            const addInfoItemCore = function(info, infoItem, itemIndex, depthIndex, isHorizontal) {
                const index = isHorizontal ? depthIndex : itemIndex;
                while(!info[index]) {
                    info.push([]);
                }
                if(isHorizontal) {
                    info[index].push(infoItem);
                } else {
                    info[index].unshift(infoItem);
                }
            };

            const itemInfo = createInfoItem(options.headerItem, breadth, options.isHorizontal, options.isTree);
            addInfoItemCore(info, itemInfo, options.index, options.depth, options.isHorizontal);
            if(!options.headerItem.children || options.headerItem.children.length === 0) {
                return options.lastIndex + 1;
            }
            return options.lastIndex;
        };

        const isItemSorted = function(items, sortBySummaryPath) {
            let path;
            const item = items[0];
            const stringValuesUsed = isString(sortBySummaryPath[0]);
            const headerItem = item.dataIndex >= 0 ? items[1] : item;

            if((stringValuesUsed && sortBySummaryPath[0].indexOf('&[') !== -1 && headerItem.key) || !headerItem.key) {
                path = createPath(items);
            } else {
                path = iteratorUtils.map(items, function(item) { return item.dataIndex >= 0 ? item.value : item.text; }).reverse();
            }

            if(item.type === GRAND_TOTAL_TYPE) {
                path = path.slice(1);
            }

            return path.join('/') === sortBySummaryPath.join('/');
        };

        const getViewHeaderItems = function(headerItems, headerDescriptions, cellDescriptions, depthSize, options) {
            const cellDescriptionsCount = cellDescriptions.length;
            const viewHeaderItems = createViewHeaderItems(headerItems, headerDescriptions);
            const dataFields = options.dataFields;
            const d = new Deferred();

            when(viewHeaderItems).done(function(viewHeaderItems) {
                options.notifyProgress(0.5);

                if(options.showGrandTotals) {
                    viewHeaderItems[!options.showTotalsPrior ? 'push' : 'unshift']({
                        type: GRAND_TOTAL_TYPE,
                        isEmpty: options.isEmptyGrandTotal
                    });
                }

                const hideTotals = options.showTotals === false || dataFields.length > 0 && (dataFields.length === options.hiddenTotals.length);
                const hideData = dataFields.length > 0 && options.hiddenValues.length === dataFields.length;

                if(hideData && hideTotals) {
                    depthSize = 1;
                }

                if(!hideTotals || options.layout === 'tree') {
                    addAdditionalTotalHeaderItems(viewHeaderItems, headerDescriptions, options.showTotalsPrior, options.layout === 'tree');
                }

                when(foreachTreeAsync(viewHeaderItems, function(items) {
                    const item = items[0];

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
                        const item = items[0];
                        const isMetric = item.isMetric;
                        const field = headerDescriptions[items.length - 1] || {};

                        if(item.type === DATA_TYPE && !isMetric) {
                            item.width = field.width;
                        }

                        if(hideData === true && item.type === DATA_TYPE) {
                            const parentChildren = (items[1] ? items[1].children : viewHeaderItems) || [];

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
                                if(!isDefined(item.dataIndex)) {
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
            const parent = childrenStack[depth] = childrenStack[depth] || [];
            const node = parent[index] = {};


            if(childrenStack[depth + 1]) {
                node.children = childrenStack[depth + 1];
                // T541266
                for(let i = depth + 1; i < childrenStack.length; i++) {
                    childrenStack[i] = undefined;
                }
                childrenStack.length = depth + 1;
            }

            return node;
        }

        function createViewHeaderItems(headerItems, headerDescriptions) {
            const headerDescriptionsCount = (headerDescriptions && headerDescriptions.length) || 0;
            const childrenStack = [];
            const d = new Deferred();
            let headerItem;

            when(foreachTreeAsync(headerItems, function(items, index) {
                const item = items[0];
                const path = createPath(items);

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

        function addMetricHeaderItems(headerItems, cellDescriptions, options) {
            foreachTree(headerItems, function(items) {
                const item = items[0];
                let i;

                if(!item.children || item.children.length === 0) {

                    item.children = [];
                    for(i = 0; i < cellDescriptions.length; i++) {
                        const isGrandTotal = item.type === GRAND_TOTAL_TYPE;
                        const isTotal = item.type === TOTAL_TYPE;
                        const isValue = item.type === DATA_TYPE;
                        const columnIsHidden = cellDescriptions[i].visible === false ||
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
        }

        function addAdditionalTotalHeaderItems(headerItems, headerDescriptions, showTotalsPrior, isTree) {
            showTotalsPrior = showTotalsPrior || isTree;

            foreachTree(headerItems, function(items, index) {
                const item = items[0];
                const parentChildren = (items[1] ? items[1].children : headerItems) || [];
                const dataField = headerDescriptions[items.length - 1];

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
        }

        const removeEmptyParent = function(items, index) {
            const parent = items[index + 1];

            if(!items[index].children.length && parent && parent.children) {
                parent.children.splice(inArray(items[index], parent.children), 1);
                removeEmptyParent(items, index + 1);
            }

        };

        function removeHiddenItems(headerItems) {
            foreachTree([{ children: headerItems }], function(items, index) {
                const item = items[0];
                const parentChildren = (items[1] ? items[1].children : headerItems) || [];
                let isEmpty = item.isEmpty;

                if(isEmpty && isEmpty.length) {
                    isEmpty = item.isEmpty.filter(function(isEmpty) { return isEmpty; }).length === isEmpty.length;
                }

                if(item && !item.children && isEmpty) {
                    parentChildren.splice(index, 1);
                    removeEmptyParent(items, 1);
                }
            });
        }

        const fillHeaderInfo = function(info, viewHeaderItems, depthSize, isHorizontal, isTree) {
            let lastIndex = 0;
            let index;
            let depth;
            const indexesByDepth = [0];

            foreachTree(viewHeaderItems, function(items) {
                const headerItem = items[0];
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
            const info = [];
            const depthSize = getHeaderItemsDepth(headerItems) || 1;
            const d = new Deferred();

            getViewHeaderItems(headerItems, headerDescriptions, cellDescriptions, depthSize, options).done(function(viewHeaderItems) {
                fillHeaderInfo(info, viewHeaderItems, depthSize, isHorizontal, options.layout === 'tree');
                options.notifyProgress(1);
                d.resolve(info);
            });

            return d;
        };
    })();

    function createSortPaths(headerFields, dataFields) {
        const sortBySummaryPaths = [];

        iteratorUtils.each(headerFields, function(index, headerField) {
            const fieldIndex = pivotGridUtils.findField(dataFields, headerField.sortBySummaryField);
            if(fieldIndex >= 0) {
                sortBySummaryPaths.push((headerField.sortBySummaryPath || []).concat([fieldIndex]));
            }
        });
        return sortBySummaryPaths;
    }

    function foreachRowInfo(rowsInfo, callback) {
        let columnOffset = 0;
        const columnOffsetResetIndexes = [];

        for(let i = 0; i < rowsInfo.length; i++) {
            for(let j = 0; j < rowsInfo[i].length; j++) {
                const rowSpanOffset = (rowsInfo[i][j].rowspan || 1) - 1;
                const visibleIndex = i + rowSpanOffset;

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
        const info = [];
        const dataFieldAreaInRows = dataFieldArea === 'row';
        const dataSourceCells = data.values;

        dataSourceCells.length && foreachRowInfo(rowsInfo, function(rowInfo, rowIndex) {
            const row = info[rowIndex] = [];
            const dataRow = dataSourceCells[rowInfo.dataSourceIndex >= 0 ? rowInfo.dataSourceIndex : data.grandTotalRowIndex] || [];

            rowInfo.isLast && virtualColumnsCore.foreachColumnInfo(columnsInfo, function(columnInfo, columnIndex) {
                const dataIndex = (dataFieldAreaInRows ? rowInfo.dataIndex : columnInfo.dataIndex) || 0;
                const dataField = dataFields[dataIndex];

                if(columnInfo.isLast && dataField) {
                    let cell = dataRow[columnInfo.dataSourceIndex >= 0 ? columnInfo.dataSourceIndex : data.grandTotalColumnIndex];

                    if(!Array.isArray(cell)) {
                        cell = [cell];
                    }

                    const cellValue = cell[dataIndex];

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
        let visibleIndex = 0;
        const indexedItems = [];

        foreachTree(headerItems, function(items) {
            const headerItem = items[0];
            const path = createPath(items);

            if(headerItem.children && options.showTotals === false) return;

            const indexedItem = extend(true, {}, headerItem, {
                visibleIndex: visibleIndex++,
                path: path
            });

            if(isDefined(indexedItem.index)) {
                indexedItems[indexedItem.index] = indexedItem;
            } else {
                indexedItems.push(indexedItem);
            }
        });
        return indexedItems;
    }

    function createScrollController(dataController, component, dataAdapter) {
        if(component && component.option('scrolling.mode') === 'virtual') {
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
                    const dataSource = dataController._dataSource;
                    if(dataSource.paginate()) {
                        return CHANGING_DURATION_IF_PAGINATE;
                    }
                    return dataController._changingDuration || 0;
                }
            }, dataAdapter));
        }
    }

    function getHiddenTotals(dataFields) {
        const result = [];
        iteratorUtils.each(dataFields, function(index, field) {
            if(field.showTotals === false) {
                result.push(index);
            }
        });
        return result;
    }

    function getHiddenValues(dataFields) {
        const result = [];

        dataFields.forEach(function(field, index) {
            if(field.showValues === undefined && field.showTotals === false || field.showValues === false) {
                result.push(index);
            }
        });

        return result;
    }

    function getHiddenGrandTotalsTotals(dataFields, columnFields) {
        let result = [];
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

    const members = {
        ctor: function(options) {
            const that = this;
            const virtualScrollControllerChanged = that._fireChanged.bind(that);

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
                    return that._rowsScrollController.handleDataChanged(function() {
                        if(that._dataSource.paginate()) {
                            that._dataSource.load();
                        } else {
                            virtualScrollControllerChanged.apply(this, arguments);
                        }
                    });
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

                    return that._columnsScrollController.handleDataChanged(function() {
                        if(that._dataSource.paginate()) {
                            that._dataSource.load();
                        } else {
                            virtualScrollControllerChanged.apply(this, arguments);
                        }
                    });
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
            const that = this;
            const startChanging = new Date();

            that.changed && !that._lockChanged && that.changed.fire();
            that._changingDuration = new Date() - startChanging;
        },

        _correctSkipsTakes: function(rowIndex, rowSkip, rowSpan, levels, skips, takes) {
            const endIndex = rowSpan ? rowIndex + rowSpan - 1 : rowIndex;
            skips[levels.length] = skips[levels.length] || 0;
            takes[levels.length] = takes[levels.length] || 0;
            if(endIndex < rowSkip) {
                skips[levels.length]++;
            } else {
                takes[levels.length]++;
            }
        },

        _calculatePagingForRowExpandedPaths: function(options, skips, takes, rowExpandedSkips, rowExpandedTakes) {
            const rows = this._rowsInfo;
            const rowCount = Math.min(options.rowSkip + options.rowTake, rows.length);
            const rowExpandedPaths = options.rowExpandedPaths;
            let levels = [];
            const expandedPathIndexes = {};
            let i;
            let j;
            let path;

            rowExpandedPaths.forEach((path, index) => {
                expandedPathIndexes[path] = index;
            });

            for(i = 0; i < rowCount; i++) {
                takes.length = skips.length = levels.length + 1;
                for(j = 0; j < rows[i].length; j++) {
                    const cell = rows[i][j];

                    if(cell.type === 'D') {
                        this._correctSkipsTakes(i, options.rowSkip, cell.rowspan, levels, skips, takes);

                        path = cell.path || path;
                        const expandIndex = path && path.length > 1 ? expandedPathIndexes[path.slice(0, -1)] : -1;

                        if(expandIndex >= 0) {
                            rowExpandedSkips[expandIndex] = skips[levels.length] || 0;
                            rowExpandedTakes[expandIndex] = takes[levels.length] || 0;
                        }

                        if(cell.rowspan) {
                            levels.push(cell.rowspan);
                        }
                    }
                }
                levels = levels.map(level => level - 1).filter(level => level > 0);
            }
        },

        _calculatePagingForColumnExpandedPaths: function(options, skips, takes, expandedSkips, expandedTakes) {
            const skipByPath = {};
            const takeByPath = {};

            virtualColumnsCore.foreachColumnInfo(this._columnsInfo, function(columnInfo, columnIndex) {
                if(columnInfo.type === 'D' && columnInfo.path && columnInfo.dataIndex === undefined) {
                    const colspan = columnInfo.colspan || 1;
                    const path = columnInfo.path.slice(0, -1).toString();

                    skipByPath[path] = skipByPath[path] || 0;
                    takeByPath[path] = takeByPath[path] || 0;

                    if(columnIndex + colspan <= options.columnSkip) {
                        skipByPath[path]++;
                    } else if(columnIndex < options.columnSkip + options.columnTake) {
                        takeByPath[path]++;
                    }
                }
            });

            skips[0] = skipByPath[[]];
            takes[0] = takeByPath[[]];

            options.columnExpandedPaths.forEach(function(path, index) {
                const skip = skipByPath[path];
                const take = takeByPath[path];

                if(skip !== undefined) {
                    expandedSkips[index] = skip;
                }
                if(take !== undefined) {
                    expandedTakes[index] = take;
                }
            });
        },

        _processPagingForExpandedPaths: function(options, area, storeLoadOptions, reload) {
            const expandedPaths = options[area + 'ExpandedPaths'];
            const expandedSkips = expandedPaths.map(() => 0);
            const expandedTakes = expandedPaths.map(() => reload ? options.pageSize : 0);
            const skips = [];
            const takes = [];

            if(!reload) {
                if(area === 'row') {
                    this._calculatePagingForRowExpandedPaths(options, skips, takes, expandedSkips, expandedTakes);
                } else {
                    this._calculatePagingForColumnExpandedPaths(options, skips, takes, expandedSkips, expandedTakes);
                }
            }
            this._savePagingForExpandedPaths(options, area, storeLoadOptions, skips[0], takes[0], expandedSkips, expandedTakes);
        },

        _savePagingForExpandedPaths: function(options, area, storeLoadOptions, skip, take, expandedSkips, expandedTakes) {
            const expandedPaths = options[area + 'ExpandedPaths'];

            options[area + 'ExpandedPaths'] = [];
            options[area + 'Skip'] = skip !== undefined ? skip : options[area + 'Skip'];
            options[area + 'Take'] = take !== undefined ? take : options[area + 'Take'];

            for(let i = 0; i < expandedPaths.length; i++) {
                if(expandedTakes[i]) {
                    const isOppositeArea = options.area && options.area !== area;

                    storeLoadOptions.push(extend({
                        area: area,
                        headerName: area + 's'
                    }, options, {
                        [area + 'Skip']: expandedSkips[i],
                        [area + 'Take']: expandedTakes[i],
                        [isOppositeArea ? 'oppositePath' : 'path']: expandedPaths[i]
                    }));
                }
            }
        },

        _handleCustomizeStoreLoadOptions: function(storeLoadOptions, reload) {
            const options = storeLoadOptions[0];
            const rowsScrollController = this._rowsScrollController;

            if(this._dataSource.paginate() && rowsScrollController) {
                const rowPageSize = rowsScrollController._dataSource.pageSize();

                if(options.headerName === 'rows') {
                    options.rowSkip = 0;
                    options.rowTake = rowPageSize;
                    options.rowExpandedPaths = [];
                } else {
                    options.rowSkip = rowsScrollController.beginPageIndex() * rowPageSize;
                    options.rowTake = (rowsScrollController.endPageIndex() - rowsScrollController.beginPageIndex() + 1) * rowPageSize;
                    this._processPagingForExpandedPaths(options, 'row', storeLoadOptions, reload);
                }
            }

            const columnsScrollController = this._columnsScrollController;

            if(this._dataSource.paginate() && columnsScrollController) {
                const columnPageSize = columnsScrollController._dataSource.pageSize();
                storeLoadOptions.forEach((options, index) => {
                    if(options.headerName === 'columns') {
                        options.columnSkip = 0;
                        options.columnTake = columnPageSize;
                        options.columnExpandedPaths = [];
                    } else {
                        options.columnSkip = columnsScrollController.beginPageIndex() * columnPageSize;
                        options.columnTake = (columnsScrollController.endPageIndex() - columnsScrollController.beginPageIndex() + 1) * columnPageSize;
                        this._processPagingForExpandedPaths(options, 'column', storeLoadOptions, reload);
                    }
                });
            }
        },

        load: function() {
            const that = this;
            const stateStoringController = this._stateStoringController;

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
            const that = this;
            const rowsScrollController = that._rowsScrollController;
            const columnsScrollController = that._columnsScrollController;

            if(rowsScrollController && columnsScrollController) {
                rowsScrollController.viewportItemSize(contentParams.virtualRowHeight);
                rowsScrollController.viewportSize(contentParams.viewportHeight / rowsScrollController.viewportItemSize());
                rowsScrollController.setContentSize(contentParams.itemHeights);

                columnsScrollController.viewportItemSize(contentParams.virtualColumnWidth);
                columnsScrollController.viewportSize(contentParams.viewportWidth / columnsScrollController.viewportItemSize());
                columnsScrollController.setContentSize(contentParams.itemWidths);

                commonUtils.deferUpdate(function() {
                    columnsScrollController.loadIfNeed();
                    rowsScrollController.loadIfNeed();
                });

                that.scrollChanged.fire({
                    left: columnsScrollController.getViewportPosition(),
                    top: rowsScrollController.getViewportPosition()
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
            const that = this;
            const dataSourceOptions = options.dataSource;
            let dataSource;

            that._isSharedDataSource = dataSourceOptions instanceof PivotGridDataSource;

            if(that._isSharedDataSource) {
                dataSource = dataSourceOptions;
            } else {
                dataSource = new PivotGridDataSource(dataSourceOptions);
            }

            that._expandValueChangingHandler = that._handleExpandValueChanging.bind(that);
            that._loadingChangedHandler = that._handleLoadingChanged.bind(that);
            that._fieldsPreparedHandler = that._handleFieldsPrepared.bind(that);
            that._customizeStoreLoadOptionsHandler = that._handleCustomizeStoreLoadOptions.bind(that);
            that._changedHandler = function() {
                that._update();
                that.dataSourceChanged.fire();
            };
            that._progressChangedHandler = function(progress) {
                that._handleProgressChanged(progress * 0.8);
            };

            dataSource.on('changed', that._changedHandler);
            dataSource.on('expandValueChanging', that._expandValueChangingHandler);
            dataSource.on('loadingChanged', that._loadingChangedHandler);
            dataSource.on('progressChanged', that._progressChangedHandler);
            dataSource.on('fieldsPrepared', that._fieldsPreparedHandler);
            dataSource.on('customizeStoreLoadOptions', that._customizeStoreLoadOptionsHandler);

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
            const that = this;
            const dataSource = that._dataSource;
            const options = that._options;
            const columnFields = dataSource.getAreaFields('column');
            const rowFields = dataSource.getAreaFields('row');
            const dataFields = dataSource.getAreaFields('data');
            const dataFieldsForRows = options.dataFieldArea === 'row' ? dataFields : [];
            const dataFieldsForColumns = options.dataFieldArea !== 'row' ? dataFields : [];
            const data = dataSource.getData();
            const hiddenTotals = getHiddenTotals(dataFields);
            const hiddenValues = getHiddenValues(dataFields);
            const hiddenGrandTotals = getHiddenGrandTotalsTotals(dataFields, columnFields);
            const grandTotalsAreHiddenForNotAllDataFields = dataFields.length > 0 ? hiddenGrandTotals.length !== dataFields.length : true;

            const rowOptions = {
                isEmptyGrandTotal: data.isEmptyGrandTotalRow,
                texts: options.texts || {},
                hiddenTotals: hiddenTotals,
                hiddenValues: hiddenValues,
                hiddenGrandTotals: [],
                showTotals: options.showRowTotals,
                showGrandTotals: options.showRowGrandTotals !== false && grandTotalsAreHiddenForNotAllDataFields,
                sortBySummaryPaths: createSortPaths(columnFields, dataFields),
                showTotalsPrior: options.showTotalsPrior === 'rows' || options.showTotalsPrior === 'both',
                showEmpty: !options.hideEmptySummaryCells,
                layout: options.rowHeaderLayout,
                fields: rowFields,
                dataFields: dataFields,
                progress: 0
            };
            const columnOptions = {
                isEmptyGrandTotal: data.isEmptyGrandTotalColumn,
                texts: options.texts || {},
                hiddenTotals: hiddenTotals,
                hiddenValues: hiddenValues,
                hiddenGrandTotals: hiddenGrandTotals,
                showTotals: options.showColumnTotals,
                showTotalsPrior: options.showTotalsPrior === 'columns' || options.showTotalsPrior === 'both',
                showGrandTotals: options.showColumnGrandTotals !== false && grandTotalsAreHiddenForNotAllDataFields,
                sortBySummaryPaths: createSortPaths(rowFields, dataFields),
                showEmpty: !options.hideEmptySummaryCells,
                fields: columnFields,
                dataFields: dataFields,
                progress: 0
            };

            const notifyProgress = function(progress) {
                this.progress = progress;
                that._handleProgressChanged(0.8 + 0.1 * rowOptions.progress + 0.1 * columnOptions.progress);
            };

            rowOptions.notifyProgress = notifyProgress;
            columnOptions.notifyProgress = notifyProgress;

            if(!isDefined(data.grandTotalRowIndex)) {
                data.grandTotalRowIndex = getHeaderIndexedItems(data.rows, rowOptions).length;
            }
            if(!isDefined(data.grandTotalColumnIndex)) {
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

                if(that._rowsScrollController && that._columnsScrollController && that.changed && !that._dataSource.paginate()) {
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
            const that = this;
            const rowsInfo = that._rowsInfo;
            const scrollController = that._rowsScrollController;
            let rowspan;
            let i;

            if(scrollController && !getAllData) {
                const startIndex = scrollController.beginPageIndex() * that.rowPageSize();
                const endIndex = scrollController.endPageIndex() * that.rowPageSize() + that.rowPageSize();
                const newRowsInfo = [];
                let maxDepth = 1;

                foreachRowInfo(rowsInfo, function(rowInfo, visibleIndex, rowIndex, _, columnIndex) {
                    const isVisible = visibleIndex >= startIndex && rowIndex < endIndex;
                    const index = rowIndex < startIndex ? 0 : rowIndex - startIndex;
                    let cell = rowInfo;

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
                    const colspan = rowInfo.colspan || 1;

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
            const that = this;
            let info = that._columnsInfo;
            const scrollController = that._columnsScrollController;

            if(scrollController && !getAllData) {
                const startIndex = scrollController.beginPageIndex() * that.columnPageSize();
                const endIndex = scrollController.endPageIndex() * that.columnPageSize() + that.columnPageSize();

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
            let count = 0;
            if(this._columnsInfo && this._columnsInfo.length) {
                for(let i = 0; i < this._columnsInfo[0].length; i++) {
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
            const rowsInfo = this.getRowsInfo(getAllData);
            const columnsInfo = this.getColumnsInfo(getAllData);
            const data = this._dataSource.getData();
            const texts = this._options.texts || {};

            return createCellsInfo(rowsInfo, columnsInfo, data, this._dataSource.getAreaFields('data'), this._options.dataFieldArea, texts.dataNotAvailable);
        },

        dispose: function() {
            const that = this;
            if(that._isSharedDataSource) {
                that._dataSource.off('changed', that._changedHandler);
                that._dataSource.off('expandValueChanging', that._expandValueChangingHandler);
                that._dataSource.off('loadingChanged', that._loadingChangedHandler);
                that._dataSource.off('progressChanged', that._progressChangedHandler);
                that._dataSource.off('fieldsPrepared', that._fieldsPreparedHandler);
                that._dataSource.off('customizeStoreLoadOptions', that._customizeStoreLoadOptionsHandler);
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

    proxyMethod(members, 'applyPartialDataSource');
    proxyMethod(members, 'collapseHeaderItem');
    proxyMethod(members, 'expandHeaderItem');
    proxyMethod(members, 'getData');
    proxyMethod(members, 'isEmpty');

    return members;
})());
