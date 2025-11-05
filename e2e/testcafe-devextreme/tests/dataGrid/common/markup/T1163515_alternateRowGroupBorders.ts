import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

// TODO: Enable multi-theming testcafe run in the future.
fixture.disablePageReloads`Grouping Panel - check borders and backgrounds with various options`
  .page(url(__dirname, '../../../container.html'));

const SELECTORS = {
  gridContainer: 'container',
  masterDetailClass: 'dx-master-detail-row',
  groupRowClass: 'dx-group-row',
};

const FORBIDDEN_COLORS = ['transparent', 'white', 'black', 'rgb(0, 0, 0)', 'rgb(255, 255, 255)'];

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
    dataSource: [
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
    ],
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

    const borderTopColor = await headersContainer.getStyleProperty('border-top-color');
    const borderLeftColor = await headersContainer.getStyleProperty('border-left-color');
    const borderRightColor = await headersContainer.getStyleProperty('border-right-color');

    await t.expect(FORBIDDEN_COLORS).notContains(borderTopColor.toLowerCase());
    await t.expect(FORBIDDEN_COLORS).notContains(borderLeftColor.toLowerCase());
    await t.expect(FORBIDDEN_COLORS).notContains(borderRightColor.toLowerCase());

    const rowsView = dataGrid.getRowsView();

    const rowsViewBorderLeft = await rowsView.getStyleProperty('border-left-width');
    const rowsViewBorderRight = await rowsView.getStyleProperty('border-right-width');
    const rowsViewBorderBottom = await rowsView.getStyleProperty('border-bottom-width');

    await t.expect(parseInt(rowsViewBorderLeft, 10)).gt(0);
    await t.expect(parseInt(rowsViewBorderRight, 10)).gt(0);
    await t.expect(parseInt(rowsViewBorderBottom, 10)).gt(0);

    const rowsViewBorderTopColor = await rowsView.getStyleProperty('border-top-color');
    const rowsViewBorderLeftColor = await rowsView.getStyleProperty('border-left-color');
    const rowsViewBorderRightColor = await rowsView.getStyleProperty('border-right-color');
    const rowsViewBorderBottomColor = await rowsView.getStyleProperty('border-bottom-color');

    await t.expect(FORBIDDEN_COLORS).notContains(rowsViewBorderTopColor.toLowerCase());
    await t.expect(FORBIDDEN_COLORS).notContains(rowsViewBorderLeftColor.toLowerCase());
    await t.expect(FORBIDDEN_COLORS).notContains(rowsViewBorderRightColor.toLowerCase());
    await t.expect(FORBIDDEN_COLORS).notContains(rowsViewBorderBottomColor.toLowerCase());
  }

  if (matrixOptions.rowAlternationEnabled) {
    const filteredRows = dataGrid.getRows().find(`tr:not(.${SELECTORS.masterDetailClass})`);
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

      if (currentClasses !== previousClasses) {
        const currentBg = await currentRow.getStyleProperty('background-color');
        const previousBg = await previousRow.getStyleProperty('background-color');

        await t.expect(currentBg).notEql(previousBg);
      }

      i += 1;
    }
  }

  if (matrixOptions.showRowLines) {
    const { dataRows } = dataGrid;
    const dataRowsCount = await dataRows.count;

    for (let i = 0; i < dataRowsCount; i += 1) {
      const dataRow = dataRows.nth(i);

      const borderTop = await dataRow.getStyleProperty('border-top-width');
      const borderTopStyle = await dataRow.getStyleProperty('border-top-style');

      await t.expect(parseInt(borderTop, 10)).gt(0);
      await t.expect(borderTopStyle).notEql('none');

      if (!matrixOptions.showBorders) {
        const borderBottom = await dataRow.getStyleProperty('border-bottom-width');
        const borderBottomStyle = await dataRow.getStyleProperty('border-bottom-style');

        await t.expect(parseInt(borderBottom, 10)).gt(0);
        await t.expect(borderBottomStyle).notEql('none');
      }
    }
  }

  if (matrixOptions.showColumnLines) {
    const cells = dataGrid.getCells().filter('td:not([class])');
    const cellsCount = await cells.count;

    for (let i = 0; i < cellsCount; i += 1) {
      const cell = cells.nth(i);

      const borderRightWidth = await cell.getStyleProperty('border-right-width');
      const borderRightColor = await cell.getStyleProperty('border-right-color');

      await t.expect(borderRightWidth).eql('1px');
      await t.expect(FORBIDDEN_COLORS).notContains(borderRightColor.toLowerCase());
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
