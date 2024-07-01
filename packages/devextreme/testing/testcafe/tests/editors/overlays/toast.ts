import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { getFullThemeName, getThemeName, testScreenshot } from '../../../helpers/themeUtils';
import { insertStylesheetRulesToPage, setClassAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Toast`
  .page(url(__dirname, '../../container.html'));

const types = ['info', 'warning', 'error', 'success'];
const STACK_CONTAINER_SELECTOR = '.dx-toast-stack';

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

const hideAllToasts = ClientFunction(() => {
  (window as any).DevExpress.ui.hideToasts();
});

test('Toasts', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Toasts.png', { element: STACK_CONTAINER_SELECTOR, shouldTestInCompact: true });
  await testScreenshot(t, takeScreenshot, 'Toasts.png', {
    element: STACK_CONTAINER_SELECTOR,
    theme: `${getFullThemeName().replace('light', 'dark')}`,
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await Promise.all(types.map((type) => showToast(type)));

  await insertStylesheetRulesToPage(`${STACK_CONTAINER_SELECTOR} { padding: 20px; }`);
  await setClassAttribute(Selector(STACK_CONTAINER_SELECTOR), `dx-theme-${getThemeName()}-typography`);
}).after(async () => {
  await hideAllToasts();

  await ClientFunction(() => {
    $(STACK_CONTAINER_SELECTOR).remove();
  }, {
    dependencies: { STACK_CONTAINER_SELECTOR },
  })();
});
