import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TreeList from 'devextreme-testcafe-models/treeList';

import { changeTheme } from '../../helpers/changeTheme';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import { Themes } from '../../helpers/themes';

fixture`Markup`
  .page(url(__dirname, '../container.html'));

const tasksT1223168 = [{
  Task_ID: 1,
  Task_Subject: 'Plans 2015',
  Task_Parent_ID: 0,
}, {
  Task_ID: 2,
  Task_Subject: 'Health Insurance',
  Task_Parent_ID: 1,
}, {
  Task_ID: 3,
  Task_Subject: 'Training',
  Task_Parent_ID: 2,
}];

[Themes.genericLight, Themes.materialBlue, Themes.fluentBlue].forEach((theme) => {
  test(`TreeList - Expand/collapse buttons are too close to column borders if the first column is a boolean column (T1223168) in ${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const treeList = new TreeList('#container');

    await t
      .expect(await takeScreenshot(`T1223168-expandable-${theme}`, treeList.element))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);
    await createWidget('dxTreeList', {
      dataSource: tasksT1223168,
      keyExpr: 'Task_ID',
      parentIdExpr: 'Task_Parent_ID',
      autoExpandAll: true,
      wordWrapEnabled: true,
      showBorders: true,
      columns: [{
        dataField: 'test',
        dataType: 'boolean',
      }, 'Task_Subject'],
      showColumnLines: true,
      rowDragging: {
        allowReordering: true,
      },
    });
  }).after(async () => {
    await changeTheme(Themes.genericLight);
  });

  // T1221037
  test('TreeList screenshot when the first cell has a template', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const treeList = new TreeList('#container');

    await t
      .expect(await takeScreenshot(`T1221037-cell-with-template-${theme}`, treeList.element))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxTreeList', {
      dataSource: [{
        ID: 1,
        Head_ID: 0,
        Full_Name: 'John Heart',
        Prefix: 'Mr.',
        Title: 'CEO',
        City: 'Los Angeles',
        State: 'California',
        Email: 'jheart@dx-email.com',
        Skype: 'jheart_DX_skype',
        Mobile_Phone: '(213) 555-9392',
        Birth_Date: '1964-03-16',
        Hire_Date: '1995-01-15',
      }, {
        ID: 2,
        Head_ID: 1,
        Full_Name: 'Arthur Miller',
        Prefix: 'Mr.',
        Title: 'CTO',
        City: 'Denver',
        State: 'Colorado',
        Email: 'arthurm@dx-email.com',
        Skype: 'arthurm_DX_skype',
        Mobile_Phone: '(310) 555-8583',
        Birth_Date: '1972-07-11',
        Hire_Date: '2007-12-18',
      }, {
        ID: 3,
        Head_ID: 2,
        Full_Name: 'Brett Wade',
        Prefix: 'Mr.',
        Title: 'IT Manager',
        City: 'Reno',
        State: 'Nevada',
        Email: 'brettw@dx-email.com',
        Skype: 'brettw_DX_skype',
        Mobile_Phone: '(626) 555-0358',
        Birth_Date: '1968-12-01',
        Hire_Date: '2009-03-06',
      }, {
        ID: 4,
        Head_ID: 3,
        Full_Name: 'Morgan Kennedy',
        Prefix: 'Mrs.',
        Title: 'Graphic Designer',
        City: 'San Fernando Valley',
        State: 'California',
        Email: 'morgank@dx-email.com',
        Skype: 'morgank_DX_skype',
        Mobile_Phone: '(818) 555-8238',
        Birth_Date: '1984-07-17',
        Hire_Date: '2012-01-11',
      }, {
        ID: 5,
        Head_ID: 4,
        Full_Name: 'Violet Bailey',
        Prefix: 'Ms.',
        Title: 'Jr Graphic Designer',
        City: 'La Canada',
        State: 'California',
        Email: 'violetb@dx-email.com',
        Skype: 'violetb_DX_skype',
        Mobile_Phone: '(818) 555-2478',
        Birth_Date: '1985-06-10',
        Hire_Date: '2012-01-19',
      }],
      keyExpr: 'ID',
      parentIdExpr: 'Head_ID',
      columnAutoWidth: true,
      width: 770,
      columns: [{
        dataField: 'Title',
        caption: 'Position',
        cellTemplate(_, cellInfo) {
          return $('<div>').append(
            $('<span>').text(cellInfo.data.Title),
          );
        },
      }, 'Full_Name', 'City', 'State', {
        dataField: 'Hire_Date',
        dataType: 'date',
      }],
      showRowLines: true,
      showBorders: true,
      expandedRowKeys: [1, 2, 3, 4],
    });
  }).after(async () => {
    await changeTheme(Themes.genericLight);
  });
});
