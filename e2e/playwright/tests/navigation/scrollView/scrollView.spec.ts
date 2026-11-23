import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import ScrollView from '../../../models/scrollView';
import type { ScrollableDirection } from '../../../models/scrollable';

test.describe('ScrollView', () => {
  [150, 300].forEach((scrollableContentSize) => {
    (['vertical', 'horizontal'] as ScrollableDirection[]).forEach((direction) => {
      (['onHover', 'always', 'onScroll', 'never'] as const).forEach((showScrollbar) => {
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

          const scrollView = new ScrollView(page, '#scrollView', { direction });

          await scrollView.scrollbar.expectScrollVisible(scrollBarVisibleAfterMouseLeave);
          await scrollView.getContainer().hover();
          await scrollView.scrollbar.expectScrollVisible(scrollBarVisibleAfterMouseEnter);
          await page.locator('body').click();
          await scrollView.scrollbar.expectScrollVisible(scrollBarVisibleAfterMouseLeave);
        });
      });
    });
  });
});
