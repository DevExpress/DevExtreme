import dateUtils from '../../../../core/utils/date';
import { HORIZONTAL_GROUP_ORIENTATION } from '../../constants';
import {
    getDateByCellIndices,
    calculateCellIndex,
} from '../utils/base';

const HOUR_MS = dateUtils.dateToMilliseconds('hour');

export class ViewDataGenerator {
    getCompleteViewDataMap(options) {
        const {
            rowCountInGroup,
            cellCountInGroupRow,
            groupsList,
            groupByDate,
            isHorizontalGrouping,
            isVerticalGrouping,
            totalCellCount,
        } = options;

        this._setVisibilityDates(options);

        let viewDataMap = [];
        const allDayPanelData = this._generateAllDayPanelData(options, cellCountInGroupRow);
        const viewCellsData = this._generateViewCellsData(options, rowCountInGroup);

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

            currentViewDataMap[rowIndex].forEach((cell, columnIndex) => {
                cell.key = keyBase + columnIndex;
            });

            return { allDayPanelsCount: currentAllDayPanelsCount, currentViewDataMap };
        }, {
            allDayPanelsCount: 0,
            currentViewDataMap: viewDataMap,
        });

        return result;
    }

    generateViewDataMap(completeViewDataMap, options) {
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

    getViewDataFromMap(viewDataMap, options) {
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

    _generateViewCellsData(options, rowsCount) {
        const { cellCountInGroupRow } = options;
        const viewCellsData = [];

        for(let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
            viewCellsData.push(this._generateCellsRow(
                options, false, rowIndex, cellCountInGroupRow,
            ));
        }

        return viewCellsData;
    }

    _generateAllDayPanelData(options, cellCount) {
        if(!options.isAllDayPanelVisible) {
            return null;
        }

        return this._generateCellsRow(options, true, 0, cellCount);
    }

    _generateCellsRow(options, allDay, rowIndex, columnCount) {
        const cellsRow = [];

        for(let columnIndex = 0; columnIndex < columnCount; ++columnIndex) {
            const cellDataValue = this.getCellData(rowIndex, columnIndex, options, allDay);

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

    getCellData(rowIndex, columnIndex, options, allDay) {
        return allDay
            ? this.prepareAllDayCellData(options, rowIndex, columnIndex)
            : this.prepareCellData(options, rowIndex, columnIndex);
    }

    prepareCellData(options, rowIndex, columnIndex) {
        const {
            groupsList,
            tableAllDay,
            endDayHour,
            interval,
        } = options;

        const startDate = getDateByCellIndices(options, rowIndex, columnIndex, this._calculateCellIndex);
        const endDate = this.calculateEndDate(startDate, interval, endDayHour);

        const data = {
            startDate: startDate,
            endDate: endDate,
            allDay: tableAllDay,
            groupIndex: 0,
        };

        if(groupsList.length > 0) {
            data.groups = groupsList[0];
        }

        return data;
    }

    prepareAllDayCellData(options, rowIndex, columnIndex) {
        const data = this.prepareCellData(options, rowIndex, columnIndex);
        const startDate = dateUtils.trimTime(data.startDate);

        return {
            ...data,
            startDate,
            endDate: startDate,
            allDay: true,
        };
    }

    calculateEndDate(startDate, interval, endDayHour) {
        const result = new Date(startDate);
        result.setMilliseconds(result.getMilliseconds() + Math.round(interval));

        return result;
    }

    _calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount) {
        return calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
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

    markSelectedAndFocusedCells(viewDataMap, renderOptions) {
        const {
            selectedCells,
            focusedCell,
        } = renderOptions;

        if(!selectedCells && !focusedCell) {
            return viewDataMap;
        }

        const {
            allDayPanelMap,
            dateTableMap
        } = viewDataMap;

        const nextDateTableMap = dateTableMap.map((row) => {
            return this._markSelectedAndFocusedCellsInRow(row, selectedCells, focusedCell);
        });
        const nextAllDayMap = this._markSelectedAndFocusedCellsInRow(allDayPanelMap, selectedCells, focusedCell);

        return {
            allDayPanelMap: nextAllDayMap,
            dateTableMap: nextDateTableMap,
        };
    }

    _markSelectedAndFocusedCellsInRow(dataRow, selectedCells, focusedCell) {
        return dataRow.map((cell) => {
            const {
                index,
                groupIndex,
                allDay,
                startDate,
            } = cell.cellData;

            const indexInSelectedCells = selectedCells.findIndex(({
                index: selectedCellIndex,
                groupIndex: selectedCellGroupIndex,
                allDay: selectedCellAllDay,
                startDate: selectedCellStartDate,
            }) => (
                groupIndex === selectedCellGroupIndex
                && (index === selectedCellIndex
                    || (selectedCellIndex === undefined
                        && startDate.getTime() === selectedCellStartDate.getTime()))
                && !!allDay === !!selectedCellAllDay
            ));

            const isFocused = !!focusedCell
                && index === focusedCell.cellData.index
                && groupIndex === focusedCell.cellData.groupIndex
                && allDay === focusedCell.cellData.allDay;

            if(!isFocused && indexInSelectedCells === -1) {
                return cell;
            }

            return {
                ...cell,
                cellData: {
                    ...cell.cellData,
                    isSelected: indexInSelectedCells > -1,
                    isFocused,
                },
            };
        });
    }

    getInterval(hoursInterval) {
        if(this._interval === undefined) {
            this._interval = hoursInterval * HOUR_MS;
        }
        return this._interval;
    }

    _setVisibilityDates() {}
}
