import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TreeList from 'devextreme-testcafe-models/treeList';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { getData } from '../../dataGrid/helpers/generateDataSourceData';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Drag and Drop`
  .page(url(__dirname, '../../container.html'));

test('Fixed columns should work when drag and drop rows are enabled', async (t) => {
  // arrange, act
  const treeList = new TreeList(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot('treelist_sticky_columns_with_drag_and_drop.png', treeList.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTreeList', {
  dataSource: getData(10, 10),
  keyExpr: 'field_0',
  width: 500,
  columnFixing: {
    enabled: true,
  },
  showColumnHeaders: true,
  columnAutoWidth: true,
  rowDragging: {
    allowReordering: true,
    dropFeedbackMode: 'push',
  },
  customizeColumns(columns) {
    columns[5].fixed = true;
    columns[6].fixed = true;

    columns[8].fixed = true;
    columns[8].fixedPosition = 'right';
    columns[9].fixed = true;
    columns[9].fixedPosition = 'right';
  },
}));
