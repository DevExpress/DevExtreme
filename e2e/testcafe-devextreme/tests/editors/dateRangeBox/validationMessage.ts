/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Form from 'devextreme-testcafe-models/form/form';
import DateRangeBox from 'devextreme-testcafe-models/dateRangeBox';
import Guid from 'devextreme/core/guid';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage } from '../../../helpers/domUtils';

const DATERANGEBOX_CLASS = 'dx-daterangebox';

fixture.disablePageReloads`DateRangeBox validation message position`
  .page(url(__dirname, '../../container.html'));

const validationMessagePositions = ['auto', 'bottom', 'left', 'right', 'top'];

const createFormWithDateRangeBox = async (validationMessagePosition: string): Promise<string> => {
  const id = `${`dx${new Guid()}`}`;
  await appendElementTo('#container', 'div', id, { });

  const config: any = {
    width: '100%',
    labelLocation: 'top',
    formData: {
      DateRange: ['2021/09/17', null],
    },
    colCount: 1,
    items: [{
      dataField: 'DateRange',
      editorType: 'dxDateRangeBox',
      label: {
        text: 'Date Range',
      },
      validationRules: [{
        type: 'required',
        message: 'Some message',
      }],
      editorOptions: {
        startDatePlaceholder: 'Start Date',
        endDatePlaceholder: 'End Date',
        validationMessageMode: 'always',
        validationMessagePosition,
      },
    }],
  };

  await createWidget('dxForm', config, `#${id}`);

  return id;
};

test('The validation message overlay for DateRangeBox should be correctly positioned before and after opening', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  for (const id of t.ctx.ids) {
    await new Form(`#${id}`).validate();
  }

  await testScreenshot(t, takeScreenshot, 'The validation message overlay position for DateRangeBox before opening.png');

  for (const id of t.ctx.ids) {
    const form = new Form(`#${id}`);
    const dateRangeBox = new DateRangeBox(`#${id} .${DATERANGEBOX_CLASS}`);

    await form.validate();

    await t
      .click(dateRangeBox.dropDownButton)
      .click(dateRangeBox.dropDownButton);
  }

  await testScreenshot(t, takeScreenshot, 'The validation message overlay position for DateRangeBox after opening.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  t.ctx.ids = [];

  await insertStylesheetRulesToPage(`
    * { caret-color: transparent !important; }
    #container { width: 900px; height: 800px; display: flex; flex-direction: column; padding: 50px; }
    .dx-form { margin: 25px 50px; }
  `);

  for (const validationMessagePosition of validationMessagePositions) {
    const id = await createFormWithDateRangeBox(validationMessagePosition);
    t.ctx.ids.push(id);
  }
});
