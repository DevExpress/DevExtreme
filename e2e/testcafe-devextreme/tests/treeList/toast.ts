import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TreeList from 'devextreme-testcafe-models/treeList';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture`Toasts in TreeList`
  .page(url(__dirname, '../container.html'));

test('Toast should be visible after calling and should be not visible after default display time', async (t) => {
  const treeList = new TreeList('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await treeList.isReady();
  await treeList.apiShowErrorToast();
  await t.expect(treeList.getToast().exists).ok();
  await t
    .expect(await takeScreenshot('ai-column__toast__at-the-right-position.png', treeList.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
  await t.expect(treeList.getToast().exists).notOk();
}).before(async () => {
  createWidget('dxTreeList', {});
});
