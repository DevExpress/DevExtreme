import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TreeList from 'devextreme-testcafe-models/treeList';
import ExpandableCell from 'devextreme-testcafe-models/treeList/expandableCell';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';

fixture.disablePageReloads`Grouping Panel - Alternate rows correction on toggle`
  .page(url(__dirname, '../container.html'));

test('TreeList - Rows do not alternate correctly if rowAlternationEnabled and repaintChangesOnly are enabled (T1291705)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const treeList = new TreeList('#container');
  const dataRow = (row) => treeList.getDataRow(row);
  const toggleButton = (row, shouldExpand = true) => {
    const cell = new ExpandableCell(dataRow(row).getDataCell(0));
    return shouldExpand ? cell.getExpandButton() : cell.getCollapseButton();
  };

  await treeList.isReady();

  await t
    .click(toggleButton(1))
    .click(toggleButton(3));

  await t
    .expect(await takeScreenshot('T1291705-rows-with-correct-alternation-on-expand.png', treeList.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());

  await t
    .click(toggleButton(3, false))
    .click(toggleButton(1, false));

  await t
    .expect(await takeScreenshot('T1291705-rows-with-correct-alternation-on-collapse.png', treeList.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTreeList', {
  dataSource: [
    { id: 1, parentId: 0, text: 'item 1' },
    { id: 2, parentId: 0, text: 'item 2' },
    { id: 3, parentId: 2, text: 'item 3' },
    { id: 4, parentId: 0, text: 'item 4' },
    { id: 5, parentId: 4, text: 'item 5' },
    { id: 6, parentId: 0, text: 'item 6' },
  ],
  rowAlternationEnabled: true,
  repaintChangesOnly: true,
  columns: ['text'],
}));
