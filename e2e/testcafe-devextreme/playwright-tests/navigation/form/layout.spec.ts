import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const waitFont = async () => page.evaluate(() => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400));

  test('SimpleItem: item1_cSpan_2', async ({ page }) => {

    await waitFont();
    await setAttribute(page, '#container', 'style', 'width: 500px;');

    for (let colCount = 1; colCount <= 4; colCount += 1) {
      const formId = `form${colCount}`;

      await appendElementTo(page, '#container', 'div', formId);
      await page.evaluate(({ sel, caption }) => { document.querySelector(sel)?.insertAdjacentText('beforebegin', caption); }, { sel: `#${formId}`, caption: `colCount = ${colCount}` });

      const formOptions = {
        elementAttr: { style: 'margin-bottom: 20px' },
        labelMode: 'static',
        colCount,
        items: [{ dataField: 'item_1', colSpan: 2 }],
      };

      await createWidget(page, 'dxForm', formOptions, `#${formId}`);
    }

    await testScreenshot(page, 'SimpleItem,item1_cSpan_2.png', { element: '#container' });

    });

  [[1, 2], [2, 1], [2, 2]].forEach(([colSpan1, colSpan2]) => {
    const testName = `SimpleItem,item1_cSpan_${colSpan1},item2_cSpan_${colSpan2}`;
    test(testName, async ({ page }) => {

      await waitFont();
      await setAttribute(page, '#container', 'style', 'width: 600px;');

      for (let colCount = 1; colCount <= 4; colCount += 1) {
        const formId = `form${colCount}`;

        await appendElementTo(page, '#container', 'div', formId);
        await page.evaluate(({ sel, caption }) => { document.querySelector(sel)?.insertAdjacentText('beforebegin', caption); }, { sel: `#${formId}`, caption: `colCount = ${colCount}` });

        const formOptions = {
          elementAttr: { style: 'margin-bottom: 20px' },
          labelMode: 'static',
          colCount,
          items: [
            { dataField: `item_1_span_${colSpan1}`, colSpan: colSpan1 },
            { dataField: `item_2_span_${colSpan2}`, colSpan: colSpan2 },
          ],
        };

        await createWidget(page, 'dxForm', formOptions, `#${formId}`);
      }


      await testScreenshot(page, `${testName}.png`, { element: '#container' });

    });
  });

  [false, true].forEach((rtlEnabled) => {
    [1, 2, 3, 4, 5, 6].forEach((itemsCount) => {
      const testName = `colCount,rtl_${rtlEnabled},itemsCount_${itemsCount}`;
      test(testName, async ({ page }) => {

        await waitFont();
        const containerStyle = `
            display: grid; 
            grid-template-columns: repeat(3, 300px); 
            grid-template-rows: 0px auto; 
            grid-auto-flow: column;
            grid-gap: 30px; 
            width: 960px;`;
        await setAttribute(page, '#container', 'style', containerStyle);

        for (let colCount = 1; colCount <= 3; colCount += 1) {
          const formId = `form${colCount + 1}`;

          await appendElementTo(page, '#container', 'div', formId);
          await page.evaluate(({ sel, caption }) => { document.querySelector(sel)?.insertAdjacentText('beforebegin', caption); }, { sel: `#${formId}`, caption: `colCount = ${colCount}` });

          const formOptions = {
            colCount,
            rtlEnabled,
            labelMode: 'static',
            items: Array(itemsCount).fill(null).map((_, i) => ({ dataField: `item_${i + 1}` })),
          };

          await createWidget(page, 'dxForm', formOptions, `#${formId}`);
        }


        await testScreenshot(page, `${testName}.png`, { element: '#container' });

    });
    });
  });

  ['left', 'right', 'top'].forEach((labelLocation) => {
    test('widget alignment (T1086611)', async ({ page }) => {

      await waitFont();

      await createWidget(page, 'dxForm', {
        labelLocation,
        colCount: 2,
        width: 1000,
        formData: {},
        items: [{
          dataField: 'FirstName',
          editorType: 'dxTextBox',
        }, {
          dataField: 'Position',
          editorType: 'dxSelectBox',
        }, {
          dataField: 'BirthDate',
          editorType: 'dxDateBox',
        }, {
          dataField: 'Notes',
          editorType: 'dxTextArea',
        }],
      });


      await testScreenshot(page, `Form with labelLocation=${labelLocation}.png`, { element: '#container' });

    });
  });

  [() => 'xs', () => 'md', () => 'lg'].forEach((screenByWidth) => {
    const testName = `Form item padding with screenByWidth=${screenByWidth()}`;
    test(`${testName} (T1088451)`, async ({ page }) => {
    await createWidget(page, 'dxForm', {
      screenByWidth,
      width: 1000,
      formData: {},
      items: [
        'Name1', 'Name2',
        {
          itemType: 'group',
          items: [
            {
              itemType: 'group',
              items: [
                {
                  itemType: 'group',
                  items: [
                    {
                      itemType: 'group',
                      colCount: 2,
                      items: [
                        {
                          dataField: 'Name3',
                        },
                        {
                          dataField: 'Name4',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          itemType: 'group',
          items: [
            {
              itemType: 'group',
              items: [
                {
                  itemType: 'group',
                  items: [
                    {
                      itemType: 'group',
                      colCount: 2,
                      items: [
                        {
                          itemType: 'group',
                          colCount: 2,
                          items: ['Name7', 'Name8'],
                        },
                        {
                          itemType: 'group',
                          colCount: 2,
                          items: ['Name9', 'Name10'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        'Name11', 'Name12',
      ],
    });

      await waitFont();

      await testScreenshot(page, `${testName}.png`, { element: '#container' });

    });
  });

  test('Validation errors persist after resize', async ({ page }) => {
    await createWidget(page, 'dxForm', {
    colCountByScreen: {
      xs: 1,
      sm: 2,
      md: 2,
      lg: 2,
    },
    items: [
      {
        dataField: 'name',
        editorType: 'dxTextBox',
        validationRules: [{ type: 'required' }],
      },
      {
        dataField: 'birthDate',
        editorType: 'dxDateBox',
        validationRules: [{ type: 'required' }],
      },
      {
        dataField: 'role',
        editorType: 'dxSelectBox',
        editorOptions: {
          dataSource: ['Dev', 'QA', 'PM'],
        },
        validationRules: [{ type: 'required' }],
      },
      {
        dataField: 'agree',
        editorType: 'dxCheckBox',
        editorOptions: {
          text: 'I agree',
        },
        validationRules: [{
          type: 'custom',
          validationCallback: () => false,
          message: 'Required',
        }],
      },
    ],
  });

    const form = page.locator('#container');

    await waitFont();
    await form.validate();

    await resizeWindow(400, 800);

    await testScreenshot(page, 'form_validation_errors_after_resize.png', { element: '#container' });

    });
});
