import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../tests/container.html');

test.describe.skip('CardView - Items functional', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test("Column should show data from calculateDisplayValue if function's result has other dataType", async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: [{
        dataField: 'activity',
        columnType: 'number',
        calculateDisplayValue(e) {
          return `activity ${e.activity}`;
        },
      }],
      dataSource: [{ id: 1, activity: 1 }],
      keyExpr: 'id',
    });

    const valueCell = page.locator('.dx-cardview-card .dx-cardview-field-value').first();
    await expect(valueCell).toHaveText('activity 1');
  });

  test('Column with customizeText should show formatted value', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: [{
        dataField: 'value',
        customizeText({ value }) {
          return `$${value}`;
        },
      }],
      dataSource: [{ id: 1, value: 100 }],
      keyExpr: 'id',
    });

    const valueCell = page.locator('.dx-cardview-card .dx-cardview-field-value').first();
    await expect(valueCell).toHaveText('$100');
  });

  test('Column with visible: false should not be shown in card', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: [
        { dataField: 'name', visible: true },
        { dataField: 'hidden', visible: false },
      ],
      dataSource: [{ id: 1, name: 'John', hidden: 'secret' }],
      keyExpr: 'id',
    });

    const fields = page.locator('.dx-cardview-card .dx-cardview-field-caption');
    await expect(fields).toHaveCount(1);
    await expect(fields.first()).toHaveText('Name');
  });

  test('Multiple cards render correct values', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: ['name', 'age'],
      dataSource: [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
      ],
      keyExpr: 'id',
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(2);
  });
});
