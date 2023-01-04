import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { screenshotTestFn } from '../../helpers/themeUtils';

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../containerQuill.html'));

const testName = 'ButtonItem';
test(testName, async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await screenshotTestFn(t, takeScreenshot, `${testName}.png`, '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 500,
  items: [
    {
      itemType: 'button',
      buttonOptions: {
        text: 'button1',
      },
    },
  ],
}));
