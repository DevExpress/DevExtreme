import { expect, test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import { getThemeName } from '../../../helpers/themeUtils';
import TreeList from '../../../models/treeList';

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

test('Search panel, filter panel, pager and selection', async ({ page, theme }) => {
  await createWidget(page, 'dxTreeList', {
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
  });

  const a11yCheckConfig = getThemeName(theme) === 'fluent' ? {} : { runOnly: 'color-contrast' };
  const treeList = new TreeList(page, TREE_LIST_SELECTOR);

  await expect.poll(() => treeList.isReady()).toBe(true);

  await a11yCheck(page, a11yCheckConfig, TREE_LIST_SELECTOR);
});
