import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { OLAPApiMock } from '../apiMocks/OLAP_api.mock';

fixture.disablePageReloads`pivotGrid_olap_drag-n-drop`
  .page(url(__dirname, '../../container.html'));

const PIVOT_GRID_SELECTOR = '#container';

[true, false].forEach((showRowGrandTotals) => {
  test(`Empty table has one ${showRowGrandTotals ? 'total' : 'empty'} row after drag-n-drop for paginated data`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
    const loadPanel = pivotGrid.getLoadPanel();

    await t.expect(loadPanel.isInvisible()).ok();
    await pivotGrid.scrollTo({ top: 5000 });
    await t
      .wait(1000)
      .expect(loadPanel.isInvisible()).ok();
    await t.dragToElement(
      pivotGrid.getRowHeaderArea().getField(),
      pivotGrid.getColumnHeaderArea().element,
    );
    await t.expect(loadPanel.isInvisible()).ok();

    await testScreenshot(
      t,
      takeScreenshot,
      `empty_table_after_dnd (showRowGrandTotals=${showRowGrandTotals}).png`,
      { element: pivotGrid.element },
    );

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.addRequestHooks(OLAPApiMock);
    await createWidget('dxPivotGrid', {
      height: 500,
      fieldPanel: { visible: true },
      showRowGrandTotals,
      scrolling: { mode: 'virtual', useNative: false },
      dataSource: {
        paginate: true,
        fields: [
          { dataField: '[Customer].[Customer]', area: 'row' },
          { dataField: '[Ship Date].[Calendar Year]', area: 'column' },
          { dataField: '[Measures].[Internet Sales Amount]', area: 'data' },
        ],
        store: {
          type: 'xmla',
          url: 'https://api/data',
          catalog: 'Catalog',
          cube: 'Cube',
        },
      },
    });
  });
});
