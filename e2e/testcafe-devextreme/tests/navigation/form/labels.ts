import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { HorizontalAlignment } from 'devextreme/common';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { isMaterialBased, testScreenshot } from '../../../helpers/themeUtils';
import { appendElementTo, insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../helpers/domUtils';

const waitFont = ClientFunction(() => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400));

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((rtlEnabled) => {
  ['left', 'right', 'top'].forEach((formLabelLocation) => {
    ['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
      const testName = `Form,rtl=${rtlEnabled},lMode=${formLabelMode},lLoc=${formLabelLocation}`;

      test(testName, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => {
        await waitFont();

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

        return createWidget('dxForm', {
          rtlEnabled,
          width: 1000,
          labelMode: formLabelMode,
          labelLocation: formLabelLocation,
          items,
        });
      });
    });
  });
});

[true, false].forEach((alignItemLabelsInAllGroups) => {
  [true, false].forEach((alignItemLabels) => {
    const testName = `Align items,lblMode=outside,alignInAllGrp=${alignItemLabelsInAllGroups},alignInGrp=${alignItemLabels}`;
    test(testName, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
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

      return createWidget('dxForm', options);
    });
  });
});

test('Item label position properties, labelMode=outside', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Item label position properties, labelMode=outside.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
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

  return createWidget('dxForm', options);
});

test('Color of the mark (T882067)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const screenshotName = 'Form color of the mark.png';

  await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container' });

  if (!isMaterialBased()) {
    await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container', theme: 'generic.dark' });
    await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container', theme: 'generic.contrast' });
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
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
}));

test('Form labels should have correct width after render in invisible container', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Form labels width after render in invisible container.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'form');
  await insertStylesheetRulesToPage('#container { display: none; }');

  await createWidget('dxForm', {
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

  await removeStylesheetRulesFromPage();
});
