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
        const height = rowCount * this.getRowHeight();
        const scrollOffset = {
            top: 0,
            left: 0
        };

        this._state = {
            pageSize: pageSize,
            scrollOffset: scrollOffset,
            viewportHeight: viewportHeight,
            startIndex: -1,
            rowCount: rowCount,
            height: height,
            totalRowCount: 0,
            topVirtualRowCount: 0,
            bottomVirtualRowCount: 0,
            addRowCount: 0,
            deleteRowCount: 0,
            layoutMap: {
                topVirtualRow: {
                    height: 0
                },
                dataItems: [],
                bottomVirtualRow: {
                    height: 0
                }
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
        const previousTop = this._state.scrollOffset.top;
        const top = scrollOffset.top;
        const currentStartIndex = this._state.startIndex;
        const rowHeight = this.getRowHeight();

        this._state.scrollOffset = scrollOffset;
        this._state.startIndex = Math.ceil(top / rowHeight);

        if(currentStartIndex !== this._state.startIndex) {
            const pageSize = this._state.pageSize;
            const groupCount = workspace._getGroupCount();

            const totalRowCount = workspace._getTotalRowCount(groupCount);
            const topVirtualRowCount = Math.ceil(top / rowHeight);
            const deltaRowCount = totalRowCount - topVirtualRowCount;
            const rowCount = deltaRowCount >= pageSize ? pageSize : deltaRowCount;
            const bottomVirtualRowCount = totalRowCount - topVirtualRowCount - rowCount;

            const isAppend = top >= previousTop ? 1 : -1;
            let addRowCount = Math.abs(Math.ceil((top - previousTop) / rowHeight));
            if(addRowCount > pageSize) {
                addRowCount = pageSize;
            }
            addRowCount = addRowCount * isAppend;
            const deleteRowCount = -1 * addRowCount;

            Object.assign(this._state, {
                totalRowCount: totalRowCount,
                topVirtualRowCount: topVirtualRowCount,
                rowCount: rowCount,
                bottomVirtualRowCount: bottomVirtualRowCount,
                addRowCount: addRowCount,
                deleteRowCount: deleteRowCount,
            });

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
        const allDayElements = options.allDayElements;

        let rowCountInGroup = dataRowCount;
        if(options.groupCount) {
            rowCountInGroup = dataRowCount / options.groupCount;
        }

        const layoutMap = this.getLayoutMap();
        let dataItems = layoutMap.dataItems.slice(0, dataRowCount);
        const isEmptyData = dataItems.length === 0;

        const prevTopVirtualRowHeight = layoutMap.topVirtualRow.height;
        const prevBottomVirtualRowHeight = layoutMap.bottomVirtualRow.height;
        const topVirtualRowHeight = rowHeight * topVirtualRowCount;
        const bottomVirtualRowHeight = rowHeight * bottomVirtualRowCount;

        layoutMap.topVirtualRow.height = topVirtualRowHeight;
        layoutMap.bottomVirtualRow.height = bottomVirtualRowHeight;

        let appendRowCount = isEmptyData ? dataRowCount : 0;
        let prependRowCount = 0;
        if(prevTopVirtualRowHeight < topVirtualRowHeight) {
            appendRowCount = Math.ceil((topVirtualRowHeight - prevTopVirtualRowHeight) / rowHeight);
            appendRowCount = Math.min(appendRowCount, dataRowCount);
        } else if(prevBottomVirtualRowHeight < bottomVirtualRowHeight) {
            prependRowCount = Math.ceil((bottomVirtualRowHeight - prevBottomVirtualRowHeight) / rowHeight);
            prependRowCount = Math.min(prependRowCount, dataRowCount);
        }

        if(appendRowCount > 0) {
            if(!isEmptyData) {
                let deltaRowCount = 0;
                if(dataRowCount > dataItems.length) {
                    deltaRowCount = dataRowCount - dataItems.length;
                }

                dataItems = dataItems.slice(appendRowCount);

                appendRowCount += deltaRowCount;
            }

            for(let index = 0; index < appendRowCount; ++index) {
                const rowIndex = dataItems.length + topVirtualRowCount;

                const cells = this._createCellsMap(options, rowIndex);
                const isLastRowInGroup = (rowIndex + 1) % rowCountInGroup === 0;

                const rowModel = {
                    rowIndex: rowIndex,
                    className: options.rowClass,
                    cells: cells,
                    needInsertAllDayRow: allDayElements && isLastRowInGroup
                };

                dataItems.push(rowModel);
            }
        } else if(prependRowCount > 0) {
            if(!isEmptyData) {
                let deltaRowCount = 0;
                if(dataRowCount > dataItems.length) {
                    deltaRowCount = dataRowCount - dataItems.length;
                }

                dataItems.splice(-prependRowCount);

                prependRowCount += deltaRowCount;
            }

            const startIndex = options.startIndex;
            const prependRows = new Array(prependRowCount);
            for(let index = prependRowCount - 1; index >= 0; --index) {
                const rowIndex = startIndex + index;
                const cells = this._createCellsMap(options, rowIndex);
                const isLastRowInGroup = (rowIndex + 1) % rowCountInGroup === 0;

                const rowModel = {
                    rowIndex: rowIndex,
                    className: options.rowClass,
                    cells: cells,
                    needInsertAllDayRow: allDayElements && isLastRowInGroup
                };

                prependRows[index] = rowModel;
            }

            dataItems = [...prependRows, ...dataItems];
        }

        layoutMap.dataItems = dataItems;
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
