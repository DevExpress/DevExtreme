import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { data } from '../helpers/simpleArrayData';

fixture.disablePageReloads`CardView - FilterBuilderPopup API`
  .page(url(__dirname, '../../container.html'));

const baseConfig = {
  dataSource: data,
  columns: [
    {
      dataField: 'id',
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
  filterPanel: {
    visible: true,
  },
};

test('filterBuilderPopup.height API', async (t) => {
  const cardView = new CardView('#container');
  const filterBuilderPopup = await cardView.getFilterPanel().openFilterBuilderPopup(t);

  await t
    .expect(filterBuilderPopup.asPopup().content.offsetHeight)
    .eql(500);

  await cardView.apiOption('filterBuilderPopup.height', 700);

  await t
    .expect(filterBuilderPopup.asPopup().content.offsetHeight)
    .eql(700);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      filterBuilderPopup: {
        height: 500,
      },
    },
  });
});

test('filterBuilderPopup.title API', async (t) => {
  const cardView = new CardView('#container');
  const filterBuilderPopup = await cardView.getFilterPanel().openFilterBuilderPopup(t);

  await t
    .expect(filterBuilderPopup.asPopup().getToolbar().innerText)
    .eql('Test');

  await cardView.apiOption('filterBuilderPopup.title', 'Test2');

  await t
    .expect(filterBuilderPopup.asPopup().getToolbar().innerText)
    .eql('Test2');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      filterBuilderPopup: {
        title: 'Test',
      },
    },
  });
});
