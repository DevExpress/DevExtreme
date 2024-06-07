import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { isMaterialBased } from '../../helpers/themeUtils';

const testFixture = (): FixtureFn => {
  if (isMaterialBased()) {
    return fixture.disablePageReloads.skip;
  }
  return fixture.disablePageReloads;
};

testFixture().disablePageReloads`PivotGrid_scrolling`
  .page(url(__dirname, '../container.html'));

const createData = (count, innerCount) => {
  const result: object[] = [];

  for (let i = 0; i < count; i += 1) {
    for (let j = 0; j < innerCount; j += 1) {
      result.push({
        item: `item ${i}`,
        date: new Date('2024-01-01'),
        category: `category ${j}`,
        innerA: j,
        innerB: j,
      });
    }
  }

  return result;
};

test('Row fields overlap data fields if dataFieldArea is set to "row" and virtual scrolling is enabled (T1210807)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pivotGrid = new PivotGrid('#container');
  const firstHeaderRow = pivotGrid.getRowsArea(2).getCell(0);
  await t
    .click(firstHeaderRow);
  await pivotGrid.scrollBy({ top: 30000 });
  await pivotGrid.scrollBy({ top: 30000 });

  await takeScreenshot('rows_do_not_overlap_data_fields_if_virtual_scrolling_enabled_T1210807.png', pivotGrid.element);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxPivotGrid', {
  allowExpandAll: true,
  showBorders: true,
  rowHeaderLayout: 'tree',
  dataFieldArea: 'row',
  height: 560,
  scrolling: {
    mode: 'virtual',
  },
  dataSource: {
    fields: [
      {
        dataField: 'item',
        area: 'row',
        width: 120,
      },
      {
        dataField: 'category',
        area: 'row',
        width: 120,
      },
      {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
        groupInterval: 'year',
      },
      {
        dataField: 'innerA',
        dataType: 'number',
        summaryType: 'sum',
        area: 'data',
      },
      {
        dataField: 'innerB',
        dataType: 'number',
        summaryType: 'sum',
        area: 'data',
      },
    ],
    store: createData(50, 5),
  },
}));
