import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import { Selector } from 'testcafe';
import ScrollView from '../../model/scrollView';
import { appendElementTo } from './helpers/domUtils';

fixture `ContextMenu`
    .page(url(__dirname, '../container.html'));

// T817096
[150, 300].forEach((scrollableContentSize) => {
    ["vertical", "horizontal"].forEach((direction) => {
        ["onHover", "always", "onScroll", "never"].forEach((showScrollbar) => {
            const scrollableContainerSize = 200;
            const scrollBarVisibleAfterMouseEnter = (showScrollbar === "always" || showScrollbar === "onHover") && scrollableContentSize > scrollableContainerSize;
            const scrollBarVisibleAfterMouseLeave = showScrollbar === "always" && scrollableContentSize > scrollableContainerSize;

            test(`Scroll visibility on mouseEnter/mouseLeave, showScrollbar: '${showScrollbar}', direction: '${direction}', content ${scrollableContentSize < scrollableContainerSize ? 'less' : 'more'} than container`, async t => {
                const scrollView = new ScrollView('#scrollView', direction);
                
                await appendElementTo("body", "button", { id: "mouseLeaveButton", width: 150, height: 50, backgroundColor: 'grey' });

                await t.expect(scrollView.scrollbar.isScrollVisible()).eql(scrollBarVisibleAfterMouseLeave)
                await t.hover(scrollView.getScrollViewContainer())
                await t.expect(scrollView.scrollbar.isScrollVisible()).eql(scrollBarVisibleAfterMouseEnter)
                await t.click(Selector("#mouseLeaveButton"))
                await t.expect(scrollView.scrollbar.isScrollVisible()).eql(scrollBarVisibleAfterMouseLeave)

            }).before(async t => {
                await appendElementTo("#container", "div", { id: "innerScrollViewContent", width: scrollableContentSize, height: scrollableContentSize, backgroundColor: 'steelblue' });
                
                return createWidget("dxScrollView", {
                    width: scrollableContainerSize,
                    height: scrollableContainerSize,
                    useNative: false,
                    direction: direction,
                    showScrollbar: showScrollbar
                });
            });
        });
    });
});
