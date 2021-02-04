import dateUtils from '../../../core/utils/date';
import { HORIZONTAL_GROUP_ORIENTATION } from '../constants';

class ViewDataGenerator {
    constructor(workspace) {
        this.workspace = workspace;
    }

    get workspace() { return this._workspace; }
    set workspace(value) { this._workspace = value; }
    get isVerticalGroupedWorkspace() { return this.workspace._isVerticalGroupedWorkSpace(); }
    get isStandaloneAllDayPanel() { return !this.isVerticalGroupedWorkspace && this.workspace.isAllDayPanelVisible; }

    _getCompleteViewDataMap(options) {
        const {
            totalRowCount,
            cellCountInGroupRow,
            groupsList,
            groupByDate,
            isHorizontalGrouping,
            isVerticalGrouping,
            totalCellCount,
            groupCount,
        } = options;
        const viewDataMap = [];
        const step = groupByDate ? groupCount : 1;
        const allDayPanelData = this._generateAllDayPanelData(options, cellCountInGroupRow, step);
        const viewCellsData = this._generateViewCellsData(options, totalRowCount, step);

        allDayPanelData && viewDataMap.push(allDayPanelData);
        viewDataMap.push(...viewCellsData);

        if(isHorizontalGrouping && !groupByDate) {
            return this._transformViewDataMapForHorizontalGrouping(viewDataMap, groupsList, totalCellCount);
        }

        if(isVerticalGrouping) {
            return this._transformViewDataMapForVerticalGrouping(viewDataMap, groupsList, totalCellCount);
        }

        if(groupByDate) {
            return this._transformViewDataMapForGroupingByDate(viewDataMap, groupsList, totalCellCount);
        }

        return viewDataMap;
    }

    _transformViewDataMapForHorizontalGrouping(viewDataMap, groupsList, totalColumnCount) {
        const completeViewDataMap = viewDataMap.map(row => row.slice());

        groupsList.slice(1).forEach((groups, index) => {
            const groupIndex = index + 1;

            viewDataMap.forEach((row, rowIndex) => {
                completeViewDataMap[rowIndex].push(...row.map((cellData) => ({
                    ...cellData,
                    groups,
                    groupIndex,
                })));
            });
        });

        const {
            currentViewDataMap: result,
        } = completeViewDataMap.reduce(({ allDayPanelsCount, currentViewDataMap }, row, rowIndex) => {
            const isAllDay = row[0].allDay;

            const keyBase = (rowIndex - allDayPanelsCount) * totalColumnCount;

            const currentAllDayPanelsCount = isAllDay
                ? allDayPanelsCount + 1
                : allDayPanelsCount;

            currentViewDataMap[rowIndex].forEach((cell, cellIndex) => {
                cell.key = keyBase + cellIndex;
            });

            return { allDayPanelsCount: currentAllDayPanelsCount, currentViewDataMap };
        }, {
            allDayPanelsCount: 0,
            currentViewDataMap: completeViewDataMap,
        });

        return result;
    }

    _transformViewDataMapForVerticalGrouping(viewDataMap, groupsList, totalColumnCount) {
        const completeViewDataMap = viewDataMap.map(row => row.slice());

        groupsList.slice(1).forEach((groups, index) => {
            const groupIndex = index + 1;

            completeViewDataMap.push(...viewDataMap.map((cellsRow) => cellsRow.map((cellData) => ({
                ...cellData,
                groupIndex,
                groups,
            }))));
        });

        const {
            currentViewDataMap: result,
        } = completeViewDataMap.reduce(({ allDayPanelsCount, currentViewDataMap }, row, rowIndex) => {
            const isAllDay = row[0].allDay;

            const keyBase = (rowIndex - allDayPanelsCount) * totalColumnCount;

            const currentAllDayPanelsCount = isAllDay
                ? allDayPanelsCount + 1
                : allDayPanelsCount;

            currentViewDataMap[rowIndex].forEach((cell, cellIndex) => {
                cell.key = keyBase + cellIndex;
            });

            return { allDayPanelsCount: currentAllDayPanelsCount, currentViewDataMap };
        }, {
            allDayPanelsCount: 0,
            currentViewDataMap: completeViewDataMap,
        });

        return result;
    }

    _transformViewDataMapForGroupingByDate(viewDataMap, groupsList, totalColumnCount) {
        const correctedGroupList = groupsList.slice(1);
        const otherGroupCount = correctedGroupList.length;

        const completeViewDataMap = viewDataMap.map((cellsRow) => cellsRow.reduce((currentRow, cell) => [
            ...currentRow,
            {
                ...cell,
                isFirstGroupCell: true,
                isLastGroupCell: otherGroupCount === 0,
            },
            ...correctedGroupList.map((groups, index) => ({
                ...cell,
                groups,
                groupIndex: index + 1,
                isFirstGroupCell: false,
                isLastGroupCell: index === otherGroupCount - 1,
            })),
        ], []));

        const {
            currentViewDataMap: result,
        } = completeViewDataMap.reduce(({ allDayPanelsCount, currentViewDataMap }, row, rowIndex) => {
            const isAllDay = row[0].allDay;

            const keyBase = (rowIndex - allDayPanelsCount) * totalColumnCount;

            const currentAllDayPanelsCount = isAllDay
                ? allDayPanelsCount + 1
                : allDayPanelsCount;

            currentViewDataMap[rowIndex].forEach((cell, cellIndex) => {
                cell.key = keyBase + cellIndex;
            });

            return { allDayPanelsCount: currentAllDayPanelsCount, currentViewDataMap };
        }, {
            allDayPanelsCount: 0,
            currentViewDataMap: completeViewDataMap,
        });

        return result;
    }

    _getCompleteDateHeaderMap(options, completeViewDataMap) {
        const {
            isGenerateWeekDaysHeaderData,
        } = options;

        const result = [];

        if(isGenerateWeekDaysHeaderData) {
            const weekDaysRow = this._generateWeekDaysHeaderRowMap(options, completeViewDataMap);
            result.push(weekDaysRow);
        }

        const dateRow = this._generateHeaderDateRow(options, completeViewDataMap);

        result.push(dateRow);

        return result;
    }

    _generateWeekDaysHeaderRowMap(options, completeViewDataMap) {
        const {
            groupByDate,
            horizontalGroupCount,
            cellCountInDay,
            getWeekDaysHeaderText,
            daysInView,
        } = options;

        const index = completeViewDataMap[0][0].allDay ? 1 : 0;
        const colSpan = groupByDate ? horizontalGroupCount * cellCountInDay : cellCountInDay;

        const weekDaysRow = [];

        for(let dayIndex = 0; dayIndex < daysInView; dayIndex += 1) {
            const cell = completeViewDataMap[index][dayIndex * cellCountInDay];

            weekDaysRow.push({
                ...cell,
                colSpan,
                text: getWeekDaysHeaderText(cell.startDate),
                isFirstGroupCell: false,
                isLastGroupCell: false,
            });
        }

        return weekDaysRow;
    }

    _generateHeaderDateRow(options, completeViewDataMap) {
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

        const slicedByColumnsData = completeViewDataMap[index].slice(0, dateHeaderColumnCount);

        return slicedByColumnsData.map(({
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
    }

    _generateViewDataMap(completeViewDataMap, options) {
        const {
            rowCount,
            startCellIndex,
            cellCount
        } = options;
        const { startRowIndex } = options;

        const sliceCells = (row, rowIndex, startIndex, count) => {
            return row
                .slice(startIndex, startIndex + count)
                .map((cellData, cellIndex) => (
                    {
                        cellData,
                        position: {
                            rowIndex,
                            cellIndex
                        }
                    })
                );

        };

        let correctedStartRowIndex = startRowIndex;
        let allDayPanelMap = [];
        if(this.isStandaloneAllDayPanel) {
            correctedStartRowIndex++;
            allDayPanelMap = sliceCells(completeViewDataMap[0], 0, startCellIndex, cellCount);
        }

        const dateTableMap = completeViewDataMap
            .slice(correctedStartRowIndex, correctedStartRowIndex + rowCount)
            .map((row, rowIndex) => sliceCells(row, rowIndex, startCellIndex, cellCount));

        return {
            allDayPanelMap,
            dateTableMap
        };
    }

    _generateDateHeaderMap(completeDateHeaderMap, options) {
        return completeDateHeaderMap.map(headerRow => headerRow.slice(0)); // TODO: virtualization
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
            allDayPanelMap,
            dateTableMap
        } = viewDataMap;

        const {
            previousGroupedData: groupedData,
        } = dateTableMap.reduce(({ previousGroupIndex, previousGroupedData }, cellsRow) => {
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

        if(this.isStandaloneAllDayPanel) {
            groupedData[0].allDayPanel = allDayPanelMap.map(({ cellData }) => cellData);
        }

        return {
            groupedData,
            isVirtual: this.workspace.isVirtualScrolling(), // TODO get rid of the 'isVirtual' prop
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            leftVirtualCellWidth,
            rightVirtualCellWidth,
            cellCountInGroupRow,
            isGroupedAllDayPanel
        };
    }

    _generateViewCellsData(options, rowsCount, step = 1) {
        const {
            cellCountInGroupRow,
            cellDataGetters,
        } = options;
        const viewCellsData = [];

        for(let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
            viewCellsData.push(this._generateCellsRow(
                options, cellDataGetters, rowIndex, cellCountInGroupRow, step,
            ));
        }

        return viewCellsData;
    }

    _generateAllDayPanelData(options, cellCount, step = 1) {
        const workSpace = this.workspace;
        if(!workSpace.isAllDayPanelVisible) {
            return null;
        }

        return this._generateCellsRow(
            options, [workSpace._getAllDayCellData.bind(workSpace)],
            0, cellCount, step,
        );
    }

    _generateCellsRow(options, cellDataGetters, rowIndex, columnCount, step) {
        const cellsRow = [];

        for(let columnIndex = 0; columnIndex < columnCount; ++columnIndex) {
            const correctedColumnIndex = step * columnIndex;
            const cellDataValue = cellDataGetters.reduce((data, getter) => ({
                ...data,
                ...getter(undefined, rowIndex, correctedColumnIndex, 0, data.startDate).value
            }), {});

            cellDataValue.index = rowIndex * columnCount + columnIndex;

            cellDataValue.isFirstGroupCell = this._isFirstGroupCell(
                rowIndex, columnIndex, options,
            );
            cellDataValue.isLastGroupCell = this._isLastGroupCell(
                rowIndex, columnIndex, options,
            );

            cellDataValue.key = this._getKeyByRowAndColumn(rowIndex, columnIndex, columnCount);

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
        const {
            allDayPanelMap,
            dateTableMap
        } = viewDataMap;

        const { previousGroupedDataMap: dateTableGroupedMap } = dateTableMap.reduce((previousOptions, cellsRow) => {
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

        const allDayPanelGroupedMap = [];
        allDayPanelMap?.forEach((cell) => {

            const { groupIndex } = cell.cellData;

            if(!allDayPanelGroupedMap[groupIndex]) {
                allDayPanelGroupedMap[groupIndex] = [];
            }

            allDayPanelGroupedMap[groupIndex].push(cell);
        });

        return {
            allDayPanelGroupedMap,
            dateTableGroupedMap
        };
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

        const groupStartDate = this.getGroupStartDate(groupIndex);
        const groupEndDate = this.getGroupEndDate(groupIndex);
        const isStartBeforeGroup = dateUtils.trimTime(startDate) < dateUtils.trimTime(groupStartDate);
        const isEndAfterGroup = dateUtils.trimTime(endDate) > dateUtils.trimTime(groupEndDate);
        const isEndInsideGroup = dateUtils.trimTime(endDate) >= dateUtils.trimTime(groupStartDate) && !isEndAfterGroup;
        const isStartInsideGroup = dateUtils.trimTime(startDate) >= dateUtils.trimTime(groupStartDate);

        if(dateUtils.trimTime(startDate) > dateUtils.trimTime(groupEndDate) ||
            dateUtils.trimTime(endDate) < dateUtils.trimTime(groupStartDate)) {
            return;
        }

        if(isStartBeforeGroup && (isEndInsideGroup || isEndAfterGroup)) {
            return groupStartDate;
        }

        const firstRow = this.getFirstGroupRow(groupIndex);
        if(!firstRow) return;

        let dateToCompare;
        if(isStartInsideGroup) {
            dateToCompare = startDate;
        } else if(isEndInsideGroup) {
            dateToCompare = dateUtils.trimTime(endDate);
        }

        const lastRow = this.getLastGroupRow(groupIndex);
        for(let i = 0; i < firstRow.length; ++i) {
            let firstRowCell = firstRow[i];
            const cellStartDate = getCellStartDate(firstRowCell);

            if(dateUtils.sameDate(cellStartDate, dateToCompare)) {
                let lastRowCell = lastRow[i];

                if(getCellEndDate(lastRowCell) <= dateToCompare) {
                    if(endDate > dateToCompare) {
                        firstRowCell = firstRow[i + 1];
                        lastRowCell = lastRow[i + 1];
                    }
                }

                if(getCellEndDate(lastRowCell) > dateToCompare) {
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

        const {
            allDayPanelGroupedMap,
            dateTableGroupedMap
        } = this.groupedDataMap;

        const rows = isAllDay && !this._workspace._isVerticalGroupedWorkSpace()
            ? [allDayPanelGroupedMap[groupIndex]] || []
            : dateTableGroupedMap[groupIndex] || [];

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
        const { dateTableGroupedMap } = this.groupedDataMap;
        const groupData = dateTableGroupedMap[groupIndex];

        if(groupData) {
            const { cellData } = groupData[0][0];

            return cellData.groups;
        }
    }

    getCompletedGroupsInfo() {
        const { dateTableGroupedMap } = this.groupedDataMap;
        return dateTableGroupedMap.map(groupData => {
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
        }).filter(({ startDate }) => !!startDate);
    }

    getGroupIndices() {
        return this.getCompletedGroupsInfo()
            .map(({ groupIndex }) => groupIndex);
    }

    getFirstGroupRow(groupIndex) {
        const { dateTableGroupedMap } = this.groupedDataMap;
        const groupedData = dateTableGroupedMap[groupIndex];

        if(groupedData) {
            const { cellData } = groupedData[0][0];

            return !cellData.allDay
                ? groupedData[0]
                : groupedData[1];
        }
    }

    getLastGroupRow(groupIndex) {
        const { dateTableGroupedMap } = this.groupedDataMap;
        const groupedData = dateTableGroupedMap[groupIndex];

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

    getCompletedGroupsInfo() {
        return this._groupedDataMapProvider.getCompletedGroupsInfo();
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

        const { dateTableMap } = this.viewDataMap;
        const { cellData } = dateTableMap[rowIndex][cellIndex];

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
