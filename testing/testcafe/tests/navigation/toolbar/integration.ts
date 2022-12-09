import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import Toolbar from '../../../model/toolbar/toolbar';

fixture.disablePageReloads`Toolbar_integration_with_DataGrid`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

[true, false].forEach((rtlEnabled) => {
  test(`Toolbar button should have the same styles as menu items,rtlEnabled=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container .dx-toolbar');

    await t
      .click(toolbar.getOverflowMenu().element);

    await takeScreenshotInTheme(t, takeScreenshot, `toolbar-menu${rtlEnabled ? '-rtl' : ''}.png`, toolbar.getOverflowMenu().getPopup().getContent());

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
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
            location: 'before',
            locateInMenu: 'always',
            cssClass: 'dx-toolbar-hidden-button-group',
            template() {
              return ($('<div>') as any).dxButtonGroup({
                items: [
                  { icon: 'alignleft', alignment: 'left', text: 'Align left' },
                  { icon: 'aligncenter', alignment: 'center', text: 'Center' },
                  { icon: 'alignright', alignment: 'right', text: 'Right' },
                  { icon: 'alignjustify', alignment: 'justify', text: 'Justify' },
                ],
                keyExpr: 'alignment',
                stylingMode: 'outlined',
                selectedItemKeys: ['left'],
              });
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
  });
});
