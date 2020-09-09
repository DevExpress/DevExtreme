class ViewDataGenerator {
    constructor(workspace) {
        this.workspace = workspace;
    }

    get workspace() { return this._workspace; }
    set workspace(value) { this._workspace = value; }

    generateCompleteViewData() {
        return this._generateViewData();
    }

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

    _getCompleteViewDataMap() {
        const options = this._workspace.generateRenderOptions();
        const {
            nonVirtualRowCount: rowCount,
            cellCount,
            groupCount,
        } = options;

        let viewDataMap = [];
        for(let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
            const allDayPanelData = this._generateAllDayPanelData(options, groupIndex, rowCount, cellCount);
            const viewCellsData = this._generateViewCellsData(
                options,
                groupIndex,
                rowCount,
                0,
                rowCount * groupIndex
            );

            allDayPanelData && viewDataMap.push(allDayPanelData);
            viewDataMap = [
                ...viewDataMap,
                ...viewCellsData,
            ];
        }

        return viewDataMap;
    }

    _getViewDataMap(completeViewDataMap) {
        const {
            startRowIndex,
            rowCount,
        } = this._workspace.generateRenderOptions();

        const showAllDayPanelInDateTable = this.workspace.option('showAllDayPanel')
            && this.workspace._isVerticalGroupedWorkSpace();
        const indexDifference = showAllDayPanelInDateTable ? 0 : 1;

        return completeViewDataMap
            .slice(startRowIndex + indexDifference, startRowIndex + rowCount + indexDifference)
            .map((cellsRow, rowIndex) => cellsRow.map((cellData, cellIndex) => ({
                cellData,
                position: { rowIndex, cellIndex },
            })));
    }

    _getViewDataFromMap(viewDataMap, completeViewDataMap) {
        const {
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            cellCountInGroupRow,
        } = this._workspace.generateRenderOptions();

        const {
            previousGroupedData: groupedData,
        } = viewDataMap.reduce(({ previousGroupIndex, previousGroupedData }, cellsRow) => {
            const cellDataRow = cellsRow.map(({ cellData }) => cellData);

            const isAllDayRow = cellDataRow[0].allDay;
            const currentGroupIndex = cellDataRow[0].groupIndex;

            if(currentGroupIndex !== previousGroupIndex) {
                previousGroupedData.push({
                    dateTable: [],
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

    _generateViewData() {
        const workspace = this._workspace;
        const options = workspace.generateRenderOptions();
        const isGroupedAllDayPanel = workspace.isGroupedAllDayPanel();
        const {
            nonVirtualRowCount: rowCount,
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

    getViewDataMap(groupedData, subtractTopRowCount) {
        const options = this.workspace.generateRenderOptions();
        const { startRowIndex } = options;
        const viewDataMap = [];
        const addToMap = cellsData => {
            const cellsMap = [];
            cellsData.forEach((cellData, cellIndex) => {
                const cellMap = {
                    cellData,
                    position: {
                        rowIndex: subtractTopRowCount ? viewDataMap.length : viewDataMap.length - startRowIndex,
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
        this._completeViewData = [];
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
        const { viewDataGenerator } = this;

        if(isGenerateNewViewData) {
            this._completeViewDataMap = viewDataGenerator._getCompleteViewDataMap();
        }

        this.viewDataMap = viewDataGenerator._getViewDataMap(this._completeViewDataMap);
        this.viewData = viewDataGenerator._getViewDataFromMap(this.viewDataMap, this._completeViewDataMap);

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

    getCellData(rowIndex, cellIndex) {
        const { cellData } = this.viewDataMap[rowIndex][cellIndex];

        return cellData;
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
