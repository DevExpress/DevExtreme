import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import PivotGrid from '../../../../models/pivotGrid';

test('Should call \'onExporting\' when export button clicked', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', () => ({
    dataSource: {
      fields: [{
        caption: 'data A',
        dataField: 'data_A',
      }],
      store: [],
    },
    export: {
      enabled: true,
    },
    onExporting() {
      // eslint-disable-next-line no-underscore-dangle
      (window as any).__exportCalled = true;
    },
  }));

  const pivotGrid = new PivotGrid(page, DEFAULT_SELECTOR);

  await pivotGrid.getExportButton().click();

  // eslint-disable-next-line no-underscore-dangle
  const exportCalled = await page.evaluate(() => (window as any).__exportCalled as boolean);

  expect(exportCalled).toBe(true);
});
