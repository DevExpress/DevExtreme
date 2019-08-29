import { pathToFileURL } from 'url';
import { join } from  'path';
import { createWidget } from '../../helpers/testHelper';
import { ClientFunction } from 'testcafe';
import DataGrid from '../../model/dataGrid';

fixture `Editing`
    .page(pathToFileURL(join(__dirname, '../container.html')).href);

test("onFocusedRowChanged event should fire once after changing focusedRowKey if paging.enabled = false (T755722)", async t => {
    const dataGrid = new DataGrid("#container");

    await t
        .expect(ClientFunction(() => (window as any).onFocusedRowChangedCounter)()).eql(1);

    await ClientFunction(() => (window as any).widget.option("focusedRowKey", "Ben"))();

    await t
        .expect(dataGrid.getFocusedRow().exists).ok()
        .expect(ClientFunction(() => (window as any).onFocusedRowChangedCounter)()).eql(2);
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
            const global = window as any;
            if(!global.onFocusedRowChangedCounter) {
                global.onFocusedRowChangedCounter = 0;
            }
            global.onFocusedRowChangedCounter++;
        }
    });
});
