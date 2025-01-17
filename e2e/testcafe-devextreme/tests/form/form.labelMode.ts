import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { isMaterial, isMaterialBased, testScreenshot } from '../../helpers/themeUtils';

const waitFont = ClientFunction(() => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400));

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../container.html'));

['left', 'right', 'top'].forEach((formLabelLocation) => {
  ['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
    [undefined, 'floating', 'hidden', 'static'].forEach((editorLabelMode) => {
      ['outlined', 'underlined', 'filled'].forEach((editorStylingMode) => {
        [true, false].forEach((labelVisible) => {
          ['center', 'left', 'right'].forEach((labelAlignment) => {
            if ((!labelVisible || editorLabelMode)
              && (
                labelAlignment !== 'left'
                || formLabelLocation !== 'left'
                || (editorStylingMode !== 'outlined' && !isMaterialBased())
                || (editorStylingMode !== 'filled' && isMaterialBased())
              )) {
              // skip excess configurations
              return;
            }

            if (labelVisible && isMaterial()) {
              // There is no specificity for the Material theme
              return;
            }

            const testName = `Form,lMode=${formLabelMode},lLoc=${formLabelLocation},lVis=${labelVisible},lAl=${labelAlignment},e.lMode=${editorLabelMode ?? 'undef'},e.sMode=${editorStylingMode}`;

            test(testName, async (t) => {
              const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

              await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

              await t
                .expect(compareResults.isValid())
                .ok(compareResults.errorMessages());
            }).before(async () => {
              await waitFont();

              return createWidget('dxForm', {
                width: 1100,
                height: 800,
                labelMode: formLabelMode,
                labelLocation: formLabelLocation,
                colCount: 3,
                items: [
                  {
                    dataField: 'field1',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxAutocomplete',
                    editorOptions: {
                      items: ['1', '2'],
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field2',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxTextBox',
                    editorOptions: {
                      value: 'dxTextBox',
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field3',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxCheckBox',
                    editorOptions: {
                      value: true,
                      text: 'dxCheckBox',
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field4',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxColorBox',
                    editorOptions: {
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field5',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxDateBox',
                    editorOptions: {
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field6',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxDropDownBox',
                    editorOptions: {
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field7',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxTextArea',
                    editorOptions: {
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field8',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxLookup',
                    editorOptions: {
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field9',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxNumberBox',
                    editorOptions: {
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field10',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxRadioGroup',
                    editorOptions: {
                      items: ['1', '2'],
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field11',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxRangeSlider',
                    editorOptions: {
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field12',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxSelectBox',
                    editorOptions: {
                      items: ['1', '2'],
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field13',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxSlider',
                    editorOptions: {
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field14',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxSwitch',
                    editorOptions: {
                      value: true,
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field15',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxTagBox',
                    editorOptions: {
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                  {
                    dataField: 'field16',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxHtmlEditor',
                    editorOptions: {
                      labelMode: editorLabelMode,
                      height: 100,
                      stylingMode: editorStylingMode,
                      toolbar: { items: ['undo', 'redo', 'separator', 'insertTable', 'deleteTable', 'insertRowAbove', 'insertRowBelow', 'deleteRow'] },
                    },
                  },
                  {
                    dataField: 'field17',
                    label: {
                      visible: labelVisible,
                      alignment: labelAlignment,
                    },
                    editorType: 'dxCalendar',
                    editorOptions: {
                      value: new Date(2021, 9, 17),
                      labelMode: editorLabelMode,
                      stylingMode: editorStylingMode,
                    },
                  },
                ],
              });
            });
          });
        });
      });
    });
  });
});

['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
  [true, false].forEach((alignItemLabelsInAllGroups) => {
    [true, false].forEach((alignItemLabels) => {
      const testName = `align items,lblMode=${formLabelMode},alignInAllGrp=${alignItemLabelsInAllGroups},alignInGrp=${alignItemLabels}`;
      test(testName, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => {
        const options = {
          labelMode: formLabelMode,
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
        } as any;

        if (formLabelMode !== undefined) {
          options.labelMode = formLabelMode;
        }
        return createWidget('dxForm', options);
      });
    });
  });
});

['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
  const testName = `label properties, lblMode=${formLabelMode}`;
  test(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const options = {
      labelMode: formLabelMode,
      width: 500,
      items: [
        { dataField: 'field1', label: { location: 'left', alignment: 'left' }, editorType: 'dxTextBox' },
        { dataField: 'field2', label: { location: 'left', alignment: 'center' }, editorType: 'dxTextBox' },
        { dataField: 'field3', label: { location: 'left', alignment: 'right' }, editorType: 'dxTextBox' },
        { dataField: 'field4', label: { location: 'top', alignment: 'left' }, editorType: 'dxTextBox' },
        { dataField: 'field5', label: { location: 'top', alignment: 'center' }, editorType: 'dxTextBox' },
        { dataField: 'field6', label: { location: 'top', alignment: 'right' }, editorType: 'dxTextBox' },
        { dataField: 'field7', label: { location: 'right', alignment: 'left' }, editorType: 'dxTextBox' },
        { dataField: 'field8', label: { location: 'right', alignment: 'center' }, editorType: 'dxTextBox' },
        { dataField: 'field9', label: { location: 'right', alignment: 'right' }, editorType: 'dxTextBox' },
      ],
    } as any;

    if (formLabelMode !== undefined) {
      options.labelMode = formLabelMode;
    }
    return createWidget('dxForm', options);
  });
});

['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
  [true, false].forEach((showColonAfterLabel) => {
    const testName = `show semicolon, lblMode=${formLabelMode}, shwSmclnAfterlbl=${showColonAfterLabel}`;
    test(testName, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      const options = {
        labelMode: formLabelMode,
        showColonAfterLabel,
        width: 1100,
        height: 800,
        colCount: 3,
        items: [
          { dataField: 'field1', editorType: 'dxAutocomplete', editorOptions: { items: ['1', '2'] } },
          { dataField: 'field2', editorType: 'dxTextBox' },
          { dataField: 'field3', editorType: 'dxCheckBox' },
          { dataField: 'field4', editorType: 'dxColorBox' },
          { dataField: 'field5', editorType: 'dxDateBox' },
          { dataField: 'field6', editorType: 'dxDropDownBox' },
          { dataField: 'field7', editorType: 'dxTextArea' },
          { dataField: 'field8', editorType: 'dxLookup' },
          { dataField: 'field9', editorType: 'dxNumberBox' },
          { dataField: 'field10', editorType: 'dxRadioGroup', editorOptions: { items: ['1', '2'] } },
          { dataField: 'field11', editorType: 'dxRangeSlider' },
          { dataField: 'field12', editorType: 'dxSelectBox' },
          { dataField: 'field13', editorType: 'dxSlider' },
          { dataField: 'field14', editorType: 'dxSwitch' },
          { dataField: 'field15', editorType: 'dxTagBox' },
          { dataField: 'field16', editorType: 'dxHtmlEditor', editorOptions: { height: 100, toolbar: { items: ['undo', 'redo'] } } },
          { dataField: 'field17', editorType: 'dxCalendar', editorOptions: { value: new Date(2021, 9, 17) } },
        ],
      } as any;

      if (formLabelMode !== undefined) {
        options.labelMode = formLabelMode;
      }
      return createWidget('dxForm', options);
    });
  });
});
