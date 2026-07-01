import { ClientFunction } from 'testcafe';
import ExpandableCell from 'devextreme-testcafe-models/treeList/expandableCell';
import TreeList from 'devextreme-testcafe-models/treeList';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Columns Auto Width`
  .page(url(__dirname, '../../container.html'));

const getHeaderCellWidths = ClientFunction(() => {
  const cells = document.querySelectorAll('#container .dx-header-row td');
  return Array.from(cells).map((cell) => Math.round(cell.getBoundingClientRect().width));
});

const treeListData = [
  {
    id: 1, parentId: 0, name: 'Root item with a long name', size: 1024, date: '2024-01-01',
  },
  {
    id: 2, parentId: 1, name: 'Child 1', size: 512, date: '2024-02-01',
  },
  {
    id: 3, parentId: 1, name: 'Child 2 with a longer name value', size: 256, date: '2024-03-01',
  },
  {
    id: 4, parentId: 0, name: 'Second root', size: 2048, date: '2024-04-01',
  },
];

const treeListConfig = {
  dataSource: treeListData,
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  columnAutoWidth: true,
  width: 500,
  columns: [
    { dataField: 'name' },
    { dataField: 'size', width: 100 },
    { dataField: 'date', width: 150 },
  ],
  scrolling: {
    mode: 'standard',
    useNative: false,
  },
};

// T1328904
test('columns should update auto width when expanding row', async (t) => {
  const treeList = new TreeList('#container');

  const widthsBefore = await getHeaderCellWidths();
  const [nameWidthBefore] = widthsBefore;
  await t.expect(widthsBefore).eql([250, 100, 150]);

  const expandableCell = new ExpandableCell(treeList.getDataRow(0).getDataCell(0));
  await t.click(expandableCell.getExpandButton());

  const widthsAfter = await getHeaderCellWidths();
  const [nameWidthAfter, sizeWidthAfter, dateWidthAfter] = widthsAfter;
  await t.expect(nameWidthAfter).gt(nameWidthBefore);
  await t.expect(sizeWidthAfter).eql(100);
  await t.expect(dateWidthAfter).eql(150);
}).before(async () => createWidget('dxTreeList', treeListConfig));

// T1328904
test('columns should update auto width when collapsing row', async (t) => {
  const treeList = new TreeList('#container');

  const widthsBefore = await getHeaderCellWidths();
  const [nameWidthBefore] = widthsBefore;

  const expandableCell = new ExpandableCell(treeList.getDataRow(0).getDataCell(0));
  await t.click(expandableCell.getCollapseButton());

  const widthsAfter = await getHeaderCellWidths();
  const [nameWidthAfter, sizeWidthAfter, dateWidthAfter] = widthsAfter;
  await t.expect(nameWidthAfter).lt(nameWidthBefore);
  await t.expect(sizeWidthAfter).eql(100);
  await t.expect(dateWidthAfter).eql(150);
}).before(async () => createWidget('dxTreeList', {
  ...treeListConfig,
  expandedRowKeys: [1],
}));

// T1328904
test('columns should update auto width when expanded row keys are updated using API', async (t) => {
  const treeList = new TreeList('#container');

  const widthsBefore = await getHeaderCellWidths();
  const [nameWidthBefore] = widthsBefore;
  await t.expect(widthsBefore).eql([250, 100, 150]);

  await treeList.apiOption('expandedRowKeys', [1]);

  const widthsAfter = await getHeaderCellWidths();
  const [nameWidthAfter, sizeWidthAfter, dateWidthAfter] = widthsAfter;
  await t.expect(nameWidthAfter).gt(nameWidthBefore);
  await t.expect(sizeWidthAfter).eql(100);
  await t.expect(dateWidthAfter).eql(150);
}).before(async () => createWidget('dxTreeList', treeListConfig));

test('columns should update auto width after loadDescendants call', async (t) => {
  const treeList = new TreeList('#container');

  await treeList.apiLoadDescendants(1);

  const widthsBefore = await getHeaderCellWidths();
  await t.expect(widthsBefore).eql([250, 100, 150]);

  const expandableCell = new ExpandableCell(treeList.getDataRow(0).getDataCell(0));
  await t.click(expandableCell.getExpandButton());

  const widthsAfter = await getHeaderCellWidths();
  const [nameWidthAfter, sizeWidthAfter, dateWidthAfter] = widthsAfter;
  await t.expect(nameWidthAfter).gt(250);
  await t.expect(sizeWidthAfter).eql(100);
  await t.expect(dateWidthAfter).eql(150);
}).before(async () => createWidget('dxTreeList', () => {
  const data = [
    {
      id: 1, parentId: 0, name: 'Root item with a long name', size: 1024, date: '2024-01-01',
    },
    {
      id: 2, parentId: 1, name: 'Child 1', size: 512, date: '2024-02-01',
    },
    {
      id: 3, parentId: 1, name: 'Child 2 with a longer name value', size: 256, date: '2024-03-01',
    },
    {
      id: 4, parentId: 0, name: 'Second root', size: 2048, date: '2024-04-01',
    },
  ];

  return {
    dataSource: {
      key: 'id',
      load(loadOptions: any) {
        let result = data;

        if (loadOptions.filter) {
          const parentIds = loadOptions.filter[0] === 'parentId'
            ? [loadOptions.filter[2]]
            : loadOptions.filter
              .filter((f: any) => Array.isArray(f) && f[0] === 'parentId')
              .map((f: any) => f[2]);

          if (parentIds.length) {
            result = data.filter((item) => parentIds.includes(item.parentId));
          }
        }
        return Promise.resolve(result);
      },
    },
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    columnAutoWidth: true,
    width: 500,
    columns: [
      { dataField: 'name' },
      { dataField: 'size', width: 100 },
      { dataField: 'date', width: 150 },
    ],
    scrolling: {
      mode: 'standard',
    },
    remoteOperations: {
      filtering: true,
    },
  };
}));
