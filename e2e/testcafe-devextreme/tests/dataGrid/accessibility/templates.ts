import { a11yCheck } from '../../../helpers/accessibility/utils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

fixture`Templates tests with axe`
  .page(url(__dirname, '../../container.html'));

test('Accessibility: DataGrid with dataRowTemplate', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  await a11yCheck(t);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [...new Array(10)].map((_, i) => ({
    ID: i + 1,
    CompanyName: `company name ${i + 1}`,
    City: `city ${i + 1}`,
    Notes: `test ${i + 1}`,
  })),
  keyExpr: 'ID',
  columns: ['ID', 'CompanyName', 'City'],
  dataRowTemplate(container, { data }) {
    const markup = '<tr class=\'main-row\'>'
          + `<td>${data.ID}</td>`
          + `<td>${data.CompanyName}</td>`
          + `<td>${data.City}</td>`
      + '</tr>'
      + '<tr class=\'notes-row\'>'
          + `<td colspan='3'><div>${data.Notes}</div></td>`
      + '</tr>';

    container.append(markup);
  },
  rowAlternationEnabled: true,
  columnAutoWidth: true,
  showBorders: true,
}));
