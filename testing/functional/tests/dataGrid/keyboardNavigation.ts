
import { pathToFileURL } from 'url';
import { join } from  'path';
import { createWidget } from '../../helpers/testHelper';
import DataGrid from '../../model/dataGrid';
import { Selector } from 'testcafe';

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

test("Navigation through views using Tab, Shift+Tab", async t => {
    const dataGrid = new DataGrid("#container");
    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);
    const filterRow = headers.getFilterRow();
    const filterPanel = dataGrid.getFilterPanel();
    const pager = dataGrid.getPager();

    // header row
    await t
        .pressKey("tab")
        .expect(headers.hasFocusedState).ok()
        .expect(headerRow.getHeaderCell(0).element.focused).ok()
        .pressKey("tab")
        .expect(headers.hasFocusedState).ok()
        .expect(headerRow.getHeaderCell(0).getFilterIcon().focused).ok()

        .pressKey("tab")
        .expect(headers.hasFocusedState).ok()
        .expect(headerRow.getHeaderCell(1).element.focused).ok()
        .pressKey("tab")
        .expect(headers.hasFocusedState).ok()
        .expect(headerRow.getHeaderCell(1).getFilterIcon().focused).ok();

    // filter row
    await t
        .pressKey("tab")
        .expect(headers.hasFocusedState).ok()
        .expect(filterRow.getFilterCell(0).getSearchIcon().element.focused).ok()
        .expect(filterRow.getFilterCell(0).getSearchIcon().hasFocusedState).ok()

        .pressKey("tab")
        .expect(headers.hasFocusedState).ok()
        .expect(filterRow.getFilterCell(0).getEditor().element.focused).ok()

        .pressKey("tab")
        .expect(headers.hasFocusedState).ok()
        .expect(filterRow.getFilterCell(1).getSearchIcon().element.focused).ok()
        .expect(filterRow.getFilterCell(1).getSearchIcon().hasFocusedState).ok()

        .pressKey("tab")
        .expect(headers.hasFocusedState).ok()
        .expect(filterRow.getFilterCell(1).getEditor().element.focused).ok();

    // rowsView
    await t
        // 1st row
        .pressKey("tab")
        .expect(dataGrid.getDataRow(0).getDataCell(0).element.focused).ok()
        .expect(dataGrid.getDataRow(0).getDataCell(0).isFocused).ok()

        .pressKey("tab")
        .expect(dataGrid.getDataRow(0).getDataCell(1).element.focused).ok()
        .expect(dataGrid.getDataRow(0).getDataCell(1).isFocused).ok()

        .pressKey("tab")
        .expect(dataGrid.getDataRow(0).getCommandCell(2).getButton(0).focused).ok()

        .pressKey("tab")
        .expect(dataGrid.getDataRow(0).getCommandCell(2).getButton(1).focused).ok()

        // 2nd row
        .pressKey("tab")
        .expect(dataGrid.getDataRow(1).getDataCell(0).isFocused).ok()

        .pressKey("tab")
        .expect(dataGrid.getDataRow(1).getDataCell(1).isFocused).ok()

        .pressKey("tab")
        .expect(dataGrid.getDataRow(1).getCommandCell(2).getButton(0).focused).ok()

        .pressKey("tab")
        .expect(dataGrid.getDataRow(1).getCommandCell(2).getButton(1).focused).ok();

    // filterPanel
    await t
        .pressKey("tab")
        .expect(filterPanel.hasFocusedState).ok()
        .expect(filterPanel.getIconFilter().element.focused).ok()

        .pressKey("tab")
        .expect(filterPanel.hasFocusedState).ok()
        .expect(filterPanel.getFilterText().element.focused).ok();

    // pager
    await t
        .pressKey("tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getPageSize(0).element.focused).ok()

        .pressKey("tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getPageSize(1).element.focused).ok()

        .pressKey("tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getPrevNavButton().element.focused).ok()

        .pressKey("tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getNavPage(0).element.focused).ok()

        .pressKey("tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getNavPage(1).element.focused).ok()

        .pressKey("tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getNextNavButton().element.focused).ok();

    // focus BODY
    await t
        .pressKey("tab")
        .expect(Selector("BODY").focused).ok();

    // Reverse
    // pager
    await t
        .pressKey("shift+tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getNextNavButton().element.focused).ok()

        .pressKey("shift+tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getNavPage(1).element.focused).ok()

        .pressKey("shift+tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getNavPage(0).element.focused).ok()

        .pressKey("shift+tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getPrevNavButton().element.focused).ok()

        .pressKey("shift+tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getPageSize(1).element.focused).ok()

        .pressKey("shift+tab")
        .expect(pager.hasFocusedState).ok()
        .expect(pager.getPageSize(0).element.focused).ok();

    // filterPanel
    await t
        .pressKey("shift+tab")
        .expect(filterPanel.hasFocusedState).ok()
        .expect(filterPanel.getFilterText().element.focused).ok()

        .pressKey("shift+tab")
        .expect(filterPanel.hasFocusedState).ok()
        .expect(filterPanel.getIconFilter().element.focused).ok();

    // rowsView
    await t
        // 2nd row
        .pressKey("shift+tab")
        .expect(dataGrid.getDataRow(1).getCommandCell(2).getButton(1).focused).ok()

        .pressKey("shift+tab")
        .expect(dataGrid.getDataRow(1).getCommandCell(2).getButton(0).focused).ok()

        .pressKey("shift+tab")
        .expect(dataGrid.getDataRow(1).getDataCell(1).isFocused).ok()

        .pressKey("shift+tab")
        .expect(dataGrid.getDataRow(1).getDataCell(0).isFocused).ok()

        // 1st row
        .pressKey("shift+tab")
        .expect(dataGrid.getDataRow(0).getCommandCell(2).getButton(1).focused).ok()

        .pressKey("shift+tab")
        .expect(dataGrid.getDataRow(0).getCommandCell(2).getButton(0).focused).ok()

        .pressKey("shift+tab")
        .expect(dataGrid.getDataRow(0).getDataCell(1).isFocused).ok()

        .pressKey("shift+tab")
        .expect(dataGrid.getDataRow(0).getDataCell(0).isFocused).ok()
        .pressKey("shift+tab")
        .expect(dataGrid.getDataRow(0).element.focused).ok();

    // filter row
    await t
        .pressKey("shift+tab")
        .expect(headers.hasFocusedState).ok()
        .expect(filterRow.getFilterCell(1).getEditor().element.focused).ok()

        .pressKey("shift+tab")
        .expect(headers.hasFocusedState).ok()
        .expect(filterRow.getFilterCell(1).getSearchIcon().element.focused).ok()
        .expect(filterRow.getFilterCell(1).getSearchIcon().hasFocusedState).ok()

        .pressKey("shift+tab")
        .expect(headers.hasFocusedState).ok()
        .expect(filterRow.getFilterCell(0).getEditor().element.focused).ok()

        .pressKey("shift+tab")
        .expect(headers.hasFocusedState).ok()
        .expect(filterRow.getFilterCell(0).getSearchIcon().element.focused).ok()
        .expect(filterRow.getFilterCell(0).getSearchIcon().hasFocusedState).ok();

    // header row
    await t
        .pressKey("shift+tab")
        .expect(headers.hasFocusedState).ok()
        .expect(headerRow.getHeaderCell(1).getFilterIcon().focused).ok()
        .pressKey("shift+tab")
        .expect(headers.hasFocusedState).ok()
        .expect(headerRow.getHeaderCell(1).element.focused).ok()

        .pressKey("shift+tab")
        .expect(headers.hasFocusedState).ok()
        .expect(headerRow.getHeaderCell(0).getFilterIcon().focused).ok()
        .pressKey("shift+tab")
        .expect(headers.hasFocusedState).ok()
        .expect(headerRow.getHeaderCell(0).element.focused).ok();

    // focus BODY
    await t
        .pressKey("shift+tab")
        .expect(Selector("BODY").focused).ok();

}).before(async () => {
    await createWidget("dxDataGrid", {
        width: 300,
        dataSource: [
            { name: "Alex", c0: "c0_0" },
            { name: "Ben", c0: "c0_1" },
            { name: "Dan", c0: "c0_2" },
            { name: "John", c0: "c0_3" }
        ],
        keyExpr: "name",
        editing: {
            allowUpdating: true,
            allowDeleting: true,
            selectTextOnEditStart: true,
            useIcons: true
        },
        headerFilter: { visible: true },
        filterPanel: { visible: true },
        filterRow: { visible: true },
        pager: {
            allowedPageSizes: [1, 2],
            showPageSizeSelector: true,
            showNavigationButtons: true
        },
        paging: {
            pageSize: 2,
        },
        focusedRowEnabled: true
    });
});

test("Select views by Ctrl+Up, Ctrl+Down keys", async t => {
    const dataGrid = new DataGrid("#container");
    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);
    const filterRow = headers.getFilterRow();
    const filterPanel = dataGrid.getFilterPanel();
    const pager = dataGrid.getPager();

    // Ctrl+Down
    await t
        .pressKey("tab")
        .expect(headers.hasFocusedState).ok("headers has focused state")
        .expect(headerRow.getHeaderCell(0).element.focused).ok("focused header cell[0, 0]")

        .pressKey("ctrl+down")
        .expect(headers.hasFocusedState).ok("headers has focused state")
        .expect(filterRow.getFilterCell(0).getEditor().element.focused).ok("focused filterRow cell[0, 0]")

        .pressKey("ctrl+down")
        .expect(dataGrid.getDataRow(0).isFocusedRow).ok("Row 0 is a focused row")

        .pressKey("ctrl+down")
        .expect(filterPanel.hasFocusedState).ok("Filter panel has focused state")
        .expect(filterPanel.getIconFilter().element.focused).ok("Focused filter panel filter icon")

        .pressKey("ctrl+down")
        .expect(pager.hasFocusedState).ok("Pager has focused state")
        .expect(pager.getPageSize(0)).ok("Focused filter panel filter icon");

    // Ctrl+Up
    await t
        .pressKey("ctrl+up")
        .expect(filterPanel.hasFocusedState).ok("Filter panel has focused state")
        .expect(filterPanel.getIconFilter().element.focused).ok("Focused filter panel filter icon")

        .pressKey("ctrl+up")
        .expect(dataGrid.getDataRow(0).isFocusedRow).ok("Row 0 is a focused row")

        .pressKey("ctrl+up")
        .expect(headers.hasFocusedState).ok("headers has focused state")
        .expect(filterRow.getFilterCell(0).getEditor().element.focused).ok("focused filterRow cell[0, 0]")

        .pressKey("ctrl+up")
        .expect(headers.hasFocusedState).ok("headers has focused state")
        .expect(headerRow.getHeaderCell(0).element.focused).ok("focused header cell[0, 0]");
}).before(async () => {
    await createWidget("dxDataGrid", {
        width: 300,
        dataSource: [
            { name: "Alex", c0: "c0_0" },
            { name: "Ben", c0: "c0_1" },
            { name: "Dan", c0: "c0_2" },
            { name: "John", c0: "c0_3" }
        ],
        keyExpr: "name",
        editing: {
            allowUpdating: true,
            allowDeleting: true,
            selectTextOnEditStart: true,
            useIcons: true
        },
        headerFilter: { visible: true },
        filterPanel: { visible: true },
        filterRow: { visible: true },
        pager: {
            allowedPageSizes: [1, 2],
            showPageSizeSelector: true,
            showNavigationButtons: true
        },
        paging: {
            pageSize: 2,
        },
        focusedRowEnabled: true
    });
});

test("DataGrid - Scroll bars should not appear when updating edge cell focus overlay position (T812494)", async t => {
    const dataGrid = new DataGrid("#container");
    const headers = dataGrid.getHeaders();

    await t
        .click(dataGrid.getDataCell(0, 0).element)
        .expect(dataGrid.getDataCell(0, 0).element.focused).ok()
        .pressKey("tab")
        .expect(dataGrid.getDataCell(0, 1).isFocused).ok()
        .pressKey("tab")
        .expect(dataGrid.getDataCell(1, 0).isFocused).ok()
        .expect(dataGrid.getScrollbarWidth(false)).eql(0);
}).before(async () => {
    await createWidget("dxDataGrid", {
        height: 150,
        width: 200,
        columnAutoWidth: true,
        dataSource: [
            { c0: "c0_0", c1: "c1_0" },
            { c0: "c0_1", c1: "c1_1" }
        ],
        scrolling: {
            useNative: true
        },
        columns: [
            "c0",
            { dataField: "c1", width: 50 }
        ]
    });
});

test("Tab key on the focused group row should be handled by default behavior (T833621)", async t => {
    const dataGrid = new DataGrid("#container");
    const groupRow = dataGrid.getGroupRow(1);
    const pagerPage0 = dataGrid.getPager().getNavPage(0);

    await t
        .click(groupRow.element)
        .expect(groupRow.hasHiddenFocusState).ok()
        .pressKey("tab")
        .expect(pagerPage0.element.focused).ok()
        .pressKey("shift+tab")
        .expect(groupRow.hasHiddenFocusState).notOk()
        .expect(groupRow.hasFocusedState).notOk()
        .expect(groupRow.element.focused).ok()
        .pressKey("tab")
        .expect(groupRow.hasHiddenFocusState).notOk()
        .expect(pagerPage0.element.focused).ok();
}).before(async () => {
    await createWidget("dxDataGrid", {
        width: 400,
        dataSource: [
            { id: 0, c0: "Test00 resize", c1: "Test10" },
            { id: 1, c0: "Test01 resize", c1: "Test11" },
            { id: 1, c0: "Test01 resize", c1: "Test12" },
            { id: 1, c0: "Test01 resize", c1: "Test10" },
            { id: 1, c0: "Test01 resize", c1: "Test11" },
            { id: 1, c0: "Test01 resize", c1: "Test12" },
            { id: 1, c0: "Test01 resize", c1: "Test10" },
        ],
        columns: [
            "id",
            "c0",
            {
                dataField: "c1",
                groupIndex: 0,
                showWhenGrouped: true
            }
        ],
        paging: {
            pageSize: 2
        },
        grouping: {
            autoExpandAll: false
        }
    });
});
