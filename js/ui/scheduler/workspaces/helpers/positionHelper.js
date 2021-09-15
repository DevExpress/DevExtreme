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

const getMaxAllowedHorizontalPosition = (groupIndex, viewDataProvider, isRtlEnabled, DOMMetaData) => {
    const { dateTableCellsMeta } = DOMMetaData;
    const firstRow = dateTableCellsMeta[0];

    if(!firstRow) return 0;

    const { columnIndex } = viewDataProvider.getLastGroupCellPosition(groupIndex);
    const cellPosition = firstRow[columnIndex];

    if(!cellPosition) return 0;

    return !isRtlEnabled
        ? cellPosition.left + cellPosition.width
        : cellPosition.left;
};

export const getCellHeight = (DOMMetaData) => {
    return getCellSize(DOMMetaData).height;
};

export const getCellWidth = (DOMMetaData) => {
    return getCellSize(DOMMetaData).width;
};

export const getAllDayHeight = (isShowAllDayPanel, isVerticalGrouped, DOMMetaData) => {
    if(!isShowAllDayPanel) {
        return 0;
    }

    if(isVerticalGrouped) {
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

export const getMaxAllowedPosition = (groupIndex, viewDataProvider, isRtlEnabled, DOMMetaData) => {
    const validGroupIndex = groupIndex || 0;

    return getMaxAllowedHorizontalPosition(validGroupIndex, viewDataProvider, isRtlEnabled, DOMMetaData);
};

export const getMaxAllowedVerticalPosition = ({ groupIndex, viewDataProvider, isShowAllDayPanel, isGroupedAllDayPanel, isVerticalGrouped, DOMMetaData }) => {
    const { rowIndex } = viewDataProvider.getLastGroupCellPosition(groupIndex);
    const { dateTableCellsMeta } = DOMMetaData;
    const lastGroupRow = dateTableCellsMeta[rowIndex];

    if(!lastGroupRow) return 0;

    let result = lastGroupRow[0].top + lastGroupRow[0].height;

    // TODO remove while refactoring dual calculcations.
    // Should decrease allDayPanel amount due to the dual calculation corrections.
    if(isGroupedAllDayPanel) {
        result -= (groupIndex + 1) * getAllDayHeight(isShowAllDayPanel, isVerticalGrouped, DOMMetaData);
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
        this.options = options;
    }

    get key() { return this.options.key; }
    get viewDataProvider() { return this.options.viewDataProvider; }
    get viewStartDayHour() { return this.options.viewStartDayHour; }
    get viewEndDayHour() { return this.options.viewEndDayHour; }
    get cellDuration() { return this.options.cellDuration; }
    get groupedStrategy() { return this.options.groupedStrategy; }
    get isGroupedByDate() { return this.options.isGroupedByDate; }
    get isRtlEnabled() { return this.options.isRtlEnabled; }
    get startViewDate() { return this.options.startViewDate; }
    get isVerticalGroupedWorkSpace() { return this.options.isVerticalGroupedWorkSpace; }
    get groupCount() { return this.options.groupCount; }
    get isVirtualScrolling() { return this.options.isVirtualScrolling; }
    get getDOMMetaData() { return this.options.getDOMMetaDataCallback; }

    getVerticalMax(groupIndex) {
        return this.groupedStrategy.getVerticalMax(groupIndex);
    }

    getHorizontalMax(groupIndex) {
        const getMaxPosition = (groupIndex) => {
            return getMaxAllowedPosition(
                groupIndex,
                this.viewDataProvider,
                this.isRtlEnabled,
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
