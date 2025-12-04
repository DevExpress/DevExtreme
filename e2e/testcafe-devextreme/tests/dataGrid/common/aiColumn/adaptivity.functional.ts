import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Ai Column.Adaptivity`
  .page(url(__dirname, './pages/containerWithAIIntegration.html'));

const DATA_GRID_SELECTOR = '#container';

test('The AI column should be hidden when columnHidingEnabled is true', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const fourthHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  // assert: the AI column is hidden
  await t
    .expect(fourthHeaderCell.element.textContent).eql('AI Column')
    .expect(fourthHeaderCell.isHidden).ok();

  // assert: the adaptive button is visible
  await t
    .expect(dataGrid.getDataRow(0).getCommandCell(4).getAdaptiveButton().visible).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  width: 350,
  columnWidth: 100,
  columnHidingEnabled: true,
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
    },
  ],
}));

test('The AI column should be hidden when hidingPriority is set for it', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  // assert: the AI column is hidden
  await t
    .expect(firstHeaderCell.element.textContent).eql('AI Column')
    .expect(firstHeaderCell.isHidden).ok();

  // assert: the adaptive button is visible
  await t
    .expect(dataGrid.getDataRow(0).getCommandCell(4).getAdaptiveButton().visible).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  width: 350,
  columnWidth: 100,
  columns: [
    {
      type: 'ai',
      caption: 'AI Column',
      hidingPriority: 0,
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The AI column should not be hidden when there is a second AI column with a hidingPriority set', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
  const secondHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  // assert: the first AI column is hidden
  await t
    .expect(firstHeaderCell.element.textContent).eql('AI Column 1')
    .expect(firstHeaderCell.isHidden).ok();

  // assert: the second AI column is visible
  await t
    .expect(secondHeaderCell.element.textContent).eql('AI Column 2')
    .expect(secondHeaderCell.isHidden).notOk();

  // assert: the adaptive button is visible
  await t
    .expect(dataGrid.getDataRow(0).getCommandCell(5).getAdaptiveButton().visible).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  width: 350,
  columnWidth: 100,
  columns: [
    {
      type: 'ai',
      name: 'aiColumn1',
      caption: 'AI Column 1',
      hidingPriority: 0,
    },
    {
      type: 'ai',
      name: 'aiColumn2',
      caption: 'AI Column 2',
    },
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
  ],
}));

test('The AI column should have value in the adaptive detail row', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  await dataGrid.isReady();

  const adaptiveButton = dataGrid.getAdaptiveButton();

  await t.expect(adaptiveButton.exists).ok();

  await t.click(adaptiveButton);

  const adaptiveRow = dataGrid.getAdaptiveRow(0);

  await t.expect(adaptiveRow.element.exists).ok();

  const aiFormItem = adaptiveRow.element.find('.dx-field-item').withText('AI Column');

  await t.expect(aiFormItem.exists).ok();

  const aiFormItemValue = aiFormItem.find('.dx-field-item-content');

  await t.expect(aiFormItemValue.textContent).contains('Response 1');
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  // eslint-disable-next-line new-cap
  aiIntegration: new (window as any).DevExpress.aiIntegration({
    sendRequest({ data }) {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      const obj = {};
      Object.entries(data?.data).forEach(([key, value]) => {
        obj[key] = `Response ${(value as any).id}`;
      });
      const promise = new Promise((resolve) => {
        timeoutId = setTimeout(() => {
          resolve(JSON.stringify(obj));
        }, 1000);
      });

      const result = {
        promise,
        abort: () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        },
      };

      return result;
    },
  }),
  width: 400,
  columnHidingEnabled: true,
  showBorders: true,
  columns: [
    {
      dataField: 'id', caption: 'ID', width: 150, hidingPriority: 3,
    },
    {
      dataField: 'name', caption: 'Name', width: 150, hidingPriority: 2,
    },
    {
      dataField: 'value', caption: 'Value', width: 100, hidingPriority: 1,
    },
    {
      name: 'AIcolumn',
      caption: 'AI Column',
      type: 'ai',
      ai: {
        prompt: 'Send me nothing',
        mode: 'auto',
      },
      width: 200,
      hidingPriority: 0,
    },
  ],
})));
