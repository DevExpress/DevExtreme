import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

type EmulatedTouchType = 'mousePressed' | 'mouseMoved' | 'mouseReleased';

const PAGE_URL = url(__dirname, '../../container.html');
const GESTURE_THRESHOLD_PX = 10;
const FIRST_MOVE_BELOW_GESTURE_THRESHOLD_PX = 9;
const NEXT_MOVE_PX = 15;
const NEXT_MOVE_COUNT = 10;
const FINGER_TRAVEL_PX = FIRST_MOVE_BELOW_GESTURE_THRESHOLD_PX + NEXT_MOVE_PX * NEXT_MOVE_COUNT;
const FINGER_OFFSET_FROM_EDGE_PX = 40;
const UP = -1;
const DOWN = 1;
const ONLY_FIRST_MOVE_CANCELABLE = [true, ...Array<boolean>(NEXT_MOVE_COUNT).fill(false)];

fixture`ScrollView_touchSwipe`
  .page(PAGE_URL);

const waitForTwoFrames = ClientFunction(() => new Promise<void>((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
}));

const touch = async (
  devTools: CDPSession,
  type: EmulatedTouchType,
  x: number,
  y: number,
): Promise<void> => {
  await devTools.Input.emulateTouchFromMouseEvent({
    type, x, y, button: 'left', clickCount: 1,
  });
  await waitForTwoFrames();
};

const collectBrowserErrors = async (devTools: CDPSession): Promise<string[]> => {
  const browserErrors: string[] = [];

  devTools.Log.on('entryAdded', ({ entry }) => {
    if (entry.level === 'error') {
      browserErrors.push(entry.text);
    }
  });
  await devTools.Log.enable();

  return browserErrors;
};

const openPageWithTouchSupport = async (t: TestController): Promise<void> => {
  const devTools = await t.getCurrentCDPSession();

  await devTools.Emulation.setTouchEmulationEnabled({ enabled: true, maxTouchPoints: 1 });
  await t.navigateTo(PAGE_URL);
  await appendElementTo('#container', 'div', 'scrollView');
  await appendElementTo('#scrollView', 'div', 'scrollViewContent', { height: '2000px' });
};

const restoreMouseInput = async (t: TestController): Promise<void> => {
  const devTools = await t.getCurrentCDPSession();

  await devTools.Log.disable();
  await devTools.Emulation.setEmitTouchEventsForMouse({ enabled: false });
  await devTools.Emulation.setTouchEmulationEnabled({ enabled: false });
  await t.navigateTo(PAGE_URL);
};

const recordTouchMoveCancelable = ClientFunction(() => {
  (window as any).touchMoveCancelable = [];
  window.addEventListener('touchmove', (event) => {
    (window as any).touchMoveCancelable.push(event.cancelable);
  }, { passive: true });
});

const getTouchMoveCancelable = ClientFunction(() => (window as any).touchMoveCancelable);

const getTouchMoveCount = ClientFunction(() => (window as any).touchMoveCancelable.length);

const getScrollTop = ClientFunction(() => (window as any).widget.scrollTop());

const getPullDownCount = ClientFunction(() => (window as any).pullDownCount);

const pressFinger = async (
  devTools: CDPSession,
  direction: number,
): Promise<{ x: number; y: number }> => {
  const box = await Selector('#scrollView').boundingClientRect;

  await devTools.Emulation.setEmitTouchEventsForMouse({ enabled: true, configuration: 'mobile' });

  const x = Math.round(box.left + box.width / 2);
  const y = Math.round(direction === UP
    ? box.bottom - FINGER_OFFSET_FROM_EDGE_PX
    : box.top + FINGER_OFFSET_FROM_EDGE_PX);

  await touch(devTools, 'mousePressed', x, y);

  return { x, y };
};

const moveFingerTo = async (
  t: TestController,
  devTools: CDPSession,
  x: number,
  y: number,
  touchMoveCount: number,
): Promise<void> => {
  await touch(devTools, 'mouseMoved', x, y);
  await t.expect(getTouchMoveCount()).eql(touchMoveCount);
};

const moveFinger = async (
  t: TestController,
  devTools: CDPSession,
  x: number,
  startY: number,
  direction: number,
): Promise<number> => {
  let y = startY + direction * FIRST_MOVE_BELOW_GESTURE_THRESHOLD_PX;
  let touchMoveCount = 1;

  await moveFingerTo(t, devTools, x, y, touchMoveCount);

  for (let i = 0; i < NEXT_MOVE_COUNT; i += 1) {
    y += direction * NEXT_MOVE_PX;
    touchMoveCount += 1;
    await moveFingerTo(t, devTools, x, y, touchMoveCount);
  }

  return y;
};

test('Swiping a ScrollView by touch does not cancel touchmove events that the browser made uncancelable (T1337899)', async (t) => {
  const devTools = await t.getCurrentCDPSession();
  const browserErrors = await collectBrowserErrors(devTools);

  await recordTouchMoveCancelable();

  const { x, y: startY } = await pressFinger(devTools, UP);
  const endY = await moveFinger(t, devTools, x, startY, UP);
  const scrollTopUnderFinger = await getScrollTop();

  await touch(devTools, 'mouseReleased', x, endY);

  await t
    .expect(await getTouchMoveCancelable())
    .eql(ONLY_FIRST_MOVE_CANCELABLE)
    .expect(scrollTopUnderFinger)
    .eql(FINGER_TRAVEL_PX - GESTURE_THRESHOLD_PX)
    .expect(browserErrors)
    .eql([]);
}).before(async (t) => {
  await openPageWithTouchSupport(t);

  return createWidget('dxScrollView', {
    height: 400,
    useNative: false,
  }, '#scrollView');
}).after(restoreMouseInput);

test('Pulling a native ScrollView down to refresh by touch does not cancel touchmove events that the browser made uncancelable (T1337899)', async (t) => {
  const devTools = await t.getCurrentCDPSession();
  const browserErrors = await collectBrowserErrors(devTools);

  await recordTouchMoveCancelable();

  const { x, y: startY } = await pressFinger(devTools, DOWN);
  const endY = await moveFinger(t, devTools, x, startY, DOWN);

  await touch(devTools, 'mouseReleased', x, endY);

  await t
    .expect(await getTouchMoveCancelable())
    .eql(ONLY_FIRST_MOVE_CANCELABLE)
    .expect(getPullDownCount())
    .eql(1)
    .expect(browserErrors)
    .eql([]);
}).before(async (t) => {
  await openPageWithTouchSupport(t);

  return createWidget('dxScrollView', () => ({
    height: 400,
    useNative: true,
    refreshStrategy: 'swipeDown',
    onPullDown: ({ component }) => {
      (window as any).pullDownCount = ((window as any).pullDownCount ?? 0) + 1;
      component.release();
    },
  }), '#scrollView');
}).after(restoreMouseInput);
