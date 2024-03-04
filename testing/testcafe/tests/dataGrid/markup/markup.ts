import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';

fixture.disablePageReloads`Icon Sizes`
  .page(url(__dirname, '../../container.html'));

test('Load panel should support string height and width', async (t) => {
  const dataGrid = new DataGrid('#container');
  await dataGrid.apiBeginCustomLoading('test');

  await t
    .expect(dataGrid.getLoadPanel().content.getStyleProperty('height'))
    .eql('400px')
    .expect(dataGrid.getLoadPanel().content.getStyleProperty('width'))
    .eql('330px');
}).before(async () => createWidget('dxDataGrid', {
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
}));
