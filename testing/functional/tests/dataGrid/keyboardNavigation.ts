
import { pathToFileURL } from 'url';
import { join } from  'path';
import { createWidget } from '../../helpers/testHelper';
import DataGrid from '../../model/dataGrid';

fixture `Keyboard Navigation`
    .page(pathToFileURL(join(__dirname, '../container.html')).href);

test("Cell should not highlighted after editing another cell when startEditAction is 'dblClick' and 'batch' edit mode", async t => {
    const dataGrid = new DataGrid("#container");

    await t
        .expect(dataGrid.getDataCell(0, 1).isFocused).notOk()
        .expect(dataGrid.getDataCell(1, 1).isFocused).notOk()

        .doubleClick(dataGrid.getDataCell(1, 1).element)
        .expect(dataGrid.getDataCell(0, 1).isFocused).notOk()
        .expect(dataGrid.getDataCell(1, 1).isFocused).ok()

        .click(dataGrid.getDataCell(0, 1).element)
        .expect(dataGrid.getDataCell(0, 1).isFocused).notOk()
        .expect(dataGrid.getDataCell(1, 1).isFocused).notOk()
        .expect(dataGrid.getDataCell(1, 1).isEditCell).notOk()

        .doubleClick(dataGrid.getDataCell(1, 1).element)
        .expect(dataGrid.getDataCell(0, 1).isFocused).notOk()

        .click(dataGrid.getDataCell(0, 1).element)
        .expect(dataGrid.getDataCell(0, 1).element.focused).ok()
        .expect(dataGrid.getDataCell(0, 1).isFocused).notOk()
        .expect(dataGrid.getDataCell(1, 1).isFocused).notOk();
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
    const dataGrid = new DataGrid("#container");

    await t
        .expect(dataGrid.getDataCell(0, 1).isFocused).notOk()
        .expect(dataGrid.getDataCell(1, 1).isFocused).notOk()

        .doubleClick(dataGrid.getDataCell(1, 1).element)
        .expect(dataGrid.getDataCell(0, 1).isFocused).notOk()
        .expect(dataGrid.getDataCell(1, 1).isFocused).ok()

        .click(dataGrid.getDataCell(0, 1).element)
        .expect(dataGrid.getDataCell(0, 1).isFocused).ok()
        .expect(dataGrid.getDataCell(1, 1).isFocused).notOk()
        .expect(dataGrid.getDataCell(1, 1).isEditCell).notOk()

        .doubleClick(dataGrid.getDataCell(1, 1).element)
        .expect(dataGrid.getDataCell(0, 1).isFocused).notOk()
        .expect(dataGrid.getDataCell(1, 1).isFocused).ok()

        .click(dataGrid.getDataCell(0, 1).element)
        .expect(dataGrid.getDataCell(0, 1).element.focused).ok()
        .expect(dataGrid.getDataCell(0, 1).isFocused).ok()
        .expect(dataGrid.getDataCell(1, 1).isFocused).notOk();
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

test("Cell should be focused after Enter key press if enterKeyDirection is 'none' and enterKeyAction is 'moveFocus'", async t => {
    const dataGrid = new DataGrid("#container");
    const dataCell = dataGrid.getDataCell(0, 0).element;
    const commandCell = dataGrid.getDataCell(0, 1).element;

    await t
        .click(dataCell)
        .pressKey("esc")
        .expect(dataCell.focused).ok()
        .pressKey("enter")
        .expect(dataCell.focused).ok()

        .pressKey("enter")
        .expect(dataCell.focused).ok()

        .pressKey("tab")
        .pressKey("enter")
        .expect(commandCell.focused).ok()
        .expect(dataGrid.getDataRow(0).isRemoved).ok();
}).before(async () => {
    await createWidget("dxDataGrid", {
        height: 200,
        width: 200,
        dataSource: [
            { id: 0 },
            { id: 1 }
        ],
        editing: {
            mode: "batch",
            allowUpdating: true,
            allowDeleting: true
        },
        keyboardNavigation: {
            enterKeyAction: "moveFocus",
            enterKeyDirection: "none"
        }
    });
});

test("Cancel in onFocusedRowChanging event should prevent change focus row with tabIndex", async t => {
    const dataGrid = new DataGrid("#container");
    const dataRow = dataGrid.getDataRow(0);
    const dataCell = dataGrid.getDataCell(0, 1);

    await t
        .expect(dataRow.element.hasAttribute("tabindex")).ok()
        .click(dataCell.element)
        .expect(dataRow.isFocusedRow).notOk()
        .expect(dataRow.element.focused).notOk()
        .expect(dataRow.element.hasAttribute("tabindex")).ok();
}).before(async () => {
    await createWidget("dxDataGrid", {
        height: 200,
        width: 200,
        keyExpr: "name",
        dataSource: [
            { name: "Alex", phone: "111111", room: 6 },
            { name: "Dan", phone: "2222222", room: 5 }
        ],
        focusedRowEnabled: true,
        onFocusedRowChanging: (e: any) => e.cancel = true
    });
});
