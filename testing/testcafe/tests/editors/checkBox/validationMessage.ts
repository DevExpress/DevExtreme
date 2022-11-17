import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import CheckBox from '../../../model/checkBox';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/getPostfix';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';

fixture`CheckBox_ValidationMessage`
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

fixture`CheckBox ValidationMessagePosition`
  .page(url(__dirname, '../../container.html'));

const positions = ['top', 'right', 'bottom', 'left'];
positions.forEach((position) => {
  test(`CheckBox ValidationMessage position is correct (${position})`, async (t) => {
    const checkBox1 = new CheckBox('#container');
    await t
      .click(checkBox1.element)
      .click(checkBox1.element)
      .expect(true).ok();

    await t.expect(await compareScreenshot(t, `checkbox-validation-message-position=${position}${getThemePostfix()}.png`)).ok();
  }).before(async (t) => {
    await t.resizeWindow(300, 200);

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
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});

// eslint-disable-next-line max-len
// const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
// themes.forEach((theme) => {
//   positions.forEach((position) => {
//     test(`CheckBox ValidationMessage position is correct (${position}, ${theme})`, async (t) => {
//       const checkBox1 = new CheckBox('#container');
//       await t
//         .click(checkBox1.element)
//         .click(checkBox1.element)
//         .expect(true).ok();

// eslint-disable-next-line max-len
//       await t.expect(await compareScreenshot(t, `checkbox-validation-message-position=${position},theme=${theme.replace(/\./g, '-')}.png`)).ok();
//     }).before(async (t) => {
//       await t.resizeWindow(300, 200);
//       await changeTheme(theme);

//       await createWidget('dxCheckBox', {
//         text: 'Click me!',
//         elementAttr: { style: 'margin: 50px 0 0 100px;' },
//         validationMessagePosition: position,
//       });

//       return createWidget('dxValidator', {
//         validationRules: [{
//           type: 'required',
//           message: 'it is required',
//         }],
//       });
//     }).after(async (t) => {
//       await restoreBrowserSize(t);
//     });
//   });
// });
