import $ from '../../core/renderer';
import { hasWindow } from '../../core/utils/window';
import registerComponent from '../../core/component_registrator';
import { getPublicElement } from '../../core/element';
import { noop } from '../../core/utils/common';
import PullDownStrategy from './ui.scroll_view.native.pull_down';
import SwipeDownStrategy from './ui.scroll_view.native.swipe_down';
import SimulatedStrategy from './ui.scroll_view.simulated';
import Scrollable from './ui.scrollable';

const refreshStrategies = {
    pullDown: PullDownStrategy,
    swipeDown: SwipeDownStrategy,
    simulated: SimulatedStrategy
};

const isServerSide = !hasWindow();

const scrollViewServerConfig = {
    finishLoading: noop,
    release: noop,
    refresh: noop,
    _optionChanged: function(args) {
        if(args.name !== 'onUpdated') {
            return this.callBase.apply(this, arguments);
        }
    }
};

const ScrollView = Scrollable.inherit(isServerSide ? scrollViewServerConfig : {
    _init: function() {
        this.callBase();
    },

    _createStrategy: function() {
        const strategyName = this.option('useNative') ? this.option('refreshStrategy') : 'simulated';
        // eslint-disable-next-line no-undef
        const strategyClass = refreshStrategies[strategyName];
        if(!strategyClass) {
            throw Error('E1030', this.option('refreshStrategy'));
        }

        this._strategy = new strategyClass(this);
        this._strategy.pullDownCallbacks.add(this._pullDownHandler.bind(this));
        this._strategy.releaseCallbacks.add(this._releaseHandler.bind(this));
        this._strategy.reachBottomCallbacks.add(this._reachBottomHandler.bind(this));
    },

    // _createActions: function() {
    //     this.callBase();
    //     this._tryRefreshPocketState();
    // },

    on: function(eventName) {
        const result = this.callBase.apply(this, arguments);

        if(eventName === 'pullDown' || eventName === 'reachBottom') {
            this._tryRefreshPocketState();
        }

        return result;
    },

    // _pullDownEnable: function(enabled) {
    //     if(arguments.length === 0) {
    //         return this._pullDownEnabled;
    //     }

    //     if(this._$pullDown && this._strategy) {
    //         this._$pullDown.toggle(enabled);
    //         this._strategy.pullDownEnable(enabled);
    //         this._pullDownEnabled = enabled;
    //     }
    // },

    // _reachBottomEnable: function(enabled) {
    //     if(arguments.length === 0) {
    //         return this._reachBottomEnabled;
    //     }

    //     if(this._$reachBottom && this._strategy) {
    //         this._$reachBottom.toggle(enabled);
    //         this._strategy.reachBottomEnable(enabled);
    //         this._reachBottomEnabled = enabled;
    //     }
    // },

    // _pullDownHandler: function() {
    //     this._loadingIndicator(false);
    //     this._pullDownLoading();
    // },

    // _loadingIndicator: function(value) {
    //     if(arguments.length < 1) {
    //         return this._loadingIndicatorEnabled;
    //     }
    //     this._loadingIndicatorEnabled = value;
    // },

    // _pullDownLoading: function() {
    //     this.startLoading();
    //     this._pullDownAction();
    // },

    // _reachBottomHandler: function() {
    //     this._loadingIndicator(false);
    //     this._reachBottomLoading();
    // },

    // _reachBottomLoading: function() {
    //     this.startLoading();
    //     this._reachBottomAction();
    // },

    // _releaseHandler: function() {
    //     this.finishLoading();
    //     this._loadingIndicator(true);
    // },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'onPullDown':
            case 'onReachBottom':
                this._createActions();
                break;
            case 'pullingDownText':
            case 'pulledDownText':
            case 'refreshingText':
            case 'refreshStrategy':
                this._invalidate();
                break;
            case 'reachBottomText':
                this._updateReachBottomText();
                break;
            default:
                this.callBase(args);
        }
    },

    content: function() {
        return getPublicElement(this._$content.children().eq(1));
    },

    release: function(preventReachBottom) {
        if(preventReachBottom !== undefined) {
            this.toggleLoading(!preventReachBottom);
        }
        return this._strategy.release();
    },

    /**
    * @name dxScrollView.toggleLoading
    * @publicName toggleLoading(showOrHide)
    * @param1 showOrHide:boolean
    * @hidden
    */
    toggleLoading: function(showOrHide) {
        this._reachBottomEnable(showOrHide);
    },

    /**
    * @name dxScrollView.isFull
    * @publicName isFull()
    * @return boolean
    * @hidden
    */
    isFull: function() {
        return $(this.content()).height() > this._$container.height();
    },

    // refresh: function() {
    //     if(!this.hasActionSubscription('onPullDown')) {
    //         return;
    //     }

    //     this._strategy.pendingRelease();
    //     this._pullDownLoading();
    // },

    // startLoading: function() {
    //     if(this._loadingIndicator() && this.$element().is(':visible')) {
    //         this._loadPanel.show();
    //     }
    //     this._lock();
    // },

    // finishLoading: function() {
    //     this._loadPanel.hide();
    //     this._unlock();
    // },

    _dispose: function() {
        this._strategy.dispose();
        this.callBase();

        if(this._loadPanel) {
            this._loadPanel.$element().remove();
        }
    }
});

registerComponent('dxScrollView', ScrollView);

export default ScrollView;
