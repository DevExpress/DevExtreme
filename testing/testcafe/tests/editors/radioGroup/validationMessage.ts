import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Form from '../../../model/form/form';
import RadioGroup from '../../../model/radioGroup';
import { changeTheme } from '../../../helpers/changeTheme';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';

fixture`Radio Group ValidationMessage`
  .page(url(__dirname, '../../container.html'));

const themes = ['generic.light', 'material.blue.light'];

themes.forEach((theme) => {
  test(`message position is right in ${theme} (T1020449)`, async (t) => {
    const form = new Form('#container');

    await form.validate();

    const radioGroup = new RadioGroup('.dx-radiogroup');

    await radioGroup.focus();

    await t.expect(await compareScreenshot(t, `radiogroup-horizontal-validation,theme=${theme.replace(/\./g, '-')}.png`)).ok();
  }).before(async (t) => {
    await t.resizeWindow(300, 400);
    await changeTheme(theme);

    return createWidget('dxForm', {
      items: [{
        itemType: 'simple',
        dataField: 'PropertyNameId',
        editorOptions: {
          dataSource: ['HR Manager', 'IT Manager'],
          layout: 'horizontal',
        },
        editorType: 'dxRadioGroup',
        validationRules: [{
          type: 'required',
          message: 'The PropertyNameId field is required.',
        }],
      }, {
        itemType: 'button',
        horizontalAlignment: 'left',
        buttonOptions: {
          text: 'Register',
          type: 'success',
          useSubmitBehavior: true,
        },
      }],
    });
  }).after(async (t) => {
    await restoreBrowserSize(t);
    await changeTheme('generic.light');
  });
});
