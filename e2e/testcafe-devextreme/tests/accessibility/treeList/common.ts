import TreeList from 'devextreme-testcafe-models/treeList';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { isMaterialBased } from '../../../helpers/themeUtils';

fixture.disablePageReloads`TreeList - a11y`
  .page(url(__dirname, '../../container.html'));

const TREE_LIST_SELECTOR = '#container';

function getData(rowCount: number): Record<string, any>[] {
  const data = new Array(rowCount).fill(null).map((_, index) => ({
    id: index + 1,
    parentId: index % 5,
    field1: `test 1 ${index + 2}`,
    field2: `test 2 ${index + 2}`,
  }));

  data.unshift({
    id: 0,
    parentId: -1,
    field1: 'test 1 0',
    field2: 'test 2 0',
  });

  return data;
}

const a11yCheckConfig = isMaterialBased() ? { runOnly: 'color-contrast' } : {};

test('Search panel, filter panel, pager and selection', async (t) => {
  const treeList = new TreeList(TREE_LIST_SELECTOR);

  await t
    .expect(treeList.isReady())
    .ok();

  await a11yCheck(t, a11yCheckConfig, TREE_LIST_SELECTOR);
}).before(async () => createWidget('dxTreeList', {
  dataSource: getData(40),
  keyExpr: 'id',
  parentIdExpr: 'parentId',
  rootValue: -1,
  autoExpandAll: true,
  paging: {
    enabled: true,
    pageSize: 5,
  },
  scrolling: {
    mode: 'standard',
  },
  selection: {
    mode: 'multiple',
  },
  searchPanel: {
    visible: true,
  },
  columns: [
    'id',
    'parentId',
    'field_1',
    'field_2',
  ],
}));
