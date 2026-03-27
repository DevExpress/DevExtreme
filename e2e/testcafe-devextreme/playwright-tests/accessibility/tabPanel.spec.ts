import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - tabPanel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', { dataSource: [{ title: 'John Heart', text: 'John Heart' }, { title: 'Robert Reagan', text: 'Robert Reagan' }], width: 450, height: 250 });
    await a11yCheck(page, {}, '#container');
  });

  test('empty tab panel', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', { dataSource: [], width: 450, height: 250 });
    await a11yCheck(page, {}, '#container');
  });

  test('tab panel with disabled item', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
      dataSource: [
        { title: 'Active', text: 'Active tab' },
        { title: 'Disabled', text: 'Disabled tab', disabled: true },
        { title: 'Another', text: 'Another tab' },
      ],
      width: 450,
      height: 250,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tab panel disabled', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
      dataSource: [{ title: 'Tab 1', text: 'Content 1' }, { title: 'Tab 2', text: 'Content 2' }],
      width: 450,
      height: 250,
      disabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tab panel with navigation buttons', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
      dataSource: [
        { title: 'Tab 1', text: 'Content 1' },
        { title: 'Tab 2', text: 'Content 2' },
        { title: 'Tab 3', text: 'Content 3' },
      ],
      width: 200,
      height: 250,
      showNavButtons: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tab panel disabled without nav buttons', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
      dataSource: [{ title: 'Tab 1', text: 'Content 1' }, { title: 'Tab 2', text: 'Content 2' }],
      width: 450,
      height: 550,
      showNavButtons: false,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tab panel tall height', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
      dataSource: [{ title: 'Tab 1', text: 'Content 1' }, { title: 'Tab 2', text: 'Content 2' }],
      width: 450,
      height: 550,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tab panel with swipe enabled', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
      dataSource: [{ title: 'Tab 1', text: 'Content 1' }, { title: 'Tab 2', text: 'Content 2' }],
      width: 450,
      height: 250,
      swipeEnabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tab panel with loop enabled', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
      dataSource: [{ title: 'Tab 1', text: 'Content 1' }, { title: 'Tab 2', text: 'Content 2' }, { title: 'Tab 3', text: 'Content 3' }],
      width: 450,
      height: 250,
      loop: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tab panel with icon in tab', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
      dataSource: [
        { title: 'Info', icon: 'info', text: 'Information tab' },
        { title: 'Settings', icon: 'preferences', text: 'Settings tab' },
      ],
      width: 450,
      height: 250,
    });
    await a11yCheck(page, {}, '#container');
  });
});
