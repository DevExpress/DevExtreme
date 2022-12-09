import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme, isMaterial } from '../../../helpers/themeUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import { Item } from '../../../../../js/ui/menu.d';
import { deleteStylesheetRule, insertStylesheetRule } from '../helpers/domUtils';

fixture.disablePageReloads`Menu_common`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

['generic.light', 'generic.dark', 'generic.contrast', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'].forEach((theme) => {
  safeSizeTest(`Menu_items,theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click(Selector('.dx-icon-remove'));
    await t.click(Selector('.dx-icon-save'));

    await takeScreenshotInTheme(t, takeScreenshot, 'Menu render items.png');

    if (!isMaterial()) {
      await takeScreenshotInTheme(t, takeScreenshot, 'Menu render items.png', undefined, false, undefined, 'generic.dark');
      await takeScreenshotInTheme(t, takeScreenshot, 'Menu render items.png', undefined, false, undefined, 'generic.contrast');
    }

    await deleteStylesheetRule(0);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);
    await insertStylesheetRule('.custom-class { border: 2px solid green !important }', 0);

    const menuItems = [
      {
        text: 'remove',
        icon: 'remove',
        items: [
          { text: 'user', icon: 'user' },
          {
            text: 'save',
            icon: 'save',
            items: [
              { text: 'export', icon: 'export' },
              { text: 'edit', icon: 'edit' },
            ],
          },
        ],
      },
      { text: 'user', icon: 'user' },
      { text: 'coffee', icon: 'coffee' },
    ] as Item[];

    return createWidget('dxMenu', { items: menuItems, cssClass: 'custom-class' });
  });
});
