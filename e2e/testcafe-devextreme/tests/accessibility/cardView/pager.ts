import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { a11yCheck } from '../../../helpers/accessibility/utils';

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
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

[true, false].forEach((remoteOperation) => {
  test(`Runtime filterValue change updates paging when remoteOperations = ${remoteOperation}`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    await cardView.apiOption('filterValue', [
      ['value', '=', '1'],
      'or', ['value', '=', '2'],
      'or', ['value', '=', '3'],
      'or', ['value', '=', '4'],
    ]);

    await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
  }).before(async () => createCardViewWithPager({ remoteOperations: remoteOperation }));
});
