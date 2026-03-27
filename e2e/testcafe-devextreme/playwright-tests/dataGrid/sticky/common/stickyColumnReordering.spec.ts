import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('Reorder columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Move left fixed column to the right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 25),
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns: any[]) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'left';
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    const firstHeader = page.locator('.dx-header-row').nth(0).locator('td').nth(0);
    const box = await firstHeader.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 400, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    await testScreenshot(page, 'move_left_fixed_column_to_right.png', { element: page.locator('#container') });
  });

  test('Move right fixed column to the left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 25),
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns: any[]) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'right';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'right';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    const dataGrid = new DataGrid(page);
    const lastHeader = page.locator('.dx-header-row').nth(0).locator('td').nth(24);
    const box = await lastHeader.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 400, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    await dataGrid.scrollTo({ x: 0 });

    await testScreenshot(page, 'move_right_fixed_column_to_left.png', { element: page.locator('#container') });
  });

  test("Move fixed column with fixedPosition = 'sticky' to the right", async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 25),
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns: any[]) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';

        columns[3].fixed = true;
        columns[3].fixedPosition = 'sticky';

        columns[15].fixed = true;
        columns[15].fixedPosition = 'right';
        columns[17].fixed = true;
        columns[17].fixedPosition = 'right';
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    const stickyHeader = page.locator('.dx-header-row').nth(0).locator('td').nth(5);
    const box = await stickyHeader.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 200, box.y + box.height / 2, { steps: 10 });
      await page.waitForTimeout(100);
      await page.mouse.up();
    }

    await testScreenshot(page, 'move_fixed_column_with_sticky_position_to_right.png', { element: page.locator('#container') });
  });

  test('Move left fixed band column to the right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 25),
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns: any[]) => {
        columns.push({
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'left',
          columns: ['field_1', 'field_2'],
        }, {
          caption: 'Band column 2',
          fixed: true,
          fixedPosition: 'left',
          columns: ['field_3', 'field_4'],
        });
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    const bandHeader = page.locator('.dx-header-row').nth(1).locator('td').nth(0);
    const box = await bandHeader.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 500, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    await testScreenshot(page, 'move_left_fixed_band_column_to_right.png', { element: page.locator('#container') });
  });

  test('Move right fixed band column to the left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 25),
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns: any[]) => {
        columns.push({
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'right',
          columns: ['field_1', 'field_2'],
        }, {
          caption: 'Band column 2',
          fixed: true,
          fixedPosition: 'right',
          columns: ['field_3', 'field_4'],
        });
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    const dataGrid = new DataGrid(page);
    const bandHeader = page.locator('.dx-header-row').nth(1).locator('td').nth(3);
    const box = await bandHeader.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 500, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    await dataGrid.scrollTo({ x: 0 });

    await testScreenshot(page, 'move_right_fixed_band_column_to_left.png', { element: page.locator('#container') });
  });

  test("Move fixed band column with fixedPosition='sticky' to the right", async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 25),
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns: any[]) => {
        columns.splice(3, 0, {
          caption: 'Band column 1',
          fixed: true,
          fixedPosition: 'sticky',
          columns: ['field_1', 'field_2'],
        });
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    const bandHeader = page.locator('.dx-header-row').nth(1).locator('td').nth(0);
    const box = await bandHeader.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 400, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    await testScreenshot(page, 'move_fixed_band_column_with_sticky_position_to_right.png', { element: page.locator('#container') });
  });

  // visual: generic.light
  // visual: material.blue.light
  // visual: fluent.blue.light
  test('Check the draggable source column while moving the fixed column on the right side (generic.light theme)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 25),
      columnAutoWidth: true,
      allowColumnReordering: true,
      columnWidth: 100,
      customizeColumns: (columns: any[]) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'right';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'right';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    const dataGrid = new DataGrid(page);
    await dataGrid.moveHeader(24, -200, 5, true);

    await testScreenshot(page, 'draggable_source_column_with_fixed_columns.png', { element: page.locator('#container') });
  });
});
