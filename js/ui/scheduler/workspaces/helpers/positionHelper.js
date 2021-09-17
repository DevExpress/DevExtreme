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

export const getMaxAllowedVerticalPosition = ({
    groupIndex,
    viewDataProvider,
    showAllDayPanel,
    isGroupedAllDayPanel,
    isVerticalGrouping,
    DOMMetaData
}) => {
    const { rowIndex } = viewDataProvider.getLastGroupCellPosition(groupIndex);
    const { dateTableCellsMeta } = DOMMetaData;
    const lastGroupRow = dateTableCellsMeta[rowIndex];

    if(!lastGroupRow) return 0;

    let result = lastGroupRow[0].top + lastGroupRow[0].height;

    // TODO remove while refactoring dual calculcations.
    // Should decrease allDayPanel amount due to the dual calculation corrections.
    if(isGroupedAllDayPanel) {
        result -= (groupIndex + 1) * getAllDayHeight(showAllDayPanel, isVerticalGrouping, DOMMetaData);
    }

    return result;
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
    constructor(options) {
        this.strategy = options.isVerticalGroupedWorkSpace
            ? new PositionHelperVertical(options)
            : new PositionHelperHorizontal(options);
    }

    getHorizontalMax(groupIndex) {
        return this.strategy.getHorizontalMax(groupIndex);
    }

    getVerticalMax(options) {
        return this.strategy.getVerticalMax(options);
    }

    getResizableStep() {
        return this.strategy.getResizableStep();
    }

    getOffsetByAllDayPanel(options) {
        return this.strategy.getOffsetByAllDayPanel(options);
    }
}

class PositionHelperBase {
    constructor(options) {
        this.options = options;
    }

    get viewDataProvider() { return this.options.viewDataProvider; }
    get groupedStrategy() { return this.options.groupedStrategy; }
    get isGroupedByDate() { return this.options.isGroupedByDate; }
    get rtlEnabled() { return this.options.rtlEnabled; }
    get groupCount() { return this.options.groupCount; }
    get getDOMMetaData() { return this.options.getDOMMetaDataCallback; }

    getHorizontalMax(groupIndex) {
        const getMaxPosition = (groupIndex) => {
            return getMaxAllowedPosition(
                groupIndex,
                this.viewDataProvider,
                this.rtlEnabled,
                this.getDOMMetaData()
            );
        };

        if(this.isGroupedByDate) {
            return Math.max(
                getMaxPosition(groupIndex),
                getMaxPosition(this.groupCount - 1),
            );
        }

        return getMaxPosition(groupIndex);
    }

    getResizableStep() {
        const cellWidth = getCellWidth(this.getDOMMetaData());

        if(this.isGroupedByDate) {
            return this.groupCount * cellWidth;
        }

        return cellWidth;
    }
}

class PositionHelperVertical extends PositionHelperBase {
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
                this.getDOMMetaData()
            );
            result = allDayPanelHeight * (groupIndex + 1);
        }

        return result;
    }

    getVerticalMax(options) {
        let maxAllowedPosition = getMaxAllowedVerticalPosition({
            ...options,
            viewDataProvider: this.viewDataProvider,
            rtlEnabled: this.rtlEnabled,
            DOMMetaData: this.getDOMMetaData()
        });

        maxAllowedPosition += this.getOffsetByAllDayPanel(options);

        return maxAllowedPosition;
    }
}

class PositionHelperHorizontal extends PositionHelperBase {
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

        return getMaxAllowedVerticalPosition({
            ...options,
            groupIndex: correctedGroupIndex,
            viewDataProvider: this.viewDataProvider,
            rtlEnabled: this.rtlEnabled,
            DOMMetaData: this.getDOMMetaData()
        });
    }
}
