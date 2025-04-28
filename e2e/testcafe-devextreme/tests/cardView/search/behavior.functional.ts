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

test('Search panel should should take into account calculateFilterExpression', async (t) => {
  const cardView = new CardView('#container');
  const searchInput = cardView.getSearchBox().getInput();

  await t
    .expect(cardView.getCards().count)
    .eql(4)
    .typeText(searchInput, '1')
    .expect(cardView.getCards().count)
    .eql(2)
    .expect(cardView.getCard(0).getFieldValueCell('Last Name').innerText)
    .eql('Reagan')
    .expect(cardView.getCard(1).getFieldValueCell('Last Name').innerText)
    .eql('Sims');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    columns: [
      {
        dataField: 'id',
        calculateFilterExpression() {
          return [this.dataField, '>', '2'];
        },
      },
      {
        dataField: 'title',
      },
      {
        dataField: 'name',
      },
      {
        dataField: 'lastName',
      },
    ],
  });
});
