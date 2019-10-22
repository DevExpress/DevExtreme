import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import DataGrid from '../../model/dataGrid';
import SelectBox from '../../model/selectBox';

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


test("Value change on dataGrid row should be fired after clicking on editor (T823431)", async t => {
    const dataGrid = new DataGrid("#container");
    const selectBox = new SelectBox("#otherContainer");

    await t
        .click(dataGrid.getDataCell(0, 0).element)
        .typeText(dataGrid.getDataCell(0, 0).element, "new_value")
        .click(selectBox.getDropDownButton())
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
