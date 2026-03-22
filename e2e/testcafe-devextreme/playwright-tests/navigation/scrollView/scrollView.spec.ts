import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ScrollView', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  type ScrollableDirection = 'both' | 'horizontal' | 'vertical';

  [150, 300].forEach((scrollableContentSize) => {
    (['vertical', 'horizontal'] as ScrollableDirection[]).forEach((direction) => {
      ['onHover', 'always', 'onScroll', 'never'].forEach((showScrollbar) => {
        const scrollableContainerSize = 200;
        const scrollBarVisibleAfterMouseEnter = (showScrollbar === 'always' || showScrollbar === 'onHover') && scrollableContentSize > scrollableContainerSize;
        const scrollBarVisibleAfterMouseLeave = showScrollbar === 'always' && scrollableContentSize > scrollableContainerSize;

        test(`Scroll visibility on mouseEnter/mouseLeave, showScrollbar: '${showScrollbar}', direction: '${direction}', content ${scrollableContentSize < scrollableContainerSize ? 'less' : 'more'} than container (T817096)`, async ({ page }) => {

          await appendElementTo(page, '#container', 'div', 'scrollView');
          await appendElementTo(page, '#scrollView', 'div', 'innerScrollViewContent', {
            width: `${scrollableContentSize}px`, height: `${scrollableContentSize}px`, backgroundColor: 'steelblue',
          });

          await createWidget(page, 'dxScrollView', {
            width: scrollableContainerSize,
            height: scrollableContainerSize,
            useNative: false,
            direction,
            showScrollbar,
          }, '#scrollView');


          const scrollView = new ScrollView('#scrollView', { direction });

          await expect(scrollView.scrollbar.isScrollVisible()).eql(scrollBarVisibleAfterMouseLeave);
          await hover(scrollView.getContainer());
          await expect(scrollView.scrollbar.isScrollVisible()).eql(scrollBarVisibleAfterMouseEnter);
          await page.locator('body').click();
          await expect(scrollView.scrollbar.isScrollVisible()).eql(scrollBarVisibleAfterMouseLeave);

    });
      });
    });
  });
});
