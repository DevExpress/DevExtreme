import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

test.describe('Adaptivity.Functional', () => {
  test.use({ browserSize: [400, 400] });

  test('Should be shown and hidden when the window is resized', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Head_ID: -1,
        Full_Name: 'John Heart',
        Prefix: 'Mr.',
        Title: 'CEO',
        City: 'Los Angeles',
        State: 'California',
        Email: 'jheart@dx-email.com',
        Skype: 'jheart_DX_skype',
        Mobile_Phone: '(213) 555-9392',
        Birth_Date: '1964-03-16',
        Hire_Date: '1995-01-15',
      }],
      keyExpr: 'ID',
      allowColumnResizing: true,
      rowDragging: {
        allowDropInsideItem: true,
        allowReordering: true,
      },
      columns: [
        {
          dataField: 'Title',
          caption: 'Position',
          hidingPriority: 0,
          fixed: true,
        },
        { dataField: 'Full_Name', hidingPriority: 1 },
        { dataField: 'City', hidingPriority: 2 },
        { dataField: 'State', hidingPriority: 3 },
        { dataField: 'Mobile_Phone', hidingPriority: 4 },
        { dataField: 'Hire_Date', dataType: 'date', hidingPriority: 5 },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const adaptiveButton = dataGrid.getAdaptiveButton(0);
    await expect(adaptiveButton).toBeAttached();
    await adaptiveButton.click();

    await expect(dataGrid.getAdaptiveRow(0).element).toBeAttached();

    await page.setViewportSize({ width: 1200, height: 400 });

    await expect.poll(() => dataGrid.isAdaptiveColumnHidden()).toBe(true);
    await expect(dataGrid.getAdaptiveRow(0).element).not.toBeAttached();
  });
});
