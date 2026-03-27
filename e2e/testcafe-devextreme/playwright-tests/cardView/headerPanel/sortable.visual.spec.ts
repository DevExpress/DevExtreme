import { test, expect, type Locator } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const PARENT_CONTAINER = '#parentContainer';
const PARENT_STYLES = `${PARENT_CONTAINER} { width: 400px; padding: 0 20px; }`;
const DRAG_MOVE_X_COEFFICIENT = 1.5;
const DRAG_MOVE_Y_COEFFICIENT = 1;

async function getDragCoordinates(
  element: Locator,
  rtlEnabled: boolean,
  direction: 'left' | 'right',
): Promise<{ dragOffsetX: number; dragOffsetY: number }> {
  const box = await element.boundingBox();
  const itemWidth = box?.width ?? 0;
  const itemHeight = box?.width ?? 0;

  const dragDirectionX = direction === 'left' ? -1 : 1;
  const dragRtlDirection = rtlEnabled ? -1 : 1;
  const dragOffsetX = Math.round(dragDirectionX * dragRtlDirection * DRAG_MOVE_X_COEFFICIENT * itemWidth);
  const dragOffsetY = Math.round(DRAG_MOVE_Y_COEFFICIENT * itemHeight);

  return { dragOffsetX, dragOffsetY };
}

test.describe('CardView - HeaderPanel Sortable Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('sortable indicator during dragging', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, name: 'Item 1', value: 10 },
        { id: 2, name: 'Item 2', value: 20 },
        { id: 3, name: 'Item 3', value: 30 },
      ],
      keyExpr: 'id',
      headerPanel: {
        visible: true,
        allowColumnReordering: true,
      },
      columns: [
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    const headerPanel = page.locator('.dx-cardview-headers');
    await expect(headerPanel).toBeVisible();

    const firstItem = headerPanel.locator('.dx-cardview-header-item').first();
    const box = await firstItem.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2, { steps: 5 });

      await testScreenshot(page, 'cardview-sortable-indicator-during-drag.png');

      await page.mouse.up();
    }
  });

  test('sortable indicator during dragging to first place', async ({ page }) => {
    await insertStylesheetRulesToPage(page, PARENT_STYLES);
    await createWidget(page, 'dxCardView', {
      columns: ['Field A', 'Field B', 'Field C'],
      allowColumnReordering: true,
      rtlEnabled: false,
      width: 360,
    });

    const item = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(1);
    const box = await item.boundingBox();
    if (box) {
      const { dragOffsetX, dragOffsetY } = await getDragCoordinates(item, false, 'left');
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + dragOffsetX, box.y + box.height / 2 + dragOffsetY, { steps: 5 });
      await page.evaluate(() => { (document.activeElement as HTMLElement | null)?.blur(); });
    }

    await testScreenshot(page, 'sortable-indicator-first-rtl-false.png', {
      element: page.locator(PARENT_CONTAINER),
    });

    await page.mouse.up();
  });

  test('sortable indicator during dragging to middle place', async ({ page }) => {
    await insertStylesheetRulesToPage(page, PARENT_STYLES);
    await createWidget(page, 'dxCardView', {
      columns: ['Field A', 'Field B', 'Field C'],
      allowColumnReordering: true,
      rtlEnabled: false,
      width: 360,
    });

    const item = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(0);
    const box = await item.boundingBox();
    if (box) {
      const { dragOffsetX, dragOffsetY } = await getDragCoordinates(item, false, 'right');
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + dragOffsetX, box.y + box.height / 2 + dragOffsetY, { steps: 5 });
      await page.evaluate(() => { (document.activeElement as HTMLElement | null)?.blur(); });
    }

    await testScreenshot(page, 'sortable-indicator-middle-rtl-false.png', {
      element: page.locator(PARENT_CONTAINER),
    });

    await page.mouse.up();
  });

  test('sortable indicator during dragging to last place', async ({ page }) => {
    await insertStylesheetRulesToPage(page, PARENT_STYLES);
    await createWidget(page, 'dxCardView', {
      columns: ['Field A', 'Field B', 'Field C'],
      allowColumnReordering: true,
      rtlEnabled: false,
      width: 360,
    });

    const item = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(1);
    const box = await item.boundingBox();
    if (box) {
      const { dragOffsetX, dragOffsetY } = await getDragCoordinates(item, false, 'right');
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + dragOffsetX, box.y + box.height / 2 + dragOffsetY, { steps: 5 });
      await page.evaluate(() => { (document.activeElement as HTMLElement | null)?.blur(); });
    }

    await testScreenshot(page, 'sortable-indicator-last-rtl-false.png', {
      element: page.locator(PARENT_CONTAINER),
    });

    await page.mouse.up();
  });

  test('sortable indicator during dragging to first place (RTL)', async ({ page }) => {
    await insertStylesheetRulesToPage(page, PARENT_STYLES);
    await createWidget(page, 'dxCardView', {
      columns: ['Field A', 'Field B', 'Field C'],
      allowColumnReordering: true,
      rtlEnabled: true,
      width: 360,
    });

    const item = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(1);
    const box = await item.boundingBox();
    if (box) {
      const { dragOffsetX, dragOffsetY } = await getDragCoordinates(item, true, 'left');
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + dragOffsetX, box.y + box.height / 2 + dragOffsetY, { steps: 5 });
      await page.evaluate(() => { (document.activeElement as HTMLElement | null)?.blur(); });
    }

    await testScreenshot(page, 'sortable-indicator-first-rtl-true.png', {
      element: page.locator(PARENT_CONTAINER),
    });

    await page.mouse.up();
  });

  test('sortable indicator during dragging to middle place (RTL)', async ({ page }) => {
    await insertStylesheetRulesToPage(page, PARENT_STYLES);
    await createWidget(page, 'dxCardView', {
      columns: ['Field A', 'Field B', 'Field C'],
      allowColumnReordering: true,
      rtlEnabled: true,
      width: 360,
    });

    const item = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(0);
    const box = await item.boundingBox();
    if (box) {
      const { dragOffsetX, dragOffsetY } = await getDragCoordinates(item, true, 'right');
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + dragOffsetX, box.y + box.height / 2 + dragOffsetY, { steps: 5 });
      await page.evaluate(() => { (document.activeElement as HTMLElement | null)?.blur(); });
    }

    await testScreenshot(page, 'sortable-indicator-middle-rtl-true.png', {
      element: page.locator(PARENT_CONTAINER),
    });

    await page.mouse.up();
  });

  test('sortable indicator during dragging to last place (RTL)', async ({ page }) => {
    await insertStylesheetRulesToPage(page, PARENT_STYLES);
    await createWidget(page, 'dxCardView', {
      columns: ['Field A', 'Field B', 'Field C'],
      allowColumnReordering: true,
      rtlEnabled: true,
      width: 360,
    });

    const item = page.locator('.dx-cardview-headers .dx-cardview-header-item').nth(1);
    const box = await item.boundingBox();
    if (box) {
      const { dragOffsetX, dragOffsetY } = await getDragCoordinates(item, true, 'right');
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + dragOffsetX, box.y + box.height / 2 + dragOffsetY, { steps: 5 });
      await page.evaluate(() => { (document.activeElement as HTMLElement | null)?.blur(); });
    }

    await testScreenshot(page, 'sortable-indicator-last-rtl-true.png', {
      element: page.locator(PARENT_CONTAINER),
    });

    await page.mouse.up();
  });
});
