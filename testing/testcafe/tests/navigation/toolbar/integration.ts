import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';

fixture`Toolbar_integration_with_DataGrid`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'material.blue.light'].forEach((theme) => {
  test(`Toolbar button should have the same styles as menu items,theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    await t
      .click(Selector('#container .dx-dropdownmenu-button'))
      .expect(await takeScreenshot(`toolbar-menu,theme=${theme.replace(/\./g, '-')}.png`, '.dx-overlay-content.dx-popup-normal:not(.dx-state-invisible)'))
      .ok()
      .click(Selector('#otherContainer .dx-dropdownmenu-button'))
      .expect(await takeScreenshot(`toolbar-menu-rtl,theme=${theme.replace(/\./g, '-')}.png`, '.dx-overlay-content.dx-popup-normal:not(.dx-state-invisible)'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    const options = {
      dataSource: [],
      keyExpr: 'ID',
      showBorders: true,
      export: {
        enabled: true,
        allowExportSelectedData: true,
      },
      toolbar: {
        items: [
          {
            location: 'before',
            locateInMenu: 'always',
            widget: 'dxButtonGroup',
            options: {
              keyExpr: 'alignment',
              items: [
                { icon: 'alignleft', alignment: 'left', text: 'Align left' },
                { icon: 'aligncenter', alignment: 'center', text: 'Center' },
                { icon: 'alignright', alignment: 'right', text: 'Right' },
                { icon: 'alignjustify', alignment: 'justify', text: 'Justify' },
              ],
            },
          },
          {
            locateInMenu: 'always',
            widget: 'dxButton',
            options: {
              text: 'comment',
              icon: 'comment',
            },
          },
          {
            locateInMenu: 'always',
            widget: 'dxButton',
            options: {
              text: 'comment',
              icon: 'back',
            },
          },
          {
            name: 'exportButton',
            locateInMenu: 'always',
          },
        ],
      },
    };

    await createWidget('dxDataGrid', options, false, '#container');
    await createWidget('dxDataGrid', { rtlEnabled: true, ...options }, false, '#otherContainer');
  }).after(async () => {
    await changeTheme('generic.light');
  });
});
