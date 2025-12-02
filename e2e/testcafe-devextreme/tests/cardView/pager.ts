import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';

async function createCardViewWithPager(config: any = {}): Promise<any> {
  const dataSource = Array.from({ length: 20 }, (_, i) => ({ text: i.toString(), value: i }));
  return createWidget('dxCardView', {
    dataSource,

    // TODO: resolve the situation when colums are not set in config
    // There is the 'Maximum call stack size exceeded' error in this case
    columns: [
      'text',
      'value',
    ],
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
    ...config,
  });
}

fixture.disablePageReloads`Pager`
  .page(url(__dirname, '../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('Page index interaction', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const pager = cardView.getPager();
  await t
    .expect(pager.getPageSize(0).selected)
    .ok('page size 2 selected')
    .expect(pager.getNavPage('6').selected)
    .ok('page 6 selected')
    .expect(pager.getInfoText().textContent)
    .eql('Page 6 of 10 (20 items)')
    .expect(cardView.getCard(1).getFieldValueCell('Text').innerText)
    .eql('11');

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

[true, false].forEach((remoteOperation) => {
  test(`Runtime filterValue change updates paging when remoteOperations = ${remoteOperation}`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await cardView.apiOption('filterValue', [
      ['value', '=', '1'],
      'or', ['value', '=', '2'],
      'or', ['value', '=', '3'],
      'or', ['value', '=', '4'],
    ]);

    await testScreenshot(t, takeScreenshot, `filter-value-edit-paging-update-remoteOperations-${remoteOperation}.png`, { element: cardView.element });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createCardViewWithPager({ remoteOperations: remoteOperation }));
});

test('Paging after resetting filter', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const pager = cardView.getPager();

  await cardView.apiOption('filterValue', ['text', '=', '0']);

  // only one card should be visible, so Pager is not rendered
  await t.expect(pager.element.exists).notOk();

  await cardView.apiClearFilter();
  await t
    .expect(pager.element.exists).ok()
    .expect(pager.getInfoText().textContent).eql('Page 1 of 10 (20 items)');

  // navigate to next page
  await t
    .click(pager.getNextNavButton().element)
    .expect(cardView.getCard(1).getFieldValueCell('Text').innerText)
    .eql('3');
}).before(async () => createCardViewWithPager({
  filterPanel: {
    visible: true,
  },
}));
