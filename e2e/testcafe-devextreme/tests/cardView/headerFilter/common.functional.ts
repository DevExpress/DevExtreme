import CardView from 'devextreme-testcafe-models/cardView';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`HeaderFilter.Common.Functional`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('should support custom translations', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  const popup = cardView.getHeaderFilterPopup();
  const list = cardView.getHeaderFilterList();
  const doneBtn = popup.getButton(0);
  const closeBtn = popup.getButton(1);
  const firstItem = list.getItem(0);

  await t.expect(doneBtn.text)
    .eql('TEST_OK')
    .expect(closeBtn.text)
    .eql('TEST_CANCEL')
    .expect(firstItem.text)
    .eql('TEST_EMPTY');

  await t.click(cardView.element);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  columns: [
    {
      dataField: 'A',
      calculateCellValue: () => undefined,
    },
    'B',
    'C',
  ],
  headerFilter: {
    visible: true,
    texts: {
      ok: 'TEST_OK',
      cancel: 'TEST_CANCEL',
      emptyValue: 'TEST_EMPTY',
    },
  },
  height: 600,
}));
