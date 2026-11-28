import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import { collectWarnings } from '../../helpers/consoleWarnings';

test.describe('Export', () => {
  test('Warning should be thrown in console if exporting is enabled, but onExporting is not specified', async ({ page }) => {
    const warnings = collectWarnings(page, 'W1024');

    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      export: {
        enabled: true,
      },
    });

    await expect.poll(() => warnings.length).toBeGreaterThan(0);
  });

  ([
    ['export', { enabled: true }],
    ['export.enabled', true],
  ] as const).forEach(([option, value]) => {
    test(`Warning should be thrown in console if exporting is enabled dynamically with '${option}' option, but onExporting is not specified`, async ({ page }) => {
      const warnings = collectWarnings(page, 'W1024');

      await createWidget(page, 'dxDataGrid', {
        dataSource: [],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await dataGrid.option(option, value);

      await expect.poll(() => warnings.length).toBeGreaterThan(0);
    });
  });
});
