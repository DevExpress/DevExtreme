import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Grouping Panel - check borders and backgrounds with various options`
  .page(url(__dirname, '../../../container.html'));

interface MatrixOptions {
  rowAlternationEnabled: boolean;
  showColumnLines: boolean;
  showRowLines: boolean;
  showBorders: boolean;
  hasFixedColumn: boolean;
  hasMasterDetail: boolean;
}

const SELECTORS = {
  gridContainer: 'container',
  masterDetailRowClass: 'dx-master-detail-row',
  groupRowClass: 'dx-group-row',
  rowLinesClass: 'dx-row-lines',
  groupSpaceClass: 'dx-datagrid-group-space',
  pointerEventsNoneClass: 'dx-pointer-events-none',
  rowAlternativeClass: 'dx-row-alt',
};

const BORDER_WIDTH = {
  big: 2,
  normal: 1,
  none: 0,
};

const dataSource = [
  {
    group: 'A',
    label: 'LABEL_A_0',
    value: 'VALUE_A_0',
    count: 1,
  },
  {
    group: 'A',
    label: 'LABEL_A_1',
    value: 'VALUE_A_1',
    count: 2,
  },
  {
    group: 'B',
    label: 'LABEL_B_0',
    value: 'VALUE_B_0',
    count: 3,
  },
  {
    group: 'B',
    label: 'LABEL_B_1',
    value: 'VALUE_B_1',
    count: 4,
  },
  {
    group: 'B',
    label: 'LABEL_B_2',
    value: 'VALUE_B_2',
    count: 5,
  },
  {
    group: 'C',
    label: 'LABEL_C_0',
    value: 'VALUE_C_0',
    count: 6,
  },
  {
    group: 'C',
    label: 'LABEL_C_1',
    value: 'VALUE_C_1',
    count: 7,
  },
];

const getTestParams = ({
  rowAlternationEnabled,
  showColumnLines,
  showRowLines,
  showBorders,
  hasFixedColumn,
  hasMasterDetail,
}: MatrixOptions) => [
  `rowAlternationEnabled: ${rowAlternationEnabled}`,
  `showColumnLines: ${showColumnLines}`,
  `showRowLines: ${showRowLines}`,
  `showBorders: ${showBorders}`,
  `hasFixedColumn: ${hasFixedColumn}`,
  `hasMasterDetail: ${hasMasterDetail}`,
].join(', ');

const createDataGrid = async ({
  rowAlternationEnabled,
  showColumnLines,
  showRowLines,
  showBorders,
  hasFixedColumn,
  hasMasterDetail,
}: MatrixOptions) => {
  await createWidget('dxDataGrid', {
    dataSource,
    columnFixing: {
      // @ts-expect-error private option
      legacyMode: true,
    },
    columns: [
      {
        dataField: 'group',
        groupIndex: 0,
      },
      {
        dataField: 'label',
        fixed: hasFixedColumn,
      },
      'value',
      'count',
    ],
    summary: {
      groupItems: [{
        column: 'count',
        summaryType: 'sum',
      }],
    },
    masterDetail: hasMasterDetail
      ? {
        enabled: true,
        autoExpandAll: true,
        template: ($container) => {
          $('<div>')
            .text('MASTER DETAIL')
            .appendTo($container);
        },
      }
      : undefined,
    editing: {
      mode: 'row',
      allowDeleting: true,
      confirmDelete: false,
    },
    showBorders,
    rowAlternationEnabled,
    showRowLines,
    showColumnLines,
  });
};

const checkShowBordersState = async (
  t: TestController,
  dataGrid: DataGrid,
  showBorders: boolean,
) => {
  const expectedBorderWidth = showBorders ? BORDER_WIDTH.normal : BORDER_WIDTH.none;

  const gridContainer = dataGrid.getContainer();
  const containerClasses = await gridContainer.getAttribute('class');

  if (showBorders) {
    await t.expect(containerClasses).contains('dx-datagrid-borders');
  } else {
    await t.expect(containerClasses).notContains('dx-datagrid-borders');
  }

  const headersContainer = dataGrid.getHeadersContainer();

  const borderTop = await headersContainer.getStyleProperty('border-top-width');
  const borderLeft = await headersContainer.getStyleProperty('border-left-width');
  const borderRight = await headersContainer.getStyleProperty('border-right-width');

  await t.expect(parseInt(borderTop, 10)).eql(expectedBorderWidth);
  await t.expect(parseInt(borderLeft, 10)).eql(expectedBorderWidth);
  await t.expect(parseInt(borderRight, 10)).eql(expectedBorderWidth);

  const rowsView = dataGrid.getRowsView();

  const rowsViewBorderLeft = await rowsView.getStyleProperty('border-left-width');
  const rowsViewBorderRight = await rowsView.getStyleProperty('border-right-width');
  const rowsViewBorderBottom = await rowsView.getStyleProperty('border-bottom-width');

  await t.expect(parseInt(rowsViewBorderLeft, 10)).eql(expectedBorderWidth);
  await t.expect(parseInt(rowsViewBorderRight, 10)).eql(expectedBorderWidth);
  await t.expect(parseInt(rowsViewBorderBottom, 10)).eql(expectedBorderWidth);
};

const checkShowRowLinesState = async (
  t: TestController,
  dataGrid: DataGrid,
  showRowLines: boolean,
  showBorders: boolean,
) => {
  const expectedBorderWidth = showRowLines ? BORDER_WIDTH.normal : BORDER_WIDTH.none;
  /*
    getRows() returns double collection of rows (two tables) when
    columnFixing.legacyMode = true AND DataGrid has fixed columns
  */
  const filteredRows = dataGrid.getRows().filter(`.${SELECTORS.rowLinesClass}`);
  const cells = filteredRows.find('td');
  const cellsCount = await cells.count;

  for (let i = 0; i < cellsCount; i += 1) {
    const dataCell = cells.nth(i);

    // Skip checking for last lines if showBorders is enabled
    if (showBorders) {
      const parentRow = dataCell.parent('tr');
      const nextRow = parentRow.nextSibling('tr.dx-row-lines');
      const isLastRow = await nextRow.count === 0;

      if (isLastRow) {
      // eslint-disable-next-line no-continue
        continue;
      }
    }

    const borderBottom = await dataCell.getStyleProperty('border-bottom-width');
    await t.expect(parseInt(borderBottom, 10)).eql(expectedBorderWidth);
  }
};

const checkShowColumnLinesState = async (
  t: TestController,
  dataGrid: DataGrid,
  showColumnLines: boolean,
) => {
  const getExpBorderWith = (
    isColumnLinesEnabled: boolean,
    hasPointerEventsNoneClass: boolean,
  ) => {
    if (hasPointerEventsNoneClass) {
      return BORDER_WIDTH.big;
    }

    if (isColumnLinesEnabled) {
      return BORDER_WIDTH.normal;
    }

    return BORDER_WIDTH.none;
  };

  /*
    getRows() returns double collection of rows (two tables) when
    columnFixing.legacyMode = true AND DataGrid has fixed columns
  */
  const filteredRows = dataGrid.getRows().filter(`:not(.${SELECTORS.masterDetailRowClass})`);
  const cells = filteredRows.find(`td:not(.${SELECTORS.groupSpaceClass})`);

  const cellsCount = await cells.count;

  for (let i = 0; i < cellsCount; i += 1) {
    const cell = cells.nth(i);

    const parentRow = cell.parent('tr');
    const rowCells = parentRow.find(`td:not(.${SELECTORS.groupSpaceClass})`);
    const rowCellsCount = await rowCells.count;
    const indexInRow = await cell.prevSibling(`td:not(.${SELECTORS.groupSpaceClass})`).count;

    const isFirstCellInRow = indexInRow === 0;
    const isLastCellInRow = indexInRow === rowCellsCount - 1;

    const cellClasses = await cell.getAttribute('class');
    const hasPointerEventsNoneClass = cellClasses?.includes(SELECTORS.pointerEventsNoneClass);
    const expectedBorderWidth = getExpBorderWith(showColumnLines, !!hasPointerEventsNoneClass);

    if (!isFirstCellInRow) {
      const borderLeftWidth = await cell.getStyleProperty('border-left-width');

      await t.expect(parseInt(borderLeftWidth, 10)).eql(expectedBorderWidth);
    }

    if (!isLastCellInRow) {
      const borderRightWidth = await cell.getStyleProperty('border-right-width');

      await t.expect(parseInt(borderRightWidth, 10)).eql(expectedBorderWidth);
    }
  }
};

const checkRowAlternationEnabledState = async (
  t: TestController,
  dataGrid: DataGrid,
  rowAlternationEnabled: boolean,
) => {
  /*
    getRows() returns double collection of rows (two tables) when
    columnFixing.legacyMode = true AND DataGrid has fixed columns
  */
  const filteredRows = dataGrid.getRows().filter(`:not(.${SELECTORS.masterDetailRowClass})`);
  const filteredRowsLength = await filteredRows.count;

  let i = 1;
  while (i < filteredRowsLength) {
    const currentRow = filteredRows.nth(i);
    const previousRow = filteredRows.nth(i - 1);

    const currentClasses = await currentRow.getAttribute('class');
    const previousClasses = await previousRow.getAttribute('class');

    if (currentClasses?.includes(SELECTORS.groupRowClass)) {
      i += 2;
      // eslint-disable-next-line no-continue
      continue;
    }

    if (previousClasses?.includes(SELECTORS.groupRowClass)) {
      i += 1;
      // eslint-disable-next-line no-continue
      continue;
    }

    const currentHasAltClass = currentClasses?.includes(SELECTORS.rowAlternativeClass);
    const previousHasAltClass = previousClasses?.includes(SELECTORS.rowAlternativeClass);

    if (rowAlternationEnabled) {
      await t.expect(currentHasAltClass).notEql(previousHasAltClass);
    } else {
      await t.expect(currentHasAltClass).eql(previousHasAltClass);
    }

    const currentFirstCell = currentRow.find('td').nth(0);
    const previousFirstCell = previousRow.find('td').nth(0);

    const currentFirstCellBg = await currentFirstCell.getStyleProperty('background-color');
    const previousFirstCellBg = await previousFirstCell.getStyleProperty('background-color');

    if (rowAlternationEnabled) {
      await t.expect(currentFirstCellBg).notEql(previousFirstCellBg);
    } else {
      await t.expect(currentFirstCellBg).eql(previousFirstCellBg);
    }

    i += 1;
  }
};

const verifyGridStyles = async (t: TestController, dataGrid: DataGrid, {
  showBorders, showRowLines, rowAlternationEnabled, showColumnLines,
}: MatrixOptions) => {
  await checkShowBordersState(t, dataGrid, showBorders);
  await checkShowRowLinesState(t, dataGrid, showRowLines, showBorders);
  await checkShowColumnLinesState(t, dataGrid, showColumnLines);
  await checkRowAlternationEnabledState(t, dataGrid, rowAlternationEnabled);
};

const functionalTest = (matrixOptions: MatrixOptions) => {
  test(`Should have correct applied styles with ${getTestParams(matrixOptions)}`, async (t) => {
    const dataGrid = new DataGrid(`#${SELECTORS.gridContainer}`);
    await t
      .expect(dataGrid.isReady())
      .ok();

    await verifyGridStyles(t, dataGrid, matrixOptions);

    const rowIdx = matrixOptions.hasMasterDetail ? 8 : 5;
    const colIdx = matrixOptions.hasMasterDetail ? 5 : 4;
    const deleteBtn = matrixOptions.hasFixedColumn
      ? dataGrid.getFixedDataRow(rowIdx).getCommandCell(colIdx).element
      : dataGrid.getDataRow(rowIdx).getCommandCell(colIdx).element;

    await t.click(deleteBtn);

    await verifyGridStyles(t, dataGrid, matrixOptions);
  }).before(async () => {
    await createDataGrid(matrixOptions);
  });
};

[true, false].forEach((hasFixedColumn) => {
  [true, false].forEach((hasMasterDetail) => {
    [true, false].forEach((rowAlternationEnabled) => {
      [true, false].forEach((showColumnLines) => {
        [true, false].forEach((showRowLines) => {
          [true, false].forEach((showBorders) => {
            const matrixOptions: MatrixOptions = {
              rowAlternationEnabled,
              showColumnLines,
              showRowLines,
              showBorders,
              hasFixedColumn,
              hasMasterDetail,
            };
            functionalTest(matrixOptions);
          });
        });
      });
    });
  });
});
