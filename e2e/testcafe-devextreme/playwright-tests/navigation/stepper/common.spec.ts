import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Stepper_common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const commonItems: any[] = [
    { icon: 'cart', label: 'Cart' },
    { icon: 'clipboardtasklist', label: 'Shipping Info' },
    { icon: 'gift', label: 'Promo Code', optional: true },
    { icon: 'packagebox', label: 'Checkout' },
    { icon: 'checkmarkcircle', label: 'Ordered' },
  ];

  ['horizontal', 'vertical'].forEach((orientation) => {
    test(`Stepper common properties, orientation=${orientation}`, async ({ page }) => {

      await appendElementTo(page, '#container', 'div', 'stepper');
      await appendElementTo(page, '#container', 'div', 'stepper2');

      const containerStyle = orientation === 'horizontal' ? 'width: 800px; flex-direction: column;' : 'height: 600px; width: 400px';
      await setAttribute(page, '#container', 'style', `display: flex; gap: 40px; ${containerStyle}`);

      const stepperOptions = {
        selectedIndex: 4,
        orientation,
        dataSource: commonItems,
      };

      const stepperRTLOptions = {
        ...stepperOptions,
        rtlEnabled: true,
      };

      await createWidget(page, 'dxStepper', stepperOptions, '#stepper');
      await createWidget(page, 'dxStepper', stepperRTLOptions, '#stepper2');

      await testScreenshot(page, `Stepper orient=${orientation}.png`, {
        element: '#container',
      });
    });
  });

  test('Stepper text overflow in horizontal orientation', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'stepper');
    await setAttribute(page, '#container', 'style', 'width: 200px; height: 150px; overflow: auto;');

    await appendElementTo(page, '#otherContainer', 'div', 'stepper2');
    await setAttribute(page, '#otherContainer', 'style', 'width: 400px; height: 150px; overflow: auto;');

    await setAttribute(page, '#parentContainer', 'style', 'width: 400px;');

    const stepperOptions = {
      dataSource: commonItems,
    };

    await createWidget(page, 'dxStepper', stepperOptions, '#stepper');
    await createWidget(page, 'dxStepper', stepperOptions, '#stepper2');

    await testScreenshot(page, 'Stepper text overflow orient=horizontal.png', { element: '#parentContainer' });
  });

  test('Stepper text overflow in vertical orientation', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'stepper');
    await appendElementTo(page, '#container', 'div', 'stepper2');
    await setAttribute(page, '#container', 'style', 'display: flex; gap: 40px; width: 400px');

    const stepperOptions = {
      dataSource: commonItems,
      width: 120,
      height: 400,
      orientation: 'vertical',
    };

    const stepperRTLOptions = {
      ...stepperOptions,
      rtlEnabled: true,
    };

    await createWidget(page, 'dxStepper', stepperOptions, '#stepper');
    await createWidget(page, 'dxStepper', stepperRTLOptions, '#stepper2');

    await testScreenshot(page, 'Stepper text overflow orient=vertical.png', { element: '#container' });
  });

  [true, false].forEach((selectOnFocus) => {
    test(`Stepper item states, selectOnFocus=${selectOnFocus}`, async ({ page }) => {

      await appendElementTo(page, '#container', 'div', 'stepper');
      await setAttribute(page, '#container', 'style', 'width: 800px; height: 150px;');

      const dataSource: any[] = [
        { label: 'Default' },
        { label: 'Valid', isValid: true, optional: true },
        { label: 'Invalid', isValid: false, optional: true },
        {
          label: 'Disabled', icon: 'packagebox', disabled: true, optional: true,
        },
        { label: 'Disabled Valid', disabled: true, isValid: true },
        { label: 'Disabled Invalid', disabled: true, isValid: false },
        { label: 'With Text', text: 'T', optional: true },
      ];

      const stepperOptions = {
        selectOnFocus,
        dataSource,
      };

      await createWidget(page, 'dxStepper', stepperOptions, '#stepper');

      const state = selectOnFocus ? 'selected' : 'focused';

      await page.keyboard.press('Tab');
      await testScreenshot(page, `Stepper 1st step selected,selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

      await page.keyboard.press('ArrowRight');
      await testScreenshot(page, `Stepper valid step ${state},selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

      await page.keyboard.press('ArrowRight');
      await testScreenshot(page, `Stepper invalid step ${state},selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

      await page.keyboard.press('ArrowRight');
      await testScreenshot(page, `Stepper disabled step focused,selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

      await page.keyboard.press('ArrowRight');
      await testScreenshot(page, `Stepper disabled valid step focused,selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

      await page.keyboard.press('ArrowRight');
      await testScreenshot(page, `Stepper disabled invalid step focused,selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

      await page.keyboard.press('ArrowRight');
      await testScreenshot(page, `Stepper last step ${state},selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });
    });
  });

  test('Stepper completed item states', async ({ page }) => {
    test.setTimeout(90000);
    await appendElementTo(page, '#container', 'div', 'stepper');
    await setAttribute(page, '#container', 'style', 'width: 800px; height: 150px;');

    const dataSource: any[] = [
      { label: 'Default' },
      { label: 'Valid', isValid: true, optional: true },
      { label: 'Invalid', isValid: false, optional: true },
      { label: 'With Text', text: 'T', optional: true },
    ];

    await createWidget(page, 'dxStepper', {
      selectOnFocus: false,
      dataSource,
      selectedIndex: 3,
    }, '#stepper');

    const items = page.locator('#stepper .dx-step');
    await items.nth(3).click();

    await page.keyboard.press('ArrowLeft');
    await testScreenshot(page, 'Completed invalid step focused.png', { element: '#stepper', keepFocus: true });

    await page.keyboard.press('ArrowLeft');
    await testScreenshot(page, 'Completed valid step focused.png', { element: '#stepper', keepFocus: true });

    await page.keyboard.press('ArrowLeft');
    await testScreenshot(page, 'Completed step focused.png', { element: '#stepper', keepFocus: true });

    await page.locator('body').click({ position: { x: 0, y: 0 } });
  });
});
