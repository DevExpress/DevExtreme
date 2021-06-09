import dateUtils from '../../../../core/utils/date';
import { GroupedDataMapProvider } from './grouped_data_map_provider';
import { ViewDataGenerator } from './view_data_generator';

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
            this._viewDataGenerator = new ViewDataGenerator();
        }
        return this._viewDataGenerator;
    }

    get completeViewDataMap() { return this._completeViewDataMap; }
    set completeViewDataMap(value) { this._completeViewDataMap = value; }

    get completeDateHeaderMap() { return this._completeDateHeaderMap; }
    set completeDateHeaderMap(value) { this._completeDateHeaderMap = value; }

    get completeTimePanelMap() { return this._completeTimePanelMap; }
    set completeTimePanelMap(value) { this._completeTimePanelMap = value; }

    get viewData() { return this._viewData; }
    set viewData(value) { this._viewData = value; }

    get viewDataMap() { return this._viewDataMap; }
    set viewDataMap(value) { this._viewDataMap = value; }

    get dateHeaderData() { return this._dateHeaderData; }
    set dateHeaderData(value) { this._dateHeaderData = value; }

    get timePanelData() { return this._timePanelData; }
    set timePanelData(value) { this._timePanelData = value; }

    get groupedDataMap() { return this._groupedDataMapProvider.groupedDataMap; }

    get isVerticalGroupedWorkspace() { return this._workspace._isVerticalGroupedWorkSpace(); }

    update(isGenerateNewViewData) {
        const viewDataGenerator = this.viewDataGenerator;
        const renderOptions = this._workspace.generateRenderOptions();

        if(isGenerateNewViewData) {
            this.completeViewDataMap = viewDataGenerator._getCompleteViewDataMap(renderOptions);
            this.completeDateHeaderMap = viewDataGenerator
                ._getCompleteDateHeaderMap(renderOptions, this.completeViewDataMap);
            this.completeTimePanelMap = viewDataGenerator
                ._getCompleteTimePanelMap(renderOptions, this.completeViewDataMap);
        }

        this.viewDataMap = viewDataGenerator._generateViewDataMap(this.completeViewDataMap, renderOptions);
        this.viewData = viewDataGenerator._getViewDataFromMap(this.viewDataMap, renderOptions);
        this._groupedDataMapProvider = new GroupedDataMapProvider(
            this.viewDataGenerator,
            this.viewDataMap,
            this.completeViewDataMap,
            {
                isVerticalGrouping: renderOptions.isVerticalGrouping,
                isDateAndTimeView: renderOptions.isDateAndTimeView,
            },
        );

        this.dateHeaderData = viewDataGenerator._generateDateHeaderData(this.completeDateHeaderMap, renderOptions);
        this.timePanelData = viewDataGenerator._generateTimePanelData(
            this.completeTimePanelMap,
            renderOptions,
        );
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

    findCellPositionInMap(cellInfo) {
        return this._groupedDataMapProvider.findCellPositionInMap(cellInfo);
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

    getLastGroupCellPosition(groupIndex) {
        return this._groupedDataMapProvider.getLastGroupCellPosition(groupIndex);
    }

    getRowCountInGroup(groupIndex) {
        return this._groupedDataMapProvider.getRowCountInGroup(groupIndex);
    }

    getCellData(rowIndex, columnIndex, isAllDay) {
        if(isAllDay && !this.isVerticalGroupedWorkspace) {
            return this._viewData.groupedData[0].allDayPanel[columnIndex];
        }

        const { dateTableMap } = this.viewDataMap;
        const { cellData } = dateTableMap[rowIndex][columnIndex];

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

    getCellCountWithGroup(groupIndex, rowIndex = 0) {
        const { dateTableGroupedMap } = this.groupedDataMap;

        return dateTableGroupedMap
            .filter((_, index) => index <= groupIndex)
            .reduce(
                (previous, row) => previous + row[rowIndex].length,
                0
            );
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

    getSkippedDaysCount(groupIndex, startDate, endDate, daysCount) {
        const { dateTableGroupedMap } = this._groupedDataMapProvider.groupedDataMap;
        const groupedData = dateTableGroupedMap[groupIndex];
        let includedDays = 0;

        for(let rowIndex = 0; rowIndex < groupedData.length; rowIndex += 1) {
            for(let columnIndex = 0; columnIndex < groupedData[rowIndex].length; columnIndex += 1) {
                const cell = groupedData[rowIndex][columnIndex].cellData;
                if(startDate.getTime() < cell.endDate.getTime()
                    && endDate.getTime() > cell.startDate.getTime()) {
                    includedDays += 1;
                }
            }
        }

        const lastCell = groupedData[groupedData.length - 1][groupedData[0].length - 1].cellData;
        const lastCellStart = dateUtils.trimTime(lastCell.startDate);
        const daysAfterView = Math.floor((endDate.getTime() - lastCellStart.getTime()) / dateUtils.dateToMilliseconds('day'));

        const deltaDays = daysAfterView > 0 ? daysAfterView : 0;

        return daysCount - includedDays - deltaDays;
    }

    getColumnsCount() {
        return this.viewDataMap.dateTableMap[0].length;
    }

    getViewEdgeIndices(isAllDayPanel) {
        if(isAllDayPanel) {
            return {
                firstColumnIndex: 0,
                lastColumnIndex: this.viewDataMap.allDayPanelMap.length - 1,
                firstRowIndex: 0,
                lastRowIndex: 0,
            };
        }

        return {
            firstColumnIndex: 0,
            lastColumnIndex: this.viewDataMap.dateTableMap[0].length - 1,
            firstRowIndex: 0,
            lastRowIndex: this.viewDataMap.dateTableMap.length - 1,
        };
    }

    getGroupEdgeIndices(groupIndex, isAllDay) {
        const groupedDataMap = this.groupedDataMap.dateTableGroupedMap[groupIndex];
        const cellsCount = groupedDataMap[0].length;
        const rowsCount = groupedDataMap.length;

        const firstColumnIndex = groupedDataMap[0][0].position.columnIndex;
        const lastColumnIndex = groupedDataMap[0][cellsCount - 1].position.columnIndex;

        if(isAllDay) {
            return {
                firstColumnIndex,
                lastColumnIndex,
                firstRowIndex: 0,
                lastRowIndex: 0,
            };
        }

        return {
            firstColumnIndex,
            lastColumnIndex,
            firstRowIndex: groupedDataMap[0][0].position.rowIndex,
            lastRowIndex: groupedDataMap[rowsCount - 1][0].position.rowIndex,
        };
    }

    isSameCell(firstCellData, secondCellData) {
        const {
            startDate: firstStartDate,
            groupIndex: firstGroupIndex,
            allDay: firstAllDay,
            index: firstIndex,
        } = firstCellData;
        const {
            startDate: secondStartDate,
            groupIndex: secondGroupIndex,
            allDay: secondAllDay,
            index: secondIndex,
        } = secondCellData;

        return (
            firstStartDate.getTime() === secondStartDate.getTime()
            && firstGroupIndex === secondGroupIndex
            && firstAllDay === secondAllDay
            && firstIndex === secondIndex
        );
    }
}
