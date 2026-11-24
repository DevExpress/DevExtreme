const isTreeListDrawn = () => {
  const treeListElement = document.querySelector('.dx-gantt .dx-treelist');
  const treeList = treeListElement && window.DevExpress.ui.dxTreeList.getInstance(treeListElement);
  const treeListContent = treeListElement?.querySelector('.dx-treelist-rowsview .dx-treelist-content');
  const ownedTableIds = treeListContent?.getAttribute('aria-owns')?.split(' ') ?? [];

  return !!treeList
    && treeList.getVisibleRows().length > 0
    && ownedTableIds.length > 0
    && ownedTableIds.every((id) => document.getElementById(id));
};

const getTreeListUpdateTimeout = () => {
  const treeListElement = document.querySelector('.dx-gantt .dx-treelist');

  return window.DevExpress.ui.dxTreeList.getInstance(treeListElement).option('scrolling.updateTimeout');
};

const waitForSettledTreeList = async (page) => {
  await page.waitForFunction(isTreeListDrawn);
  await page.waitForTimeout(await page.evaluate(getTreeListUpdateTimeout));

  if (!await page.evaluate(isTreeListDrawn)) {
    await waitForSettledTreeList(page);
  }
};

export default waitForSettledTreeList;
