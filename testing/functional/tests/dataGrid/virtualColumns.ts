import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import DataGridTestHelper from '../../helpers/dataGrid.test.helper';

fixture`Virtual Columns`
    .page(getContainerFileUrl());

const dataGrid = new DataGridTestHelper("#container");

test("DataGrid should not scroll back to the focused cell after horizontal scrolling if 'columnRenderingMode' is virtual", async t => {
    await t.click(dataGrid.getDataCell(0, 0));
    await dataGrid.scrollTo({ x: 50 });
    await t.expect(await dataGrid.getScrollLeft()).eql(50);
    await dataGrid.scrollTo({ x: 100 });
    await t.expect(await dataGrid.getScrollLeft()).eql(100);
}).before(async () => {
    var generateData = function (rowCount, columnCount) {
        var i, j;
        var items = [];

        for (i = 0; i < rowCount; i++) {
            var item = { };
            for (j = 0; j < columnCount; j++) {
                item["field" + (j + 1)] = (i + 1) + "-" + (j + 1);
            }
            items.push(item);
        }
        return items;
    };
    await createWidget("dxDataGrid", {
        width: 450,
        dataSource: generateData(10, 30),
        columnWidth: 100,
        scrolling: {
            columnRenderingMode: "virtual"
        }
    });
});
