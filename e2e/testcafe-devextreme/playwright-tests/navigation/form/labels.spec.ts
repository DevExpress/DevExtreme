import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../playwright-helpers';
import type { HorizontalAlignment } from 'devextreme/common';
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

  const waitFont = async (page: any) => page.evaluate(() => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400));

  [false, true].forEach((rtlEnabled) => {
    ['left', 'right', 'top'].forEach((formLabelLocation) => {
      ['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
        const testName = `Form,rtl=${rtlEnabled},lMode=${formLabelMode},lLoc=${formLabelLocation}`;

        test(testName, async ({ page }) => {

          await waitFont(page);

          const getGroup = (visible: boolean, alignment: HorizontalAlignment) => ({
            itemType: 'group',
            caption: `Label visible: ${visible}, label alignment: ${alignment}`,
            colCount: 3,
            items: [
              {
                dataField: 'field1',
                label: { visible, alignment },
                editorType: 'dxTextBox',
              },
              {
                dataField: 'field2',
                label: { visible, alignment },
                editorType: 'dxTextBox',
                editorOptions: {
                  value: 'dxTextBox',
                },
              },
              {
                dataField: 'field3',
                label: { visible, alignment },
                editorType: 'dxCheckBox',
                editorOptions: {
                  value: true,
                  text: 'dxCheckBox',
                },
              },
            ],
          });

          const items = [true, false].flatMap(
            (labelVisible) => {
              const alignments: HorizontalAlignment[] = labelVisible && formLabelLocation === 'top'
                ? ['left', 'center', 'right']
                : ['left'];

              return alignments.map((labelAlignment) => getGroup(labelVisible, labelAlignment));
            },
          );

          await createWidget(page, 'dxForm', {
            rtlEnabled,
            width: 1000,
            labelMode: formLabelMode,
            labelLocation: formLabelLocation,
            items,
          });


          await testScreenshot(page, `${testName}.png`, { element: '#container' });

    });
      });
    });
  });

  [true, false].forEach((alignItemLabelsInAllGroups) => {
    [true, false].forEach((alignItemLabels) => {
      const testName = `Align items,lblMode=outside,alignInAllGrp=${alignItemLabelsInAllGroups},alignInGrp=${alignItemLabels}`;
      test(testName, async ({ page }) => {

        const options = {
          labelMode: 'outside',
          labelLocation: 'left',
          alignItemLabelsInAllGroups,
          colCount: 2,
          width: 1000,
          items: [
            {
              itemType: 'group',
              caption: 'Group1',
              colSpan: 1,
              alignItemLabels,
              items: [
                { dataField: 'field1', label: { text: 'field1' }, editorType: 'dxTextBox' },
                { dataField: 'field2', label: { text: 'field2 long text' }, editorType: 'dxTextBox' },
                { dataField: 'field3', label: { text: 'CheckBox1' }, editorType: 'dxCheckBox' },
                { dataField: 'field4', label: { text: 'CheckBox2 long text' }, editorType: 'dxCheckBox' },
              ],
            },
            {
              itemType: 'group',
              caption: 'Group2',
              colSpan: 1,
              alignItemLabels,
              items: [
                { dataField: 'field5', label: { text: 'short text' }, editorType: 'dxTextBox' },
                { dataField: 'field6', label: { text: 'field2 very long text' }, editorType: 'dxTextBox' },
                { dataField: 'field7', label: { text: 'CheckBox1 text' }, editorType: 'dxCheckBox' },
                { dataField: 'field8', label: { text: 'CheckBox2 very long text' }, editorType: 'dxCheckBox' },
              ],
            },
            {
              itemType: 'group',
              caption: 'Group3',
              colSpan: 2,
              alignItemLabels,
              items: [
                { dataField: 'field9', label: { text: 'short text' }, editorType: 'dxTextBox' },
                { dataField: 'field10', label: { text: 'field2 very long text' }, editorType: 'dxTextBox' },
                { dataField: 'field11', label: { text: 'ChBx1 very very long text' }, editorType: 'dxCheckBox' },
                { dataField: 'field12', label: { text: 'ChBx2 very long text' }, editorType: 'dxCheckBox' },
              ],
            },
          ],
        };

        await createWidget(page, 'dxForm', options);


        await testScreenshot(page, `${testName}.png`, { element: '#container' });

    });
    });
  });

  test('Item label position properties, labelMode=outside', async ({ page }) => {

    const options = {
      labelMode: 'outside',
      width: 500,
      items: [
        { dataField: 'Left', label: { location: 'left' }, editorType: 'dxTextBox' },
        { dataField: 'Top left', label: { location: 'top', alignment: 'left' }, editorType: 'dxTextBox' },
        { dataField: 'Top center', label: { location: 'top', alignment: 'center' }, editorType: 'dxTextBox' },
        { dataField: 'Top right', label: { location: 'top', alignment: 'right' }, editorType: 'dxTextBox' },
        { dataField: 'Right', label: { location: 'right' }, editorType: 'dxTextBox' },
      ],
    };

    await createWidget(page, 'dxForm', options);

    await testScreenshot(page, 'Item label position properties, labelMode=outside.png', { element: '#container' });

    });

  test('Color of the mark (T882067)', async ({ page }) => {
    await createWidget(page, 'dxForm', {
    height: 400,
    width: 1000,
    formData: {
      firstName: 'John',
      lastName: 'Heart',
      position: 'CEO',
    },
    items: [
      { dataField: 'firstName', isRequired: true },
      { dataField: 'lastName', isOptional: true },
      'position',
    ],
    requiredMark: '!',
    optionalMark: 'opt',
    showOptionalMark: true,
  });

    const screenshotName = 'Form color of the mark.png';

    await testScreenshot(page, screenshotName, { element: '#container' });

    });

  test('Form labels should have correct width after render in invisible container', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'form');
    await insertStylesheetRulesToPage(page, '#container { display: none; }');

    await createWidget(page, 'dxForm', {
      width: 1000,
      labelLocation: 'left',
      formData: {
        ID: 1,
        FirstName: 'John',
        LastName: 'Heart',
        Position: 'CEO',
        OfficeNo: '901',
        BirthDate: new Date(1964, 2, 16),
        HireDate: new Date(1995, 0, 15),
        Address: '351 S Hill St.',
        City: 'Los Angeles',
        State: 'CA',
        ZipCode: '90013',
        Phone: '+1(213) 555-9392',
        Email: 'jheart@dx-email.com',
        Skype: 'jheart_DX_skype',
      },
      colCount: 2,
      items: [{
        itemType: 'group',
        caption: 'System Information',
        items: ['ID', 'FirstName', 'LastName', 'HireDate', 'Position', 'OfficeNo'],
      }, {
        itemType: 'group',
        caption: 'Personal Data',
        items: ['BirthDate', {
          itemType: 'group',
          caption: 'Home Address',
          items: ['Address', 'City', 'State', 'ZipCode'],
        }],
      }, {
        itemType: 'group',
        caption: 'Contact Information',
        items: [{
          itemType: 'tabbed',
          tabPanelOptions: {
            deferRendering: true,
          },
          tabs: [{
            title: 'Phone',
            items: ['Phone'],
          }, {
            title: 'Skype',
            items: ['Skype'],
          }, {
            title: 'Email',
            items: ['Email'],
          }],
        }],
      }],
    }, '#form');

    await removeStylesheetRulesFromPage(page);

    await testScreenshot(page, 'Form labels width after render in invisible container.png');

    });
});
