import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/getPostfix';
import url from '../../../helpers/getPageUrl';
import SelectBox from '../../../model/selectBox';
import createWidget from '../../../helpers/createWidget';

fixture`SelectBox placeholder`
  .page(url(__dirname, '../../container.html'));

test('Placeholder is visible after items option change when value is not chosen (T1099804)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const selectBox = new SelectBox('#container');

  await selectBox.option('items', [1, 2, 3]);

  await takeScreenshotInTheme(t, takeScreenshot, 'SelectBox placeholder after items change if value is not choosen.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(300, 100);

  return createWidget('dxSelectBox', {
    width: 300,
    placeholder: 'Choose a value',
  });
});
