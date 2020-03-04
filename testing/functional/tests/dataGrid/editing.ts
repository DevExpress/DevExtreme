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

    await ClientFunction(() => {
        const editingController = (window as any).widget.getController("editing") as any;
        const baseEditCellCore = editingController._editCellCore.bind(editingController);
        editingController._editCellCore = function(rowIndex, columnIndex) {
            (window as any).callInfo.push(columnIndex);
            baseEditCellCore(rowIndex, columnIndex);
        };
    })();


    await t.click(dataGrid.getDataCell(0, 0).element);

    await ClientFunction(() => {
        const gridInstance = (window as any).widget;
        const validatingController = gridInstance.getController("validating");
        (window as any).result = validatingController.getCellValidationResult({ rowKey: gridInstance.getKeyByRowIndex(0), columnIndex: 0 });
    })();

    await t
        .click(dataGrid.getDataCell(0, 1).element)
        .click(dataGrid.getDataCell(0, 2).element);


    const callInfo = await ClientFunction(() => (window as any).callInfo)();

    await ClientFunction(() => (window as any).result.complete)();

    await t
        .expect(callInfo.length).eql(2, "_editCellCore should be called twice")
        .expect(callInfo[callInfo.length - 1]).eql(2, "_editCellCore is called last time for the third column")
        .expect(dataGrid.element.find(".dx-editor-cell").length).eql(1, "only one cell is in editing mode")
        .expect(dataGrid.getDataCell(0, 2).element.hasClass("dx-editor-cell")).ok("the third cell in the first row is in editing mode");

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
                }, 10);
                return d.promise();
            }
        }]
    }, 'name', 'lastName'],
    dataSource: {
        asyncLoadEnabled: false,
        store: [{ name: 'Alex', age: 15, lastName: 'John', }],
        paginate: true
    },
    legacyRendering: false,
    onInitialized: () => {
        (window as any).callInfo = [];
    }
}));
