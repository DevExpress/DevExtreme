import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute, insertStylesheetRulesToPage, isMaterial, isMaterialBased, Lookup } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Popup should not be closed if lookup is placed at the page bottom (T1018037)', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'position: absolute; bottom: 0; width: 300px;');

    await createWidget(page, 'dxLookup', {
      items: ['item1', 'item2', 'item3'],
      dropDownOptions: {
        hideOnOutsideClick: true,
      },
    });

    const lookup = new Lookup(page);

    await lookup.open();
    expect(await lookup.isOpened()).toBe(true);

    await testScreenshot(page, 'Lookup popup at page bottom.png');
  });

  test('Popup should be flipped if lookup is placed at the page bottom', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'position: absolute; bottom: 0; width: 300px;');

    await createWidget(page, 'dxLookup', {
      items: ['item1', 'item2', 'item3'],
      usePopover: true,
    });

    const lookup = new Lookup(page);

    await lookup.open();
    expect(await lookup.isOpened()).toBe(true);

    await testScreenshot(page, 'Lookup popup flipped at page bottom.png');
  });

  test('Popover should have correct vertical position (T1048128)', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'width: 300px; margin-top: 100px;');

    await createWidget(page, 'dxLookup', {
      items: ['item1', 'item2', 'item3'],
      usePopover: true,
    });

    const lookup = new Lookup(page);

    await lookup.open();

    await testScreenshot(page, 'Lookup popover vertical position.png');
  });

  test('Check popup height with no found data option', async ({ page }) => {
    await createWidget(page, 'dxLookup', {
      items: ['item1', 'item2', 'item3'],
      searchEnabled: true,
    });

    const lookup = new Lookup(page);

    await lookup.field.click();
    await lookup.getSearchInput().fill('nonexistent');

    await testScreenshot(page, 'Lookup popup height no found data.png');
  });

  test('Check popup height in loading state', async ({ page }) => {
    await createWidget(page, 'dxLookup', {
      dataSource: {
        load() {
          return new Promise(() => {});
        },
      },
    });

    const lookup = new Lookup(page);

    await lookup.field.click();

    await testScreenshot(page, 'Lookup popup height loading state.png');
  });

  test('Lookup appearance', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'display: flex; gap: 20px; padding: 8px; width: fit-content;');

    const configs = [
      { id: 'lookup-default', options: { items: ['item1', 'item2'] } },
      { id: 'lookup-disabled', options: { items: ['item1', 'item2'], disabled: true } },
      { id: 'lookup-with-value', options: { items: ['item1', 'item2'], value: 'item1' } },
    ];

    for (const config of configs) {
      await appendElementTo(page, '#container', 'div', config.id);
      await createWidget(page, 'dxLookup', {
        width: 200,
        ...config.options,
      }, `#${config.id}`);
    }

    await testScreenshot(page, 'Lookup appearance.png', { element: '#container' });
  });
});
