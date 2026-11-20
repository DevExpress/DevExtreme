import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { addCaptionTo, appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Form from '../../../models/form';
import { waitFont } from './utils';

test.describe('Form', () => {
  test('SimpleItem: item1_cSpan_2', async ({ page }) => {
    await waitFont(page);
    await setAttribute(page, '#container', 'style', 'width: 500px;');

    for (let colCount = 1; colCount <= 4; colCount += 1) {
      const formId = `form${colCount}`;

      await appendElementTo(page, '#container', 'div', formId);
      await addCaptionTo(page, `#${formId}`, `colCount = ${colCount}`);

      await createWidget(page, 'dxForm', {
        elementAttr: { style: 'margin-bottom: 20px' },
        labelMode: 'static',
        colCount,
        items: [{ dataField: 'item_1', colSpan: 2 }],
      }, `#${formId}`);
    }

    await testScreenshot(page, 'SimpleItem,item1_cSpan_2.png', { element: '#container' });
  });

  [[1, 2], [2, 1], [2, 2]].forEach(([colSpan1, colSpan2]) => {
    const testName = `SimpleItem,item1_cSpan_${colSpan1},item2_cSpan_${colSpan2}`;

    test(testName, async ({ page }) => {
      await waitFont(page);
      await setAttribute(page, '#container', 'style', 'width: 600px;');

      for (let colCount = 1; colCount <= 4; colCount += 1) {
        const formId = `form${colCount}`;

        await appendElementTo(page, '#container', 'div', formId);
        await addCaptionTo(page, `#${formId}`, `colCount = ${colCount}`);

        await createWidget(page, 'dxForm', {
          elementAttr: { style: 'margin-bottom: 20px' },
          labelMode: 'static',
          colCount,
          items: [
            { dataField: `item_1_span_${colSpan1}`, colSpan: colSpan1 },
            { dataField: `item_2_span_${colSpan2}`, colSpan: colSpan2 },
          ],
        }, `#${formId}`);
      }

      await testScreenshot(page, `${testName}.png`, { element: '#container' });
    });
  });

  [false, true].forEach((rtlEnabled) => {
    [1, 2, 3, 4, 5, 6].forEach((itemsCount) => {
      const testName = `colCount,rtl_${rtlEnabled},itemsCount_${itemsCount}`;

      test(testName, async ({ page }) => {
        await waitFont(page);
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
          await addCaptionTo(page, `#${formId}`, `colCount = ${colCount}`);

          await createWidget(page, 'dxForm', {
            colCount,
            rtlEnabled,
            labelMode: 'static',
            items: Array(itemsCount).fill(null).map((_, i) => ({ dataField: `item_${i + 1}` })),
          }, `#${formId}`);
        }

        await testScreenshot(page, `${testName}.png`, { element: '#container' });
      });
    });
  });

  ['left', 'right', 'top'].forEach((labelLocation) => {
    test(`widget alignment (T1086611), labelLocation=${labelLocation}`, async ({ page }) => {
      await waitFont(page);

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

  ['xs', 'md', 'lg'].forEach((screenSize) => {
    const testName = `Form item padding with screenByWidth=${screenSize}`;

    test(`${testName} (T1088451)`, async ({ page }) => {
      await createWidget(page, 'dxForm', (size) => ({
        screenByWidth: () => size,
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
      }), undefined, { arg: screenSize });

      await waitFont(page);

      await testScreenshot(page, `${testName}.png`, { element: '#container' });
    });
  });

  test('Validation errors persist after resize', async ({ page }) => {
    await createWidget(page, 'dxForm', () => ({
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
    }));

    const form = new Form(page, '#container');

    await waitFont(page);
    await form.validate();

    await page.setViewportSize({ width: 400, height: 800 });

    await testScreenshot(page, 'form_validation_errors_after_resize.png', { element: '#container' });
  });
});
