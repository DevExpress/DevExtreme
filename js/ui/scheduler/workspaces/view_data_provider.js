class ViewDataGenerator {
    constructor(workspace) {
        this.workspace = workspace;
    }

    get workspace() { return this._workspace; }
    set workspace(value) { this._workspace = value; }

    generate() {
        let result;

        if(this.workspace.isVirtualScrolling()) {
            result = this._generateVirtualView();
        } else {
            result = this._generateView();
        }

        return result;
    }

    _generateVirtualView() {
        const workspace = this._workspace;
        const options = workspace.generateRenderOptions();
        const {
            cellCount,
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            startRowIndex,
            groupCount,
            rowCount,
            rowCountInGroup
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
                    allDayPanelData = this._generateAllDayPanelData(groupIndex, cellCount);
                }

                viewCellsData = this._generateViewCellsData(
                    options,
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
                bottomVirtualRowHeight
            },
            viewDataMap: this._getViewDataMap(groupedData)
        };
    }

    _generateView() {
        const workspace = this._workspace;
        const options = workspace.generateRenderOptions();
        const isGroupedAllDayPanel = workspace.isGroupedAllDayPanel();
        const {
            rowCount,
            cellCount,
            groupCount,
        } = options;

        const groupedData = [];

        for(let groupIndex = 0; groupIndex < groupCount; ++groupIndex) {
            const allDayPanelData = this._generateAllDayPanelData(groupIndex, cellCount);
            const viewCellsData = this._generateViewCellsData(
                options,
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
                groupedData
            },
            viewDataMap: this._getViewDataMap(groupedData)
        };
    }

    _generateViewCellsData(options, renderRowCount, startRowIndex, rowOffset) {
        const {
            cellCount,
            cellDataGetters
        } = options;
        const viewCellsData = [];

        for(let i = 0; i < renderRowCount; ++i) {
            const rowIndex = startRowIndex + rowOffset + i;

            viewCellsData.push([]);
            for(let j = 0; j < cellCount; ++j) {

                const cellDataValue = { };

                cellDataGetters.forEach(getter => {
                    const value = getter(undefined, rowIndex, j).value;
                    value.hash = `${rowIndex}_${j}`;
                    Object.assign(cellDataValue, value);
                });

                viewCellsData[i].push(cellDataValue);
            }
        }

        return viewCellsData;
    }

    _getCellDataHash(rowIndex, cellIndex) {
        return `${rowIndex}_${cellIndex}`;
    }

    _generateAllDayPanelData(groupIndex, cellCount) {
        if(!this.workspace.option('showAllDayPanel')) {
            return null;
        }

        const rowCount = this.workspace._getRowCount();

        const allDayPanel = [];

        for(let i = 0; i < cellCount; ++i) {
            const rowIndex = Math.max(groupIndex * rowCount, 0);
            const cellDataValue = this.workspace._getAllDayCellData(undefined, rowIndex, i).value;
            allDayPanel.push(cellDataValue);
        }

        return allDayPanel;
    }

    _getViewDataMap(groupedData) {
        const viewDataMap = [];
        const addToMap = cellsData => {
            cellsData.forEach((cellData, cellIndex) => {
                cellData.position = {
                    rowIndex: viewDataMap.length,
                    cellIndex: cellIndex
                };
            });

            viewDataMap.push(cellsData);
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
        this._viewData = null;
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

    get groupedDataMap() {
        if(!this._groupedDataMap.length && this.viewData) {
            this._groupedDataMap = this.viewDataGenerator.getGroupedDataMap(this.viewData.groupedData);
        }
        return this._groupedDataMap;
    }

    update() {
        const {
            viewData,
            viewDataMap
        } = this.viewDataGenerator.generate();

        this.viewData = viewData;
        this.viewDataMap = viewDataMap;
        this.groupedDataMap = this.viewDataGenerator.getGroupedDataMap(viewData.groupedData);
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

    getGroupInfo(groupIndex) {
        const { dateTable } = this._getGroupData(groupIndex);

        return dateTable[0][0].groups;
    }

    _getGroupData(groupIndex) {
        const { groupedData } = this.viewData;
        return groupedData.find(item => item.groupIndex === groupIndex);
    }
}
