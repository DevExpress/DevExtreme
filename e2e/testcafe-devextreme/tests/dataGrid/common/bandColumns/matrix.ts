import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { Themes } from '../../../../helpers/themes';

fixture.disablePageReloads`Band columns.Matrix`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

const configs = [{
  showColumnLines: true,
  rtlEnabled: false,
}, {
  showColumnLines: true,
  rtlEnabled: true,
}, {
  showColumnLines: false,
  rtlEnabled: false,
}, {
  showColumnLines: false,
  rtlEnabled: true,
}];

configs.forEach((
  { showColumnLines, rtlEnabled }: { showColumnLines: boolean; rtlEnabled: boolean; },
): void => {
  test.meta({ themes: [Themes.materialBlue, Themes.genericLight] })(`The grid with grouped and fixed columns should display correct vertical borders when showColumnLines=${showColumnLines} and rtl=${rtlEnabled}(T1318812)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(GRID_CONTAINER);

    await t.expect(dataGrid.isReady()).ok();

    await testScreenshot(
      t,
      takeScreenshot,
      `T1318812__datagrid__band-and-grouped-and-fixed-columns__vertical-borders(showColumnLines=${showColumnLines},rtl=${rtlEnabled}).png`,
      { element: dataGrid.element },
    );

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        {
          Col1: 'Data A', Col2: 'Desc A', Col3: 'Group 1', Col4: 'X', Col5: 100, Col6: 50,
        },
        {
          Col1: 'Data B', Col2: 'Desc B', Col3: 'Group 1', Col4: 'Y', Col5: 200, Col6: 20,
        },
        {
          Col1: 'Data C', Col2: 'Desc C', Col3: 'Group 2', Col4: 'Z', Col5: 300, Col6: 10,
        },
      ],
      columns: [
        {
          caption: 'Band Column 1',
          columns: [
            {
              caption: 'Nested BandColumn 1',
              columns: [
                { dataField: 'Col1', width: 150 },
                { dataField: 'Col2', width: 300 },
                { dataField: 'Col3', width: 300, groupIndex: 0 },
              ],
            },
          ],
        },
        {
          caption: 'Band Column 2',
          fixed: true,
          columns: [
            {
              caption: 'Nested Band Column 2',
              columns: [
                { dataField: 'Col4', width: 120 },
              ],
            },
          ],
        },
        {
          caption: 'Band Column 3',
          columns: [
            {
              caption: 'Nested Band Column 3',
              columns: [
                { dataField: 'Col5', width: 150 },
                { dataField: 'Col6', width: 150 },
              ],
            },
          ],
        },
      ],
      showColumnLines,
      rtlEnabled,
      columnWidth: 100,
    });
  });

  test.meta({ themes: [Themes.materialBlue, Themes.genericLight] })(`The grid should display correct vertical borders when showColumnLines=${showColumnLines} and rtl=${rtlEnabled}(T1318812)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(GRID_CONTAINER);

    await t.expect(dataGrid.isReady()).ok();

    await testScreenshot(
      t,
      takeScreenshot,
      `T1318812__datagrid__band-columns__vertical-borders(showColumnLines=${showColumnLines},rtl=${rtlEnabled}).png`,
      { element: dataGrid.element },
    );

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        {
          Col1: 'Data A', Col2: 'Desc A', Col3: 'Group 1', Col4: 'X', Col5: 100, Col6: 50,
        },
        {
          Col1: 'Data B', Col2: 'Desc B', Col3: 'Group 1', Col4: 'Y', Col5: 200, Col6: 20,
        },
        {
          Col1: 'Data C', Col2: 'Desc C', Col3: 'Group 2', Col4: 'Z', Col5: 300, Col6: 10,
        },
      ],
      columns: [
        'Col1',
        {
          caption: 'Band Column 1',
          columns: [
            {
              caption: 'Nested BandColumn 1',
              columns: [
                { dataField: 'Col2', width: 300 },
                { dataField: 'Col3', width: 300 },
              ],
            },
          ],
        },
        {
          caption: 'Band Column 2',
          columns: [
            {
              caption: 'Nested Band Column 2',
              columns: [
                { dataField: 'Col4', width: 120 },
              ],
            },
          ],
        },
        {
          caption: 'Band Column 3',
          columns: [
            {
              caption: 'Nested Band Column 3',
              columns: [
                { dataField: 'Col5', width: 150 },
                { dataField: 'Col6', width: 150 },
              ],
            },
          ],
        },
      ],
      showColumnLines,
      rtlEnabled,
      columnWidth: 100,
    });
  });
});
