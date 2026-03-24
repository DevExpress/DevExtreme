import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo } from '../../../playwright-helpers';
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

  // T821726
  test.skip('[{0: selected}, {1}] -> click to tabs[1] -> click to external button', async () => {

    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1', 'Item 2'],
    }, '#tabPanel');

    const tabPanel = page.locator('#tabPanel');

    await tabPanel.tabs.getItem(1).element.click()
      .expect(tabPanel.isFocused).ok()
      .expect(tabPanel.tabs.isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(1).isFocused)
      .ok()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(1).isFocused)
      .ok();

    await page.click(page.locator('body'), { offsetY: 400 })
      .expect(tabPanel.isFocused).notOk()
      .expect(tabPanel.tabs.isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(1).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(1).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk();

    });

  test.skip('[{0: selected}] -> click to multiView -> click to external button', async () => {

    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1'],
    }, '#tabPanel');

    const tabPanel = page.locator('#tabPanel');

    await tabPanel.multiView.getItem(0).element.click()
      .expect(tabPanel.isFocused).ok()
      .expect(tabPanel.tabs.isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .ok()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .ok();

    await page.click(page.locator('body'), { offsetY: 400 })
      .expect(tabPanel.isFocused).notOk()
      .expect(tabPanel.tabs.isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk();

    });

  test.skip('[{0: selected}, {1}, {2}] -> click to tabs[1] -> navigate to tabs[2] -> click to external button', async () => {

    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1', 'Item 2', 'Item 3'],
    }, '#tabPanel');

    const tabPanel = page.locator('#tabPanel');

    await tabPanel.tabs.getItem(1).element.click()
      .expect(tabPanel.isFocused).ok()
      .expect(tabPanel.tabs.isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(1).isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(2).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(1).isFocused)
      .ok()
      .expect(tabPanel.multiView.getItem(2).isFocused)
      .notOk();

    await page.keyboard.press('ArrowRight')
      .expect(tabPanel.isFocused).ok()
      .expect(tabPanel.tabs.isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(1).isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(2).isFocused)
      .ok()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(1).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(2).isFocused)
      .ok();

    await page.click(page.locator('body'), { offsetY: 400 })
      .expect(tabPanel.isFocused).notOk()
      .expect(tabPanel.tabs.isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(1).isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(2).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(1).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(2).isFocused)
      .notOk();

    });

  test.skip('[{0: selected}, {1}] -> click to multiView -> navigate to tabs[1] -> click to external button', async () => {

    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1', 'Item 2'],
    }, '#tabPanel');

    const tabPanel = page.locator('#tabPanel');

    await tabPanel.multiView.getItem(0).element.click()
      .expect(tabPanel.isFocused).ok()
      .expect(tabPanel.tabs.isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(1).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .ok()
      .expect(tabPanel.multiView.getItem(1).isFocused)
      .notOk();

    await page.keyboard.press('ArrowRight')
      .expect(tabPanel.isFocused).ok()
      .expect(tabPanel.tabs.isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(1).isFocused)
      .ok()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(1).isFocused)
      .ok();

    await page.click(page.locator('body'), { offsetY: 400 })
      .expect(tabPanel.isFocused).notOk()
      .expect(tabPanel.tabs.isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(1).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(1).isFocused)
      .notOk();

    });

  test.skip('[{0: selected}] -> click to multiView -> press "tab" -> press "tab"', async () => {
    await createWidget(page, 'dxTabPanel', {
    items: ['Item 1'],
  });

    const tabPanel = page.locator('#container');

    await tabPanel.multiView.getItem(0).element.click()
      .expect(tabPanel.isFocused).ok()
      .expect(tabPanel.tabs.isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .ok()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .ok();

    await page.keyboard.press('Tab')
      .expect(tabPanel.isFocused).ok()
      .expect(tabPanel.tabs.isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .ok()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk();

    await page.keyboard.press('Tab')
      .expect(tabPanel.isFocused).notOk()
      .expect(tabPanel.tabs.isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk();

    });

  test.skip('[{0: selected}] -> focusin by press "tab" -> press "tab"', async () => {

    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1'],
    }, '#tabPanel');

    const tabPanel = page.locator('#tabPanel');

    await page.click(page.locator('body'), { offsetY: 400 })
      .pressKey('tab')
      .expect(tabPanel.isFocused).ok()
      .expect(tabPanel.tabs.isFocused)
      .ok()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .ok()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .ok();

    await page.keyboard.press('Tab')
      .expect(tabPanel.isFocused).notOk()
      .expect(tabPanel.tabs.isFocused)
      .notOk()
      .expect(tabPanel.tabs.getItem(0).isFocused)
      .notOk()
      .expect(tabPanel.multiView.getItem(0).isFocused)
      .notOk();

    });
});
