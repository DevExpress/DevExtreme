import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { blurActiveElement } from '../../../../helpers/domUtils';
import { dragToElement } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import PivotGrid from '../../../../models/pivotGrid';
import { mockOLAPApi } from '../apiMocks/OLAP_api.mock';

const PIVOT_GRID_SELECTOR = '#container';
const INVISIBLE = /dx-state-invisible/;

[true, false].forEach((showRowGrandTotals) => {
  test(`Empty table has one ${showRowGrandTotals ? 'total' : 'empty'} row after drag-n-drop for paginated data`, async ({ page }) => {
    await mockOLAPApi(page);
    await createWidget(page, 'dxPivotGrid', {
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

    const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
    const loadPanel = pivotGrid.getLoadPanel();

    await expect(loadPanel.element).toHaveClass(INVISIBLE);

    // The scroll asks the cube for the next page; the load is over when its answer has arrived.
    const pageLoaded = page.waitForResponse((response) => response.url().includes('/api/data'));

    await pivotGrid.scrollTo({ top: 5000 });
    await pageLoaded;

    await expect(loadPanel.element).toHaveClass(INVISIBLE);

    await dragToElement(
      page,
      pivotGrid.getRowHeaderArea().getField(),
      pivotGrid.getColumnHeaderArea().element,
    );

    await expect(loadPanel.element).toHaveClass(INVISIBLE);

    await blurActiveElement(page);

    await testScreenshot(
      page,
      `empty_table_after_dnd (showRowGrandTotals=${showRowGrandTotals}).png`,
      { element: pivotGrid.element },
    );
  });
});
