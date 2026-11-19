import { test } from '../../../fixtures';
import { insertStylesheetRulesToPage, setClassAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import { getThemeName } from '../../../helpers/themeUtils';

const types = ['info', 'warning', 'error', 'success'];
const STACK_CONTAINER_SELECTOR = '.dx-toast-stack';

test.describe('Toast', () => {
  test('Toasts', async ({ page, theme }) => {
    for (const type of types) {
      await page.evaluate((toastType) => {
        (window as any).DevExpress.ui.notify(
          {
            message: `Toast ${toastType}`,
            type: toastType,
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
      }, type);
    }

    await insertStylesheetRulesToPage(page, `${STACK_CONTAINER_SELECTOR} { padding: 20px; }`);
    await setClassAttribute(page, STACK_CONTAINER_SELECTOR, `dx-theme-${getThemeName(theme)}-typography`);

    await testScreenshot(page, 'Toasts.png', { element: STACK_CONTAINER_SELECTOR });
  });
});
