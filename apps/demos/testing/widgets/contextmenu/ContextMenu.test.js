import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture.skip('ContextMenu.Templates')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

const IMAGE_ID = 'image';

runManualTest('ContextMenu', 'Templates', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Custom Template Appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.rightClick(`#${IMAGE_ID}`);

    await testScreenshot(t, takeScreenshot, 'ccontext_menu_templates_custom_appearance.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
