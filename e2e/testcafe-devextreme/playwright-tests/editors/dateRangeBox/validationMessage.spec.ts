import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateRangeBox validation message position', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const DATERANGEBOX_CLASS = 'dx-daterangebox';

  const validationMessagePositions = ['auto', 'bottom', 'left', 'right', 'top'];

  const createFormWithDateRangeBox = async (validationMessagePosition: string): Promise<string> => {
    const id = `${`dx${new Guid()}`}`;
    await appendElementTo(page, '#container', 'div', id, { });

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

    await createWidget(page, 'dxForm', config, `#${id}`);

    return id;
  };

  test('The validation message overlay for DateRangeBox should be correctly positioned before and after opening', async ({ page }) => {

    for (const id of t.ctx.ids) {
      await new Form(`#${id}`).validate();
    }

    await testScreenshot(page, 'The validation message overlay position for DateRangeBox before opening.png', { element: '#container' });

    for (const id of t.ctx.ids) {
      const form = page.locator(`#${id}`);
      const dateRangeBox = page.locator(`#${id} .${DATERANGEBOX_CLASS}`);

      await form.validate();

      await page.click(dateRangeBox.dropDownButton)
        .click(dateRangeBox.dropDownButton);
    }

    await testScreenshot(page, 'The validation message overlay position for DateRangeBox after opening.png', { element: '#container' });

    });.before(async ({ page }) => {
    t.ctx.ids = [];

    await insertStylesheetRulesToPage(page, `
      #container { width: 900px; height: 800px; display: flex; flex-direction: column; padding: 50px; }
      .dx-form { margin: 25px 50px; }
    `);

    for (const validationMessagePosition of validationMessagePositions) {
      const id = await createFormWithDateRangeBox(validationMessagePosition);
      t.ctx.ids.push(id);
    }
  });
});
