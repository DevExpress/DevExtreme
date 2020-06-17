import typeUtils from '../../../core/utils/type';

const ROW_HEIGHT = 50;

export default class VirtualScrolling {
    constructor(workspace, viewportHeight, dateTableScrollable) {
        this._init(workspace, viewportHeight, dateTableScrollable);
    }

    getRowHeight() {
        return ROW_HEIGHT;
    }

    getState() {
        return this._state;
    }

    getLayoutMap() {
        return this._state.layoutMap;
    }

    _setLayoutMap(layoutMap) {
        return this._state.layoutMap = layoutMap;
    }

    _init(workspace, viewportHeight, dateTableScrollable) {
        const pageSize = Math.ceil(viewportHeight / this.getRowHeight());
        const groupCount = workspace._getGroupCount();
        const rowCount = workspace._getTotalRowCount(groupCount);
        const scrollOffset = {
            top: 0,
            left: 0
        };

        this._state = {
            pageSize: pageSize,
            scrollOffset: scrollOffset,
            startIndex: -1,
            rowCount: rowCount,
            topVirtualRowCount: 0,
            bottomVirtualRowCount: 0,
            layoutMap: {
                topVirtualRowHeight: 0,
                dataItems: [],
                bottomVirtualRowHeight: 0
            }
        };

        this._updateState(workspace, scrollOffset);

        const onScroll = dateTableScrollable.option('onScroll');
        dateTableScrollable.option('onScroll', e => {
            if(onScroll) {
                onScroll.bind(dateTableScrollable)();
            }

            if(this._updateState(workspace, e.scrollOffset)) {
                // Renovative render
                // TODO get rid of the workspace
                this._updateLayoutMap(workspace);
            }
        });
    }

    _updateState(workspace, scrollOffset) {
        const state = this.getState();
        const top = scrollOffset.top;
        const currentStartIndex = state.startIndex;
        const rowHeight = this.getRowHeight();

        state.scrollOffset = scrollOffset;
        state.startIndex = Math.ceil(top / rowHeight);

        if(currentStartIndex !== state.startIndex) {
            const pageSize = state.pageSize;
            const groupCount = workspace._getGroupCount();

            const totalRowCount = workspace._getTotalRowCount(groupCount);
            const topVirtualRowCount = Math.ceil(top / rowHeight);
            const deltaRowCount = totalRowCount - topVirtualRowCount;
            const rowCount = deltaRowCount >= pageSize ? pageSize : deltaRowCount;
            const bottomVirtualRowCount = totalRowCount - topVirtualRowCount - rowCount;

            state.topVirtualRowCount = topVirtualRowCount;
            state.rowCount = rowCount;
            state.bottomVirtualRowCount = bottomVirtualRowCount;

            this._updateLayoutMap(workspace);

            this._validateState();

            return true;
        }

        return false;
    }

    _updateLayoutMap(workspace) {
        const groupCount = workspace._getGroupCount();
        const options = Object.assign({
            cellCount: workspace._getTotalCellCount(groupCount),
            cellClass: workspace._getDateTableCellClass.bind(workspace),
            rowClass: workspace._getDateTableRowClass(),
            cellTemplate: workspace.option('dataCellTemplate'),
            getCellData: workspace._getCellData.bind(workspace),
            allDayElements: workspace._insertAllDayRowsIntoDateTable() ? workspace._allDayPanels : undefined,
            groupCount: groupCount,
            groupByDate: workspace.option('groupByDate')
        }, this.getState());

        this._updateLayoutMapCore(options);
    }
    _updateLayoutMapCore(options) {
        const rowHeight = this.getRowHeight();
        const topVirtualRowCount = options.topVirtualRowCount;
        const bottomVirtualRowCount = options.bottomVirtualRowCount;
        const dataRowCount = options.rowCount;

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

            dataItems = this._addLayoutMapRows(options, dataItems, addRowCount, rowCountInGroup, isAppend);

            layoutMap.dataItems = dataItems;
            layoutMap.topVirtualRowHeight = topVirtualRowHeight;
            layoutMap.bottomVirtualRowHeight = bottomVirtualRowHeight;
        }
    }

    _addLayoutMapRows(options, dataItems, addRowCount, rowCountInGroup, isAppend) {
        const dataRowCount = options.rowCount;
        const topVirtualRowCount = options.topVirtualRowCount;
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
                const rowModel = this._createRowModel(options, rowIndex, rowCountInGroup);
                dataItems.push(rowModel);
            }
        } else {
            const startIndex = options.startIndex;
            const prependRows = new Array(addRowCount);
            for(let index = addRowCount - 1; index >= 0; --index) {
                const rowIndex = startIndex + index;
                const rowModel = this._createRowModel(options, rowIndex, rowCountInGroup);
                prependRows[index] = rowModel;
            }

            dataItems = [...prependRows, ...dataItems];
        }

        return dataItems;
    }

    _createRowModel(options, rowIndex, rowCountInGroup) {
        const cells = this._createCellsMap(options, rowIndex);
        const isLastRowInGroup = (rowIndex + 1) % rowCountInGroup === 0;

        const rowModel = {
            rowIndex: rowIndex,
            className: options.rowClass,
            cells: cells,
            needInsertAllDayRow: options.allDayElements && isLastRowInGroup
        };

        return rowModel;
    }
    _createCellsMap(options, rowIndex) {
        const cellsMap = [];
        const cellClass = options.cellClass;

        for(let cellIndex = 0; cellIndex < options.cellCount; cellIndex++) {
            const cellModel = {
                cellIndex: cellIndex
            };

            if(cellClass) {
                if(options.cellClass) {
                    // TODO move to the top level
                    if(typeUtils.isFunction(options.cellClass)) {
                        cellModel.className = options.cellClass(rowIndex, cellIndex);
                    } else {
                        cellModel.className = options.cellClass;
                    }
                    //
                }
            }

            // TODO move to the top level or get rid of the Data in the element
            // let cellDataObject;
            // let dataKey;
            // let dataValue;
            // if(options.getCellData) {
            //     cellDataObject = options.getCellData(undefined, rowIndex, cellIndex, options.groupIndex);
            //     dataKey = cellDataObject.key;
            //     dataValue = cellDataObject.value;
            //     dataKey && dataUtils.data(undefined, dataKey, dataValue);
            // }
            //

            cellModel.cellTemplate = options.cellTemplate;
        }

        return cellsMap;
    }
    _validateState() {
        const dataItems = this.getLayoutMap().dataItems;

        for(let i = 1; i < dataItems.length; ++i) {
            const rowIndex = dataItems[i].rowIndex;
            const prevRowIndex = dataItems[i - 1].rowIndex;
            const diffRowIndex = rowIndex - prevRowIndex;
            if(diffRowIndex !== 1) {
                throw `Error Row indices: rowIndex=${rowIndex}, prevIndex=${prevRowIndex}`;
            }
        }
    }
}

module.exports = VirtualScrolling;
