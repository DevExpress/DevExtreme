import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - stepper', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxStepper', { dataSource: [{ icon: 'cart', label: 'Cart' }, { icon: 'gift', label: 'Promo Code' }, { icon: 'checkmarkcircle', label: 'Ordered' }], selectedIndex: 0, width: 800, height: 600 });
    await a11yCheck(page, {}, '#container');
  });

  test('stepper with last step selected', async ({ page }) => {
    await createWidget(page, 'dxStepper', {
      dataSource: [{ icon: 'cart', label: 'Cart' }, { icon: 'gift', label: 'Promo Code' }, { icon: 'checkmarkcircle', label: 'Ordered' }],
      selectedIndex: 2,
      width: 800,
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('stepper with vertical orientation', async ({ page }) => {
    await createWidget(page, 'dxStepper', {
      dataSource: [{ icon: 'cart', label: 'Cart' }, { icon: 'gift', label: 'Promo Code' }, { icon: 'checkmarkcircle', label: 'Ordered' }],
      selectedIndex: 0,
      orientation: 'vertical',
      width: 800,
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('stepper with isValid and disabled items', async ({ page }) => {
    await createWidget(page, 'dxStepper', {
      dataSource: [
        { icon: 'cart', label: 'Cart', isValid: true },
        { icon: 'gift', label: 'Promo Code', isValid: false },
        { icon: 'checkmarkcircle', label: 'Ordered', disabled: true },
      ],
      selectedIndex: 0,
      width: 800,
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('stepper horizontal with last step selected', async ({ page }) => {
    await createWidget(page, 'dxStepper', {
      dataSource: [
        { icon: 'cart', label: 'Cart' },
        { icon: 'gift', label: 'Promo Code', optional: true },
        { icon: 'checkmarkcircle', label: 'Ordered' },
      ],
      selectedIndex: 2,
      orientation: 'horizontal',
      width: 800,
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('stepper vertical with first step selected', async ({ page }) => {
    await createWidget(page, 'dxStepper', {
      dataSource: [
        { icon: 'cart', label: 'Cart' },
        { icon: 'gift', label: 'Promo Code' },
        { icon: 'checkmarkcircle', label: 'Ordered' },
      ],
      selectedIndex: 0,
      orientation: 'vertical',
      width: 800,
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('stepper with middle step selected', async ({ page }) => {
    await createWidget(page, 'dxStepper', {
      dataSource: [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }, { label: 'Step 4' }],
      selectedIndex: 1,
      width: 800,
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('stepper with only icons', async ({ page }) => {
    await createWidget(page, 'dxStepper', {
      dataSource: [{ icon: 'user' }, { icon: 'email' }, { icon: 'check' }],
      selectedIndex: 0,
      width: 800,
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('stepper vertical with invalid step', async ({ page }) => {
    await createWidget(page, 'dxStepper', {
      dataSource: [
        { label: 'Step 1', isValid: true },
        { label: 'Step 2', isValid: false },
        { label: 'Step 3' },
      ],
      selectedIndex: 1,
      orientation: 'vertical',
      width: 800,
      height: 600,
    });
    await a11yCheck(page, {}, '#container');
  });
});
