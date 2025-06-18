import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`CardView - Common Behavior`
  .page(url(__dirname, '../../container.html'));

test('cardHeader.visibility property should change on contentReady', async (t) => {
  const cardView = new CardView('#container');
  await t
    .expect(cardView.apiOption('cardHeader.visible'))
    .eql(true)
    .expect(cardView.getCard(0).getHeader().exists)
    .ok();
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: [{ ID: 1 }],
    onContentReady(e) {
      e.component.option('cardHeader.visible', true);
    },
  });
});
