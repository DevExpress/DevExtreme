import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('DataGrid Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  fixture
    .disablePageReloads`Keyboard Navigation - editOnKeyPress`
    .page(url(__dirname, '../../../container.html'));

  [
    { name: 'input', template: () => $('<input>') },
    { name: 'div', template: () => $('<div>').text('Hi, I\'m the template!') },
  ].forEach(({ name, template }) => {

  test(`should render edit cell template without errors, template: ${name}`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
          dataSource: [
            {
              data_A: 'data_A',
              data_B: 'data_B',
            },
          ],
          columns: [
            {
              dataField: 'data_A',
              editCellTemplate: template,
            },
            'data_B',
          ],
          keyboardNavigation: {
            enabled: true,
            editOnKeyPress: true,
            enterKeyDirection: 'column',
          },
          editing: {
            mode: 'cell',
            allowUpdating: true,
            allowAdding: true,
            startEditAction: 'dblClick',
          },
          // @ts-expect-error private option
          templatesRenderAsynchronously: true,
        });
        await makeRowsViewTemplatesAsync(DATA_GRID_SELECTOR);

          const dataCell = page.locator('.dx-data-row').nth(0).locator('td').nth(0);

      await (dataCell.element).click()
        .pressKey('f');

      await testScreenshot(page, `edit-cell-keypress-with-custom-cell-template_template-${name}.png`, { element: page.locator('#container') });
    });
});
