import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Grouping Panel - check borders and backgrounds with various options`
  .page(url(__dirname, '../../../container.html'));

const SELECTORS = {
  gridContainer: 'container',
  masterDetailRowClass: 'dx-master-detail-row',
  groupRowClass: 'dx-group-row',
  rowLinesClass: 'dx-row-lines',
  groupSpaceClass: 'dx-datagrid-group-space',
  pointerEventsNoneClass: 'dx-pointer-events-none',
  rowAlternativeClass: 'dx-row-alt',
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
}) => [
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
}) => {
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

const verifyGridStyles = async (t, dataGrid, matrixOptions) => {
  if (matrixOptions.showBorders) {
    const gridContainer = dataGrid.getContainer();
    const containerClasses = await gridContainer.getAttribute('class');
    await t.expect(containerClasses).contains('dx-datagrid-borders');

    const headersContainer = dataGrid.getHeadersContainer();

    const borderTop = await headersContainer.getStyleProperty('border-top-width');
    const borderLeft = await headersContainer.getStyleProperty('border-left-width');
    const borderRight = await headersContainer.getStyleProperty('border-right-width');

    await t.expect(parseInt(borderTop, 10)).gt(0);
    await t.expect(parseInt(borderLeft, 10)).gt(0);
    await t.expect(parseInt(borderRight, 10)).gt(0);

    const rowsView = dataGrid.getRowsView();

    const rowsViewBorderLeft = await rowsView.getStyleProperty('border-left-width');
    const rowsViewBorderRight = await rowsView.getStyleProperty('border-right-width');
    const rowsViewBorderBottom = await rowsView.getStyleProperty('border-bottom-width');

    await t.expect(parseInt(rowsViewBorderLeft, 10)).gt(0);
    await t.expect(parseInt(rowsViewBorderRight, 10)).gt(0);
    await t.expect(parseInt(rowsViewBorderBottom, 10)).gt(0);
  }

  if (matrixOptions.rowAlternationEnabled) {
    /*
      getRows() returns double collection of rows (two tables) when
      columnFixing.legacyMode = true AND DataGrid has fixed columns
    */
    const filteredRows = dataGrid.getRows().find(`tr:not(.${SELECTORS.masterDetailRowClass})`);
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

      await t.expect(currentHasAltClass).notEql(previousHasAltClass);

      const currentFirstCell = currentRow.find('td').nth(0);
      const previousFirstCell = previousRow.find('td').nth(0);

      const currentBg = await currentFirstCell.getStyleProperty('background-color');
      const previousBg = await previousFirstCell.getStyleProperty('background-color');

      await t.expect(currentBg).notEql(previousBg);

      i += 1;
    }
  }

  if (matrixOptions.showRowLines) {
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
      if (matrixOptions.showBorders) {
        const parentRow = dataCell.parent('tr');
        const nextRow = parentRow.nextSibling('tr.dx-row-lines');
        const isLastRow = await nextRow.count === 0;

        if (isLastRow) {
        // eslint-disable-next-line no-continue
          continue;
        }
      }

      const borderBottom = await dataCell.getStyleProperty('border-bottom-width');
      const borderBottomStyle = await dataCell.getStyleProperty('border-bottom-style');

      await t.expect(parseInt(borderBottom, 10)).gt(0);
      await t.expect(borderBottomStyle).notEql('none');
    }
  }

  if (matrixOptions.showColumnLines) {
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
      const expectedBorderWidth = hasPointerEventsNoneClass ? 2 : 1;

      if (!isFirstCellInRow) {
        const borderLeftWidth = await cell.getStyleProperty('border-left-width');

        await t.expect(parseInt(borderLeftWidth, 10)).eql(expectedBorderWidth);
      }

      if (!isLastCellInRow) {
        const borderRightWidth = await cell.getStyleProperty('border-right-width');

        await t.expect(parseInt(borderRightWidth, 10)).eql(expectedBorderWidth);
      }
    }
  }
};

const functionalTest = (matrixOptions) => {
  test(`Should have correct applied styles with ${getTestParams(matrixOptions)}`, async (t) => {
    const dataGrid = new DataGrid(`#${SELECTORS.gridContainer}`);
    await dataGrid.isReady();

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
            const matrixOptions = {
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
