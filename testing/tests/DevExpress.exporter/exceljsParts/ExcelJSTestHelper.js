import { isDefined } from "core/utils/type";

const { assert } = QUnit;

class ExcelJSTestHelper {
    constructor(worksheet) {
        this.worksheet = worksheet;
    }

    checkCustomizeCell(eventArgs, expectedCells, callIndex) {
        const { gridCell, excelCell } = eventArgs;

        const currentRowIndex = Math.floor(callIndex / expectedCells[0].length);
        const currentCellIndex = callIndex % expectedCells[currentRowIndex].length;
        const expectedCell = expectedCells[currentRowIndex][currentCellIndex];

        const expectedAddress = expectedCell.excelCell.address;

        assert.strictEqual(this.worksheet.getRow(expectedAddress.row).getCell(expectedAddress.column).address, excelCell.address, `cell.address (${expectedAddress.row}, ${expectedAddress.column})`);

        const expectedColumn = expectedCell.gridCell.column;
        const actualColumn = gridCell.column;

        assert.strictEqual(actualColumn.dataField, expectedColumn.dataField, `column.dataField, ${callIndex}`);
        assert.strictEqual(actualColumn.dataType, expectedColumn.dataType, `column.dataType, ${callIndex}`);
        assert.strictEqual(actualColumn.caption, expectedColumn.caption, `column.caption, ${callIndex}`);
        assert.strictEqual(actualColumn.index, expectedColumn.index, `column.index, ${callIndex}`);

        const gridCellSkipProperties = ["column"];

        for(const propertyName in gridCell) {
            if(gridCellSkipProperties.indexOf(propertyName) === -1) {
                if(propertyName === "groupSummaryItems") {
                    assert.deepEqual(gridCell[propertyName], expectedCell.gridCell[propertyName], `gridCell[${propertyName}], ${callIndex}`);
                } else {
                    assert.strictEqual(gridCell[propertyName], expectedCell.gridCell[propertyName], `gridCell[${propertyName}], ${callIndex}`);
                }
            }
        }
    }

    checkAutoFilter(excelFilterEnabled, from, to, frozenArea) {
        if(excelFilterEnabled === true) {
            assert.deepEqual(this.worksheet.autoFilter.from, from, "worksheet.autoFilter.from");
            assert.deepEqual(this.worksheet.autoFilter.to, to, "worksheet.autoFilter.to");
            assert.deepEqual(this.worksheet.views, [ { state: "frozen", ySplit: frozenArea.y } ], "worksheet.views");
        } else {
            assert.equal(this.worksheet.autoFilter, undefined, "worksheet.autoFilter");
        }
    }

    checkValues(cellsArray) {
        this._iterateCells(cellsArray, (cellArgs) => {
            const { excelCell } = cellArgs;
            const { row, column } = excelCell.address;

            assert.equal(this.worksheet.getCell(row, column).value, excelCell.value, `this.worksheet.getCell(${row}, ${column}).value`);
        });
    }

    checkColumnWidths(expectedWidths, startColumnIndex) {
        for(let i = 0; i < expectedWidths.length; i++) {
            assert.equal(this.worksheet.getColumn(startColumnIndex + i).width, expectedWidths[i], `worksheet.getColumns(${i}).width`);
        }
    }

    checkOutlineLevel(expectedOutlineLevelValues, startRowIndex) {
        for(let i = 0; i < expectedOutlineLevelValues.length; i++) {
            assert.equal(this.worksheet.getRow(startRowIndex + i).outlineLevel, expectedOutlineLevelValues[i], `worksheet.getRow(${i}).outlineLevel`);
        }
    }

    checkFont(cellsArray) {
        this._iterateCells(cellsArray, (cellArgs) => {
            const { excelCell } = cellArgs;
            const { row, column } = excelCell.address;

            assert.deepEqual(this.worksheet.getCell(row, column).font, excelCell.font, `this.worksheet.getCell(${row}, ${column}).font`);
        });
    }

    checkAlignment(cellsArray) {
        this._iterateCells(cellsArray, (cellArgs) => {
            const { excelCell } = cellArgs;
            const { row, column } = excelCell.address;

            assert.deepEqual(this.worksheet.getCell(row, column).alignment, excelCell.alignment, `this.worksheet.getCell(${row}, ${column}).alignment`);
        });
    }

    checkRowAndColumnCount(actual, total, topLeft) {
        assert.equal(this.worksheet.actualRowCount, actual.row, "worksheet.actualRowCount");
        assert.equal(this.worksheet.actualColumnCount, actual.column, "worksheet.actualColumnCount");
        assert.equal(this.worksheet.rowCount, total.row === 0 ? total.row : topLeft.row + total.row - 1, "worksheet.rowCount");
        assert.equal(this.worksheet.columnCount, total.column === 0 ? total.column : topLeft.column + total.column - 1, "worksheet.columnCount");
    }

    checkCellsRange(cellsRange, actual, topLeft) {
        assert.deepEqual(cellsRange.from, topLeft, "cellsRange.from");
        if(actual.row > 0 && actual.column > 0) {
            assert.deepEqual(cellsRange.to, { row: topLeft.row + actual.row - 1, column: topLeft.column + actual.column - 1 }, "cellsRange.to");
        } else {
            assert.deepEqual(cellsRange.to, { row: topLeft.row + actual.row, column: topLeft.column + actual.column }, "cellsRange.to");
        }
    }

    _extendExpectedCells(cellsArray, topLeft) {
        this._iterateCells(cellsArray, (cellArgs, rowIndex, columnIndex) => {
            cellArgs.excelCell.address = {
                row: rowIndex + topLeft.row,
                column: columnIndex + topLeft.column
            };

            if(!("value" in cellArgs.gridCell)) {
                cellArgs.gridCell.value = cellArgs.excelCell.value;
            }
        });
    }

    _iterateCells(cellsArray, callback) {
        for(let rowIndex = 0; rowIndex < cellsArray.length; rowIndex++) {
            for(let columnIndex = 0; columnIndex < cellsArray[rowIndex].length; columnIndex++) {
                let currentCell = cellsArray[rowIndex][columnIndex];

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
            const { address, dataType, type, numberFormat } = cellArgs.excelCell;
            const { row, column } = address;

            assert.deepEqual(typeof this.worksheet.getCell(row, column).value, dataType, `typeof this.worksheet.getCell(${row}, ${column}).value`);
            assert.deepEqual(this.worksheet.getCell(row, column).type, type, `this.worksheet.getCell(${row}, ${column}).type`);
            assert.deepEqual(this.worksheet.getCell(row, column).numFmt, numberFormat, `this.worksheet.getCell(${row}, ${column}).numFmt`);
        });
    }
}

export default ExcelJSTestHelper;
