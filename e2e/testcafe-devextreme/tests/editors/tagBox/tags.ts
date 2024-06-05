import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TagBox from 'devextreme-testcafe-models/tagBox';
import { Selector as $ } from 'testcafe';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`TagBox`
  .page(url(__dirname, '../../container.html'));

const LIST_ITEM_CLASS = 'dx-list-item';

test('Tags should be displayed correctly when valueExpr is a function and hideSelectedItems is enabled (T1234032)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const tagBox = new TagBox('#container');

  await t
    .click(tagBox.element)
    .click($(`.${LIST_ITEM_CLASS}`).nth(0));

  await t
    .click(tagBox.element)
    .click($(`.${LIST_ITEM_CLASS}`).nth(0));

  await t
    .click(tagBox.element)
    .click($(`.${LIST_ITEM_CLASS}`).nth(0));

  await testScreenshot(t, takeScreenshot, 'Tag label values are displayed correctly.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTagBox', {
  dataSource: [
    { id: 1, scheme: 'schema 1', name: 'item1' },
    { id: 2, scheme: 'schema 2', name: 'item2' },
    { id: 3, scheme: 'schema 3', name: 'item3' }],
  valueExpr(x) {
    return x && `${x.name} ${x.scheme}`;
  },
  hideSelectedItems: true,
  displayExpr: 'name',
}));
