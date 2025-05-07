import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import SelectBox from 'devextreme-testcafe-models/selectBox';
import { testScreenshot } from '../../../helpers/themeUtils';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';

fixture.disablePageReloads`SelectBox placeholder`
  .page(url(__dirname, '../../container.html'));

test('Placeholder is visible after items option change when value is not chosen (T1099804)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const selectBox = new SelectBox('#selectBox');

  await selectBox.option('items', [1, 2, 3]);
  await testScreenshot(t, takeScreenshot, 'SelectBox placeholder after items change if value is not choosen.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'selectBox');
  await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');

  return createWidget('dxSelectBox', {
    width: '100%',
    placeholder: 'Choose a value',
  }, '#selectBox');
});

test('Pages should be loaded consistently after closing the dropdown popup and filtering the data (T1274576)', async (t) => {
  const selectBox = new SelectBox('#selectBox');

  await selectBox.option('opened', true);

  const list = await selectBox.getList();
  const items = list.getItems();

  await t.expect(items.count)
    .eql(12)
    .expect(items.nth(0).textContent)
    .eql('item 1')
    .expect(items.nth(11).textContent)
    .eql('item 12');

  const scrollingDistance = 50;
  await list.scrollTo(scrollingDistance);
  await t.wait(500);

  await t.click(Selector('body'));

  const { getInstance } = selectBox;

  await ClientFunction(
    () => {
      const dataSource = (getInstance() as any).getDataSource();
      dataSource.filter(['anotherId', '=', 2]);
      dataSource.load();
    },
    { dependencies: { getInstance } },
  )();
  await t.wait(500);

  await selectBox.option('opened', true);

  await t.wait(500);

  await t.expect(items.count)
    .eql(12)
    .expect(items.nth(0).textContent)
    .eql('item 2')
    .expect(items.nth(11).textContent)
    .eql('item 24');
}).before(async () => {
  await changeTheme(`${process.env.theme}.compact`);
  await appendElementTo('#container', 'div', 'selectBox');
  await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');

  return createWidget('dxSelectBox', () => {
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
}).after(async () => {
  await changeTheme(`${process.env.theme}`);
});
