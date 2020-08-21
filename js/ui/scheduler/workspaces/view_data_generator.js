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

                viewCellsData = this._generateViewCellsData(options, groupIndex, renderRowCount, startRowIndex, groupOffset);

                const needRenderAllDayPanel = ((startRowIndex + groupOffset) / rowCountInGroup) === groupIndex;
                if(needRenderAllDayPanel) {
                    allDayPanelData = this._generateAllDayPanelData(groupIndex, rowCount, cellCount);
                }
            }

            groupedData.push({
                dateTable: viewCellsData,
                allDayPanel: allDayPanelData,
                isGroupedAllDayPanel
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
        const isGroupedAllDayPanel = workspace.isGroupedAllDayPanel();
        const {
            rowCount,
            cellCount,
            groupCount,
        } = options;

        const groupedData = [];

        for(let groupIndex = 0; groupIndex < groupCount; ++groupIndex) {
            const viewCellsData = this._generateViewCellsData(options, groupIndex, rowCount, 0, rowCount * groupIndex);
            const allDayPanelData = this._generateAllDayPanelData(groupIndex, rowCount, cellCount);
            groupedData.push({
                dateTable: viewCellsData,
                allDayPanel: allDayPanelData,
                isGroupedAllDayPanel
            });
        }

        return {
            groupedData,
            isVirtual: false
        };
    }

    _generateViewCellsData(options, groupIndex, renderRowCount, startRowIndex = 0, rowOffset = 0) {
        const {
            cellCount,
            cellDataGetters,
            realGroupCount,
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
                    realGroupCount, this._workspace.option('groupOrientation'), this._workspace.isGroupedByDate(),
                    groupIndex, columnIndex, cellCount,
                );
                cellDataValue.index = this._calculateCellIndex(
                    realGroupCount, this._workspace.option('groupOrientation'), this._workspace.isGroupedByDate(),
                    rowIndex % rowCountInGroup, columnIndex, cellCount,
                );

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

    _calculateGroupIndex(
        realGroupCount, groupOrientation, isGroupedByDate,
        currentGroupIndex, columnIndex, columnsNumber,
    ) {
        if(realGroupCount === 0) {
            return undefined;
        }

        let groupIndex = currentGroupIndex;

        if(isGroupedByDate) {
            groupIndex = columnIndex % realGroupCount;
        }
        if(!isGroupedByDate && groupOrientation === 'horizontal') {
            const columnsInGroup = columnsNumber / realGroupCount;
            groupIndex = Math.floor(columnIndex / columnsInGroup);
        }

        return groupIndex;
    }

    _calculateCellIndex(realGroupCount, groupOrientation, isGroupedByDate, rowIndex, columnIndex, columnsNumber) {
        let index = rowIndex * columnsNumber + columnIndex;
        const columnsInGroup = columnsNumber / realGroupCount;

        if(groupOrientation === 'horizontal') {
            let columnIndexInCurrentGroup = columnIndex % columnsInGroup;
            if(isGroupedByDate) {
                columnIndexInCurrentGroup = columnIndex % realGroupCount;
            }

            index = rowIndex * columnsInGroup + columnIndexInCurrentGroup;
        }

        return index;
    }
}
