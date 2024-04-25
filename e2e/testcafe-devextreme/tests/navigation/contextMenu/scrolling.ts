import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import ContextMenu from 'devextreme-testcafe-models/contextMenu';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`ContextMenu_common`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('ContextMenu items render', async (t) => {
  const contextMenu = new ContextMenu('#contextMenu');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await contextMenu.show();

  await t
    .pressKey('down')
    .pressKey('up')
    .pressKey('right')
    .pressKey('up')
    .wait(600);

  await testScreenshot(t, takeScreenshot, 'ContextMenu scrolling.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [500, 500]).before(async () => {
  await appendElementTo('#container', 'div', 'contextMenu');

  const items: any[] = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

  items[98].items = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

  return createWidget('dxContextMenu', {
    items,
    target: 'body',
  }, '#contextMenu');
});
