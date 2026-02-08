import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`CardView - ContextMenu Behavior`
  .page(url(__dirname, '../../container.html'));

test('Context menu should be shown at the mouse cursor', async (t) => {
  const cardView = new CardView('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .rightClick(cardView.getHeaders().getHeaderItemNth(0).element, { offsetX: -10, offsetY: -10 });

  await testScreenshot(t, takeScreenshot, 'card-view_context-menu_mouse-click_position.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: [{ ID: 1 }],
  });
});

export const triggerCustomContextMenu = ClientFunction((selector) => {
  const element = selector() as Element;

  const rect = element.getBoundingClientRect();
  const xPosition = rect.left + rect.width / 2;
  const yPosition = rect.top + rect.height / 2;

  const event = new MouseEvent('contextmenu');
  /*
    Note: By default, TestCafe sets the pageX and pageY properties of MouseEvent to 0.
    There is no supported way to define custom pageX and pageY values for the contextmenu event.
    Additionally, TestCafe does not support system keys, so triggering combinations like Shift+F10
    or the Context Menu key is not possible.
  */
  Object.defineProperty(event, 'pageX', { value: xPosition });
  Object.defineProperty(event, 'pageY', { value: yPosition });

  element.dispatchEvent(event as any);
});

test('Context menu should be shown at center of the header item if shown with the keyboard', async (t) => {
  const cardView = new CardView('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await triggerCustomContextMenu(cardView.getHeaders().getHeaderItemNth(0).element);
  await testScreenshot(t, takeScreenshot, 'card-view_context-menu_keyboard_position.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: [{ ID: 1 }],
  });
});
