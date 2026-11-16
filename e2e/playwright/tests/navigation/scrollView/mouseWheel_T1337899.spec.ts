import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

const SCROLL_VIEW_HEIGHT = 400;
const WHEEL_STEP_PX = 100;
const WHEEL_STEP_COUNT = 3;

test('Scrolling a ScrollView by mouse wheel leaves the page in place (T1337899)', async ({ page }) => {
  await appendElementTo(page, '#container', 'div', 'scrollView');
  await appendElementTo(page, '#scrollView', 'div', 'scrollViewContent', { height: '2000px' });
  await appendElementTo(page, '#otherContainer', 'div', 'pageContent', { height: '3000px' });
  await createWidget(page, 'dxScrollView', {
    height: SCROLL_VIEW_HEIGHT,
    useNative: false,
  }, '#scrollView');

  await page.locator('#scrollView').hover();

  for (let i = 0; i < WHEEL_STEP_COUNT; i += 1) {
    await page.mouse.wheel(0, WHEEL_STEP_PX);
  }

  await expect.poll(() => page.evaluate(() => ({
    scrollViewTop: (window as any).widget.scrollTop(),
    pageTop: window.scrollY,
  }))).toEqual({
    scrollViewTop: WHEEL_STEP_PX * WHEEL_STEP_COUNT,
    pageTop: 0,
  });
});
