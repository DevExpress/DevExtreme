import { ClientFunction } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from '../../../model/dataGrid';

fixture`Editing events`
  .page(url(__dirname, '../../container.html'));

// T1186997

// onRowUpdating
[{
  caseName: 'e.cancel = promise:true',
  expected: true,
  onRowUpdating: ClientFunction((e) => {
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
}, {
  caseName: 'e.cancel = promise:false',
  expected: false,
  onRowUpdating: ClientFunction((e) => {
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
}].forEach(({ caseName, expected, onRowUpdating }) => {
  test(`onRowUpdating event should be work valid in case '${caseName}'`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const dataRow = dataGrid.getDataRow(0);

    await t.click(dataRow.getDataCell(1).getLinkEdit());

    await t
      .typeText(dataRow.getDataCell(0).getEditor().element, 'test text')
      .click(dataRow.getDataCell(1).getLinkSave());

    await t.expect(dataRow.getDataCell(1).getLinkSave().exists).eql(expected);
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [{
        ID: 1,
        FirstName: 'John',
      },
      ],
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
