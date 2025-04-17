import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import CardView from 'testcafe-models/cardView';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { columns, data } from './helpers/simpleArrayData';
import { testScreenshot } from '../../helpers/themeUtils';

fixture.disablePageReloads`CardView - Editing`
  .page(url(__dirname, '../container.html'));

const baseConfig = {
  width: 400,
  height: 600,
  columns,
  dataSource: data,
  editing: {
    allowUpdating: true,
    allowDeleting: true,
    allowAdding: true,
  },
};

test('default render', async (t) => {
  const cardView = new CardView('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'editing-default-render.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', baseConfig));

test('render of add card popup', async (t) => {
  const cardView = new CardView('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(cardView.getHeaderPanel().getHeaderItem(1).element);
  await takeScreenshot('editing-popup-add', cardView.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', baseConfig));

test('render of edit card popup', async (t) => {
  const cardView = new CardView('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(cardView.getCard(0).getToolbarItem(0));
  await takeScreenshot('editing-popup-edit', cardView.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', baseConfig));
