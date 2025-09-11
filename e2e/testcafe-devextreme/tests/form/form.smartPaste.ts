import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Form from 'devextreme-testcafe-models/form/form';
import { testScreenshot } from '../../helpers/themeUtils';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage } from '../../helpers/domUtils';

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../container.html'));

const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';

test('Showing loader after calling smart paste', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const baseScreenshotName = 'Form Smart Paste';
  const loadingScreenshotSuffix = 'loading';
  const screenshotName = `${baseScreenshotName}.png`;
  const loadingScreenshotName = `${baseScreenshotName} ${loadingScreenshotSuffix}.png`;

  await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container' });

  const form = new Form('#form');
  await form.smartPaste();

  await testScreenshot(t, takeScreenshot, loadingScreenshotName, { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'form');
  await insertStylesheetRulesToPage(`
    .${LOADINDICATOR_SEGMENT_CLASS},
    .${LOADINDICATOR_CONTENT_CLASS},
    .${LOADINDICATOR_ICON_CLASS},
    .${LOADINDICATOR_SEGMENT_INNER_CLASS} {
      animation: none !important;
      opacity: 1 !important;
    }
  `);
  await insertStylesheetRulesToPage(`
    .${LOADINDICATOR_SEGMENT_CLASS} {
      transform: scale(1) !important;
    }
  `);
  await createWidget('dxForm', {
    height: 400,
    width: 1000,
    aiIntegration: {
      smartPaste: () => () => new Promise(() => {}),
    },
    formData: {},
    items: [
      { dataField: 'firstName' },
      { dataField: 'lastName' },
      { itemType: 'button', name: 'smartPaste' },
    ],
  }, '#form');
});
