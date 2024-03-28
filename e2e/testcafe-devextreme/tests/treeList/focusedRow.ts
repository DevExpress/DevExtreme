import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import TreeList from '../../model/treeList';

const clearLocalStorage = ClientFunction(() => {
  (window as any).localStorage.removeItem('mystate');
});

fixture`Focused row`
  .page(url(__dirname, '../container.html'));

const getItems = (): Record<string, unknown>[] => {
  const items: Record<string, unknown>[] = [];
  for (let i = 0; i < 100; i += 1) {
    items.push({
      ID: i + 1,
      Name: `Name ${i + 1}`,
    });
  }
  return items;
};

const getTreeListConfig = (): any => ({
  dataSource: getItems(),
  keyExpr: 'ID',
  height: 500,
  stateStoring: {
    enabled: true,
    type: 'custom',
    customSave: (state) => {
      localStorage.setItem('mystate', JSON.stringify(state));
    },
    customLoad: () => {
      let state = localStorage.getItem('mystate');
      if (state) {
        state = JSON.parse(state);
      }
      return state;
    },
  },
  focusedRowEnabled: true,
  focusedRowKey: 90,
});

test('Focused row should be shown after reloading the page (T1058983)', async (t) => {
  const treeList = new TreeList('#container');

  await t
    .wait(1000);
  let scrollTopPosition = await treeList.getScrollTop();

  // assert
  await t
    .expect(treeList.isFocusedRowInViewport())
    .ok();

  // act
  await treeList.scrollTo(t, { top: 0 });
  scrollTopPosition = await treeList.getScrollTop();

  // assert
  await t
    .expect(scrollTopPosition)
    .eql(0);

  await t
    .eval(() => location.reload());
  await createWidget('dxTreeList', getTreeListConfig());
  await t
    .wait(1000);

  scrollTopPosition = await treeList.getScrollTop();

  // assert
  await t
    .expect(treeList.isFocusedRowInViewport())
    .ok();
}).before(async () => {
  await clearLocalStorage();
  return createWidget('dxTreeList', getTreeListConfig());
}).after(async () => {
  await clearLocalStorage();
});

test('TreeList - Unable to focus a node when deleting the previous node in certain scenarios (T1178893)', async (t) => {
  const treeList = new TreeList('#container');

  await t
    .expect(treeList.getFocusedRow().getAttribute('aria-rowindex'))
    .eql('3')

    .click(treeList.getDataRow(2).getCommandCell(2).getButton(2))
    .click(treeList.getConfirmDeletionButton())
    .expect(treeList.getFocusedRow().getAttribute('aria-rowindex'))
    .eql('3')

    .click(treeList.getDataRow(2).getCommandCell(2).getButton(2))
    .click(treeList.getConfirmDeletionButton())
    .expect(treeList.getFocusedRow().getAttribute('aria-rowindex'))
    .eql('3')
    .expect(treeList.getDataRow(2).getDataCell(0).element.textContent)
    .eql('5');
}).before(async () => {
  await clearLocalStorage();
  const config = getTreeListConfig();
  config.editing = {
    mode: 'row',
    allowUpdating: true,
    allowAdding: true,
    allowDeleting: true,
  };
  config.focusedRowKey = 3;

  return createWidget('dxTreeList', config);
}).after(async () => {
  await clearLocalStorage();
});
