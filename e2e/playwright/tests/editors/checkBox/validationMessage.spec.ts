import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import CheckBox from '../../../models/checkBox';

const validatorOptions = {
  validationRules: [{
    type: 'required',
    message: 'it is required',
  }],
};

// The first two tests assert nothing themselves: the page fixture fails a test on an uncaught
// error in the page, and that is what they check.
test.describe('CheckBox_ValidationMessage', () => {
  test('ValidationMessage integrated in editor should not raise any errors when it is placed inside of form and has name "style" (T941581)', async ({ page }) => {
    await createWidget(page, 'dxCheckBox', {
      name: 'style',
    });
    await createWidget(page, 'dxValidator', validatorOptions);

    const checkBox = new CheckBox(page, '#container');

    await checkBox.element.click();
    await checkBox.element.click();
  });

  test('ValidationMessage integrated in editor should not raise any errors when it is placed inside of form that has inline style with scale (T941581)', async ({ page }) => {
    await createWidget(page, 'dxCheckBox', {});
    await createWidget(page, 'dxValidator', validatorOptions);

    const checkBox = new CheckBox(page, '#container');

    await checkBox.element.click();
    await checkBox.element.click();
  });

  test.describe(() => {
    test.use({ browserSize: [300, 200] });

    ['top', 'right', 'bottom', 'left'].forEach((position) => {
      test(`CheckBox ValidationMessage position is correct (${position})`, async ({ page }) => {
        await createWidget(page, 'dxCheckBox', {
          text: 'Click me!',
          elementAttr: { style: 'margin: 50px 0 0 100px;' },
          validationMessagePosition: position,
        });
        await createWidget(page, 'dxValidator', validatorOptions);

        const checkBox = new CheckBox(page, '#container');

        await checkBox.element.click();
        await checkBox.element.click();

        await testScreenshot(page, `Checkbox validation message with ${position} position.png`);
      });
    });
  });
});
