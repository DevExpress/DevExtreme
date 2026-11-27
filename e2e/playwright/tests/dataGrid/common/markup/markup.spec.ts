import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

test.describe('Icon Sizes', () => {
  test('Load panel should support string height and width', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      columns: [
        'field1', 'field2', 'field3',
      ],
      width: 700,
      loadPanel: {
        enabled: true,
        height: '400px',
        width: '330px',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await dataGrid.apiBeginCustomLoading('test');

    await expect(dataGrid.getLoadPanel().getContent()).toHaveCSS('height', '400px');
    await expect(dataGrid.getLoadPanel().getContent()).toHaveCSS('width', '330px');
  });
});
