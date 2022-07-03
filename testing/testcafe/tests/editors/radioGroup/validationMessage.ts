import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import CheckBox from '../../../model/checkBox';
import createWidget from '../../../helpers/createWidget';

fixture`Radio Group ValidationMessage`
  .page(url(__dirname, '../pages/t1020449.html'));

test('message position is right in material (T1020449)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .expect(await takeScreenshot('radiogroup-horizontal-validation.png', '#radio-form'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

fixture`ValidationMessage`
  .page(url(__dirname, '../container.html'));

test('ValidationMessage integrated in editor should not raise any errors when it is placed inside of form and has name "style" (T941581)', async (t) => {
  const checkBox = new CheckBox('#container');
  await t
    .click(checkBox.element)
    .click(checkBox.element)
    .expect(true).ok();
}).before(async () => {
  await createWidget('dxCheckBox', {
    name: 'style',
  });

  return createWidget('dxValidator', {
    validationRules: [{
      type: 'required',
      message: 'it is required',
    }],
  });
});

test('ValidationMessage integrated in editor should not raise any errors when it is placed inside of form that has inline style with scale (T941581)', async (t) => {
  const checkBox1 = new CheckBox('#container');
  await t
    .click(checkBox1.element)
    .click(checkBox1.element)
    .expect(true).ok();
}).before(async () => {
  await createWidget('dxCheckBox', {});

  return createWidget('dxValidator', {
    validationRules: [{
      type: 'required',
      message: 'it is required',
    }],
  });
});
