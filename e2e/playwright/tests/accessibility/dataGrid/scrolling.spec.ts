import { expect, test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../models/dataGrid';
import { getData } from '../../dataGrid/helpers/generateDataSourceData';

test('Infinite scrolling', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(1000, 2),
    height: 400,
    showBorders: true,
    scrolling: {
      mode: 'infinite',
    },
  });

  const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

  await expect.poll(() => dataGrid.isReady()).toBe(true);

  await a11yCheck(page);
});

test('Horizontal Virtual Scrolling', async ({ page }) => {
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(20, 100),
    columnWidth: 100,
    height: 400,
    width: 900,
    showBorders: true,
    scrolling: {
      columnRenderingMode: 'virtual',
    },
  });

  const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

  await expect.poll(() => dataGrid.isReady()).toBe(true);

  await a11yCheck(page);
});
