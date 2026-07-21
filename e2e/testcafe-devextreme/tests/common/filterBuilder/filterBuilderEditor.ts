import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DropDownButton from 'devextreme-testcafe-models/dropDownButton';
import FilterBuilder from 'devextreme-testcafe-models/filterBuilder';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { fields, filter } from './data';
import { testScreenshot } from '../../../helpers/themeUtils';
import { Themes } from '../../../helpers/themes';

fixture.disablePageReloads`Editing events`
  .page(url(__dirname, '../../container.html'));

// T1310528
test.meta({ themes: [Themes.materialBlue] })('Change value editor to checkbox', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const filterBuilder = new FilterBuilder('#container');
  await t.click(filterBuilder.getField(0, 'itemValue').element);

  await testScreenshot(t, takeScreenshot, 'value-editor-checkbox.png', { element: filterBuilder.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxFilterBuilder', {
    fields,
    value: filter,
    allowHierarchicalFields: true,
    onEditorPreparing: (data) => {
      data.editorName = 'dxCheckBox';
    },
  });
});

// T1310528
test('Change value editor to switch', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const filterBuilder = new FilterBuilder('#container');
  await t.click(filterBuilder.getField(0, 'itemValue').element);

  await testScreenshot(t, takeScreenshot, 'value-editor-switch.png', { element: filterBuilder.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxFilterBuilder', {
    fields,
    value: filter,
    allowHierarchicalFields: true,
    onEditorPreparing: (data) => {
      data.editorName = 'dxSwitch';
    },
  });
});

// T1300811
test('Editor rendered in DropDownButton dropDownContentTemplate should close after clicking outside', async (t) => {
  // arrange
  const dropDownButton = new DropDownButton('#container');

  // act
  await t.click(dropDownButton.element);

  // arrange
  const filterBuilder = new FilterBuilder('#filterBuilder');

  // assert
  await t.expect(filterBuilder.isReady()).ok();

  const field = filterBuilder.getField(0);
  await t.expect(field.getValueText().textContent).eql('<enter a value>');

  // act
  await t
    .click(field.getValueText())
    .typeText(field.getTextBox().getInput(), 'test')
    .click(await dropDownButton.getPopup());

  // assert
  await t
    .expect(field.getTextBox().element.exists)
    .notOk()
    .expect(field.getValueText().textContent)
    .eql('test');
}).before(async () => {
  await createWidget('dxDropDownButton', {
    dropDownOptions: {
      width: 400,
      height: 100,
    },
    dropDownContentTemplate() {
      return ($('<div>') as any)
        .attr('id', 'filterBuilder')
        .dxFilterBuilder({
          fields: [{ dataField: 'text' }],
          value: ['text', 'contains', ''],
        });
    },
  });
});
