const $ = require('../../core/renderer');
const Callbacks = require('../../core/utils/callbacks');
const translator = require('../../animation/translator');
const NativeStrategy = require('./ui.scrollable.native');
const LoadIndicator = require('../load_indicator');
const each = require('../../core/utils/iterator').each;
const browser = require('../../core/utils/browser');
const Deferred = require('../../core/utils/deferred').Deferred;

const SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = 'dx-scrollview-pull-down-loading';
const SCROLLVIEW_PULLDOWN_READY_CLASS = 'dx-scrollview-pull-down-ready';
const SCROLLVIEW_PULLDOWN_IMAGE_CLASS = 'dx-scrollview-pull-down-image';
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = 'dx-scrollview-pull-down-indicator';
const SCROLLVIEW_PULLDOWN_TEXT_CLASS = 'dx-scrollview-pull-down-text';
const SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS = 'dx-scrollview-pull-down-text-visible';

const STATE_RELEASED = 0;
const STATE_READY = 1;
const STATE_REFRESHING = 2;
const STATE_LOADING = 3;
const PULLDOWN_RELEASE_TIME = 400;

const PullDownNativeScrollViewStrategy = NativeStrategy.inherit({

    _init: function(scrollView) {
        this.callBase(scrollView);
        this._$topPocket = scrollView._$topPocket;
        this._$pullDown = scrollView._$pullDown;
        this._$bottomPocket = scrollView._$bottomPocket;
        this._$refreshingText = scrollView._$refreshingText;
        this._$scrollViewContent = $(scrollView.content());

        this._initCallbacks();
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
        const $image = $('<div>').addClass(SCROLLVIEW_PULLDOWN_IMAGE_CLASS);
        const $loadContainer = $('<div>').addClass(SCROLLVIEW_PULLDOWN_INDICATOR_CLASS);
        const $loadIndicator = new LoadIndicator($('<div>')).$element();
        const $text = this._$pullDownText = $('<div>').addClass(SCROLLVIEW_PULLDOWN_TEXT_CLASS);

        this._$pullingDownText = $('<div>').text(this.option('pullingDownText')).appendTo($text);
        this._$pulledDownText = $('<div>').text(this.option('pulledDownText')).appendTo($text);
        this._$refreshingText = $('<div>').text(this.option('refreshingText')).appendTo($text);

        this._$pullDown
            .empty()
            .append($image)
            .append($loadContainer.append($loadIndicator))
            .append($text);
    },

    _releaseState: function() {
        this._state = STATE_RELEASED;
        this._refreshPullDownText();
    },

    _pushBackFromBoundary: function() {
        if(!this._isLocked() && !this._component.isEmpty()) {
            this.callBase();
        }
    },

    _refreshPullDownText: function() {
        const that = this;
        const pullDownTextItems = [{
            element: this._$pullingDownText,
            visibleState: STATE_RELEASED
        }, {
            element: this._$pulledDownText,
            visibleState: STATE_READY
        }, {
            element: this._$refreshingText,
            visibleState: STATE_REFRESHING
        }];

        each(pullDownTextItems, function(_, item) {
            const action = that._state === item.visibleState ? 'addClass' : 'removeClass';
            item.element[action](SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS);
        });
    },

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

    _allowedDirections: function() {
        const allowedDirections = this.callBase();
        allowedDirections.vertical = allowedDirections.vertical || this._pullDownEnabled;
        return allowedDirections;
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
        translator.move(this._$topPocket, { top: offset });
        translator.move(this._$scrollViewContent, { top: offset });
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
        if(browser.msie) {
            return this._reachBottomEnabled && this._location - (this._scrollOffset + this._bottomPocketSize) <= 0.1;
        } else {
            return this._reachBottomEnabled && this._location <= this._scrollOffset + this._bottomPocketSize;
        }
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

module.exports = PullDownNativeScrollViewStrategy;
