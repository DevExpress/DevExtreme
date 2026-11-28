import { test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';

test.describe('HoveringRows', () => {
  test('Hover over rows in the middle', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 3),
      hoverStateEnabled: true,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstRow = dataGrid.getDataRow(10);
    const secondRow = dataGrid.getDataRow(11);

    await firstRow.element.hover();
    await firstRow.expectHovered();

    await secondRow.element.hover();
    await firstRow.expectHovered(false);
    await secondRow.expectHovered();
  });

  test('Hover over first and last rows', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 3),
      hoverStateEnabled: true,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstRow = dataGrid.getDataRow(0);
    const lastRow = dataGrid.getDataRow(19);

    await firstRow.element.hover();
    await firstRow.expectHovered();

    await lastRow.element.hover();
    await firstRow.expectHovered(false);
    await lastRow.expectHovered();
  });
});
