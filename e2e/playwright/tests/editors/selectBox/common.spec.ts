import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import SelectBox from '../../../models/selectBox';

const isDataSourceLoading = (page: Page): Promise<boolean> => page.evaluate(
  () => ($('#selectBox') as any).dxSelectBox('instance').getDataSource().isLoading(),
);

test.describe('SelectBox placeholder', () => {
  test('Placeholder is visible after items option change when value is not chosen (T1099804)', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'selectBox');
    await setStyleAttribute(page, '#container', 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');
    await createWidget(page, 'dxSelectBox', {
      width: '100%',
      placeholder: 'Choose a value',
    }, '#selectBox');

    const selectBox = new SelectBox(page, '#selectBox');

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
            // The store answers late, like a server; the test waits for the load to finish.
            // eslint-disable-next-line no-restricted-syntax
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

    const selectBox = new SelectBox(page, '#selectBox');

    await selectBox.option('opened', true);

    const list = await selectBox.getList();

    await expect(list.items).toHaveCount(12);
    await expect(list.getItem(0).element).toHaveText('item 1');
    await expect(list.getItem(11).element).toHaveText('item 12');

    await list.scrollTo(50);

    await page.locator('body').click();

    await page.evaluate(() => {
      const dataSource = ($('#selectBox') as any).dxSelectBox('instance').getDataSource();

      dataSource.filter(['anotherId', '=', 2]);
      dataSource.load();
    });
    await expect.poll(() => isDataSourceLoading(page)).toBe(false);

    await selectBox.option('opened', true);
    await expect.poll(() => isDataSourceLoading(page)).toBe(false);

    await expect(list.items).toHaveCount(12);
    await expect(list.getItem(0).element).toHaveText('item 2');
    await expect(list.getItem(11).element).toHaveText('item 24');
  });
});
