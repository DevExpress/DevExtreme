import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('CardView - SearchPanel API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('searchPanel.visible API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true },
    });

    const searchBox = page.locator('.dx-cardview-search-panel');
    await expect(searchBox).toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.visible', false);
    });
    await expect(searchBox).not.toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.visible', true);
    });
    await expect(searchBox).toBeVisible();
  });

  test('searchPanel.text API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true, text: 'rt' },
    });

    const input = page.locator('.dx-cardview-search-panel .dx-texteditor-input');
    await expect(input).toHaveValue('rt');

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.text', '');
    });
    await expect(input).toHaveValue('');
  });

  test('searchPanel.width API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true, width: 300 },
    });

    const searchBox = page.locator('.dx-cardview-search-panel');
    const initialWidth = await searchBox.evaluate(el => el.getBoundingClientRect().width);
    expect(Math.round(initialWidth)).toBe(300);

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.width', 200);
    });

    const newWidth = await searchBox.evaluate(el => el.getBoundingClientRect().width);
    expect(Math.round(newWidth)).toBe(200);
  });

  test('searchPanel.placeholder API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true, placeholder: 'Test placeholder' },
    });

    const input = page.locator('.dx-cardview-search-panel .dx-texteditor-input');
    await expect(input).toHaveAttribute('placeholder', 'Test placeholder');

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.placeholder', 'Test placeholder 2');
    });
    await expect(input).toHaveAttribute('placeholder', 'Test placeholder 2');
  });

  test('searchPanel.text API from UI', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true, text: '' },
    });

    const input = page.locator('.dx-cardview-search-panel .dx-texteditor-input');
    await input.fill('rt');

    const searchText = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').option('searchPanel.text');
    });
    expect(searchText).toBe('rt');
  });

  test('searchPanel.searchVisibleColumnsOnly API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [
        { dataField: 'id', visible: false },
        { dataField: 'title' },
        { dataField: 'name' },
        { dataField: 'lastName' },
      ],
      searchPanel: { visible: true },
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(4);

    const input = page.locator('.dx-cardview-search-panel .dx-texteditor-input');
    await input.fill('2');
    await expect(cards).toHaveCount(1);

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.searchVisibleColumnsOnly', true);
    });
    await expect(cards).toHaveCount(0);
  });

  test('searchPanel.highlightSearchText API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true },
    });

    const cards = page.locator('.dx-cardview-card');
    const input = page.locator('.dx-cardview-search-panel .dx-texteditor-input');
    await input.fill('rt');
    await expect(cards).toHaveCount(2);

    const highlights = page.locator('.dx-cardview-card').first().locator('.dx-highlight-text');
    await expect(highlights).toHaveCount(1);

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.highlightSearchText', false);
    });

    await expect(cards).toHaveCount(2);
    await expect(highlights).toHaveCount(0);
  });

  test('searchPanel.highlightCaseSensitive API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
        { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
        { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
        { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
      ],
      columns: [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }],
      searchPanel: { visible: true, highlightCaseSensitive: true },
    });

    const cards = page.locator('.dx-cardview-card');
    const input = page.locator('.dx-cardview-search-panel .dx-texteditor-input');
    await input.fill('rt');
    await expect(cards).toHaveCount(2);

    const highlights = page.locator('.dx-cardview-card').first().locator('.dx-highlight-text');
    await expect(highlights).toHaveCount(1);

    await input.fill('RT');
    await expect(cards).toHaveCount(2);
    await expect(highlights).toHaveCount(0);

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('searchPanel.highlightCaseSensitive', false);
    });

    await expect(highlights).toHaveCount(1);
  });
});
