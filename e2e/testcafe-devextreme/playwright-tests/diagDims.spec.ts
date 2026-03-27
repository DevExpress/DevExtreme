import { test } from '@playwright/test';
import { createWidget } from '../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../tests/container.html')}`;

const getData = (rowCount: number, colCount: number) => {
  const items: any[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: any = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test('virtual columns container width', async ({ page }) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((theme) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), 'fluent.blue.light');
  
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(10, 100),
    columnWidth: 100,
    showColumnLines: true,
    scrolling: {
      columnRenderingMode: 'virtual',
    },
    customizeColumns: (columns: any[]) => {
      columns[0].fixed = true;
      columns[1].fixed = true;
      columns[3].fixed = true;
      columns[3].fixedPosition = 'sticky';
    },
  });
  
  const rect = await page.locator('#container').boundingBox();
  console.log('Container rect:', JSON.stringify(rect));
  
  const ss = await page.locator('#container').screenshot();
  const w = (ss[16] << 24) | (ss[17] << 16) | (ss[18] << 8) | ss[19];
  const h = (ss[20] << 24) | (ss[21] << 16) | (ss[22] << 8) | ss[23];
  console.log('Screenshot size:', w, 'x', h);
  console.log('Etalon expects: 784x539');
});

test('virtual scrolling container width', async ({ page }) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((theme) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), 'fluent.blue.light');
  
  await createWidget(page, 'dxDataGrid', {
    dataSource: getData(400, 15),
    height: 700,
    columnWidth: 100,
    showColumnLines: true,
    scrolling: {
      mode: 'virtual',
      updateTimeout: 3000,
    },
    customizeColumns: (columns: any[]) => {
      columns[0].fixed = true;
      columns[1].fixed = true;
      columns[1].fixedPosition = 'right';
      columns[2].fixed = true;
      columns[2].fixedPosition = 'right';
    },
  });

  const rect = await page.locator('#container').boundingBox();
  console.log('Container rect:', JSON.stringify(rect));
  
  const ss = await page.locator('#container').screenshot();
  const w = (ss[16] << 24) | (ss[17] << 16) | (ss[18] << 8) | ss[19];
  const h = (ss[20] << 24) | (ss[21] << 16) | (ss[22] << 8) | ss[23];
  console.log('Screenshot size:', w, 'x', h);
  console.log('Etalon expects: 784x700');
});
