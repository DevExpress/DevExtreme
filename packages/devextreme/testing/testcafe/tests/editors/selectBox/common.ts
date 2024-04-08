import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { isFluent, testScreenshot } from '../../../helpers/themeUtils';
import {
  appendElementTo, setStyleAttribute,
} from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import SelectBox from '../../../model/selectBox';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`SelectBox placeholder`
  .page(url(__dirname, '../../container.html'));

test('Last Item from last group in dropdown list has margin-bottom = 4px in Fluent Theme', async (t) => {
  const parent = Selector('#parentContainer');
  await t.click(parent);
  const items = Selector('.dx-item');
  const lastItem = items.nth(-1);
  const marginBottom = await lastItem.getStyleProperty('margin-bottom');
  if (isFluent()) {
    await t.expect(marginBottom).eql('4px');
  } else {
    await t.expect(marginBottom).eql('0px');
  }
}).before(async () => {
  const ungroupedData = [{
    ID: 1,
    Name: 'First Item',
    Category: 'First Group',
  }, {
    ID: 2,
    Name: 'Last Item',
    Category: 'First Group',
  }, {
    ID: 3,
    Name: 'First Item',
    Category: 'Last Group',
  }, {
    ID: 4,
    Name: 'Second Item',
    Category: 'Last Group',
  }, {
    ID: 5,
    Name: 'Last Item',
    Category: 'Last Group',
  }];

  const fromUngroupedData = {
    store: {
      type: 'array',
      data: ungroupedData,
      key: 'ID',
    },
    group: 'Category',
  };
  await createWidget('dxSelectBox', {
    dataSource: fromUngroupedData,
    valueExpr: 'ID',
    grouped: true,
    value: 1,
    displayExpr: 'Name',
  });
});

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
