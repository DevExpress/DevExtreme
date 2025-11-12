import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
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
