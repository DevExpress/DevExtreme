import dateUtils from '../../../../core/utils/date';
import { getGroupCount } from '../../resources/utils';
import {
    getHeaderCellText,
    formatWeekdayAndDay,
    getHorizontalGroupCount,
    getTotalCellCountByCompleteData,
    getDisplayedCellCount,
} from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';

export class DateHeaderDataGenerator {
    constructor(viewDataGenerator) {
        this._viewDataGenerator = viewDataGenerator;
    }

    getCompleteDateHeaderMap(options, completeViewDataMap) {
        const {
            isGenerateWeekDaysHeaderData,
        } = options;

        const result = [];

        if(isGenerateWeekDaysHeaderData) {
            const weekDaysRow = this._generateWeekDaysHeaderRowMap(options, completeViewDataMap);
            result.push(weekDaysRow);
        }

        const dateRow = this._generateHeaderDateRow(options, completeViewDataMap);

        result.push(dateRow);

        return result;
    }

    _generateWeekDaysHeaderRowMap(options, completeViewDataMap) {
        const {
            isGroupedByDate,
            groups,
            groupOrientation,
            startDayHour,
            endDayHour,
            hoursInterval,
            isHorizontalGrouping,
            intervalCount,
        } = options;

        const cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
        const horizontalGroupCount = getHorizontalGroupCount(groups, groupOrientation);
        const index = completeViewDataMap[0][0].allDay ? 1 : 0;
        const colSpan = isGroupedByDate ? horizontalGroupCount * cellCountInDay : cellCountInDay;

        const groupCount = getGroupCount(groups);
        const datesRepeatCount = isHorizontalGrouping && !isGroupedByDate
            ? groupCount
            : 1;

        const daysInGroup = this._viewDataGenerator.daysInInterval * intervalCount;
        const daysInView = daysInGroup * datesRepeatCount;

        const weekDaysRow = [];

        for(let dayIndex = 0; dayIndex < daysInView; dayIndex += 1) {
            const cell = completeViewDataMap[index][dayIndex * colSpan];

            weekDaysRow.push({
                ...cell,
                colSpan,
                text: formatWeekdayAndDay(cell.startDate),
                isFirstGroupCell: false,
                isLastGroupCell: false,
            });
        }

        return weekDaysRow;
    }

    _generateHeaderDateRow(options, completeViewDataMap) {
        const {
            today,
            isGroupedByDate,
            groupOrientation,
            groups,
            headerCellTextFormat,
            getDateForHeaderText,
            interval,
            startViewDate,
            startDayHour,
            endDayHour,
            hoursInterval,
            intervalCount,
            currentDate,
            viewType,
        } = options;

        const horizontalGroupCount = getHorizontalGroupCount(groups, groupOrientation);
        const index = completeViewDataMap[0][0].allDay ? 1 : 0;
        const colSpan = isGroupedByDate ? horizontalGroupCount : 1;
        const isVerticalGrouping = groupOrientation === 'vertical';
        const cellCountInGroupRow = this._viewDataGenerator.getCellCount({
            intervalCount, currentDate, viewType,
            hoursInterval, startDayHour, endDayHour,
        });
        const cellCountInDay = this._viewDataGenerator.getCellCountInDay(
            startDayHour, endDayHour, hoursInterval,
        );

        const slicedByColumnsData = isGroupedByDate
            ? completeViewDataMap[index].filter((_, columnIndex) => columnIndex % horizontalGroupCount === 0)
            : completeViewDataMap[index];

        return slicedByColumnsData.map(({
            startDate,
            endDate,
            isFirstGroupCell,
            isLastGroupCell,
            ...restProps
        }, index) => {
            const text = getHeaderCellText(
                index % cellCountInGroupRow,
                startDate,
                headerCellTextFormat,
                getDateForHeaderText,
                {
                    interval,
                    startViewDate,
                    startDayHour,
                    cellCountInDay,
                },
            );

            return ({
                ...restProps,
                startDate,
                text,
                today: dateUtils.sameDate(startDate, today),
                colSpan,
                isFirstGroupCell: isGroupedByDate || (isFirstGroupCell && !isVerticalGrouping),
                isLastGroupCell: isGroupedByDate || (isLastGroupCell && !isVerticalGrouping),
            });
        });
    }

    generateDateHeaderData(completeDateHeaderMap, completeViewDataMap, options) {
        const {
            isGenerateWeekDaysHeaderData,
            cellWidth,
            isProvideVirtualCellsWidth,
            startDayHour,
            endDayHour,
            hoursInterval,
            isMonthDateHeader,
        } = options;

        const dataMap = [];
        let weekDayRowConfig = {};
        const validCellWidth = cellWidth || 0;

        if(isGenerateWeekDaysHeaderData) {
            weekDayRowConfig = this._generateDateHeaderDataRow(
                options,
                completeDateHeaderMap,
                completeViewDataMap,
                this._viewDataGenerator.getCellCountInDay(
                    startDayHour, endDayHour, hoursInterval,
                ),
                0,
                validCellWidth,
            );

            dataMap.push(weekDayRowConfig.dateRow);
        }

        const datesRowConfig = this._generateDateHeaderDataRow(
            options,
            completeDateHeaderMap,
            completeViewDataMap,
            1,
            isGenerateWeekDaysHeaderData ? 1 : 0,
            validCellWidth,
        );

        dataMap.push(datesRowConfig.dateRow);

        return {
            dataMap,
            leftVirtualCellWidth: isProvideVirtualCellsWidth ? datesRowConfig.leftVirtualCellWidth : undefined,
            rightVirtualCellWidth: isProvideVirtualCellsWidth ? datesRowConfig.rightVirtualCellWidth : undefined,
            leftVirtualCellCount: datesRowConfig.leftVirtualCellCount,
            rightVirtualCellCount: datesRowConfig.rightVirtualCellCount,
            weekDayLeftVirtualCellWidth: weekDayRowConfig.leftVirtualCellWidth,
            weekDayRightVirtualCellWidth: weekDayRowConfig.rightVirtualCellWidth,
            weekDayLeftVirtualCellCount: weekDayRowConfig.leftVirtualCellCount,
            weekDayRightVirtualCellCount: weekDayRowConfig.rightVirtualCellCount,
            isMonthDateHeader,
        };
    }

    _generateDateHeaderDataRow(
        options,
        completeDateHeaderMap,
        completeViewDataMap,
        baseColSpan,
        rowIndex,
        cellWidth,
    ) {
        const {
            startCellIndex,
            cellCount,
            isProvideVirtualCellsWidth,
            groups,
            groupOrientation,
            isGroupedByDate,
        } = options;

        const horizontalGroupCount = getHorizontalGroupCount(groups, groupOrientation);
        const colSpan = isGroupedByDate ? horizontalGroupCount * baseColSpan : baseColSpan;
        const leftVirtualCellCount = Math.floor(startCellIndex / colSpan);
        const displayedCellCount = getDisplayedCellCount(cellCount, completeViewDataMap);
        const actualCellCount = Math.ceil((startCellIndex + displayedCellCount) / colSpan);
        const totalCellCount = getTotalCellCountByCompleteData(completeViewDataMap);

        const dateRow = completeDateHeaderMap[rowIndex].slice(leftVirtualCellCount, actualCellCount);

        const finalLeftVirtualCellCount = leftVirtualCellCount * colSpan;
        const finalLeftVirtualCellWidth = finalLeftVirtualCellCount * cellWidth;
        const finalRightVirtualCellCount = totalCellCount - actualCellCount * colSpan;
        const finalRightVirtualCellWidth = finalRightVirtualCellCount * cellWidth;

        return {
            dateRow,
            leftVirtualCellCount: finalLeftVirtualCellCount,
            leftVirtualCellWidth: isProvideVirtualCellsWidth ? finalLeftVirtualCellWidth : undefined,
            rightVirtualCellCount: finalRightVirtualCellCount,
            rightVirtualCellWidth: isProvideVirtualCellsWidth ? finalRightVirtualCellWidth : undefined,
        };
    }
}
