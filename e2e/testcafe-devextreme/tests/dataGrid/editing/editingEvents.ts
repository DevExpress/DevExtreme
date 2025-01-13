/* eslint-disable @typescript-eslint/no-misused-promises */
import { ClientFunction, Selector } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { Overlay } from 'devextreme-testcafe-models/dataGrid/overlay';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Editing events`
  .page(url(__dirname, '../../container.html'));

// T1186997
const testCases = [{
  caseName: 'e.cancel = promise:true',
  expected: true,

  onRowUpdating: ClientFunction((e) => {
    e.cancel = new Promise((resolve) => {
      resolve(true);
    });
  }),
  onRowInserting: ClientFunction((e) => {
    e.cancel = new Promise((resolve) => {
      resolve(true);
    });
  }),
  onRowRemoving: ClientFunction((e) => {
    e.cancel = new Promise((resolve) => {
      resolve(true);
    });
  }),
}, {
  caseName: 'e.cancel = true',
  expected: true,

  onRowUpdating: ClientFunction((e) => {
    e.cancel = true;
  }),
  onRowInserting: ClientFunction((e) => {
    e.cancel = true;
  }),
  onRowRemoving: ClientFunction((e) => {
    e.cancel = true;
  }),
}, {
  caseName: 'e.cancel = promise:false',
  expected: false,

  onRowUpdating: ClientFunction((e) => {
    e.cancel = new Promise((resolve) => {
      resolve(false);
    });
  }),
  onRowInserting: ClientFunction((e) => {
    e.cancel = new Promise((resolve) => {
      resolve(false);
    });
  }),
  onRowRemoving: ClientFunction((e) => {
    e.cancel = new Promise((resolve) => {
      resolve(false);
    });
  }),
}, {
  caseName: 'e.cancel = false',
  expected: false,

  onRowUpdating: ClientFunction((e) => {
    e.cancel = false;
  }),
  onRowInserting: ClientFunction((e) => {
    e.cancel = false;
  }),
  onRowRemoving: ClientFunction((e) => {
    e.cancel = false;
  }),
}];

// onRowUpdating
testCases.forEach(({ caseName, expected, onRowUpdating }) => {
  test(`onRowUpdating event should be work valid in case '${caseName}'`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const dataRow = dataGrid.getDataRow(0);

    await t
      .click(dataRow.getDataCell(1).getLinkEdit());

    await t
      .typeText(dataRow.getDataCell(0).getEditor().element, 'test text')
      .click(dataRow.getDataCell(1).getLinkSave());

    await t.expect(dataRow.getDataCell(1).getLinkSave().exists).eql(expected);
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [{
        ID: 1,
        FirstName: 'John',
      }],
      columns: [{
        dataField: 'FirstName',
        caption: 'Firs tName',
      }],
      height: 300,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      onRowUpdating,
    });
  });
});

// onRowInserting
testCases.forEach(({ caseName, expected, onRowInserting }) => {
  test(`onRowInserting event should be work valid in case '${caseName}'`, async (t) => {
    const dataGrid = new DataGrid('#container');

    const addRowButton = dataGrid.getToolbar().getItem();
    await t
      .click(addRowButton);

    const dataRow = dataGrid.getDataRow(0);
    await t
      .typeText(dataRow.getDataCell(0).getEditor().element, 'test text')
      .click(dataRow.getDataCell(1).getLinkSave());

    await t
      .expect(dataRow.getDataCell(0).getEditor().element.exists).eql(expected)
      .expect(dataRow.getDataCell(1).getLinkSave().exists).eql(expected);
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [],
      columns: [{
        dataField: 'FirstName',
        caption: 'Firs tName',
      }],
      height: 300,
      editing: {
        mode: 'row',
        allowAdding: true,
      },
      onRowInserting,
    });
  });
});

// onRowRemoving
testCases.forEach(({ caseName, expected, onRowRemoving }) => {
  test(`onRowRemoving event should be work valid in case '${caseName}'`, async (t) => {
    const dataGrid = new DataGrid('#container');

    await t
      .click(dataGrid.getDataRow(0).getDataCell(1).getLinkDelete());

    await t
      .expect(dataGrid.getDataRow(0).element.exists).eql(expected);
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [{
        ID: 1,
        FirstName: 'John',
      }],
      columns: [{
        dataField: 'FirstName',
        caption: 'Firs tName',
      }],
      height: 300,
      editing: {
        mode: 'row',
        allowDeleting: true,
        confirmDelete: false,
      },
      onRowRemoving,
    });
  });
});

// T1250405
test('DataGrid - Canceled rows are hidden when multiple rows are added in batch mode', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const addBtn = dataGrid.getToolbar().getItem();
  const saveBtn = dataGrid.getToolbar().getItem(1);
  await t.expect(dataGrid.isReady()).ok();
  await t
    .click(addBtn)
    .pressKey('1')
    .click(addBtn)
    .pressKey('2')
    .click(saveBtn);

  const overlay1 = new Overlay(Selector('.dx-overlay-wrapper'), 0);
  const overlay2 = new Overlay(Selector('.dx-overlay-wrapper'), 1);
  const cancelBtn = overlay2.getToolbar(1).getItem(1);
  const saveBtnPopup = overlay1.getToolbar(1).getItem(0);
  await t
    .click(cancelBtn)
    .click(saveBtnPopup);
  await t
    .expect(await takeScreenshot('T1250405-canceled-rows-hidden.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      { ID: 1, Text: 'Item 1' },
    ],
    keyExpr: 'ID',
    columns: ['Text'],
    editing: {
      mode: 'batch',
      allowAdding: true,
    },
    onRowInserting(e: any) {
      e.cancel = new Promise((resolve) => {
        const dialog = (window as any).DevExpress.ui.dialog.confirm(
          'Are you sure?',
          'Confirm changes',
        );
        dialog.done((confirm) => resolve(!confirm));
      });
    },
  });
});
