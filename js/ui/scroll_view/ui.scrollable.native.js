import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import * as eventUtils from '../../events/utils';
import { noop } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import devices from '../../core/devices';
import Class from '../../core/class';
import Scrollbar from './ui.scrollbar';

const SCROLLABLE_NATIVE = 'dxNativeScrollable';
const SCROLLABLE_NATIVE_CLASS = 'dx-scrollable-native';
const SCROLLABLE_SCROLLBAR_SIMULATED = 'dx-scrollable-scrollbar-simulated';
const SCROLLABLE_SCROLLBARS_HIDDEN = 'dx-scrollable-scrollbars-hidden';

const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';

const HIDE_SCROLLBAR_TIMEOUT = 500;


var NativeStrategy = Class.inherit({

    ctor: function(scrollable) {
        this._init(scrollable);
    },

    _init: function(scrollable) {
        this._component = scrollable;
        this._$element = scrollable.$element();
        this._$container = scrollable._$container;
        this._$content = scrollable._$content;

        this._direction = scrollable.option('direction');
        this._useSimulatedScrollbar = scrollable.option('useSimulatedScrollbar');
        this._showScrollbar = scrollable.option('showScrollbar');

        this.option = scrollable.option.bind(scrollable);
        this._createActionByOption = scrollable._createActionByOption.bind(scrollable);
        this._isLocked = scrollable._isLocked.bind(scrollable);
        this._isDirection = scrollable._isDirection.bind(scrollable);
        this._allowedDirection = scrollable._allowedDirection.bind(scrollable);
    },

    render: function() {
        this._renderPushBackOffset();
        var device = devices.real(),
            deviceType = device.platform;

        this._$element
            .addClass(SCROLLABLE_NATIVE_CLASS)
            .addClass(SCROLLABLE_NATIVE_CLASS + '-' + deviceType)
            .toggleClass(SCROLLABLE_SCROLLBARS_HIDDEN, !this._showScrollbar);

        if(this._showScrollbar && this._useSimulatedScrollbar) {
            this._renderScrollbars();
        }
    },

    updateBounds: noop,

    _renderPushBackOffset: function() {
        var pushBackValue = this.option('pushBackValue');
        if(!pushBackValue && !this._component._lastPushBackValue) {
            return;
        }

        this._$content.css({
            paddingTop: pushBackValue,
            paddingBottom: pushBackValue
        });
        this._component._lastPushBackValue = pushBackValue;
    },

    _renderScrollbars: function() {
        this._scrollbars = {};
        this._hideScrollbarTimeout = 0;

        this._$element.addClass(SCROLLABLE_SCROLLBAR_SIMULATED);

        this._renderScrollbar(VERTICAL);
        this._renderScrollbar(HORIZONTAL);
    },

    _renderScrollbar: function(direction) {
        if(!this._isDirection(direction)) {
            return;
        }

        this._scrollbars[direction] = new Scrollbar($('<div>').appendTo(this._$element), {
            direction: direction,
            expandable: this._component.option('scrollByThumb')
        });
    },

    handleInit: noop,
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
    handleCancel: noop,
    handleStop: noop,

    _eachScrollbar: function(callback) {
        callback = callback.bind(this);
        each(this._scrollbars || {}, function(direction, scrollbar) {
            callback(scrollbar, direction);
        });
    },

    createActions: function() {
        this._scrollAction = this._createActionByOption('onScroll');
        this._updateAction = this._createActionByOption('onUpdated');
    },

    _createActionArgs: function() {
        const location = this.location();
        const containerElement = this._$container.get(0);

        return {
            event: this._eventForUserAction,
            scrollOffset: {
                top: -location.top,
                left: -location.left
            },
            reachedLeft: this._isDirection(HORIZONTAL) ? location.left >= 0 : undefined,
            reachedRight: this._isDirection(HORIZONTAL) ? Math.abs(location.left) >= containerElement.scrollWidth - containerElement.clientWidth : undefined,
            reachedTop: this._isDirection(VERTICAL) ? location.top >= 0 : undefined,
            reachedBottom: this._isDirection(VERTICAL) ? Math.abs(location.top) >= containerElement.scrollHeight - containerElement.clientHeight - 2 * this.option('pushBackValue') : undefined
        };
    },

    handleScroll: function(e) {
        // NOTE: ignoring scroll events when scroll location was not changed (for Android browser - B250122)
        if(!this._isScrollLocationChanged()) {
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
        var pushBackValue = this.option('pushBackValue');
        if(!pushBackValue || this._disablePushBack) {
            return;
        }

        var scrollOffset = this._containerSize.height - this._contentSize.height,
            scrollTopPos = this._$container.scrollTop(),
            scrollBottomPos = scrollOffset + scrollTopPos - pushBackValue * 2;

        if(!scrollTopPos) {
            this._$container.scrollTop(pushBackValue);
        } else if(!scrollBottomPos) {
            this._$container.scrollTop(pushBackValue - scrollOffset);
        }
    },

    _isScrollLocationChanged: function() {
        var currentLocation = this.location(),
            lastLocation = this._lastLocation || {},
            isTopChanged = lastLocation.top !== currentLocation.top,
            isLeftChanged = lastLocation.left !== currentLocation.left;

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
            var dimension = direction === VERTICAL ? 'height' : 'width';
            scrollbar.option({
                containerSize: this._containerSize[dimension],
                contentSize: this._componentContentSize[dimension]
            });
            scrollbar.update();
        });
    },

    _allowedDirections: function() {
        return {
            vertical: this._isDirection(VERTICAL) && this._contentSize.height > this._containerSize.height,
            horizontal: this._isDirection(HORIZONTAL) && this._contentSize.width > this._containerSize.width
        };
    },

    dispose: function() {
        var className = this._$element.get(0).className;
        var scrollableNativeRegexp = new RegExp(SCROLLABLE_NATIVE_CLASS + '\\S*', 'g');

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

    scrollBy: function(distance) {
        var location = this.location();
        this._$container.scrollTop(Math.round(-location.top - distance.top + this.option('pushBackValue')));
        this._$container.scrollLeft(Math.round(-location.left - distance.left));
    },

    validate: function(e) {
        if(this.option('disabled')) {
            return false;
        }

        if(eventUtils.isDxMouseWheelEvent(e) && this._isScrolledInMaxDirection(e)) {
            return false;
        }

        return !!this._allowedDirection();
    },

    // TODO: rtl
    // TODO: horizontal scroll when shift is pressed
    _isScrolledInMaxDirection(e) {
        let container = this._$container.get(0);
        let result;

        if(e.delta > 0) {
            result = e.shiftKey ? !container.scrollLeft : !container.scrollTop;
        } else {
            if(e.shiftKey) {
                result = (container.clientWidth + container.scrollLeft) >= container.scrollWidth;
            } else {
                result = (container.clientHeight + container.scrollTop) >= container.scrollHeight;
            }
        }

        return result;
    },

    getDirection: function() {
        return this._allowedDirection();
    },

    verticalOffset: function() {
        return this.option('pushBackValue');
    }
});

module.exports = NativeStrategy;
