import type { Locator, Page } from '@playwright/test';
import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { getThemeName } from '../../../helpers/themeUtils';
import CardView from '../../../models/cardView';

const PARENT_CONTAINER = '#parentContainer';
const PARENT_STYLES = `${PARENT_CONTAINER} { width: 400px; padding: 0 20px; }`;
const CARD_VIEW_SELECTOR = '#container';
const DRAG_MOVE_X_COEFFICIENT = 1.5;
const DRAG_MOVE_Y_COEFFICIENT = 1;

const getA11yCheckConfig = (theme: string) => ({
  rules: {
    ...(getThemeName(theme) === 'fluent-next' ? {} : { 'color-contrast': { enabled: false } }),
    // NOTE: Draggable template is outside the role="main" landmark
    region: { enabled: false },
  },
});

// NOTE: Main idea of these offsets -> drag header item elements
// on the "coefficient * size" distance from an initial position
// to trigger the dxSortable indicator
const getDragCoordinates = async (
  element: Locator,
  direction: 'left' | 'right',
): Promise<{ dragOffsetX: number; dragOffsetY: number }> => {
  const itemWidth = await element.evaluate((node: HTMLElement) => node.offsetWidth);
  const itemHeight = await element.evaluate((node: HTMLElement) => node.offsetWidth);

  const dragDirectionX = direction === 'left' ? -1 : 1;
  const dragOffsetX = Math
    .round(dragDirectionX * DRAG_MOVE_X_COEFFICIENT * itemWidth);
  const dragOffsetY = Math
    .round(DRAG_MOVE_Y_COEFFICIENT * itemHeight);

  return { dragOffsetX, dragOffsetY };
};

// The TestCafe test disabled the mouseup of its drag action, so the item stays dragged.
const dragWithoutDrop = async (
  page: Page,
  element: Locator,
  offsetX: number,
  offsetY: number,
): Promise<void> => {
  const box = await element.boundingBox();

  if (!box) {
    throw new Error('The dragged element is not visible');
  }

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + offsetX, startY + offsetY, { steps: 10 });
};

const createCardView = async (page: Page): Promise<void> => {
  await insertStylesheetRulesToPage(page, PARENT_STYLES);
  await createWidget(page, 'dxCardView', {
    columns: ['Field A', 'Field B', 'Field C'],
    allowColumnReordering: true,
    width: 360,
  });
};

test('sortable indicator during dragging to first place', async ({ page, theme }) => {
  await createCardView(page);

  const cardView = new CardView(page, CARD_VIEW_SELECTOR);

  const headerPanel = cardView.getHeaderPanel();
  const item = headerPanel.getHeaderItem(1);

  const {
    dragOffsetX,
    dragOffsetY,
  } = await getDragCoordinates(item.element, 'left');
  await dragWithoutDrop(page, item.element, dragOffsetX, dragOffsetY);

  await a11yCheck(page, getA11yCheckConfig(theme));
});

test('sortable indicator during dragging to middle place', async ({ page, theme }) => {
  await createCardView(page);

  const cardView = new CardView(page, CARD_VIEW_SELECTOR);

  const headerPanel = cardView.getHeaderPanel();
  const item = headerPanel.getHeaderItem(0);

  const {
    dragOffsetX,
    dragOffsetY,
  } = await getDragCoordinates(item.element, 'right');
  await dragWithoutDrop(page, item.element, dragOffsetX, dragOffsetY);

  await a11yCheck(page, getA11yCheckConfig(theme));
});

test('sortable indicator during dragging to last place', async ({ page, theme }) => {
  await createCardView(page);

  const cardView = new CardView(page, CARD_VIEW_SELECTOR);

  const headerPanel = cardView.getHeaderPanel();
  const item = headerPanel.getHeaderItem(1);

  const {
    dragOffsetX,
    dragOffsetY,
  } = await getDragCoordinates(item.element, 'right');
  await dragWithoutDrop(page, item.element, dragOffsetX, dragOffsetY);

  await a11yCheck(page, getA11yCheckConfig(theme));
});
