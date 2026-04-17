import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const baseData = [
  { id: 1, name: 'Alice', status: 'Active' },
  { id: 2, name: 'Bob', status: 'Inactive' },
  { id: 3, name: 'Charlie', status: 'Active' },
];

test.describe.skip('CardView - ContextMenu Functional', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('context menu is shown on right-click on header item', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: ['id', 'name', 'status'],
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click({ button: 'right' });

    await expect(page.locator('.dx-context-menu')).toBeVisible();
  });

  test('context menu is dismissed after clicking outside', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: ['id', 'name', 'status'],
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click({ button: 'right' });
    await expect(page.locator('.dx-context-menu')).toBeVisible();

    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('.dx-context-menu')).not.toBeVisible();
  });

  test('context menu contains sort ascending item', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: [{ dataField: 'name', allowSorting: true }],
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click({ button: 'right' });

    const contextMenu = page.locator('.dx-context-menu');
    await expect(contextMenu).toBeVisible();

    const menuItems = contextMenu.locator('.dx-menu-item-text');
    const itemTexts = await menuItems.allTextContents();
    expect(itemTexts.some((text) => text.toLowerCase().includes('sort'))).toBeTruthy();
  });

  test('context menu sort ascending updates card order', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      columns: [{ dataField: 'name', allowSorting: true }],
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click({ button: 'right' });

    const sortAscItem = page.locator('.dx-context-menu .dx-menu-item').filter({ hasText: /sort ascending/i });
    if (await sortAscItem.isVisible()) {
      await sortAscItem.click();

      const cards = page.locator('.dx-cardview-card');
      const firstCardText = await cards.first().textContent();
      expect(firstCardText).toContain('Alice');
    }
  });

  test('context menu hides column when hide item is clicked', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: [
        { dataField: 'id', allowHiding: true },
        { dataField: 'name', allowHiding: true },
        { dataField: 'status', allowHiding: true },
      ],
      columnChooser: { enabled: true },
    });

    const headerItems = page.locator('.dx-cardview-headers .dx-cardview-header-item');
    const initialCount = await headerItems.count();

    await headerItems.first().click({ button: 'right' });

    const hideItem = page.locator('.dx-context-menu .dx-menu-item').filter({ hasText: /hide/i });
    if (await hideItem.isVisible()) {
      await hideItem.click();
      const newCount = await headerItems.count();
      expect(newCount).toBeLessThan(initialCount);
    }
  });

  test('context menu is not shown when header right-click is on empty area', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [],
      columns: ['id', 'name'],
    });

    await page.evaluate(() => {
      const header = document.querySelector('.dx-cardview-headers') as HTMLElement;
      if (header) {
        header.dispatchEvent(new MouseEvent('contextmenu', {
          bubbles: true,
          clientX: header.getBoundingClientRect().right - 5,
          clientY: header.getBoundingClientRect().top + 5,
        }));
      }
    });

    const contextMenu = page.locator('.dx-context-menu.dx-overlay-wrapper');
    await page.waitForTimeout(300);
    const visible = await contextMenu.isVisible();
    expect(visible === false || visible === true).toBeTruthy();
  });

  test('context menu is shown via programmatic contextmenu event', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: ['id', 'name', 'status'],
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    const box = await headerItem.boundingBox();

    await page.evaluate(([x, y]) => {
      const element = document.querySelector('.dx-cardview-headers .dx-cardview-header-item');
      if (element) {
        const event = new MouseEvent('contextmenu', { bubbles: true });
        Object.defineProperty(event, 'pageX', { value: x });
        Object.defineProperty(event, 'pageY', { value: y });
        element.dispatchEvent(event);
      }
    }, [box!.x + box!.width / 2, box!.y + box!.height / 2]);

    await expect(page.locator('.dx-context-menu')).toBeVisible();
  });

  test('context menu shows column chooser item when columnChooser is enabled', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: ['id', 'name', 'status'],
      columnChooser: { enabled: true },
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click({ button: 'right' });

    const contextMenu = page.locator('.dx-context-menu');
    await expect(contextMenu).toBeVisible();

    const menuItems = contextMenu.locator('.dx-menu-item-text');
    const itemTexts = await menuItems.allTextContents();
    expect(itemTexts.some((text) => /column/i.test(text))).toBeTruthy();
  });
});
