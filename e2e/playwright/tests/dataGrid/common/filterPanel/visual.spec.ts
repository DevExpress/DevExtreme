import { test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

test.describe('filterPanel', () => {
  // T1182854
  test('editor\'s popup inside filterBuilder is opening & closing right (T1182854)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ column1: 'first' }],
      columns: ['column1'],
      filterValue: ['column1', 'anyof', []],
      filterPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    const filterBuilder = (
      await dataGrid.getFilterPanel().openFilterBuilderPopup()
    ).getFilterBuilder();

    await testScreenshot(page, 'dataGrid-filterPanel-popup-focused.png');

    await filterBuilder.getField().getValueText().click();
    await testScreenshot(page, 'dataGrid-filterPanel-popup.-with-editor-popup.png');

    await filterBuilder.getField().getValueText().click();
    await testScreenshot(page, 'dataGrid-filterPanel-popup.png');

    await filterBuilder.getField().getValueText().click();
    await testScreenshot(page, 'dataGrid-filterPanel-popup.-with-editor-popup.png');
  });
});
