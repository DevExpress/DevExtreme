import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const openHeaderFilter = async (page: any) => {
  const filterIcon = page.locator('.dx-header-row').nth(0).locator('td').nth(0).locator('.dx-header-filter');
  await filterIcon.click();
  await expect(page.locator('.dx-header-filter-menu')).toBeVisible();
};

const getCheckBoxState = async (page: any, index: number): Promise<string> => {
  const checkbox = page.locator('.dx-header-filter-menu .dx-list-item').nth(index).locator('.dx-checkbox');
  const checkedAttr = await checkbox.getAttribute('aria-checked');
  if (checkedAttr === 'true') return 'checked';
  if (checkedAttr === 'false') return 'unchecked';
  return 'indeterminate';
};

const getSelectAllState = async (page: any): Promise<string> => {
  const selectAllCheckbox = page.locator('.dx-header-filter-menu .dx-list-select-all .dx-checkbox');
  const checkedAttr = await selectAllCheckbox.getAttribute('aria-checked');
  if (checkedAttr === 'true') return 'checked';
  if (checkedAttr === 'false') return 'unchecked';
  return 'indeterminate';
};

const isItemSelected = async (page: any, index: number): Promise<boolean> => {
  const item = page.locator('.dx-header-filter-menu .dx-list-item').nth(index);
  return (await item.getAttribute('aria-selected')) === 'true';
};

test.describe('Header Filter - dxList integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should has unchecked "Select all" checkbox state if no values is selected', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0 }, { id: 1 }],
      keyExpr: 'id',
      columns: [{ dataField: 'id', filterValues: [] }],
      headerFilter: { visible: true },
    });

    await openHeaderFilter(page);

    expect(await getSelectAllState(page)).toBe('unchecked');
    expect(await isItemSelected(page, 0)).toBe(false);
    expect(await isItemSelected(page, 1)).toBe(false);
  });

  test('Should has checked "Select all" checkbox state if all values selected', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0 }, { id: 1 }],
      keyExpr: 'id',
      columns: [{ dataField: 'id', filterType: 'exclude', filterValues: [] }],
      headerFilter: { visible: true },
    });

    await openHeaderFilter(page);

    expect(await getSelectAllState(page)).toBe('checked');
    expect(await isItemSelected(page, 0)).toBe(true);
    expect(await isItemSelected(page, 1)).toBe(true);
  });

  test('Should has indeterminate "Select all" checkbox state if only part of values selected', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0 }, { id: 1 }],
      keyExpr: 'id',
      columns: [{ dataField: 'id', filterValues: [0] }],
      headerFilter: { visible: true },
    });

    await openHeaderFilter(page);

    expect(await getSelectAllState(page)).toBe('indeterminate');
    expect(await isItemSelected(page, 0)).toBe(true);
    expect(await isItemSelected(page, 1)).toBe(false);
  });

  test('Should has indeterminate "Select all" checkbox state if part of values excluded', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0 }, { id: 1 }],
      keyExpr: 'id',
      columns: [{ dataField: 'id', filterType: 'exclude', filterValues: [1] }],
      headerFilter: { visible: true },
    });

    await openHeaderFilter(page);

    expect(await getSelectAllState(page)).toBe('indeterminate');
    expect(await isItemSelected(page, 0)).toBe(true);
    expect(await isItemSelected(page, 1)).toBe(false);
  });

  test('Should select all values after unchecked "Select all" click', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0 }, { id: 1 }],
      keyExpr: 'id',
      columns: [{ dataField: 'id', filterValues: [] }],
      headerFilter: { visible: true },
    });

    await openHeaderFilter(page);

    const selectAllCheckbox = page.locator('.dx-header-filter-menu .dx-list-select-all .dx-checkbox');
    await selectAllCheckbox.click();

    expect(await getSelectAllState(page)).toBe('checked');
    expect(await isItemSelected(page, 0)).toBe(true);
    expect(await isItemSelected(page, 1)).toBe(true);
  });

  test('Should unselect all values after checked "Select all" click', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0 }, { id: 1 }],
      keyExpr: 'id',
      columns: [{ dataField: 'id', filterType: 'exclude', filterValues: [] }],
      headerFilter: { visible: true },
    });

    await openHeaderFilter(page);

    const selectAllCheckbox = page.locator('.dx-header-filter-menu .dx-list-select-all .dx-checkbox');
    await selectAllCheckbox.click();

    expect(await getSelectAllState(page)).toBe('unchecked');
    expect(await isItemSelected(page, 0)).toBe(false);
    expect(await isItemSelected(page, 1)).toBe(false);
  });

  test('Should select all values after indeterminate "Select all" click', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0 }, { id: 1 }],
      keyExpr: 'id',
      columns: [{ dataField: 'id', filterValues: [0] }],
      headerFilter: { visible: true },
    });

    await openHeaderFilter(page);

    const selectAllCheckbox = page.locator('.dx-header-filter-menu .dx-list-select-all .dx-checkbox');
    await selectAllCheckbox.click();

    expect(await getSelectAllState(page)).toBe('checked');
    expect(await isItemSelected(page, 0)).toBe(true);
    expect(await isItemSelected(page, 1)).toBe(true);
  });

  test('Should change "Select all" to checked after selecting all values [T1293295]', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0 }, { id: 1 }],
      keyExpr: 'id',
      columns: [{ dataField: 'id', filterValues: [] }],
      headerFilter: { visible: true },
    });

    await openHeaderFilter(page);

    const listItems = page.locator('.dx-header-filter-menu .dx-list-item');
    await listItems.nth(0).click();
    await listItems.nth(1).click();

    expect(await getSelectAllState(page)).toBe('checked');
    expect(await isItemSelected(page, 0)).toBe(true);
    expect(await isItemSelected(page, 1)).toBe(true);
  });

  test('Should change "Select all" to unchecked after unselecting all values', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0 }, { id: 1 }],
      keyExpr: 'id',
      columns: [{ dataField: 'id', filterValues: [0, 1] }],
      headerFilter: { visible: true },
    });

    await openHeaderFilter(page);

    const listItems = page.locator('.dx-header-filter-menu .dx-list-item');
    await listItems.nth(0).click();
    await listItems.nth(1).click();

    expect(await getSelectAllState(page)).toBe('unchecked');
    expect(await isItemSelected(page, 0)).toBe(false);
    expect(await isItemSelected(page, 1)).toBe(false);
  });

  test('Should change "Select all" to indeterminate after unselecting one value', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0 }, { id: 1 }],
      keyExpr: 'id',
      columns: [{ dataField: 'id', filterValues: [0, 1] }],
      headerFilter: { visible: true },
    });

    await openHeaderFilter(page);

    const listItems = page.locator('.dx-header-filter-menu .dx-list-item');
    await listItems.nth(0).click();

    expect(await getSelectAllState(page)).toBe('indeterminate');
    expect(await isItemSelected(page, 0)).toBe(false);
    expect(await isItemSelected(page, 1)).toBe(true);
  });

  test.skip('Should has unchecked "Select all" checkbox state if no values is selected (original skip)', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (t parameter, dataGrid undefined, t.click, t.eql)
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterValues: [] },
      ],
      headerFilter: { visible: true },
    });

      const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

    expect(await list.selectAll.checkBox.getCheckBoxState());
    await t.eql('unchecked');
    expect(await firstListItem.isSelected);
    await t.notOk();
    expect(await secondListItem.isSelected);
    await t.notOk();
  });
});
