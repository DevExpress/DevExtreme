import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import { DataGridKeyboardTestHelper } from '../../helpers/dataGrid.test.helper';

fixture `Keyboard Navigation`
    .page(getContainerFileUrl());

const dataGrid = new DataGridKeyboardTestHelper("#container");

test("Cell should not highlighted after editing another cell when startEditAction is 'dblClick' and 'batch' edit mode", async t => {
    await t.expect(dataGrid.cellHasFocusClass(0, 1)).notOk();
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).notOk();

    await t.doubleClick(dataGrid.getDataCell(1, 1));
    await t.expect(dataGrid.cellHasFocusClass(0, 1)).notOk();
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).ok();

    await t.click(dataGrid.getDataCell(0, 1));
    await t.expect(dataGrid.cellHasFocusClass(0, 1)).notOk();
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).notOk();
    await t.expect(dataGrid.isEditCell(1, 1)).notOk();

    await t.doubleClick(dataGrid.getDataCell(1, 1));
    await t.expect(dataGrid.cellHasFocusClass(0, 1)).notOk();
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).ok();

    await t.click(dataGrid.getDataCell(0, 1));
    await t.expect(dataGrid.getDataCell(0, 1).focused).ok();
    await t.expect(dataGrid.cellHasFocusClass(0, 1)).notOk();
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).notOk();
}).before(async () => {
    await createWidget("dxDataGrid", {
        dataSource: [
            { name: "Alex", phone: "555555", room: 1 },
            { name: "Dan", phone: "553355", room: 2 }
        ],
        columns:["name","phone","room"],
        editing: {
            mode: "batch",
            allowUpdating: true,
            startEditAction: "dblClick"
        }
    });
});

test("Cell should highlighted after editing another cell when startEditAction is 'dblClick' and editing mode is 'cell'", async t => {
    await t.expect(dataGrid.cellHasFocusClass(0, 1)).notOk();
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).notOk();

    await t.doubleClick(dataGrid.getDataCell(1, 1));
    await t.expect(dataGrid.cellHasFocusClass(0, 1)).notOk();
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).ok();

    await t.click(dataGrid.getDataCell(0, 1));
    await t.expect(dataGrid.cellHasFocusClass(0, 1)).ok();
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).notOk();
    await t.expect(dataGrid.isEditCell(1, 1)).notOk();

    await t.doubleClick(dataGrid.getDataCell(1, 1));
    await t.expect(dataGrid.cellHasFocusClass(0, 1)).notOk();
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).ok();

    await t.click(dataGrid.getDataCell(0, 1));
    await t.expect(dataGrid.getDataCell(0, 1).focused).ok();
    await t.expect(dataGrid.cellHasFocusClass(0, 1)).ok();
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).notOk();
}).before(async () => {
    await createWidget("dxDataGrid", {
        dataSource: [
            { name: "Alex", phone: "555555", room: 1 },
            { name: "Dan", phone: "553355", room: 2 }
        ],
        columns:["name","phone","room"],
        editing: {
            mode: "cell",
            allowUpdating: true,
            startEditAction: "dblClick"
        },
        onFocusedCellChanging: e => e.isHighlighted = true
    });
});
