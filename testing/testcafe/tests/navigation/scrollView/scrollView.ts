import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import ScrollView from '../../../model/scrollView/scrollView';
import { appendElementTo } from '../helpers/domUtils';
import { ScrollableDirection } from '../../../../../js/renovation/ui/scroll_view/common/types';

fixture.disablePageReloads`ScrollView`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

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
        await t.click(Selector('#mouseLeaveButton'));
        await t.expect(scrollView.scrollbar.isScrollVisible()).eql(scrollBarVisibleAfterMouseLeave);
      }).before(async () => {
        await appendElementTo('#container', 'div', 'scrollView');
        await appendElementTo('#scrollView', 'div', 'innerScrollViewContent', {
          width: `${scrollableContentSize}px`, height: `${scrollableContentSize}px`, backgroundColor: 'steelblue',
        });
        await appendElementTo('#scrollView', 'button', 'mouseLeaveButton', {
          width: '150px', height: '50px', backgroundColor: 'grey',
        });

        return createWidget('dxScrollView', {
          width: scrollableContainerSize,
          height: scrollableContainerSize,
          useNative: false,
          direction,
          showScrollbar,
        }, true, '#scrollView');
      });
    });
  });
});
