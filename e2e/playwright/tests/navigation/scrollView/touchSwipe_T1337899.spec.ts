import type { CDPSession, Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

type EmulatedTouchType = 'mousePressed' | 'mouseMoved' | 'mouseReleased';

const SCROLL_VIEW_HEIGHT = 400;
const GESTURE_THRESHOLD_PX = 10;
const FIRST_MOVE_BELOW_GESTURE_THRESHOLD_PX = 9;
const NEXT_MOVE_PX = 15;
const NEXT_MOVE_COUNT = 10;
const FINGER_TRAVEL_PX = FIRST_MOVE_BELOW_GESTURE_THRESHOLD_PX + NEXT_MOVE_PX * NEXT_MOVE_COUNT;
const FINGER_OFFSET_FROM_EDGE_PX = 40;
const UP = -1;
const DOWN = 1;
const ONLY_FIRST_MOVE_CANCELABLE = [true, ...Array<boolean>(NEXT_MOVE_COUNT).fill(false)];

test.use({ hasTouch: true });

const waitForTwoFrames = async (page: Page): Promise<void> => page.evaluate(
  () => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }),
);

const touch = async (
  page: Page,
  devTools: CDPSession,
  type: EmulatedTouchType,
  x: number,
  y: number,
): Promise<void> => {
  await devTools.send('Input.emulateTouchFromMouseEvent', {
    type, x, y, button: 'left', clickCount: 1,
  });
  await waitForTwoFrames(page);
};

const collectConsoleErrors = (page: Page): string[] => {
  const consoleErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  return consoleErrors;
};

const appendScrollViewElement = async (page: Page): Promise<void> => {
  await appendElementTo(page, '#container', 'div', 'scrollView');
  await appendElementTo(page, '#scrollView', 'div', 'scrollViewContent', { height: '2000px' });
};

const recordTouchMoveCancelable = async (page: Page): Promise<void> => page.evaluate(() => {
  (window as any).touchMoveCancelable = [];
  window.addEventListener('touchmove', (event) => {
    (window as any).touchMoveCancelable.push(event.cancelable);
  }, { passive: true });
});

const getTouchMoveCancelable = async (page: Page): Promise<boolean[]> => page.evaluate(
  () => (window as any).touchMoveCancelable,
);

const pressFinger = async (
  page: Page,
  direction: number,
): Promise<{ devTools: CDPSession; x: number; y: number }> => {
  const box = await page.locator('#scrollView').boundingBox();

  if (!box) {
    throw new Error('#scrollView has no box to swipe in');
  }

  const devTools = await page.context().newCDPSession(page);

  await devTools.send('Emulation.setEmitTouchEventsForMouse', { enabled: true, configuration: 'mobile' });

  const x = Math.round(box.x + box.width / 2);
  const y = Math.round(direction === UP
    ? box.y + box.height - FINGER_OFFSET_FROM_EDGE_PX
    : box.y + FINGER_OFFSET_FROM_EDGE_PX);

  await touch(page, devTools, 'mousePressed', x, y);

  return { devTools, x, y };
};

const moveFinger = async (
  page: Page,
  devTools: CDPSession,
  x: number,
  startY: number,
  direction: number,
): Promise<number> => {
  let y = startY + direction * FIRST_MOVE_BELOW_GESTURE_THRESHOLD_PX;

  await touch(page, devTools, 'mouseMoved', x, y);

  for (let i = 0; i < NEXT_MOVE_COUNT; i += 1) {
    y += direction * NEXT_MOVE_PX;
    await touch(page, devTools, 'mouseMoved', x, y);
  }

  return y;
};

test('Swiping a ScrollView by touch does not cancel touchmove events that the browser made uncancelable (T1337899)', async ({ page }) => {
  const consoleErrors = collectConsoleErrors(page);

  await appendScrollViewElement(page);
  await createWidget(page, 'dxScrollView', {
    height: SCROLL_VIEW_HEIGHT,
    useNative: false,
  }, '#scrollView');
  await recordTouchMoveCancelable(page);

  const { devTools, x, y: startY } = await pressFinger(page, UP);
  const endY = await moveFinger(page, devTools, x, startY, UP);
  const scrollTopUnderFinger = await page.evaluate(() => (window as any).widget.scrollTop());

  await touch(page, devTools, 'mouseReleased', x, endY);

  expect(await getTouchMoveCancelable(page)).toEqual(ONLY_FIRST_MOVE_CANCELABLE);
  expect(scrollTopUnderFinger).toBe(FINGER_TRAVEL_PX - GESTURE_THRESHOLD_PX);
  expect(consoleErrors).toEqual([]);
});

test('Pulling a native ScrollView down to refresh by touch does not cancel touchmove events that the browser made uncancelable (T1337899)', async ({ page }) => {
  const consoleErrors = collectConsoleErrors(page);

  await appendScrollViewElement(page);
  await createWidget(page, 'dxScrollView', (height: number) => ({
    height,
    useNative: true,
    refreshStrategy: 'swipeDown',
    onPullDown: ({ component }) => {
      (window as any).pullDownCount = ((window as any).pullDownCount ?? 0) + 1;
      component.release();
    },
  }), '#scrollView', { arg: SCROLL_VIEW_HEIGHT });
  await recordTouchMoveCancelable(page);

  const { devTools, x, y: startY } = await pressFinger(page, DOWN);
  const endY = await moveFinger(page, devTools, x, startY, DOWN);

  await touch(page, devTools, 'mouseReleased', x, endY);

  expect(await getTouchMoveCancelable(page)).toEqual(ONLY_FIRST_MOVE_CANCELABLE);
  expect(await page.evaluate(() => (window as any).pullDownCount)).toBe(1);
  expect(consoleErrors).toEqual([]);
});
