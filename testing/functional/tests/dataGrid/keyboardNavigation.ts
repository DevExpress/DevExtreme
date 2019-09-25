import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import DataGrid from '../../model/dataGrid';

fixture `Keyboard Navigation`
    .page(url(__dirname, '../container.html'));

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
}).before(() => createWidget("dxDataGrid", {
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
}));

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
}).before(() => createWidget("dxDataGrid", {
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
}));

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

        .pressKey("tab enter")
        .expect(commandCell.focused).ok()
        .expect(dataGrid.getDataRow(0).isRemoved).ok();
}).before(() => createWidget("dxDataGrid", {
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
}));

test("TextArea should be focused on editing start", async t => {
    const dataGrid = new DataGrid("#container"),
        commandCell = dataGrid.getDataCell(1, 3).element,
        dataCell = dataGrid.getDataCell(1, 0),
        getTextArea = () => dataCell.element.find(".text-area-1");

    await t
        // act, assert
        .click(commandCell.find(".dx-link-edit"))
        .expect(dataCell.isEditCell).ok()
        .expect(getTextArea().exists).ok()
        .expect(getTextArea().focused).ok();
}).before(() => createWidget("dxDataGrid", {
    dataSource: [
        { id: 0, name: "Alex" },
        { id: 1, name: "Bob" }
    ],
    editing: {
        mode: "row",
        allowUpdating: true
    },
    columns: [
        {
            dataField: "name",
            editCellTemplate: cell => $(cell).append($("<textarea class='text-area-1' />"))
        },
        {
            dataField: "phone",
            editCellTemplate: cell => $(cell).append($("<textarea class='text-area-2' />"))
        },
        {
            dataField: "room",
            editCellTemplate: cell => $(cell).append($("<textarea />"))
        }
    ]
}));
