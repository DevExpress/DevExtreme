import dateUtils from '../../../core/utils/date';
import { HORIZONTAL_GROUP_ORIENTATION } from '../constants';

class ViewDataGenerator {
    constructor(workspace) {
        this.workspace = workspace;
    }

    get workspace() { return this._workspace; }
    set workspace(value) { this._workspace = value; }
    get isVerticalGroupedWorkspace() { return this.workspace._isVerticalGroupedWorkSpace(); }
    get isStandaloneAllDayPanel() { return !this.isVerticalGroupedWorkspace && this.workspace.isAllDayPanelVisible; }

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
            cellCount
        } = options;
        const { startRowIndex } = options;

        const sliceCells = (row, rowIndex, startIndex, count) => {
            return row
                .slice(startIndex, startIndex + count)
                .map((cellData, cellIndex) => (
                    {
                        cellData,
                        position: {
                            rowIndex,
                            cellIndex
                        }
                    })
                );

        };

        let correctedStartRowIndex = startRowIndex;
        let allDayPanelMap = [];
        if(this.isStandaloneAllDayPanel) {
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
        } = options;

        const isGroupedAllDayPanel = this.workspace.isGroupedAllDayPanel();
        const showAllDayPanel = this.workspace.isAllDayPanelVisible;

        const indexDifference = this.isVerticalGroupedWorkspace || !showAllDayPanel ? 0 : 1;
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
        } = options;
        const isGroupedAllDayPanel = this.workspace.isGroupedAllDayPanel();

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

        if(this.isStandaloneAllDayPanel) {
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
        const workSpace = this.workspace;
        if(!workSpace.isAllDayPanelVisible) {
            return null;
        }

        return this._generateCellsRow(
            options, [workSpace._getAllDayCellData.bind(workSpace)],
            0, cellCount, step,
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
        } = options;

        if(this.workspace.isGroupedByDate()) {
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
        } = options;

        if(this.workspace.isGroupedByDate()) {
            return (columnIndex + 1) % groupCount === 0;
        }

        if(groupOrientation === HORIZONTAL_GROUP_ORIENTATION) {
            return (columnIndex + 1) % cellCountInGroupRow === 0;
        }

        return (rowIndex + 1) % rowCountInGroup === 0;
    }
}

class GroupedDataMapProvider {
    constructor(viewDataGenerator, viewDataMap, completeViewDataMap, workspace) {
        this.groupedDataMap = viewDataGenerator.generateGroupedDataMap(viewDataMap);
        this.completeViewDataMap = completeViewDataMap;
        this._workspace = workspace;
    }

    get isVerticalGroupedWorkspace() { return this._workspace._isVerticalGroupedWorkSpace(); }

    getGroupStartDate(groupIndex) {
        const firstRow = this.getFirstGroupRow(groupIndex);

        if(firstRow) {
            const { startDate } = firstRow[0].cellData;

            return startDate;
        }
    }

    getGroupEndDate(groupIndex) {
        const lastRow = this.getLastGroupRow(groupIndex);

        if(lastRow) {
            const lastCellIndex = lastRow.length - 1;
            const { cellData } = lastRow[lastCellIndex];
            const { endDate } = cellData;

            return endDate;
        }
    }

    findGroupCellStartDate(groupIndex, startDate, endDate, isAllDay) {
        if(isAllDay) {
            return this.findAllDayGroupCellStartDate(groupIndex, startDate);
        }

        const groupData = this.getGroupFromDateTableGroupMap(groupIndex);

        const checkCellStartDate = (rowIndex, cellIndex) => {
            const { cellData } = groupData[rowIndex][cellIndex];
            const {
                startDate: secondMin,
                endDate: secondMax
            } = cellData;

            if(dateUtils.intervalsOverlap({
                firstMin: startDate,
                firstMax: endDate,
                secondMin,
                secondMax
            })) {
                return secondMin;
            }
        };
        const searchVertical = () => {
            const cellCount = groupData[0].length;
            for(let cellIndex = 0; cellIndex < cellCount; ++cellIndex) {
                for(let rowIndex = 0; rowIndex < groupData.length; ++rowIndex) {
                    const result = checkCellStartDate(rowIndex, cellIndex);
                    if(result) return result;
                }
            }
        };
        const searchHorizontal = () => {
            for(let rowIndex = 0; rowIndex < groupData.length; ++rowIndex) {
                const row = groupData[rowIndex];
                for(let cellIndex = 0; cellIndex < row.length; ++cellIndex) {
                    const result = checkCellStartDate(rowIndex, cellIndex);
                    if(result) return result;
                }
            }
        };

        const startDateVerticalSearch = searchVertical();
        const startDateHorizontalSearch = searchHorizontal();

        return startDateVerticalSearch > startDateHorizontalSearch
            ? startDateHorizontalSearch
            : startDateVerticalSearch;
    }

    findAllDayGroupCellStartDate(groupIndex, startDate) {
        const groupStartDate = this.getGroupStartDate(groupIndex);

        return groupStartDate > startDate
            ? groupStartDate
            : startDate;
    }

    findCellPositionInMap(cellInfo) {
        const { groupIndex, startDate, isAllDay, index } = cellInfo;

        const startTime = isAllDay
            ? dateUtils.trimTime(startDate).getTime()
            : startDate.getTime();

        const isStartDateInCell = cellData => {
            if(!this._workspace.isDateAndTimeView) {
                return dateUtils.sameDate(startDate, cellData.startDate);
            }

            const cellStartTime = cellData.startDate.getTime();
            const cellEndTime = cellData.endDate.getTime();

            return isAllDay
                ? cellData.allDay && startTime >= cellStartTime && startTime <= cellEndTime
                : startTime >= cellStartTime && startTime < cellEndTime;
        };

        const {
            allDayPanelGroupedMap,
            dateTableGroupedMap
        } = this.groupedDataMap;

        const rows = isAllDay && !this._workspace._isVerticalGroupedWorkSpace()
            ? [allDayPanelGroupedMap[groupIndex]] || []
            : dateTableGroupedMap[groupIndex] || [];

        for(let rowIndex = 0; rowIndex < rows.length; ++rowIndex) {
            const row = rows[rowIndex];

            for(let cellIndex = 0; cellIndex < row.length; ++cellIndex) {
                const cell = row[cellIndex];
                const { cellData } = cell;

                if(this._isSameGroupIndexAndIndex(cellData, groupIndex, index)) {
                    if(isStartDateInCell(cellData)) {
                        return cell.position;
                    }
                }
            }
        }

        return undefined;
    }

    _isSameGroupIndexAndIndex(cellData, groupIndex, index) {
        return cellData.groupIndex === groupIndex
            && (index === undefined || cellData.index === index);
    }

    getCellsGroup(groupIndex) {
        const { dateTableGroupedMap } = this.groupedDataMap;
        const groupData = dateTableGroupedMap[groupIndex];

        if(groupData) {
            const { cellData } = groupData[0][0];

            return cellData.groups;
        }
    }

    getCompletedGroupsInfo() {
        const { dateTableGroupedMap } = this.groupedDataMap;
        return dateTableGroupedMap.map(groupData => {
            const firstCell = groupData[0][0];
            const {
                allDay,
                groupIndex
            } = firstCell.cellData;

            return {
                allDay,
                groupIndex,
                startDate: this.getGroupStartDate(groupIndex),
                endDate: this.getGroupEndDate(groupIndex)
            };
        }).filter(({ startDate }) => !!startDate);
    }

    getGroupIndices() {
        return this.getCompletedGroupsInfo()
            .map(({ groupIndex }) => groupIndex);
    }

    getGroupFromDateTableGroupMap(groupIndex) {
        const { dateTableGroupedMap } = this.groupedDataMap;

        return dateTableGroupedMap[groupIndex];
    }

    getFirstGroupRow(groupIndex) {
        const groupedData = this.getGroupFromDateTableGroupMap(groupIndex);

        if(groupedData) {
            const { cellData } = groupedData[0][0];

            return !cellData.allDay
                ? groupedData[0]
                : groupedData[1];
        }
    }

    getLastGroupRow(groupIndex) {
        const { dateTableGroupedMap } = this.groupedDataMap;
        const groupedData = dateTableGroupedMap[groupIndex];

        if(groupedData) {
            const lastRowIndex = groupedData.length - 1;

            return groupedData[lastRowIndex];
        }
    }

    getLastGroupCell(groupIndex) {
        const { dateTableGroupedMap } = this.groupedDataMap;
        const groupedRows = dateTableGroupedMap[groupIndex];
        const lastRow = groupedRows[groupedRows.length - 1];
        let result;

        if(lastRow) {
            const cellCount = lastRow.length;
            result = lastRow[cellCount - 1];
        }

        return result;
    }

    getLastGroupCellPosition(groupIndex) {
        let groupCell;

        if(this.isVerticalGroupedWorkspace) {
            const groupRow = this.getLastGroupRow(groupIndex);

            groupCell = groupRow[groupRow.length - 1];
        } else {
            groupCell = this.getLastGroupCell(groupIndex);
        }

        return groupCell?.position;
    }

    getRowCountInGroup(groupIndex) {
        const groupRow = this.getLastGroupRow(groupIndex);
        const cellAmount = groupRow.length;
        const lastCellData = groupRow[cellAmount - 1].cellData;
        const lastCellIndex = lastCellData.index;

        return (lastCellIndex + 1) / groupRow.length;
    }
}

export default class ViewDataProvider {
    constructor(workspace) {
        this._viewDataGenerator = null;
        this._viewData = [];
        this._completeViewDataMap = [];
        this._completeDateHeaderMap = [];
        this._viewDataMap = [];
        this._groupedDataMapProvider = null;
        this._workspace = workspace;
    }

    get viewDataGenerator() {
        if(!this._viewDataGenerator) {
            this._viewDataGenerator = new ViewDataGenerator(this._workspace);
        }
        return this._viewDataGenerator;
    }

    get completeViewDataMap() { return this._completeViewDataMap; }
    set completeViewDataMap(value) { this._completeViewDataMap = value; }

    get completeDateHeaderMap() { return this._completeDateHeaderMap; }
    set completeDateHeaderMap(value) { this._completeDateHeaderMap = value; }

    get completeTimePanelMap() { return this._completeTimePanelMap; }
    set completeTimePanelMap(value) { this._completeTimePanelMap = value; }

    get viewData() { return this._viewData; }
    set viewData(value) { this._viewData = value; }

    get viewDataMap() { return this._viewDataMap; }
    set viewDataMap(value) { this._viewDataMap = value; }

    get dateHeaderData() { return this._dateHeaderData; }
    set dateHeaderData(value) { this._dateHeaderData = value; }

    get timePanelData() { return this._timePanelData; }
    set timePanelData(value) { this._timePanelData = value; }

    get groupedDataMap() { return this._groupedDataMapProvider.groupedDataMap; }

    get isVerticalGroupedWorkspace() { return this._workspace._isVerticalGroupedWorkSpace(); }

    update(isGenerateNewViewData) {
        const { viewDataGenerator, _workspace } = this;
        const renderOptions = _workspace.generateRenderOptions();

        if(isGenerateNewViewData) {
            this.completeViewDataMap = viewDataGenerator._getCompleteViewDataMap(renderOptions);
            this.completeDateHeaderMap = viewDataGenerator
                ._getCompleteDateHeaderMap(renderOptions, this.completeViewDataMap);
            this.completeTimePanelMap = viewDataGenerator
                ._getCompleteTimePanelMap(renderOptions, this.completeViewDataMap);
        }

        this.viewDataMap = viewDataGenerator._generateViewDataMap(this.completeViewDataMap, renderOptions);
        this.viewData = viewDataGenerator._getViewDataFromMap(this.viewDataMap, renderOptions);
        this._groupedDataMapProvider = new GroupedDataMapProvider(
            this.viewDataGenerator,
            this.viewDataMap,
            this.completeViewDataMap,
            this._workspace,
        );

        this.dateHeaderData = viewDataGenerator._generateDateHeaderData(this.completeDateHeaderMap, renderOptions);
        this.timePanelData = viewDataGenerator._generateTimePanelData(
            this.completeTimePanelMap,
            renderOptions,
        );
    }

    getStartDate() {
        const { groupedData } = this.viewData;
        const { dateTable } = groupedData[0];

        return dateTable[0][0].startDate;
    }

    getGroupStartDate(groupIndex) {
        return this._groupedDataMapProvider.getGroupStartDate(groupIndex);
    }

    getGroupEndDate(groupIndex) {
        return this._groupedDataMapProvider.getGroupEndDate(groupIndex);
    }

    findGroupCellStartDate(groupIndex, startDate, endDate, isAllDay) {
        return this._groupedDataMapProvider.findGroupCellStartDate(groupIndex, startDate, endDate, isAllDay);
    }

    findAllDayGroupCellStartDate(groupIndex, startDate) {
        return this._groupedDataMapProvider.findAllDayGroupCellStartDate(groupIndex, startDate);
    }

    findCellPositionInMap(cellInfo) {
        return this._groupedDataMapProvider.findCellPositionInMap(cellInfo);
    }

    getCellsGroup(groupIndex) {
        return this._groupedDataMapProvider.getCellsGroup(groupIndex);
    }

    getCompletedGroupsInfo() {
        return this._groupedDataMapProvider.getCompletedGroupsInfo();
    }

    getGroupIndices() {
        return this._groupedDataMapProvider.getGroupIndices();
    }

    getLastGroupCellPosition(groupIndex) {
        return this._groupedDataMapProvider.getLastGroupCellPosition(groupIndex);
    }

    getRowCountInGroup(groupIndex) {
        return this._groupedDataMapProvider.getRowCountInGroup(groupIndex);
    }

    getCellData(rowIndex, cellIndex, isAllDay) {
        if(isAllDay && !this.isVerticalGroupedWorkspace) {
            return this._viewData.groupedData[0].allDayPanel[cellIndex];
        }

        const { dateTableMap } = this.viewDataMap;
        const { cellData } = dateTableMap[rowIndex][cellIndex];

        return cellData;
    }

    getCellsByGroupIndexAndAllDay(groupIndex, allDay) {
        const workspace = this._workspace;
        const rowsPerGroup = workspace._getRowCountWithAllDayRows();
        const isShowAllDayPanel = workspace.isAllDayPanelVisible;

        const firstRowInGroup = this.isVerticalGroupedWorkspace
            ? groupIndex * rowsPerGroup
            : 0;
        const lastRowInGroup = this.isVerticalGroupedWorkspace
            ? (groupIndex + 1) * rowsPerGroup - 1
            : rowsPerGroup;
        const correctedFirstRow = isShowAllDayPanel && !allDay
            ? firstRowInGroup + 1
            : firstRowInGroup;
        const correctedLastRow = allDay ? correctedFirstRow : lastRowInGroup;

        return this.completeViewDataMap
            .slice(correctedFirstRow, correctedLastRow + 1)
            .map(row => row.filter(({ groupIndex: currentGroupIndex }) => groupIndex === currentGroupIndex));
    }

    getGroupData(groupIndex) {
        const { groupedData } = this.viewData;

        if(this.isVerticalGroupedWorkspace) {
            return groupedData.filter(item => item.groupIndex === groupIndex)[0];
        }

        const filterCells = row => row?.filter(cell => cell.groupIndex === groupIndex);

        const {
            allDayPanel,
            dateTable
        } = groupedData[0];
        const filteredDateTable = [];

        dateTable.forEach(row => {
            filteredDateTable.push(
                filterCells(row)
            );
        });

        return {
            allDayPanel: filterCells(allDayPanel),
            dateTable: filteredDateTable
        };
    }

    getCellCountWithGroup(groupIndex, rowIndex = 0) {
        const { dateTableGroupedMap } = this.groupedDataMap;

        return dateTableGroupedMap
            .filter((_, index) => index <= groupIndex)
            .reduce(
                (previous, row) => previous + row[rowIndex].length,
                0
            );
    }

    getAllDayPanel(groupIndex) {
        const groupData = this.getGroupData(groupIndex);

        return groupData?.allDayPanel;
    }

    isGroupIntersectDateInterval(groupIndex, startDate, endDate) {
        const groupStartDate = this.getGroupStartDate(groupIndex);
        const groupEndDate = this.getGroupEndDate(groupIndex);

        return startDate < groupEndDate && endDate > groupStartDate;
    }

    findGlobalCellPosition(date, groupIndex = 0, allDay = false) {
        const { completeViewDataMap, _workspace: workspace } = this;

        const showAllDayPanel = workspace.isAllDayPanelVisible;

        for(let rowIndex = 0; rowIndex < completeViewDataMap.length; rowIndex += 1) {
            const currentRow = completeViewDataMap[rowIndex];

            for(let columnIndex = 0; columnIndex < currentRow.length; columnIndex += 1) {
                const cellData = currentRow[columnIndex];
                const {
                    startDate: currentStartDate,
                    endDate: currentEndDate,
                    groupIndex: currentGroupIndex,
                    allDay: currentAllDay,
                } = cellData;

                if(groupIndex === currentGroupIndex
                    && allDay === !!currentAllDay
                    && this._compareDatesAndAllDay(date, currentStartDate, currentEndDate, allDay)) {
                    return {
                        position: {
                            columnIndex,
                            rowIndex: showAllDayPanel && !this.isVerticalGroupedWorkspace
                                ? rowIndex - 1
                                : rowIndex,
                        },
                        cellData,
                    };
                }
            }
        }
    }

    _compareDatesAndAllDay(date, cellStartDate, cellEndDate, allDay) {
        const time = date.getTime();
        const trimmedTime = dateUtils.trimTime(date).getTime();
        const cellStartTime = cellStartDate.getTime();
        const cellEndTime = cellEndDate.getTime();

        return (!allDay
            && time >= cellStartTime
            && time < cellEndTime)
            || (allDay && trimmedTime === cellStartTime);
    }

    getSkippedDaysCount(groupIndex, startDate, endDate, daysCount) {
        const { dateTableGroupedMap } = this._groupedDataMapProvider.groupedDataMap;
        const groupedData = dateTableGroupedMap[groupIndex];
        let includedDays = 0;

        for(let rowIndex = 0; rowIndex < groupedData.length; rowIndex += 1) {
            for(let columnIndex = 0; columnIndex < groupedData[rowIndex].length; columnIndex += 1) {
                const cell = groupedData[rowIndex][columnIndex].cellData;
                if(startDate.getTime() < cell.endDate.getTime()
                    && endDate.getTime() > cell.startDate.getTime()) {
                    includedDays += 1;
                }
            }
        }

        const lastCell = groupedData[groupedData.length - 1][groupedData[0].length - 1].cellData;
        const lastCellStart = dateUtils.trimTime(lastCell.startDate);
        const daysAfterView = Math.floor((endDate.getTime() - lastCellStart.getTime()) / dateUtils.dateToMilliseconds('day'));

        const deltaDays = daysAfterView > 0 ? daysAfterView : 0;

        return daysCount - includedDays - deltaDays;
    }
}
