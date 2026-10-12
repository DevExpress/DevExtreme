import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture`Ai Column.Adaptivity`
  .page(url(__dirname, '../../../container-ai-integration.html'));

const DATA_GRID_SELECTOR = '#container';

test('The AI column should not hidden when columnHidingEnabled is true', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  const thirdHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);
  const fourthHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  // assert: the AI column is hidden
  await t
    .expect(fourthHeaderCell.element.textContent)
    .eql('AI Column')
    .expect(fourthHeaderCell.isHidden)
    .notOk();

  // assert: the adaptive button is visible
  await t
    .expect(thirdHeaderCell.isHidden)
    .ok()
    .expect(dataGrid.getDataRow(0).getCommandCell(4).getAdaptiveButton().visible)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  width: 390,
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
