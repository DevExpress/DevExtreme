const RenovatedScrollable = require('renovation/ui/scroll_view/scrollable.j.js');
// eslint-disable-next-line spellcheck/spell-checker
const reRender = require('inferno').rerender;

// default export not supported
exports.WrappedWidget = class WrappedWidget extends RenovatedScrollable {

    _initMarkup() {
        super._initMarkup.apply(this, arguments);

        const scrollable = this._viewRef.current.scrollableRef;

        const setContainerDimensions = scrollable.setContainerDimensions;

        scrollable.setContainerDimensions = function() {
            setContainerDimensions.apply(this, arguments);
            reRender();
        };

        const setContentDimensions = scrollable.setContentDimensions;

        scrollable.setContentDimensions = function() {
            setContentDimensions.apply(this, arguments);
            reRender();
        };

        const handleScroll = scrollable.handleScroll;

        scrollable.handleScroll = function() {
            reRender();
            handleScroll.apply(this, arguments);
        };

        // const syncScrollLocation = scrollable.syncScrollLocation;

        // scrollable.syncScrollLocation = function() {
        //     reRender();
        //     syncScrollLocation.apply(this, arguments);
        // };

        // let vScrollbar;
        // let hScrollbar;

        // if(this.option('useNative')) {
        const vScrollbar = scrollable.vScrollbarRef.current;
        const hScrollbar = scrollable.hScrollbarRef.current;
        // } else {
        //     const animatedVScrollbar = scrollable.vScrollbarRef.current;
        //     const animatedHScrollbar = scrollable.hScrollbarRef.current;

        //     vScrollbar = animatedVScrollbar?.scrollbarRef?.current;
        //     hScrollbar = animatedHScrollbar?.scrollbarRef?.current;
        // }

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
