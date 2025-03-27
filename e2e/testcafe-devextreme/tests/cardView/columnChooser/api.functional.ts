import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`CardView - ColumnChooser.Functional`
  .page(url(__dirname, '../../container.html'));

// TODO: refator this when cardView is merged to 25.1 . This should be in ColumnChooser POM
const isOpened = (columnChooser) => columnChooser.element.exists;

test('public method showColumnChooser', async (t) => {
  const cardView = new CardView('#container');
  const columnChooser = cardView.getColumnChooser();

  await t.expect(isOpened(columnChooser)).notOk();

  await cardView.apiShowColumnChooser();
  await t.expect(isOpened(columnChooser)).ok();
}).before(async () => {
  await createWidget('dxCardView', {
    columns: ['Column 1'],
    columnChooser: {
      enabled: true,
    },
  });
});

test('public method hideColumnChooser', async (t) => {
  const cardView = new CardView('#container');
  const columnChooser = cardView.getColumnChooser();

  await t.click(cardView.getColumnChooserButton());
  await t.expect(isOpened(columnChooser)).ok();

  await cardView.apiHideColumnChooser();
  await t.expect(isOpened(columnChooser)).notOk();
}).before(async () => {
  await createWidget('dxCardView', {
    columns: ['Column 1'],
    columnChooser: {
      enabled: true,
    },
  });
});
