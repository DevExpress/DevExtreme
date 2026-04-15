import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TreeList from 'devextreme-testcafe-models/treeList';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Toasts in TreeList`
  .page(url(__dirname, '../../container.html'));

test('Toast should be visible after calling and should be not visible after default display time', async (t) => {
  const treeList = new TreeList('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(treeList.isReady())
    .ok();

  await treeList.apiShowErrorToast();
  await t.expect(treeList.getToast().exists).ok();

  await testScreenshot(t, takeScreenshot, 'ai-column__toast__at-the-right-position.png', { element: treeList.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
  await t.expect(treeList.getToast().exists).notOk();
}).before(async () => {
  await createWidget('dxTreeList', {});
});
