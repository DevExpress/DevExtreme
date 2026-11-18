import { randomUUID } from 'node:crypto';
import type { Page } from '@playwright/test';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import DateRangeBox from '../../../models/dateRangeBox';
import Form from '../../../models/form';

const DATERANGEBOX_CLASS = 'dx-daterangebox';

const validationMessagePositions = ['auto', 'bottom', 'left', 'right', 'top'];

const createFormWithDateRangeBox = async (
  page: Page,
  validationMessagePosition: string,
): Promise<string> => {
  const id = `dx${randomUUID()}`;

  await appendElementTo(page, '#container', 'div', id);

  await createWidget(page, 'dxForm', {
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
  }, `#${id}`);

  return id;
};

test.describe('DateRangeBox validation message position', () => {
  test('The validation message overlay for DateRangeBox should be correctly positioned before and after opening', async ({ page }) => {
    const ids: string[] = [];

    await insertStylesheetRulesToPage(page, `
    #container { width: 900px; height: 800px; display: flex; flex-direction: column; padding: 50px; }
    .dx-form { margin: 25px 50px; }
  `);

    for (const validationMessagePosition of validationMessagePositions) {
      ids.push(await createFormWithDateRangeBox(page, validationMessagePosition));
    }

    for (const id of ids) {
      await new Form(page, `#${id}`).validate();
    }

    await testScreenshot(page, 'The validation message overlay position for DateRangeBox before opening.png', { element: '#container' });

    for (const id of ids) {
      const form = new Form(page, `#${id}`);
      const dateRangeBox = new DateRangeBox(page, `#${id} .${DATERANGEBOX_CLASS}`);

      await form.validate();

      await dateRangeBox.dropDownButton.click();
      await dateRangeBox.dropDownButton.click();
    }

    await testScreenshot(page, 'The validation message overlay position for DateRangeBox after opening.png', { element: '#container' });
  });
});
