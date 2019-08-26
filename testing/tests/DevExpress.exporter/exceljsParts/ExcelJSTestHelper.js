const { assert } = QUnit;

class ExcelJSTestHelper {
    constructor(worksheet) {
        this.worksheet = worksheet;
    }

    checkCustomizeCell(eventArgs, expectedArgs, callIndex) {
        const { gridCell, excelCell } = eventArgs;
        const expectedAddress = expectedArgs[callIndex].excelCell;

        assert.strictEqual(this.worksheet.getRow(expectedAddress.row).getCell(expectedAddress.column).address, excelCell.address, `cell.address (${expectedAddress.row}, ${expectedAddress.column})`);

        const expectedColumn = expectedArgs[callIndex].gridCell.column;
        const actualColumn = gridCell.column;

        assert.strictEqual(actualColumn.dataField, expectedColumn.dataField, `column.dataField, ${callIndex}`);
        assert.strictEqual(actualColumn.dataType, expectedColumn.dataType, `column.dataType, ${callIndex}`);
        assert.strictEqual(actualColumn.caption, expectedColumn.caption, `column.caption, ${callIndex}`);
        assert.strictEqual(actualColumn.index, expectedColumn.index, `column.index, ${callIndex}`);

        const gridCellSkipProperties = ["column"];

        for(const propertyName in gridCell) {
            if(gridCellSkipProperties.indexOf(propertyName) === -1) {
                if(propertyName === "groupSummaryItems") {
                    assert.deepEqual(gridCell[propertyName], expectedArgs[callIndex].gridCell[propertyName], `gridCell[${propertyName}], ${callIndex}`);
                } else {
                    assert.strictEqual(gridCell[propertyName], expectedArgs[callIndex].gridCell[propertyName], `gridCell[${propertyName}], ${callIndex}`);
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

    checkValues(expectedRows, topLeft) {
        for(let rowIndex = 0; rowIndex < expectedRows.length; rowIndex++) {
            for(let columnIndex = 0; columnIndex < expectedRows[rowIndex].values.length; columnIndex++) {
                assert.equal(this.worksheet.getRow(topLeft.row + rowIndex).getCell(topLeft.column + columnIndex).value, expectedRows[rowIndex].values[columnIndex], `this.worksheet.getRow(${topLeft.row + rowIndex}).getCell(${topLeft.column + columnIndex}).value`);
            }
            assert.equal(this.worksheet.getRow(topLeft.row + rowIndex).outlineLevel, expectedRows[rowIndex].outlineLevel, `this.worksheet.getRow(${topLeft.row + rowIndex}).outlineLevel`);
        }
    }

    checkRowAndColumnCount(total, actual) {
        assert.equal(this.worksheet.rowCount, total.row, "worksheet.rowCount");
        assert.equal(this.worksheet.columnCount, total.column, "worksheet.columnCount");
        assert.equal(this.worksheet.actualRowCount, actual.row, "worksheet.actualRowCount");
        assert.equal(this.worksheet.actualColumnCount, actual.column, "worksheet.actualColumnCount");
    }

    _extendCellArgs(cellArgs, expectedRows, topLeft) {
        let rowIndex = 0;
        let cellIndex = 0;

        cellArgs.forEach((item) => {
            item.excelCell = { row: topLeft.row + rowIndex, column: topLeft.column + cellIndex };
            if(!("value" in item.gridCell)) {
                item.gridCell.value = expectedRows[rowIndex].values[cellIndex];
            }

            if(expectedRows[0].values.length - cellIndex === 1) { rowIndex++; cellIndex = 0; } else { cellIndex++; }
        });

        return cellArgs;
    }
}

export default ExcelJSTestHelper;
