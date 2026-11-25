import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../models/dataGrid';
import { getData } from '../../dataGrid/helpers/generateDataSourceData';

([
  'cell',
  'batch',
  'row',
  'form',
  'popup',
] as const).forEach((mode) => {
  test(`Embedded editors in ${mode} edit mode should have aria-label attribute`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(3, 2),
      height: 400,
      showBorders: true,
      editing: {
        mode,
        allowUpdating: true,
        allowAdding: true,
      },
      toolbar: {
        items: [
          {
            name: 'addRowButton',
            showText: 'always',
          },
        ],
      },
    });

    const dataGrid = new DataGrid(page, '#container');

    await dataGrid.element.locator('.dx-toolbar .dx-toolbar-item').first().click();

    await a11yCheck(page);
  });
});
