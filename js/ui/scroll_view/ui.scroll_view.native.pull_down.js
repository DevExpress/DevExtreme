"use strict";

var $ = require("jquery"),
    translator = require("../../animation/translator"),
    NativeStrategy = require("./ui.scrollable.native"),
    LoadIndicator = require("../load_indicator");

var SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = "dx-scrollview-pull-down-loading",
    SCROLLVIEW_PULLDOWN_READY_CLASS = "dx-scrollview-pull-down-ready",
    SCROLLVIEW_PULLDOWN_IMAGE_CLASS = "dx-scrollview-pull-down-image",
    SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = "dx-scrollview-pull-down-indicator",
    SCROLLVIEW_PULLDOWN_TEXT_CLASS = "dx-scrollview-pull-down-text",

    STATE_RELEASED = 0,
    STATE_READY = 1,
    STATE_REFRESHING = 2,
    STATE_LOADING = 3,
    PULLDOWN_RELEASE_TIME = 400;


var PullDownNativeScrollViewStrategy = NativeStrategy.inherit({

    _init: function(scrollView) {
        this.callBase(scrollView);
        this._$topPocket = scrollView._$topPocket;
        this._$pullDown = scrollView._$pullDown;
        this._$bottomPocket = scrollView._$bottomPocket;
        this._$refreshingText = scrollView._$refreshingText;
        this._$scrollViewContent = scrollView.content();

        this._initCallbacks();
    },

    _initCallbacks: function() {
        this.pullDownCallbacks = $.Callbacks();
        this.releaseCallbacks = $.Callbacks();
        this.reachBottomCallbacks = $.Callbacks();
    },

    render: function() {
        this.callBase();
        this._renderPullDown();
        this._releaseState();
    },

    _renderPullDown: function() {
        var $image = $("<div>").addClass(SCROLLVIEW_PULLDOWN_IMAGE_CLASS),
            $loadContainer = $("<div>").addClass(SCROLLVIEW_PULLDOWN_INDICATOR_CLASS),
            $loadIndicator = new LoadIndicator($("<div>")).element(),
            $text = this._$pullDownText = $("<div>").addClass(SCROLLVIEW_PULLDOWN_TEXT_CLASS);

        this._$pullingDownText = $("<div>").text(this.option("pullingDownText")).appendTo($text);
        this._$pulledDownText = $("<div>").text(this.option("pulledDownText")).appendTo($text);
        this._$refreshingText = $("<div>").text(this.option("refreshingText")).appendTo($text);

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
        this._$pullingDownText.css("opacity", this._state === STATE_RELEASED ? 1 : 0);
        this._$pulledDownText.css("opacity", this._state === STATE_READY ? 1 : 0);
        this._$refreshingText.css("opacity", this._state === STATE_REFRESHING ? 1 : 0);
    },

    update: function() {
        this.callBase();
        this._setTopPocketOffset();
    },

    _updateDimensions: function() {
        this.callBase();
        this._topPocketSize = this._$topPocket.height();
        this._bottomPocketSize = this._$bottomPocket.height();
        this._scrollOffset = this._$container.height() - this._$content.height();
    },

    _allowedDirections: function() {
        var allowedDirections = this.callBase();
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
            this._pullDownRefreshTimeout = setTimeout($.proxy(function() {
                this._pullDownRefreshing();
            }, this), 400);
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

        this._location = this.location().top;

        if(this._isPullDown()) {
            this._pullDownReady();
        } else if(this._isReachBottom()) {
            this._reachBottom();
        } else {
            this._stateReleased();
        }
    },

    _isPullDown: function() {
        return this._pullDownEnabled && this._location >= this._topPocketSize;
    },

    _isReachBottom: function() {
        return this._reachBottomEnabled && this._location <= this._scrollOffset + this._bottomPocketSize;
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
        var deferred = $.Deferred();

        this._updateDimensions();
        clearTimeout(this._releaseTimeout);

        if(this._state === STATE_LOADING) {
            this._state = STATE_RELEASED;
        }

        this._releaseTimeout = setTimeout($.proxy(function() {
            this._setPullDownOffset(0);
            this._stateReleased();
            this.releaseCallbacks.fire();
            this._updateAction();
            deferred.resolve();
        }, this), PULLDOWN_RELEASE_TIME);

        return deferred.promise();
    },

    dispose: function() {
        clearTimeout(this._pullDownRefreshTimeout);
        clearTimeout(this._releaseTimeout);
        this.callBase();
    }
});

module.exports = PullDownNativeScrollViewStrategy;
