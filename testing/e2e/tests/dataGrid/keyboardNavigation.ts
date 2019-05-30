import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import DataGridTestHelper from '../../helpers/dataGrid.test.helper';

fixture `Keyboard Navigation`
    .page(getContainerFileUrl());

const dataGrid = new DataGridTestHelper("#container");

test("Cell should not highlighted after editing another cell when startEditAction is 'dblClick'", async t => {
    var firstCell = dataGrid.getDataCell(0, 1),
        secondCell = dataGrid.getDataCell(1, 1),
        isEditSecondCell = () => secondCell.find("input").exists,
        checkFocusClass = async (firstCellFocused, secondCellFocused) => {
            var isFirstCellFocused = firstCell.hasClass("dx-focused"),
                isSecondCellFocused = secondCell.hasClass("dx-focused");
            return await t
                .expect(isFirstCellFocused).eql(firstCellFocused)
                .expect(isSecondCellFocused).eql(secondCellFocused);
        }

    await checkFocusClass(false, false);
    await t.doubleClick(secondCell);
    await checkFocusClass(false, true);
    await t.click(firstCell);
    await checkFocusClass(false, false);
    await t.expect(isEditSecondCell()).notOk();
    await t.doubleClick(secondCell)
    await checkFocusClass(false, true);
    await t.click(firstCell);
    await t.expect(firstCell.focused).ok();
    await checkFocusClass(false, false);
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
