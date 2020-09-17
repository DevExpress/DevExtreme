import dateUtils from '../../../core/utils/date';

class ViewDataGenerator {
    constructor(workspace) {
        this.workspace = workspace;
    }

    get workspace() { return this._workspace; }
    set workspace(value) { this._workspace = value; }

    _getCompleteViewDataMap(options) {
        const {
            nonVirtualRowCount: rowCount,
            cellCount,
            groupCount,
        } = options;

        const viewDataMap = [];
        for(let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
            const allDayPanelData = this._generateAllDayPanelData(options, groupIndex, rowCount, cellCount);
            const viewCellsData = this._generateViewCellsData(
                options,
                rowCount,
                0,
                rowCount * groupIndex
            );

            allDayPanelData && viewDataMap.push(allDayPanelData);
            viewDataMap.push(...viewCellsData);
        }

        return viewDataMap;
    }

    _generateViewDataMap(completeViewDataMap, options) {
        const { startRowIndex, rowCount } = options;

        const isVerticalGrouping = this.workspace._isVerticalGroupedWorkSpace();
        const showAllDayPanel = this.workspace._isShowAllDayPanel();

        const indexDifference = isVerticalGrouping || !showAllDayPanel ? 0 : 1;
        const correctedStartRowIndex = startRowIndex + indexDifference;

        return completeViewDataMap
            .slice(correctedStartRowIndex, correctedStartRowIndex + rowCount)
            .map((cellsRow, rowIndex) => cellsRow.map((cellData, cellIndex) => ({
                cellData,
                position: { rowIndex, cellIndex },
            })));
    }

    _getViewDataFromMap(viewDataMap, completeViewDataMap, options) {
        const {
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            cellCountInGroupRow,
        } = options;
        const isGroupedAllDayPanel = this.workspace.isGroupedAllDayPanel();

        const {
            previousGroupedData: groupedData,
        } = viewDataMap.reduce(({ previousGroupIndex, previousGroupedData }, cellsRow) => {
            const cellDataRow = cellsRow.map(({ cellData }) => cellData);

            const firstCell = cellDataRow[0];
            const isAllDayRow = firstCell.allDay;
            const currentGroupIndex = firstCell.groupIndex;

            if(currentGroupIndex !== previousGroupIndex) {
                previousGroupedData.push({
                    dateTable: [],
                    isGroupedAllDayPanel,
                    groupIndex: currentGroupIndex,
                });
            }

            if(isAllDayRow) {
                previousGroupedData[previousGroupedData.length - 1].allDayPanel = cellDataRow;
            } else {
                previousGroupedData[previousGroupedData.length - 1].dateTable.push(cellDataRow);
            }

            return {
                previousGroupedData,
                previousGroupIndex: currentGroupIndex,
            };
        }, { previousGroupIndex: -1, previousGroupedData: [] });

        const isVirtualScrolling = this.workspace.isVirtualScrolling();
        const isVerticalGrouping = this.workspace._isVerticalGroupedWorkSpace();
        const showAllDayPanel = this.workspace._isShowAllDayPanel();

        if(!isVerticalGrouping && showAllDayPanel) {
            groupedData[0].allDayPanel = completeViewDataMap[0];
        }

        return {
            groupedData,
            isVirtual: isVirtualScrolling,
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            cellCountInGroupRow,
        };
    }

    _generateViewCellsData(options, renderRowCount, startRowIndex, rowOffset) {
        const {
            cellCount,
            cellDataGetters,
            horizontalGroupsCount,
            rowCountInGroup,
            groupOrientation,
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

                cellDataValue.index = this._calculateCellIndex(
                    horizontalGroupsCount, groupOrientation, this._workspace.isGroupedByDate(),
                    rowIndex % rowCountInGroup, columnIndex, cellCount,
                );

                viewCellsData[i].push(cellDataValue);
            }
        }

        return viewCellsData;
    }

    _generateAllDayPanelData(options, groupIndex, rowCount, cellCount) {
        if(!this.workspace._isShowAllDayPanel()) {
            return null;
        }

        const { horizontalGroupsCount, groupOrientation } = options;

        const allDayPanel = [];

        for(let columnIndex = 0; columnIndex < cellCount; ++columnIndex) {
            const rowIndex = Math.max(groupIndex * rowCount, 0);
            const cellDataValue = this.workspace._getAllDayCellData(undefined, rowIndex, columnIndex, groupIndex).value;
            cellDataValue.index = this._calculateCellIndex(
                horizontalGroupsCount, groupOrientation, this._workspace.isGroupedByDate(),
                0, columnIndex, cellCount,
            );
            allDayPanel.push(cellDataValue);
        }

        return allDayPanel;
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

    generateGroupedDataMap(viewDataMap) {
        const { previousGroupedDataMap: groupedDataMap } = viewDataMap.reduce((previousOptions, cellsRow) => {
            const {
                previousGroupedDataMap, previousRowIndex, previousGroupIndex,
            } = previousOptions;
            const { groupIndex: currentGroupIndex } = cellsRow[0].cellData;
            const currentRowIndex = currentGroupIndex === previousGroupIndex
                ? previousRowIndex + 1
                : 0;

            cellsRow.forEach((cell) => {
                const { groupIndex } = cell.cellData;

                if(!previousGroupedDataMap[groupIndex]) {
                    previousGroupedDataMap[groupIndex] = [];
                }
                if(!previousGroupedDataMap[groupIndex][currentRowIndex]) {
                    previousGroupedDataMap[groupIndex][currentRowIndex] = [];
                }

                previousGroupedDataMap[groupIndex][currentRowIndex].push(cell);
            });

            return {
                previousGroupedDataMap,
                previousRowIndex: currentRowIndex,
                previousGroupIndex: currentGroupIndex,
            };
        }, {
            previousGroupedDataMap: [],
            previousRowIndex: -1,
            previousGroupIndex: -1,
        });

        return groupedDataMap;
    }
}

export default class ViewDataProvider {
    constructor(workspace) {
        this._viewDataGenerator = null;
        this._viewData = [];
        this._completeViewDataMap = [];
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

    get completeViewDataMap() { return this._completeViewDataMap; }
    set completeViewDataMap(value) { this._completeViewDataMap = value; }

    get viewData() { return this._viewData; }
    set viewData(value) { this._viewData = value; }

    get viewDataMap() { return this._viewDataMap; }
    set viewDataMap(value) { this._viewDataMap = value; }

    get groupedDataMap() { return this._groupedDataMap; }
    set groupedDataMap(value) { this._groupedDataMap = value; }

    update(isGenerateNewViewData) {
        const { viewDataGenerator, _workspace } = this;
        const renderOptions = _workspace.generateRenderOptions();

        if(isGenerateNewViewData) {
            this.completeViewDataMap = viewDataGenerator._getCompleteViewDataMap(renderOptions);
        }

        this.viewDataMap = viewDataGenerator._generateViewDataMap(this.completeViewDataMap, renderOptions);
        this.viewData = viewDataGenerator._getViewDataFromMap(this.viewDataMap, this.completeViewDataMap, renderOptions);
        this.groupedDataMap = viewDataGenerator.generateGroupedDataMap(this.viewDataMap);
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

    getGroupCellStartDate(groupIndex, date) {
        const { dateTable } = this._getGroupData(groupIndex);
        const cell = dateTable[0].filter(
            cell => dateUtils.sameDate(cell.startDate, date)
        )[0];

        return cell && cell.startDate;
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

    setSelectedCells(firstCellCoordinates, lastCellCoordinates) {
        this._firstSelectedCellCoordinates = firstCellCoordinates || this._firstSelectedCellCoordinates;
        this._lastSelectedCellCoordinates = lastCellCoordinates || this._lastSelectedCellCoordinates;

        const {
            rowIndex: firstRowIndex, columnIndex: firstColumnIndex, allDay: isFirstCellAllDay,
        } = this._firstSelectedCellCoordinates;
        const {
            rowIndex: lastRowIndex, columnIndex: lastColumnIndex, allDay: isLastCellAllDay,
        } = this._lastSelectedCellCoordinates;

        let firstCell = this.getCellData(firstRowIndex, firstColumnIndex, isFirstCellAllDay);
        let lastCell = this.getCellData(lastRowIndex, lastColumnIndex, isLastCellAllDay);
        if(firstCell.startDate.getTime() > lastCell.startDate.getTime()) {
            [firstCell, lastCell] = [lastCell, firstCell];
        }

        const {
            startDate: firstStartDate, groupIndex: firstGroupIndex,
        } = firstCell;
        const {
            startDate: lastStartDate,
        } = lastCell;
        const firstTime = firstStartDate.getTime();
        const lastTime = lastStartDate.getTime();

        const cells = this._getCellsByGroupIndexAndAllDay(firstGroupIndex, isFirstCellAllDay);

        this._selectedCells = cells.reduce((selectedCells, cellsRow) => {
            selectedCells.push(...cellsRow.reduce((cellsFromRow, cell) => {
                const { startDate, groupIndex } = cell;
                const time = startDate.getTime();
                if(firstTime <= time && time <= lastTime && groupIndex === firstGroupIndex) {
                    cellsFromRow.push(cell);
                }

                return cellsFromRow;
            }, []));

            return selectedCells;
        }, []);
    }

    getSelectedCells() {
        return this._selectedCells;
    }

    releaseSelectedAndFocusedCells() {
        this.releaseSelectedCells();
        this.releaseFocusedCell();
    }

    releaseSelectedCells() {
        delete this._selectedCells;
    }

    releaseFocusedCell() {
        delete this._focusedCell;
    }

    _getCellsByGroupIndexAndAllDay(groupIndex, allDay) {
        const workspace = this._workspace;
        const rowsPerGroup = workspace._getRowCountWithAllDayRows();
        const isVerticalGrouping = workspace._isVerticalGroupedWorkSpace();
        const isShowAllDayPanel = workspace._isShowAllDayPanel();

        const firstRowInGroup = isVerticalGrouping ? groupIndex * rowsPerGroup : 0;
        const lastRowInGroup = isVerticalGrouping
            ? (groupIndex + 1) * rowsPerGroup - 1
            : rowsPerGroup;
        const correctedFirstRow = isShowAllDayPanel && isVerticalGrouping && !allDay
            ? firstRowInGroup + 1
            : firstRowInGroup;
        const correctedLastRow = isShowAllDayPanel && isVerticalGrouping && allDay
            ? correctedFirstRow
            : lastRowInGroup;

        return this.completeViewDataMap
            .slice(correctedFirstRow, correctedLastRow + 1)
            .map(row => row.filter(({ groupIndex: currentGroupIndex }) => groupIndex === currentGroupIndex));
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

    findCellPositionInMap(groupIndex, startDate, isAllDay) {
        const startTime = isAllDay
            ? dateUtils.trimTime(startDate).getTime()
            : startDate.getTime();

        const isStartTimeInCell = cellData => {
            const cellStartTime = cellData.startDate.getTime();
            const cellEndTime = cellData.endDate.getTime();

            return isAllDay
                ? cellData.allDay && startTime >= cellStartTime && startTime <= cellEndTime
                : startTime >= cellStartTime && startTime < cellEndTime;
        };

        const rows = this.groupedDataMap[groupIndex] || [];

        for(let rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
            const row = rows[rowIndex];

            for(let cellIndex = 0; cellIndex < row.length; ++cellIndex) {
                const cell = row[cellIndex];
                const { cellData } = cell;

                if(cellData.groupIndex === groupIndex) {
                    if(isStartTimeInCell(cell.cellData)) {
                        return cell.position;
                    }
                }
            }
        }

        return undefined;
    }

    _getGroupData(groupIndex) {
        const { groupedData } = this.viewData;
        return groupedData.filter(item => item.groupIndex === groupIndex)[0];
    }
}
