import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Form from 'devextreme-testcafe-models/form/form';
import DateRangeBox from 'devextreme-testcafe-models/dateRangeBox';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage } from '../../../helpers/domUtils';

const DATERANGEBOX_CLASS = 'dx-daterangebox';

fixture.disablePageReloads`DateRangeBox validation message position`
  .page(url(__dirname, '../../container.html'));

['auto', 'bottom', 'left', 'right', 'top'].forEach((validationMessagePosition) => {
  test(`The validation message overlay for DateRangeBox with position ${validationMessagePosition} should be correctly positioned both before and after opening`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const form = new Form('#form');
    const dateRangeBox = new DateRangeBox(`.${DATERANGEBOX_CLASS}`);

    await form.validate();

    await testScreenshot(t, takeScreenshot, `The validation message overlay position ${validationMessagePosition} for DateRangeBox before opening.png`, {
      element: '#container',
      shouldTestInCompact: true,
      compactCallBack: async () => {
        await form.validate();
      },
    });

    await form.validate();

    await t.click(dateRangeBox.dropDownButton);

    await testScreenshot(t, takeScreenshot, `The validation message overlay position ${validationMessagePosition} for DateRangeBox after opening.png`, {
      element: '#container',
      shouldTestInCompact: true,
      compactCallBack: async () => {
        await t.click(dateRangeBox.dropDownButton);
        await form.validate();
        await t.click(dateRangeBox.dropDownButton);
      },
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'form');
    await insertStylesheetRulesToPage('#container { width: 900px; height: 800px; } .dx-form { padding: 100px 150px; }');

    await createWidget('dxForm', {
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
    }, '#form');
  });
});
