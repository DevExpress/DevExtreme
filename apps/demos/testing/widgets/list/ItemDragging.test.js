import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

const WINDOW_WIDTH = 600;

fixture('List.ItemDragging')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t.resizeWindow(900, WINDOW_WIDTH);
  });

runManualTest('List', 'ItemDragging', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('ItemDragging', async (t) => {
    const REORDER_HANDLE_CLASS = 'dx-list-reorder-handle';
    const LIST_CLASS = 'dx-list';
    const LIST_ITEM_CLASS = 'dx-list-item';
    const LIST_ITEM_TEXT = 'Review Health Insurance Options Under the Affordable Care Act';
    const LIST_ITEM_HEIGHT = 40;

    const itemToDrag = await $(`.${LIST_ITEM_CLASS}`).withText(LIST_ITEM_TEXT);
    const dragHandle = await itemToDrag.find(`.${REORDER_HANDLE_CLASS}`);

    await t
      .click(itemToDrag)
      .drag(dragHandle, 0, -(LIST_ITEM_HEIGHT * 2));

    const thirdItemRightList = await $(`.${LIST_CLASS}`).nth(1).find(`.${LIST_ITEM_CLASS}`).nth(2);

    await t
      .expect(thirdItemRightList.textContent)
      .eql(LIST_ITEM_TEXT);

    await t
      .click(itemToDrag)
      .drag(dragHandle, -WINDOW_WIDTH, -LIST_ITEM_HEIGHT);

    const thirdItemLeftList = await $(`.${LIST_CLASS}`).nth(0).find(`.${LIST_ITEM_CLASS}`).nth(2);

    await t
      .expect(thirdItemLeftList.textContent)
      .eql(LIST_ITEM_TEXT);
  });
});
