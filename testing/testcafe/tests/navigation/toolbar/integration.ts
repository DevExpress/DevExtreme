import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import Toolbar from '../../../model/toolbar/toolbar';

fixture`Toolbar_integration_with_DataGrid`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'material.blue.light'].forEach((theme) => {
  [true, false].forEach((rtlEnabled) => {
    test(`Toolbar button should have the same styles as menu items,rtlEnabled=${rtlEnabled},theme=${theme}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const toolbar = new Toolbar('#container .dx-toolbar');

      await t
        .click(toolbar.getOverflowMenu().element)
        .expect(await takeScreenshot(`toolbar-menu${rtlEnabled ? '-rtl' : ''},theme=${theme.replace(/\./g, '-')}.png`, toolbar.getOverflowMenu().getPopup().getContent()))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);

      const options = {
        rtlEnabled,
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
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});
