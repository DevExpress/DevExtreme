import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`HeaderFilter.A11y.Functional`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('column chooser popup should have aria-label attribute', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const { popup } = cardView.getColumnChooser();

  await cardView.apiShowColumnChooser();

  await t.expect(popup.element.getAttribute('aria-label')).ok();
}).before(async () => createWidget('dxCardView', {
  columnChooser: {
    enabled: true,
  },
  columns: ['Column 1'],
}));
