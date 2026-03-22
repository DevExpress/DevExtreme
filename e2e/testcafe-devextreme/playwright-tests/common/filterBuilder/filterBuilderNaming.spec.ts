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

  // T1253754
  test('FilterBuilder - First field uses the dataField property while subsequent fields use the name property in the filter value', async ({ page }) => {

      await createWidget(page, 'dxFilterBuilder', {
        value: [
          ['dataField1', '<>', 0],
        ],
        fields: [
          { dataField: 'dataField1', name: 'name1' },
          { dataField: 'dataField2', name: 'name2' },
        ],
      });


    const filterBuilder = page.locator('#container');

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
    await page.click(filterBuilder.getAddButton())
      .expect(FilterBuilder.getPopupTreeView().visible).ok()
      .click(FilterBuilder.getPopupTreeViewNode(0))
      .click(filterBuilder.getField(1, 'itemValue').element)
      .pressKey('A enter');

    await page.expect(await filterBuilder.option('value'))
      .eql(expectedValues[0]);

    await filterBuilder.getField(1, 'item').element.click()
      .expect(FilterBuilder.getPopupTreeView().visible).ok()
      .click(FilterBuilder.getPopupTreeViewNode(1))
      .click(filterBuilder.getField(1, 'itemValue').element)
      .pressKey('A enter');

    await page.expect(await filterBuilder.option('value'))
      .eql(expectedValues[1]);

    });
});
