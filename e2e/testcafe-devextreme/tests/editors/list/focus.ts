import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import List from 'devextreme-testcafe-models/list';
import { createWidget } from '../../../helpers/createWidget';

fixture`List`
  .page(url(__dirname, '../../container.html'));

const createList = (selectionMode, allowItemDeleting = false) => createWidget('dxList', {
  items: ['item1', 'item2', 'item3'],
  showSelectionControls: true,
  selectionMode,
  allowItemDeleting,
});

test('Should apply styles on selectAll checkbox after tab button press', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const list = new List('#container');

  await t
    .pressKey('tab')
    .expect(list.selectAll.checkBox.isFocused)
    .ok();

  await testScreenshot(t, takeScreenshot, 'List selectAll checkbox should be focused after tab press.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createList('all'));

test('Should apply styles on selectAll checkbox after enter button press on it', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const list = new List('#container');

  await t
    .pressKey('tab')
    .pressKey('enter')
    .expect(list.selectAll.checkBox.isChecked)
    .ok();

  await testScreenshot(t, takeScreenshot, 'List selectAll checkbox should be checked after enter press.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createList('all'));

['single', 'multiple'].forEach((selectionMode) => {
  test(`Should apply styles on list item after tab button press, ${selectionMode} mode`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const list = new List('#container');

    await t
      .pressKey('tab')
      .expect(list.getItem(0).isFocused)
      .ok();

    await testScreenshot(t, takeScreenshot, `List item should be focused after tab press in ${selectionMode} mode.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createList(selectionMode));

  test(`Should apply styles on list item after enter button press on it, ${selectionMode} mode`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const list = new List('#container');

    const firstItem = list.getItem(0);
    const firstItemType = selectionMode === 'single' ? firstItem.radioButton : firstItem.checkBox;

    await t
      .pressKey('tab')
      .pressKey('enter')
      .expect(firstItemType.isChecked)
      .ok();

    await testScreenshot(t, takeScreenshot, `List item should be checked after enter press in ${selectionMode} mode.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createList(selectionMode));
});

test('Should select next item after delete by keyboard', async (t) => {
  const list = new List('#container');
  const firstItem = list.getItem(0);

  await t
    .expect(list.getVisibleItems().count).eql(3)
    .click(firstItem.element)
    .pressKey('delete');

  const item = list.getItem(0);

  await t.expect(item.isFocused)
    .ok();
  await t.expect(item.text)
    .eql('item2');
  await t
    .expect(list.getItems().count).eql(2);
}).before(async () => createList('none', true));

test('Should select previous item after delete last item', async (t) => {
  const list = new List('#container');
  const lastItem = list.getItem(2);

  await t
    .expect(list.getVisibleItems().count).eql(3)
    .click(lastItem.element)
    .pressKey('delete');

  const item = list.getItem(1);

  await t.expect(item.isFocused)
    .ok();
  await t.expect(item.text)
    .eql('item2');
  await t
    .expect(list.getItems().count).eql(2);
}).before(async () => createList('none', true));

[[2, 0], [1, 2]].forEach(([selectItemIdx, deleteItemIdx]) => {
  test(`Should not change selection after delete another (not selected) item (${selectItemIdx}, ${deleteItemIdx})`, async (t) => {
    const list = new List('#container');
    const itemToSelect = list.getItem(selectItemIdx);
    const itemToDelete = list.getItem(deleteItemIdx);

    await t
      .expect(list.getVisibleItems().count).eql(3)
      .click(itemToSelect.element)
      .click(itemToDelete.element.find('.dx-button'));

    const item = list.getItem(deleteItemIdx > selectItemIdx ? selectItemIdx : selectItemIdx - 1);

    await t.expect(item.isFocused)
      .ok();
    await t.expect(item.text)
      .eql(`item${selectItemIdx + 1}`);
    await t
      .expect(list.getItems().count).eql(2);
  }).before(async () => createList('none', true));
});
