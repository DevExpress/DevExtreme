import Splitter from 'devextreme-testcafe-models/splitter';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Splitter_events`
  .page(url(__dirname, '../../container.html'));

test('Panes should not be able to resize when onResizeStart event canceled', async (t) => {
  const splitter = new Splitter('#container');

  await t
    .drag(splitter.resizeHandles.nth(0), 100, 0);

  await t.expect(splitter.option('items[0].size')).eql(200);
  await t.expect(splitter.option('items[1].size')).eql(200);
}).before(async () => createWidget('dxSplitter', {
  width: 408,
  height: 408,
  onResizeStart(e) {
    const { event } = e;
    event.cancel = true;
  },
  dataSource: [{ size: '200px' }, { size: '200px' }],
}));
