const RenovatedScrollView = require('renovation/ui/scroll_view/scroll_view.j.js');
// eslint-disable-next-line spellcheck/spell-checker
const reRender = require('inferno').rerender;
const Deferred = require('core/utils/deferred').Deferred;

exports.WrappedWidget = class WrappedWidget extends RenovatedScrollView {

    _initMarkup() {
        super._initMarkup.apply(this, arguments);

        const scrollable = this._viewRef.current.scrollableRef.current.scrollableRef;
        const handleScroll = scrollable.handleScroll;

        scrollable.handleScroll = function() {
            reRender();
            handleScroll.apply(this, arguments);
        };

        if(this.option('useNative')) {
            const setPocketState = scrollable.setPocketState;

            scrollable.setPocketState = function() {
                setPocketState.apply(this, arguments);
                reRender();
            };
        }

        const vScrollbar = scrollable.vScrollbarRef.current;
        const hScrollbar = scrollable.hScrollbarRef.current;

        if(vScrollbar) {
            const moveTo = vScrollbar.moveTo;

            vScrollbar.moveTo = function() {
                moveTo.apply(this, arguments);
                reRender();
            };
        }

        if(hScrollbar) {
            const moveTo = hScrollbar.moveTo;

            hScrollbar.moveTo = function() {
                moveTo.apply(this, arguments);
                reRender();
            };
        }
    }

    startLoading() {
        this._viewRef.current.scrollableRef.current.scrollableRef.startLoading();
        reRender();
    }

    finishLoading() {
        this._viewRef.current.scrollableRef.current.scrollableRef.finishLoading();
        reRender();
    }

    toggleLoading() {
        this._viewRef.current.toggleLoading.apply(this, arguments);
        reRender();
    }

    scrollTo() {
        super.scrollTo.apply(this, arguments);
        reRender();
    }

    scrollToElement() {
        super.scrollToElement.apply(this, arguments);
        reRender();
    }

    scrollBy() {
        super.scrollBy.apply(this, arguments);
        reRender();
    }

    release() {
        super.release.apply(this, arguments);

        return new Deferred().resolve();
    }
};
