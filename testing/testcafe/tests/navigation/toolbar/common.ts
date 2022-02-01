import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { Item } from '../../../../../js/ui/toolbar.d';

fixture`Toolbar_common`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'].forEach((theme) => {
  const supportedWidgets = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

  (['always', 'never'] as any[]).forEach((locateInMenu) => {
    test(`Default nested widgets render,theme=${theme},items[].locateInMenu=${locateInMenu}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      await changeTheme(theme);

      if (locateInMenu === 'always') {
        await ClientFunction(() => {
          $('.dx-toolbar .dx-dropdownmenu-button').click();
        }, { dependencies: { } })();

        await ClientFunction(() => {
          $('.dx-dropdownmenu-popup .dx-overlay-content').css({ backgroundColor: 'gold' });
        }, { dependencies: { } })();

        await t
          .expect(await takeScreenshot(`Default-nested-widgets-render-in-toolbarmenu,theme=${theme},items[]locateInMenu=${locateInMenu}.png`, Selector('.dx-dropdownmenu-popup .dx-overlay-content')))
          .ok()
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      } else {
        await t
          .expect(await takeScreenshot(`Default-nested-widgets-render-in-toolbar,theme=${theme},items[]locateInMenu=${locateInMenu}.png`, Selector('#container')))
          .ok()
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }
    }).before(async () => {
      const toolbarItems = [] as Item[];
      (supportedWidgets as any[]).forEach((widgetName) => {
        toolbarItems.push({
          location: 'before',
          locateInMenu,
          widget: widgetName,
          options: {
            text: 1,
            items: [{ text: 1 }, { text: 2 }, { text: 3 }],
          },
        });
      });

      await ClientFunction(() => {
        $('#container').css({ backgroundColor: 'gold' });
      }, { dependencies: { } })();

      return createWidget('dxToolbar', {
        items: toolbarItems,
      });
    });
  });
});
