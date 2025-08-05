import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { baseConfig } from './helpers/baseConfig';

fixture.disablePageReloads`HeaderFilter.API.Functional`
  .page(url(__dirname, '../../container.html'));

test('clearFilter API', async (t) => {
  const cardView = new CardView('#container');

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const popup = cardView.getHeaderFilterPopup();
  const list = cardView.getHeaderFilterList();
  const doneBtn = popup.getButton(0);
  const firstItem = list.getItem(0);

  await t
    .expect(cardView.getCards().count)
    .eql(4)

    .click(firstItem.element)
    .click(doneBtn.element)

    .expect(cardView.getCards().count)
    .eql(1);

  await cardView.apiClearFilter();

  await t
    .expect(cardView.getCards().count)
    .eql(4);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
  });
});

test('getCombinedFilter API', async (t) => {
  const cardView = new CardView('#container');

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const popup = cardView.getHeaderFilterPopup();
  const list = cardView.getHeaderFilterList();
  const doneBtn = popup.getButton(0);
  const firstItem = list.getItem(0);

  await t
    .expect(cardView.getCards().count)
    .eql(4)

    .click(firstItem.element)
    .click(doneBtn.element)

    .expect(cardView.getCards().count)
    .eql(1);

  await t
    .expect(cardView.apiGetCombinedFilter())
    .eql(['id', '=', 1]);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    remoteOperations: true, // NOTE: for more easy match of selector. If local, selector is func
  });
});

test('groupInterval API', async (t) => {
  const cardView = new CardView('#container');

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const popup = cardView.getHeaderFilterPopup();
  const list = cardView.getHeaderFilterList();
  const doneBtn = popup.getButton(0);
  const firstItem = list.getItem(1);

  await t
    .expect(cardView.getCards().count)
    .eql(4)

    .click(firstItem.element)
    .click(doneBtn.element)

    .expect(cardView.getCards().count)
    .eql(2)
    .expect(cardView.getCard(0).getFieldValueCell('Id').textContent)
    .eql('2')
    .expect(cardView.getCard(1).getFieldValueCell('Id').textContent)
    .eql('3');
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    ...{
      columns: [
        {
          dataField: 'id',
          dataType: 'number',
          headerFilter: {
            groupInterval: 2,
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
    },
  });
});
