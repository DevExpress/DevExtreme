import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../containerQuill.html'));

[undefined, true, false].forEach((labelVisible) => {
  ['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
    [undefined, 'floating', 'hidden', 'static'].forEach((editorLabelMode) => {
      const testName = `Priorities, lblMode=${formLabelMode},lblVis=${labelVisible},edtr.lblMode=${editorLabelMode}`;
      test(testName, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => createWidget('dxForm', {
        width: 1000,
        labelMode: formLabelMode,
        colCount: 2,
        items: [
          {
            dataField: 'field1', label: { visible: labelVisible }, editorType: 'dxAutocomplete', editorOptions: { items: ['1', '2'], labelMode: editorLabelMode },
          },
          {
            dataField: 'field2', label: { visible: labelVisible }, editorType: 'dxCalendar', editorOptions: { value: new Date(2021, 9, 17), labelMode: editorLabelMode },
          },
          {
            dataField: 'field3', label: { visible: labelVisible }, editorType: 'dxCheckBox', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field4', label: { visible: labelVisible }, editorType: 'dxColorBox', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field5', label: { visible: labelVisible }, editorType: 'dxDateBox', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field6', label: { visible: labelVisible }, editorType: 'dxDropDownBox', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field7', label: { visible: labelVisible }, editorType: 'dxHtmlEditor', editorOptions: { labelMode: editorLabelMode, height: 100, toolbar: { items: ['undo', 'redo', 'separator', 'insertTable', 'deleteTable', 'insertRowAbove', 'insertRowBelow', 'deleteRow', 'insertColumnLeft', 'insertColumnRight', 'deleteColumn'] } },
          },
          {
            dataField: 'field8', label: { visible: labelVisible }, editorType: 'dxLookup', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field9', label: { visible: labelVisible }, editorType: 'dxNumberBox', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field10', label: { visible: labelVisible }, editorType: 'dxRadioGroup', editorOptions: { items: ['1', '2'], labelMode: editorLabelMode },
          },
          {
            dataField: 'field11', label: { visible: labelVisible }, editorType: 'dxRangeSlider', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field12', label: { visible: labelVisible }, editorType: 'dxSelectBox', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field13', label: { visible: labelVisible }, editorType: 'dxSlider', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field14', label: { visible: labelVisible }, editorType: 'dxSwitch', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field15', label: { visible: labelVisible }, editorType: 'dxTagBox', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field16', label: { visible: labelVisible }, editorType: 'dxTextArea', editorOptions: { labelMode: editorLabelMode },
          },
          {
            dataField: 'field17', label: { visible: labelVisible }, editorType: 'dxTextBox', editorOptions: { labelMode: editorLabelMode },
          },
        ],
      }));
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
        width: 500,
        items: [
          { dataField: 'field1', editorType: 'dxAutocomplete', editorOptions: { items: ['1', '2'] } },
          { dataField: 'field2', editorType: 'dxCalendar', editorOptions: { value: new Date(2021, 9, 17) } },
          { dataField: 'field3', editorType: 'dxCheckBox' },
          { dataField: 'field4', editorType: 'dxColorBox' },
          { dataField: 'field5', editorType: 'dxDateBox' },
          { dataField: 'field6', editorType: 'dxDropDownBox' },
          { dataField: 'field7', editorType: 'dxHtmlEditor', editorOptions: { height: 100, toolbar: { items: ['undo', 'redo'] } } },
          { dataField: 'field8', editorType: 'dxLookup' },
          { dataField: 'field9', editorType: 'dxNumberBox' },
          { dataField: 'field10', editorType: 'dxRadioGroup', editorOptions: { items: ['1', '2'] } },
          { dataField: 'field11', editorType: 'dxRangeSlider' },
          { dataField: 'field12', editorType: 'dxSelectBox' },
          { dataField: 'field13', editorType: 'dxSlider' },
          { dataField: 'field14', editorType: 'dxSwitch' },
          { dataField: 'field15', editorType: 'dxTagBox' },
          { dataField: 'field16', editorType: 'dxTextArea' },
          { dataField: 'field17', editorType: 'dxTextBox' },
        ],
      } as any;

      if (formLabelMode !== undefined) {
        options.labelMode = formLabelMode;
      }
      return createWidget('dxForm', options);
    });
  });
});
