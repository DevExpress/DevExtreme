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
        const showAllDayPanel = this.workspace.option('showAllDayPanel');

        const indexDifference = isVerticalGrouping || (!isVerticalGrouping && !showAllDayPanel) ? 0 : 1;

        return completeViewDataMap
            .slice(startRowIndex + indexDifference, startRowIndex + rowCount + indexDifference)
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
        const showAllDayPanel = this.workspace.option('showAllDayPanel');

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
            const cellDataValue = this.workspace._getAllDayCellData(undefined, rowIndex, columnIndex, groupIndex).value;
            cellDataValue.index = this._calculateCellIndex(
                horizontalGroupsCount, this._workspace.option('groupOrientation'), this._workspace.isGroupedByDate(),
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

    generateMaps(groupedData) {
        const viewDataMap = [];
        const groupedDataMap = [];
        const addToViewDataMap = (cellsData, dataRowIndex) => {
            const cellsMap = [];
            cellsData.forEach((cellData, cellIndex) => {
                const cellMap = {
                    cellData,
                    position: {
                        rowIndex: viewDataMap.length,
                        cellIndex
                    }
                };
                cellsMap.push(cellMap);

                const { groupIndex } = cellData;
                addToGroupedDataMap(groupIndex, dataRowIndex, cellMap);
            });

            viewDataMap.push(cellsMap);

            return cellsMap;
        };

        const addToGroupedDataMap = (groupIndex, rowIndex, cellMap) => {
            if(!groupedDataMap[groupIndex]) {
                groupedDataMap[groupIndex] = [];
            }
            if(!groupedDataMap[groupIndex][rowIndex]) {
                groupedDataMap[groupIndex][rowIndex] = [];
            }

            groupedDataMap[groupIndex][rowIndex].push(cellMap);
        };

        groupedData?.forEach(data => {
            const {
                dateTable,
                allDayPanel,
                isGroupedAllDayPanel
            } = data;
            const cellsMap = [];

            let rowIndex = 0;
            if(isGroupedAllDayPanel && allDayPanel?.length) {
                cellsMap.push(addToViewDataMap(allDayPanel, rowIndex++));
            }

            dateTable.forEach(cells => {
                cellsMap.push(addToViewDataMap(cells, rowIndex++));
            });
        });

        return {
            viewDataMap,
            groupedDataMap
        };
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

    update(isGenerateNewViewData) {
        const { viewDataGenerator, _workspace } = this;
        const renderOptions = _workspace.generateRenderOptions();

        if(isGenerateNewViewData) {
            this._completeViewDataMap = viewDataGenerator._getCompleteViewDataMap(renderOptions);
        }

        this.viewDataMap = viewDataGenerator._generateViewDataMap(this._completeViewDataMap, renderOptions);
        this.viewData = viewDataGenerator._getViewDataFromMap(this.viewDataMap, this._completeViewDataMap, renderOptions);

        this._generateMaps();
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

    getCellData(rowIndex, cellIndex) {
        const { cellData } = this.viewDataMap[rowIndex][cellIndex];

        return cellData;
    }

    findCellPositionInMap(groupIndex, startDate, isAllDay) {
        const startTime = startDate.getTime();
        const isStartTimeInCell = cellData => {
            const cellStartTime = cellData.startDate.getTime();
            const cellEndTime = cellData.endDate.getTime();

            return isAllDay
                ? cellData.allDay && startTime >= cellStartTime && startTime <= cellEndTime
                : startTime >= cellStartTime && startTime < cellEndTime;
        };

        const rows = this.groupedDataMap[groupIndex];

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
    }

    _getGroupData(groupIndex) {
        const { groupedData } = this.viewData;
        return groupedData.filter(item => item.groupIndex === groupIndex)[0];
    }

    _generateMaps() {
        const { groupedData } = this.viewData;
        const { groupedDataMap } = this.viewDataGenerator.generateMaps(groupedData);

        this.groupedDataMap = groupedDataMap;
    }
}
