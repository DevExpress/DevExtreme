import { move } from '../../animation/translator';
import NativeStrategy from './ui.scrollable.native';
import browser from '../../core/utils/browser';
import { Deferred } from '../../core/utils/deferred';

const SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = 'dx-scrollview-pull-down-loading';
const SCROLLVIEW_PULLDOWN_READY_CLASS = 'dx-scrollview-pull-down-ready';

const STATE_RELEASED = 0;
const STATE_READY = 1;
const STATE_REFRESHING = 2;
const STATE_LOADING = 3;
const PULLDOWN_RELEASE_TIME = 400;

const PullDownNativeScrollViewStrategy = NativeStrategy.inherit({
    update: function() {
        this.callBase();
        this._setTopPocketOffset();
    },

    _updateDimensions: function() {
        this.callBase();
        this._topPocketSize = this._$topPocket.height();
        this._bottomPocketSize = this._$bottomPocket.height();

        if(browser.msie) {
            this._scrollOffset = Math.round((this._$container.height() - this._$content.height()) * 100) / 100;
        } else {
            this._scrollOffset = this._$container.height() - this._$content.height();
        }
    },

    _setTopPocketOffset: function() {
        this._$topPocket.css({
            top: -this._topPocketSize
        });
    },

    handleEnd: function() {
        this.callBase();
        this._complete();
    },

    handleStop: function() {
        this.callBase();
        this._complete();
    },

    _complete: function() {
        if(this._state === STATE_READY) {
            this._setPullDownOffset(this._topPocketSize);
            clearTimeout(this._pullDownRefreshTimeout);
            this._pullDownRefreshTimeout = setTimeout((function() {
                this._pullDownRefreshing();
            }).bind(this), 400);
        }
    },

    _setPullDownOffset: function(offset) {
        move(this._$topPocket, { top: offset });
        move(this._$scrollViewContent, { top: offset });
    },

    handleScroll: function(e) {
        this.callBase(e);

        // TODO: replace with disabled check
        if(this._state === STATE_REFRESHING) {
            return;
        }

        const currentLocation = this.location().top;
        const scrollDelta = (this._location || 0) - currentLocation;

        this._location = currentLocation;

        if(this._isPullDown()) {
            this._pullDownReady();
        } else if(scrollDelta > 0 && this._isReachBottom()) {
            this._reachBottom();
        } else {
            this._stateReleased();
        }
    },

    _isPullDown: function() {
        return this._pullDownEnabled && this._location >= this._topPocketSize;
    },

    _isReachBottom: function() {
        return this._reachBottomEnabled && this._location - (this._scrollOffset + this._bottomPocketSize) <= 0.5; // T858013
    },

    _reachBottom: function() {
        if(this._state === STATE_LOADING) {
            return;
        }
        this._state = STATE_LOADING;
        this.reachBottomCallbacks.fire();
    },

    _pullDownReady: function() {
        if(this._state === STATE_READY) {
            return;
        }
        this._state = STATE_READY;
        this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
        this._refreshPullDownText();
    },

    _stateReleased: function() {
        if(this._state === STATE_RELEASED) {
            return;
        }

        this._$pullDown
            .removeClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS)
            .removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);

        this._releaseState();
    },

    _pullDownRefreshing: function() {
        if(this._state === STATE_REFRESHING) {
            return;
        }
        this._state = STATE_REFRESHING;

        this._$pullDown
            .addClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS)
            .removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);

        this._refreshPullDownText();
        this.pullDownCallbacks.fire();
    },

    pullDownEnable: function(enabled) {
        if(enabled) {
            this._updateDimensions();
            this._setTopPocketOffset();
        }
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

        if(this._state === STATE_LOADING) {
            this._state = STATE_RELEASED;
        }

        this._releaseTimeout = setTimeout((function() {
            this._setPullDownOffset(0);
            this._stateReleased();
            this.releaseCallbacks.fire();
            this._updateAction();
            deferred.resolve();
        }).bind(this), PULLDOWN_RELEASE_TIME);

        return deferred.promise();
    },

    dispose: function() {
        clearTimeout(this._pullDownRefreshTimeout);
        clearTimeout(this._releaseTimeout);
        this.callBase();
    }
});

export default PullDownNativeScrollViewStrategy;
