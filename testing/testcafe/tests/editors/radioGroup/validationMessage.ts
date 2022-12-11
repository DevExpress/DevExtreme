import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import Form from '../../../model/form/form';
import RadioGroup from '../../../model/radioGroup';
import { appendElementTo } from '../../navigation/helpers/domUtils';

const RADIO_GROUP_CLASS = 'dx-radiogroup';

fixture.disablePageReloads`Radio Group Validation Message`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

test('message position is right (T1020449)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const form = new Form('#form');

  await form.validate();

  const radioGroup = new RadioGroup(`.${RADIO_GROUP_CLASS}`);

  await radioGroup.focus();

  await takeScreenshotInTheme(t, takeScreenshot, 'RadioGroup horizontal validation.png', '#form');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'form');

  return createWidget('dxForm', {
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
  }, false, '#form');
});
