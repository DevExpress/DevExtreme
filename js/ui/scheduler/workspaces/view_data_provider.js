import dateUtils from '../../../core/utils/date';
import { HORIZONTAL_GROUP_ORIENTATION } from '../constants';

class ViewDataGenerator {
    constructor(workspace) {
        this.workspace = workspace;
    }

    get workspace() { return this._workspace; }
    set workspace(value) { this._workspace = value; }
    get isVerticalGroupedWorkspace() { return this.workspace._isVerticalGroupedWorkSpace(); }

    _getCompleteViewDataMap(options) {
        const {
            totalRowCount,
            totalCellCount,
            verticalGroupCount,
        } = options;

        const viewDataMap = [];
        for(let groupIndex = 0; groupIndex < verticalGroupCount; groupIndex += 1) {
            const allDayPanelData = this._generateAllDayPanelData(options, groupIndex, totalRowCount, totalCellCount);
            const viewCellsData = this._generateViewCellsData(
                options,
                totalRowCount,
                0,
                totalRowCount * groupIndex
            );

            allDayPanelData && viewDataMap.push(allDayPanelData);
            viewDataMap.push(...viewCellsData);
        }

        return viewDataMap;
    }

    _getCompleteDateHeaderMap(options, completeViewDataMap) {
        const {
            getDateHeaderText,
            today,
            groupByDate,
            horizontalGroupCount,
            cellCountInGroupRow,
            groupOrientation,
        } = options;

        const index = completeViewDataMap[0][0].allDay ? 1 : 0;
        const columnCount = completeViewDataMap[index].length;
        const dateHeaderColumnCount = groupByDate
            ? columnCount / horizontalGroupCount
            : columnCount;
        const colSpan = groupByDate ? horizontalGroupCount : 1;
        const isVerticalGrouping = groupOrientation === 'vertical';

        const result = [];
        const slicedByColumnsData = completeViewDataMap[index].slice(0, dateHeaderColumnCount);

        const firstRow = slicedByColumnsData.map(({
            startDate,
            isFirstGroupCell,
            isLastGroupCell,
            ...restProps
        }, index) => ({
            ...restProps,
            startDate,
            text: getDateHeaderText(index % cellCountInGroupRow),
            today: dateUtils.sameDate(startDate, today),
            colSpan,
            isFirstGroupCell: groupByDate || (isFirstGroupCell && !isVerticalGrouping),
            isLastGroupCell: groupByDate || (isLastGroupCell && !isVerticalGrouping),
        }));

        result.push(firstRow);

        return result;
    }

    _generateViewDataMap(completeViewDataMap, options) {
        const {
            startRowIndex,
            rowCount,
            startCellIndex,
            cellCount
        } = options;

        const showAllDayPanel = this.workspace.isAllDayPanelVisible;

        const indexDifference = this.isVerticalGroupedWorkspace || !showAllDayPanel ? 0 : 1;
        const correctedStartRowIndex = startRowIndex + indexDifference;

        return completeViewDataMap
            .slice(correctedStartRowIndex, correctedStartRowIndex + rowCount)
            .map((cellsRow, rowIndex) =>
                cellsRow
                    .slice(startCellIndex, startCellIndex + cellCount)
                    .map((cellData, cellIndex) => (
                        {
                            cellData,
                            position: {
                                rowIndex,
                                cellIndex
                            }
                        })
                    )
            );
    }

    _generateDateHeaderMap(completeDateHeaderMap, options) {
        return [completeDateHeaderMap[0].slice(0) // TODO: virtualization
            .map(cellData => cellData)];
    }

    _getViewDataFromMap(viewDataMap, completeViewDataMap, options) {
        const {
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            leftVirtualCellWidth,
            rightVirtualCellWidth,
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
        const showAllDayPanel = this.workspace.isAllDayPanelVisible;

        if(!isVerticalGrouping && showAllDayPanel) {
            const {
                startCellIndex,
                cellCount
            } = options;

            groupedData[0].allDayPanel = completeViewDataMap[0]
                .slice(startCellIndex, cellCount + startCellIndex);
        }

        return {
            groupedData,
            isVirtual: isVirtualScrolling,
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            leftVirtualCellWidth,
            rightVirtualCellWidth,
            cellCountInGroupRow,
            isGroupedAllDayPanel
        };
    }

    _generateViewCellsData(options, renderRowCount, startRowIndex, rowOffset) {
        const {
            totalCellCount,
            cellDataGetters,
            rowCountInGroup,
        } = options;
        const viewCellsData = [];

        for(let i = 0; i < renderRowCount; ++i) {
            const rowIndex = startRowIndex + rowOffset + i;

            const rowIndexInGroup = rowIndex % rowCountInGroup;
            viewCellsData.push(this._generateCellsRow(
                options, cellDataGetters, rowIndex, totalCellCount, rowIndexInGroup,
            ));
        }

        return viewCellsData;
    }

    _generateAllDayPanelData(options, groupIndex, rowCount, cellCount) {
        const workSpace = this.workspace;
        if(!workSpace.isAllDayPanelVisible) {
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
        } = options;

        for(let columnIndex = 0; columnIndex < cellCount; ++columnIndex) {
            const cellDataValue = cellDataGetters.reduce((data, getter) => ({
                ...data,
                ...getter(undefined, rowIndex, columnIndex, groupIndex, data.startDate).value
            }), {});

            cellDataValue.index = this._calculateCellIndex(
                horizontalGroupCount, groupOrientation, this._workspace.isGroupedByDate(),
                rowIndexInGroup, columnIndex, cellCount,
            );

            cellDataValue.isFirstGroupCell = this._isFirstGroupCell(
                rowIndex, columnIndex, options,
            );
            cellDataValue.isLastGroupCell = this._isLastGroupCell(
                rowIndex, columnIndex, options,
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

    _isFirstGroupCell(rowIndex, columnIndex, options) {
        const {
            groupOrientation,
            rowCountInGroup,
            cellCountInGroupRow,
            groupCount,
        } = options;

        if(this.workspace.isGroupedByDate()) {
            return columnIndex % groupCount === 0;
        }

        if(groupOrientation === HORIZONTAL_GROUP_ORIENTATION) {
            return columnIndex % cellCountInGroupRow === 0;
        }

        return rowIndex % rowCountInGroup === 0;
    }

    _isLastGroupCell(rowIndex, columnIndex, options) {
        const {
            groupOrientation,
            rowCountInGroup,
            cellCountInGroupRow,
            groupCount,
        } = options;

        if(this.workspace.isGroupedByDate()) {
            return (columnIndex + 1) % groupCount === 0;
        }

        if(groupOrientation === HORIZONTAL_GROUP_ORIENTATION) {
            return (columnIndex + 1) % cellCountInGroupRow === 0;
        }

        return (rowIndex + 1) % rowCountInGroup === 0;
    }
}

class GroupedDataMapProvider {
    constructor(viewDataGenerator, viewDataMap, completeViewDataMap, workspace) {
        this.groupedDataMap = viewDataGenerator.generateGroupedDataMap(viewDataMap);
        this.completeViewDataMap = completeViewDataMap;
        this._workspace = workspace;
    }

    getGroupStartDate(groupIndex) {
        const firstRow = this.getFirstGroupRow(groupIndex);

        if(firstRow) {
            const { startDate } = firstRow[0].cellData;

            return startDate;
        }
    }

    getGroupEndDate(groupIndex) {
        const lastRow = this.getLastGroupRow(groupIndex);

        if(lastRow) {
            const lastCellIndex = lastRow.length - 1;
            const { cellData } = lastRow[lastCellIndex];
            const { endDate } = cellData;

            return endDate;
        }
    }

    findGroupCellStartDate(groupIndex, startDate, endDate, isAllDay) {
        if(isAllDay) {
            return this.findAllDayGroupCellStartDate(groupIndex, startDate);
        }

        const getCellStartDate = cell => cell?.cellData.startDate;
        const getCellEndDate = cell => cell?.cellData.endDate;

        const firstRow = this.getFirstGroupRow(groupIndex);
        if(!firstRow) return;

        const groupStartDate = this.getGroupStartDate(groupIndex);
        const startDateToCompare = dateUtils.trimTime(startDate) < dateUtils.trimTime(groupStartDate) || !endDate
            ? dateUtils.trimTime(endDate)
            : startDate;

        const lastRow = this.getLastGroupRow(groupIndex);
        for(let i = 0; i < firstRow.length; ++i) {
            let firstRowCell = firstRow[i];
            const cellStartDate = getCellStartDate(firstRowCell);

            if(dateUtils.sameDate(cellStartDate, startDateToCompare)) {
                let lastRowCell = lastRow[i];

                if(getCellEndDate(lastRowCell) <= startDateToCompare) {
                    if(endDate.getDate() > startDateToCompare.getDate()) {
                        firstRowCell = firstRow[i + 1];
                        lastRowCell = lastRow[i + 1];
                    }
                }

                if(getCellEndDate(lastRowCell) > startDate) {
                    return getCellStartDate(firstRowCell);
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

    getCellsGroup(groupIndex) {
        const groupData = this.groupedDataMap[groupIndex];

        if(groupData) {
            const { cellData } = groupData[0][0];

            return cellData.groups;
        }
    }

    getGroupsInfo() {
        return this.groupedDataMap.map(groupData => {
            const firstCell = groupData[0][0];
            const {
                allDay,
                groupIndex
            } = firstCell.cellData;

            return {
                allDay,
                groupIndex,
                startDate: this.getGroupStartDate(groupIndex),
                endDate: this.getGroupEndDate(groupIndex)
            };
        });
    }

    getGroupIndices() {
        return this.getGroupsInfo()
            .filter(item => !!item)
            .map(({ groupIndex }) => groupIndex);
    }

    getFirstGroupRow(groupIndex) {
        const groupedData = this.groupedDataMap[groupIndex];

        if(groupedData) {
            const { cellData } = groupedData[0][0];

            return !cellData.allDay
                ? groupedData[0]
                : groupedData[1];
        }
    }

    getLastGroupRow(groupIndex) {
        const groupedData = this.groupedDataMap[groupIndex];

        if(groupedData) {
            const lastRowIndex = groupedData.length - 1;

            return groupedData[lastRowIndex];
        }
    }

    getLasGroupCellPosition(groupIndex) {
        const groupRow = this.getLastGroupRow(groupIndex);

        return groupRow[0].position;
    }

    getRowCountInGroup(groupIndex) {
        const groupRow = this.getLastGroupRow(groupIndex);
        const cellAmount = groupRow.length;
        const lastCellData = groupRow[cellAmount - 1].cellData;
        const lastCellIndex = lastCellData.index;

        return (lastCellIndex + 1) / groupRow.length;
    }
}

export default class ViewDataProvider {
    constructor(workspace) {
        this._viewDataGenerator = null;
        this._viewData = [];
        this._completeViewDataMap = [];
        this._completeDateHeaderMap = [];
        this._viewDataMap = [];
        this._groupedDataMapProvider = null;
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

    get completeDateHeaderMap() { return this._completeDateHeaderMap; }
    set completeDateHeaderMap(value) { this._completeDateHeaderMap = value; }

    get viewData() { return this._viewData; }
    set viewData(value) { this._viewData = value; }

    get viewDataMap() { return this._viewDataMap; }
    set viewDataMap(value) { this._viewDataMap = value; }

    get dateHeaderMap() { return this._dateHeaderMap; }
    set dateHeaderMap(value) { this._dateHeaderMap = value; }

    get groupedDataMap() { return this._groupedDataMapProvider.groupedDataMap; }

    get isVerticalGroupedWorkspace() { return this._workspace._isVerticalGroupedWorkSpace(); }

    update(isGenerateNewViewData) {
        const { viewDataGenerator, _workspace } = this;
        const renderOptions = _workspace.generateRenderOptions();

        if(isGenerateNewViewData) {
            this.completeViewDataMap = viewDataGenerator._getCompleteViewDataMap(renderOptions);
            this.completeDateHeaderMap = viewDataGenerator
                ._getCompleteDateHeaderMap(renderOptions, this.completeViewDataMap);
        }

        this.viewDataMap = viewDataGenerator._generateViewDataMap(this.completeViewDataMap, renderOptions);
        this.viewData = viewDataGenerator._getViewDataFromMap(this.viewDataMap, this.completeViewDataMap, renderOptions);
        this._groupedDataMapProvider = new GroupedDataMapProvider(
            this.viewDataGenerator,
            this.viewDataMap,
            this.completeViewDataMap,
            this._workspace,
        );
        this.dateHeaderMap = viewDataGenerator._generateDateHeaderMap(this.completeDateHeaderMap, renderOptions);
    }

    getStartDate() {
        const { groupedData } = this.viewData;
        const { dateTable } = groupedData[0];

        return dateTable[0][0].startDate;
    }

    getGroupStartDate(groupIndex) {
        return this._groupedDataMapProvider.getGroupStartDate(groupIndex);
    }

    getGroupEndDate(groupIndex) {
        return this._groupedDataMapProvider.getGroupEndDate(groupIndex);
    }

    findGroupCellStartDate(groupIndex, startDate, endDate, isAllDay) {
        return this._groupedDataMapProvider.findGroupCellStartDate(groupIndex, startDate, endDate, isAllDay);
    }

    findAllDayGroupCellStartDate(groupIndex, startDate) {
        return this._groupedDataMapProvider.findAllDayGroupCellStartDate(groupIndex, startDate);
    }

    findCellPositionInMap(groupIndex, startDate, isAllDay) {
        return this._groupedDataMapProvider.findCellPositionInMap(groupIndex, startDate, isAllDay);
    }

    getCellsGroup(groupIndex) {
        return this._groupedDataMapProvider.getCellsGroup(groupIndex);
    }

    getGroupsInfo() {
        return this._groupedDataMapProvider.getGroupsInfo();
    }

    getGroupIndices() {
        return this._groupedDataMapProvider.getGroupIndices();
    }

    getLasGroupCellPosition(groupIndex) {
        return this._groupedDataMapProvider.getLasGroupCellPosition(groupIndex);
    }

    getRowCountInGroup(groupIndex) {
        return this._groupedDataMapProvider.getRowCountInGroup(groupIndex);
    }

    getCellData(rowIndex, cellIndex, isAllDay) {
        if(isAllDay && !this.isVerticalGroupedWorkspace) {
            return this._viewData.groupedData[0].allDayPanel[cellIndex];
        }

        const { cellData } = this.viewDataMap[rowIndex][cellIndex];

        return cellData;
    }

    getCellsByGroupIndexAndAllDay(groupIndex, allDay) {
        const workspace = this._workspace;
        const rowsPerGroup = workspace._getRowCountWithAllDayRows();
        const isShowAllDayPanel = workspace.isAllDayPanelVisible;

        const firstRowInGroup = this.isVerticalGroupedWorkspace
            ? groupIndex * rowsPerGroup
            : 0;
        const lastRowInGroup = this.isVerticalGroupedWorkspace
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

    getGroupData(groupIndex) {
        const { groupedData } = this.viewData;

        if(this.isVerticalGroupedWorkspace) {
            return groupedData.filter(item => item.groupIndex === groupIndex)[0];
        }

        const filterCells = row => row?.filter(cell => cell.groupIndex === groupIndex);

        const {
            allDayPanel,
            dateTable
        } = groupedData[0];
        const filteredDateTable = [];

        dateTable.forEach(row => {
            filteredDateTable.push(
                filterCells(row)
            );
        });

        return {
            allDayPanel: filterCells(allDayPanel),
            dateTable: filteredDateTable
        };
    }

    getAllDayPanel(groupIndex) {
        const groupData = this.getGroupData(groupIndex);

        return groupData?.allDayPanel;
    }

    isGroupIntersectDateInterval(groupIndex, startDate, endDate) {
        const groupStartDate = this.getGroupStartDate(groupIndex);
        const groupEndDate = this.getGroupEndDate(groupIndex);

        return startDate < groupEndDate && endDate > groupStartDate;
    }

    findGlobalCellPosition(date, groupIndex = 0, allDay = false) {
        const { completeViewDataMap, _workspace: workspace } = this;

        const showAllDayPanel = workspace.isAllDayPanelVisible;

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
                    && allDay === !!currentAllDay
                    && this._compareDatesAndAllDay(date, currentStartDate, currentEndDate, allDay)) {
                    return {
                        position: {
                            columnIndex,
                            rowIndex: showAllDayPanel && !this.isVerticalGroupedWorkspace
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
