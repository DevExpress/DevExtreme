import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, SelectBox } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('popup height after load', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('SelectBox without data', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 400 });

    await createWidget(page, 'dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });

    const selectBox = new SelectBox(page);

    await selectBox.click();

    await testScreenshot(page, 'SelectBox no data.png');
  });

  test('SelectBox has a correct popup height for the first opening if the pageSize is equal to dataSource length (T942881)', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 400 });

    await createWidget(page, 'dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });

    const selectBox = new SelectBox(page);

    await selectBox.click();

    await selectBox.option('dataSource', {
      store: [1, 2, 3],
      paginate: true,
      pageSize: 3,
    });

    await testScreenshot(page, 'SelectBox pagesize equal datasource items count.png');
  });

  test('SelectBox has a correct popup height for the first opening if the pageSize is less than dataSource items count', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 400 });

    await createWidget(page, 'dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });

    const selectBox = new SelectBox(page);

    await selectBox.click();

    await selectBox.option('dataSource', {
      store: [1, 2, 3],
      paginate: true,
      pageSize: 2,
    });

    await testScreenshot(page, 'SelectBox pagesize less datasource items count.png');
  });

  test('SelectBox has a correct popup height for the first opening if the pageSize is more than dataSource items count', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 400 });

    await createWidget(page, 'dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });

    const selectBox = new SelectBox(page);

    await selectBox.click();

    await selectBox.option('dataSource', {
      store: [1, 2, 3],
      paginate: true,
      pageSize: 5,
    });

    await testScreenshot(page, 'SelectBox pagesize more datasource items count.png');
  });

  test('SelectBox does not change a popup height after load the last page', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 400 });

    await createWidget(page, 'dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });

    const selectBox = new SelectBox(page);

    await selectBox.click();

    await selectBox.option('dataSource', {
      store: [1, 2, 3, 4, 5],
      paginate: true,
      pageSize: 2,
    });

    await page.evaluate(() => {
      const popupId = ($('#container .dx-texteditor-input') as any).attr('aria-owns');
      const listEl = $(`#${popupId}`).find('.dx-list');
      (listEl as any).dxList('instance').scrollTo(100);
    });

    await testScreenshot(page, 'SelectBox popup height after last page load.png');
  });
});
