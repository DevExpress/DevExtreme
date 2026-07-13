import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TreeList from 'devextreme-testcafe-models/treeList';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture`Toasts in TreeList`
  .page(url(__dirname, '../../container.html'));

const setToastDisplayTime = (displayTime: number) => ClientFunction(() => {
  (window as any).DevExpress.ui.dxToast.defaultOptions({
    options: {
      displayTime,
    },
  });
}, { dependencies: { displayTime } })();

test('Toast should be visible after calling', async (t) => {
  const treeList = new TreeList('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(treeList.isReady())
    .ok();

  await setToastDisplayTime(100000);
  await treeList.apiShowErrorToast();
  await t.expect(treeList.getToast().exists).ok();

  await testScreenshot(t, takeScreenshot, 'ai-column__toast__at-the-right-position.png', { element: treeList.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxTreeList', {});
});

test('Toast should hide after the display time', async (t) => {
  const treeList = new TreeList('#container');

  await t
    .expect(treeList.isReady())
    .ok();

  await setToastDisplayTime(100);
  await treeList.apiShowErrorToast();
  await t
    .expect(treeList.getToast().exists).ok();

  await t
    .wait(150)
    .expect(treeList.getToast().exists).notOk();
}).before(async () => {
  await createWidget('dxTreeList', {});
});
