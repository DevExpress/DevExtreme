import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Editing events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Field dropdown popup', async ({ page }) => {

    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
      allowHierarchicalFields: true,
    });

    const filterBuilder = page.locator('#container');
    await filterBuilder.getField(0, 'item').element.click();

    await testScreenshot(page, 'field-dropdown.png', { element: filterBuilder.element });

    });

  test.skip('operation dropdown popup', async ({ page }) => {

    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
      allowHierarchicalFields: true,
    });

    const filterBuilder = page.locator('#container');
    await filterBuilder.getField(0, 'itemOperation').element.click();

    await testScreenshot(page, 'operation-dropdown.png', { element: filterBuilder.element });

    });

  // T1222027
  test.skip('Dropdown Treeview should have no empty space', async ({ page }) => {

    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
      allowHierarchicalFields: true,
    });

    const filterBuilder = page.locator('#container');
    await filterBuilder.getField(0, 'itemAction').element.click();

    await testScreenshot(page, 'dropdown-space.png', { element: filterBuilder.element });

    });

  [
    { dataType: 'date', value: 1740441600000 },
    { dataType: 'date', value: '2025-02-25T00:00:00.000Z' },
    { dataType: 'date', value: new Date('2025-02-25T00:00:00.000Z') },
    { dataType: 'datetime', value: 1740441600000 },
    { dataType: 'datetime', value: '2025-02-25T00:00:00.000Z' },
    { dataType: 'datetime', value: new Date('2025-02-25T00:00:00.000Z') },
  ].forEach(({ dataType, value }) => {
    test.skip(`item value text should be correct for dataType: ${dataType} and valueType: ${typeof value}`, async ({ page }) => {

      await createWidget(page, 'dxFilterBuilder', {
        fields: [
          {
            dataField: 'field1',
            dataType: dataType as DataType,
          },
        ],
        value: ['field1', '=', value],
      });


      const filterBuilder = page.locator('#container');

      const date = new Date(value);
      const dateString = date.toLocaleDateString();
      const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' });

      const expectedValue = dataType === 'date' ? dateString : `${dateString}, ${timeString}`;

      await expect(filterBuilder.getField(0).getValueText().textContent).eql(expectedValue);

    });
  });
});
