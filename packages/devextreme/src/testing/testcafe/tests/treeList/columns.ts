import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import TreeList from '../../model/treeList';
import { changeTheme } from '../../helpers/changeTheme';

fixture`Columns`
  .page(url(__dirname, '../container.html'));

// T1054312
test('CheckBox position with double rows columns', async (t) => {
  const treeList = new TreeList('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('T1054312-material.blue.light', treeList.getHeaders().element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxTreeList', {
    dataSource: [{
      ID: 1,
      Full_Name: 'John Heart',
      City: 'Los Angeles',
      State: 'California',
    }],
    keyExpr: 'ID',
    selection: {
      mode: 'multiple',
    },
    columns: [{
      dataField: 'Full_Name',
    },
    { columns: ['City', 'State'] },
    ],
  });
});

// T1053931
test('Correct display border to last column', async (t) => {
  const treeList = new TreeList('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('T1053931-material.blue.light', treeList.getHeaders().element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxTreeList', {
    dataSource: [
      {
        ID: 1,
        Country: 'Brazil',
        Area: 8515767,
        Population_Urban: 0.85,
        Population_Total: 205809000,
        GDP_Agriculture: 0.054,
        GDP_Industry: 0.274,
        GDP_Services: 0.672,
        GDP_Total: 2353025,
      },
    ],
    keyExpr: 'ID',
    columns: [
      'Country',
      {
        columns: [{
          dataField: 'GDP_Total',
        }, {
          columns: [{
            dataField: 'GDP_Agriculture',
          }, {
            dataField: 'GDP_Industry',
          }, {
            dataField: 'GDP_Services',
          }],
        }],
      }, {
        columns: [{
          dataField: 'Population_Total',
        }, {
          dataField: 'Population_Urban',
        }],
      }, {
        dataField: 'Area',
      },
    ],
    width: 600,
    height: 300,
  });
});
