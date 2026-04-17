import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateBox keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const isOpened = (page: any, selector: string): Promise<boolean> => page.evaluate(
    (sel: string) => !!($(sel) as any).dxDateBox('instance').option('opened'),
    selector,
  );

  const isFocusedEl = (page: any, selector: string): Promise<boolean> => page.evaluate(
    (sel: string) => {
      const el = document.querySelector(sel);
      return el === document.activeElement || !!(el?.contains(document.activeElement));
    },
    selector,
  );

  const hasFocusedClass = (page: any, selector: string): Promise<boolean> => page.evaluate(
    (sel: string) => !!document.querySelector(sel),
    selector,
  );

  test('DateBox should be closed by press esc key when navigator element in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const input = page.locator('#container .dx-texteditor-input');

    await input.click();
    expect(await isOpened(page, '#container')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await hasFocusedClass(page, '.dx-calendar-navigator-previous-view.dx-state-focused')).toBe(true);

    await page.keyboard.press('Escape');
    expect(await isOpened(page, '#container')).toBe(false);

    await input.click();
    expect(await isOpened(page, '#container')).toBe(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await hasFocusedClass(page, '.dx-calendar-caption-button.dx-state-focused')).toBe(true);

    await page.keyboard.press('Escape');
    expect(await isOpened(page, '#container')).toBe(false);

    await input.click();
    expect(await isOpened(page, '#container')).toBe(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await hasFocusedClass(page, '.dx-calendar-navigator-next-view.dx-state-focused')).toBe(true);

    await page.keyboard.press('Escape');
    expect(await isOpened(page, '#container')).toBe(false);
  });

  test('DateBox should be closed by press esc key when views wrapper in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const input = page.locator('#container .dx-texteditor-input');

    await input.click();
    expect(await isOpened(page, '#container')).toBe(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.keyboard.press('Escape');
    expect(await isOpened(page, '#container')).toBe(false);
  });

  test('DateBox should be closed by press esc key when today/cancel/apply button in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const input = page.locator('#container .dx-texteditor-input');

    await input.click();
    expect(await isOpened(page, '#container')).toBe(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await hasFocusedClass(page, '.dx-button-today.dx-state-focused')).toBe(true);

    await page.keyboard.press('Escape');
    expect(await isOpened(page, '#container')).toBe(false);

    await input.click();
    expect(await isOpened(page, '#container')).toBe(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.keyboard.press('Escape');
    expect(await isOpened(page, '#container')).toBe(false);

    await input.click();
    expect(await isOpened(page, '#container')).toBe(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.keyboard.press('Escape');
    expect(await isOpened(page, '#container')).toBe(false);
  });

  test('dateBox keyboard navigation via `tab` key if applyValueMode is useButtons, input -> prev -> caption -> next -> views -> today -> apply -> cancel -> input', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
    await appendElementTo(page, '#container', 'div', 'dateBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'First Focusable Element',
    }, '#firstFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focusable Element',
    }, '#lastFocusableElement');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      opened: true,
      dropDownOptions: {
        hideOnOutsideClick: false,
      },
    }, '#dateBox');

    await page.locator('#firstFocusableElement').click();
    await page.keyboard.press('Tab');

    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-navigator-previous-view.dx-state-focused')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-caption-button.dx-state-focused')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-navigator-next-view.dx-state-focused')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-button-today.dx-state-focused')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);
  });

  test('dateBox keyboard navigation via `shift+tab` key if applyValueMode is useButtons, input -> cancel -> apply -> today -> views -> next -> caption -> prev -> input', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
    await appendElementTo(page, '#container', 'div', 'dateBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'First Focused Element',
    }, '#firstFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focused Element',
    }, '#lastFocusableElement');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      opened: false,
    }, '#dateBox');

    const input = page.locator('#dateBox .dx-texteditor-input');
    await input.click();

    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-button-today.dx-state-focused')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-navigator-next-view.dx-state-focused')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-caption-button.dx-state-focused')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-navigator-previous-view.dx-state-focused')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);
  });

  test('dateBox keyboard navigation via `tab` key if applyValueMode is instantly, input -> prev -> caption -> next -> views -> input', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
    await appendElementTo(page, '#container', 'div', 'dateBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'First Focusable Element',
    }, '#firstFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focusable Element',
    }, '#lastFocusableElement');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'instantly',
      opened: true,
      dropDownOptions: {
        hideOnOutsideClick: false,
      },
    }, '#dateBox');

    await page.locator('#firstFocusableElement').click();
    await page.keyboard.press('Tab');

    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-navigator-previous-view.dx-state-focused')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-caption-button.dx-state-focused')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-navigator-next-view.dx-state-focused')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);
  });

  test('dateBox keyboard navigation via `shift+tab` key if applyValueMode is instantly, input -> views -> next -> caption -> prev -> input', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
    await appendElementTo(page, '#container', 'div', 'dateBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'First Focused Element',
    }, '#firstFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focused Element',
    }, '#lastFocusableElement');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'instantly',
      opened: false,
    }, '#dateBox');

    const input = page.locator('#dateBox .dx-texteditor-input');
    await input.click();

    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-navigator-next-view.dx-state-focused')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-caption-button.dx-state-focused')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-navigator-previous-view.dx-state-focused')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);
  });

  test('dateBox keyboard navigation via `tab` and `shift+tab` when calendar is not focusable', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
    await appendElementTo(page, '#container', 'div', 'dateBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'First Focused Element',
    }, '#firstFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focused Element',
    }, '#lastFocusableElement');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      calendarOptions: {
        focusStateEnabled: false,
      },
    }, '#dateBox');

    const input = page.locator('#dateBox .dx-texteditor-input');
    await input.click();

    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-button-today.dx-state-focused')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);
  });

  test('dateBox keyboard navigation via `tab` and `shift+tab` when navigator prev button is not focusable', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
    await appendElementTo(page, '#container', 'div', 'dateBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'First Focused Element',
    }, '#firstFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focused Element',
    }, '#lastFocusableElement');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      min: new Date(),
    }, '#dateBox');

    const input = page.locator('#dateBox .dx-texteditor-input');
    await input.click();

    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await hasFocusedClass(page, '.dx-calendar-caption-button.dx-state-focused')).toBe(true);

    await page.keyboard.press('Shift+Tab');
    expect(await isOpened(page, '#dateBox')).toBe(true);
    expect(await isFocusedEl(page, '#dateBox .dx-texteditor-input')).toBe(true);
  });

  test('dateBox keyboard navigation via `tab` should close popup when there is no focusable elements', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'instantly',
      calendarOptions: {
        focusStateEnabled: false,
      },
    }, '#container');

    const input = page.locator('#container .dx-texteditor-input');
    await input.click();

    expect(await isOpened(page, '#container')).toBe(true);
    expect(await isFocusedEl(page, '#container .dx-texteditor-input')).toBe(true);

    await page.keyboard.press('Tab');
    expect(await isOpened(page, '#container')).toBe(false);
  });
});
