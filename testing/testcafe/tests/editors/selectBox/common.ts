import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import SelectBox from '../../../model/selectBox';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';

fixture`SelectBox placeholder`
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
