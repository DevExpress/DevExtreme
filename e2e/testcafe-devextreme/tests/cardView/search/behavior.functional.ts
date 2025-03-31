import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { baseConfig } from './helpers/baseConfig';

fixture.disablePageReloads`CardView - SearchPanel API`
  .page(url(__dirname, '../../container.html'));

test('Search panel should filter cards', async (t) => {
  const cardView = new CardView('#container');
  const searchInput = cardView.getSearchBox().getInput();

  await t
    .expect(cardView.getCards().count)
    .eql(4)
    .typeText(searchInput, 'rt')
    .expect(cardView.getCards().count)
    .eql(2)
    .pressKey('ctrl+a backspace')
    .expect(cardView.getCards().count)
    .eql(4);
}).before(async () => {
  await createWidget('dxCardView', baseConfig);
});
