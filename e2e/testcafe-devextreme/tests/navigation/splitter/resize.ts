import Splitter from 'devextreme-testcafe-models/splitter';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { clearTestPage } from '../../../helpers/clearPage';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`Splitter_integration`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

safeSizeTest('non resizable pane should not change its size during resize', async (t) => {
  const splitter = new Splitter('#container');

  await t
    .expect(splitter.getItem(2).element.clientWidth)
    .eql(300);

  await t.resizeWindow(400, 400);

  await t
    .expect(splitter.getItem(2).element.clientWidth)
    .eql(145);
}, [800, 800]).before(async () => createWidget('dxSplitter', {
  width: '100%',
  height: 300,
  dataSource: [{
    text: 'Pane_1',
  }, {
    text: 'Pane_1',
  }, {
    text: 'Pane_3',
    size: '300px',
    resizable: false,
  }],
}));
