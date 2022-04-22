import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
// import { Item } from '../../../../../js/ui/menu.d';
import { deleteStylesheetRule, insertStylesheetRule } from '../helpers/domUtils';

fixture`Menu_common`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'generic.dark', 'generic.contrast', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'].forEach((theme) => {
  test(`Menu_items,theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click(Selector('.dx-icon-remove'));
    await t.click(Selector('.dx-icon-save'));

    await t
      .expect(await takeScreenshot(`Menu_items,theme=${theme.replace(/\./g, '-')}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);
    await changeTheme(theme);
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
    ] as any[];

    return createWidget('dxMenu', { items: menuItems, cssClass: 'custom-class' });
  }).after(async (t) => {
    await deleteStylesheetRule(0);
    await restoreBrowserSize(t);
    await changeTheme('generic.light');
  });
});
