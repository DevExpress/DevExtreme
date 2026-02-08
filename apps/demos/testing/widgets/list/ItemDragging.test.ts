import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

const WINDOW_WIDTH = 600;

fixture('List.DragAndDrop')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, WINDOW_WIDTH];
  });

runManualTest('List', 'DragAndDrop', (test) => {
  test('DragAndDrop', async (t) => {
    const REORDER_HANDLE_CLASS = 'dx-list-reorder-handle';
    const LIST_CLASS = 'dx-list';
    const LIST_ITEM_CLASS = 'dx-list-item';
    const LIST_ITEM_TEXT = 'Review Health Insurance Options Under the Affordable Care Act';
    const LIST_ITEM_HEIGHT = 40;

    const itemToDrag = $(`.${LIST_ITEM_CLASS}`).withText(LIST_ITEM_TEXT);
    const dragHandle = itemToDrag.find(`.${REORDER_HANDLE_CLASS}`);

    await t
      .drag(dragHandle, 0, -LIST_ITEM_HEIGHT - 10);

    const thirdItemRightList = $(`.${LIST_CLASS}`).nth(1).find(`.${LIST_ITEM_CLASS}`).nth(2);

    await t
      .expect(thirdItemRightList.textContent)
      .eql(LIST_ITEM_TEXT);

    await t
      .drag(dragHandle, -WINDOW_WIDTH, -LIST_ITEM_HEIGHT - 10);

    const secondItemLeftList = $(`.${LIST_CLASS}`).nth(0).find(`.${LIST_ITEM_CLASS}`).nth(1);

    await t
      .expect(secondItemLeftList.textContent)
      .eql(LIST_ITEM_TEXT);
  });
});
