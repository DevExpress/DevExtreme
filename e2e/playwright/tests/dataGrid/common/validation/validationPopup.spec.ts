import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { scrollIntoView } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';

// TestCafe's maximizeWindow gives a headless browser a 1920x1080 window.
const MAXIMIZED_WINDOW_SIZE = { width: 1920, height: 1080 };

test.describe('Validation', () => {
  test('Validation popup screenshot', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      columns: [{
        dataField: 'field_0',
        validationRules: [{ type: 'required' }],
      }, {
        dataField: 'field_1',
        validationRules: [{ type: 'required' }],
      }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);
    await dataGrid.getDataCell(0, 0).element.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');

    // act
    await testScreenshot(page, 'validation-popup.png', { element: dataGrid.element });

    // assert
    await expect(dataGrid.getRevertTooltip().first()).toBeAttached();
    await expect(dataGrid.getInvalidMessageTooltip().first()).toBeAttached();
  });

  test('Validation popup with open master detail', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      columns: [{
        dataField: 'field_0',
        validationRules: [{ type: 'required' }],
      }, {
        dataField: 'field_1',
        validationRules: [{ type: 'required' }],
      }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      masterDetail: { enabled: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);
    // The screenshots show the grid scrolled where TestCafe's clicks left it.
    await scrollIntoView(dataGrid.getDataRow(5).getCommandCell(0).element);
    await dataGrid.getDataRow(5).getCommandCell(0).element.click();
    await scrollIntoView(dataGrid.getDataCell(5, 2).element);
    await dataGrid.getDataCell(5, 2).element.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');

    // act
    await testScreenshot(page, 'validation-popup_master-detail.png', { element: dataGrid.element });
    await dataGrid.scrollTo({ top: 150 });
    await testScreenshot(page, 'validation-popup_master-detail_after-scroll.png', { element: dataGrid.element });

    // assert
    await expect(dataGrid.getRevertTooltip().first()).toBeAttached();
    await expect(dataGrid.getInvalidMessageTooltip().first()).toBeAttached();

    await dataGrid.scrollTo({ top: 0 });
  });

  test('Validation popup with open master detail and fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [{
        dataField: 'field_0',
        validationRules: [{ type: 'required' }],
        fixed: true,
      }, {
        dataField: 'field_1',
        validationRules: [{ type: 'required' }],
      }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      masterDetail: { enabled: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await page.setViewportSize(MAXIMIZED_WINDOW_SIZE);
    // The screenshots show the grid scrolled where TestCafe's clicks left it.
    await scrollIntoView(dataGrid.getFixedDataRow(5).getCommandCell(0).element);
    await dataGrid.getFixedDataRow(5).getCommandCell(0).element.click();
    await scrollIntoView(dataGrid.getDataCell(5, 2).element);
    await dataGrid.getDataCell(5, 2).element.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');

    await expect(dataGrid.getRevertTooltip().first()).toBeAttached();
    await expect(dataGrid.getInvalidMessageTooltip().first()).toBeAttached();

    // act
    await testScreenshot(page, 'validation-popup_master-detail_fixed-column.png', { element: dataGrid.element });
    await dataGrid.scrollTo({ top: 150 });
    await testScreenshot(page, 'validation-popup_master-detail_fixed-column_after-scroll.png', { element: dataGrid.element });

    // assert
    await expect(dataGrid.getRevertTooltip().first()).toBeAttached();
    await expect(dataGrid.getInvalidMessageTooltip().first()).toBeAttached();

    await dataGrid.scrollTo({ top: 0 });
  });
});
