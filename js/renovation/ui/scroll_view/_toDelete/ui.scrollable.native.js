import eventsEngine from '../../events/core/events_engine';
import { noop } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import Class from '../../core/class';

const SCROLLABLE_NATIVE = 'dxNativeScrollable';
const SCROLLABLE_NATIVE_CLASS = 'dx-scrollable-native';

const VERTICAL = 'vertical';

const HIDE_SCROLLBAR_TIMEOUT = 500;

const NativeStrategy = Class.inherit({

    ctor: function(scrollable) {
        this._init(scrollable);
    },

    _init: function(scrollable) {
        this._component = scrollable;
        this._$element = scrollable.$element();
        this._$container = scrollable._$container;
        this._$content = scrollable._$content;

        this.option = scrollable.option.bind(scrollable);
        this._createActionByOption = scrollable._createActionByOption.bind(scrollable);
        this._isLocked = scrollable._isLocked.bind(scrollable);
        this._isDirection = scrollable._isDirection.bind(scrollable);
        this._getScrollOffset = scrollable._getScrollOffset.bind(scrollable);
        this._getMaxOffset = scrollable._getMaxOffset.bind(scrollable);
    },

    updateBounds: noop,

    _renderScrollbars: function() {
        this._scrollbars = {};
        this._hideScrollbarTimeout = 0;
    },

    // handleInit: noop,
    handleStart: function() {
        this._disablePushBack = true;
    },

    handleMove: function(e) {
        if(this._isLocked()) {
            e.cancel = true;
            return;
        }

        if(this._allowedDirection()) {
            e.originalEvent.isScrollingEvent = true;
        }
    },

    handleEnd: function() {
        this._disablePushBack = false;
    },
    // handleCancel: noop,
    // handleStop: noop,

    _eachScrollbar: function(callback) {
        callback = callback.bind(this);
        each(this._scrollbars || {}, function(direction, scrollbar) {
            callback(scrollbar, direction);
        });
    },

    handleScroll: function(e) {
        this._component._updateRtlConfig();
        if(!this._isScrollLocationChanged()) {
            // NOTE: ignoring scroll events when scroll location was not changed (for Android browser - B250122)
            e.stopImmediatePropagation();
            return;
        }

        this._eventForUserAction = e;
        this._moveScrollbars();
        this._scrollAction(this._createActionArgs());
        this._lastLocation = this.location();
        this._pushBackFromBoundary();
    },

    _pushBackFromBoundary: function() {
        const pushBackValue = this.option('pushBackValue');
        if(!pushBackValue || this._disablePushBack) {
            return;
        }

        const scrollOffset = this._containerSize.height - this._contentSize.height;
        const scrollTopPos = this._$container.scrollTop();
        const scrollBottomPos = scrollOffset + scrollTopPos - pushBackValue * 2;

        if(!scrollTopPos) {
            this._$container.scrollTop(pushBackValue);
        } else if(!scrollBottomPos) {
            this._$container.scrollTop(pushBackValue - scrollOffset);
        }
    },

    _isScrollLocationChanged: function() {
        const currentLocation = this.location();
        const lastLocation = this._lastLocation || {};
        const isTopChanged = lastLocation.top !== currentLocation.top;
        const isLeftChanged = lastLocation.left !== currentLocation.left;

        return isTopChanged || isLeftChanged;
    },

    _moveScrollbars: function() {
        this._eachScrollbar(function(scrollbar) {
            scrollbar.moveTo(this.location());
            scrollbar.option('visible', true);
        });

        this._hideScrollbars();
    },

    _hideScrollbars: function() {
        clearTimeout(this._hideScrollbarTimeout);

        this._hideScrollbarTimeout = setTimeout((function() {
            this._eachScrollbar(function(scrollbar) {
                scrollbar.option('visible', false);
            });
        }).bind(this), HIDE_SCROLLBAR_TIMEOUT);
    },

    location: function() {
        return {
            left: -this._$container.scrollLeft(),
            top: this.option('pushBackValue') - this._$container.scrollTop()
        };
    },

    disabledChanged: noop,

    update: function() {
        this._update();
        this._updateAction(this._createActionArgs());
    },

    _update: function() {
        this._updateDimensions();
        this._updateScrollbars();
    },

    _updateDimensions: function() {
        this._containerSize = {
            height: this._$container.height(),
            width: this._$container.width()
        };
        this._componentContentSize = {
            height: this._component.$content().height(),
            width: this._component.$content().width()
        };
        this._contentSize = {
            height: this._$content.height(),
            width: this._$content.width()
        };

        this._pushBackFromBoundary();
    },

    _updateScrollbars: function() {
        this._eachScrollbar(function(scrollbar, direction) {
            const dimension = direction === VERTICAL ? 'height' : 'width';
            scrollbar.option({
                containerSize: this._containerSize[dimension],
                contentSize: this._componentContentSize[dimension]
            });
            scrollbar.update();
        });
    },

    dispose: function() {
        const className = this._$element.get(0).className;
        const scrollableNativeRegexp = new RegExp(SCROLLABLE_NATIVE_CLASS + '\\S*', 'g');

        if(scrollableNativeRegexp.test(className)) {
            this._$element.removeClass(className.match(scrollableNativeRegexp).join(' '));
        }

        eventsEngine.off(this._$element, '.' + SCROLLABLE_NATIVE);
        eventsEngine.off(this._$container, '.' + SCROLLABLE_NATIVE);
        this._removeScrollbars();
        clearTimeout(this._hideScrollbarTimeout);
    },

    _removeScrollbars: function() {
        this._eachScrollbar(function(scrollbar) {
            scrollbar.$element().remove();
        });
    },

    // scrollBy: function(distance) {
    //     const location = this.location();
    //    this._$container.scrollTop(Math.round(-location.top - distance.top + this.option('pushBackValue')));
    //     this._$container.scrollLeft(Math.round(-location.left - distance.left));
    // },

    verticalOffset: function() {
        return this.option('pushBackValue');
    }
});

export default NativeStrategy;
