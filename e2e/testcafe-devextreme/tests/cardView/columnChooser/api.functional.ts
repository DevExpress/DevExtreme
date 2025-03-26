import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`CardView - ColumnChooser.Functional`
  .page(url(__dirname, '../../container.html'));

test('public methods showColumnChooser and hideColumnChooser', async (t) => {
  const cardView = new CardView('#container');
  const columnChooser = cardView.getColumnChooser();

  await t.expect(columnChooser.isOpen).notOk();

  await cardView.apiShowColumnChooser();
  await t.expect(columnChooser.isOpen).ok();

  await cardView.apiHideColumnChooser();
  await t.expect(columnChooser.isOpen).notOk();
}).before(async () => {
  await createWidget('dxCardView', {
    columns: ['Column 1'],
    columnChooser: {
      enabled: true,
    },
  });
});
