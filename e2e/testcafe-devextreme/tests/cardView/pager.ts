import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

async function createCardViewWithPager(): Promise<any> {
  const dataSource = Array.from({ length: 20 }, (_, i) => ({ text: i.toString(), value: i}));
  return createWidget('dxCardView', {
    dataSource,
    paging: {
      pageSize: 2,
      pageIndex: 5,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [2, 3, 4],
      showInfo: true,
      showNavigationButtons: true,
    },
  });
}
fixture.disablePageReloads`Pager`
  .page(url(__dirname, '../container.html'));

test('Page index interaction', async (t) => {
  const cardView = new CardView('#container');
  const pager = cardView.getPager();
  await t
    .expect(pager.getPageSize(0).selected)
    .ok('page size 2 selected')
    .expect(pager.getNavPage('6').selected)
    .ok('page 6 selected')
    .expect(pager.getInfoText().textContent)
    .eql('Page 6 of 10 (20 items)')
    .expect(cardView.getCard(1).getFieldValueCell('Text').innerText)
    .eql('11')

  // set page index 7
  await t
    .click(pager.getNavPage('7').element)
    .expect(cardView.getCard(1).getFieldValueCell('Text').innerText)
    .eql('13')
    .expect(pager.getInfoText().textContent)
    .eql('Page 7 of 10 (20 items)');

  // navigate to prev page (6)
  await t
    .click(pager.getPrevNavButton().element)
    .expect(pager.getInfoText().textContent)
    .eql('Page 6 of 10 (20 items)');
}).before(async () => createCardViewWithPager());
