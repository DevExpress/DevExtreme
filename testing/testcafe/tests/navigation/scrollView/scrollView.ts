import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import ScrollView from '../../../model/scrollView/scrollView';
import { appendElementTo } from '../../../helpers/domUtils';
import { ScrollableDirection } from '../../../../../js/renovation/ui/scroll_view/common/types';

fixture`ScrollView`
  .page(url(__dirname, '../../container.html'));

[150, 300].forEach((scrollableContentSize) => {
  (['vertical', 'horizontal'] as ScrollableDirection[]).forEach((direction) => {
    ['onHover', 'always', 'onScroll', 'never'].forEach((showScrollbar) => {
      const scrollableContainerSize = 200;
      const scrollBarVisibleAfterMouseEnter = (showScrollbar === 'always' || showScrollbar === 'onHover') && scrollableContentSize > scrollableContainerSize;
      const scrollBarVisibleAfterMouseLeave = showScrollbar === 'always' && scrollableContentSize > scrollableContainerSize;

      test(`Scroll visibility on mouseEnter/mouseLeave, showScrollbar: '${showScrollbar}', direction: '${direction}', content ${scrollableContentSize < scrollableContainerSize ? 'less' : 'more'} than container (T817096)`, async (t) => {
        const scrollView = new ScrollView('#scrollView', { direction });

        await t.expect(scrollView.scrollbar.isScrollVisible()).eql(scrollBarVisibleAfterMouseLeave);
        await t.hover(scrollView.getContainer());
        await t.expect(scrollView.scrollbar.isScrollVisible()).eql(scrollBarVisibleAfterMouseEnter);
        await t.click(Selector('body'));
        await t.expect(scrollView.scrollbar.isScrollVisible()).eql(scrollBarVisibleAfterMouseLeave);
      }).before(async () => {
        await appendElementTo('#container', 'div', 'scrollView');
        await appendElementTo('#scrollView', 'div', 'innerScrollViewContent', {
          width: `${scrollableContentSize}px`, height: `${scrollableContentSize}px`, backgroundColor: 'steelblue',
        });

        return createWidget('dxScrollView', {
          width: scrollableContainerSize,
          height: scrollableContainerSize,
          useNative: false,
          direction,
          showScrollbar,
        }, '#scrollView');
      });
    });
  });
});
