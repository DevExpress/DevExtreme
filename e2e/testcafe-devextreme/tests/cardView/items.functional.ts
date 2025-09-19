import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`CardView - Editing`
  .page(url(__dirname, '../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const config = {
  columns: [{
    dataField: 'activity',
    columnType: 'number',
    calculateDisplayValue(e) {
      return `activity ${e.activity}`;
    },
  }],
  dataSource: [
    { id: 1, activity: 1 },
  ],
  keyExpr: 'id',
};

test('Column should show data from calculateDisplayValue if function\'s result has other dataType', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const valueCell = cardView.getCard().getFieldValueCell('Activity');

  const text = await valueCell.innerText;

  await t.expect(text).eql('activity 1');
}).before(async () => createWidget('dxCardView', config));
