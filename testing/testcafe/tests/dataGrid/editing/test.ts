import { ClientFunction } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from '../../../model/dataGrid';

fixture`Test name`
  .page(url(__dirname, '../../container.html'));

// T1186997

[{
  name: 't1',
  expected: true,
  onRowUpdating: ClientFunction((e) => {
    e.cancel = new Promise((resolve) => {
      resolve(true);
    });
  }),
}, {
  name: 't2',
  expected: true,
  onRowUpdating: ClientFunction((e) => {
    e.cancel = true;
  }),
}].forEach(({ name, expected, onRowUpdating }) => {
  test(`test5 ${name}`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const dataRow = dataGrid.getDataRow(0);

    await t.click(dataRow.getDataCell(1).getLinkEdit());

    await t
      .typeText(dataRow.getDataCell(0).getEditor().element, 'test text')
      .click(dataRow.getDataCell(1).getLinkSave());

    await t.expect(dataRow.getDataCell(1).getLinkSave().exists).eql(expected);
  }).before(async () => {
    await createWidget('dxDataGrid', () => ({
      dataSource: [{
        ID: 1,
        FirstName: 'John',
      },
      ],
      columns: [{
        dataField: 'FirstName',
        caption: 'Firs tName',
      }],
      height: 400,
      editing: {
        mode: 'row',
        allowUpdating: true,
        // allowDeleting: true,
        // allowAdding: true,
      },
      onRowUpdating,
    }));
  });
});
