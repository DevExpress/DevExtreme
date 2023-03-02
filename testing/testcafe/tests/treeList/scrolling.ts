import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import TreeList from '../../model/treeList';

const scrollWindowTo = async (position: object) => {
  await ClientFunction(
    () => {
      (window as any).scroll(position);
    },
    {
      dependencies: {
        position,
      },
    },
  )();
};

fixture`Virtual Scrolling`
  .page(url(__dirname, '../container.html'));

function generateData(rowCount): Record<string, unknown>[] {
  const items: Record<string, unknown>[] = [];

  for (let i = 0; i < rowCount; i += 1) {
    items.push({
      ID: i,
      Head_ID: -1,
      Full_Name: 'Ken Samuelson Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
      Prefix: 'Dr. Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
      Title: 'Ombudsman Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
      City: 'St. Louis Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
      State: 'Missouri Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
      Email: 'kents@dx-email.com Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
      Skype: 'kents_DX_skype',
      Mobile_Phone: '(562) 555-9282',
      Birth_Date: '1972-09-11',
      Hire_Date: '2009-04-22',
    });
  }

  return items;
}

// T1129106
test('The vertical scroll bar of the container\'s parent should not be displayed when the grid has no height, virtual scrolling and state storing are enabled', async (t) => {
  // arrange, act
  const treeList = new TreeList('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // assert
  await t
    .expect(treeList.isReady())
    .ok()
    .expect(await takeScreenshot('T1129106-treelist-virtual-scrolling-1'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());

  // act
  await scrollWindowTo({ top: 10000000 });

  // assert
  await t
    .expect(treeList.isReady())
    .ok()
    .expect(await takeScreenshot('T1129106-treelist-virtual-scrolling-2'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());

  // act
  await scrollWindowTo({ top: 0 });

  // assert
  await t
    .expect(treeList.isReady())
    .ok()
    .expect(await takeScreenshot('T1129106-treelist-virtual-scrolling-3'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await ClientFunction(() => {
    $('#container').wrap('<div id=\'wrapperContainer\' style=\'height: 100%; overflow: auto;\'></div>');
  })();

  await t.resizeWindow(550, 700);

  return createWidget('dxTreeList', {
    dataSource: generateData(1000),
    rootValue: -1,
    columnMinWidth: 80,
    wordWrapEnabled: true,
    columnAutoWidth: true,
    allowColumnResizing: true,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    showRowLines: true,
    showBorders: true,
    autoExpandAll: true,
    scrolling: {
      mode: 'virtual',
    },
    stateStoring: {
      enabled: true,
      type: 'custom',
      customSave: () => {},
      customLoad: () => ({
        pageIndex: 50,
      }),
    },
    columns: ['Title', 'Full_Name', 'City', 'State', 'Mobile_Phone', 'Hire_Date'],
  });
}).after(async () => {
  await ClientFunction(() => {
    $('#container').unwrap();
  })();
});
