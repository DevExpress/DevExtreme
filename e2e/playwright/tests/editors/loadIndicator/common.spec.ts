import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';

const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';

test.describe('LoadIndicator', () => {
  ['circle', 'sparkle'].forEach((animationType) => {
    test(`LoadIndicator: start stage of the ${animationType} animation`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, `
        .${LOADINDICATOR_SEGMENT_CLASS},
        .${LOADINDICATOR_CONTENT_CLASS},
        .${LOADINDICATOR_ICON_CLASS},
        .${LOADINDICATOR_SEGMENT_INNER_CLASS} {
          animation: none !important;
          opacity: 1 !important;
        }
      `);

      if (animationType === 'sparkle') {
        await insertStylesheetRulesToPage(page, `
          .${LOADINDICATOR_SEGMENT_CLASS} {
            transform: scale(1) !important;
          }
        `);
      }

      await createWidget(page, 'dxLoadIndicator', {
        width: 128,
        height: 128,
        animationType,
      });

      await testScreenshot(page, `LoadIndicator with ${animationType} animation.png`, {
        element: '#container',
      });
    });
  });
});
