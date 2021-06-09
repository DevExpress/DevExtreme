import dateUtils from '../../../../core/utils/date';
import { HORIZONTAL_GROUP_ORIENTATION } from '../../constants';

export class ViewDataGenerator {
    _getCompleteViewDataMap(options) {
        const {
            rowCountInGroup,
            cellCountInGroupRow,
            groupsList,
            groupByDate,
            isHorizontalGrouping,
            isVerticalGrouping,
            totalCellCount,
            groupCount,
        } = options;

        let viewDataMap = [];
        const step = groupByDate ? groupCount : 1;
        const allDayPanelData = this._generateAllDayPanelData(options, cellCountInGroupRow, step);
        const viewCellsData = this._generateViewCellsData(options, rowCountInGroup, step);

        allDayPanelData && viewDataMap.push(allDayPanelData);
        viewDataMap.push(...viewCellsData);

        if(isHorizontalGrouping && !groupByDate) {
            viewDataMap = this._transformViewDataMapForHorizontalGrouping(viewDataMap, groupsList);
        }

        if(isVerticalGrouping) {
            viewDataMap = this._transformViewDataMapForVerticalGrouping(viewDataMap, groupsList);
        }

        if(groupByDate) {
            viewDataMap = this._transformViewDataMapForGroupingByDate(viewDataMap, groupsList);
        }

        const completeViewDataMap = this._addKeysToCells(viewDataMap, totalCellCount);

        return completeViewDataMap;
    }

    _transformViewDataMapForHorizontalGrouping(viewDataMap, groupsList) {
        const result = viewDataMap.map(row => row.slice());

        groupsList.slice(1).forEach((groups, index) => {
            const groupIndex = index + 1;

            viewDataMap.forEach((row, rowIndex) => {
                const nextGroupRow = row.map((cellData) => {
                    return ({
                        ...cellData,
                        groups,
                        groupIndex,
                    });
                });

                result[rowIndex].push(...nextGroupRow);
            });
        });

        return result;
    }

    _transformViewDataMapForVerticalGrouping(viewDataMap, groupsList) {
        const result = viewDataMap.map(row => row.slice());

        groupsList.slice(1).forEach((groups, index) => {
            const groupIndex = index + 1;

            const nextGroupMap = viewDataMap.map((cellsRow) => {
                const nextRow = cellsRow.map((cellData) => {
                    return ({
                        ...cellData,
                        groupIndex,
                        groups,
                    });
                });

                return nextRow;
            });

            result.push(...nextGroupMap);
        });

        return result;
    }

    _transformViewDataMapForGroupingByDate(viewDataMap, groupsList) {
        const correctedGroupList = groupsList.slice(1);
        const correctedGroupCount = correctedGroupList.length;

        const result = viewDataMap.map((cellsRow) => {
            const groupedByDateCellsRow = cellsRow.reduce((currentRow, cell) => {
                const rowWithCurrentCell = [
                    ...currentRow,
                    {
                        ...cell,
                        isFirstGroupCell: true,
                        isLastGroupCell: correctedGroupCount === 0,
                    },
                    ...correctedGroupList.map((groups, index) => ({
                        ...cell,
                        groups,
                        groupIndex: index + 1,
                        isFirstGroupCell: false,
                        isLastGroupCell: index === correctedGroupCount - 1,
                    })),
                ];

                return rowWithCurrentCell;
            }, []);

            return groupedByDateCellsRow;
        });

        return result;
    }

    _addKeysToCells(viewDataMap, totalColumnCount) {
        const {
            currentViewDataMap: result,
        } = viewDataMap.reduce(({ allDayPanelsCount, currentViewDataMap }, row, rowIndex) => {
            const isAllDay = row[0].allDay;

            const keyBase = (rowIndex - allDayPanelsCount) * totalColumnCount;

            const currentAllDayPanelsCount = isAllDay
                ? allDayPanelsCount + 1
                : allDayPanelsCount;

            currentViewDataMap[rowIndex].forEach((cell, cellIndex) => {
                cell.key = keyBase + cellIndex;
            });

            return { allDayPanelsCount: currentAllDayPanelsCount, currentViewDataMap };
        }, {
            allDayPanelsCount: 0,
            currentViewDataMap: viewDataMap,
        });

        return result;
    }

    _getCompleteDateHeaderMap(options, completeViewDataMap) {
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
            getWeekDaysHeaderText,
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
                text: getWeekDaysHeaderText(cell.startDate),
                isFirstGroupCell: false,
                isLastGroupCell: false,
            });
        }

        return weekDaysRow;
    }

    _generateHeaderDateRow(options, completeViewDataMap) {
        const {
            getDateHeaderText,
            today,
            groupByDate,
            horizontalGroupCount,
            cellCountInGroupRow,
            groupOrientation,
            getDateHeaderDate,
        } = options;

        const dates = [];

        for(let dateIndex = 0; dateIndex < cellCountInGroupRow; dateIndex += 1) {
            dates.push(getDateHeaderDate(dateIndex));
        }

        const index = completeViewDataMap[0][0].allDay ? 1 : 0;
        const columnCount = completeViewDataMap[index].length;
        const dateHeaderColumnCount = groupByDate
            ? columnCount / horizontalGroupCount
            : columnCount;
        const colSpan = groupByDate ? horizontalGroupCount : 1;
        const isVerticalGrouping = groupOrientation === 'vertical';

        const slicedByColumnsData = completeViewDataMap[index].slice(0, dateHeaderColumnCount);

        return slicedByColumnsData.map(({
            startDate,
            endDate,
            isFirstGroupCell,
            isLastGroupCell,
            ...restProps
        }, index) => ({
            ...restProps,
            startDate: dates[index % cellCountInGroupRow],
            text: getDateHeaderText(index % cellCountInGroupRow),
            today: dateUtils.sameDate(startDate, today),
            colSpan,
            isFirstGroupCell: groupByDate || (isFirstGroupCell && !isVerticalGrouping),
            isLastGroupCell: groupByDate || (isLastGroupCell && !isVerticalGrouping),
        }));
    }

    _getCompleteTimePanelMap(options, completeViewDataMap) {
        const {
            rowCountInGroup,
            getTimeCellDate,
        } = options;

        const times = [];

        for(let rowIndex = 0; rowIndex < rowCountInGroup; rowIndex += 1) {
            times.push(getTimeCellDate(rowIndex));
        }

        let allDayRowsCount = 0;

        return completeViewDataMap.map((row, index) => {
            const {
                allDay, startDate, endDate, ...restCellProps
            } = row[0];

            if(allDay) {
                allDayRowsCount += 1;
            }

            const timeIndex = (index - allDayRowsCount) % rowCountInGroup;

            return {
                ...restCellProps,
                allDay,
                startDate: allDay ? startDate : times[timeIndex],
            };
        });
    }

    _generateViewDataMap(completeViewDataMap, options) {
        const {
            rowCount,
            startCellIndex,
            cellCount,
            isStandaloneAllDayPanel,
        } = options;
        const { startRowIndex } = options;

        const sliceCells = (row, rowIndex, startIndex, count) => {
            return row
                .slice(startIndex, startIndex + count)
                .map((cellData, columnIndex) => (
                    {
                        cellData,
                        position: {
                            rowIndex,
                            columnIndex
                        }
                    })
                );

        };

        let correctedStartRowIndex = startRowIndex;
        let allDayPanelMap = [];
        if(isStandaloneAllDayPanel) {
            correctedStartRowIndex++;
            allDayPanelMap = sliceCells(completeViewDataMap[0], 0, startCellIndex, cellCount);
        }

        const dateTableMap = completeViewDataMap
            .slice(correctedStartRowIndex, correctedStartRowIndex + rowCount)
            .map((row, rowIndex) => sliceCells(row, rowIndex, startCellIndex, cellCount));

        return {
            allDayPanelMap,
            dateTableMap
        };
    }

    _generateDateHeaderData(completeDateHeaderMap, options) {
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

    _generateTimePanelData(completeTimePanelMap, options) {
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

    _getViewDataFromMap(viewDataMap, options) {
        const {
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            leftVirtualCellWidth,
            rightVirtualCellWidth,
            cellCountInGroupRow,
            totalCellCount,
            totalRowCount,
            cellCount,
            rowCount,
            startRowIndex,
            startCellIndex,
            isProvideVirtualCellsWidth,
            isGroupedAllDayPanel,
            isStandaloneAllDayPanel,
        } = options;
        const {
            allDayPanelMap,
            dateTableMap
        } = viewDataMap;

        const {
            previousGroupedData: groupedData,
        } = dateTableMap.reduce(({ previousGroupIndex, previousGroupedData }, cellsRow) => {
            const cellDataRow = cellsRow.map(({ cellData }) => cellData);

            const firstCell = cellDataRow[0];
            const isAllDayRow = firstCell.allDay;
            const currentGroupIndex = firstCell.groupIndex;

            if(currentGroupIndex !== previousGroupIndex) {
                previousGroupedData.push({
                    dateTable: [],
                    isGroupedAllDayPanel,
                    groupIndex: currentGroupIndex,
                });
            }

            if(isAllDayRow) {
                previousGroupedData[previousGroupedData.length - 1].allDayPanel = cellDataRow;
            } else {
                previousGroupedData[previousGroupedData.length - 1].dateTable.push(cellDataRow);
            }

            return {
                previousGroupedData,
                previousGroupIndex: currentGroupIndex,
            };
        }, { previousGroupIndex: -1, previousGroupedData: [] });

        if(isStandaloneAllDayPanel) {
            groupedData[0].allDayPanel = allDayPanelMap.map(({ cellData }) => cellData);
        }

        return {
            groupedData,
            topVirtualRowHeight,
            bottomVirtualRowHeight,
            leftVirtualCellWidth: isProvideVirtualCellsWidth ? leftVirtualCellWidth : undefined,
            rightVirtualCellWidth: isProvideVirtualCellsWidth ? rightVirtualCellWidth : undefined,
            cellCountInGroupRow,
            isGroupedAllDayPanel,
            leftVirtualCellCount: startCellIndex,
            rightVirtualCellCount: totalCellCount - startCellIndex - cellCount,
            topVirtualRowCount: startRowIndex,
            bottomVirtualRowCount: totalRowCount - startRowIndex - rowCount,
        };
    }

    _generateViewCellsData(options, rowsCount, step = 1) {
        const {
            cellCountInGroupRow,
            cellDataGetters,
        } = options;
        const viewCellsData = [];

        for(let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
            viewCellsData.push(this._generateCellsRow(
                options, cellDataGetters, rowIndex, cellCountInGroupRow, step,
            ));
        }

        return viewCellsData;
    }

    _generateAllDayPanelData(options, cellCount, step = 1) {
        if(!options.isAllDayPanelVisible) {
            return null;
        }

        return this._generateCellsRow(
            options, [options.getAllDayCellData], 0, cellCount, step,
        );
    }

    _generateCellsRow(options, cellDataGetters, rowIndex, columnCount, step) {
        const cellsRow = [];

        for(let columnIndex = 0; columnIndex < columnCount; ++columnIndex) {
            const correctedColumnIndex = step * columnIndex;
            const cellDataValue = cellDataGetters.reduce((data, getter) => ({
                ...data,
                ...getter(undefined, rowIndex, correctedColumnIndex, 0, data.startDate).value
            }), {});

            cellDataValue.index = rowIndex * columnCount + columnIndex;

            cellDataValue.isFirstGroupCell = this._isFirstGroupCell(
                rowIndex, columnIndex, options,
            );
            cellDataValue.isLastGroupCell = this._isLastGroupCell(
                rowIndex, columnIndex, options,
            );

            cellsRow.push(cellDataValue);
        }

        return cellsRow;
    }

    _calculateCellIndex(horizontalGroupCount, groupOrientation, isGroupedByDate, rowIndex, columnIndex, columnsNumber) {
        const groupCount = horizontalGroupCount || 1;
        let index = rowIndex * columnsNumber + columnIndex;
        const columnsInGroup = columnsNumber / groupCount;

        if(groupOrientation === 'horizontal') {
            let columnIndexInCurrentGroup = columnIndex % columnsInGroup;
            if(isGroupedByDate) {
                columnIndexInCurrentGroup = Math.floor(columnIndex / groupCount);
            }

            index = rowIndex * columnsInGroup + columnIndexInCurrentGroup;
        }

        return index;
    }

    generateGroupedDataMap(viewDataMap) {
        const {
            allDayPanelMap,
            dateTableMap
        } = viewDataMap;

        const { previousGroupedDataMap: dateTableGroupedMap } = dateTableMap.reduce((previousOptions, cellsRow) => {
            const {
                previousGroupedDataMap, previousRowIndex, previousGroupIndex,
            } = previousOptions;
            const { groupIndex: currentGroupIndex } = cellsRow[0].cellData;
            const currentRowIndex = currentGroupIndex === previousGroupIndex
                ? previousRowIndex + 1
                : 0;

            cellsRow.forEach((cell) => {
                const { groupIndex } = cell.cellData;

                if(!previousGroupedDataMap[groupIndex]) {
                    previousGroupedDataMap[groupIndex] = [];
                }
                if(!previousGroupedDataMap[groupIndex][currentRowIndex]) {
                    previousGroupedDataMap[groupIndex][currentRowIndex] = [];
                }

                previousGroupedDataMap[groupIndex][currentRowIndex].push(cell);
            });

            return {
                previousGroupedDataMap,
                previousRowIndex: currentRowIndex,
                previousGroupIndex: currentGroupIndex,
            };
        }, {
            previousGroupedDataMap: [],
            previousRowIndex: -1,
            previousGroupIndex: -1,
        });

        const allDayPanelGroupedMap = [];
        allDayPanelMap?.forEach((cell) => {

            const { groupIndex } = cell.cellData;

            if(!allDayPanelGroupedMap[groupIndex]) {
                allDayPanelGroupedMap[groupIndex] = [];
            }

            allDayPanelGroupedMap[groupIndex].push(cell);
        });

        return {
            allDayPanelGroupedMap,
            dateTableGroupedMap
        };
    }

    _isFirstGroupCell(rowIndex, columnIndex, options) {
        const {
            groupOrientation,
            rowCountInGroup,
            cellCountInGroupRow,
            groupCount,
            groupByDate,
        } = options;

        if(groupByDate) {
            return columnIndex % groupCount === 0;
        }

        if(groupOrientation === HORIZONTAL_GROUP_ORIENTATION) {
            return columnIndex % cellCountInGroupRow === 0;
        }

        return rowIndex % rowCountInGroup === 0;
    }

    _isLastGroupCell(rowIndex, columnIndex, options) {
        const {
            groupOrientation,
            rowCountInGroup,
            cellCountInGroupRow,
            groupCount,
            groupByDate
        } = options;

        if(groupByDate) {
            return (columnIndex + 1) % groupCount === 0;
        }

        if(groupOrientation === HORIZONTAL_GROUP_ORIENTATION) {
            return (columnIndex + 1) % cellCountInGroupRow === 0;
        }

        return (rowIndex + 1) % rowCountInGroup === 0;
    }
}
