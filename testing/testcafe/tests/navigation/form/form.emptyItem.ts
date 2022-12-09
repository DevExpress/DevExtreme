import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

const testName = 'EmptyItem';
test(testName, async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot(`${testName}.png`, '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 500,
  items: [
    {
      itemType: 'empty',
    },
  ],
}));
