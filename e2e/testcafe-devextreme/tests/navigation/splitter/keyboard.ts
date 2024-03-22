import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import Splitter from '../../../model/splitter';

fixture.disablePageReloads`Splitter_keyboard`
  .page(url(__dirname, '../../container.html'));

test('The next resize handle should be focused after tab press', async (t) => {
  const splitter = new Splitter('#container');

  await t
    .click(splitter.resizeHandles.nth(0));

  await t
    .expect(splitter.getResizeHandle(0).isFocused)
    .ok()
    .expect(splitter.getResizeHandle(1).isFocused)
    .notOk();

  await t
    .pressKey('tab');

  await t
    .expect(splitter.getResizeHandle(0).isFocused)
    .notOk()
    .expect(splitter.getResizeHandle(1).isFocused)
    .ok();
}).before(async () => createWidget('dxSplitter', {
  width: 400,
  height: 400,
  dataSource: [
    { text: 'Pane_1' },
    { text: 'Pane_2' },
    { text: 'Pane_2' },
  ],
}));

test('The previous resize handle should be focused after shift+tab press', async (t) => {
  const splitter = new Splitter('#container');

  await t
    .click(splitter.resizeHandles.nth(1));

  await t
    .expect(splitter.getResizeHandle(1).isFocused)
    .ok()
    .expect(splitter.getResizeHandle(0).isFocused)
    .notOk();

  await t
    .pressKey('shift+tab');

  await t
    .expect(splitter.getResizeHandle(1).isFocused)
    .notOk()
    .expect(splitter.getResizeHandle(0).isFocused)
    .ok();
}).before(async () => createWidget('dxSplitter', {
  width: 400,
  height: 400,
  dataSource: [
    { text: 'Pane_1' },
    { text: 'Pane_2' },
    { text: 'Pane_2' },
  ],
}));
