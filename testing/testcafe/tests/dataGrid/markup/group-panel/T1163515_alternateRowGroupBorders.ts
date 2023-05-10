import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../../helpers/changeTheme';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import DataGrid from '../../../../model/dataGrid';
import { Themes } from '../../helpers/themes';

// TODO: Enable multi-theming testcafe run in the future.
fixture.disablePageReloads`Grouping Panel - Borders with enabled alternate rows`
  .page(url(__dirname, '../../../container.html'));

const GRID_SELECTOR = '#container';

const getTestParams = ({
  theme,
  rowAlternationEnabled,
  showColumnLines,
  showRowLines,
  showBorders,
  hasFixedColumn,
  hasMasterDetail,
}) => [
  `theme: ${theme}`,
  `alt rows: ${rowAlternationEnabled}`,
  `column lines: ${showColumnLines}`,
  `row lines: ${showRowLines}`,
  `borders: ${showBorders}`,
  `fixed columns: ${hasFixedColumn}`,
  `master detail: ${hasMasterDetail}`,
].join(', ');

const getScreenshotParams = ({
  theme,
  rowAlternationEnabled,
  showColumnLines,
  showRowLines,
  showBorders,
  hasFixedColumn,
  hasMasterDetail,
}) => [
  `${theme === Themes.materialBlue ? 'material' : ''}`,
  `${rowAlternationEnabled ? 'alt-rows' : ''}`,
  `${showColumnLines ? 'column-lines' : ''}`,
  `${showRowLines ? 'row-lines' : ''}`,
  `${showBorders ? 'borders' : ''}`,
  `${hasFixedColumn ? 'fixed-columns' : ''}`,
  `${hasMasterDetail ? 'master-detail' : ''}`,
].filter((value) => !!value)
  .join('_');
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

const markupTest = (matrixOptions) => {
  test(`Should show group panel borders with ${getTestParams(matrixOptions)}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(GRID_SELECTOR);
    const rowIdx = matrixOptions.hasMasterDetail ? 8 : 5;
    const colIdx = matrixOptions.hasMasterDetail ? 5 : 4;
    const deleteBtn = matrixOptions.hasFixedColumn
      ? dataGrid.getFixedDataRow(rowIdx).getCommandCell(colIdx).element
      : dataGrid.getDataRow(rowIdx).getCommandCell(colIdx).element;

    await takeScreenshot(`borders_${getScreenshotParams(matrixOptions)}.png`, dataGrid.element);
    await t.click(deleteBtn);
    await takeScreenshot(`borders-repaint_${getScreenshotParams(matrixOptions)}.png`, dataGrid.element);

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(matrixOptions.theme);
    await createDataGrid(matrixOptions);
  }).after(async () => changeTheme(Themes.genericLight));
};

[Themes.materialBlue, Themes.genericLight].forEach((theme) => {
  [true, false].forEach((hasFixedColumn) => {
    [true, false].forEach((hasMasterDetail) => {
      [true, false].forEach((rowAlternationEnabled) => {
        [true, false].forEach((showColumnLines) => {
          [true, false].forEach((showRowLines) => {
            [true, false].forEach((showBorders) => {
              const matrixOptions = {
                theme,
                rowAlternationEnabled,
                showColumnLines,
                showRowLines,
                showBorders,
                hasFixedColumn,
                hasMasterDetail,
              };

              markupTest(matrixOptions);
            });
          });
        });
      });
    });
  });
});
