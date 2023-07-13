import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from '../../../model/dataGrid';
import FilterTextBox from '../../../model/dataGrid/editors/filterTextBox';

fixture`Header Filter T1163100 change filter icon`
  .page(url(__dirname, '../../container.html'));

const GRID_SELECTOR = '#container';

const generateTestData = (rowCount: number) => new Array(rowCount)
  .fill(null)
  .map((_, idx) => ({
    dataA: `A_${idx}`,
    dataB: `B_${idx}`,
    dataC: `C_${idx}`,
    dataD: `D_${idx}`,
  }));

[
  ['usual', ['dataA', 'dataB']],
  ['fixed', [{ dataField: 'dataA', fixed: true }, { dataField: 'dataB', fixed: true }]],
].forEach(([firstColumnsName, firstColumns]) => {
  [
    ['usual', ['dataC', 'dataD']],
    ['band', [{ caption: 'Band column', columns: ['dataC', 'dataD'] }]],
  ].forEach(([secondColumnsName, secondColumns]) => {
    [
      ['usual', undefined],
      ['virtual', { columnRenderingMode: 'virtual', rowRenderingMode: 'virtual' }],
    ].forEach(([scrollingName, scrolling]) => {
      test(`Should change filter row icon (columns ${firstColumnsName} ${secondColumnsName}, scrolling ${scrollingName}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
        const dataGrid = new DataGrid(GRID_SELECTOR);

        for (let columnIdx = 0; columnIdx < 4; columnIdx += 1) {
          const filterMenu = dataGrid.getFilterEditor(columnIdx, FilterTextBox);
          await t
            .click(filterMenu.menuButton())
            .click(filterMenu.menu.getItemByText('Starts with'));
        }

        await takeScreenshot(
          `T1163100_change-icon_columns-${firstColumnsName}-${secondColumnsName}_scrolling-${scrollingName}.png`,
          dataGrid.element,
        );

        await t.expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => createWidget('dxDataGrid', {
        dataSource: generateTestData(25),
        filterRow: {
          visible: true,
        },
        columns: [
          ...firstColumns,
          ...secondColumns,
        ],
        scrolling,
      }));
    });
  });
});
