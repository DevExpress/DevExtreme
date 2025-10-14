import TreeList from 'devextreme-testcafe-models/treeList';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`Public methods`
  .page(url(__dirname, '../container.html'));

const getItems = (): Record<string, unknown>[] => {
  const items: Record<string, unknown>[] = [];

  for (let i = 0; i < 100; i += 1) {
    items.push({ key: `item_${i}`, parentKey: null });

    for (let j = 0; j < 100; j += 1) {
      items.push({ key: `item_${i}_${j}`, parentKey: `item_${i}` });
    }
  }

  return items;
};

[true, false].forEach((renderAsync) => {
  [true, false].forEach((useNativeScrolling) => {
    test(`The renderAsync=${renderAsync} and scrolling.useNative=${useNativeScrolling}: The navigateToRow method should work correctly when there are asynchronous cell templates and virtual scrolling is enabled (T1275775)`, async (t) => {
      // arrange
      const treeList = new TreeList('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(treeList.getDataCell(0, 0).element.textContent)
        .contains('item_');

      // act
      await treeList.apiNavigateToRow('item_80_50');

      // assert
      await t
        .expect(treeList.getDataCell(131, 0).element.textContent)
        .contains('item_');

      await takeScreenshot(`T1275775-navigateToRow-with-async-cell-templates_(renderAsync=${renderAsync}_useNativeScrolling=${useNativeScrolling})`, treeList.element);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxTreeList', {
      dataSource: getItems(),
      height: 500,
      width: 500,
      dataStructure: 'plain',
      parentIdExpr: 'parentKey',
      keyExpr: 'key',
      renderAsync,
      scrolling: {
        mode: 'virtual',
        useNaive: useNativeScrolling,
      },
      templatesRenderAsynchronously: true,
      columns: [{
        dataField: 'key',
        cellTemplate: 'testCellTemplate',
      }],
      integrationOptions: {
        templates: {
          testCellTemplate: {
            render({ model, container, onRendered }) {
              setTimeout(() => {
                container.append($('<span/>').text(model.value));
                onRendered();
              }, 100);
            },
          },
        },
      },
    }));
  });
});
