import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { employees } from './data.js';

fixture.disablePageReloads`TreeView_selectAll`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

[true, false].forEach((rtlEnabled) => {
  ['selectAll', 'normal', 'none'].forEach((showCheckBoxesMode) => {
    test(`TreeView-selectAll,showCheckBoxesMode=${showCheckBoxesMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const screenshotName = `TreeView selection cbm=${showCheckBoxesMode},rtl=${rtlEnabled}.png`;

      await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container');

      if (!isMaterial()) {
        await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container', false, undefined, 'generic.dark');
        await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container', false, undefined, 'generic.contrast');
      }

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await ClientFunction(() => {
        $('#container').addClass('dx-theme-generic-typography');
      })();

      return createWidget('dxTreeView', {
        items: employees,
        width: 300,
        selectionMode: 'multiple',
        showCheckBoxesMode,
        rtlEnabled,
        itemTemplate(item) {
          return `<div>${item.fullName} (${item.position})</div>`;
        },
      });
    });
  });
});
