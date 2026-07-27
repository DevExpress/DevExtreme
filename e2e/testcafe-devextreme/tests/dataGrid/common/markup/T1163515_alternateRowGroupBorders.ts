import { ClientFunction } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Grouping Panel - check borders and backgrounds with various options`
  .page(url(__dirname, '../../../container.html'));

interface MatrixOptions {
  showColumnLines: boolean;
  showRowLines: boolean;
  showBorders: boolean;
  hasFixedColumn: boolean;
  hasMasterDetail: boolean;
}

const SELECTORS = {
  gridContainer: 'container',
  dataGridClass: 'dx-datagrid',
  bordersClass: 'dx-datagrid-borders',
  headersClass: 'dx-datagrid-headers',
  rowsViewClass: 'dx-datagrid-rowsview',
  rowClass: 'dx-row',
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

interface CellInfo {
  borderLeftWidth: number;
  borderRightWidth: number;
  borderBottomWidth: number;
  isGroupSpace: boolean;
  hasPointerEventsNoneClass: boolean;
}

interface RowInfo {
  classes: string;
  backgroundColor: string;
  isLastRowLine: boolean;
  cells: CellInfo[];
}

interface GridStyleSnapshot {
  containerClasses: string;
  headersBorders: { top: number; left: number; right: number };
  rowsViewBorders: { left: number; right: number; bottom: number };
  rows: RowInfo[];
}

const collectGridStyles = ClientFunction((rootSelector: string): GridStyleSnapshot => {
  const root = document.querySelector(rootSelector);

  const borderWidth = (element: Element | null, property: string): number => (element
    ? parseInt(window.getComputedStyle(element).getPropertyValue(property), 10) || 0
    : 0);

  const container = root?.querySelector(`.${SELECTORS.dataGridClass}`) ?? null;
  const headers = root?.querySelector(`.${SELECTORS.headersClass}`) ?? null;
  const rowsView = root?.querySelector(`.${SELECTORS.rowsViewClass}`) ?? null;

  const rowElements = rowsView
    ? Array.from(rowsView.querySelectorAll(`.${SELECTORS.rowClass}`))
    : [];

  const rows: RowInfo[] = rowElements.map((row) => {
    /*
      There are 2 collections of rows (two tables) when
      columnFixing.legacyMode = true AND DataGrid has fixed columns.
      isLastRowLine therefore uses DOM adjacency (nextSibling), not the flat array position.
    */
    let isLastRowLine = true;
    let sibling = row.nextElementSibling;

    while (sibling) {
      if (sibling.matches(`tr.${SELECTORS.rowLinesClass}`)) {
        isLastRowLine = false;
        break;
      }
      sibling = sibling.nextElementSibling;
    }

    const cells: CellInfo[] = Array.from(row.querySelectorAll('td')).map((cell) => ({
      borderLeftWidth: borderWidth(cell, 'border-left-width'),
      borderRightWidth: borderWidth(cell, 'border-right-width'),
      borderBottomWidth: borderWidth(cell, 'border-bottom-width'),
      isGroupSpace: cell.classList.contains(SELECTORS.groupSpaceClass),
      hasPointerEventsNoneClass: cell.classList.contains(SELECTORS.pointerEventsNoneClass),
    }));

    const firstCell = row.querySelector('td');

    return {
      classes: row.getAttribute('class') ?? '',
      backgroundColor: firstCell ? window.getComputedStyle(firstCell).backgroundColor : '',
      isLastRowLine,
      cells,
    };
  });

  return {
    containerClasses: container?.getAttribute('class') ?? '',
    headersBorders: {
      top: borderWidth(headers, 'border-top-width'),
      left: borderWidth(headers, 'border-left-width'),
      right: borderWidth(headers, 'border-right-width'),
    },
    rowsViewBorders: {
      left: borderWidth(rowsView, 'border-left-width'),
      right: borderWidth(rowsView, 'border-right-width'),
      bottom: borderWidth(rowsView, 'border-bottom-width'),
    },
    rows,
  };
}, { dependencies: { SELECTORS } });

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
  showColumnLines,
  showRowLines,
  showBorders,
  hasFixedColumn,
  hasMasterDetail,
}: MatrixOptions) => [
  `showColumnLines: ${showColumnLines}`,
  `showRowLines: ${showRowLines}`,
  `showBorders: ${showBorders}`,
  `hasFixedColumn: ${hasFixedColumn}`,
  `hasMasterDetail: ${hasMasterDetail}`,
].join(', ');

const createDataGrid = async ({
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
    rowAlternationEnabled: true,
    showBorders,
    showRowLines,
    showColumnLines,
  });
};

const checkShowBordersState = async (
  t: TestController,
  snapshot: GridStyleSnapshot,
  showBorders: boolean,
) => {
  const expectedBorderWidth = showBorders ? BORDER_WIDTH.normal : BORDER_WIDTH.none;

  if (showBorders) {
    await t.expect(snapshot.containerClasses).contains(SELECTORS.bordersClass);
  } else {
    await t.expect(snapshot.containerClasses).notContains(SELECTORS.bordersClass);
  }

  await t.expect(snapshot.headersBorders.top).eql(expectedBorderWidth, 'headers: border-top-width');
  await t.expect(snapshot.headersBorders.left).eql(expectedBorderWidth, 'headers: border-left-width');
  await t.expect(snapshot.headersBorders.right).eql(expectedBorderWidth, 'headers: border-right-width');

  await t.expect(snapshot.rowsViewBorders.left).eql(expectedBorderWidth, 'rowsView: border-left-width');
  await t.expect(snapshot.rowsViewBorders.right).eql(expectedBorderWidth, 'rowsView: border-right-width');
  await t.expect(snapshot.rowsViewBorders.bottom).eql(expectedBorderWidth, 'rowsView: border-bottom-width');
};

const checkShowRowLinesState = async (
  t: TestController,
  snapshot: GridStyleSnapshot,
  showRowLines: boolean,
  showBorders: boolean,
) => {
  const expectedBorderWidth = showRowLines ? BORDER_WIDTH.normal : BORDER_WIDTH.none;

  const rowLineRows = snapshot.rows.filter((row) => row.classes.includes(SELECTORS.rowLinesClass));

  for (let i = 0; i < rowLineRows.length; i += 1) {
    const row = rowLineRows[i];

    // Skip checking for last lines if showBorders is enabled
    if (showBorders && row.isLastRowLine) {
      // eslint-disable-next-line no-continue
      continue;
    }

    for (let j = 0; j < row.cells.length; j += 1) {
      await t.expect(row.cells[j].borderBottomWidth).eql(expectedBorderWidth, `row #${i}, cell #${j}: border-bottom-width`);
    }
  }
};

const checkShowColumnLinesState = async (
  t: TestController,
  snapshot: GridStyleSnapshot,
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

  const dataRows = snapshot.rows.filter(
    (row) => !row.classes.includes(SELECTORS.masterDetailRowClass),
  );

  for (let i = 0; i < dataRows.length; i += 1) {
    const dataCells = dataRows[i].cells.filter((cell) => !cell.isGroupSpace);

    for (let j = 0; j < dataCells.length; j += 1) {
      const cell = dataCells[j];
      const expectedBorderWidth = getExpBorderWith(showColumnLines, cell.hasPointerEventsNoneClass);
      const isFirstCellInRow = j === 0;
      const isLastCellInRow = j === dataCells.length - 1;

      if (!isFirstCellInRow) {
        await t.expect(cell.borderLeftWidth).eql(expectedBorderWidth, `row #${i}, cell #${j}: border-left-width`);
      }

      if (!isLastCellInRow) {
        await t.expect(cell.borderRightWidth).eql(expectedBorderWidth, `row #${i}, cell #${j}: border-right-width`);
      }
    }
  }
};

const checkRowAlternationEnabledState = async (
  t: TestController,
  snapshot: GridStyleSnapshot,
) => {
  const rows = snapshot.rows.filter(
    (row) => !row.classes.includes(SELECTORS.masterDetailRowClass),
  );

  let i = 1;
  while (i < rows.length) {
    const currentRow = rows[i];
    const previousRow = rows[i - 1];

    if (currentRow.classes.includes(SELECTORS.groupRowClass)) {
      i += 2;
      // eslint-disable-next-line no-continue
      continue;
    }

    if (previousRow.classes.includes(SELECTORS.groupRowClass)) {
      i += 1;
      // eslint-disable-next-line no-continue
      continue;
    }

    const currentHasAltClass = currentRow.classes.includes(SELECTORS.rowAlternativeClass);
    const previousHasAltClass = previousRow.classes.includes(SELECTORS.rowAlternativeClass);

    await t.expect(currentHasAltClass).notEql(previousHasAltClass, `row #${i}: alt class alternation`);
    await t.expect(currentRow.backgroundColor).notEql(previousRow.backgroundColor, `row #${i}: background-color alternation`);

    i += 1;
  }
};

const verifyGridStyles = async (t: TestController, {
  showBorders, showRowLines, showColumnLines,
}: MatrixOptions) => {
  const snapshot = await collectGridStyles(`#${SELECTORS.gridContainer}`);

  await checkShowBordersState(t, snapshot, showBorders);
  await checkShowRowLinesState(t, snapshot, showRowLines, showBorders);
  await checkShowColumnLinesState(t, snapshot, showColumnLines);
  await checkRowAlternationEnabledState(t, snapshot);
};

const functionalTest = (matrixOptions: MatrixOptions) => {
  test(`Should have correct applied styles with ${getTestParams(matrixOptions)}`, async (t) => {
    const dataGrid = new DataGrid(`#${SELECTORS.gridContainer}`);
    await t
      .expect(dataGrid.isReady())
      .ok();

    await verifyGridStyles(t, matrixOptions);

    const rowIdx = matrixOptions.hasMasterDetail ? 8 : 5;
    const colIdx = matrixOptions.hasMasterDetail ? 5 : 4;
    const deleteBtn = matrixOptions.hasFixedColumn
      ? dataGrid.getFixedDataRow(rowIdx).getCommandCell(colIdx).element
      : dataGrid.getDataRow(rowIdx).getCommandCell(colIdx).element;

    await t.click(deleteBtn);

    await verifyGridStyles(t, matrixOptions);
  }).before(async () => {
    await createDataGrid(matrixOptions);
  });
};

const cases: Partial<MatrixOptions>[] = [
  {},
  { hasFixedColumn: true },
  { showColumnLines: true },
  { showColumnLines: true, hasFixedColumn: true },
  { showRowLines: true },
  { showBorders: true },
  { showBorders: true, showRowLines: true },
  { hasMasterDetail: true },
  {
    showRowLines: true, showBorders: true, hasFixedColumn: true, hasMasterDetail: true,
  },
];

cases.forEach((overrides) => {
  const matrixOptions: MatrixOptions = {
    showColumnLines: false,
    showRowLines: false,
    showBorders: false,
    hasFixedColumn: false,
    hasMasterDetail: false,
    ...overrides,
  };

  functionalTest(matrixOptions);
});
