import { getOuterHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import Callbacks from '../../core/utils/callbacks';
import { move } from '../../animation/translator';
import { eventData } from '../../events/utils/index';
import NativeStrategy from './ui.scrollable.native';
import LoadIndicator from '../load_indicator';
import { Deferred } from '../../core/utils/deferred';

const SCROLLVIEW_PULLDOWN_DOWN_LOADING_CLASS = 'dx-scrollview-pull-down-loading';
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = 'dx-scrollview-pull-down-indicator';
const SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = 'dx-scrollview-pull-down-refreshing';
const PULLDOWN_ICON_CLASS = 'dx-icon-pulldown';

const STATE_RELEASED = 0;
const STATE_READY = 1;
const STATE_REFRESHING = 2;
const STATE_TOUCHED = 4;
const STATE_PULLED = 5;

const SwipeDownNativeScrollViewStrategy = NativeStrategy.inherit({

    _init: function(scrollView) {
        this.callBase(scrollView);
        this._$topPocket = scrollView._$topPocket;
        this._$pullDown = scrollView._$pullDown;
        this._$scrollViewContent = $(scrollView.content());
        this._$container = $(scrollView.container());
        this._initCallbacks();

        this._location = 0;
    },

    _initCallbacks: function() {
        this.pullDownCallbacks = Callbacks();
        this.releaseCallbacks = Callbacks();
        this.reachBottomCallbacks = Callbacks();
    },

    render: function() {
        this.callBase();
        this._renderPullDown();
        this._releaseState();
    },

    _renderPullDown: function() {
        const $loadContainer = $('<div>').addClass(SCROLLVIEW_PULLDOWN_INDICATOR_CLASS);
        const $loadIndicator = new LoadIndicator($('<div>')).$element();

        this._$icon = $('<div>')
            .addClass(PULLDOWN_ICON_CLASS);

        this._$pullDown
            .empty()
            .append(this._$icon)
            .append($loadContainer.append($loadIndicator));
    },

    _releaseState: function() {
        this._state = STATE_RELEASED;
        this._releasePullDown();
        this._updateDimensions();
    },

    _releasePullDown: function() {
        this._$pullDown.css({
            opacity: 0
        });
    },

    _updateDimensions: function() {
        this.callBase();
        this._topPocketSize = this._$topPocket.get(0).clientHeight;

        const contentEl = this._$scrollViewContent.get(0);
        const containerEl = this._$container.get(0);
        this._bottomBoundary = Math.max(contentEl.clientHeight - containerEl.clientHeight, 0);
    },

    _allowedDirections: function() {
        const allowedDirections = this.callBase();
        allowedDirections.vertical = allowedDirections.vertical || this._pullDownEnabled;
        return allowedDirections;
    },

    handleInit: function(e) {
        this.callBase(e);

        if(this._state === STATE_RELEASED && this._location === 0) {
            this._startClientY = eventData(e.originalEvent).y;
            this._state = STATE_TOUCHED;
        }
    },

    handleMove: function(e) {
        this.callBase(e);
        this._deltaY = eventData(e.originalEvent).y - this._startClientY;

        if(this._state === STATE_TOUCHED) {
            if(this._pullDownEnabled && this._deltaY > 0) {
                this._state = STATE_PULLED;
            } else {
                this._complete();
            }
        }

        if(this._state === STATE_PULLED) {
            e.preventDefault();
            this._movePullDown();
        }
    },

    _movePullDown: function() {
        const pullDownHeight = this._getPullDownHeight();
        const top = Math.min(pullDownHeight * 3, this._deltaY + this._getPullDownStartPosition());
        const angle = 180 * top / pullDownHeight / 3;

        this._$pullDown
            .css({
                opacity: 1
            })
            .toggleClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS, top < pullDownHeight);

        move(this._$pullDown, { top: top });

        this._$icon.css({
            transform: 'rotate(' + angle + 'deg)'
        });
    },

    _isPullDown: function() {
        return this._pullDownEnabled && this._state === STATE_PULLED && this._deltaY >= this._getPullDownHeight() - this._getPullDownStartPosition();
    },

    _getPullDownHeight: function() {
        return Math.round(getOuterHeight(this._$element) * 0.05);
    },

    _getPullDownStartPosition: function() {
        return -Math.round(getOuterHeight(this._$pullDown) * 1.5);
    },

    handleEnd: function() {
        if(this._isPullDown()) {
            this._pullDownRefreshing();
        }

        this._complete();
    },

    handleStop: function() {
        this._complete();
    },

    _complete: function() {
        if(this._state === STATE_TOUCHED || this._state === STATE_PULLED) {
            this._releaseState();
        }
    },

    handleScroll: function(e) {
        this.callBase(e);

        // TODO: replace with disabled check
        if(this._state === STATE_REFRESHING) {
            return;
        }

        const currentLocation = this.location().top;
        const scrollDelta = this._location - currentLocation;

        this._location = currentLocation;

        if(scrollDelta > 0 && this._isReachBottom()) {
            this._reachBottom();
        } else {
            this._stateReleased();
        }
    },

    _isReachBottom: function() {
        return this._reachBottomEnabled && Math.round(this._bottomBoundary + Math.floor(this._location)) <= 1;
    },

    _reachBottom: function() {
        this.reachBottomCallbacks.fire();
    },

    _stateReleased: function() {
        if(this._state === STATE_RELEASED) {
            return;
        }

        this._$pullDown.removeClass(SCROLLVIEW_PULLDOWN_DOWN_LOADING_CLASS);
        this._releaseState();
    },

    _pullDownRefreshing: function() {
        this._state = STATE_REFRESHING;
        this._pullDownRefreshHandler();
    },

    _pullDownRefreshHandler: function() {
        this._refreshPullDown();
        this.pullDownCallbacks.fire();
    },

    _refreshPullDown: function() {
        this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_DOWN_LOADING_CLASS);
        move(this._$pullDown, { top: this._getPullDownHeight() });
    },

    pullDownEnable: function(enabled) {
        this._$topPocket.toggle(enabled);
        this._pullDownEnabled = enabled;
    },

    reachBottomEnable: function(enabled) {
        this._reachBottomEnabled = enabled;
    },

    pendingRelease: function() {
        this._state = STATE_READY;
    },

    release: function() {
        const deferred = new Deferred();

        this._updateDimensions();
        clearTimeout(this._releaseTimeout);
        this._releaseTimeout = setTimeout((function() {
            this._stateReleased();
            this.releaseCallbacks.fire();
            this._updateAction();
            deferred.resolve();
        }).bind(this), 800);

        return deferred.promise();
    },

    dispose: function() {
        clearTimeout(this._pullDownRefreshTimeout);
        clearTimeout(this._releaseTimeout);
        this.callBase();
    }
});

export default SwipeDownNativeScrollViewStrategy;
