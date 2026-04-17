import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo } from '../../../playwright-helpers';
import { TabPanel } from '../../../playwright-helpers/tabPanel';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('TabPanel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('[{0: selected}, {1}] -> click to tabs[1] -> click to external button', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1', 'Item 2'],
    }, '#tabPanel');

    const tabPanel = new TabPanel(page, '#tabPanel');

    await tabPanel.tabs.getItem(1).element.click();
    expect(await tabPanel.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(1).isFocused()).toBeTruthy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(1).isFocused()).toBeTruthy();

    await page.locator('body').click({ position: { x: 10, y: 400 } });
    expect(await tabPanel.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(1).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(1).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();
  });

  test('[{0: selected}] -> click to multiView -> click to external button', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1'],
    }, '#tabPanel');

    const tabPanel = new TabPanel(page, '#tabPanel');

    await tabPanel.multiView.getItem(0).element.click();
    expect(await tabPanel.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeTruthy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeTruthy();

    await page.locator('body').click({ position: { x: 10, y: 400 } });
    expect(await tabPanel.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();
  });

  test('[{0: selected}, {1}, {2}] -> click to tabs[1] -> navigate to tabs[2] -> click to external button', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1', 'Item 2', 'Item 3'],
    }, '#tabPanel');

    const tabPanel = new TabPanel(page, '#tabPanel');

    await tabPanel.tabs.getItem(1).element.click();
    expect(await tabPanel.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(1).isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(2).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(1).isFocused()).toBeTruthy();
    expect(await tabPanel.multiView.getItem(2).isFocused()).toBeFalsy();

    await page.keyboard.press('ArrowRight');
    expect(await tabPanel.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(1).isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(2).isFocused()).toBeTruthy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(1).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(2).isFocused()).toBeTruthy();

    await page.locator('body').click({ position: { x: 10, y: 400 } });
    expect(await tabPanel.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(1).isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(2).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(1).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(2).isFocused()).toBeFalsy();
  });

  test('[{0: selected}, {1}] -> click to multiView -> navigate to tabs[1] -> click to external button', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1', 'Item 2'],
    }, '#tabPanel');

    const tabPanel = new TabPanel(page, '#tabPanel');

    await tabPanel.multiView.getItem(0).element.click();
    expect(await tabPanel.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(1).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeTruthy();
    expect(await tabPanel.multiView.getItem(1).isFocused()).toBeFalsy();

    await page.keyboard.press('ArrowRight');
    expect(await tabPanel.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(1).isFocused()).toBeTruthy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(1).isFocused()).toBeTruthy();

    await page.locator('body').click({ position: { x: 10, y: 400 } });
    expect(await tabPanel.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(1).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(1).isFocused()).toBeFalsy();
  });

  test('[{0: selected}] -> click to multiView -> press "tab" -> press "tab"', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1'],
    });

    const tabPanel = new TabPanel(page);

    await tabPanel.multiView.getItem(0).element.click();
    expect(await tabPanel.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeTruthy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');
    expect(await tabPanel.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeTruthy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');
    expect(await tabPanel.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();
  });

  test('[{0: selected}] -> focusin by press "tab" -> press "tab"', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1'],
    }, '#tabPanel');

    const tabPanel = new TabPanel(page, '#tabPanel');

    await page.locator('body').click({ position: { x: 10, y: 400 } });
    await page.keyboard.press('Tab');
    expect(await tabPanel.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.isFocused()).toBeTruthy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeTruthy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');
    expect(await tabPanel.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.isFocused()).toBeFalsy();
    expect(await tabPanel.tabs.getItem(0).isFocused()).toBeFalsy();
    expect(await tabPanel.multiView.getItem(0).isFocused()).toBeFalsy();
  });
});
