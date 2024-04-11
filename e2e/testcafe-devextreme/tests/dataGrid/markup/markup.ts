import url from '../../../helpers/getPageUrl';
import { createWidget, disposeWidgets } from '../../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

import { clearTestPage } from '../../../helpers/clearPage';

fixture.disablePageReloads`Icon Sizes`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {await disposeWidgets(); await clearTestPage()});


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
