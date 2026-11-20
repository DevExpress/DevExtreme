import { test } from '../../../fixtures';
import { clickWithOffset } from '../../../helpers/clickUtils';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import TabPanel from '../../../models/tabPanel';

test.describe('TabPanel', () => {
  // T821726
  test('[{0: selected}, {1}] -> click to tabs[1] -> click to external button', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1', 'Item 2'],
    }, '#tabPanel');

    const tabPanel = new TabPanel(page, '#tabPanel');

    await tabPanel.tabs.getItem(1).element.click();
    await tabPanel.expectFocused();
    await tabPanel.tabs.expectFocused();
    await tabPanel.tabs.getItem(0).expectFocusedState(false);
    await tabPanel.tabs.getItem(1).expectFocusedState();
    await tabPanel.multiView.getItem(0).expectFocusedState(false);
    await tabPanel.multiView.getItem(1).expectFocusedState();

    await clickWithOffset(page, page.locator('body'), { offsetY: 400 });
    await tabPanel.expectFocused(false);
    await tabPanel.tabs.expectFocused(false);
    await tabPanel.tabs.getItem(0).expectFocusedState(false);
    await tabPanel.tabs.getItem(1).expectFocusedState(false);
    await tabPanel.multiView.getItem(1).expectFocusedState(false);
    await tabPanel.multiView.getItem(0).expectFocusedState(false);
  });

  test('[{0: selected}] -> click to multiView -> click to external button', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1'],
    }, '#tabPanel');

    const tabPanel = new TabPanel(page, '#tabPanel');

    await tabPanel.multiView.getItem(0).element.click();
    await tabPanel.expectFocused();
    await tabPanel.tabs.expectFocused();
    await tabPanel.tabs.getItem(0).expectFocusedState();
    await tabPanel.multiView.getItem(0).expectFocusedState();

    await clickWithOffset(page, page.locator('body'), { offsetY: 400 });
    await tabPanel.expectFocused(false);
    await tabPanel.tabs.expectFocused(false);
    await tabPanel.tabs.getItem(0).expectFocusedState(false);
    await tabPanel.multiView.getItem(0).expectFocusedState(false);
  });

  test('[{0: selected}, {1}, {2}] -> click to tabs[1] -> navigate to tabs[2] -> click to external button', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1', 'Item 2', 'Item 3'],
    }, '#tabPanel');

    const tabPanel = new TabPanel(page, '#tabPanel');

    await tabPanel.tabs.getItem(1).element.click();
    await tabPanel.expectFocused();
    await tabPanel.tabs.expectFocused();
    await tabPanel.tabs.getItem(0).expectFocusedState(false);
    await tabPanel.tabs.getItem(1).expectFocusedState();
    await tabPanel.tabs.getItem(2).expectFocusedState(false);
    await tabPanel.multiView.getItem(0).expectFocusedState(false);
    await tabPanel.multiView.getItem(1).expectFocusedState();
    await tabPanel.multiView.getItem(2).expectFocusedState(false);

    await page.keyboard.press('ArrowRight');
    await tabPanel.expectFocused();
    await tabPanel.tabs.expectFocused();
    await tabPanel.tabs.getItem(0).expectFocusedState(false);
    await tabPanel.tabs.getItem(1).expectFocusedState(false);
    await tabPanel.tabs.getItem(2).expectFocusedState();
    await tabPanel.multiView.getItem(0).expectFocusedState(false);
    await tabPanel.multiView.getItem(1).expectFocusedState(false);
    await tabPanel.multiView.getItem(2).expectFocusedState();

    await clickWithOffset(page, page.locator('body'), { offsetY: 400 });
    await tabPanel.expectFocused(false);
    await tabPanel.tabs.expectFocused(false);
    await tabPanel.tabs.getItem(0).expectFocusedState(false);
    await tabPanel.tabs.getItem(1).expectFocusedState(false);
    await tabPanel.tabs.getItem(2).expectFocusedState(false);
    await tabPanel.multiView.getItem(0).expectFocusedState(false);
    await tabPanel.multiView.getItem(1).expectFocusedState(false);
    await tabPanel.multiView.getItem(2).expectFocusedState(false);
  });

  test('[{0: selected}, {1}] -> click to multiView -> navigate to tabs[1] -> click to external button', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1', 'Item 2'],
    }, '#tabPanel');

    const tabPanel = new TabPanel(page, '#tabPanel');

    await tabPanel.multiView.getItem(0).element.click();
    await tabPanel.expectFocused();
    await tabPanel.tabs.expectFocused();
    await tabPanel.tabs.getItem(0).expectFocusedState();
    await tabPanel.tabs.getItem(1).expectFocusedState(false);
    await tabPanel.multiView.getItem(0).expectFocusedState();
    await tabPanel.multiView.getItem(1).expectFocusedState(false);

    await page.keyboard.press('ArrowRight');
    await tabPanel.expectFocused();
    await tabPanel.tabs.expectFocused();
    await tabPanel.tabs.getItem(0).expectFocusedState(false);
    await tabPanel.tabs.getItem(1).expectFocusedState();
    await tabPanel.multiView.getItem(0).expectFocusedState(false);
    await tabPanel.multiView.getItem(1).expectFocusedState();

    await clickWithOffset(page, page.locator('body'), { offsetY: 400 });
    await tabPanel.expectFocused(false);
    await tabPanel.tabs.expectFocused(false);
    await tabPanel.tabs.getItem(0).expectFocusedState(false);
    await tabPanel.tabs.getItem(1).expectFocusedState(false);
    await tabPanel.multiView.getItem(0).expectFocusedState(false);
    await tabPanel.multiView.getItem(1).expectFocusedState(false);
  });

  test('[{0: selected}] -> click to multiView -> press "tab" -> press "tab"', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1'],
    });

    const tabPanel = new TabPanel(page, '#container');

    await tabPanel.multiView.getItem(0).element.click();
    await tabPanel.expectFocused();
    await tabPanel.tabs.expectFocused();
    await tabPanel.tabs.getItem(0).expectFocusedState();
    await tabPanel.multiView.getItem(0).expectFocusedState();

    await page.keyboard.press('Tab');
    await tabPanel.expectFocused();
    await tabPanel.tabs.expectFocused();
    await tabPanel.tabs.getItem(0).expectFocusedState();
    await tabPanel.multiView.getItem(0).expectFocusedState(false);

    await page.keyboard.press('Tab');
    await tabPanel.expectFocused(false);
    await tabPanel.tabs.expectFocused(false);
    await tabPanel.tabs.getItem(0).expectFocusedState(false);
    await tabPanel.multiView.getItem(0).expectFocusedState(false);
  });

  test('[{0: selected}] -> focusin by press "tab" -> press "tab"', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabPanel');

    await createWidget(page, 'dxTabPanel', {
      items: ['Item 1'],
    }, '#tabPanel');

    const tabPanel = new TabPanel(page, '#tabPanel');

    await clickWithOffset(page, page.locator('body'), { offsetY: 400 });
    await page.keyboard.press('Tab');
    await tabPanel.expectFocused();
    await tabPanel.tabs.expectFocused();
    await tabPanel.tabs.getItem(0).expectFocusedState();
    await tabPanel.multiView.getItem(0).expectFocusedState();

    await page.keyboard.press('Tab');
    await tabPanel.expectFocused(false);
    await tabPanel.tabs.expectFocused(false);
    await tabPanel.tabs.getItem(0).expectFocusedState(false);
    await tabPanel.multiView.getItem(0).expectFocusedState(false);
  });
});
