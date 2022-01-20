const getCellSize = (DOMMetaData) => {
    const { dateTableCellsMeta } = DOMMetaData;
    const length = dateTableCellsMeta?.length;

    if(!length) {
        return {
            width: 0,
            height: 0
        };
    }

    const cellIndex = (length > 1) ? 1 : 0;
    const cellSize = dateTableCellsMeta[cellIndex][0];

    return {
        width: cellSize.width,
        height: cellSize.height,
    };
};

const getMaxAllowedHorizontalPosition = (groupIndex, viewDataProvider, rtlEnabled, DOMMetaData) => {
    const { dateTableCellsMeta } = DOMMetaData;
    const firstRow = dateTableCellsMeta[0];

    if(!firstRow) return 0;

    const { columnIndex } = viewDataProvider.getLastGroupCellPosition(groupIndex);
    const cellPosition = firstRow[columnIndex];

    if(!cellPosition) return 0;

    return !rtlEnabled
        ? cellPosition.left + cellPosition.width
        : cellPosition.left;
};

export const getCellHeight = (DOMMetaData) => {
    return getCellSize(DOMMetaData).height;
};

export const getCellWidth = (DOMMetaData) => {
    return getCellSize(DOMMetaData).width;
};

export const getAllDayHeight = (showAllDayPanel, isVerticalGrouping, DOMMetaData) => {
    if(!showAllDayPanel) {
        return 0;
    }

    if(isVerticalGrouping) {
        const { dateTableCellsMeta } = DOMMetaData;
        const length = dateTableCellsMeta?.length;

        return length
            ? dateTableCellsMeta[0][0].height
            : 0;
    }

    const { allDayPanelCellsMeta } = DOMMetaData;

    return allDayPanelCellsMeta?.length
        ? allDayPanelCellsMeta[0].height
        : 0;
};

export const getMaxAllowedPosition = (groupIndex, viewDataProvider, rtlEnabled, DOMMetaData) => {
    const validGroupIndex = groupIndex || 0;

    return getMaxAllowedHorizontalPosition(validGroupIndex, viewDataProvider, rtlEnabled, DOMMetaData);
};


export const getGroupWidth = (groupIndex, viewDataProvider, options) => {
    const {
        isVirtualScrolling,
        rtlEnabled,
        DOMMetaData
    } = options;

    const cellWidth = getCellWidth(DOMMetaData);
    let result = viewDataProvider.getCellCount(options) * cellWidth;
    // TODO: refactor after deleting old render
    if(isVirtualScrolling) {
        const groupedData = viewDataProvider.groupedDataMap.dateTableGroupedMap;
        const groupLength = groupedData[groupIndex][0].length;

        result = groupLength * cellWidth;
    }

    const position = getMaxAllowedPosition(
        groupIndex,
        viewDataProvider,
        rtlEnabled,
        DOMMetaData
    );

    const currentPosition = position[groupIndex];

    if(currentPosition) {
        if(rtlEnabled) {
            result = currentPosition - position[groupIndex + 1];
        } else {
            if(groupIndex === 0) {
                result = currentPosition;
            } else {
                result = currentPosition - position[groupIndex - 1];
            }
        }
    }

    return result;
};

export class PositionHelper {
    get viewDataProvider() { return this.options.viewDataProvider; }
    get rtlEnabled() { return this.options.rtlEnabled; }
    get isGroupedByDate() { return this.options.isGroupedByDate; }
    get groupCount() { return this.options.groupCount; }
    get DOMMetaData() { return this.options.getDOMMetaDataCallback(); }

    constructor(options) {
        this.options = options;
        this.groupStrategy = this.options.isVerticalGrouping
            ? new GroupStrategyBase(this.options)
            : new GroupStrategyHorizontal(this.options);
    }

    getHorizontalMax(groupIndex) {
        const getMaxPosition = (groupIndex) => {
            return getMaxAllowedPosition(
                groupIndex,
                this.viewDataProvider,
                this.rtlEnabled,
                this.DOMMetaData
            );
        };

        if(this.isGroupedByDate) {
            const viewPortGroupCount = this.viewDataProvider.getViewPortGroupCount();
            return Math.max(
                getMaxPosition(groupIndex),
                getMaxPosition(viewPortGroupCount - 1),
            );
        }

        return getMaxPosition(groupIndex);
    }

    getResizableStep() {
        const cellWidth = getCellWidth(this.DOMMetaData);

        if(this.isGroupedByDate) {
            return this.groupCount * cellWidth;
        }

        return cellWidth;
    }

    getVerticalMax(options) {
        return this.groupStrategy.getVerticalMax(options);
    }

    getOffsetByAllDayPanel(options) {
        return this.groupStrategy.getOffsetByAllDayPanel(options);
    }

    getGroupTop(options) {
        return this.groupStrategy.getGroupTop(options);
    }
}

class GroupStrategyBase {
    constructor(options) {
        this.options = options;
    }

    get viewDataProvider() { return this.options.viewDataProvider; }
    get isGroupedByDate() { return this.options.isGroupedByDate; }
    get rtlEnabled() { return this.options.rtlEnabled; }
    get groupCount() { return this.options.groupCount; }
    get DOMMetaData() { return this.options.getDOMMetaDataCallback(); }

    getOffsetByAllDayPanel({
        groupIndex,
        supportAllDayRow,
        showAllDayPanel
    }) {
        let result = 0;

        if(supportAllDayRow && showAllDayPanel) {
            const allDayPanelHeight = getAllDayHeight(
                showAllDayPanel,
                true,
                this.DOMMetaData
            );
            result = allDayPanelHeight * (groupIndex + 1);
        }

        return result;
    }

    getVerticalMax(options) {
        let maxAllowedPosition = this._getMaxAllowedVerticalPosition({
            ...options,
            viewDataProvider: this.viewDataProvider,
            rtlEnabled: this.rtlEnabled,
            DOMMetaData: this.DOMMetaData
        });

        maxAllowedPosition += this.getOffsetByAllDayPanel(options);

        return maxAllowedPosition;
    }

    getGroupTop({
        groupIndex,
        showAllDayPanel,
        isGroupedAllDayPanel,
    }) {
        const rowCount = this.viewDataProvider.getRowCountInGroup(groupIndex);
        const maxVerticalPosition = this._getMaxAllowedVerticalPosition({
            groupIndex,
            viewDataProvider: this.viewDataProvider,
            showAllDayPanel,
            isGroupedAllDayPanel,
            isVerticalGrouping: true,
            DOMMetaData: this.DOMMetaData
        });

        return maxVerticalPosition - getCellHeight(this.DOMMetaData) * rowCount;
    }

    _getAllDayHeight(showAllDayPanel) {
        return getAllDayHeight(showAllDayPanel, true, this.DOMMetaData);
    }

    _getMaxAllowedVerticalPosition({
        groupIndex,
        showAllDayPanel,
        isGroupedAllDayPanel,
    }) {
        const { rowIndex } = this.viewDataProvider.getLastGroupCellPosition(groupIndex);
        const { dateTableCellsMeta } = this.DOMMetaData;
        const lastGroupRow = dateTableCellsMeta[rowIndex];

        if(!lastGroupRow) return 0;

        let result = lastGroupRow[0].top + lastGroupRow[0].height;

        // TODO remove while refactoring dual calculcations.
        // Should decrease allDayPanel amount due to the dual calculation corrections.
        if(isGroupedAllDayPanel) {
            result -= (groupIndex + 1) * this._getAllDayHeight(showAllDayPanel);
        }

        return result;
    }
}

class GroupStrategyHorizontal extends GroupStrategyBase {
    getOffsetByAllDayPanel(options) {
        return 0;
    }

    getVerticalMax(options) {
        const {
            isVirtualScrolling,
            groupIndex
        } = options;

        const correctedGroupIndex = isVirtualScrolling
            ? groupIndex
            : 0;

        return this._getMaxAllowedVerticalPosition({
            ...options,
            groupIndex: correctedGroupIndex,
        });
    }

    getGroupTop(options) {
        return 0;
    }

    _getAllDayHeight(showAllDayPanel) {
        return getAllDayHeight(showAllDayPanel, false, this.DOMMetaData);
    }
}
