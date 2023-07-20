const RenovatedScrollable = require('renovation/ui/scroll_view/scrollable.j.js');
// eslint-disable-next-line spellcheck/spell-checker
const reRender = require('inferno').rerender;

exports.WrappedWidget = class WrappedWidget extends RenovatedScrollable {

    _initMarkup() {
        super._initMarkup.apply(this, arguments);

        const scrollable = this._viewRef.current.scrollableRef;
        const handleScroll = scrollable.handleScroll;

        scrollable.handleScroll = function() {
            reRender();
            handleScroll.apply(this, arguments);
        };

        const vScrollbar = scrollable.vScrollbarRef.current;
        const hScrollbar = scrollable.hScrollbarRef.current;

        if(vScrollbar) {
            const moveTo = vScrollbar.moveTo;

            vScrollbar.moveTo = function(location) {
                moveTo(location);
                reRender();
            };
        }

        if(hScrollbar) {
            const moveTo = hScrollbar.moveTo;

            hScrollbar.moveTo = function(location) {
                moveTo(location);
                reRender();
            };
        }
    }

    _lock() {
        this._viewRef.current.scrollableRef.locked = true;
    }

    _validate(e) {
        return this._viewRef.current.validate(e);
    }

    scrollTo() {
        super.scrollTo.apply(this, arguments);
        reRender();
    }

    scrollBy() {
        super.scrollBy.apply(this, arguments);
        reRender();
    }

    scrollToElement() {
        super.scrollToElement.apply(this, arguments);
        reRender();
    }
};
