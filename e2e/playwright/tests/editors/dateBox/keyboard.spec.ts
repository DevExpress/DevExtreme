import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import DateBox from '../../../models/dateBox';

const pressKey = async (page: Page, key: string, times = 1): Promise<void> => {
  for (let index = 0; index < times; index += 1) {
    await page.keyboard.press(key);
  }
};

const expectOpened = async (dateBox: DateBox, opened = true): Promise<void> => {
  await expect.poll(() => dateBox.option('opened')).toBe(opened);
};

const createFocusableElements = async (page: Page, state: string): Promise<void> => {
  await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
  await appendElementTo(page, '#container', 'div', 'dateBox');
  await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

  await createWidget(page, 'dxButton', {
    text: `First ${state} Element`,
  }, '#firstFocusableElement');

  await createWidget(page, 'dxButton', {
    text: `Last ${state} Element`,
  }, '#lastFocusableElement');
};

test.describe('DateBox keyboard navigation', () => {
  test('DateBox should be closed by press esc key when navigator element in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const dateBox = new DateBox(page, '#container');

    await dateBox.input.click();

    await expectOpened(dateBox);

    await pressKey(page, 'Tab');

    await dateBox.getPopup().getNavigatorPrevButton().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateBox, false);

    await dateBox.input.click();

    await expectOpened(dateBox);

    await pressKey(page, 'Tab', 2);

    await dateBox.getPopup().getNavigatorCaption().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateBox, false);

    await dateBox.input.click();

    await expectOpened(dateBox);

    await pressKey(page, 'Tab', 3);

    await dateBox.getPopup().getNavigatorNextButton().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateBox, false);
  });

  test('DateBox should be closed by press esc key when views wrapper in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const dateBox = new DateBox(page, '#container');

    await dateBox.input.click();

    await expectOpened(dateBox);

    await pressKey(page, 'Tab', 4);

    await expect(dateBox.getPopup().getViewsWrapper()).toBeFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateBox, false);
  });

  test('DateBox should be closed by press esc key when today/cancel/apply button in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const dateBox = new DateBox(page, '#container');

    await dateBox.input.click();

    await expectOpened(dateBox);

    await pressKey(page, 'Tab', 5);

    await dateBox.getPopup().getTodayButton().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateBox, false);

    await dateBox.input.click();

    await expectOpened(dateBox);

    await pressKey(page, 'Tab', 6);

    await dateBox.getPopup().getApplyButton().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateBox, false);

    await dateBox.input.click();

    await expectOpened(dateBox);

    await pressKey(page, 'Tab', 7);

    await dateBox.getPopup().getCancelButton().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateBox, false);
  });

  test('dateBox keyboard navigation via `tab` key if applyValueMode is useButtons, input -> prev -> caption -> next -> views -> today -> apply -> cancel -> input', async ({ page }) => {
    await createFocusableElements(page, 'Focusable');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      opened: true,
      dropDownOptions: {
        hideOnOutsideClick: false,
      },
    }, '#dateBox');

    const dateBox = new DateBox(page, '#dateBox');

    await page.locator('#firstFocusableElement').click();
    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorPrevButton().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorCaption().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorNextButton().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await expect(dateBox.getPopup().getViewsWrapper()).toBeFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getTodayButton().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getApplyButton().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getCancelButton().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await expect(dateBox.input).toBeFocused();
  });

  test('dateBox keyboard navigation via `shift+tab` key if applyValueMode is useButtons, input -> cancel -> apply -> today -> views -> next -> caption -> prev -> input', async ({ page }) => {
    await createFocusableElements(page, 'Focused');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      opened: false,
    }, '#dateBox');

    const dateBox = new DateBox(page, '#dateBox');

    await dateBox.input.click();

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getCancelButton().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getApplyButton().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getTodayButton().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await expect(dateBox.getPopup().getViewsWrapper()).toBeFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorNextButton().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorCaption().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorPrevButton().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();
  });

  test('dateBox keyboard navigation via `tab` key if applyValueMode is instantly, input -> prev -> caption -> next -> views -> input', async ({ page }) => {
    await createFocusableElements(page, 'Focusable');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'instantly',
      opened: true,
      dropDownOptions: {
        hideOnOutsideClick: false,
      },
    }, '#dateBox');

    const dateBox = new DateBox(page, '#dateBox');

    await page.locator('#firstFocusableElement').click();
    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorPrevButton().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorCaption().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorNextButton().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await expect(dateBox.getPopup().getViewsWrapper()).toBeFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await expect(dateBox.input).toBeFocused();
  });

  test('dateBox keyboard navigation via `shift+tab` key if applyValueMode is instantly, input -> views -> next -> caption -> prev -> input', async ({ page }) => {
    await createFocusableElements(page, 'Focused');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'instantly',
      opened: false,
    }, '#dateBox');

    const dateBox = new DateBox(page, '#dateBox');

    await dateBox.input.click();

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await expect(dateBox.getPopup().getViewsWrapper()).toBeFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorNextButton().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorCaption().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorPrevButton().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();
  });

  test('dateBox keyboard navigation via `tab` and `shift+tab` when calendar is not focusable', async ({ page }) => {
    await createFocusableElements(page, 'Focused');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      calendarOptions: {
        focusStateEnabled: false,
      },
    }, '#dateBox');

    const dateBox = new DateBox(page, '#dateBox');

    await dateBox.input.click();

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getTodayButton().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();
  });

  test('dateBox keyboard navigation via `tab` and `shift+tab` when navigator prev button is not focusable', async ({ page }) => {
    await createFocusableElements(page, 'Focused');

    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      min: new Date(),
    }, '#dateBox');

    const dateBox = new DateBox(page, '#dateBox');

    await dateBox.input.click();

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox);
    await dateBox.getPopup().getNavigatorCaption().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();
  });

  test('dateBox keyboard navigation via `tab` should close popup when there is no focusable elements', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
      openOnFieldClick: true,
      applyValueMode: 'instantly',
      calendarOptions: {
        focusStateEnabled: false,
      },
    }, '#container');

    const dateBox = new DateBox(page, '#container');

    await dateBox.input.click();

    await expectOpened(dateBox);
    await dateBox.expectFocused();
    await expect(dateBox.input).toBeFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateBox, false);
  });
});
