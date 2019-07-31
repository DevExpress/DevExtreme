import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import { ClientFunction } from 'testcafe';
import { DataGridKeyboardTestHelper } from '../../helpers/dataGrid.test.helper';

fixture`Editing`
    .page(getContainerFileUrl());

const dataGrid = new DataGridKeyboardTestHelper("#container");

test("Tab key on editor should focus next cell if editing mode is cell", async t => {
    await t.click(dataGrid.getDataCell(0, 1));
    await t.pressKey("1");
    await t.pressKey("tab");
    await t.expect(dataGrid.cellHasFocusClass(1, 1)).ok();

}).before(async () => {
    await createWidget("dxDataGrid", {
        dataSource: [{ name: "AaAaA", value: 1 }, { name: "aAaAa", value: 2 }],
        editing: {
            mode: "cell",
            allowUpdating: true
        },
        columns: [{ dataField: "name", allowEditing: false }, { dataField: "value", showEditorAlways: true }]
    });
});
