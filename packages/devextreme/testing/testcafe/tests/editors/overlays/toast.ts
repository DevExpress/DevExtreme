import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { testScreenshot } from '../../../helpers/themeUtils';
import { insertStylesheetRulesToPage, setAttribute } from '../../../helpers/domUtils';

fixture`Toast`
  .page(url(__dirname, '../../container.html'));

const types = ['info', 'warning', 'error', 'success'];
const STACK_TONTAINER_SELECTOR = '.dx-toast-stack';

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
        position: 'top center',
        direction: 'down-push',
      },
    );
  },
);

test('Toasts', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Toasts.png', { element: STACK_TONTAINER_SELECTOR, shouldTestInCompact: true });
  await testScreenshot(t, takeScreenshot, 'Toasts.png', {
    element: STACK_TONTAINER_SELECTOR,
    theme: process.env.theme?.replace('.light', '.dark'),
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await Promise.all(types.map((type) => showToast(type)));

  await insertStylesheetRulesToPage(`${STACK_TONTAINER_SELECTOR} { padding: 20px; }`);
  await setAttribute('body', 'class', `dx-theme-${process.env.theme}-typography`);
});
