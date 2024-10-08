import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';

const getUrl = (name: string) => `http://localhost:6006/iframe.html?id=${name}&viewMode=story`;

fixture.disablePageReloads`CardView - Headers`
  .page(getUrl('grids-cardview--default-mode'));

test('default render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot('headers', Selector('.dx-gridcore-headers'));

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
