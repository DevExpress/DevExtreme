import { getTimePanelCellText } from '../utils/week';

export class TimePanelDataGenerator {
    getCompleteTimePanelMap(options, completeViewDataMap) {
        const {
            rowCountInGroup,
            startViewDate,
            cellDuration,
            startDayHour,
            isVerticalGrouping,
        } = options;

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
            };
        });
    }

    generateTimePanelData(completeTimePanelMap, options) {
        const {
            startRowIndex,
            rowCount,
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            cellCountInGroupRow,
            isGroupedAllDayPanel,
            isVerticalGrouping,
            isAllDayPanelVisible,
        } = options;

        const indexDifference = isVerticalGrouping || !isAllDayPanelVisible ? 0 : 1;
        const correctedStartRowIndex = startRowIndex + indexDifference;

        const timePanelMap = completeTimePanelMap
            .slice(correctedStartRowIndex, correctedStartRowIndex + rowCount);

        const timePanelData = {
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            isGroupedAllDayPanel,
            cellCountInGroupRow,
        };

        const {
            previousGroupedData: groupedData,
        } = this._generateTimePanelDataFromMap(timePanelMap, isGroupedAllDayPanel);

        timePanelData.groupedData = groupedData;

        return timePanelData;
    }

    _generateTimePanelDataFromMap(timePanelMap, isGroupedAllDayPanel) {
        return timePanelMap.reduce(({ previousGroupIndex, previousGroupedData }, cellData) => {
            const currentGroupIndex = cellData.groupIndex;
            if(currentGroupIndex !== previousGroupIndex) {
                previousGroupedData.push({
                    dateTable: [],
                    isGroupedAllDayPanel,
                    groupIndex: currentGroupIndex,
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
