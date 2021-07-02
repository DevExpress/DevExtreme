import dateUtils from '../../../../core/utils/date';
import { getHeaderCellText, formatWeekdayAndDay } from '../utils/base';

export class DateHeaderDataGenerator {
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
            groupByDate,
            horizontalGroupCount,
            cellCountInDay,
            daysInView,
        } = options;

        const index = completeViewDataMap[0][0].allDay ? 1 : 0;
        const colSpan = groupByDate ? horizontalGroupCount * cellCountInDay : cellCountInDay;

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
            groupByDate,
            horizontalGroupCount,
            cellCountInGroupRow,
            groupOrientation,
            headerCellTextFormat,
            getDateForHeaderText,
            interval,
            startViewDate,
            startDayHour,
            cellCountInDay,
        } = options;

        const index = completeViewDataMap[0][0].allDay ? 1 : 0;
        const colSpan = groupByDate ? horizontalGroupCount : 1;
        const isVerticalGrouping = groupOrientation === 'vertical';

        const slicedByColumnsData = groupByDate
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
                isFirstGroupCell: groupByDate || (isFirstGroupCell && !isVerticalGrouping),
                isLastGroupCell: groupByDate || (isLastGroupCell && !isVerticalGrouping),
            });
        });
    }

    generateDateHeaderData(completeDateHeaderMap, options) {
        const {
            isGenerateWeekDaysHeaderData,
            cellCountInDay,
            cellWidth,
            isProvideVirtualCellsWidth,
        } = options;

        const dataMap = [];
        let weekDayRowConfig = {};
        const validCellWidth = cellWidth || 0;

        if(isGenerateWeekDaysHeaderData) {
            weekDayRowConfig = this._generateDateHeaderDataRow(
                options,
                completeDateHeaderMap,
                cellCountInDay,
                0,
                validCellWidth,
            );

            dataMap.push(weekDayRowConfig.dateRow);
        }

        const datesRowConfig = this._generateDateHeaderDataRow(
            options,
            completeDateHeaderMap,
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
        };
    }

    _generateDateHeaderDataRow(options, completeDateHeaderMap, baseColSpan, rowIndex, cellWidth) {
        const {
            groupByDate,
            horizontalGroupCount,
            startCellIndex,
            cellCount,
            totalCellCount,
            isProvideVirtualCellsWidth,
        } = options;

        const colSpan = groupByDate ? horizontalGroupCount * baseColSpan : baseColSpan;
        const leftVirtualCellCount = Math.floor(startCellIndex / colSpan);
        const actualCellCount = Math.ceil((startCellIndex + cellCount) / colSpan);

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
