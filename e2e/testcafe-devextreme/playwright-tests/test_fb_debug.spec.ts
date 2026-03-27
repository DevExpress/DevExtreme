import { test, expect } from '@playwright/test';
import { createWidget } from '../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../tests/container.html')}`;

test('debug filterbuilder', async ({ page }) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  
  await createWidget(page, 'dxFilterBuilder', {
    value: [['dataField1', '<>', 0]],
    fields: [
      { dataField: 'dataField1', name: 'name1' },
      { dataField: 'dataField2', name: 'name2' },
    ],
  });

  const classes = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="filterbuilder"]');
    return Array.from(els).map(el => el.className).join('\n');
  });
  
  const addCondEl = await page.locator('#container .dx-filterbuilder-add-condition').count();
  console.log('Add condition count:', addCondEl);
  console.log('CLASSES:', classes.substring(0, 500));
});
