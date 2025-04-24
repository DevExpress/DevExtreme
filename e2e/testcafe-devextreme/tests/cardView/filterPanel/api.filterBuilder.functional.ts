import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { baseConfig } from './helpers/baseConfig';

fixture.disablePageReloads`CardView - FilterBuilder API`
  .page(url(__dirname, '../../container.html'));

test('filterBuilder.height API', async (t) => {
  const cardView = new CardView('#container');
  const filterBuilderPopup = await cardView.getFilterPanel().openFilterBuilderPopup(t);

  await t
    .expect(filterBuilderPopup.getFilterBuilder().element.clientHeight)
    .eql(500);

  await cardView.apiOption('filterBuilder.height', 700);

  await t
    .expect(filterBuilderPopup.getFilterBuilder().element.clientHeight)
    .eql(700);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      filterBuilder: {
        height: 500,
      },
    },
  });
});

test('filterBuilder.hint API', async (t) => {
  const cardView = new CardView('#container');
  const filterBuilderPopup = await cardView.getFilterPanel().openFilterBuilderPopup(t);

  await t
    .expect(filterBuilderPopup.getFilterBuilder().element.getAttribute('title'))
    .eql('Test');

  await cardView.apiOption('filterBuilder.hint', 'Test2');

  await t
    .expect(filterBuilderPopup.getFilterBuilder().element.getAttribute('title'))
    .eql('Test2');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      filterBuilder: {
        hint: 'Test',
      },
    },
  });
});
