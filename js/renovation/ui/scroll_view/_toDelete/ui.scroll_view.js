import $ from '../../core/renderer';
import { hasWindow } from '../../core/utils/window';
import registerComponent from '../../core/component_registrator';
import { getPublicElement } from '../../core/element';
import { extend } from '../../core/utils/extend';
import { noop } from '../../core/utils/common';
import PullDownStrategy from './ui.scroll_view.native.pull_down';
import SwipeDownStrategy from './ui.scroll_view.native.swipe_down';
import SimulatedStrategy from './ui.scroll_view.simulated';
import Scrollable from './ui.scrollable';
import LoadIndicator from '../load_indicator';
import LoadPanel from '../load_panel';

const SCROLLVIEW_CLASS = 'dx-scrollview';

const SCROLLVIEW_LOADPANEL = SCROLLVIEW_CLASS + '-loadpanel';

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

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onPullDown: null,
            onReachBottom: null,
        });
    },

    _init: function() {
        this.callBase();
        this._loadingIndicatorEnabled = true;
    },

    _initScrollableMarkup: function() {
        this._initBottomPocket();
        this._initLoadPanel();
    },

    _initBottomPocket: function() {
        const $loadIndicator = new LoadIndicator($('<div>')).$element();

        this._updateReachBottomText();

        // eslint-disable-next-line no-undef
        $reachBottom
            // eslint-disable-next-line no-undef
            .append($loadContainer.append($loadIndicator));
    },

    _initLoadPanel: function() {
        const $loadPanelElement = $('<div>')
            .addClass(SCROLLVIEW_LOADPANEL)
            .appendTo(this.$element());

        const loadPanelOptions = {
            shading: false,
            delay: 400,
            message: this.option('refreshingText'),
            position: {
                of: this.$element()
            }
        };

        this._loadPanel = this._createComponent($loadPanelElement, LoadPanel, loadPanelOptions);
    },

    _updateReachBottomText: function() {
        this._$reachBottomText.text(this.option('reachBottomText'));
    },

    _createStrategy: function() {
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

    _createActions: function() {
        this.callBase();
        this._pullDownAction = this._createActionByOption('onPullDown');
        this._reachBottomAction = this._createActionByOption('onReachBottom');
        this._tryRefreshPocketState();
    },

    _tryRefreshPocketState: function() {
        this._pullDownEnable(this.hasActionSubscription('onPullDown'));
        this._reachBottomEnable(this.hasActionSubscription('onReachBottom'));

    },

    on: function(eventName) {
        const result = this.callBase.apply(this, arguments);

        if(eventName === 'pullDown' || eventName === 'reachBottom') {
            this._tryRefreshPocketState();
        }

        return result;
    },

    _pullDownEnable: function(enabled) {
        if(arguments.length === 0) {
            return this._pullDownEnabled;
        }

        if(this._$pullDown && this._strategy) {
            this._$pullDown.toggle(enabled);
            this._strategy.pullDownEnable(enabled);
            this._pullDownEnabled = enabled;
        }
    },

    _reachBottomEnable: function(enabled) {
        if(arguments.length === 0) {
            return this._reachBottomEnabled;
        }

        if(this._$reachBottom && this._strategy) {
            this._$reachBottom.toggle(enabled);
            this._strategy.reachBottomEnable(enabled);
            this._reachBottomEnabled = enabled;
        }
    },

    _pullDownHandler: function() {
        this._loadingIndicator(false);
        this._pullDownLoading();
    },

    _loadingIndicator: function(value) {
        if(arguments.length < 1) {
            return this._loadingIndicatorEnabled;
        }
        this._loadingIndicatorEnabled = value;
    },

    _pullDownLoading: function() {
        this.startLoading();
        this._pullDownAction();
    },

    _reachBottomHandler: function() {
        this._loadingIndicator(false);
        this._reachBottomLoading();
    },

    _reachBottomLoading: function() {
        this.startLoading();
        this._reachBottomAction();
    },

    _releaseHandler: function() {
        this.finishLoading();
        this._loadingIndicator(true);
    },

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

    isEmpty: function() {
        return !$(this.content()).children().length;
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

    refresh: function() {
        if(!this.hasActionSubscription('onPullDown')) {
            return;
        }

        this._strategy.pendingRelease();
        this._pullDownLoading();
    },

    startLoading: function() {
        if(this._loadingIndicator() && this.$element().is(':visible')) {
            this._loadPanel.show();
        }
        this._lock();
    },

    finishLoading: function() {
        this._loadPanel.hide();
        this._unlock();
    },

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
