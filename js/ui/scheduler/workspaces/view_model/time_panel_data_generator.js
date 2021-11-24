import { getIsGroupedAllDayPanel, getKeyByGroup } from '../../../../renovation/ui/scheduler/workspaces/utils';
import { getDisplayedRowCount } from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { getTimePanelCellText } from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/week';

export class TimePanelDataGenerator {
    constructor(viewDataGenerator) {
        this._viewDataGenerator = viewDataGenerator;
    }

    getCompleteTimePanelMap(options, completeViewDataMap) {
        const {
            startViewDate,
            cellDuration,
            startDayHour,
            isVerticalGrouping,
            intervalCount,
            currentDate,
            viewType,
            hoursInterval,
            endDayHour,
        } = options;

        const rowCountInGroup = this._viewDataGenerator.getRowCount({
            intervalCount, currentDate, viewType,
            hoursInterval, startDayHour, endDayHour,
        });
        const cellCountInGroupRow = this._viewDataGenerator.getCellCount({
            intervalCount, currentDate, viewType,
            hoursInterval, startDayHour, endDayHour,
        });
        let allDayRowsCount = 0;

        return completeViewDataMap.map((row, index) => {
            const {
                allDay,
                startDate,
                endDate,
                groups,
                groupIndex,
                isFirstGroupCell,
                isLastGroupCell,
                index: cellIndex,
                ...restCellProps
            } = row[0];

            if(allDay) {
                allDayRowsCount += 1;
            }

            const timeIndex = (index - allDayRowsCount) % rowCountInGroup;

            return {
                ...restCellProps,
                startDate,
                allDay,
                text: getTimePanelCellText(timeIndex, startDate, startViewDate, cellDuration, startDayHour),
                groups: isVerticalGrouping ? groups : undefined,
                groupIndex: isVerticalGrouping ? groupIndex : undefined,
                isFirstGroupCell: isVerticalGrouping && isFirstGroupCell,
                isLastGroupCell: isVerticalGrouping && isLastGroupCell,
                index: Math.floor(cellIndex / cellCountInGroupRow),
            };
        });
    }

    generateTimePanelData(completeTimePanelMap, options) {
        const {
            startRowIndex,
            rowCount,
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            isGroupedAllDayPanel,
            isVerticalGrouping,
            isAllDayPanelVisible,
        } = options;

        const indexDifference = isVerticalGrouping || !isAllDayPanelVisible ? 0 : 1;
        const correctedStartRowIndex = startRowIndex + indexDifference;

        const displayedRowCount = getDisplayedRowCount(rowCount, completeTimePanelMap);
        const timePanelMap = completeTimePanelMap
            .slice(correctedStartRowIndex, correctedStartRowIndex + displayedRowCount);

        const timePanelData = {
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            isGroupedAllDayPanel,
        };

        const {
            previousGroupedData: groupedData,
        } = this._generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping);

        timePanelData.groupedData = groupedData;

        return timePanelData;
    }

    _generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping) {
        return timePanelMap.reduce(({ previousGroupIndex, previousGroupedData }, cellData) => {
            const currentGroupIndex = cellData.groupIndex;
            if(currentGroupIndex !== previousGroupIndex) {
                previousGroupedData.push({
                    dateTable: [],
                    isGroupedAllDayPanel: getIsGroupedAllDayPanel(!!cellData.allDay, isVerticalGrouping),
                    groupIndex: currentGroupIndex,
                    key: getKeyByGroup(currentGroupIndex, isVerticalGrouping),
                });
            }
            if(cellData.allDay) {
                previousGroupedData[previousGroupedData.length - 1].allDayPanel = cellData;
            } else {
                previousGroupedData[previousGroupedData.length - 1].dateTable.push(cellData);
            }

            return {
                previousGroupIndex: currentGroupIndex,
                previousGroupedData,
            };
        }, { previousGroupIndex: -1, previousGroupedData: [] });
    }
}
