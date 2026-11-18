import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import CheckBox from '../../../models/checkBox';

const validatorOptions = {
  validationRules: [{
    type: 'required',
    message: 'it is required',
  }],
};

test.describe('CheckBox_ValidationMessage', () => {
  test('ValidationMessage integrated in editor should not raise any errors when it is placed inside of form and has name "style" (T941581)', async ({ page }) => {
    await appendElementTo(page, '#container', 'form', 'form');
    await appendElementTo(page, '#form', 'div', 'checkBox');
    await createWidget(page, 'dxCheckBox', {
      name: 'style',
    }, '#checkBox');
    await createWidget(page, 'dxValidator', validatorOptions, '#checkBox');

    const checkBox = new CheckBox(page, '#checkBox');

    await checkBox.element.click();
    await checkBox.element.click();
  });

  test('ValidationMessage integrated in editor should not raise any errors when it is placed inside of form that has inline style with scale (T941581)', async ({ page }) => {
    await appendElementTo(page, '#container', 'form', 'form1', { transform: 'scale(1)' });
    await appendElementTo(page, '#form1', 'div', 'checkBox1');
    await createWidget(page, 'dxCheckBox', {}, '#checkBox1');
    await createWidget(page, 'dxValidator', validatorOptions, '#checkBox1');

    const checkBox = new CheckBox(page, '#checkBox1');

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
