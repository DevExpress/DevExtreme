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

    generateMaps(groupedData) {
        const viewDataMap = [];
        const groupedDataMap = [];
        const addToViewDataMap = (cellsData, groupIndex) => {
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

            return cellsMap;
        };

        groupedData?.forEach(data => {
            const {
                dateTable,
                allDayPanel,
                isGroupedAllDayPanel,
                groupIndex
            } = data;
            const cellsMap = [];

            if(isGroupedAllDayPanel && allDayPanel?.length) {
                cellsMap.push(addToViewDataMap(allDayPanel, groupIndex));
            }

            dateTable.forEach(rows => {
                cellsMap.push(addToViewDataMap(rows, groupIndex));
            });

            groupedDataMap[groupIndex] = cellsMap;
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

    update() {
        const { viewDataGenerator } = this;
        const { viewData } = viewDataGenerator.generate();

        this.viewData = viewData;

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

    getCellsGroup(groupIndex) {
        const { dateTable } = this._getGroupData(groupIndex);

        return dateTable[0][0].groups;
    }

    getCellData(rowIndex, cellIndex) {
        const { cellData } = this.viewDataMap[rowIndex][cellIndex];

        return cellData;
    }

    findCellPosition(groupIndices, startDate) {
        for(let i = 0; i < groupIndices.length; ++i) {
            return this._findCellPositionInMap(groupIndices[i], startDate);
        }
    }

    _findCellPositionInMap(groupIndex, startDate, isAllDay) {
        const startTime = startDate.getTime();
        const isStartTimeInCell = cellData => {
            const cellStartTime = cellData.startDate.getTime();
            const cellEndTime = cellData.endDate.getTime();

            return isAllDay
                ? startTime >= cellStartTime && startTime <= cellEndTime
                : startTime >= cellStartTime && startTime < cellEndTime;
        };

        const isVerticalGrouping = this.viewDataGenerator.workspace._isVerticalGroupedWorkSpace();
        const rows = isVerticalGrouping
            ? this.groupedDataMap[groupIndex]
            : this.groupedDataMap[0];

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
        const {
            viewDataMap,
            groupedDataMap
        } = this.viewDataGenerator.generateMaps(groupedData);

        this.viewDataMap = viewDataMap;
        this.groupedDataMap = groupedDataMap;
    }
}
