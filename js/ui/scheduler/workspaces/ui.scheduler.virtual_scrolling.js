import { isFunction } from '../../../core/utils/type';

const ROW_HEIGHT = 50;

export default class VirtualScrolling {
    constructor(workspace, viewportHeight, scrollable) {
        this._workspace = workspace;
        this._viewportHeight = viewportHeight;
        this._scrollable = scrollable;

        this._init();
    }

    // TODO get rid of the workspace
    getWorkspace() {
        return this._workspace;
    }

    getViewportHeight() {
        return this._viewportHeight;
    }

    getScrollable() {
        return this._scrollable;
    }

    getRowHeight() {
        return ROW_HEIGHT;
    }

    getState() {
        return this._state;
    }

    getLayoutMap() {
        return this.getState().layoutMap;
    }

    _setLayoutMap(layoutMap) {
        return this._state.layoutMap = layoutMap;
    }

    _init() {
        const pageSize = Math.ceil(this.getViewportHeight() / this.getRowHeight());
        const scrollOffset = {
            top: 0,
            left: 0
        };

        this._state = {
            pageSize: pageSize,
            scrollOffset: scrollOffset,
            startIndex: -1,
            rowCount: 0,
            topVirtualRowCount: 0,
            bottomVirtualRowCount: 0,
            layoutMap: {
                topVirtualRowHeight: 0,
                dataItems: [],
                bottomVirtualRowHeight: 0
            }
        };

        this._updateState(scrollOffset);

        this._attachScrollableEvent();
    }

    _attachScrollableEvent() {
        const scrollable = this.getScrollable();
        const onScroll = scrollable.option('onScroll');
        scrollable.option('onScroll', e => {
            if(onScroll) {
                onScroll.apply(scrollable, [e]);
            }

            const scrollOffset = e?.scrollOffset;
            if(scrollOffset && this._updateState(scrollOffset)) {
                // Renovative render
            }
        });
    }

    _updateState(scrollOffset) {
        const workspace = this.getWorkspace();
        const state = this.getState();
        const top = scrollOffset.top;
        const currentStartIndex = state.startIndex;
        const rowHeight = this.getRowHeight();

        state.scrollOffset = scrollOffset;
        state.startIndex = Math.floor(top / rowHeight);

        if(currentStartIndex !== state.startIndex) {
            const pageSize = state.pageSize;
            const groupCount = workspace._getGroupCount();

            const totalRowCount = workspace._getTotalRowCount(groupCount);
            const topVirtualRowCount = Math.floor(top / rowHeight);
            const deltaRowCount = totalRowCount - topVirtualRowCount;
            const rowCount = deltaRowCount >= pageSize ? pageSize : deltaRowCount;
            const bottomVirtualRowCount = totalRowCount - topVirtualRowCount - rowCount;

            state.topVirtualRowCount = topVirtualRowCount;
            state.rowCount = rowCount;
            state.bottomVirtualRowCount = bottomVirtualRowCount;

            this._updateLayoutMap();

            this._validateState();

            return true;
        }

        return false;
    }

    _updateLayoutMap() {
        const workspace = this.getWorkspace();
        const groupCount = workspace._getGroupCount();
        const options = {
            cellCount: workspace._getTotalCellCount(groupCount),
            cellClass: workspace._getDateTableCellClass.bind(workspace),
            rowClass: workspace._getDateTableRowClass(),
            cellTemplate: workspace.option('dataCellTemplate'),
            getCellData: workspace._getCellData.bind(workspace),
            allDayElements: workspace._insertAllDayRowsIntoDateTable() ? workspace._allDayPanels : undefined,
            groupCount: groupCount,
            groupByDate: workspace.option('groupByDate')
        };

        this._updateLayoutMapCore(options);
    }

    _updateLayoutMapCore(options) {
        const state = this.getState();
        const rowHeight = this.getRowHeight();
        const topVirtualRowCount = state.topVirtualRowCount;
        const bottomVirtualRowCount = state.bottomVirtualRowCount;
        const dataRowCount = state.rowCount;

        let rowCountInGroup = dataRowCount;
        if(options.groupCount) {
            rowCountInGroup = dataRowCount / options.groupCount;
        }

        const layoutMap = this.getLayoutMap();
        let dataItems = layoutMap.dataItems.slice(0, dataRowCount);

        const prevTopVirtualRowHeight = layoutMap.topVirtualRowHeight;
        const prevBottomVirtualRowHeight = layoutMap.bottomVirtualRowHeight;
        const topVirtualRowHeight = rowHeight * topVirtualRowCount;
        const bottomVirtualRowHeight = rowHeight * bottomVirtualRowCount;

        let addRowCount = 0;
        const isAppend = prevTopVirtualRowHeight < topVirtualRowHeight;
        const isPrepend = prevBottomVirtualRowHeight < bottomVirtualRowHeight;
        const needAddRows = isAppend || isPrepend;

        if(needAddRows) {
            if(isAppend) {
                addRowCount = Math.ceil((topVirtualRowHeight - prevTopVirtualRowHeight) / rowHeight);
            } else {
                addRowCount = Math.ceil((bottomVirtualRowHeight - prevBottomVirtualRowHeight) / rowHeight);
            }

            addRowCount = Math.min(addRowCount, dataRowCount);

            dataItems = this._populateLayoutMap(options, dataItems, addRowCount, rowCountInGroup, isAppend);

            layoutMap.dataItems = dataItems;
            layoutMap.topVirtualRowHeight = topVirtualRowHeight;
            layoutMap.bottomVirtualRowHeight = bottomVirtualRowHeight;
        }
    }

    _populateLayoutMap(options, dataItems, addRowCount, rowCountInGroup, isAppend) {
        const state = this.getState();
        const dataRowCount = state.rowCount;
        const topVirtualRowCount = state.topVirtualRowCount;
        const isEmptyData = dataItems.length === 0;

        if(!isEmptyData) {
            let deltaRowCount = 0;
            if(dataRowCount > dataItems.length) {
                deltaRowCount = dataRowCount - dataItems.length;
            }

            if(isAppend) {
                dataItems = dataItems.slice(addRowCount);
            } else {
                dataItems.splice(-addRowCount);
            }

            addRowCount += deltaRowCount;
        }

        if(isAppend) {
            for(let index = 0; index < addRowCount; ++index) {
                const rowIndex = dataItems.length + topVirtualRowCount;
                const rowModel = this._createLayoutMapRow(options, rowIndex, rowCountInGroup);
                dataItems.push(rowModel);
            }
        } else {
            const startIndex = state.startIndex;
            const prependRows = new Array(addRowCount);
            for(let index = addRowCount - 1; index >= 0; --index) {
                const rowIndex = startIndex + index;
                const rowModel = this._createLayoutMapRow(options, rowIndex, rowCountInGroup);
                prependRows[index] = rowModel;
            }

            dataItems = [...prependRows, ...dataItems];
        }

        return dataItems;
    }

    _createLayoutMapRow(options, rowIndex, rowCountInGroup) {
        const cells = this._populateLayoutMapCells(options, rowIndex);
        const isLastRowInGroup = (rowIndex + 1) % rowCountInGroup === 0;

        const rowModel = {
            rowIndex: rowIndex,
            className: options.rowClass,
            cells: cells,
            needInsertAllDayRow: options.allDayElements && isLastRowInGroup
        };

        return rowModel;
    }

    _populateLayoutMapCells(options, rowIndex) {
        const cellsMap = [];
        const cellClass = options.cellClass;

        for(let cellIndex = 0; cellIndex < options.cellCount; cellIndex++) {
            const cellModel = {
                cellIndex: cellIndex
            };

            if(cellClass) {
                if(options.cellClass) {
                    if(isFunction(options.cellClass)) {
                        cellModel.className = options.cellClass(rowIndex, cellIndex);
                    } else {
                        cellModel.className = options.cellClass;
                    }
                }
            }

            cellModel.cellTemplate = options.cellTemplate;
            cellsMap.push(cellModel);
        }

        return cellsMap;
    }

    dispose() {
    }

    _getStateLogRecursive(target) {
        const propertyNames = Object.getOwnPropertyNames(target);
        const logArgs = [];
        propertyNames.forEach(name => {
            const property = target[name];
            if(!property || typeof property !== 'object') {
                logArgs.push(`${name}: ${property}`);
            } else {
                logArgs.push(`\n\t${name}:`);
                const args = this._getStateLogRecursive(property);
                logArgs.push(...args);
            }
        });
        return logArgs;
    }

    _validateState() {
        const dataItems = this.getLayoutMap().dataItems;

        for(let i = 1; i < dataItems.length; ++i) {
            const rowIndex = dataItems[i].rowIndex;
            const prevRowIndex = dataItems[i - 1].rowIndex;
            const diffRowIndex = rowIndex - prevRowIndex;
            if(diffRowIndex !== 1) {
                const delta = Math.abs(rowIndex - prevRowIndex);
                throw `Error Row indices: rowIndex=${rowIndex}, prevIndex=${prevRowIndex}, delta=${delta}`;
            }
        }

        return true;
    }
}
