import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Radio Group Validation Message', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const RADIO_GROUP_CLASS = 'dx-radiogroup';

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

    const form = page.locator('#container');

    await form.validate();

    const radioGroup = page.locator(`.${RADIO_GROUP_CLASS}`);

    await radioGroup.focus();

    await testScreenshot(page, 'RadioGroup horizontal validation.png', { element: '#container' });

    });
});
