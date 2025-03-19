import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`HeaderFilter.A11y.Functional`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('should open popup by enter if filter icon in the focused state', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const firstHeaderItem = cardView
    .getHeaderPanel()
    .getHeaderItem();
  await t.click(firstHeaderItem.element)
    .pressKey('alt+down');

  // NOTE: We check list here, because this list rendered inside popup
  const list = cardView.getHeaderFilterList();

  await t.expect(list.element.exists).ok();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0' },
    { A: 'A_1' },
    { A: 'A_2' },
  ],
  columns: [{ dataField: 'A', caption: 'LONG_COLUMN_A_CAPTION' }],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

test('should return focus on the same icon after the popup closing', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const firstHeaderItem = cardView
    .getHeaderPanel()
    .getHeaderItem();
  await t.click(firstHeaderItem.element)
    .pressKey('alt+down');

  // NOTE: We check list here, because this list rendered inside popup
  const list = cardView.getHeaderFilterList();
  await t.expect(list.element.exists).ok();

  await t
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('enter');

  await t.expect(firstHeaderItem.element.focused).ok();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0' },
    { A: 'A_1' },
    { A: 'A_2' },
  ],
  columns: [{ dataField: 'A', caption: 'LONG_COLUMN_A_CAPTION' }],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));
