import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import DataGrid from '../../model/dataGrid';

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
