import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Ai Column.Visual`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Default render', async (t) => {
  // arrange, act
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await takeScreenshot('datagrid__ai-column__default.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
    },
  ],
}));

['left', 'center', 'right'].forEach((alignment: 'left' | 'center' | 'right') => {
  [false, true].forEach((rtlEnabled: boolean) => {
    test(`AI Column - ${alignment} alignment, RTL ${rtlEnabled}`, async (t) => {
      // arrange, act
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

      await t.expect(dataGrid.isReady()).ok();

      await takeScreenshot(`datagrid__ai-column(alignment=${alignment}_rtlEnabled=${rtlEnabled}).png`, dataGrid.element);

      // assert
      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAiColumn',
          alignment,
        },
      ],
      rtlEnabled,
    }));

    test(`AI Column: DropDownButton Menu - ${alignment} alignment, RTL ${rtlEnabled}`, async (t) => {
      // arrange
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const aiDropDownButton = headerRow.getCommandCell(3).getAIDropDownButton();

      await t.expect(dataGrid.isReady()).ok();

      // act
      await t.click(aiDropDownButton.element);

      // assert
      await t.expect(aiDropDownButton.isOpened()).ok();

      await takeScreenshot(`datagrid__ai-column_dropdown-button-menu(alignment=${alignment}_rtlEnabled=${rtlEnabled}).png`, dataGrid.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAiColumn',
          alignment,
        },
      ],
      rtlEnabled,
    }));
  });
});
