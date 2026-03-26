import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('FilterBuilder - Field naming', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('FilterBuilder - First field uses the dataField property while subsequent fields use the name property in the filter value', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      value: [
        ['dataField1', '<>', 0],
      ],
      fields: [
        { dataField: 'dataField1', name: 'name1' },
        { dataField: 'dataField2', name: 'name2' },
      ],
    });

    const expectedValues = [
      [
        ['name1', '<>', 0],
        'and',
        ['name1', 'contains', 'A'],
      ],
      [
        ['name1', '<>', 0],
        'and',
        ['name2', 'contains', 'A'],
      ],
    ];

    await page.locator('#container .dx-filterbuilder-add-condition').click();
    await page.locator('.dx-treeview-item').first().click();
    await page.locator('#container .dx-filterbuilder-item-value-text').last().click();
    await page.keyboard.type('A');
    await page.keyboard.press('Enter');

    const value1 = await page.evaluate(() =>
      ($('#container') as any).dxFilterBuilder('instance').option('value'),
    );
    expect(value1).toEqual(expectedValues[0]);

    await page.locator('#container .dx-filterbuilder-item-field').last().click();
    await page.locator('.dx-treeview-item').nth(1).click();
    await page.locator('#container .dx-filterbuilder-item-value-text').last().click();
    await page.keyboard.type('A');
    await page.keyboard.press('Enter');

    const value2 = await page.evaluate(() =>
      ($('#container') as any).dxFilterBuilder('instance').option('value'),
    );
    expect(value2).toEqual(expectedValues[1]);
  });
});
