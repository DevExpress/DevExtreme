export default class ViewDataGenerator {
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

                viewCellsData = this._generateViewCellsData(options, renderRowCount, startRowIndex, groupOffset);

                const needRenderAllDayPanel = ((startRowIndex + groupOffset) / rowCountInGroup) === groupIndex;
                if(needRenderAllDayPanel) {
                    allDayPanelData = this._generateAllDayPanelData(groupIndex, cellCount);
                }
            }

            groupedData.push({
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
            const viewCellsData = this._generateViewCellsData(options, rowCount, 0, rowCount * groupIndex);
            const allDayPanelData = this._generateAllDayPanelData(groupIndex, cellCount);
            groupedData.push({
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

    _generateViewCellsData(options, renderRowCount, startRowIndex = 0, rowOffset = 0) {
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
                    const cellValue = getter(undefined, rowIndex, j).value;
                    Object.assign(cellDataValue, cellValue);
                });

                viewCellsData[i].push(cellDataValue);
            }
        }

        return viewCellsData;
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
        const result = [];

        groupedData?.forEach(({
            dateTable,
            allDayPanel,
            isGroupedAllDayPanel
        }) => {
            isGroupedAllDayPanel
                && allDayPanel?.length
                && result.push(allDayPanel);
            result.push(...dateTable);
        });

        return result;
    }
}
