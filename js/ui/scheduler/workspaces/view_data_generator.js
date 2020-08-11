export default class ViewDataGenerator {
    constructor(workspace) {
        this.workspace = workspace;
    }

    get workspace() { return this._workspace; }
    set workspace(value) { this._workspace = value; }

    generate() {
        if(this.workspace.isVirtualScrolling()) {
            return this._generateVirtualView();
        }

        return this._generateView();
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
                    allDayPanelData = this._generateAllDayPanelData(groupIndex, rowCount, cellCount);
                }
            }

            groupedData.push({
                dateTable: viewCellsData,
                allDayPanel: allDayPanelData,
                isGroupedAllDayPanel: workspace._getGroupCount() > 1
            });
        }

        return {
            groupedData,
            isVirtual: true,
            topVirtualRowHeight,
            bottomVirtualRowHeight
        };
    }

    _generateView() {
        const workspace = this._workspace;
        const options = workspace.generateRenderOptions();
        const {
            rowCount,
            cellCount,
            groupCount,
        } = options;

        const groupedData = [];

        for(let groupIndex = 0; groupIndex < groupCount; ++groupIndex) {
            const viewCellsData = this._generateViewCellsData(options, rowCount, 0, rowCount * groupIndex);
            const allDayPanelData = this._generateAllDayPanelData(groupIndex, rowCount, cellCount);
            groupedData.push({
                dateTable: viewCellsData,
                allDayPanel: allDayPanelData,
                isGroupedAllDayPanel: workspace._getGroupCount() > 1
            });
        }

        return {
            groupedData,
            isVirtual: false
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
                    Object.assign(cellDataValue, getter(undefined, rowIndex, j).value);
                });
                viewCellsData[i].push(cellDataValue);
            }
        }

        return viewCellsData;
    }

    _generateAllDayPanelData(groupIndex, rowCount, cellCount) {
        if(!this.workspace.option('showAllDayPanel')) {
            return null;
        }

        const allDayPanel = [];

        for(let i = 0; i < cellCount; ++i) {
            const rowIndex = Math.max(groupIndex * rowCount - 1, 0);
            const cellDataValue = this.workspace._getAllDayCellData(undefined, rowIndex, i).value;
            allDayPanel.push(cellDataValue);
        }

        return allDayPanel;
    }
}
