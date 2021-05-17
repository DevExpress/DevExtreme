const RenovatedScrollView = require('renovation/ui/scroll_view/scroll_view.j.js');
// eslint-disable-next-line spellcheck/spell-checker
const reRender = require('inferno').rerender;

// default export not supported
exports.WrappedWidget = class WrappedWidget extends RenovatedScrollView {

    _initMarkup() {
        super._initMarkup.apply(this, arguments);

        const scrollable = this._viewRef.current.scrollableRef.current.scrollableRef;

        if(this.option('useNative')) {
            const setPocketState = scrollable.setPocketState;

            scrollable.setPocketState = function() {
                setPocketState.apply(this, arguments);
                reRender();
            };
        }

        let vScrollbar;
        let hScrollbar;

        if(this.option('useNative')) {
            vScrollbar = scrollable.vScrollbarRef.current;
            hScrollbar = scrollable.hScrollbarRef.current;
        } else {
            const animatedVScrollbar = scrollable.vScrollbarRef.current;
            const animatedHScrollbar = scrollable.hScrollbarRef.current;

            vScrollbar = animatedVScrollbar?.scrollbarRef?.current;
            hScrollbar = animatedHScrollbar?.scrollbarRef?.current;
        }

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

    scrollBy() {
        super.scrollBy.apply(this, arguments);
        reRender();
    }

    update() {
        return super.update.apply(this, arguments);
    }
};

