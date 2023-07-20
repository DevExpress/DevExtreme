import { getHeight, getWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { isDxMouseWheelEvent } from '../../events/utils/index';
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


const NativeStrategy = Class.inherit({

    ctor: function(scrollable) {
        this._init(scrollable);
    },

    _init: function(scrollable) {
        this._component = scrollable;
        this._$element = scrollable.$element();
        this._$container = $(scrollable.container());
        this._$content = scrollable.$content();

        this._direction = scrollable.option('direction');
        this._useSimulatedScrollbar = scrollable.option('useSimulatedScrollbar');

        this.option = scrollable.option.bind(scrollable);
        this._createActionByOption = scrollable._createActionByOption.bind(scrollable);
        this._isLocked = scrollable._isLocked.bind(scrollable);
        this._isDirection = scrollable._isDirection.bind(scrollable);
        this._allowedDirection = scrollable._allowedDirection.bind(scrollable);
        this._getMaxOffset = scrollable._getMaxOffset.bind(scrollable);
        this._isRtlNativeStrategy = scrollable._isRtlNativeStrategy.bind(scrollable);
    },

    render: function() {
        const device = devices.real();
        const deviceType = device.platform;

        this._$element
            .addClass(SCROLLABLE_NATIVE_CLASS)
            .addClass(SCROLLABLE_NATIVE_CLASS + '-' + deviceType)
            .toggleClass(SCROLLABLE_SCROLLBARS_HIDDEN, !this._isScrollbarVisible());

        if(this._isScrollbarVisible() && this._useSimulatedScrollbar) {
            this._renderScrollbars();
        }
    },

    updateRtlPosition: function(isFirstRender) {
        if(isFirstRender && this.option('rtlEnabled')) {
            if(this._isScrollbarVisible() && this._useSimulatedScrollbar) {
                this._moveScrollbars();
            }
        }
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
    handleStart: noop,

    handleMove: function(e) {
        if(this._isLocked()) {
            e.cancel = true;
            return;
        }

        if(this._allowedDirection()) {
            e.originalEvent.isScrollingEvent = true;
        }
    },

    handleEnd: noop,
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
        const { left, top } = this.location();

        return {
            event: this._eventForUserAction,
            scrollOffset: this._getScrollOffset(),
            reachedLeft: this._isRtlNativeStrategy() ? this._isReachedRight(-left) : this._isReachedLeft(left),
            reachedRight: this._isRtlNativeStrategy() ? this._isReachedLeft(-Math.abs(left)) : this._isReachedRight(left),
            reachedTop: this._isDirection(VERTICAL) ? Math.round(top) >= 0 : undefined,
            reachedBottom: this._isDirection(VERTICAL) ? Math.round(Math.abs(top) - this._getMaxOffset().top) >= 0 : undefined
        };
    },

    _getScrollOffset: function() {
        const { top, left } = this.location();

        return {
            top: -top,
            left: this._normalizeOffsetLeft(-left)
        };
    },

    _normalizeOffsetLeft(scrollLeft) {
        if(this._isRtlNativeStrategy()) {
            return this._getMaxOffset().left + scrollLeft;
        }

        return scrollLeft;
    },

    _isReachedLeft: function(left) {
        return this._isDirection(HORIZONTAL) ? Math.round(left) >= 0 : undefined;
    },

    _isReachedRight: function(left) {
        return this._isDirection(HORIZONTAL) ? Math.round(Math.abs(left) - this._getMaxOffset().left) >= 0 : undefined;
    },

    _isScrollbarVisible: function() {
        const { showScrollbar } = this.option();

        return showScrollbar !== 'never' && showScrollbar !== false;
    },

    handleScroll: function(e) {
        this._eventForUserAction = e;
        this._moveScrollbars();
        this._scrollAction(this._createActionArgs());
    },

    _moveScrollbars: function() {
        const { top, left } = this._getScrollOffset();

        this._eachScrollbar(function(scrollbar) {
            scrollbar.moveTo({ top: -top, left: -left });
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
            top: -this._$container.scrollTop()
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
            height: getHeight(this._$container),
            width: getWidth(this._$container)
        };
        this._componentContentSize = {
            height: getHeight(this._component.$content()),
            width: getWidth(this._component.$content())
        };
        this._contentSize = {
            height: getHeight(this._$content),
            width: getWidth(this._$content)
        };
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

    _allowedDirections: function() {
        return {
            vertical: this._isDirection(VERTICAL) && this._contentSize.height > this._containerSize.height,
            horizontal: this._isDirection(HORIZONTAL) && this._contentSize.width > this._containerSize.width
        };
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

    scrollBy: function(distance) {
        const location = this.location();
        this._$container.scrollTop(Math.round(-location.top - distance.top));
        this._$container.scrollLeft(Math.round(-location.left - distance.left));
    },

    validate: function(e) {
        if(this.option('disabled')) {
            return false;
        }

        if(isDxMouseWheelEvent(e) && this._isScrolledInMaxDirection(e)) {
            return false;
        }

        return !!this._allowedDirection();
    },

    // TODO: rtl
    // TODO: horizontal scroll when shift is pressed
    _isScrolledInMaxDirection(e) {
        const container = this._$container.get(0);
        let result;

        if(e.delta > 0) {
            result = e.shiftKey ? !container.scrollLeft : !container.scrollTop;
        } else {
            if(e.shiftKey) {
                result = container.scrollLeft >= this._getMaxOffset().left;
            } else {
                result = container.scrollTop >= this._getMaxOffset().top;
            }
        }

        return result;
    },

    getDirection: function() {
        return this._allowedDirection();
    },
});

export default NativeStrategy;
