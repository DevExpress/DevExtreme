import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import { fields, filter } from './data';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('FilterBuilder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Field dropdown popup', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
      allowHierarchicalFields: true,
    });

    await page.locator('#container .dx-filterbuilder-item-field').first().click();

    await testScreenshot(page, 'field-dropdown.png', { element: '#container' });
  });

  test('operation dropdown popup', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
      allowHierarchicalFields: true,
    });

    await page.locator('#container .dx-filterbuilder-item-operation').first().click();

    await testScreenshot(page, 'operation-dropdown.png', { element: '#container' });
  });

  test('Dropdown Treeview should have no empty space', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
      allowHierarchicalFields: true,
    });

    await page.locator('#container .dx-filterbuilder-action-icon').first().click();

    await testScreenshot(page, 'dropdown-space.png', { element: '#container' });
  });

  [
    { dataType: 'date' as const, value: 1740441600000 },
    { dataType: 'date' as const, value: '2025-02-25T00:00:00.000Z' },
    { dataType: 'date' as const, value: new Date('2025-02-25T00:00:00.000Z') },
    { dataType: 'datetime' as const, value: 1740441600000 },
    { dataType: 'datetime' as const, value: '2025-02-25T00:00:00.000Z' },
    { dataType: 'datetime' as const, value: new Date('2025-02-25T00:00:00.000Z') },
  ].forEach(({ dataType, value }) => {
    test(`item value text should be correct for dataType: ${dataType} and valueType: ${typeof value}`, async ({ page }) => {
      await createWidget(page, 'dxFilterBuilder', {
        fields: [
          {
            dataField: 'field1',
            dataType,
          },
        ],
        value: ['field1', '=', value],
      });

      const date = new Date(value);
      const dateString = date.toLocaleDateString();
      const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' });

      const expectedValue = dataType === 'date' ? dateString : `${dateString}, ${timeString}`;

      const valueText = await page.locator('#container .dx-filterbuilder-item-value-text').first().textContent();
      expect(valueText).toBe(expectedValue);
    });
  });
});
