import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import { ClientFunction } from 'testcafe';
import DataGridTestHelper from '../../helpers/dataGrid.test.helper';

fixture`Focused Row`
    .page(getContainerFileUrl());

const dataGrid = new DataGridTestHelper("#container");

test("onFocusedRowChanged event should fire once after changing focusedRowKey if paging.enabled = false (T755722)", async t => {
    await t.expect(ClientFunction(() => (window as any).onFocusedRowChangedCounter)()).eql(1);

    await ClientFunction(() => (window as any).widget.option("focusedRowKey", "Ben"))();

    await t.expect(dataGrid.getFocusedRow()).ok();
    await t.expect(ClientFunction(() => (window as any).onFocusedRowChangedCounter)()).eql(2);
}).before(async () => {
    await createWidget("dxDataGrid", {
        dataSource: [
            { name: "Alex", phone: "111111", room: 6 },
            { name: "Dan", phone: "2222222", room: 5 },
            { name: "Ben", phone: "333333", room: 4 }
        ],
        keyExpr: "name",
        focusedRowEnabled: true,
        focusedRowIndex: 1,
        paging: {
            enabled: false
        },
        onFocusedRowChanged: function(e) {
            var global = window as any;
            if(!global.onFocusedRowChangedCounter) {
                global.onFocusedRowChangedCounter = 0;
            }
            global.onFocusedRowChangedCounter++;
        }
    });
});
