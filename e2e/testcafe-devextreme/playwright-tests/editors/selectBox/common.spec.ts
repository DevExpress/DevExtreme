import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('SelectBox placeholder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Placeholder is visible after items option change when value is not chosen (T1099804)', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'selectBox');
    await setStyleAttribute(page, '#container', 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');

    await createWidget(page, 'dxSelectBox', {
      width: '100%',
      placeholder: 'Choose a value',
    }, '#selectBox');

    const selectBox = page.locator('#selectBox');

    await selectBox.option('items', [1, 2, 3]);
    await testScreenshot(page, 'SelectBox placeholder after items change if value is not choosen.png', { element: '#container' });

    });

  test('Pages should be loaded consistently after closing the dropdown popup and filtering the data (T1274576)', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'selectBox');
    await setStyleAttribute(page, '#container', 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');

    await createWidget(page, 'dxSelectBox', () => {
      const data: { id: number; text: string; anotherId: number }[] = [];

      for (let index = 0; index < 100; index += 1) {
        data.push({
          id: index + 1,
          text: `item ${index + 1}`,
          anotherId: index % 2 === 0 ? 1 : 2,
        });
      }

      const sampleAPI = new (window as any).DevExpress.data.ArrayStore({ key: 'id', data });
      const store = new (window as any).DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
          return new Promise((resolve) => {
            setTimeout(() => {
              sampleAPI.load(loadOptions).done((items) => {
                resolve(items);
              });
            }, 100);
          });
        },
        totalCount(loadOptions) {
          return sampleAPI.totalCount(loadOptions);
        },
        byKey(key) {
          return sampleAPI.byKey(key);
        },
      });

      return {
        dataSource: {
          store,
          paginate: true,
          pageSize: 6,
        },
        valueExpr: 'id',
        displayExpr: 'text',
      };
    }, '#selectBox');

    const selectBox = page.locator('#selectBox');

    await selectBox.option('opened', true);

    const list = await selectBox.getList();
    const items = list.getItems();

    expect(items.count).toBe(12)
      .expect(items.nth(0).textContent)
      .eql('item 1')
      .expect(items.nth(11).textContent)
      .eql('item 12');

    const scrollingDistance = 50;
    await list.scrollTo(scrollingDistance);
    await page.waitForTimeout(500);

    await page.locator('body').click();

    const { getInstance } = selectBox;

    await ClientFunction(
      () => {
        const dataSource = (getInstance() as any).getDataSource();
        dataSource.filter(['anotherId', '=', 2]);
        dataSource.load();
      },
      { dependencies: { getInstance } },
    )();
    await page.waitForTimeout(500);

    await selectBox.option('opened', true);

    await page.waitForTimeout(500);

    expect(items.count).toBe(12)
      .expect(items.nth(0).textContent)
      .eql('item 2')
      .expect(items.nth(11).textContent)
      .eql('item 24');

    });
});
