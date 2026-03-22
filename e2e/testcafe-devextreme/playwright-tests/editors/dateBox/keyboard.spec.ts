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

  test('DateBox should be closed by press esc key when navigator element in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
  });

    const dateBox = page.locator('#container');

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab');

    await page.expect(dateBox.getPopup().getNavigatorPrevButton().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateBox.option('opened'))
      .eql(false);

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab');

    await page.expect(dateBox.getPopup().getNavigatorCaption().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateBox.option('opened'))
      .eql(false);

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab')
      .pressKey('tab');

    await page.expect(dateBox.getPopup().getNavigatorNextButton().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateBox.option('opened'))
      .eql(false);

    });

  test('DateBox should be closed by press esc key when views wrapper in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
  });

    const dateBox = page.locator('#container');

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab');

    await page.expect(dateBox.getPopup().getViewsWrapper().focused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateBox.option('opened'))
      .eql(false);

    });

  test('DateBox should be closed by press esc key when today/cancel/apply button in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
  });

    const dateBox = page.locator('#container');

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab');

    await page.expect(dateBox.getPopup().getTodayButton().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateBox.option('opened'))
      .eql(false);

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab');

    await page.expect(dateBox.getPopup().getApplyButton().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateBox.option('opened'))
      .eql(false);

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab');

    await page.expect(dateBox.getPopup().getCancelButton().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateBox.option('opened'))
      .eql(false);

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

    const dateBox = page.locator('#dateBox');

    await page.locator('#firstFocusableElement').click()
      .pressKey('tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input().focused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorPrevButton().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorNextButton().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getViewsWrapper().focused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getTodayButton().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getApplyButton().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getCancelButton().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.input.focused)
      .ok();

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

    const dateBox = page.locator('#dateBox');

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input.focused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getCancelButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getApplyButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getTodayButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getViewsWrapper().focused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorNextButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorPrevButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input().focused)
      .ok();

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

    const dateBox = page.locator('#dateBox');

    await page.locator('#firstFocusableElement').click()
      .pressKey('tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input().focused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorPrevButton().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorNextButton().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getViewsWrapper().focused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.input.focused)
      .ok();

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

    const dateBox = page.locator('#dateBox');

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input.focused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getViewsWrapper().focused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorNextButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorPrevButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input().focused)
      .ok();

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

    const dateBox = page.locator('#dateBox');

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input.focused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getTodayButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input().focused)
      .ok();

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

    const dateBox = page.locator('#dateBox');

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input.focused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input().focused)
      .ok();

    });

  test('dateBox keyboard navigation via `tab` should close popup when there is no focusable elements', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
    openOnFieldClick: true,
    applyValueMode: 'instantly',
    calendarOptions: {
      focusStateEnabled: false,
    },
  }, '#container');

    const dateBox = page.locator('#container');

    await page.click(dateBox.input);

    await page.expect(dateBox.option('opened'))
      .eql(true)
      .expect(dateBox.isFocused)
      .ok()
      .expect(dateBox.input.focused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateBox.option('opened'))
      .eql(false);

    });
});
