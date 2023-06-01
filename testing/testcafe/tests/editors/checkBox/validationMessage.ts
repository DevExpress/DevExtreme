import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import CheckBox from '../../../model/checkBox';
import createWidget from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`CheckBox_ValidationMessage`
  .page(url(__dirname, '../../container.html'));

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

const positions = ['top', 'right', 'bottom', 'left'];
positions.forEach((position) => {
  safeSizeTest(`CheckBox ValidationMessage position is correct (${position})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const checkBox1 = new CheckBox('#container');
    await t
      .click(checkBox1.element)
      .click(checkBox1.element)
      .expect(true).ok();

    await testScreenshot(t, takeScreenshot, `Checkbox validation message with ${position} position.png`, {
      shouldTestInCompact: true,
      compactCallBack: async () => {
        await t
          .click(checkBox1.element)
          .click(checkBox1.element);
      },
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [300, 200]).before(async () => {
    await createWidget('dxCheckBox', {
      text: 'Click me!',
      elementAttr: { style: 'margin: 50px 0 0 100px;' },
      validationMessagePosition: position,
    });

    return createWidget('dxValidator', {
      validationRules: [{
        type: 'required',
        message: 'it is required',
      }],
    });
  });
});
