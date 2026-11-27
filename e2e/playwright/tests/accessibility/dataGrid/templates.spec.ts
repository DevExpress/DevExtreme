import { expect, test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../models/dataGrid';

test('DataGrid with dataRowTemplate', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', () => ({
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

  const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

  await expect.poll(() => dataGrid.isReady()).toBe(true);

  await a11yCheck(page);
});
