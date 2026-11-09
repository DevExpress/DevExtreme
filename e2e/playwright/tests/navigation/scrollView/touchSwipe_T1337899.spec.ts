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

test('Swiping a ScrollView by touch does not cancel touchmove events that the browser made uncancelable (T1337899)', async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await appendElementTo(page, '#container', 'div', 'scrollView');
  await appendElementTo(page, '#scrollView', 'div', 'scrollViewContent', { height: '2000px' });
  await createWidget(page, 'dxScrollView', {
    height: SCROLL_VIEW_HEIGHT,
    useNative: false,
  }, '#scrollView');

  await page.evaluate(() => {
    (window as any).touchMoveCancelable = [];
    window.addEventListener('touchmove', (event) => {
      (window as any).touchMoveCancelable.push(event.cancelable);
    }, { passive: true });
  });

  const box = await page.locator('#scrollView').boundingBox();

  if (!box) {
    throw new Error('#scrollView has no box to swipe in');
  }

  const devTools = await page.context().newCDPSession(page);

  await devTools.send('Emulation.setEmitTouchEventsForMouse', { enabled: true, configuration: 'mobile' });

  const x = Math.round(box.x + box.width / 2);
  let y = Math.round(box.y + box.height - 40);

  await touch(page, devTools, 'mousePressed', x, y);

  y -= FIRST_MOVE_BELOW_GESTURE_THRESHOLD_PX;
  await touch(page, devTools, 'mouseMoved', x, y);

  for (let i = 0; i < NEXT_MOVE_COUNT; i += 1) {
    y -= NEXT_MOVE_PX;
    await touch(page, devTools, 'mouseMoved', x, y);
  }

  const scrollTopUnderFinger = await page.evaluate(() => (window as any).widget.scrollTop());

  await touch(page, devTools, 'mouseReleased', x, y);

  expect(await page.evaluate(() => (window as any).touchMoveCancelable))
    .toEqual([true, ...Array<boolean>(NEXT_MOVE_COUNT).fill(false)]);
  expect(scrollTopUnderFinger).toBe(FINGER_TRAVEL_PX - GESTURE_THRESHOLD_PX);
  expect(consoleErrors).toEqual([]);
});
