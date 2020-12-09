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
            verticalGroupCount,
        } = options;

        const viewDataMap = [];
        for(let groupIndex = 0; groupIndex < verticalGroupCount; groupIndex += 1) {
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
            rowCountInGroup,
        } = options;
        const viewCellsData = [];

        for(let i = 0; i < renderRowCount; ++i) {
            const rowIndex = startRowIndex + rowOffset + i;

            const rowIndexInGroup = rowIndex % rowCountInGroup;
            viewCellsData.push(this._generateCellsRow(
                options, cellDataGetters, rowIndex, cellCount, rowIndexInGroup,
            ));
        }

        return viewCellsData;
    }

    _generateAllDayPanelData(options, groupIndex, rowCount, cellCount) {
        const workSpace = this.workspace;
        if(!workSpace._isShowAllDayPanel()) {
            return null;
        }

        const rowIndex = Math.max(groupIndex * rowCount, 0);

        return this._generateCellsRow(
            options, [workSpace._getAllDayCellData.bind(workSpace)],
            rowIndex, cellCount, 0, groupIndex,
        );
    }

    _generateCellsRow(options, cellDataGetters, rowIndex, cellCount, rowIndexInGroup, groupIndex) {
        const cellsRow = [];
        const {
            horizontalGroupCount,
            groupOrientation,
            rowCountInGroup,
            cellCountInGroupRow,
            groupCount,
        } = options;

        for(let columnIndex = 0; columnIndex < cellCount; ++columnIndex) {
            const cellDataValue = cellDataGetters.reduce((data, getter) => ({
                ...data,
                ...getter(undefined, rowIndex, columnIndex, groupIndex).value
            }), {});

            cellDataValue.index = this._calculateCellIndex(
                horizontalGroupCount, groupOrientation, this._workspace.isGroupedByDate(),
                rowIndexInGroup, columnIndex, cellCount,
            );

            cellDataValue.isFirstGroupCell = this._isFirstGroupCell(
                rowIndex, columnIndex, rowCountInGroup, cellCountInGroupRow, groupCount,
            );
            cellDataValue.isLastGroupCell = this._isLastGroupCell(
                rowIndex, columnIndex, rowCountInGroup, cellCountInGroupRow, groupCount
            );

            cellDataValue.key = this._getKeyByRowAndColumn(rowIndex, columnIndex, cellCount);

            cellsRow.push(cellDataValue);
        }

        return cellsRow;
    }

    _calculateCellIndex(horizontalGroupCount, groupOrientation, isGroupedByDate, rowIndex, columnIndex, columnsNumber) {
        const groupCount = horizontalGroupCount || 1;
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

    _getKeyByRowAndColumn(rowIndex, columnIndex, cellCount) {
        return rowIndex * cellCount + columnIndex;
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

    _isFirstGroupCell(rowIndex, columnIndex, singleGroupRowCount, singleGroupColumnCount, groupCount) {
        if(this.workspace.isGroupedByDate()) {
            return columnIndex % groupCount === 0;
        }

        if(this.workspace._isHorizontalGroupedWorkSpace() || groupCount === 0) {
            return columnIndex % singleGroupColumnCount === 0;
        }

        return rowIndex % singleGroupRowCount === 0;
    }

    _isLastGroupCell(rowIndex, columnIndex, singleGroupRowCount, singleGroupColumnCount, groupCount) {
        if(this.workspace.isGroupedByDate()) {
            return (columnIndex + 1) % groupCount === 0;
        }

        if(this.workspace._isHorizontalGroupedWorkSpace() || groupCount === 0) {
            return (columnIndex + 1) % singleGroupColumnCount === 0;
        }

        return (rowIndex + 1) % singleGroupRowCount === 0;
    }
}

export default class ViewDataProvider {
    constructor(workspace) {
        this._viewDataGenerator = null;
        this._viewData = [];
        this._completeViewDataMap = [];
        this._completeGroupedViewDataMap = [];
        this._viewDataMap = [];
        this._groupedDataMap = [];
        this._workspace = workspace;
    }

    get viewDataGenerator() {
        if(!this._viewDataGenerator) {
            this._viewDataGenerator = new ViewDataGenerator(this._workspace);
        }
        return this._viewDataGenerator;
    }

    get completeViewDataMap() { return this._completeViewDataMap; }
    set completeViewDataMap(value) { this._completeViewDataMap = value; }

    get completeGroupedViewDataMap() { return this._completeGroupedViewDataMap; }
    set completeGroupedViewDataMap(value) { this._completeGroupedViewDataMap = value; }

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
        const { dateTable } = this.getGroupData(groupIndex);

        return dateTable[0][0].startDate;
    }

    getGroupEndDate(groupIndex) {
        const { dateTable } = this.getGroupData(groupIndex);
        const lastRowIndex = dateTable.length - 1;
        const lastCellIndex = dateTable[lastRowIndex].length - 1;

        return dateTable[lastRowIndex][lastCellIndex].endDate;
    }

    findGroupCellStartDate(groupIndex, startDate, endDate, isAllDay) {
        if(isAllDay) {
            return this.findAllDayGroupCellStartDate(groupIndex, startDate);
        }

        const { dateTable } = this.getGroupData(groupIndex);

        if(!dateTable.length) return;

        for(let i = 0; i < dateTable[0].length; ++i) {
            let cell = dateTable[0][i];
            const lastRowIndex = dateTable.length - 1;

            if(dateUtils.sameDate(cell.startDate, startDate)) {
                let lastCell = dateTable[lastRowIndex][i];

                if(lastCell.endDate <= startDate) {
                    if(endDate.getDate() > startDate.getDate()) {
                        cell = dateTable[0][i + 1];
                        lastCell = dateTable[lastRowIndex][i + 1];
                    }
                }

                if(lastCell?.endDate > startDate) {
                    return cell.startDate;
                }
            }
        }
    }

    findAllDayGroupCellStartDate(groupIndex, startDate) {
        const groupStartDate = this.getGroupStartDate(groupIndex);

        return groupStartDate > startDate
            ? groupStartDate
            : startDate;
    }

    getCellsGroup(groupIndex) {
        const { dateTable } = this.getGroupData(groupIndex);

        return dateTable[0][0].groups;
    }

    getCellData(rowIndex, cellIndex, isAllDay) {
        if(isAllDay && !this._workspace._isVerticalGroupedWorkSpace()) {
            return this._viewData.groupedData[0].allDayPanel[cellIndex];
        }

        const { cellData } = this.viewDataMap[rowIndex][cellIndex];

        return cellData;
    }

    getCellsByGroupIndexAndAllDay(groupIndex, allDay) {
        const workspace = this._workspace;
        const rowsPerGroup = workspace._getRowCountWithAllDayRows();
        const isVerticalGrouping = workspace._isVerticalGroupedWorkSpace();
        const isShowAllDayPanel = workspace._isShowAllDayPanel();

        const firstRowInGroup = isVerticalGrouping ? groupIndex * rowsPerGroup : 0;
        const lastRowInGroup = isVerticalGrouping
            ? (groupIndex + 1) * rowsPerGroup - 1
            : rowsPerGroup;
        const correctedFirstRow = isShowAllDayPanel && !allDay
            ? firstRowInGroup + 1
            : firstRowInGroup;
        const correctedLastRow = allDay ? correctedFirstRow : lastRowInGroup;

        return this.completeViewDataMap
            .slice(correctedFirstRow, correctedLastRow + 1)
            .map(row => row.filter(({ groupIndex: currentGroupIndex }) => groupIndex === currentGroupIndex));
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

        const rows = isAllDay && !this._workspace._isVerticalGroupedWorkSpace()
            ? [this.completeViewDataMap[0].map((cell, index) => ({
                cellData: cell, position: { cellIndex: index, rowIndex: 0 }
            }))]
            : this.groupedDataMap[groupIndex] || [];

        for(let rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
            const row = rows[rowIndex];

            for(let cellIndex = 0; cellIndex < row.length; ++cellIndex) {
                const cell = row[cellIndex];
                const { cellData } = cell;

                if(cellData.groupIndex === groupIndex) {
                    if(isStartTimeInCell(cellData)) {
                        return cell.position;
                    }
                }
            }
        }

        return undefined;
    }

    getGroupIndices() {
        const { groupedData } = this.viewData;
        return groupedData.map(({ groupIndex }) => groupIndex);
    }

    _getLastGroupRow(groupIndex) {
        const group = this.groupedDataMap[groupIndex];
        const lastIndex = group.length - 1;

        return group[lastIndex];
    }

    getLasGroupCellPosition(groupIndex) {
        const groupRow = this._getLastGroupRow(groupIndex);

        return groupRow[0].position;
    }

    getLasGroupCellIndex(groupIndex) {
        const group = this.groupedDataMap[groupIndex];
        return group.length - 1;
    }

    getRowCountInGroup(groupIndex) {
        const groupRow = this._getLastGroupRow(groupIndex);
        const cellAmount = groupRow.length;
        const lastCellData = groupRow[cellAmount - 1].cellData;
        const lastCellIndex = lastCellData.index;

        return (lastCellIndex + 1) / groupRow.length;
    }

    getGroupData(groupIndex) {
        const { groupedData } = this.viewData;
        return groupedData.filter(item => item.groupIndex === groupIndex)[0];
    }

    isGroupIntersectDateInterval(groupIndex, startDate, endDate) {
        const groupStartDate = this.getGroupStartDate(groupIndex);
        const groupEndDate = this.getGroupEndDate(groupIndex);

        return startDate < groupEndDate && endDate > groupStartDate;
    }

    findGlobalCellPosition(date, groupIndex = 0, allDay = false) {
        const { completeViewDataMap, _workspace: workspace } = this;

        const showAllDayPanel = workspace._isShowAllDayPanel();
        const isVerticalGroupOrientation = workspace._isVerticalGroupedWorkSpace();

        for(let rowIndex = 0; rowIndex < completeViewDataMap.length; rowIndex += 1) {
            const currentRow = completeViewDataMap[rowIndex];

            for(let columnIndex = 0; columnIndex < currentRow.length; columnIndex += 1) {
                const cellData = currentRow[columnIndex];
                const {
                    startDate: currentStartDate,
                    endDate: currentEndDate,
                    groupIndex: currentGroupIndex,
                    allDay: currentAllDay,
                } = cellData;

                if(groupIndex === currentGroupIndex
                    && allDay === currentAllDay
                    && this._compareDatesAndAllDay(date, currentStartDate, currentEndDate, allDay)) {
                    return {
                        position: {
                            columnIndex,
                            rowIndex: showAllDayPanel && !isVerticalGroupOrientation
                                ? rowIndex - 1
                                : rowIndex,
                        },
                        cellData,
                    };
                }
            }
        }
    }

    _compareDatesAndAllDay(date, cellStartDate, cellEndDate, allDay) {
        const time = date.getTime();
        const trimmedTime = dateUtils.trimTime(date).getTime();
        const cellStartTime = cellStartDate.getTime();
        const cellEndTime = cellEndDate.getTime();

        return (!allDay
            && time >= cellStartTime
            && time < cellEndTime)
            || (allDay && trimmedTime === cellStartTime);
    }
}
