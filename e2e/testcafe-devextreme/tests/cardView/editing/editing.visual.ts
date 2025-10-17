import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { columns, data } from '../helpers/simpleArrayData';
import { testScreenshot } from '../../../helpers/themeUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`CardView - Editing`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const baseConfig = {
  columns,
  dataSource: data,
  keyExpr: 'id',
  editing: {
    allowUpdating: true,
    allowDeleting: true,
    allowAdding: true,
  },
};

safeSizeTest('default render', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'editing-default-render.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1100, 700]).before(async () => createWidget('dxCardView', baseConfig));

safeSizeTest('render of add card popup', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(cardView.getToolbar().getAddButton().element);
  await testScreenshot(t, takeScreenshot, 'editing-popup-add.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1100, 700]).before(async () => createWidget('dxCardView', baseConfig));

safeSizeTest('render of edit card popup', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(cardView.getCard(0).getToolbarItem(0));
  await testScreenshot(t, takeScreenshot, 'editing-popup-edit.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [1100, 700]).before(async () => createWidget('dxCardView', baseConfig));
