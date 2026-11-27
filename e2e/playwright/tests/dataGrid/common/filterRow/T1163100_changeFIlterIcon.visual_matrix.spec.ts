import type { Column } from 'devextreme/ui/data_grid';
import { test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

const generateTestData = (rowCount: number) => new Array(rowCount)
  .fill(null)
  .map((_, idx) => ({
    dataA: `A_${idx}`,
    dataB: `B_${idx}`,
    dataC: `C_${idx}`,
    dataD: `D_${idx}`,
  }));

test.describe('Header Filter T1163100 change filter icon', () => {
  ([
    ['usual', ['dataA', 'dataB']],
    ['fixed', [{ dataField: 'dataA', fixed: true }, { dataField: 'dataB', fixed: true }]],
  ] as [string, (string | Column)[]][]).forEach(([firstColumnsName, firstColumns]) => {
    ([
      ['usual', ['dataC', 'dataD']],
      ['band', [{ caption: 'Band column', columns: ['dataC', 'dataD'] }]],
    ] as [string, (string | Column)[]][]).forEach(([secondColumnsName, secondColumns]) => {
      ([
        ['usual', undefined],
        ['virtual', { columnRenderingMode: 'virtual', rowRenderingMode: 'virtual' }],
      ] as const).forEach(([scrollingName, scrolling]) => {
        test(`Should change filter row icon (columns ${firstColumnsName} ${secondColumnsName}, scrolling ${scrollingName}`, async ({ page }) => {
          await createWidget(page, 'dxDataGrid', {
            dataSource: generateTestData(25),
            filterRow: {
              visible: true,
            },
            columnFixing: {
              // @ts-expect-error private option
              legacyMode: true,
            },
            columns: [
              ...firstColumns,
              ...secondColumns,
            ],
            scrolling,
          });

          const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

          for (let columnIdx = 0; columnIdx < 4; columnIdx += 1) {
            const filterCell = dataGrid.getFilterCell(columnIdx);
            await filterCell.menuButton.click();
            await filterCell.menu.getItemByText('Starts with').click();
          }

          await testScreenshot(
            page,
            `T1163100_change-icon_columns-${firstColumnsName}-${secondColumnsName}_scrolling-${scrollingName}.png`,
            { element: dataGrid.element },
          );
        });
      });
    });
  });
});
