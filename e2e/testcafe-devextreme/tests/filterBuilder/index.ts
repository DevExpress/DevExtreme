/* eslint-disable @typescript-eslint/no-misused-promises */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import FilterBuilder from 'devextreme-testcafe-models/filterBuilder';
import { DataType } from 'devextreme/ui/filter_builder';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import { fields, filter } from './data';
import { testScreenshot } from '../../helpers/themeUtils';

fixture.disablePageReloads`Editing events`
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

// T1222027
test('Dropdown Treeview should have no empty space', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const filterBuilder = new FilterBuilder('#container');
  await t.click(filterBuilder.getField(0, 'itemAction').element);

  await testScreenshot(t, takeScreenshot, 'dropdown-space.png', { element: filterBuilder.element });

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

[
  { dataType: 'date', value: 1740441600000 },
  { dataType: 'date', value: '2025-02-25T00:00:00.000Z' },
  { dataType: 'date', value: new Date('2025-02-25T00:00:00.000Z') },
  { dataType: 'datetime', value: 1740441600000 },
  { dataType: 'datetime', value: '2025-02-25T00:00:00.000Z' },
  { dataType: 'datetime', value: new Date('2025-02-25T00:00:00.000Z') },
].forEach(({ dataType, value }) => {
  test(`item value text should be correct for dataType: ${dataType} and valueType: ${typeof value}`, async (t) => {
    const filterBuilder = new FilterBuilder('#container');

    const date = new Date(value);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' });

    const expectedValue = dataType === 'date' ? dateString : `${dateString}, ${timeString}`;

    await t.expect(filterBuilder.getField(0).getValueText().textContent).eql(expectedValue);
  }).before(async () => {
    await createWidget('dxFilterBuilder', {
      fields: [
        {
          dataField: 'field1',
          dataType: dataType as DataType,
        },
      ],
      value: ['field1', '=', value],
    });
  });
});
