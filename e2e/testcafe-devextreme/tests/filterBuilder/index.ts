/* eslint-disable @typescript-eslint/no-misused-promises */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import FilterBuilder from 'devextreme-testcafe-models/filterBuilder';
import { fields, filter } from './data';
import { testScreenshot } from '../../helpers/themeUtils';

fixture`Editing events`
  .page(url(__dirname, '../container.html'));

test('Field dropdown popup', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const filterBuilder = new FilterBuilder('#container');
  await t.click(filterBuilder.getField(0, 'item').element);

  await testScreenshot(t, takeScreenshot, 'field-dropdown.png', { element: filterBuilder.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxFilterBuilder', {
    fields,
    value: filter,
    allowHierarchicalFields: true,
  });
});

test('operation dropdown popup', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const filterBuilder = new FilterBuilder('#container');
  await t.click(filterBuilder.getField(0, 'itemOperation').element);

  await testScreenshot(t, takeScreenshot, 'operation-dropdown.png', { element: filterBuilder.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxFilterBuilder', {
    fields,
    value: filter,
    allowHierarchicalFields: true,
  });
});
