import FilterBuilder from 'devextreme-testcafe-models/filterBuilder';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';

fixture`FilterBuilder - Field naming`
  .page(url(__dirname, '../container.html'));

// T1253754
test('FilterBuilder - First field uses the dataField property while subsequent fields use the name property in the filter value', async (t) => {
  const filterBuilder = new FilterBuilder('#container');

  const expectedValues = [
    [
      ['name1', '<>', 0],
      'and',
      ['name1', 'contains', 'A'],
    ],
    [
      ['name1', '<>', 0],
      'and',
      ['name2', 'contains', 'A'],
    ],
  ];
  await t
    .click(filterBuilder.getAddButton())
    .expect(FilterBuilder.getPopupTreeView().visible).ok()
    .click(FilterBuilder.getPopupTreeViewNode(0))
    .click(filterBuilder.getField(1, 'itemValue').element)
    .pressKey('A enter');

  await t
    .expect(await filterBuilder.option('value'))
    .eql(expectedValues[0]);

  await t
    .click(filterBuilder.getField(1, 'item').element)
    .expect(FilterBuilder.getPopupTreeView().visible).ok()
    .click(FilterBuilder.getPopupTreeViewNode(1))
    .click(filterBuilder.getField(1, 'itemValue').element)
    .pressKey('A enter');

  await t
    .expect(await filterBuilder.option('value'))
    .eql(expectedValues[1]);
})
  .before(async () => {
    await createWidget('dxFilterBuilder', {
      value: [
        ['dataField1', '<>', 0],
      ],
      fields: [
        { dataField: 'dataField1', name: 'name1' },
        { dataField: 'dataField2', name: 'name2' },
      ],
    });
  });
