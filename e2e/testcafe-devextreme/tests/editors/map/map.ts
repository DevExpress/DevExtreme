import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Map`
  .page(url(__dirname, '../../container.html'));

// javaScript error occurred during test execution
test.skip('Map should not raise errors when it is disposed immediately after creating (T914315)', async (t) => {
  const $editButton = Selector('.dx-command-edit').child();

  await t
    .click($editButton)
    .wait(1000)
    .expect(true).ok();

  await t.eval(() => location.reload());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{
    ID: 1,
    Map: 'test',
    Position: 'CEO',
  }],
  keyExpr: 'ID',
  onEditingStart(e) {
    const index = e.component.getRowIndexByKey(e.key);
    setTimeout(() => {
      e.component.cellValue(index, 'Position', 'test1');
    }, 100);
  },
  editing: {
    mode: 'popup',
    allowUpdating: true,
  },
  columns: [{
    dataField: 'Map',
    editCellTemplate(container) {
      ($('<div/>') as any).dxMap({
        provider: 'google',
        type: 'satellite',
      }).appendTo(container);
    },
  },
  'Position',
  ],
}));
