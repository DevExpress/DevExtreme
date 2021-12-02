import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';

fixture`ToolbarMenu`
  .page(url(__dirname, './pages/t1041502.html'));

test('Toolbar button should have the same styles as menu items', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .click(Selector('#gridContainer1 .dx-dropdownmenu-button'))
    .expect(await takeScreenshot('toolbar-menu.png', '.dx-overlay-content.dx-popup-normal:not(.dx-state-invisible)'))
    .ok()
    .click(Selector('#gridContainer2 .dx-dropdownmenu-button'))
    .expect(await takeScreenshot('toolbar-menu-rtl.png', '.dx-overlay-content.dx-popup-normal:not(.dx-state-invisible)'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
