import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction, Selector } from 'testcafe';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import { defaultConfig } from '../helpers/data';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`FixedColumns`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

safeSizeTest('The simulated scrollbar should display correctly when there are sticky columns', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scrollbarVerticalThumbTrack = dataGrid.getScrollBarThumbTrack('horizontal');

  await t.expect(dataGrid.isReady()).ok();

  await t.hover(scrollbarVerticalThumbTrack);
  await takeScreenshot('simulated_scrollbar_with_sticky_columns_1.png', dataGrid.element);

  // act
  await t
    .drag(scrollbarVerticalThumbTrack, 600, 0)
    .wait(1000);

  await takeScreenshot('simulated_scrollbar_with_sticky_columns_2.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 800]).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 25),
  width: 984,
  columnAutoWidth: true,
  scrolling: {
    useNative: false,
  },
  customizeColumns: (columns) => {
    columns[5].fixed = true;
    columns[5].fixedPosition = 'left';
    columns[6].fixed = true;
    columns[6].fixedPosition = 'left';

    columns[8].fixed = true;
    columns[8].fixedPosition = 'right';
    columns[9].fixed = true;
    columns[9].fixedPosition = 'right';
  },
}));

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
// visual: generic.greenMist.light
safeSizeTest(`Header hover should display correctly when there are fixed columns (generic.light theme)`, async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(13);

  await t.expect(dataGrid.isReady()).ok();

  await t.hover(headerCell.element);

  await t.expect(headerCell.isHovered()).ok();

  await takeScreenshot(`datagrid_header_hover_with_fixed_columns_(generic.light).png`, dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800])
  .before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      columnAutoWidth: true,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';

        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    });
  })
  .after(async (t) => {
    await t.hover(Selector('body'));
  });

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
// visual: generic.greenMist.light
test.meta({ unstable: true })(`Row hover should display correctly when there are fixed columns (generic.light theme)`, async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const dataRow = dataGrid.getDataRow(1);

  await t.expect(dataGrid.isReady()).ok();

  await t.hover(dataRow.element);

  await t.expect(dataRow.isHovered).ok();

  await takeScreenshot(`datagrid_row_hover_with_fixed_columns_(generic.light).png`, dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
})
  .before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      columnAutoWidth: true,
      hoverStateEnabled: true,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';

        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    });
  })
  .after(async (t) => {
    await t.hover(Selector('body'));
  });

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
// visual: generic.greenMist.light
safeSizeTest(`Alternating rows should display correctly when there are fixed columns (generic.light theme)`, async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await takeScreenshot(`datagrid_row_alt_with_fixed_columns_(generic.light).png`, dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800])
  .before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: getData(20, 15),
      columnWidth: 100,
      columnAutoWidth: true,
      rowAlternationEnabled: true,
      customizeColumns: (columns) => {
        columns[5].fixed = true;
        columns[5].fixedPosition = 'left';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'left';

        columns[8].fixed = true;
        columns[8].fixedPosition = 'right';
        columns[9].fixed = true;
        columns[9].fixedPosition = 'right';
      },
    });
  });

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
[0.9, 1.25, 1.5].forEach((zoom) => {
  safeSizeTest(`Fixed columns should display correctly at ${zoom * 100}% zoom (generic.light theme)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t.expect(dataGrid.isReady()).ok();

    await takeScreenshot(`fixed_columns_with_${zoom * 100}%_zoom_(generic.light).png`, dataGrid.element);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800])
    .before(async () => {
      await ClientFunction((zoomValue: number) => {
        $('body').css('zoom', zoomValue);
      })(zoom);
      await createWidget('dxDataGrid', {
        dataSource: getData(20, 15),
        columnWidth: 100,
        columnAutoWidth: true,
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';

          columns[8].fixed = true;
          columns[8].fixedPosition = 'right';
          columns[9].fixed = true;
          columns[9].fixedPosition = 'right';
        },
      });
    })
    .after(async () => {
      await ClientFunction(() => {
        $('body').css('zoom', '');
      })();
    });
});

safeSizeTest('The grid should display correctly when there is no data and there are fixed columns (T1269088)', async (t) => {
  // arrange, act
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await takeScreenshot('T1269088_grid_with_fixed_columns_and_without_data.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1000, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  dataSource: [],
}));
