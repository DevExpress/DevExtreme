import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../tests/container.html');

test.describe('CardView - Items functional', () => {
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
});
