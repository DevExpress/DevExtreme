import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Toolbar from '../../../models/toolbar';
import { expectItemFocused } from './utils';

const toolbarWidgets = [
  {
    widget: 'dxButton',
    options: { text: 'Button' },
  },
  {
    widget: 'dxTextBox',
    options: { value: 'text', showClearButton: false },
  },
  {
    widget: 'dxAutocomplete',
    options: { value: 'auto', showClearButton: false },
  },
  {
    widget: 'dxCheckBox',
    options: { value: true },
  },
  {
    widget: 'dxDateBox',
    options: {
      value: new Date(2021, 9, 17),
      openOnFieldClick: false,
      showClearButton: false,
      showDropDownButton: false,
    },
  },
  {
    widget: 'dxSelectBox',
    options: {
      items: ['Item 1', 'Item 2'],
      value: 'Item 1',
      showClearButton: false,
      showDropDownButton: false,
    },
  },
  {
    widget: 'dxMenu',
    options: {
      items: [{ text: 'Menu Item 1' }, { text: 'Menu Item 2' }],
    },
  },
  {
    widget: 'dxTabs',
    options: {
      items: [{ text: 'Tab 1' }, { text: 'Tab 2' }],
    },
  },
  {
    widget: 'dxButtonGroup',
    options: {
      items: [{ text: 'Left' }, { text: 'Right' }],
    },
  },
  {
    widget: 'dxDropDownButton',
    options: {
      text: 'Drop',
      items: [{ text: 'Action 1' }, { text: 'Action 2' }],
    },
  },
] as const;

const setupOverflowMenuFixture = async (page: Page): Promise<void> => {
  await appendElementTo(page, '#container', 'div', 'toolbar');
  await appendElementTo(page, '#container', 'div', 'externalAfter');

  await createWidget(page, 'dxToolbar', {
    items: [
      { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
      { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
      { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu B' } },
    ],
  }, '#toolbar');

  await createWidget(page, 'dxButton', { text: 'External After' }, '#externalAfter');
};

test.describe('Toolbar_keyboard_navigation', () => {
  test('Tab inside overflow menu closes popup and moves focus past the toolbar', async ({ page }) => {
    await setupOverflowMenuFixture(page);

    const externalAfter = page.locator('#externalAfter');
    const toolbar = new Toolbar(page, '#toolbar');
    const menu = toolbar.getOverflowMenu();

    await menu.element.click();
    await expect.poll(() => menu.option('opened')).toBe(true);

    await page.keyboard.press('Tab');

    await expect.poll(() => menu.option('opened')).toBe(false);
    await expect(externalAfter).toBeFocused();
  });

  test('Outside click closes overflow menu without stealing focus to overflow button', async ({ page }) => {
    await setupOverflowMenuFixture(page);

    const externalAfter = page.locator('#externalAfter');
    const toolbar = new Toolbar(page, '#toolbar');
    const menu = toolbar.getOverflowMenu();

    await menu.element.click();
    await expect.poll(() => menu.option('opened')).toBe(true);

    await externalAfter.click();

    await expect.poll(() => menu.option('opened')).toBe(false);
    await expect(externalAfter).toBeFocused();
    await menu.expectFocused(false);
  });

  toolbarWidgets.forEach(({ widget, options }) => {
    test(`${widget}: Tab leaves and Shift+Tab returns focus`, async ({ page }) => {
      await appendElementTo(page, '#container', 'div', 'externalBefore');
      await appendElementTo(page, '#container', 'div', 'toolbar');
      await appendElementTo(page, '#container', 'div', 'externalAfter');

      await createWidget(page, 'dxButton', {
        text: 'External Before',
      }, '#externalBefore');

      await createWidget(page, 'dxToolbar', (item) => ({
        items: [
          {
            location: 'before',
            widget: 'dxButton',
            options: { text: 'Prev', focusStateEnabled: true },
          },
          {
            location: 'before',
            widget: item.widget,
            options: { ...item.options, focusStateEnabled: true },
          },
          {
            location: 'before',
            widget: 'dxButton',
            options: { text: 'Next', focusStateEnabled: true },
          },
        ],
      }), '#toolbar', { arg: { widget, options } });

      await createWidget(page, 'dxButton', {
        text: 'External After',
      }, '#externalAfter');

      const externalBefore = page.locator('#externalBefore');
      const externalAfter = page.locator('#externalAfter');
      const toolbar = new Toolbar(page, '#toolbar');

      await externalBefore.click();
      await expect(externalBefore, 'external before button should be focused').toBeFocused();

      await page.keyboard.press('Tab');
      await expectItemFocused(toolbar.getItem(0), true, 'first toolbar item should be focused after Tab');

      await page.keyboard.press('ArrowRight');
      await expectItemFocused(toolbar.getItem(1), true, `${widget} should be focused after arrow right`);

      await page.keyboard.press('Tab');
      await expect(externalAfter, 'external after button should be focused after Tab').toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await expectItemFocused(toolbar.getItem(1), true, `${widget} should be focused after Shift+Tab`);
    });
  });

  test('Arrow / Home / End skip disabled items and the focus border lands on the right item', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'externalBefore');
    await appendElementTo(page, '#container', 'div', 'toolbar');

    await createWidget(page, 'dxButton', { text: 'External Before' }, '#externalBefore');

    const labels = ['E1', 'E2', 'D1', 'D2', 'E3', 'E4', 'D3', 'D4'];
    const disabledIndexes = new Set([2, 3, 6, 7]);

    await createWidget(page, 'dxToolbar', {
      items: labels.map((text, index) => ({
        location: 'before',
        widget: 'dxButton',
        options: {
          text,
          focusStateEnabled: true,
          disabled: disabledIndexes.has(index),
        },
      })),
    }, '#toolbar');

    const externalBefore = page.locator('#externalBefore');
    const toolbar = new Toolbar(page, '#toolbar');

    await externalBefore.click();
    await page.keyboard.press('Tab');
    await expectItemFocused(toolbar.getItem(0), true, 'Tab -> item[0] (first enabled)');

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expectItemFocused(toolbar.getItem(4), true, 'ArrowRight x2 -> item[4] (5th item, disabled items skipped)');

    await page.keyboard.press('Home');
    await expectItemFocused(toolbar.getItem(0), true, 'Home -> item[0] (1st item)');

    await page.keyboard.press('End');
    await expectItemFocused(toolbar.getItem(5), true, 'End -> item[5] (6th item, trailing disabled items skipped)');

    await testScreenshot(
      page,
      'Toolbar focus border on item after Arrow-Home-End navigation with disabled items.png',
      { element: '#container' },
    );
  });

  test('RTL: focus border appears on keyboard navigation but not on mouse click; ArrowLeft moves to the logical next item', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'externalBefore');
    await appendElementTo(page, '#container', 'div', 'toolbar');

    await setAttribute(page, '#container', 'dir', 'rtl');

    await createWidget(page, 'dxButton', { text: 'External Before' }, '#externalBefore');

    await createWidget(page, 'dxToolbar', {
      rtlEnabled: true,
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

    const externalBefore = page.locator('#externalBefore');
    const toolbar = new Toolbar(page, '#toolbar');

    await externalBefore.click();
    await page.keyboard.press('Tab');
    await expectItemFocused(toolbar.getItem(0), true, 'Tab -> item[0] (first item in logical order)');

    await page.keyboard.press('ArrowLeft');
    await expectItemFocused(toolbar.getItem(1), true, 'ArrowLeft in RTL moves focus to the logical-next item[1]');

    await testScreenshot(
      page,
      'Toolbar RTL focus border visible after keyboard navigation.png',
      { element: '#container' },
    );

    await toolbar.getItem(2).click();
    await expectItemFocused(toolbar.getItem(2), true, 'mouse click -> item[2] becomes the focused item');

    await testScreenshot(
      page,
      'Toolbar RTL no focus border after mouse click.png',
      { element: '#container' },
    );
  });
});
