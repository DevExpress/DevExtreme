import Menu from 'devextreme-testcafe-models/menu';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`Menu_keyboard`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('scroll using keyboard', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const menu = new Menu();

  await t
    .click(menu.getItem(0))
    .pressKey('down')
    .pressKey('up')
    .pressKey('right')
    .pressKey('up')
    .wait(600);

  await testScreenshot(t, takeScreenshot, 'Menu scrolling.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [500, 500]).before(async () => {
  const items: any[] = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

  items[98].items = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

  await createWidget('dxMenu', {
    items: [
      {
        text: 'root',
        items,
      },
    ],
    showFirstSubmenuMode: 'onClick',
    hideSubmenuOnMouseLeave: true,
  });
});
