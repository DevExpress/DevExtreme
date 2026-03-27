import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const data = [
  { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
  { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
  { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
  { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
];

test.describe('CardView - Sorting Behavior - Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Change sorting by header click in single mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: data,
      sorting: { mode: 'single' },
      columns: [{ dataField: 'title' }, { dataField: 'name' }],
    });

    const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await titleHeader.click();

    const sortOrder = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').columnOption('title', 'sortOrder');
    });
    expect(sortOrder).toBe('asc');
  });

  test('Sorting should work with computed columns', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
      keyExpr: 'id',
      columns: [{
        caption: 'Computed',
        allowSorting: true,
        calculateFieldValue: ({ id }) => `str_${id}`,
      }],
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click();

    const firstValue = await page.locator('.dx-cardview-card').first().locator('.dx-cardview-field-value').textContent();
    expect(firstValue).toBe('str_0');

    await headerItem.click();

    const newFirstValue = await page.locator('.dx-cardview-card').first().locator('.dx-cardview-field-value').textContent();
    expect(newFirstValue).toBe('str_3');
  });

  (
    [
      ['none', false, false, false, [undefined, undefined]],
      ['none', true, false, false, [undefined, undefined]],
      ['none', false, true, false, [undefined, undefined]],
      ['none', false, false, true, [undefined, undefined]],
      ['single', false, false, false, ['desc', undefined]],
      ['single', true, false, false, ['desc', undefined]],
      ['single', false, true, false, [undefined, undefined]],
      ['single', false, false, true, [undefined, undefined]],
      ['multiple', false, false, false, ['desc', 0]],
      ['multiple', true, false, false, ['desc', 0]],
      ['multiple', false, true, false, [undefined, undefined]],
      ['multiple', false, false, true, [undefined, undefined]],
    ] as [string, boolean, boolean, boolean, [string | undefined, number | undefined]][]
  ).forEach(([mode, shift, ctrl, meta, [titleSortOrder, titleSortIndex]]) => {
    test(`Change sorting of sorted item in ${mode} mode with shift=${shift}, ctrl=${ctrl}, meta=${meta}`, async ({ page }) => {
      await createWidget(page, 'dxCardView', {
        dataSource: data,
        sorting: { mode },
        columns: [{ dataField: 'title' }, { dataField: 'name' }],
      });

      const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
      await titleHeader.click();
      await titleHeader.click({ modifiers: [...(shift ? ['Shift'] : []), ...(ctrl ? ['Control'] : []), ...(meta ? ['Meta'] : [])] as any });

      const actualSortOrder = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortOrder'));
      const actualSortIndex = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortIndex'));

      expect(actualSortOrder).toBe(titleSortOrder);
      expect(actualSortIndex).toBe(titleSortIndex);
    });
  });

  (
    [
      ['none', false, false, false, [undefined, undefined], [undefined, undefined]],
      ['none', true, false, false, [undefined, undefined], [undefined, undefined]],
      ['none', false, true, false, [undefined, undefined], [undefined, undefined]],
      ['none', false, false, true, [undefined, undefined], [undefined, undefined]],
      ['single', false, false, false, [undefined, undefined], ['asc', undefined]],
      ['single', true, false, false, [undefined, undefined], ['asc', undefined]],
      ['single', false, true, false, ['asc', undefined], [undefined, undefined]],
      ['single', false, false, true, ['asc', undefined], [undefined, undefined]],
      ['multiple', false, false, false, [undefined, undefined], ['asc', 0]],
      ['multiple', true, false, false, ['asc', 0], ['asc', 1]],
      ['multiple', false, true, false, ['asc', 0], [undefined, undefined]],
      ['multiple', false, false, true, ['asc', 0], [undefined, undefined]],
    ] as [string, boolean, boolean, boolean, [string | undefined, number | undefined], [string | undefined, number | undefined]][]
  ).forEach(([mode, shift, ctrl, meta, [titleSortOrder, titleSortIndex], [nameSortOrder, nameSortIndex]]) => {
    test(`Change sorting of neighbour non sorted item in ${mode} mode with shift=${shift}, ctrl=${ctrl}, meta=${meta}`, async ({ page }) => {
      await createWidget(page, 'dxCardView', {
        dataSource: data,
        sorting: { mode },
        columns: [{ dataField: 'title' }, { dataField: 'name' }],
      });

      const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
      const nameHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(1);
      await titleHeader.click();
      await nameHeader.click({ modifiers: [...(shift ? ['Shift'] : []), ...(ctrl ? ['Control'] : []), ...(meta ? ['Meta'] : [])] as any });

      const actualTitleSortOrder = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortOrder'));
      const actualTitleSortIndex = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortIndex'));
      const actualNameSortOrder = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('name', 'sortOrder'));
      const actualNameSortIndex = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('name', 'sortIndex'));

      expect(actualTitleSortOrder).toBe(titleSortOrder);
      expect(actualTitleSortIndex).toBe(titleSortIndex);
      expect(actualNameSortOrder).toBe(nameSortOrder);
      expect(actualNameSortIndex).toBe(nameSortIndex);
    });
  });

  const SORT_ASCENDING_MENUITEM_INDEX = 0;
  const SORT_DESCENDING_MENUITEM_INDEX = 1;
  const CLEAR_SORTING_MENUITEM_INDEX = 2;

  (
    [
      ['none', SORT_ASCENDING_MENUITEM_INDEX, [undefined, undefined]],
      ['none', SORT_DESCENDING_MENUITEM_INDEX, [undefined, undefined]],
      ['none', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined]],
      ['single', SORT_ASCENDING_MENUITEM_INDEX, ['asc', undefined]],
      ['single', SORT_DESCENDING_MENUITEM_INDEX, ['desc', undefined]],
      ['single', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined]],
      ['multiple', SORT_ASCENDING_MENUITEM_INDEX, ['asc', 0]],
      ['multiple', SORT_DESCENDING_MENUITEM_INDEX, ['desc', 0]],
      ['multiple', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined]],
    ] as [string, number, [string | undefined, number | undefined]][]
  ).forEach(([mode, menuItemIndex, [titleSortOrder, titleSortIndex]]) => {
    test(`Change sorting of sorted item in ${mode} mode with ${menuItemIndex} context menu item`, async ({ page }) => {
      await createWidget(page, 'dxCardView', {
        dataSource: data,
        sorting: { mode },
        columns: [{ dataField: 'title' }, { dataField: 'name' }],
      });

      const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
      await titleHeader.click({ button: 'right' });
      await page.locator('.dx-context-menu .dx-menu-item').nth(menuItemIndex).click();

      const actualSortOrder = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortOrder'));
      const actualSortIndex = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortIndex'));

      expect(actualSortOrder).toBe(titleSortOrder);
      expect(actualSortIndex).toBe(titleSortIndex);

      await page.locator('body').click();
      await expect(page.locator('.dx-context-menu')).not.toBeVisible();
    });
  });

  (
    [
      ['none', false, false, false, [undefined, undefined], [undefined, undefined]],
      ['none', true, false, false, [undefined, undefined], [undefined, undefined]],
      ['none', false, true, false, [undefined, undefined], [undefined, undefined]],
      ['none', false, false, true, [undefined, undefined], [undefined, undefined]],
      ['single', false, false, false, [undefined, undefined], ['desc', undefined]],
      ['single', true, false, false, [undefined, undefined], ['desc', undefined]],
      ['single', false, true, false, [undefined, undefined], [undefined, undefined]],
      ['single', false, false, true, [undefined, undefined], [undefined, undefined]],
      ['multiple', false, false, false, [undefined, undefined], ['desc', 0]],
      ['multiple', true, false, false, ['asc', 0], ['desc', 1]],
      ['multiple', false, true, false, ['asc', 0], [undefined, undefined]],
      ['multiple', false, false, true, ['asc', 0], [undefined, undefined]],
    ] as [string, boolean, boolean, boolean, [string | undefined, number | undefined], [string | undefined, number | undefined]][]
  ).forEach(([mode, shift, ctrl, meta, [titleSortOrder, titleSortIndex], [nameSortOrder, nameSortIndex]]) => {
    test(`Change sorting of neighbour sorted item in ${mode} mode with shift=${shift}, ctrl=${ctrl}, meta=${meta}`, async ({ page }) => {
      await createWidget(page, 'dxCardView', {
        dataSource: data,
        sorting: { mode },
        columns: [{ dataField: 'title' }, { dataField: 'name' }],
      });

      const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
      const nameHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(1);
      await titleHeader.click();
      await nameHeader.click({ modifiers: ['Shift'] });
      await nameHeader.click({ modifiers: [...(shift ? ['Shift'] : []), ...(ctrl ? ['Control'] : []), ...(meta ? ['Meta'] : [])] as any });

      const actualTitleSortOrder = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortOrder'));
      const actualTitleSortIndex = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortIndex'));
      const actualNameSortOrder = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('name', 'sortOrder'));
      const actualNameSortIndex = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('name', 'sortIndex'));

      expect(actualTitleSortOrder).toBe(titleSortOrder);
      expect(actualTitleSortIndex).toBe(titleSortIndex);
      expect(actualNameSortOrder).toBe(nameSortOrder);
      expect(actualNameSortIndex).toBe(nameSortIndex);
    });
  });

  (
    [
      ['none', SORT_ASCENDING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
      ['none', SORT_DESCENDING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
      ['none', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
      ['single', SORT_ASCENDING_MENUITEM_INDEX, [undefined, undefined], ['asc', undefined]],
      ['single', SORT_DESCENDING_MENUITEM_INDEX, [undefined, undefined], ['desc', undefined]],
      ['single', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
      ['multiple', SORT_ASCENDING_MENUITEM_INDEX, ['asc', 0], ['asc', 1]],
      ['multiple', SORT_DESCENDING_MENUITEM_INDEX, ['asc', 0], ['desc', 1]],
      ['multiple', CLEAR_SORTING_MENUITEM_INDEX, ['asc', 0], [undefined, undefined]],
    ] as [string, number, [string | undefined, number | undefined], [string | undefined, number | undefined]][]
  ).forEach(([mode, menuItemIndex, [titleSortOrder, titleSortIndex], [nameSortOrder, nameSortIndex]]) => {
    test(`Change sorting of neighbour sorted item in ${mode} mode with ${menuItemIndex} context menu item`, async ({ page }) => {
      await createWidget(page, 'dxCardView', {
        dataSource: data,
        sorting: { mode },
        columns: [{ dataField: 'title' }, { dataField: 'name' }],
      });

      const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
      const nameHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(1);
      await titleHeader.click();
      await nameHeader.click({ modifiers: ['Shift'] });
      await nameHeader.click({ button: 'right' });
      await page.locator('.dx-context-menu .dx-menu-item').nth(menuItemIndex as number).click();

      const actualTitleSortOrder = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortOrder'));
      const actualTitleSortIndex = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortIndex'));
      const actualNameSortOrder = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('name', 'sortOrder'));
      const actualNameSortIndex = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('name', 'sortIndex'));

      expect(actualTitleSortOrder).toBe(titleSortOrder);
      expect(actualTitleSortIndex).toBe(titleSortIndex);
      expect(actualNameSortOrder).toBe(nameSortOrder);
      expect(actualNameSortIndex).toBe(nameSortIndex);

      await page.locator('body').click();
      await expect(page.locator('.dx-context-menu')).not.toBeVisible();
    });
  });

  (
    [
      ['none', SORT_ASCENDING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
      ['none', SORT_DESCENDING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
      ['none', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
      ['single', SORT_ASCENDING_MENUITEM_INDEX, [undefined, undefined], ['asc', undefined]],
      ['single', SORT_DESCENDING_MENUITEM_INDEX, [undefined, undefined], ['desc', undefined]],
      ['single', CLEAR_SORTING_MENUITEM_INDEX, [undefined, undefined], [undefined, undefined]],
      ['multiple', SORT_ASCENDING_MENUITEM_INDEX, ['asc', 0], ['asc', 1]],
      ['multiple', SORT_DESCENDING_MENUITEM_INDEX, ['asc', 0], ['desc', 1]],
      ['multiple', CLEAR_SORTING_MENUITEM_INDEX, ['asc', 0], [undefined, undefined]],
    ] as [string, number, [string | undefined, number | undefined], [string | undefined, number | undefined]][]
  ).forEach(([mode, menuItemIndex, [titleSortOrder, titleSortIndex], [nameSortOrder, nameSortIndex]]) => {
    test(`Change sorting of neighbour non sorted item in ${mode} mode with ${menuItemIndex} context menu item`, async ({ page }) => {
      await createWidget(page, 'dxCardView', {
        dataSource: data,
        sorting: { mode },
        columns: [{ dataField: 'title' }, { dataField: 'name' }],
      });

      const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
      const nameHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(1);
      await titleHeader.click();
      await nameHeader.click({ button: 'right' });
      await page.locator('.dx-context-menu .dx-menu-item').nth(menuItemIndex).click();

      const actualTitleSortOrder = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortOrder'));
      const actualTitleSortIndex = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('title', 'sortIndex'));
      const actualNameSortOrder = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('name', 'sortOrder'));
      const actualNameSortIndex = await page.evaluate(() => ($('#container') as any).dxCardView('instance').columnOption('name', 'sortIndex'));

      expect(actualTitleSortOrder).toBe(titleSortOrder);
      expect(actualTitleSortIndex).toBe(titleSortIndex);
      expect(actualNameSortOrder).toBe(nameSortOrder);
      expect(actualNameSortIndex).toBe(nameSortIndex);

      await page.locator('body').click();
      await expect(page.locator('.dx-context-menu')).not.toBeVisible();
    });
  });

  test('Change sorting via context menu', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: data,
      sorting: { mode: 'single' },
      columns: [{ dataField: 'title' }, { dataField: 'name' }],
    });

    const titleHeader = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await titleHeader.click({ button: 'right' });
    await page.locator('.dx-context-menu .dx-menu-item').nth(0).click();

    const sortOrder = await page.evaluate(() => {
      return ($('#container') as any).dxCardView('instance').columnOption('title', 'sortOrder');
    });
    expect(sortOrder).toBe('asc');
  });
});
