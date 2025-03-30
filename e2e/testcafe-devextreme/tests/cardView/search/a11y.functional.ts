import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`CardView - Search.A11y.Functional`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('Search field should have aria-label attribute', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const searchBox = cardView.getSearchBox();

  await t
    .expect(searchBox.getInput().getAttribute('aria-label'))
    .eql('Search in the card view');
}).before(async () => createWidget('dxCardView', {
  searchPanel: {
    visible: true,
  },
  columns: ['Column 1'],
}));
