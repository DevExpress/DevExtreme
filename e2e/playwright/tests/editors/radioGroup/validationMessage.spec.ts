import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import Form from '../../../models/form';
import RadioGroup from '../../../models/radioGroup';

const RADIO_GROUP_CLASS = 'dx-radiogroup';

test.describe('Radio Group Validation Message', () => {
  test('message position is right (T1020449)', async ({ page }) => {
    await createWidget(page, 'dxForm', {
      width: 300,
      height: 400,
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

    const form = new Form(page, '#container');

    await form.validate();

    const radioGroup = new RadioGroup(page, `.${RADIO_GROUP_CLASS}`);

    await radioGroup.focus();

    await testScreenshot(page, 'RadioGroup horizontal validation.png', { element: '#container' });
  });
});
