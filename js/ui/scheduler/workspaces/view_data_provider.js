class ViewDataGenerator {
    constructor(workspace) {
        this.workspace = workspace;
    }

    get workspace() { return this._workspace; }
    set workspace(value) { this._workspace = value; }

    generate() {
        let result;

        if(this.workspace.isVirtualScrolling()) {
            result = this._generateVirtualViewData();
        } else {
            result = this._generateViewData();
        }

        return result;
    }

    _generateVirtualViewData() {
        const workspace = this._workspace;
        const options = workspace.generateRenderOptions();
        const {
            cellCount,
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            startRowIndex,
            groupCount,
            rowCount,
            rowCountInGroup,
            cellCountInGroupRow,
        } = options;
        const groupedData = [];
        const firstGroupIndex = Math.floor(startRowIndex / rowCountInGroup);
        const lastGroupIndex = Math.floor((startRowIndex + rowCount) / rowCountInGroup);
        const isGroupedAllDayPanel = workspace.isGroupedAllDayPanel();

        for(let groupIndex = 0; groupIndex < groupCount; ++groupIndex) {
            let allDayPanelData = [];
            let groupOffset = 0;
            let renderRowCount = rowCount;
            let viewCellsData = [];

            if(groupIndex >= firstGroupIndex && groupIndex <= lastGroupIndex) {
                const groupRowCount = (groupIndex + 1) * rowCountInGroup;
                if(startRowIndex + renderRowCount > groupRowCount) {
                    renderRowCount = groupRowCount - startRowIndex;
                } else {
                    const startGroupRowIndex = groupIndex * rowCountInGroup;
                    if(startRowIndex < startGroupRowIndex && startRowIndex + renderRowCount > startGroupRowIndex) {
                        groupOffset = startGroupRowIndex - startRowIndex;
                        renderRowCount -= groupOffset;
                    }
                }

                const needRenderAllDayPanel = ((startRowIndex + groupOffset) / rowCountInGroup) === groupIndex;
                if(needRenderAllDayPanel) {
                    allDayPanelData = this._generateAllDayPanelData(options, groupIndex, rowCount, cellCount);
                }

                viewCellsData = this._generateViewCellsData(
                    options,
                    groupIndex,
                    renderRowCount,
                    startRowIndex,
                    groupOffset
                );
            }

            viewCellsData.length && groupedData.push({
                groupIndex: groupIndex,
                dateTable: viewCellsData,
                allDayPanel: allDayPanelData,
                isGroupedAllDayPanel
            });
        }

        return {
            viewData: {
                groupedData,
                isVirtual: true,
                topVirtualRowHeight,
                bottomVirtualRowHeight,
                cellCountInGroupRow,
            },
        };
    }

    _generateViewData() {
        const workspace = this._workspace;
        const options = workspace.generateRenderOptions();
        const isGroupedAllDayPanel = workspace.isGroupedAllDayPanel();
        const {
            rowCount,
            cellCount,
            groupCount,
            cellCountInGroupRow,
        } = options;

        const groupedData = [];

        for(let groupIndex = 0; groupIndex < groupCount; ++groupIndex) {
            const allDayPanelData = this._generateAllDayPanelData(options, groupIndex, rowCount, cellCount);
            const viewCellsData = this._generateViewCellsData(
                options,
                groupIndex,
                rowCount,
                0,
                rowCount * groupIndex
            );

            viewCellsData.length && groupedData.push({
                groupIndex,
                dateTable: viewCellsData,
                allDayPanel: allDayPanelData,
                isGroupedAllDayPanel
            });
        }

        return {
            viewData: {
                groupedData,
                cellCountInGroupRow,
            }
        };
    }

    _generateViewCellsData(options, groupIndex, renderRowCount, startRowIndex, rowOffset) {
        const {
            cellCount,
            cellDataGetters,
            horizontalGroupsCount,
            rowCountInGroup,
        } = options;
        const viewCellsData = [];

        for(let i = 0; i < renderRowCount; ++i) {
            const rowIndex = startRowIndex + rowOffset + i;

            viewCellsData.push([]);
            for(let columnIndex = 0; columnIndex < cellCount; ++columnIndex) {

                const cellDataValue = { };

                cellDataGetters.forEach(getter => {
                    const cellValue = getter(undefined, rowIndex, columnIndex).value;
                    Object.assign(cellDataValue, cellValue);
                });

                cellDataValue.groupIndex = this._calculateGroupIndex(
                    horizontalGroupsCount, this._workspace.option('groupOrientation'), groupIndex, columnIndex,
                );
                cellDataValue.index = this._calculateCellIndex(
                    horizontalGroupsCount, this._workspace.option('groupOrientation'), this._workspace.isGroupedByDate(),
                    rowIndex % rowCountInGroup, columnIndex, cellCount,
                );

                viewCellsData[i].push(cellDataValue);
            }
        }

        return viewCellsData;
    }

    _generateAllDayPanelData(options, groupIndex, rowCount, cellCount) {
        if(!this.workspace.option('showAllDayPanel')) {
            return null;
        }

        const { horizontalGroupsCount } = options;

        const allDayPanel = [];

        for(let columnIndex = 0; columnIndex < cellCount; ++columnIndex) {
            const rowIndex = Math.max(groupIndex * rowCount, 0);
            const cellDataValue = this.workspace._getAllDayCellData(undefined, rowIndex, columnIndex).value;
            cellDataValue.groupIndex = this._calculateGroupIndex(
                horizontalGroupsCount, this._workspace.option('groupOrientation'), groupIndex, columnIndex,
            );
            cellDataValue.index = this._calculateCellIndex(
                horizontalGroupsCount, this._workspace.option('groupOrientation'), this._workspace.isGroupedByDate(),
                0, columnIndex, cellCount,
            );
            allDayPanel.push(cellDataValue);
        }

        return allDayPanel;
    }

    _calculateGroupIndex(horizontalGroupsCount, groupOrientation, currentGroupIndex, columnIndex) {
        if(horizontalGroupsCount === 0) {
            return undefined;
        }

        let groupIndex = currentGroupIndex;
        if(groupOrientation === 'horizontal') {
            groupIndex = this._workspace._getGroupIndex(undefined, columnIndex);
        }

        return groupIndex;
    }

    _calculateCellIndex(horizontalGroupsCount, groupOrientation, isGroupedByDate, rowIndex, columnIndex, columnsNumber) {
        const groupCount = horizontalGroupsCount || 1;
        let index = rowIndex * columnsNumber + columnIndex;
        const columnsInGroup = columnsNumber / groupCount;

        if(groupOrientation === 'horizontal') {
            let columnIndexInCurrentGroup = columnIndex % columnsInGroup;
            if(isGroupedByDate) {
                columnIndexInCurrentGroup = Math.floor(columnIndex / groupCount);
            }

            index = rowIndex * columnsInGroup + columnIndexInCurrentGroup;
        }

        return index;
    }

    getViewDataMap(groupedData) {
        const viewDataMap = [];
        const addToMap = cellsData => {
            const cellsMap = [];
            cellsData.forEach((cellData, cellIndex) => {
                const cellMap = {
                    cellData,
                    position: {
                        rowIndex: viewDataMap.length,
                        cellIndex: cellIndex
                    }
                };
                cellsMap.push(cellMap);
            });

            viewDataMap.push(cellsMap);
        };

        groupedData?.forEach(({
            dateTable,
            allDayPanel,
            isGroupedAllDayPanel
        }) => {
            if(isGroupedAllDayPanel && allDayPanel?.length) {
                addToMap(allDayPanel);
            }

            dateTable.forEach(cellsData => {
                addToMap(cellsData);
            });
        });

        return viewDataMap;
    }

    getGroupedDataMap(groupedData) {
        const result = [];

        groupedData.forEach(data => {
            const { groupIndex } = data;
            result[groupIndex] = data;
        });

        return result;
    }
}

export default class ViewDataProvider {
    constructor(workspace) {
        this._viewDataGenerator = null;
        this._viewData = [];
        this._viewDataMap = [];
        this._groupedDataMap = [];
        this._workspace = workspace;
        this._focusedCell = null;
        this._firstSelectedCell = null;
    }

    get viewDataGenerator() {
        if(!this._viewDataGenerator) {
            this._viewDataGenerator = new ViewDataGenerator(this._workspace);
        }
        return this._viewDataGenerator;
    }

    get viewData() { return this._viewData; }
    set viewData(value) { this._viewData = value; }

    get viewDataMap() { return this._viewDataMap; }
    set viewDataMap(value) { this._viewDataMap = value; }

    get groupedDataMap() { return this._groupedDataMap; }
    set groupedDataMap(value) { this._groupedDataMap = value; }

    update() {
        const { viewDataGenerator } = this;
        const { viewData } = viewDataGenerator.generate();

        this.viewData = viewData;

        this._updateViewDataMap();
        this._updateGroupedDataMap();
    }

    getStartDate() {
        const { groupedData } = this.viewData;
        const { dateTable } = groupedData[0];

        return dateTable[0][0].startDate;
    }

    getGroupStartDate(groupIndex) {
        const { dateTable } = this._getGroupData(groupIndex);

        return dateTable[0][0].startDate;
    }

    getGroupEndDate(groupIndex) {
        const { dateTable } = this._getGroupData(groupIndex);
        const lastRowIndex = dateTable.length - 1;
        const lastCellIndex = dateTable[lastRowIndex].length - 1;

        return dateTable[lastRowIndex][lastCellIndex].endDate;
    }

    getCellsGroup(groupIndex) {
        const { dateTable } = this._getGroupData(groupIndex);

        return dateTable[0][0].groups;
    }

    getCellData(rowIndex, cellIndex, isAllDay) {
        if(isAllDay && !this._workspace._isVerticalGroupedWorkSpace()) {
            return this._viewData.groupedData[0].allDayPanel[cellIndex];
        }

        const { cellData } = this.viewDataMap[rowIndex][cellIndex];

        return cellData;
    }

    getDimensions() {
        const { groupedData } = this._viewData;

        const columnCount = groupedData[0].dateTable[0].length;

        const rowCount = groupedData.reduce((currentRowCount, { dateTable }) => {
            const dateTableSize = dateTable?.length;
            const rowsInDateTable = dateTableSize || 0;

            return currentRowCount + rowsInDateTable;
        }, 0);

        return { rowCount, columnCount };
    }

    setFocusedCell(rowIndex, columnIndex, isAllDay) {
        const cell = this.getCellData(rowIndex, columnIndex, isAllDay);
        this._focusedCell = cell;
    }

    getFocusedCell() {
        const { _focusedCell } = this;
        if(!_focusedCell) {
            return {};
        }

        const columnIndex = this._getColumnIndexByCellData(_focusedCell);
        const rowIndex = this._getRowIndexByColumnAndData(_focusedCell, columnIndex);

        return { coordinates: { cellIndex: columnIndex, rowIndex }, cellData: _focusedCell };
    }

    _getColumnIndexByCellData(cellData) {
        const isVerticalGrouping = this._workspace._isVerticalGroupedWorkSpace();
        const { viewDataMap } = this;
        const { startDate, groupIndex } = cellData;

        return viewDataMap[0].findIndex(({
            cellData: { startDate: currentStartDate, groupIndex: currentGroupIndex },
        }) => {
            return startDate.getDate() === currentStartDate.getDate()
              && ((groupIndex === currentGroupIndex) || isVerticalGrouping);
        });
    }

    setFirstSelectedCell(rowIndex, columnIndex, isAllDay) {
        const cell = this.getCellData(rowIndex, columnIndex, isAllDay);
        this._firstSelectedCell = cell;
    }

    getFirstCellInSelection() {
        const { _firstSelectedCell, _focusedCell, viewDataMap } = this;
        if(!_firstSelectedCell) {
            return null;
        }

        const isFirstSelectedCellBeforeLast = _firstSelectedCell.startDate.getTime() < _focusedCell.startDate.getTime();
        const firstCellInSelection = isFirstSelectedCellBeforeLast
            ? _firstSelectedCell
            : _focusedCell;
        const lastCellInSelection = !isFirstSelectedCellBeforeLast
            ? _firstSelectedCell
            : _focusedCell;

        const columnIndex = this._getColumnIndexByCellData(firstCellInSelection);
        const rowIndex = this._getRowIndexByColumnAndData(firstCellInSelection, columnIndex);

        if(rowIndex !== -1) {
            return { coordinates: { cellIndex: columnIndex, rowIndex }, cellData: firstCellInSelection };
        }

        const firstCellInColumn = viewDataMap[0][columnIndex];
        const firstCellInColumnData = firstCellInColumn.cellData;

        const stepSize = this._workspace.isGroupedByDate() ? this._workspace._getGroupCount() : 1;
        const firstCellInNextColumn = viewDataMap[0][columnIndex + stepSize];
        const firstCellInNextColumnData = firstCellInNextColumn?.cellData;

        if(firstCellInColumnData.groupIndex === firstCellInSelection.groupIndex
            && firstCellInColumnData.startDate.getTime() >= firstCellInSelection.startDate.getTime()
            && firstCellInColumnData.startDate.getTime() <= lastCellInSelection.startDate.getTime()) {
            return {
                cellData: firstCellInColumnData,
                coordinates: firstCellInColumn.position,
            };
        }
        if(firstCellInNextColumn
            && firstCellInNextColumnData.groupIndex === firstCellInSelection.groupIndex
            && firstCellInNextColumnData.startDate.getTime() <= lastCellInSelection.startDate.getTime()) {
            return {
                cellData: firstCellInNextColumnData,
                coordinates: firstCellInNextColumn.position,
            };
        }

        return null;
    }

    getLastCellInSelection() {
        const { _firstSelectedCell, _focusedCell, viewDataMap } = this;
        if(!_firstSelectedCell) {
            return null;
        }

        const isFirstSelectedCellBeforeLast = _firstSelectedCell.startDate.getTime() < _focusedCell.startDate.getTime();
        const firstCellInSelection = isFirstSelectedCellBeforeLast
            ? _firstSelectedCell
            : _focusedCell;
        const lastCellInSelection = !isFirstSelectedCellBeforeLast
            ? _firstSelectedCell
            : _focusedCell;

        const columnIndex = this._getColumnIndexByCellData(lastCellInSelection);
        const rowIndex = this._getRowIndexByColumnAndData(lastCellInSelection, columnIndex);
        if(rowIndex !== -1) {
            return { coordinates: { cellIndex: columnIndex, rowIndex }, cellData: lastCellInSelection };
        }

        const lastCellInColumn = viewDataMap[viewDataMap.length - 1][columnIndex];
        const lastCellInColumnData = lastCellInColumn.cellData;

        const stepSize = this._workspace.isGroupedByDate() ? this._workspace._getGroupCount() : 1;
        const lastCellInPreviousColumn = viewDataMap[viewDataMap.length - 1][columnIndex - stepSize];
        const lastCellInPreviousColumnData = lastCellInPreviousColumn?.cellData;

        if(lastCellInColumnData.groupIndex === lastCellInSelection.groupIndex
            && lastCellInColumnData.startDate.getTime() >= firstCellInSelection.startDate.getTime()
            && lastCellInColumnData.startDate.getTime() <= lastCellInSelection.startDate.getTime()) {
            return {
                cellData: lastCellInColumnData,
                coordinates: lastCellInColumn.position,
            };
        }
        if(lastCellInPreviousColumn
            && lastCellInPreviousColumnData.groupIndex === lastCellInSelection.groupIndex
            && lastCellInPreviousColumnData.startDate.getTime() >= firstCellInSelection.startDate.getTime()) {
            return {
                cellData: lastCellInPreviousColumnData,
                coordinates: lastCellInPreviousColumn.position,
            };
        }

        return null;
    }

    releaseSelectedAndFocusedCells() {
        this._focusedCell = null;
        this._firstSelectedCell = null;
    }

    _getRowIndexByColumnAndData(cellData, columnIndex) {
        const { viewDataMap } = this;
        const { startDate, groupIndex } = cellData;

        return viewDataMap.findIndex((cellsRow) => {
            const { cellData: currentCellData } = cellsRow[columnIndex];
            const {
                startDate: currentStartDate,
                groupIndex: currentGroupIndex,
            } = currentCellData;

            return startDate.getTime() === currentStartDate.getTime()
              && groupIndex === currentGroupIndex;
        });
    }

    _getGroupData(groupIndex) {
        const { groupedData } = this.viewData;
        return groupedData.filter(item => item.groupIndex === groupIndex)[0];
    }

    _updateViewDataMap() {
        const { groupedData } = this.viewData;
        this.viewDataMap = this.viewDataGenerator.getViewDataMap(groupedData);
    }

    _updateGroupedDataMap() {
        const { groupedData } = this.viewData;
        this.groupedDataMap = this.viewDataGenerator.getGroupedDataMap(groupedData);
    }
}
