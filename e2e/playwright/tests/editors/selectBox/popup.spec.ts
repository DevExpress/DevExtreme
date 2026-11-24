import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import SelectBox from '../../../models/selectBox';

test.describe('popup height after load', () => {
  test.use({ browserSize: [300, 400] });

  test.beforeEach(async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });
  });

  test('SelectBox without data', async ({ page }) => {
    const selectBox = new SelectBox(page, '#container');

    await selectBox.element.click();

    await testScreenshot(page, 'SelectBox no data.png');

    await (await selectBox.getPopup()).click();
  });

  [
    {
      title: 'SelectBox has a correct popup height for the first opening if the pageSize is equal to dataSource length (T942881)',
      pageSize: 3,
      screenshotName: 'SelectBox pagesize equal datasource items count.png',
    },
    {
      title: 'SelectBox has a correct popup height for the first opening if the pageSize is less than dataSource items count',
      pageSize: 2,
      screenshotName: 'SelectBox pagesize less datasource items count.png',
    },
    {
      title: 'SelectBox has a correct popup height for the first opening if the pageSize is more than dataSource items count',
      pageSize: 5,
      screenshotName: 'SelectBox pagesize more datasource items count.png',
    },
  ].forEach(({ title, pageSize, screenshotName }) => {
    test(title, async ({ page }) => {
      const selectBox = new SelectBox(page, '#container');

      await selectBox.element.click();

      await selectBox.option('dataSource', {
        store: [1, 2, 3],
        paginate: true,
        pageSize,
      });

      await testScreenshot(page, screenshotName);

      await (await selectBox.getPopup()).click();
    });
  });

  test('SelectBox does not change a popup height after load the last page', async ({ page }) => {
    const selectBox = new SelectBox(page, '#container');

    await selectBox.element.click();

    await selectBox.option('dataSource', {
      store: [1, 2, 3, 4, 5],
      paginate: true,
      pageSize: 2,
    });

    const list = await selectBox.getList();

    await list.scrollTo(100);

    await testScreenshot(page, 'SelectBox popup height after last page load.png');

    await (await selectBox.getPopup()).click();
  });
});
