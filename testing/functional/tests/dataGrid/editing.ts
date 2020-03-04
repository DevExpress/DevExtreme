import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import DataGrid from '../../model/dataGrid';
import SelectBox from '../../model/selectBox';
import { ClientFunction } from 'testcafe';

fixture `Editing`
    .page(url(__dirname, '../container.html'));

test("Tab key on editor should focus next cell if editing mode is cell", async t => {
    const dataGrid = new DataGrid("#container");

    await t
        .click(dataGrid.getDataCell(0, 1).element)
        .pressKey("1 tab")
        .expect(dataGrid.getDataCell(1, 1).isFocused).ok();

}).before(() => createWidget("dxDataGrid", {
    dataSource: [{ name: "AaAaA", value: 1 }, { name: "aAaAa", value: 2 }],
    editing: {
        mode: "cell",
        allowUpdating: true
    },
    columns: [{ dataField: "name", allowEditing: false }, { dataField: "value", showEditorAlways: true }]
}));

test("Click should work if a column button set using svg icon (T863635)", async t => {
    await t
        .click("#svg-icon")
        .expect(ClientFunction(() => (window as any).onSvgClickCounter)()).eql(1)

}).before(() => createWidget("dxDataGrid", {
    dataSource: [{ value: 1 }],
    columns: [{
        type: "buttons",
        width: 110,
        buttons: [
        {
            hint: "svg icon",
            icon: '<svg id="svg-icon"><circle cx="15" cy="15" r="14" /> </svg>',
            onClick: function(e) {
                const global = window as any;
                if (!global.onSvgClickCounter) {
                    global.onSvgClickCounter = 0;
                }
                global.onSvgClickCounter++;
            }
        }]
    }]
}));

test("Value change on dataGrid row should be fired after clicking on editor (T823431)", async t => {
    const dataGrid = new DataGrid("#container");
    const selectBox = new SelectBox("#otherContainer");

    await t
        .click(dataGrid.getDataCell(0, 0).element)
        .typeText(dataGrid.getDataCell(0, 0).element, "new_value")
        .click(selectBox.dropDownButton)
        .expect(dataGrid.getDataCell(0, 0).element.textContent).eql("new_value");

}).before(() => {
    return Promise.all([
        createWidget("dxDataGrid", {
            dataSource: [{ name: "old_value", value: 1 }],
            editing: {
                mode: "batch",
                allowUpdating: true,
                selectTextOnEditStart: true,
                startEditAction: "click"
            }
        }),
        createWidget("dxSelectBox", {}, false, "#otherContainer")
    ]);
});

test("Async Validation(Cell) - Only the last cell should be switched to edit mode", async t => {
    const dataGrid = new DataGrid("#container");
    const cell0 = dataGrid.getDataCell(0, 0);
    const cell1 = dataGrid.getDataCell(0, 1);
    const cell2 = dataGrid.getDataCell(0, 2);

    await t
        .click(cell0.element)
        .expect(cell0.isValidationPending).ok()
        .click(cell1.element)
        .expect(cell1.isFocused).notOk("the second cell should not be focused")
        .click(cell2.element)
        .expect(cell0.isValidationPending).notOk("validating is completed")
        .expect(cell2.hasHiddenFocusState).notOk()
        .expect(cell2.isFocused).ok("the third cell should be focused");

}).before(() => createWidget("dxDataGrid", {
    errorRowEnabled: true,
    editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true
    },
    commonColumnSettings: {
        allowEditing: true
    },
    columns: [{
        dataField: 'age',
        validationRules: [{
            type: 'async',
            validationCallback: function(params) {
                const d = $.Deferred();
                setTimeout(function() {
                    d.resolve(true);
                }, 1000);
                return d.promise();
            }
        }]
    }, 'name', 'lastName'],
    dataSource: {
        asyncLoadEnabled: false,
        store: [{ name: 'Alex', age: 15, lastName: 'John', }],
        paginate: true
    },
    legacyRendering: false
}));
