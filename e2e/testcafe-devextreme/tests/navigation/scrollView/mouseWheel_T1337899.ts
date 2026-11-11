import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

const WHEEL_STEP_PX = 100;
const WHEEL_STEP_COUNT = 3;

fixture.disablePageReloads`ScrollView_mouseWheel`
  .page(url(__dirname, '../../container.html'));

const getScrollPositions = ClientFunction(() => ({
  scrollViewTop: (window as any).widget.scrollTop(),
  pageTop: window.scrollY,
}));

test('Scrolling a ScrollView by mouse wheel leaves the page in place (T1337899)', async (t) => {
  const devTools = await t.getCurrentCDPSession();
  const box = await Selector('#scrollView').boundingClientRect;
  const x = Math.round(box.left + box.width / 2);
  const y = Math.round(box.top + box.height / 2);

  await t.hover('#scrollView');

  for (let i = 0; i < WHEEL_STEP_COUNT; i += 1) {
    await devTools.Input.dispatchMouseEvent({
      type: 'mouseWheel', x, y, deltaX: 0, deltaY: WHEEL_STEP_PX,
    });
  }

  await t
    .expect(getScrollPositions())
    .eql({
      scrollViewTop: WHEEL_STEP_PX * WHEEL_STEP_COUNT,
      pageTop: 0,
    });
}).before(async () => {
  await appendElementTo('#container', 'div', 'scrollView');
  await appendElementTo('#scrollView', 'div', 'scrollViewContent', { height: '2000px' });
  await appendElementTo('#otherContainer', 'div', 'pageContent', { height: '3000px' });

  return createWidget('dxScrollView', {
    height: 400,
    useNative: false,
  }, '#scrollView');
});
