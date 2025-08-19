import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`CardView - Security`
  .page(url(__dirname, '../container.html'));

const UNSAFE_TEXT = '<script>console.log("XSS!")</script>';

test('Script inside cell text should not be executed after opening header filter', async (t) => {
  const cardView = new CardView('#container');

  await t.click(
    cardView.getHeaderPanel().getHeaderItem().getFilterIcon(),
  );

  await t.expect(
    cardView.getHeaderFilterList().getItem(0).text,
  ).eql(UNSAFE_TEXT);
}).before(async () => createWidget('dxCardView', {
  columns: ['caption'],
  headerFilter: {
    visible: true,
  },
  dataSource: [
    { id: 1, caption: UNSAFE_TEXT },
  ],
}));
