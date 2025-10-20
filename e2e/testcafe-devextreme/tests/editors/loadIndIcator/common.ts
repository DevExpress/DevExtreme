import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import LoadIndicator from 'devextreme-testcafe-models/loadindicator';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';

const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';

fixture.disablePageReloads`LoadIndicator`
  .page(url(__dirname, '../../container.html'));

['circle', 'sparkle'].forEach((animationType) => {
  test(`LoadIndicator: start stage of the ${animationType} animation`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const loadIndicator = new LoadIndicator('#container');

    await testScreenshot(t, takeScreenshot, `LoadIndicator with ${animationType} animation.png`, {
      element: '#container',
      themeChanged: async () => {
        await loadIndicator.repaint();
      },
    });

    await testScreenshot(t, takeScreenshot, `LoadIndicator with ${animationType} animation.png`, {
      element: '#container',
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await insertStylesheetRulesToPage(`
      .${LOADINDICATOR_SEGMENT_CLASS},
      .${LOADINDICATOR_CONTENT_CLASS},
      .${LOADINDICATOR_ICON_CLASS},
      .${LOADINDICATOR_SEGMENT_INNER_CLASS} {
        animation: none !important;
        opacity: 1 !important;
      }
    `);

    if (animationType === 'sparkle') {
      await insertStylesheetRulesToPage(`
        .${LOADINDICATOR_SEGMENT_CLASS} {
          transform: scale(1) !important;
        }
      `);
    }

    return createWidget('dxLoadIndicator', {
      width: 128,
      height: 128,
      animationType,
    });
  });
});
