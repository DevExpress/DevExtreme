import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - filterBuilder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', { fields: [{ dataField: 'CompanyName', caption: 'Company Name' }, { dataField: 'City', caption: 'City' }], value: ['CompanyName', 'contains', 'Dev'] });
    await a11yCheck(page, {}, '#container');
  });

  test('filterBuilder without filter value', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', { fields: [{ dataField: 'CompanyName', caption: 'Company Name' }, { dataField: 'City', caption: 'City' }] });
    await a11yCheck(page, {}, '#container');
  });

  test('filterBuilder with multiple conditions', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields: [
        { dataField: 'CompanyName', caption: 'Company Name' },
        { dataField: 'City', caption: 'City' },
        { dataField: 'State', caption: 'State' },
      ],
      value: [['CompanyName', 'contains', 'Dev'], 'and', ['City', '=', 'New York']],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('filterBuilder with number field', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields: [{ dataField: 'Age', caption: 'Age', dataType: 'number' }],
      value: ['Age', '>', 18],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('filterBuilder with date field', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields: [{ dataField: 'BirthDate', caption: 'Birth Date', dataType: 'date' }],
      value: ['BirthDate', '>', new Date(1990, 0, 1)],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('filterBuilder with boolean field', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields: [{ dataField: 'Active', caption: 'Active', dataType: 'boolean' }],
      value: ['Active', '=', true],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('filterBuilder with OR group condition', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields: [
        { dataField: 'CompanyName', caption: 'Company Name' },
        { dataField: 'City', caption: 'City' },
      ],
      value: [['CompanyName', 'contains', 'Dev'], 'or', ['City', '=', 'London']],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('filterBuilder with single field no value', async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields: [{ dataField: 'Name', caption: 'Name' }],
    });
    await a11yCheck(page, {}, '#container');
  });
});
