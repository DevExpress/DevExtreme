import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { MouseAction, MouseUpEvents } from '../../../helpers/mouseUpEvents';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture.disablePageReloads`CardView - Sortable`
  .page(url(__dirname, '../../container.html'));

const PARENT_CONTAINER = '#parentContainer';
const PARENT_STYLES = `${PARENT_CONTAINER} { width: 400px; padding: 0 20px; }`;
const CARD_VIEW_SELECTOR = '#container';
const DRAG_MOVE_X_COEFFICIENT = 1.5;
const DRAG_MOVE_Y_COEFFICIENT = 1;

const a11yCheckConfig = {
  rules: {
    // False positive: contrast rules do not apply to disabled elements
    'color-contrast': { enabled: false },
    // NOTE: Draggable template is outside the role="main" landmark
    region: { enabled: false },
  },
};

// NOTE: Main idea of these offsets -> drag header item elements
// on the "coefficient * size" distance from an initial position
// to trigger the dxSortable indicator
const getDragCoordinates = async (
  element: Selector,
  direction: 'left' | 'right',
): Promise<{ dragOffsetX: number; dragOffsetY: number }> => {
  const itemWidth = await element.offsetWidth;
  const itemHeight = await element.offsetWidth;

  const dragDirectionX = direction === 'left' ? -1 : 1;
  const dragOffsetX = Math
    .round(dragDirectionX * DRAG_MOVE_X_COEFFICIENT * itemWidth);
  const dragOffsetY = Math
    .round(DRAG_MOVE_Y_COEFFICIENT * itemHeight);

  return { dragOffsetX, dragOffsetY };
};

test('sortable indicator during dragging to first place', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const headerPanel = cardView.getHeaderPanel();
  const item = headerPanel.getHeaderItem(1);

  const {
    dragOffsetX,
    dragOffsetY,
  } = await getDragCoordinates(item.element, 'left');
  await t.drag(item.element, dragOffsetX, dragOffsetY);

  await a11yCheck(t, a11yCheckConfig);
}).before(async () => {
  await insertStylesheetRulesToPage(PARENT_STYLES);
  await MouseUpEvents.disable(MouseAction.dragToOffset);
  await createWidget('dxCardView', {
    columns: ['Field A', 'Field B', 'Field C'],
    allowColumnReordering: true,
    width: 360,
  });
}).after(async () => {
  await MouseUpEvents.enable(MouseAction.dragToOffset);
});

test('sortable indicator during dragging to middle place', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const headerPanel = cardView.getHeaderPanel();
  const item = headerPanel.getHeaderItem(0);

  const {
    dragOffsetX,
    dragOffsetY,
  } = await getDragCoordinates(item.element, 'right');
  await t.drag(item.element, dragOffsetX, dragOffsetY);

  await a11yCheck(t, a11yCheckConfig);
}).before(async () => {
  await insertStylesheetRulesToPage(PARENT_STYLES);
  await MouseUpEvents.disable(MouseAction.dragToOffset);
  await createWidget('dxCardView', {
    columns: ['Field A', 'Field B', 'Field C'],
    allowColumnReordering: true,
    width: 360,
  });
}).after(async () => {
  await MouseUpEvents.enable(MouseAction.dragToOffset);
});

test('sortable indicator during dragging to last place', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const headerPanel = cardView.getHeaderPanel();
  const item = headerPanel.getHeaderItem(1);

  const {
    dragOffsetX,
    dragOffsetY,
  } = await getDragCoordinates(item.element, 'right');
  await t.drag(item.element, dragOffsetX, dragOffsetY);

  await a11yCheck(t, a11yCheckConfig);
}).before(async () => {
  await insertStylesheetRulesToPage(PARENT_STYLES);
  await MouseUpEvents.disable(MouseAction.dragToOffset);
  await createWidget('dxCardView', {
    columns: ['Field A', 'Field B', 'Field C'],
    allowColumnReordering: true,
    width: 360,
  });
}).after(async () => {
  await MouseUpEvents.enable(MouseAction.dragToOffset);
});
