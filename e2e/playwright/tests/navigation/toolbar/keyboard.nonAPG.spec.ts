import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import Toolbar from '../../../models/toolbar';
import { expectItemHasFocus } from './utils';

const setupThreeButtonsFixture = async (page: Page): Promise<void> => {
  await appendElementTo(page, '#container', 'div', 'externalBefore');
  await appendElementTo(page, '#container', 'div', 'toolbar');
  await appendElementTo(page, '#container', 'div', 'externalAfter');

  await createWidget(page, 'dxButton', { text: 'External Before' }, '#externalBefore');

  await createWidget(page, 'dxToolbar', {
    allowKeyboardNavigation: false,
    items: [
      {
        location: 'before',
        widget: 'dxButton',
        options: { text: 'A', focusStateEnabled: true },
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: { text: 'B', focusStateEnabled: true },
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: { text: 'C', focusStateEnabled: true },
      },
    ],
  }, '#toolbar');

  await createWidget(page, 'dxButton', { text: 'External After' }, '#externalAfter');
};

const getTabsSelectedIndex = (page: Page): Promise<number> => page.evaluate(
  () => ($('#toolbar .dx-tabs') as unknown as {
    dxTabs: (m: string, n: string) => number;
  }).dxTabs('option', 'selectedIndex'),
);

test.describe('Toolbar_keyboard_navigation_nonAPG', () => {
  test('Tab walks through every toolbar item; Shift+Tab walks back', async ({ page }) => {
    await setupThreeButtonsFixture(page);

    const externalBefore = page.locator('#externalBefore');
    const externalAfter = page.locator('#externalAfter');
    const toolbar = new Toolbar(page, '#toolbar');

    await externalBefore.click();
    await expect(externalBefore, 'external before is focused').toBeFocused();

    await page.keyboard.press('Tab');
    await expectItemHasFocus(toolbar.getItem(0), true, 'Tab #1 -> item[0]');

    await page.keyboard.press('Tab');
    await expectItemHasFocus(toolbar.getItem(1), true, 'Tab #2 -> item[1]');

    await page.keyboard.press('Tab');
    await expectItemHasFocus(toolbar.getItem(2), true, 'Tab #3 -> item[2]');

    await page.keyboard.press('Tab');
    await expect(externalAfter, 'Tab #4 -> external after').toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expectItemHasFocus(toolbar.getItem(2), true, 'Shift+Tab #1 -> item[2]');

    await page.keyboard.press('Shift+Tab');
    await expectItemHasFocus(toolbar.getItem(1), true, 'Shift+Tab #2 -> item[1]');

    await page.keyboard.press('Shift+Tab');
    await expectItemHasFocus(toolbar.getItem(0), true, 'Shift+Tab #3 -> item[0]');

    await page.keyboard.press('Shift+Tab');
    await expect(externalBefore, 'Shift+Tab #4 -> external before').toBeFocused();
  });

  test('Arrow keys do not move focus across toolbar items', async ({ page }) => {
    await setupThreeButtonsFixture(page);

    const externalBefore = page.locator('#externalBefore');
    const toolbar = new Toolbar(page, '#toolbar');

    await externalBefore.click();
    await page.keyboard.press('Tab');
    await expectItemHasFocus(toolbar.getItem(0), true, 'item[0] focused');

    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End', 'ArrowDown', 'ArrowUp'];

    for (const key of keys) {
      await page.keyboard.press(key);
      await expectItemHasFocus(toolbar.getItem(0), true, `focus stays on item[0] after "${key}"`);
      await expectItemHasFocus(toolbar.getItem(1), false, `focus does not jump to item[1] on "${key}"`);
    }
  });

  test('Arrow keys are forwarded to the focused widget (dxTabs changes selectedIndex)', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'externalBefore');
    await appendElementTo(page, '#container', 'div', 'toolbar');

    await createWidget(page, 'dxButton', { text: 'External Before' }, '#externalBefore');

    await createWidget(page, 'dxToolbar', {
      allowKeyboardNavigation: false,
      items: [
        {
          location: 'before',
          widget: 'dxButton',
          options: { text: 'Prev', focusStateEnabled: true },
        },
        {
          location: 'before',
          widget: 'dxTabs',
          options: {
            items: [{ text: 'Home' }, { text: 'Insert' }, { text: 'Layout' }],
            selectedIndex: 0,
            width: 'auto',
            focusStateEnabled: true,
          },
        },
        {
          location: 'before',
          widget: 'dxButton',
          options: { text: 'Next', focusStateEnabled: true },
        },
      ],
    }, '#toolbar');

    const externalBefore = page.locator('#externalBefore');
    const toolbar = new Toolbar(page, '#toolbar');

    await externalBefore.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expectItemHasFocus(toolbar.getItem(1), true, 'focus is inside dxTabs item');

    await expect.poll(() => getTabsSelectedIndex(page), { message: 'initial selectedIndex is 0' }).toBe(0);

    await page.keyboard.press('ArrowRight');
    await expect.poll(
      () => getTabsSelectedIndex(page),
      { message: 'ArrowRight reaches dxTabs and advances selectedIndex' },
    ).toBe(1);
    await expectItemHasFocus(toolbar.getItem(1), true, 'focus stays inside dxTabs, did not jump to item[2]');

    await page.keyboard.press('ArrowLeft');
    await expect.poll(
      () => getTabsSelectedIndex(page),
      { message: 'ArrowLeft reaches dxTabs and decreases selectedIndex' },
    ).toBe(0);
    await expectItemHasFocus(toolbar.getItem(1), true, 'focus still inside dxTabs');
  });
});
