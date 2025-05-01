import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import LoadIndicator from 'devextreme-testcafe-models/loadindicator';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { getFullThemeName, testScreenshot } from '../../helpers/themeUtils';
import { insertStylesheetRulesToPage } from '../../helpers/domUtils';

const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';

fixture.disablePageReloads`LoadIndicator`
  .page(url(__dirname, '../container.html'));

['circle', 'sparkle'].forEach((animationType) => {
  test(`LoadIndicator: start stage of the ${animationType} animation`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const loadIndicator = new LoadIndicator('#container');

    await testScreenshot(t, takeScreenshot, `LoadIndicator with ${animationType} animation.png`, {
      element: '#container',
    });

    const darkTheme = getFullThemeName().replace('light', 'dark');

    await testScreenshot(t, takeScreenshot, `LoadIndicator with ${animationType} animation.png`, {
      element: '#container',
      theme: darkTheme,
      themeChanged: async () => {
        await loadIndicator.repaint();
      },
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await insertStylesheetRulesToPage(`.${LOADINDICATOR_SEGMENT_CLASS} { animation: none !important; }`);

    return createWidget('dxLoadIndicator', {
      width: 128,
      height: 128,
      _animationType: animationType,
    });
  });
});
