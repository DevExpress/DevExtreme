import { isDefined } from 'core/utils/type';
import { Export } from 'exporter/exceljs/export';

const { assert } = QUnit;

class ExcelJSTestHelper {
    constructor(worksheet) {
        this.worksheet = worksheet;
    }

    checkCustomizeCell(eventArgs, expectedCells, callIndex) {
        const currentRowIndex = Math.floor(callIndex / expectedCells[0].length);
        const currentCellIndex = callIndex % expectedCells[currentRowIndex].length;
        const expectedCell = expectedCells[currentRowIndex][currentCellIndex];

        const expectedAddress = expectedCell.excelCell.address;

        assert.strictEqual(this.worksheet.getRow(expectedAddress.row).getCell(expectedAddress.column).address, eventArgs.excelCell.address, `cell.address (${expectedAddress.row}, ${expectedAddress.column})`);

        return expectedCell;
    }

    checkAutoFilter(autoFilterEnabled, autoFilter, worksheetViews) {
        assert.deepEqual(this.worksheet.views, worksheetViews ? [worksheetViews] : [], 'worksheet.views');

        if(autoFilterEnabled === true) {
            assert.deepEqual(this.worksheet.autoFilter, autoFilter, 'worksheet.autoFilter');
        } else {
            assert.deepEqual(this.worksheet.autoFilter, null, 'worksheet.autoFilter');
        }
    }

    checkValues(cellsArray) {
        this._iterateCells(cellsArray, (cellArgs) => {
            const { excelCell } = cellArgs;
            const { row, column } = excelCell.address;

            assert.deepEqual(this.worksheet.getCell(row, column).value, excelCell.value, `this.worksheet.getCell(${row}, ${column}).value`);
        });
    }

    checkColumnWidths(expectedWidths, startColumnIndex) {
        const tolerance = 0.2;

        for(let i = 0; i < expectedWidths.length; i++) {
            const actual = this.worksheet.getColumn(startColumnIndex + i).width;
            const expected = expectedWidths[i];
            const message = `worksheet.getColumns(${i}).width`;

            if(isFinite(expected)) {
                assert.roughEqual(actual, expected, tolerance, message);
            } else {
                assert.equal(actual, expected, message);
            }
        }
    }

    checkOutlineLevel(expectedOutlineLevelValues, startRowIndex) {
        assert.strictEqual(this.worksheet.actualRowCount, expectedOutlineLevelValues.length, 'worksheet.actualRowCount === expectedOutlineLevelValues');

        this.worksheet.eachRow({ includeEmpty: false }, (row) => {
            assert.strictEqual(row.outlineLevel, expectedOutlineLevelValues[row.number - startRowIndex], `worksheet.getRow(${row.number}).outlineLevel`);
        });
    }

    checkCellStyle(cellsArray) {
        this._iterateCells(cellsArray, (cellArgs) => {
            const { excelCell } = cellArgs;
            const { row, column } = excelCell.address;

            const sourceCell = this.worksheet.getCell(row, column);
            for(const propertyName in sourceCell.style) {
                assert.deepEqual(sourceCell.style[propertyName], excelCell[propertyName], `this.worksheet.getCell(${row}, ${column}).${propertyName}`);
            }
        });
    }

    checkRowAndColumnCount(actual, total, topLeft) {
        assert.equal(this.worksheet.actualRowCount, actual.row, 'worksheet.actualRowCount');
        assert.equal(this.worksheet.actualColumnCount, actual.column, 'worksheet.actualColumnCount');
        assert.equal(this.worksheet.rowCount, total.row === 0 ? total.row : topLeft.row + total.row - 1, 'worksheet.rowCount');
        assert.equal(this.worksheet.columnCount, total.column === 0 ? total.column : topLeft.column + total.column - 1, 'worksheet.columnCount');
    }

    checkCellRange(cellRange, actual, topLeft) {
        assert.deepEqual(cellRange.from, topLeft, 'cellRange.from');

        if(actual.row > 0 && actual.column > 0) {
            assert.deepEqual(cellRange.to, { row: topLeft.row + actual.row - 1, column: topLeft.column + actual.column - 1 }, 'cellRange.to');
        } else {
            assert.deepEqual(cellRange.to, { row: topLeft.row + actual.row, column: topLeft.column + actual.column }, 'cellRange.to');
        }
    }

    _extendExpectedCells(cellsArray, topLeft, callback) {
        this._iterateCells(cellsArray, (cellArgs, rowIndex, columnIndex) => {
            cellArgs.excelCell.address = {
                row: rowIndex + topLeft.row,
                column: columnIndex + topLeft.column
            };

            callback(cellArgs, rowIndex, columnIndex);
        });
    }

    _iterateCells(cellsArray, callback) {
        for(let rowIndex = 0; rowIndex < cellsArray.length; rowIndex++) {
            for(let columnIndex = 0; columnIndex < cellsArray[rowIndex].length; columnIndex++) {
                const currentCell = cellsArray[rowIndex][columnIndex];

                callback(currentCell, rowIndex, columnIndex);
            }
        }
    }

    _iterateWorksheetCells(callback) {
        this.worksheet.eachRow({ includeEmpty: true }, (row) => {
            row.eachCell({ includeEmpty: true }, (cell) => {
                callback(cell);
            });
        });
    }

    checkMergeCells(cellsArray, topLeft) {
        this._iterateWorksheetCells((excelCell) => {
            if(excelCell.col < topLeft.column) {
                assert.strictEqual(excelCell.isMerged, false, `cell: ${excelCell.address}.isMerged`);
                assert.strictEqual(excelCell.master, excelCell, `cell: ${excelCell.address}.master`);
            } else {
                const expectedExcelCell = cellsArray[excelCell.row - topLeft.row][excelCell.col - topLeft.column].excelCell;

                if(!isDefined(expectedExcelCell.master)) {
                    assert.strictEqual(excelCell.isMerged, false, `cell: ${excelCell.address}.isMerged`);
                    assert.strictEqual(excelCell.master, excelCell, `cell: ${excelCell.address}.master`);
                } else {
                    const master = this.worksheet.getCell(expectedExcelCell.master[0] + topLeft.row - 1, expectedExcelCell.master[1] + topLeft.column - 1);

                    assert.strictEqual(excelCell.isMerged, true, `cell: ${excelCell.address}.isMerged`);
                    assert.strictEqual(excelCell.master, master, `cell: ${excelCell.address}.master`);
                }
            }
        });
    }

    checkCellFormat(cellsArray) {
        this._iterateCells(cellsArray, (cellArgs) => {
            const { address, dataType = 'string', type = 3, numFmt } = cellArgs.excelCell;
            const { row, column } = address;

            assert.deepEqual(typeof this.worksheet.getCell(row, column).value, dataType, `typeof this.worksheet.getCell(${row}, ${column}).value`);
            assert.deepEqual(this.worksheet.getCell(row, column).type, type, `this.worksheet.getCell(${row}, ${column}).type`);
            assert.deepEqual(this.worksheet.getCell(row, column).numFmt, numFmt, `this.worksheet.getCell(${row}, ${column}).numFmt`);
        });
    }
}

class ExcelJSPivotGridTestHelper extends ExcelJSTestHelper {
    checkCustomizeCell(eventArgs, expectedCells, callIndex) {
        const { pivotCell } = eventArgs;
        const expectedCell = super.checkCustomizeCell(eventArgs, expectedCells, callIndex);

        assert.notStrictEqual(pivotCell, undefined, 'pivotCell property exist');

        for(const propertyName in pivotCell) {
            if(propertyName === 'path' || propertyName === 'rowPath' || propertyName === 'columnPath') {
                assert.strictEqual(pivotCell[propertyName].length, expectedCell.pivotCell[propertyName].length, `pivotCell[${propertyName}].length, ${callIndex}`);
                pivotCell[propertyName].forEach((pathValue, index) => {
                    assert.equal(pathValue, expectedCell.pivotCell[propertyName][index], `pivotCell[${propertyName}][${index}], ${callIndex}`);
                });
            } else {
                assert.deepEqual(pivotCell[propertyName], expectedCell.pivotCell[propertyName], `pivotCell[${propertyName}], ${callIndex}`);
            }
        }
    }

    extendExpectedCells(cellsArray, topLeft, options) {
        let rowIndexCorrection = 0;

        if(options) {
            if(options.exportFilterFieldHeaders) {
                rowIndexCorrection++;
            }
            if(options.exportDataFieldHeaders || options.exportColumnFieldHeaders) {
                rowIndexCorrection++;
            }
        }

        super._extendExpectedCells(cellsArray, topLeft, (cellArgs, rowIndex, columnIndex) => {
            if(!(cellArgs.pivotCell.type === 'header' && cellArgs.pivotCell.area === 'filter')) {
                cellArgs.pivotCell.rowIndex = rowIndex - rowIndexCorrection;
                cellArgs.pivotCell.columnIndex = columnIndex;
            }

            if(!('value' in cellArgs.pivotCell)) {
                cellArgs.pivotCell.value = cellArgs.excelCell.value;
            }
        });
    }

    getAllRealColumnWidths(component) {
        return [...this.getRowsAreaColumnWidths(component), ...this.getColumnsAreaColumnWidths(component)];
    }

    getColumnsAreaColumnWidths(component) {
        const columnWidths = [];

        const showTotalsPrior = component.option('showTotalsPrior');
        const columnsAreaColumns = component.$element().find('.dx-pivotgrid-horizontal-headers tr')[showTotalsPrior === 'columns' || showTotalsPrior === 'both' ? 'first' : 'last']().find('td');

        columnsAreaColumns.each((_, element) => columnWidths.push(element.getBoundingClientRect().width));

        return columnWidths;
    }

    getRowsAreaColumnWidths(component) {
        const columnWidths = [];

        const rowsAreaColumns = component.$element().find('.dx-pivotgrid-vertical-headers tr').first().find('td');


        rowsAreaColumns.each((_, element) => columnWidths.push(element.getBoundingClientRect().width));

        return columnWidths;
    }

    toExcelWidths(widths) {
        return widths.map(width => Math.floor(width / Export.__internals.MAX_DIGIT_WIDTH_IN_PIXELS * 100) / 100);
    }
}

class ExcelJSDataGridTestHelper extends ExcelJSTestHelper {
    checkCustomizeCell(eventArgs, expectedCells, callIndex) {
        const { gridCell = {} } = eventArgs;
        const expectedCell = super.checkCustomizeCell(eventArgs, expectedCells, callIndex);

        const expectedColumn = expectedCell.gridCell.column;
        const actualColumn = gridCell.column;

        assert.strictEqual(actualColumn.dataField, expectedColumn.dataField, `column.dataField, ${callIndex}`);
        assert.strictEqual(actualColumn.dataType, expectedColumn.dataType, `column.dataType, ${callIndex}`);
        assert.strictEqual(actualColumn.caption, expectedColumn.caption, `column.caption, ${callIndex}`);
        assert.strictEqual(actualColumn.index, expectedColumn.index, `column.index, ${callIndex}`);

        const gridCellSkipProperties = ['column'];

        for(const propertyName in gridCell) {
            if(gridCellSkipProperties.indexOf(propertyName) === -1) {
                if(propertyName === 'groupSummaryItems' || propertyName === 'value') {
                    assert.deepEqual(gridCell[propertyName], expectedCell.gridCell[propertyName], `gridCell[${propertyName}], ${callIndex}`);
                } else {
                    assert.strictEqual(gridCell[propertyName], expectedCell.gridCell[propertyName], `gridCell[${propertyName}], ${callIndex}`);
                }
            }
        }
    }

    _extendExpectedCells(cellsArray, topLeft) {
        super._extendExpectedCells(cellsArray, topLeft, (cellArgs, rowIndex, columnIndex) => {
            const { excelCell, gridCell = {} } = cellArgs;

            if(!('value' in gridCell)) {
                gridCell.value = excelCell.value;
            }
        });
    }
}

export { ExcelJSPivotGridTestHelper, ExcelJSDataGridTestHelper };
