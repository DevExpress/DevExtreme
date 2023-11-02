import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { testScreenshot } from '../../../helpers/themeUtils';
import { setAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Toast`
  .page(url(__dirname, '../containerQuill.html'));

const types = ['info', 'warning', 'error', 'success'];

const showToast = ClientFunction(
  (type) => {
    (window as any).DevExpress.ui.notify(
      {
        message: `Toast ${type}`,
        type,
        displayTime: 35000000,
        animation: {
          show: {
            type: 'fade', duration: 0,
          },
          hide: { type: 'fade', duration: 0 },
        },
      },
      {
        position: 'bottom center',
        direction: 'up-push',
      },
    );
  },
);

test('Toasts rendered', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Toasts rendered.png', { element: '.dx-toast-stack', shouldTestInCompact: true });
  await testScreenshot(t, takeScreenshot, 'Toasts rendered.png', {
    element: '.dx-toast-stack',
    theme: process.env.theme?.replace('.light', '.dark'),
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await showToast(types[0]);
  await showToast(types[1]);
  await showToast(types[2]);
  await showToast(types[3]);

  await setAttribute('.dx-toast-stack', 'class', `dx-theme-${process.env.theme?.split('.')[0]}-typography`);
});
