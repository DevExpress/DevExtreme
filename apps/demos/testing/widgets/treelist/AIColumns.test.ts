import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';
import { widgetsGalleryServiceMock } from '../../apiMocks/widgetsGalleryServiceMock';

fixture('TreeList.AIColumns')
  .requestHooks(widgetsGalleryServiceMock)
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('TreeList', 'AIColumns', (test) => {
  test('AIColumns', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect($('.dx-command-ai').withText('Management').exists)
      .ok()
      .click($('.dx-page').withText('2'))
      .expect($('.dx-command-ai').withText('Sales').exists)
      .ok()
      .expect($('.dx-loadpanel-content').visible)
      .notOk();

    await testScreenshot(t, takeScreenshot, 'treelist_ai_columns_salaried_status_desktop.png', '.status--salaried');

    await testScreenshot(t, takeScreenshot, 'treelist_ai_columns_commission_status_desktop.png', '.status--commission');

    await testScreenshot(t, takeScreenshot, 'treelist_ai_columns_terminated_status_desktop.png', '.status--terminated');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
