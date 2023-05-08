import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
import { changeTheme } from '../../helpers/changeTheme';
import { safeSizeTest } from '../../helpers/safeSizeTest';
import { Themes } from './helpers/themes';

fixture.disablePageReloads`Search Panel`
  .page(url(__dirname, '../container.html'));

// T1046688
safeSizeTest('searchPanel has correct view inside masterDetail', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  // act
  await t.click(dataGrid.getDataRow(0).getCommandCell(0).element);

  const masterRow = dataGrid.getMasterRow(0);
  const masterGrid = masterRow.getDataGrid();

  // assert
  await t
    .expect(await takeScreenshot('T1046688.searchPanel.png', masterGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => {
  await changeTheme(Themes.materialBlue);

  return createWidget('dxDataGrid', {
    dataSource: [{ column1: 'first' }],
    columns: ['column1'],
    masterDetail: {
      enabled: true,
      template(container) {
        ($('<div>') as any)
          .dxDataGrid({
            searchPanel: {
              visible: true,
              width: 240,
              placeholder: 'Search...',
            },
            columns: ['detail1'],
            dataSource: [],
          })
          .appendTo(container);
      },
    },
  });
}).after(async () => { await changeTheme(Themes.genericLight); });

/*
Source size: W:1504, H:430
Target size: W:752, H:215

ORIGINAL TARGET 23_1 error:
Source size: W:737, H:215
Target size: W:752, H:215

UPDATED TARGET 23_1 error:
Source size: W:752, H:215
Target size: W:737, H:215

22_2 error:
Source size: W:752, H:215
Target size: W:737, H:215

22_1 error:
Source size: W:752, H:215
Target size: W:737, H:215

еще мигалки:
https://github.com/DevExpress/DevExtreme/actions/runs/4894076866/jobs/8737947880?pr=24508

*/
